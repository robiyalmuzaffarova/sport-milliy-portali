"""add_discount_and_is_new_to_merch
Revision ID: cf84228c688d
Revises: 831ea86b0a6b
Create Date: 2026-06-28 19:26:10.473059
"""
from alembic import op
import sqlalchemy as sa

revision = 'cf84228c688d'
down_revision = '831ea86b0a6b'
branch_labels = None
depends_on = None

def upgrade():
    op.add_column('merches', sa.Column('discount_percent', sa.Integer(), nullable=False, server_default='0'))
    op.add_column('merches', sa.Column('is_new', sa.Boolean(), nullable=False, server_default='false'))

def downgrade():
    op.drop_column('merches', 'is_new')
    op.drop_column('merches', 'discount_percent')