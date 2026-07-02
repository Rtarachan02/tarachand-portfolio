from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


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


class BlogPostAdminRead(BlogPostRead):
    published: bool


class PaginatedBlogPosts(BaseModel):
    items: list[BlogPostSummary]
    total: int
    page: int
    page_size: int


class BlogPostCreate(BaseModel):
    slug: str = Field(min_length=1, max_length=200)
    title: str = Field(min_length=1, max_length=250)
    excerpt: str = Field(min_length=1, max_length=500)
    content_markdown: str = Field(min_length=1)
    cover_image_url: str | None = None
    tags: list[str] = Field(default_factory=list)
    published: bool = False


class BlogPostUpdate(BaseModel):
    slug: str | None = Field(default=None, min_length=1, max_length=200)
    title: str | None = Field(default=None, min_length=1, max_length=250)
    excerpt: str | None = Field(default=None, min_length=1, max_length=500)
    content_markdown: str | None = Field(default=None, min_length=1)
    cover_image_url: str | None = None
    tags: list[str] | None = None
    published: bool | None = None
