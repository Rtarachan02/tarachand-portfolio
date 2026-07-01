from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.testimonial import Testimonial
from app.schemas.testimonial import TestimonialCreate, TestimonialUpdate


async def list_approved_testimonials(db: AsyncSession) -> list[Testimonial]:
    stmt = (
        select(Testimonial)
        .where(Testimonial.is_approved.is_(True))
        .order_by(Testimonial.sort_order)
    )
    result = await db.execute(stmt)
    return list(result.scalars().all())


async def list_all_testimonials(db: AsyncSession) -> list[Testimonial]:
    stmt = select(Testimonial).order_by(Testimonial.sort_order)
    result = await db.execute(stmt)
    return list(result.scalars().all())


async def get_testimonial_by_id(db: AsyncSession, testimonial_id: int) -> Testimonial | None:
    return await db.get(Testimonial, testimonial_id)


async def create_testimonial(db: AsyncSession, data: TestimonialCreate) -> Testimonial:
    testimonial = Testimonial(**data.model_dump())
    db.add(testimonial)
    await db.commit()
    await db.refresh(testimonial)
    return testimonial


async def update_testimonial(
    db: AsyncSession, testimonial: Testimonial, data: TestimonialUpdate
) -> Testimonial:
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(testimonial, field, value)
    await db.commit()
    await db.refresh(testimonial)
    return testimonial


async def delete_testimonial(db: AsyncSession, testimonial: Testimonial) -> None:
    await db.delete(testimonial)
    await db.commit()
