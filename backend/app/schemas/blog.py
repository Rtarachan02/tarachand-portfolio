from datetime import datetime

from pydantic import BaseModel, ConfigDict


class BlogPostSummary(BaseModel):
    """Lightweight shape used for list views (no full markdown body)."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    slug: str
    title: str
    excerpt: str
    cover_image_url: str | None
    tags: list[str]
    published_at: datetime | None
    reading_time_minutes: int
    views_count: int


class BlogPostRead(BlogPostSummary):
    content_markdown: str


class PaginatedBlogPosts(BaseModel):
    items: list[BlogPostSummary]
    total: int
    page: int
    page_size: int
