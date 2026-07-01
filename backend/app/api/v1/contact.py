from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_client_ip, get_current_admin_user
from app.core.limiter import limiter
from app.core.security import hash_ip
from app.db.session import get_db
from app.models.user import User
from app.schemas.contact import ContactMessageAdminRead, ContactMessageCreate, ContactMessageRead
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


@router.get("/admin", response_model=list[ContactMessageAdminRead])
async def list_contact_messages(
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_current_admin_user),
) -> list[ContactMessageAdminRead]:
    messages = await contact_service.list_contact_messages(db)
    return [ContactMessageAdminRead.model_validate(m) for m in messages]


@router.patch("/admin/{message_id}/read", response_model=ContactMessageAdminRead)
async def mark_contact_message_read(
    message_id: int,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_current_admin_user),
) -> ContactMessageAdminRead:
    message = await contact_service.get_contact_message_by_id(db, message_id)
    if message is None:
        raise HTTPException(status_code=404, detail="Message not found")
    message = await contact_service.mark_contact_message_read(db, message)
    return ContactMessageAdminRead.model_validate(message)
