from datetime import date

from pydantic import BaseModel, ConfigDict, Field


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


class ExperienceCreate(BaseModel):
    company: str = Field(min_length=1, max_length=200)
    role: str = Field(min_length=1, max_length=200)
    location: str | None = None
    employment_type: str | None = None
    description: str = ""
    highlights: list[str] = Field(default_factory=list)
    start_date: date
    end_date: date | None = None
    company_url: str | None = None
    logo_url: str | None = None
    sort_order: int = 0


class ExperienceUpdate(BaseModel):
    company: str | None = Field(default=None, min_length=1, max_length=200)
    role: str | None = Field(default=None, min_length=1, max_length=200)
    location: str | None = None
    employment_type: str | None = None
    description: str | None = None
    highlights: list[str] | None = None
    start_date: date | None = None
    end_date: date | None = None
    company_url: str | None = None
    logo_url: str | None = None
    sort_order: int | None = None
