from sqlalchemy import Column, String, Text, Integer, Boolean, Enum
import enum
from app.db.base import BaseModel
from app.models.education import Region  # reuse the same 14-region enum used elsewhere


class EmploymentType(str, enum.Enum):
    """Job employment type — matches the frontend's 'Ish turi' filter."""
    FULL_TIME = "full_time"
    PART_TIME = "part_time"
    CONTRACT = "contract"


class JobSportType(str, enum.Enum):
    """Sport category for a job vacancy — matches the frontend's 'Sport turi' filter."""
    FOOTBALL = "football"
    KURASH = "kurash"
    TENNIS = "tennis"
    SWIMMING = "swimming"
    FITNESS = "fitness"
    BOXING = "boxing"
    BASKETBALL = "basketball"
    VOLLEYBALL = "volleyball"
    GYMNASTICS = "gymnastics"
    OTHER = "other"


class JobVacancy(BaseModel):
    __tablename__ = "job_vacancies"
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    company = Column(String(255), nullable=False)
    image_url = Column(String(500), nullable=True)  # Company logo/image URL
    location = Column(String(255), nullable=True)   # Free-text address/detail, not used for filtering
    region = Column(
        Enum(Region, name="region"),
        nullable=True,
    )
    employment_type = Column(
        Enum(EmploymentType, values_callable=lambda x: [e.value for e in x], name="employmenttype"),
        nullable=True,
    )
    sport_type = Column(
        Enum(JobSportType, values_callable=lambda x: [e.value for e in x], name="jobsporttype"),
        nullable=True,
    )
    salary_range = Column(String(100), nullable=True)
    contact = Column(String(255))
    is_active = Column(Boolean, default=True)