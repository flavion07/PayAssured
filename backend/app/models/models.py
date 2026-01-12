from sqlalchemy import Column, Integer, String, DateTime, Enum, ForeignKey, Text, Numeric, func
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.database import Base


class CaseStatus(str, enum.Enum):
    NEW = "New"
    IN_FOLLOW_UP = "In Follow-up"
    PARTIALLY_PAID = "Partially Paid"
    CLOSED = "Closed"


class Client(Base):
    __tablename__ = "clients"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    email = Column(String(255), nullable=True)
    phone = Column(String(20), nullable=True)
    company = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    cases = relationship("Case", back_populates="client", cascade="all, delete-orphan")


class Case(Base):
    __tablename__ = "cases"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("clients.id", ondelete="CASCADE"), nullable=False, index=True)
    invoice_number = Column(String(100), nullable=False, index=True)
    invoice_date = Column(DateTime, nullable=False)
    due_date = Column(DateTime, nullable=False, index=True)
    amount = Column(Numeric(15, 2), nullable=False)
    status = Column(Enum(CaseStatus), default=CaseStatus.NEW, index=True)
    follow_up_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    client = relationship("Client", back_populates="cases")
