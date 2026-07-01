from datetime import date

from pydantic import BaseModel, ConfigDict, Field

from app.models.project import ProjectCategory


class ProjectRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    slug: str
    title: str
    summary: str
    description: str
    category: ProjectCategory
    tech_stack: list[str]
    repo_url: str | None
    live_url: str | None
    image_url: str | None
    featured: bool
    start_date: date | None
    end_date: date | None


class ProjectCreate(BaseModel):
    slug: str = Field(min_length=1, max_length=160)
    title: str = Field(min_length=1, max_length=200)
    summary: str = Field(min_length=1, max_length=500)
    description: str = ""
    category: ProjectCategory
    tech_stack: list[str] = Field(default_factory=list)
    repo_url: str | None = None
    live_url: str | None = None
    image_url: str | None = None
    featured: bool = False
    start_date: date | None = None
    end_date: date | None = None
    sort_order: int = 0


class ProjectUpdate(BaseModel):
    slug: str | None = Field(default=None, min_length=1, max_length=160)
    title: str | None = Field(default=None, min_length=1, max_length=200)
    summary: str | None = Field(default=None, min_length=1, max_length=500)
    description: str | None = None
    category: ProjectCategory | None = None
    tech_stack: list[str] | None = None
    repo_url: str | None = None
    live_url: str | None = None
    image_url: str | None = None
    featured: bool | None = None
    start_date: date | None = None
    end_date: date | None = None
    sort_order: int | None = None
