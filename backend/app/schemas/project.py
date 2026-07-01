from datetime import date

from pydantic import BaseModel, ConfigDict

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
