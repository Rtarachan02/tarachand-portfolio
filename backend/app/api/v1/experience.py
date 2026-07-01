from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.schemas.experience import ExperienceRead
from app.services import experience_service

router = APIRouter(prefix="/experience", tags=["experience"])


@router.get("", response_model=list[ExperienceRead])
async def list_experience(db: AsyncSession = Depends(get_db)) -> list[ExperienceRead]:
    experience = await experience_service.list_experience(db)
    return [ExperienceRead.model_validate(e) for e in experience]
