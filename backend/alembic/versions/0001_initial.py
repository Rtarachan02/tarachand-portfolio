"""initial (empty) baseline

Revision ID: 0001
Revises:
Create Date: 2026-07-01
"""
from typing import Sequence, Union

from alembic import op  # noqa: F401
import sqlalchemy as sa  # noqa: F401

revision: str = "0001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Empty baseline — real tables land in Phase 3 (Database)."""
    pass


def downgrade() -> None:
    pass
