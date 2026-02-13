from sqlalchemy import Column, String, Text, Integer, Boolean
from app.db.base import BaseModel

class JobVacancy(BaseModel):
    __tablename__ = "job_vacancies"
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    company = Column(String(255), nullable=False)
    image_url = Column(String(500), nullable=True)  # Company logo/image URL
    location = Column(String(255), nullable=True)
    salary_range = Column(String(100), nullable=True)
    contact = Column(String(255))
    is_active = Column(Boolean, default=True)
