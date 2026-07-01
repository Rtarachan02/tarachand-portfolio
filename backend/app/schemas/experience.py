from datetime import date

from pydantic import BaseModel, ConfigDict


class ExperienceRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    company: str
    role: str
    location: str | None
    employment_type: str | None
    description: str
    highlights: list[str]
    start_date: date
    end_date: date | None
    company_url: str | None
    logo_url: str | None
