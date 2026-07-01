from pydantic import BaseModel, ConfigDict


class TestimonialRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    author_name: str
    author_role: str | None
    author_company: str | None
    author_avatar_url: str | None
    content: str
    rating: int | None
