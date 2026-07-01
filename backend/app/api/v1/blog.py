from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.schemas.blog import BlogPostRead, BlogPostSummary, PaginatedBlogPosts
from app.services import blog_service

router = APIRouter(prefix="/blog", tags=["blog"])


@router.get("", response_model=PaginatedBlogPosts)
async def list_posts(
    tag: str | None = Query(default=None),
    search: str | None = Query(default=None),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=10, ge=1, le=50),
    db: AsyncSession = Depends(get_db),
) -> PaginatedBlogPosts:
    posts, total = await blog_service.list_published_posts(
        db, tag=tag, search=search, page=page, page_size=page_size
    )
    return PaginatedBlogPosts(
        items=[BlogPostSummary.model_validate(p) for p in posts],
        total=total,
        page=page,
        page_size=page_size,
    )


@router.get("/{slug}", response_model=BlogPostRead)
async def get_post(slug: str, db: AsyncSession = Depends(get_db)) -> BlogPostRead:
    post = await blog_service.get_published_post_by_slug(db, slug)
    if post is None:
        raise HTTPException(status_code=404, detail="Post not found")
    return BlogPostRead.model_validate(post)
