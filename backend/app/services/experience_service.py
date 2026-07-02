from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.experience import Experience
from app.schemas.experience import ExperienceCreate, ExperienceUpdate


async def list_experience(db: AsyncSession) -> list[Experience]:
    stmt = select(Experience).order_by(Experience.sort_order, Experience.start_date.desc())
    result = await db.execute(stmt)
    return list(result.scalars().all())


async def get_experience_by_id(db: AsyncSession, experience_id: int) -> Experience | None:
    return await db.get(Experience, experience_id)


async def create_experience(db: AsyncSession, data: ExperienceCreate) -> Experience:
    experience = Experience(**data.model_dump())
    db.add(experience)
    await db.commit()
    await db.refresh(experience)
    return experience


async def update_experience(
    db: AsyncSession, experience: Experience, data: ExperienceUpdate
) -> Experience:
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(experience, field, value)
    await db.commit()
    await db.refresh(experience)
    return experience


async def delete_experience(db: AsyncSession, experience: Experience) -> None:
    await db.delete(experience)
    await db.commit()
