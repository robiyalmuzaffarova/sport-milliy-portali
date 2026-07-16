from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = "bb53be7d9805"
down_revision = "18f1c9e07bf8"
branch_labels = None
depends_on = None

OLD_VALUES = (
    "ACHIEVEMENTS", "COMPETITIONS", "NEWS", "INTERVIEW", "HEALTH",
    "FOOTBALL", "BOXING", "WRESTLING", "TENNIS", "BASKETBALL", "SWIMMING",
    "GENERAL",
)
NEW_VALUES = (
    "ACHIEVEMENTS", "COMPETITIONS", "NEWS", "INTERVIEW", "HEALTH", "GENERAL",
)


def upgrade() -> None:
    # 1. Create the new, smaller enum type under a temporary name.
    new_enum = sa.Enum(*NEW_VALUES, name="newscategory_new")
    new_enum.create(op.get_bind(), checkfirst=False)

    # 2. Drop the existing default — Postgres can't auto-cast a column's
    #    DEFAULT expression to the new enum type during ALTER COLUMN TYPE.
    op.execute("ALTER TABLE news ALTER COLUMN category DROP DEFAULT")

    # 3. Switch the column over, casting existing values through text.
    #    This will fail loudly if any row still has one of the removed
    #    values — which is the correct, safe behavior.
    op.execute(
        "ALTER TABLE news "
        "ALTER COLUMN category TYPE newscategory_new "
        "USING category::text::newscategory_new"
    )

    # 4. Drop the old (bigger) enum type and rename the new one into place.
    op.execute("DROP TYPE newscategory")
    op.execute("ALTER TYPE newscategory_new RENAME TO newscategory")

    # 5. Re-add the default, now pointing at the (renamed) new type.
    op.execute("ALTER TABLE news ALTER COLUMN category SET DEFAULT 'GENERAL'::newscategory")


def downgrade() -> None:
    # Recreate the original, larger enum type and switch back.
    old_enum = sa.Enum(*OLD_VALUES, name="newscategory_old")
    old_enum.create(op.get_bind(), checkfirst=False)

    op.execute("ALTER TABLE news ALTER COLUMN category DROP DEFAULT")

    op.execute(
        "ALTER TABLE news "
        "ALTER COLUMN category TYPE newscategory_old "
        "USING category::text::newscategory_old"
    )

    op.execute("DROP TYPE newscategory")
    op.execute("ALTER TYPE newscategory_old RENAME TO newscategory")

    op.execute("ALTER TABLE news ALTER COLUMN category SET DEFAULT 'GENERAL'::newscategory")