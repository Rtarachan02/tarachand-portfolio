from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_admin_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.skill import SkillCreate, SkillRead, SkillUpdate
from app.services import skill_service

router = APIRouter(prefix="/skills", tags=["skills"])


@router.get("", response_model=list[SkillRead])
async def list_skills(db: AsyncSession = Depends(get_db)) -> list[SkillRead]:
    skills = await skill_service.list_skills(db)
    return [SkillRead.model_validate(s) for s in skills]


@router.post("", response_model=SkillRead, status_code=201)
async def create_skill(
    payload: SkillCreate,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_current_admin_user),
) -> SkillRead:
    skill = await skill_service.create_skill(db, payload)
    return SkillRead.model_validate(skill)


@router.put("/{skill_id}", response_model=SkillRead)
async def update_skill(
    skill_id: int,
    payload: SkillUpdate,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_current_admin_user),
) -> SkillRead:
    skill = await skill_service.get_skill_by_id(db, skill_id)
    if skill is None:
        raise HTTPException(status_code=404, detail="Skill not found")
    skill = await skill_service.update_skill(db, skill, payload)
    return SkillRead.model_validate(skill)


@router.delete("/{skill_id}", status_code=204)
async def delete_skill(
    skill_id: int,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_current_admin_user),
) -> None:
    skill = await skill_service.get_skill_by_id(db, skill_id)
    if skill is None:
        raise HTTPException(status_code=404, detail="Skill not found")
    await skill_service.delete_skill(db, skill)
