from pydantic import BaseModel, ConfigDict, Field


class TestimonialRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    author_name: str
    author_role: str | None
    author_company: str | None
    author_avatar_url: str | None
    content: str
    rating: int | None


class TestimonialAdminRead(TestimonialRead):
    is_approved: bool
    sort_order: int


class TestimonialCreate(BaseModel):
    author_name: str = Field(min_length=1, max_length=200)
    author_role: str | None = None
    author_company: str | None = None
    author_avatar_url: str | None = None
    content: str = Field(min_length=1)
    rating: int | None = Field(default=None, ge=1, le=5)
    is_approved: bool = False
    sort_order: int = 0


class TestimonialUpdate(BaseModel):
    author_name: str | None = Field(default=None, min_length=1, max_length=200)
    author_role: str | None = None
    author_company: str | None = None
    author_avatar_url: str | None = None
    content: str | None = Field(default=None, min_length=1)
    rating: int | None = Field(default=None, ge=1, le=5)
    is_approved: bool | None = None
    sort_order: int | None = None
