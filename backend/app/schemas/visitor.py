from pydantic import BaseModel, Field


class PageviewCreate(BaseModel):
    path: str = Field(min_length=1, max_length=500)
    referrer: str | None = Field(default=None, max_length=500)
