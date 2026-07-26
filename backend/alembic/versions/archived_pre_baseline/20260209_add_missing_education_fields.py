"""Add missing fields to education table

Revision ID: 20260209_education_fields
Revises: fe1a2b3c4d5e
Create Date: 2026-02-09 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


revision = "20260209_education_fields"
down_revision = "fe1a2b3c4d5e"
branch_labels = None
depends_on = None


def upgrade():
    # Create the educationtype enum type first
    op.execute("""
    CREATE TYPE educationtype AS ENUM (
        'academy',
        'federation', 
        'school',
        'club'
    );
    """)
    
    # Add new columns to education table
    op.add_column('education', sa.Column('type', sa.Enum('academy', 'federation', 'school', 'club', name='educationtype'), nullable=True))
    op.add_column('education', sa.Column('phone', sa.String(20), nullable=True))
    op.add_column('education', sa.Column('rating', sa.Float(), nullable=True, server_default='0.0'))
    op.add_column('education', sa.Column('maps_link', sa.String(500), nullable=True))


def downgrade():
    # Remove the columns
    op.drop_column('education', 'maps_link')
    op.drop_column('education', 'rating')
    op.drop_column('education', 'phone')
    op.drop_column('education', 'type')
    # Drop the enum type
    op.execute('DROP TYPE IF EXISTS educationtype;')
