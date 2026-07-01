from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.schemas.skill import SkillRead
from app.services import skill_service

router = APIRouter(prefix="/skills", tags=["skills"])


@router.get("", response_model=list[SkillRead])
async def list_skills(db: AsyncSession = Depends(get_db)) -> list[SkillRead]:
    skills = await skill_service.list_skills(db)
    return [SkillRead.model_validate(s) for s in skills]
