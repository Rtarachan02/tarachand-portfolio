from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_admin_user
from app.db.session import get_db
from app.models.project import ProjectCategory
from app.models.user import User
from app.schemas.project import ProjectCreate, ProjectRead, ProjectUpdate
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


@router.post("", response_model=ProjectRead, status_code=201)
async def create_project(
    payload: ProjectCreate,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_current_admin_user),
) -> ProjectRead:
    project = await project_service.create_project(db, payload)
    return ProjectRead.model_validate(project)


@router.put("/{project_id}", response_model=ProjectRead)
async def update_project(
    project_id: int,
    payload: ProjectUpdate,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_current_admin_user),
) -> ProjectRead:
    project = await project_service.get_project_by_id(db, project_id)
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    project = await project_service.update_project(db, project, payload)
    return ProjectRead.model_validate(project)


@router.delete("/{project_id}", status_code=204)
async def delete_project(
    project_id: int,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_current_admin_user),
) -> None:
    project = await project_service.get_project_by_id(db, project_id)
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    await project_service.delete_project(db, project)
