"""add missing values to newscategory enum

Revision ID: fe1a2b3c4d5e
Revises: 20260207_merge_heads
Create Date: 2026-02-07 00:00:00.000000

"""
from alembic import op

# revision identifiers, used by Alembic.
revision = 'fe1a2b3c4d5e'
down_revision = '20260207_merge_heads'
branch_labels = None
depends_on = None


def upgrade():
    # Add missing enum values to PostgreSQL type `newscategory` if they don't exist.
    # Use a guarded DO block to avoid errors when the value already exists.
    op.execute("""
    DO $$
    BEGIN
        IF NOT EXISTS (
            SELECT 1 FROM pg_type t
            JOIN pg_enum e ON t.oid = e.enumtypid
            WHERE t.typname = 'newscategory' AND e.enumlabel = 'ACHIEVEMENTS'
        ) THEN
            ALTER TYPE newscategory ADD VALUE 'ACHIEVEMENTS';
        END IF;
    END
    $$;
    """)

    op.execute("""
    DO $$
    BEGIN
        IF NOT EXISTS (
            SELECT 1 FROM pg_type t
            JOIN pg_enum e ON t.oid = e.enumtypid
            WHERE t.typname = 'newscategory' AND e.enumlabel = 'COMPETITIONS'
        ) THEN
            ALTER TYPE newscategory ADD VALUE 'COMPETITIONS';
        END IF;
    END
    $$;
    """)

    op.execute("""
    DO $$
    BEGIN
        IF NOT EXISTS (
            SELECT 1 FROM pg_type t
            JOIN pg_enum e ON t.oid = e.enumtypid
            WHERE t.typname = 'newscategory' AND e.enumlabel = 'NEWS'
        ) THEN
            ALTER TYPE newscategory ADD VALUE 'NEWS';
        END IF;
    END
    $$;
    """)

    op.execute("""
    DO $$
    BEGIN
        IF NOT EXISTS (
            SELECT 1 FROM pg_type t
            JOIN pg_enum e ON t.oid = e.enumtypid
            WHERE t.typname = 'newscategory' AND e.enumlabel = 'INTERVIEW'
        ) THEN
            ALTER TYPE newscategory ADD VALUE 'INTERVIEW';
        END IF;
    END
    $$;
    """)

    op.execute("""
    DO $$
    BEGIN
        IF NOT EXISTS (
            SELECT 1 FROM pg_type t
            JOIN pg_enum e ON t.oid = e.enumtypid
            WHERE t.typname = 'newscategory' AND e.enumlabel = 'HEALTH'
        ) THEN
            ALTER TYPE newscategory ADD VALUE 'HEALTH';
        END IF;
    END
    $$;
    """)


def downgrade():
    # Removing enum values in Postgres is non-trivial and not safe to perform automatically.
    # Keep downgrade as a no-op to avoid accidental data loss.
    pass
