"""add region, employment_type, sport_type to job_vacancies

Revision ID: 208e3bee1c9c
Revises: bb53be7d9805
Create Date: 2026-07-16

Adds three structured columns to job_vacancies so the frontend's filter
sidebar (Ish turi / Viloyat / Sport turi) and search can actually filter
against real data instead of free-text `location` guessing:

- region          -> reuses the existing `region` enum type (education.py)
- employment_type -> new `employmenttype` enum (full_time/part_time/contract)
- sport_type      -> new `jobsporttype` enum (football/kurash/tennis/etc.)

All three are nullable, so existing rows are untouched; they'll just show
up as unfiltered/"uncategorized" until edited in the admin panel.
"""
from alembic import op
import sqlalchemy as sa

revision = "208e3bee1c9c"
down_revision = "bb53be7d9805"
branch_labels = None
depends_on = None

EMPLOYMENT_TYPE_VALUES = ("full_time", "part_time", "contract")
JOB_SPORT_TYPE_VALUES = (
    "football", "kurash", "tennis", "swimming", "fitness",
    "boxing", "basketball", "volleyball", "gymnastics", "other",
)


def upgrade() -> None:
    # New enum types for the two brand-new columns.
    employment_type_enum = sa.Enum(*EMPLOYMENT_TYPE_VALUES, name="employmenttype")
    employment_type_enum.create(op.get_bind(), checkfirst=True)

    job_sport_type_enum = sa.Enum(*JOB_SPORT_TYPE_VALUES, name="jobsporttype")
    job_sport_type_enum.create(op.get_bind(), checkfirst=True)

    # region reuses the existing `region` enum type (created previously by
    # the education table's migration) — do NOT create it here, just
    # reference it via create_type=False.
    op.add_column(
        "job_vacancies",
        sa.Column(
            "region",
            sa.Enum(name="region", create_type=False),
            nullable=True,
        ),
    )
    op.add_column(
        "job_vacancies",
        sa.Column("employment_type", employment_type_enum, nullable=True),
    )
    op.add_column(
        "job_vacancies",
        sa.Column("sport_type", job_sport_type_enum, nullable=True),
    )


def downgrade() -> None:
    op.drop_column("job_vacancies", "sport_type")
    op.drop_column("job_vacancies", "employment_type")
    op.drop_column("job_vacancies", "region")

    op.execute("DROP TYPE IF EXISTS jobsporttype")
    op.execute("DROP TYPE IF EXISTS employmenttype")
