from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.project import Project, ProjectCategory
from app.schemas.project import ProjectCreate, ProjectUpdate


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


async def get_project_by_id(db: AsyncSession, project_id: int) -> Project | None:
    return await db.get(Project, project_id)


async def create_project(db: AsyncSession, data: ProjectCreate) -> Project:
    project = Project(**data.model_dump())
    db.add(project)
    await db.commit()
    await db.refresh(project)
    return project


async def update_project(db: AsyncSession, project: Project, data: ProjectUpdate) -> Project:
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(project, field, value)
    await db.commit()
    await db.refresh(project)
    return project


async def delete_project(db: AsyncSession, project: Project) -> None:
    await db.delete(project)
    await db.commit()
