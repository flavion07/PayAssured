from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from decimal import Decimal
from app.models import CaseStatus
from typing import Optional


class ClientBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(None, max_length=20)
    company: Optional[str] = Field(None, max_length=255)


class ClientCreate(ClientBase):
    pass


class ClientUpdate(ClientBase):
    pass


class ClientResponse(ClientBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class CaseBase(BaseModel):
    client_id: int
    invoice_number: str = Field(..., min_length=1, max_length=100)
    invoice_date: datetime
    due_date: datetime
    amount: Decimal = Field(..., gt=0, decimal_places=2)
    status: CaseStatus = CaseStatus.NEW
    follow_up_notes: Optional[str] = None


class CaseCreate(BaseModel):
    client_id: int
    invoice_number: str = Field(..., min_length=1, max_length=100)
    invoice_date: datetime
    due_date: datetime
    amount: Decimal = Field(..., gt=0, decimal_places=2)
    follow_up_notes: Optional[str] = None


class CaseUpdate(BaseModel):
    status: Optional[CaseStatus] = None
    follow_up_notes: Optional[str] = None


class CaseResponse(CaseBase):
    id: int
    created_at: datetime
    updated_at: datetime
    client: ClientResponse

    class Config:
        from_attributes = True
