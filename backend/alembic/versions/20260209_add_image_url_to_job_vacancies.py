"""Add image_url field to job_vacancies table

Revision ID: 20260209_job_vacancies_image
Revises: 20260209_education_fields
Create Date: 2026-02-09 13:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


revision = "20260209_job_vacancies_image"
down_revision = "20260209_education_fields"
branch_labels = None
depends_on = None


def upgrade():
    # Add image_url column to job_vacancies table
    op.add_column('job_vacancies', sa.Column('image_url', sa.String(500), nullable=True))


def downgrade():
    # Remove the image_url column
    op.drop_column('job_vacancies', 'image_url')
