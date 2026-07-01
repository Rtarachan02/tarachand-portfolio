"""Technical skills matrix."""

import enum

from sqlalchemy import Enum, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class SkillCategory(str, enum.Enum):
    embedded = "embedded"
    backend = "backend"
    ai_ml = "ai_ml"
    frontend = "frontend"
    languages = "languages"
    tools = "tools"


class Skill(Base):
    __tablename__ = "skills"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    category: Mapped[SkillCategory] = mapped_column(
        Enum(SkillCategory, name="skill_category"), nullable=False
    )
    proficiency: Mapped[int] = mapped_column(Integer, nullable=False, default=3)  # 1-5
    icon: Mapped[str | None] = mapped_column(String(100))
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
