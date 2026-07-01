from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.schemas.certification import CertificationRead
from app.services import certification_service

router = APIRouter(prefix="/certifications", tags=["certifications"])


@router.get("", response_model=list[CertificationRead])
async def list_certifications(db: AsyncSession = Depends(get_db)) -> list[CertificationRead]:
    certifications = await certification_service.list_certifications(db)
    return [CertificationRead.model_validate(c) for c in certifications]
