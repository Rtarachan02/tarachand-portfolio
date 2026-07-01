from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.visitor import Visitor
from app.schemas.visitor import PageviewCreate


async def record_pageview(
    db: AsyncSession, data: PageviewCreate, ip_hash: str | None, user_agent: str | None
) -> Visitor:
    visitor = Visitor(
        path=data.path,
        referrer=data.referrer,
        ip_hash=ip_hash,
        user_agent=user_agent,
    )
    db.add(visitor)
    await db.commit()
    await db.refresh(visitor)
    return visitor


async def get_analytics_summary(db: AsyncSession, top_paths_limit: int = 10) -> dict:
    total_pageviews = (await db.execute(select(func.count()).select_from(Visitor))).scalar_one()

    unique_visitors = (
        await db.execute(select(func.count(func.distinct(Visitor.ip_hash))))
    ).scalar_one()

    top_paths_stmt = (
        select(Visitor.path, func.count().label("count"))
        .group_by(Visitor.path)
        .order_by(func.count().desc())
        .limit(top_paths_limit)
    )
    top_paths = [
        {"path": path, "count": count}
        for path, count in (await db.execute(top_paths_stmt)).all()
    ]

    return {
        "total_pageviews": total_pageviews,
        "unique_visitors": unique_visitors,
        "top_paths": top_paths,
    }
