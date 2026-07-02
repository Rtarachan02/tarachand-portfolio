import math
from datetime import UTC, datetime

from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.blog import BlogPost
from app.schemas.blog import BlogPostCreate, BlogPostUpdate

WORDS_PER_MINUTE = 200


def _reading_time_minutes(content_markdown: str) -> int:
    word_count = len(content_markdown.split())
    return max(1, math.ceil(word_count / WORDS_PER_MINUTE))


async def list_published_posts(
    db: AsyncSession,
    tag: str | None = None,
    search: str | None = None,
    page: int = 1,
    page_size: int = 10,
) -> tuple[list[BlogPost], int]:
    stmt = select(BlogPost).where(BlogPost.published.is_(True))
    count_stmt = select(func.count()).select_from(BlogPost).where(BlogPost.published.is_(True))

    if tag:
        stmt = stmt.where(BlogPost.tags.any(tag))
        count_stmt = count_stmt.where(BlogPost.tags.any(tag))
    if search:
        pattern = f"%{search}%"
        search_filter = or_(BlogPost.title.ilike(pattern), BlogPost.excerpt.ilike(pattern))
        stmt = stmt.where(search_filter)
        count_stmt = count_stmt.where(search_filter)

    stmt = (
        stmt.order_by(BlogPost.published_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    )

    total = (await db.execute(count_stmt)).scalar_one()
    posts = list((await db.execute(stmt)).scalars().all())
    return posts, total


async def get_published_post_by_slug(db: AsyncSession, slug: str) -> BlogPost | None:
    stmt = select(BlogPost).where(BlogPost.slug == slug, BlogPost.published.is_(True))
    result = await db.execute(stmt)
    post = result.scalar_one_or_none()
    if post is not None:
        post.views_count += 1
        await db.commit()
        await db.refresh(post)
    return post


async def list_all_posts(db: AsyncSession) -> list[BlogPost]:
    stmt = select(BlogPost).order_by(BlogPost.created_at.desc())
    result = await db.execute(stmt)
    return list(result.scalars().all())


async def get_post_by_id(db: AsyncSession, post_id: int) -> BlogPost | None:
    return await db.get(BlogPost, post_id)


async def create_post(db: AsyncSession, data: BlogPostCreate) -> BlogPost:
    post = BlogPost(
        **data.model_dump(),
        reading_time_minutes=_reading_time_minutes(data.content_markdown),
        published_at=datetime.now(UTC) if data.published else None,
    )
    db.add(post)
    await db.commit()
    await db.refresh(post)
    return post


async def update_post(db: AsyncSession, post: BlogPost, data: BlogPostUpdate) -> BlogPost:
    updates = data.model_dump(exclude_unset=True)
    for field, value in updates.items():
        setattr(post, field, value)

    if "content_markdown" in updates:
        post.reading_time_minutes = _reading_time_minutes(post.content_markdown)
    if updates.get("published") and post.published_at is None:
        post.published_at = datetime.now(UTC)

    await db.commit()
    await db.refresh(post)
    return post


async def delete_post(db: AsyncSession, post: BlogPost) -> None:
    await db.delete(post)
    await db.commit()
