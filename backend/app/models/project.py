"""Portfolio project showcase entries."""

import enum
from datetime import date

from sqlalchemy import ARRAY, Boolean, Date, Enum, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from app.models.mixins import TimestampMixin


class ProjectCategory(str, enum.Enum):
    embedded = "embedded"
    backend = "backend"
    ai_ml = "ai_ml"
    frontend = "frontend"
    other = "other"


class Project(TimestampMixin, Base):
    __tablename__ = "projects"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    slug: Mapped[str] = mapped_column(String(160), unique=True, index=True, nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    summary: Mapped[str] = mapped_column(String(500), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False, default="")
    category: Mapped[ProjectCategory] = mapped_column(
        Enum(ProjectCategory, name="project_category"), nullable=False
    )
    tech_stack: Mapped[list[str]] = mapped_column(ARRAY(String), nullable=False, default=list)
    repo_url: Mapped[str | None] = mapped_column(String(500))
    live_url: Mapped[str | None] = mapped_column(String(500))
    image_url: Mapped[str | None] = mapped_column(String(500))
    featured: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    start_date: Mapped[date | None] = mapped_column(Date)
    end_date: Mapped[date | None] = mapped_column(Date)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
