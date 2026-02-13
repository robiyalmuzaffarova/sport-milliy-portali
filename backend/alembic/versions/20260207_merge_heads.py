"""merge alembic heads

Revision ID: 20260207_merge_heads
Revises: 340472ffc715
Create Date: 2026-02-07 00:10:00.000000

"""
from alembic import op

# revision identifiers, used by Alembic.
revision = '20260207_merge_heads'
down_revision = '340472ffc715'
branch_labels = None
depends_on = None


def upgrade():
    # This is a merge revision to combine multiple heads into a single branch.
    pass


def downgrade():
    pass
