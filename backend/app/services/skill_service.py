from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.skill import Skill


async def list_skills(db: AsyncSession) -> list[Skill]:
    stmt = select(Skill).order_by(Skill.category, Skill.sort_order)
    result = await db.execute(stmt)
    return list(result.scalars().all())
