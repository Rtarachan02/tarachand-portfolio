from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.project import Project, ProjectCategory


async def list_projects(
    db: AsyncSession,
    category: ProjectCategory | None = None,
    featured_only: bool = False,
) -> list[Project]:
    stmt = select(Project).order_by(Project.sort_order, Project.start_date.desc())
    if category is not None:
        stmt = stmt.where(Project.category == category)
    if featured_only:
        stmt = stmt.where(Project.featured.is_(True))
    result = await db.execute(stmt)
    return list(result.scalars().all())


async def get_project_by_slug(db: AsyncSession, slug: str) -> Project | None:
    stmt = select(Project).where(Project.slug == slug)
    result = await db.execute(stmt)
    return result.scalar_one_or_none()
