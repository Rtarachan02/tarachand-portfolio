from sqlalchemy import select
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


async def list_contact_messages(db: AsyncSession) -> list[ContactMessage]:
    stmt = select(ContactMessage).order_by(ContactMessage.created_at.desc())
    result = await db.execute(stmt)
    return list(result.scalars().all())


async def get_contact_message_by_id(db: AsyncSession, message_id: int) -> ContactMessage | None:
    return await db.get(ContactMessage, message_id)


async def mark_contact_message_read(db: AsyncSession, message: ContactMessage) -> ContactMessage:
    message.is_read = True
    await db.commit()
    await db.refresh(message)
    return message
