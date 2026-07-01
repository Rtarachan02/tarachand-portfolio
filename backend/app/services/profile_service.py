from sqlalchemy.ext.asyncio import AsyncSession

from app.models.profile import SINGLETON_ID, SiteProfile
from app.schemas.profile import ProfileUpdate


async def get_profile(db: AsyncSession) -> SiteProfile:
    profile = await db.get(SiteProfile, SINGLETON_ID)
    if profile is None:
        profile = SiteProfile(id=SINGLETON_ID)
        db.add(profile)
        await db.commit()
        await db.refresh(profile)
    return profile


async def update_profile(db: AsyncSession, data: ProfileUpdate) -> SiteProfile:
    profile = await get_profile(db)
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(profile, field, value)
    await db.commit()
    await db.refresh(profile)
    return profile
