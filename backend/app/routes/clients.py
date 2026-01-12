from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc, func
from app.database import get_db
from app.models import Client, Case, CaseStatus
from app.schemas import ClientCreate, ClientUpdate, ClientResponse
from typing import List
from datetime import datetime

router = APIRouter(prefix="/api/clients", tags=["clients"])


@router.get("", response_model=List[ClientResponse])
def list_clients(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=10000),
    db: Session = Depends(get_db),
):
    """List all clients with pagination"""
    clients = db.query(Client).offset(skip).limit(limit).all()
    return clients


@router.get("/{client_id}", response_model=ClientResponse)
def get_client(client_id: int, db: Session = Depends(get_db)):
    """Get a specific client"""
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    return client


@router.post("", response_model=ClientResponse)
def create_client(client: ClientCreate, db: Session = Depends(get_db)):
    """Create a new client"""
    db_client = Client(**client.model_dump())
    db.add(db_client)
    db.commit()
    db.refresh(db_client)
    return db_client


@router.put("/{client_id}", response_model=ClientResponse)
def update_client(
    client_id: int, client: ClientUpdate, db: Session = Depends(get_db)
):
    """Update a client"""
    db_client = db.query(Client).filter(Client.id == client_id).first()
    if not db_client:
        raise HTTPException(status_code=404, detail="Client not found")

    update_data = client.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_client, field, value)

    db_client.updated_at = datetime.utcnow()
    db.add(db_client)
    db.commit()
    db.refresh(db_client)
    return db_client


@router.delete("/{client_id}")
def delete_client(client_id: int, db: Session = Depends(get_db)):
    """Delete a client and associated cases"""
    db_client = db.query(Client).filter(Client.id == client_id).first()
    if not db_client:
        raise HTTPException(status_code=404, detail="Client not found")

    db.delete(db_client)
    db.commit()
    return {"message": "Client deleted successfully"}
