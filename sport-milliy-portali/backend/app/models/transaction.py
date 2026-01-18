from sqlalchemy import Column, String, Integer, ForeignKey, Enum
from sqlalchemy.orm import relationship
import enum
from app.db.base import BaseModel

class TransactionType(str, enum.Enum):
    PURCHASE = "purchase"
    DONATION = "donation"
    SUBSCRIPTION = "subscription"

class TransactionStatus(str, enum.Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"

class Transaction(BaseModel):
    __tablename__ = "transactions"
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    amount = Column(Integer, nullable=False)
    transaction_type = Column(Enum(TransactionType), nullable=False)
    status = Column(Enum(TransactionStatus), default=TransactionStatus.PENDING)
    payment_method = Column(String(50), nullable=True)
    external_id = Column(String(255), nullable=True)
    user = relationship("User", back_populates="transactions")
