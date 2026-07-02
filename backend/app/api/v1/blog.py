from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_admin_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.blog import (
    BlogPostAdminRead,
    BlogPostCreate,
    BlogPostRead,
    BlogPostSummary,
    BlogPostUpdate,
    PaginatedBlogPosts,
)
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


@router.get("/admin", response_model=list[BlogPostAdminRead])
async def list_all_posts(
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_current_admin_user),
) -> list[BlogPostAdminRead]:
    posts = await blog_service.list_all_posts(db)
    return [BlogPostAdminRead.model_validate(p) for p in posts]


@router.get("/{slug}", response_model=BlogPostRead)
async def get_post(slug: str, db: AsyncSession = Depends(get_db)) -> BlogPostRead:
    post = await blog_service.get_published_post_by_slug(db, slug)
    if post is None:
        raise HTTPException(status_code=404, detail="Post not found")
    return BlogPostRead.model_validate(post)


@router.post("", response_model=BlogPostAdminRead, status_code=201)
async def create_post(
    payload: BlogPostCreate,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_current_admin_user),
) -> BlogPostAdminRead:
    post = await blog_service.create_post(db, payload)
    return BlogPostAdminRead.model_validate(post)


@router.put("/{post_id}", response_model=BlogPostAdminRead)
async def update_post(
    post_id: int,
    payload: BlogPostUpdate,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_current_admin_user),
) -> BlogPostAdminRead:
    post = await blog_service.get_post_by_id(db, post_id)
    if post is None:
        raise HTTPException(status_code=404, detail="Post not found")
    post = await blog_service.update_post(db, post, payload)
    return BlogPostAdminRead.model_validate(post)


@router.delete("/{post_id}", status_code=204)
async def delete_post(
    post_id: int,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_current_admin_user),
) -> None:
    post = await blog_service.get_post_by_id(db, post_id)
    if post is None:
        raise HTTPException(status_code=404, detail="Post not found")
    await blog_service.delete_post(db, post)
