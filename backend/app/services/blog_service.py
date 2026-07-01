from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.blog import BlogPost


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
