from sqlalchemy.ext.asyncio import AsyncSession

from app.models.contact import ContactMessage
from app.schemas.contact import ContactMessageCreate


async def create_contact_message(
    db: AsyncSession, data: ContactMessageCreate, ip_hash: str | None
) -> ContactMessage:
    message = ContactMessage(
        name=data.name,
        email=data.email,
        subject=data.subject,
        message=data.message,
        ip_hash=ip_hash,
    )
    db.add(message)
    await db.commit()
    await db.refresh(message)
    return message
