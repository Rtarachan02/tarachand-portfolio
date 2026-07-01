from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_admin_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.testimonial import (
    TestimonialAdminRead,
    TestimonialCreate,
    TestimonialRead,
    TestimonialUpdate,
)
from app.services import testimonial_service

router = APIRouter(prefix="/testimonials", tags=["testimonials"])


@router.get("", response_model=list[TestimonialRead])
async def list_testimonials(db: AsyncSession = Depends(get_db)) -> list[TestimonialRead]:
    testimonials = await testimonial_service.list_approved_testimonials(db)
    return [TestimonialRead.model_validate(t) for t in testimonials]


@router.get("/admin", response_model=list[TestimonialAdminRead])
async def list_all_testimonials(
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_current_admin_user),
) -> list[TestimonialAdminRead]:
    testimonials = await testimonial_service.list_all_testimonials(db)
    return [TestimonialAdminRead.model_validate(t) for t in testimonials]


@router.post("", response_model=TestimonialAdminRead, status_code=201)
async def create_testimonial(
    payload: TestimonialCreate,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_current_admin_user),
) -> TestimonialAdminRead:
    testimonial = await testimonial_service.create_testimonial(db, payload)
    return TestimonialAdminRead.model_validate(testimonial)


@router.put("/{testimonial_id}", response_model=TestimonialAdminRead)
async def update_testimonial(
    testimonial_id: int,
    payload: TestimonialUpdate,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_current_admin_user),
) -> TestimonialAdminRead:
    testimonial = await testimonial_service.get_testimonial_by_id(db, testimonial_id)
    if testimonial is None:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    testimonial = await testimonial_service.update_testimonial(db, testimonial, payload)
    return TestimonialAdminRead.model_validate(testimonial)


@router.delete("/{testimonial_id}", status_code=204)
async def delete_testimonial(
    testimonial_id: int,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_current_admin_user),
) -> None:
    testimonial = await testimonial_service.get_testimonial_by_id(db, testimonial_id)
    if testimonial is None:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    await testimonial_service.delete_testimonial(db, testimonial)
