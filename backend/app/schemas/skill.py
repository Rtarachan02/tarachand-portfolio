from pydantic import BaseModel, ConfigDict

from app.models.skill import SkillCategory


class SkillRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    category: SkillCategory
    proficiency: int
    icon: str | None
