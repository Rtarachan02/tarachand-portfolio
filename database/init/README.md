# Database init scripts

Alembic (`backend/alembic/`) is the source of truth for schema migrations. This folder is reserved for optional one-time seed SQL (e.g. reference data) that docker-compose's postgres service can mount to `/docker-entrypoint-initdb.d/` if needed. Empty until Phase 3 (Database).
