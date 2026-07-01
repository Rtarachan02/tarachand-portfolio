from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_client_ip
from app.core.limiter import limiter
from app.core.security import hash_ip
from app.db.session import get_db
from app.schemas.contact import ContactMessageCreate, ContactMessageRead
from app.services import contact_service

router = APIRouter(prefix="/contact", tags=["contact"])


@router.post("", response_model=ContactMessageRead, status_code=201)
@limiter.limit("5/minute")
async def submit_contact_message(
    request: Request,
    payload: ContactMessageCreate,
    db: AsyncSession = Depends(get_db),
) -> ContactMessageRead:
    ip_hash = hash_ip(get_client_ip(request))
    message = await contact_service.create_contact_message(db, payload, ip_hash)
    return ContactMessageRead.model_validate(message)
