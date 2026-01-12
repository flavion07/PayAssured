import sys
sys.path.insert(0, '.')

from app.database import SessionLocal, engine, Base
from app.models import Client, Case, CaseStatus
from datetime import datetime, timedelta

# Create tables
Base.metadata.create_all(bind=engine)

# Create session
db = SessionLocal()

# Check if data exists
existing = db.query(Client).count()
print(f'Current clients: {existing}')

if existing == 0:
    # Create clients
    c1 = Client(
        name='Acme Corporation',
        email='contact@acme.com',
        phone='+91-9876543210',
        company='Acme Corp'
    )
    c2 = Client(
        name='Tech Solutions Ltd',
        email='info@techsol.com',
        phone='+91-8765432109',
        company='Tech Solutions'
    )
    c3 = Client(
        name='Global Industries',
        email='sales@globalinc.com',
        phone='+91-7654321098',
        company='Global Inc'
    )
    
    db.add_all([c1, c2, c3])
    db.commit()
    
    # Create cases
    case1 = Case(
        client_id=c1.id,
        invoice_number='INV-2026-001',
        invoice_date=datetime.now() - timedelta(days=30),
        due_date=datetime.now() - timedelta(days=15),
        amount=125000.00,
        status=CaseStatus.IN_FOLLOW_UP,
        follow_up_notes='Awaiting payment confirmation'
    )
    case2 = Case(
        client_id=c2.id,
        invoice_number='INV-2026-002',
        invoice_date=datetime.now() - timedelta(days=20),
        due_date=datetime.now() + timedelta(days=10),
        amount=85000.00,
        status=CaseStatus.NEW
    )
    
    db.add_all([case1, case2])
    db.commit()
    
    print('✓ Added 3 clients and 2 cases')
else:
    print('✓ Data already exists')

db.close()
