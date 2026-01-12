from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc, asc
from app.database import get_db
from app.models import Case, CaseStatus, Client
from app.schemas import CaseCreate, CaseUpdate, CaseResponse
from typing import List, Optional
from datetime import datetime

router = APIRouter(prefix="/api/cases", tags=["cases"])


@router.get("", response_model=List[CaseResponse])
def list_cases(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=10000),
    status: Optional[CaseStatus] = Query(None),
    sort_by: str = Query("created_at", regex="^(created_at|due_date)$"),
    order: str = Query("desc", regex="^(asc|desc)$"),
    db: Session = Depends(get_db),
):
    """List all cases with filtering, sorting, and pagination"""
    query = db.query(Case)

    if status:
        query = query.filter(Case.status == status)

    # Determine sort column
    sort_column = Case.due_date if sort_by == "due_date" else Case.created_at
    
    # Apply ordering
    if order == "desc":
        query = query.order_by(desc(sort_column))
    else:
        query = query.order_by(asc(sort_column))

    cases = query.offset(skip).limit(limit).all()
    return cases


@router.get("/{case_id}", response_model=CaseResponse)
def get_case(case_id: int, db: Session = Depends(get_db)):
    """Get a specific case"""
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    return case


@router.post("", response_model=CaseResponse)
def create_case(case: CaseCreate, db: Session = Depends(get_db)):
    """Create a new case"""
    # Verify client exists
    client = db.query(Client).filter(Client.id == case.client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")

    try:
        db_case = Case(
            **case.model_dump(),
            status=CaseStatus.NEW,
        )
        db.add(db_case)
        db.commit()
        db.refresh(db_case)
        return db_case
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail="Failed to create case")


@router.put("/{case_id}", response_model=CaseResponse)
def update_case(
    case_id: int, case: CaseUpdate, db: Session = Depends(get_db)
):
    """Update a case (status and follow-up notes)"""
    db_case = db.query(Case).filter(Case.id == case_id).first()
    if not db_case:
        raise HTTPException(status_code=404, detail="Case not found")

    try:
        update_data = case.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_case, field, value)

        db.add(db_case)
        db.commit()
        db.refresh(db_case)
        return db_case
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail="Failed to update case")


@router.delete("/{case_id}")
def delete_case(case_id: int, db: Session = Depends(get_db)):
    """Delete a case"""
    db_case = db.query(Case).filter(Case.id == case_id).first()
    if not db_case:
        raise HTTPException(status_code=404, detail="Case not found")

    try:
        db.delete(db_case)
        db.commit()
        return {"message": "Case deleted successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail="Failed to delete case")
