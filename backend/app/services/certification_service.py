from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.certification import Certification
from app.schemas.certification import CertificationCreate, CertificationUpdate


async def list_certifications(db: AsyncSession) -> list[Certification]:
    stmt = select(Certification).order_by(
        Certification.sort_order, Certification.issue_date.desc()
    )
    result = await db.execute(stmt)
    return list(result.scalars().all())


async def get_certification_by_id(db: AsyncSession, certification_id: int) -> Certification | None:
    return await db.get(Certification, certification_id)


async def create_certification(db: AsyncSession, data: CertificationCreate) -> Certification:
    certification = Certification(**data.model_dump())
    db.add(certification)
    await db.commit()
    await db.refresh(certification)
    return certification


async def update_certification(
    db: AsyncSession, certification: Certification, data: CertificationUpdate
) -> Certification:
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(certification, field, value)
    await db.commit()
    await db.refresh(certification)
    return certification


async def delete_certification(db: AsyncSession, certification: Certification) -> None:
    await db.delete(certification)
    await db.commit()
