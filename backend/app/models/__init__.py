"""SQLAlchemy models. Imported here so Base.metadata is fully populated for Alembic."""

from app.models.blog import BlogPost
from app.models.certification import Certification
from app.models.contact import ContactMessage
from app.models.experience import Experience
from app.models.project import Project, ProjectCategory
from app.models.resume import Resume
from app.models.skill import Skill, SkillCategory
from app.models.testimonial import Testimonial
from app.models.visitor import Visitor

__all__ = [
    "BlogPost",
    "Certification",
    "ContactMessage",
    "Experience",
    "Project",
    "ProjectCategory",
    "Resume",
    "Skill",
    "SkillCategory",
    "Testimonial",
    "Visitor",
]
