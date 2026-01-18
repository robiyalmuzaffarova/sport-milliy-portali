from sqlalchemy import Column, String, Text, Enum
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

class Education(BaseModel):
    __tablename__ = "education"
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    region = Column(Enum(Region), nullable=False)
    address = Column(String(500), nullable=True)
    working_hours = Column(String(100), nullable=True)
    image_url = Column(String(500), nullable=True)
