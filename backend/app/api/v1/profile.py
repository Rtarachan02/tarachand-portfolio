from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_admin_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.profile import ProfileRead, ProfileUpdate
from app.services import profile_service

router = APIRouter(prefix="/profile", tags=["profile"])


@router.get("", response_model=ProfileRead)
async def get_profile(db: AsyncSession = Depends(get_db)) -> ProfileRead:
    profile = await profile_service.get_profile(db)
    return ProfileRead.model_validate(profile)


@router.put("", response_model=ProfileRead)
async def update_profile(
    payload: ProfileUpdate,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_current_admin_user),
) -> ProfileRead:
    profile = await profile_service.update_profile(db, payload)
    return ProfileRead.model_validate(profile)
