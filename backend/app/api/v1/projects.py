from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.project import ProjectCategory
from app.schemas.project import ProjectRead
from app.services import project_service

router = APIRouter(prefix="/projects", tags=["projects"])


@router.get("", response_model=list[ProjectRead])
async def list_projects(
    category: ProjectCategory | None = Query(default=None),
    featured: bool = Query(default=False),
    db: AsyncSession = Depends(get_db),
) -> list[ProjectRead]:
    projects = await project_service.list_projects(db, category=category, featured_only=featured)
    return [ProjectRead.model_validate(p) for p in projects]


@router.get("/{slug}", response_model=ProjectRead)
async def get_project(slug: str, db: AsyncSession = Depends(get_db)) -> ProjectRead:
    project = await project_service.get_project_by_slug(db, slug)
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return ProjectRead.model_validate(project)
