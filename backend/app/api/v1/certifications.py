from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_admin_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.certification import CertificationCreate, CertificationRead, CertificationUpdate
from app.services import certification_service

router = APIRouter(prefix="/certifications", tags=["certifications"])


@router.get("", response_model=list[CertificationRead])
async def list_certifications(db: AsyncSession = Depends(get_db)) -> list[CertificationRead]:
    certifications = await certification_service.list_certifications(db)
    return [CertificationRead.model_validate(c) for c in certifications]


@router.post("", response_model=CertificationRead, status_code=201)
async def create_certification(
    payload: CertificationCreate,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_current_admin_user),
) -> CertificationRead:
    certification = await certification_service.create_certification(db, payload)
    return CertificationRead.model_validate(certification)


@router.put("/{certification_id}", response_model=CertificationRead)
async def update_certification(
    certification_id: int,
    payload: CertificationUpdate,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_current_admin_user),
) -> CertificationRead:
    certification = await certification_service.get_certification_by_id(db, certification_id)
    if certification is None:
        raise HTTPException(status_code=404, detail="Certification not found")
    certification = await certification_service.update_certification(db, certification, payload)
    return CertificationRead.model_validate(certification)


@router.delete("/{certification_id}", status_code=204)
async def delete_certification(
    certification_id: int,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_current_admin_user),
) -> None:
    certification = await certification_service.get_certification_by_id(db, certification_id)
    if certification is None:
        raise HTTPException(status_code=404, detail="Certification not found")
    await certification_service.delete_certification(db, certification)
