from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.testimonial import Testimonial


async def list_approved_testimonials(db: AsyncSession) -> list[Testimonial]:
    stmt = (
        select(Testimonial)
        .where(Testimonial.is_approved.is_(True))
        .order_by(Testimonial.sort_order)
    )
    result = await db.execute(stmt)
    return list(result.scalars().all())
