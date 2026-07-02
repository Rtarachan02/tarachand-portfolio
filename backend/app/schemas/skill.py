from pydantic import BaseModel, ConfigDict, Field

from app.models.skill import SkillCategory


class SkillRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    category: SkillCategory
    proficiency: int
    icon: str | None


class SkillCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    category: SkillCategory
    proficiency: int = Field(default=3, ge=1, le=5)
    icon: str | None = None
    sort_order: int = 0


class SkillUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=100)
    category: SkillCategory | None = None
    proficiency: int | None = Field(default=None, ge=1, le=5)
    icon: str | None = None
    sort_order: int | None = None
