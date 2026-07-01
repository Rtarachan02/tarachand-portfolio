"""Security helpers shared across services (hashing, not auth — JWT lands in Phase 5)."""

import hashlib

from app.core.config import settings


def hash_ip(ip_address: str) -> str:
    """One-way hash of a client IP so we can dedupe/rate-limit without storing raw IPs."""
    salted = f"{settings.secret_key}:{ip_address}"
    return hashlib.sha256(salted.encode("utf-8")).hexdigest()
