from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_admin_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.experience import ExperienceCreate, ExperienceRead, ExperienceUpdate
from app.services import experience_service

router = APIRouter(prefix="/experience", tags=["experience"])


@router.get("", response_model=list[ExperienceRead])
async def list_experience(db: AsyncSession = Depends(get_db)) -> list[ExperienceRead]:
    experience = await experience_service.list_experience(db)
    return [ExperienceRead.model_validate(e) for e in experience]


@router.post("", response_model=ExperienceRead, status_code=201)
async def create_experience(
    payload: ExperienceCreate,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_current_admin_user),
) -> ExperienceRead:
    experience = await experience_service.create_experience(db, payload)
    return ExperienceRead.model_validate(experience)


@router.put("/{experience_id}", response_model=ExperienceRead)
async def update_experience(
    experience_id: int,
    payload: ExperienceUpdate,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_current_admin_user),
) -> ExperienceRead:
    experience = await experience_service.get_experience_by_id(db, experience_id)
    if experience is None:
        raise HTTPException(status_code=404, detail="Experience entry not found")
    experience = await experience_service.update_experience(db, experience, payload)
    return ExperienceRead.model_validate(experience)


@router.delete("/{experience_id}", status_code=204)
async def delete_experience(
    experience_id: int,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_current_admin_user),
) -> None:
    experience = await experience_service.get_experience_by_id(db, experience_id)
    if experience is None:
        raise HTTPException(status_code=404, detail="Experience entry not found")
    await experience_service.delete_experience(db, experience)
