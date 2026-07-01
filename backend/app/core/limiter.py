"""Shared rate limiter instance (slowapi), applied to abuse-prone public write endpoints."""

from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
