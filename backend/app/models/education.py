from sqlalchemy import Column, String, Text, Enum, Float
import enum
from ..db.base import BaseModel

class Region(str, enum.Enum):
    ANDIJAN = "andijan"
    BUKHARA = "bukhara"
    FERGANA = "fergana"
    JIZZAKH = "jizzakh"
    KARAKALPAKSTAN = "karakalpakstan"
    KASHKADARYA = "kashkadarya"
    KHOREZM = "khorezm"
    NAMANGAN = "namangan"
    NAVOIY = "navoiy"
    SAMARKAND = "samarkand"
    SURKHANDARYA = "surkhandarya"
    SYRDARYA = "syrdarya"
    TASHKENT_CITY = "tashkent city"
    TASHKENT_REGION = "tashkent region"

class EducationType(str, enum.Enum):
    ACADEMY = "academy"
    FEDERATION = "federation"
    SCHOOL = "school"
    CLUB = "club"

class Education(BaseModel):
    __tablename__ = "education"
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    region = Column(Enum(Region), nullable=False)
    type = Column(Enum(EducationType), nullable=True)
    address = Column(String(500), nullable=True)
    working_hours = Column(String(100), nullable=True)
    image_url = Column(String(500), nullable=True)
    phone = Column(String(20), nullable=True)
    rating = Column(Float, nullable=True, default=0.0)
    maps_link = Column(String(500), nullable=True)
