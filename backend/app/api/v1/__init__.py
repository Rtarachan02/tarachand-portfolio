"""Version 1 API router aggregation."""

from fastapi import APIRouter

from app.api.v1 import (
    analytics,
    auth,
    blog,
    certifications,
    contact,
    experience,
    github,
    health,
    oauth,
    profile,
    projects,
    resume,
    skills,
    testimonials,
)

api_router = APIRouter()
api_router.include_router(health.router, tags=["health"])
api_router.include_router(auth.router)
api_router.include_router(oauth.router)
api_router.include_router(profile.router)
api_router.include_router(github.router)
api_router.include_router(resume.router)
api_router.include_router(projects.router)
api_router.include_router(skills.router)
api_router.include_router(experience.router)
api_router.include_router(certifications.router)
api_router.include_router(blog.router)
api_router.include_router(testimonials.router)
api_router.include_router(contact.router)
api_router.include_router(analytics.router)
