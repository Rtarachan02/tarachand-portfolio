from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.certification import Certification


async def list_certifications(db: AsyncSession) -> list[Certification]:
    stmt = select(Certification).order_by(Certification.sort_order, Certification.issue_date.desc())
    result = await db.execute(stmt)
    return list(result.scalars().all())
