import asyncio
from pathlib import Path

import asyncpg

from config import RelaySettings


async def migrate() -> None:
    settings = RelaySettings()
    if not settings.DATABASE_URL:
        raise RuntimeError("DATABASE_URL is required")

    connection = await asyncpg.connect(settings.DATABASE_URL)
    try:
        await connection.execute(
            "CREATE TABLE IF NOT EXISTS schema_migrations ("
            "version TEXT PRIMARY KEY, applied_at TIMESTAMPTZ NOT NULL DEFAULT now())"
        )
        migration_dir = Path(__file__).parent / "migrations"
        for path in sorted(migration_dir.glob("*.sql")):
            applied = await connection.fetchval(
                "SELECT EXISTS(SELECT 1 FROM schema_migrations WHERE version = $1)", path.name
            )
            if applied:
                continue
            async with connection.transaction():
                await connection.execute(path.read_text(encoding="utf-8"))
                await connection.execute(
                    "INSERT INTO schema_migrations(version) VALUES($1)", path.name
                )
            print(f"Applied {path.name}")
    finally:
        await connection.close()


if __name__ == "__main__":
    asyncio.run(migrate())
