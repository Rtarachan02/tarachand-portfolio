from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.schemas.testimonial import TestimonialRead
from app.services import testimonial_service

router = APIRouter(prefix="/testimonials", tags=["testimonials"])


@router.get("", response_model=list[TestimonialRead])
async def list_testimonials(db: AsyncSession = Depends(get_db)) -> list[TestimonialRead]:
    testimonials = await testimonial_service.list_approved_testimonials(db)
    return [TestimonialRead.model_validate(t) for t in testimonials]
