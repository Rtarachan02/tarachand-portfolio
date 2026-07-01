from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.experience import Experience


async def list_experience(db: AsyncSession) -> list[Experience]:
    stmt = select(Experience).order_by(Experience.sort_order, Experience.start_date.desc())
    result = await db.execute(stmt)
    return list(result.scalars().all())
