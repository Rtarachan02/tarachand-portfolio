"""One-off local seed script — inserts realistic placeholder rows so the API/UI
have real data to render during development. Safe to re-run (idempotent per slug/name).

Usage: python scripts/seed.py   (run from backend/, with the venv active)
"""

import asyncio
from datetime import UTC, date, datetime

from sqlalchemy import select

from app.db.session import AsyncSessionLocal
from app.models.blog import BlogPost
from app.models.certification import Certification
from app.models.experience import Experience
from app.models.project import Project, ProjectCategory
from app.models.skill import Skill, SkillCategory
from app.models.testimonial import Testimonial

PROJECTS = [
    dict(
        slug="fpga-daq-pipeline",
        title="High-Speed FPGA Data Acquisition Pipeline",
        summary="Dual-core synchronized DAQ system streaming sensor data over DMA at 200 MS/s.",
        description=(
            "Designed a producer-consumer pipeline between an FPGA fabric and an ARM "
            "Cortex-A core using DMA-backed circular buffers, achieving sustained "
            "200 MS/s throughput with zero-copy transfers into userspace."
        ),
        category=ProjectCategory.embedded,
        tech_stack=["Xilinx SDK", "ARM", "Linux Device Drivers", "DMA", "C"],
        repo_url=None,
        live_url=None,
        image_url=None,
        featured=True,
        start_date=date(2025, 1, 10),
        end_date=date(2025, 6, 30),
        sort_order=1,
    ),
    dict(
        slug="portfolio-platform-api",
        title="Portfolio Platform API",
        summary="FastAPI + PostgreSQL backend powering this very site.",
        description=(
            "Async FastAPI service with SQLAlchemy 2.x, Alembic migrations, JWT/OAuth "
            "auth, Redis caching, and rate-limited public endpoints for a content-driven "
            "portfolio site."
        ),
        category=ProjectCategory.backend,
        tech_stack=["FastAPI", "PostgreSQL", "SQLAlchemy", "Redis", "Docker"],
        repo_url=None,
        live_url=None,
        image_url=None,
        featured=True,
        start_date=date(2026, 7, 1),
        end_date=None,
        sort_order=2,
    ),
    dict(
        slug="vision-defect-detector",
        title="Real-Time Visual Defect Detector",
        summary="CNN-based inline defect classifier deployed at the edge.",
        description=(
            "Trained a lightweight CNN for real-time defect classification on "
            "production-line camera feeds, quantized and deployed to an edge device "
            "with sub-15ms inference latency."
        ),
        category=ProjectCategory.ai_ml,
        tech_stack=["PyTorch", "OpenCV", "ONNX Runtime", "Python"],
        repo_url=None,
        live_url=None,
        image_url=None,
        featured=True,
        start_date=date(2024, 8, 1),
        end_date=date(2024, 12, 15),
        sort_order=3,
    ),
]

SKILLS = [
    dict(name="Embedded C", category=SkillCategory.embedded, proficiency=5, sort_order=1),
    dict(name="ARM Architecture", category=SkillCategory.embedded, proficiency=5, sort_order=2),
    dict(name="RTOS", category=SkillCategory.embedded, proficiency=4, sort_order=3),
    dict(name="Xilinx SDK", category=SkillCategory.embedded, proficiency=4, sort_order=4),
    dict(name="FastAPI", category=SkillCategory.backend, proficiency=5, sort_order=1),
    dict(name="PostgreSQL", category=SkillCategory.backend, proficiency=4, sort_order=2),
    dict(name="Docker", category=SkillCategory.backend, proficiency=4, sort_order=3),
    dict(name="PyTorch", category=SkillCategory.ai_ml, proficiency=4, sort_order=1),
    dict(name="Computer Vision", category=SkillCategory.ai_ml, proficiency=4, sort_order=2),
    dict(name="React", category=SkillCategory.frontend, proficiency=4, sort_order=1),
    dict(name="TypeScript", category=SkillCategory.languages, proficiency=4, sort_order=1),
    dict(name="Python", category=SkillCategory.languages, proficiency=5, sort_order=2),
    dict(name="Git", category=SkillCategory.tools, proficiency=5, sort_order=1),
]

EXPERIENCE = [
    dict(
        company="Placeholder Systems Inc.",
        role="Embedded Software Engineer",
        location="Remote",
        employment_type="Full-time",
        description=(
            "Built high-speed data acquisition firmware and Linux drivers for "
            "industrial sensing hardware."
        ),
        highlights=[
            "Cut DAQ latency by 40% via a redesigned DMA circular-buffer scheme",
            "Wrote and upstreamed a Linux kernel driver for a custom SPI sensor",
        ],
        start_date=date(2023, 3, 1),
        end_date=None,
        company_url=None,
        logo_url=None,
        sort_order=1,
    ),
]

CERTIFICATIONS = [
    dict(
        name="Placeholder Embedded Systems Certification",
        issuer="Placeholder Institute",
        issue_date=date(2023, 5, 1),
        expiry_date=None,
        credential_id=None,
        credential_url=None,
        image_url=None,
        sort_order=1,
    ),
]

BLOG_POSTS = [
    dict(
        slug="dma-circular-buffers-explained",
        title="DMA Circular Buffers, Explained",
        excerpt=(
            "How zero-copy circular buffers keep a 200 MS/s DAQ pipeline from "
            "dropping samples."
        ),
        content_markdown=(
            "# DMA Circular Buffers\n\n"
            "A circular (ring) buffer lets a DMA controller and a CPU-side consumer "
            "share a fixed block of memory without a copy, as long as both sides "
            "agree on where the *write* and *read* pointers are.\n\n"
            "## Why not a plain queue?\n\n"
            "A linked-list queue means an allocation per sample — at 200 MS/s that's "
            "not survivable. A ring buffer is:\n\n"
            "- **Fixed size**, allocated once at startup\n"
            "- **Lock-free** for the single-producer/single-consumer case\n"
            "- **Cache-friendly**, since both pointers walk the same contiguous block\n\n"
            "## Minimal implementation\n\n"
            "```c\n"
            "typedef struct {\n"
            "    volatile uint32_t head;  // producer writes here\n"
            "    volatile uint32_t tail;  // consumer reads here\n"
            "    uint8_t *buf;\n"
            "    uint32_t capacity;       // power of two\n"
            "} ring_buffer_t;\n\n"
            "static inline uint32_t rb_free_space(ring_buffer_t *rb) {\n"
            "    return rb->capacity - (rb->head - rb->tail);\n"
            "}\n"
            "```\n\n"
            "The DMA engine advances `head` after each burst; the consumer thread "
            "advances `tail` after it drains a chunk. Neither side needs a lock as "
            "long as `capacity` is a power of two and the subtraction wraps naturally "
            "on unsigned overflow.\n\n"
            "> In the FPGA DAQ pipeline this scheme replaced, a mutex-protected queue "
            "was dropping ~0.3% of samples under load. The ring buffer dropped none."
        ),
        cover_image_url=None,
        tags=["embedded", "dma", "linux"],
        published=True,
        published_at=datetime(2026, 6, 1, tzinfo=UTC),
        views_count=0,
        reading_time_minutes=6,
    ),
]

TESTIMONIALS = [
    dict(
        author_name="Placeholder Manager",
        author_role="Engineering Manager",
        author_company="Placeholder Systems Inc.",
        author_avatar_url=None,
        content="Placeholder testimonial text — replace with a real quote.",
        rating=5,
        is_approved=True,
        sort_order=1,
    ),
]


async def upsert(session, model, rows, key_field):
    for row in rows:
        key_value = row[key_field]
        existing = await session.execute(
            select(model).where(getattr(model, key_field) == key_value)
        )
        if existing.scalar_one_or_none() is None:
            session.add(model(**row))


async def main() -> None:
    async with AsyncSessionLocal() as session:
        await upsert(session, Project, PROJECTS, "slug")
        await upsert(session, Skill, SKILLS, "name")
        await upsert(session, Experience, EXPERIENCE, "company")
        await upsert(session, Certification, CERTIFICATIONS, "name")
        await upsert(session, BlogPost, BLOG_POSTS, "slug")
        await upsert(session, Testimonial, TESTIMONIALS, "author_name")
        await session.commit()
    print("Seed complete.")


if __name__ == "__main__":
    asyncio.run(main())
