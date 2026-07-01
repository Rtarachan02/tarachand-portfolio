"""Bootstrap the first (and typically only) admin user for this portfolio.

There is no public registration endpoint by design — this script, run once
locally or via a one-off shell on the host, is the only way to create an
admin account for password-based login. OAuth login instead relies on
ALLOWED_ADMIN_EMAILS (see app/core/config.py) and needs no separate account
creation step.

Usage:
    python scripts/create_admin.py                         (interactive prompt)
    ADMIN_EMAIL=... ADMIN_PASSWORD=... python scripts/create_admin.py   (non-interactive,
                                                              e.g. a one-off deploy hook)
"""

import asyncio
import getpass
import os

from app.db.session import AsyncSessionLocal
from app.services.auth_service import create_admin_user, get_user_by_email


async def main() -> None:
    env_email = os.environ.get("ADMIN_EMAIL")
    env_password = os.environ.get("ADMIN_PASSWORD")

    if env_email and env_password:
        email = env_email.strip().lower()
        password = env_password
    else:
        email = input("Admin email: ").strip().lower()
        password = getpass.getpass("Admin password: ")
        confirm = getpass.getpass("Confirm password: ")
        if password != confirm:
            print("Passwords do not match.")
            return

    if len(password) < 8:
        print("Password must be at least 8 characters.")
        return

    async with AsyncSessionLocal() as db:
        existing = await get_user_by_email(db, email)
        if existing is not None:
            print(f"A user with email {email} already exists (id={existing.id}).")
            return

        user = await create_admin_user(db, email, password)
        print(f"Created admin user {user.email} (id={user.id}).")


if __name__ == "__main__":
    asyncio.run(main())
