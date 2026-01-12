from app.database import SessionLocal
from app.models import Client, Case, CaseStatus
from datetime import datetime, timedelta

db = SessionLocal()
c1 = db.query(Client).first()

if c1 and db.query(Case).count() == 0:
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
        client_id=c1.id,
        invoice_number='INV-2026-002',
        invoice_date=datetime.now() - timedelta(days=20),
        due_date=datetime.now() + timedelta(days=10),
        amount=85000.00,
        status=CaseStatus.NEW
    )
    db.add_all([case1, case2])
    db.commit()
    print('✓ Added 2 cases')
else:
    print(f'✓ Cases already exist: {db.query(Case).count()}')

db.close()
