from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.skill import Skill
from app.schemas.skill import SkillCreate, SkillUpdate


async def list_skills(db: AsyncSession) -> list[Skill]:
    stmt = select(Skill).order_by(Skill.category, Skill.sort_order)
    result = await db.execute(stmt)
    return list(result.scalars().all())


async def get_skill_by_id(db: AsyncSession, skill_id: int) -> Skill | None:
    return await db.get(Skill, skill_id)


async def create_skill(db: AsyncSession, data: SkillCreate) -> Skill:
    skill = Skill(**data.model_dump())
    db.add(skill)
    await db.commit()
    await db.refresh(skill)
    return skill


async def update_skill(db: AsyncSession, skill: Skill, data: SkillUpdate) -> Skill:
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(skill, field, value)
    await db.commit()
    await db.refresh(skill)
    return skill


async def delete_skill(db: AsyncSession, skill: Skill) -> None:
    await db.delete(skill)
    await db.commit()
