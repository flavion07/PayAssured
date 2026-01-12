# PayAssured CRM - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Prerequisites
- Python 3.10+ installed
- Node.js 18+ installed
- PowerShell (Windows) or Bash (Linux/Mac)

### Step 1: Setup Backend (SQLite - Development)
```powershell
# Navigate to backend
cd e:\PayAssured\backend

# Clear any conflicting environment variables
Remove-Item Env:DATABASE_URL -ErrorAction SilentlyContinue

# Set environment for this session
$env:DATABASE_URL = "sqlite:///payassured.db"
$env:PYTHONPATH = "e:\PayAssured\backend"

# Install dependencies
python -m pip install -r requirements.txt

# Start server (choose a free port, e.g., 8001)
python -m uvicorn app.main:app --host 127.0.0.1 --port 8001
```

✅ Backend running at: http://localhost:8001  
✅ API Docs at: http://localhost:8001/docs  
✅ Database: `payassured.db` (auto-created on first run)

### Step 2: Start Frontend
```powershell
# Open NEW terminal/PowerShell window
cd e:\PayAssured\frontend

# Create .env.local with backend URL
echo "NEXT_PUBLIC_API_URL=http://localhost:8001" > .env.local

# Install dependencies (if not already done)
npm install

# Run development server
npm run dev
```

✅ Frontend running at: http://localhost:3000

### Step 3 (Optional): PostgreSQL Setup
For production use with PostgreSQL:

```bash
# Create database
createdb payassured

# Initialize schema
psql -U postgres -d payassured < db/init.sql

# Update backend/.env
DATABASE_URL=postgresql://user:password@localhost:5432/payassured
```

## 📖 Key Pages

| Page | URL | Purpose |
|------|-----|---------|
| Dashboard | `/` | View statistics |
| Cases List | `/cases` | View/filter/sort cases |
| Create Case | `/cases/create` | Add new case |
| Case Details | `/cases/[id]` | View/edit case |
| Clients | `/clients` | Manage clients |

## 🎯 Common Tasks

### Create a Case
1. Navigate to Cases → New Case
2. Select client from dropdown
3. Enter invoice number, dates, amount
4. Optionally add notes
5. Click "Create Case"

### Update Case Status
1. Go to Cases → Click case row
2. Click "Edit" button
3. Change status dropdown
4. Update follow-up notes if needed
5. Click "Save Changes"

### Manage Clients
1. Navigate to Clients
2. Click "New Client" for creation
3. Click edit icon to modify
4. Click delete icon to remove

## 🔧 Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/payassured
SECRET_KEY=your-secret-key
DEBUG=True
CORS_ORIGINS=["http://localhost:3000"]
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=PayAssured CRM
```

## 📊 Status Meanings

- **New**: Newly created case, not yet followed up
- **In Follow-up**: Currently being followed up
- **Partially Paid**: Payment partially received
- **Closed**: Case resolved (fully paid)

## 🎨 Color Codes

- Grey Badge: New case
- Blue Badge: In Follow-up
- Orange Badge: Partially Paid
- Green Badge: Closed

## 🔍 API Examples

### Get All Cases
```bash
curl http://localhost:8000/api/cases
```

### Filter Cases by Status
```bash
curl "http://localhost:8000/api/cases?status=In%20Follow-up"
```

### Create Case
```bash
curl -X POST http://localhost:8000/api/cases \
  -H "Content-Type: application/json" \
  -d '{
    "client_id": 1,
    "invoice_number": "INV-001",
    "invoice_date": "2026-01-01T00:00:00",
    "due_date": "2026-02-01T00:00:00",
    "amount": "50000.00"
  }'
```

## 📱 Responsive Behavior

- **Desktop (1024px+)**: Full layout with permanent sidebar
- **Tablet (600-1024px)**: Collapsible sidebar
- **Mobile (<600px)**: Hamburger menu, optimized table

## 🐛 Troubleshooting

### Backend won't start - "Could not parse SQLAlchemy URL"
**Problem**: OS environment variable `DATABASE_URL` is overriding `.env` file  
**Solution**:
```powershell
# Remove the conflicting env var (PowerShell)
Remove-Item Env:DATABASE_URL -ErrorAction SilentlyContinue

# OR set it explicitly for your session
$env:DATABASE_URL = "sqlite:///payassured.db"

# Then start the backend
$env:PYTHONPATH = "e:\PayAssured\backend"
cd e:\PayAssured\backend
python -m uvicorn app.main:app --host 127.0.0.1 --port 8001
```

### Backend - Missing email-validator
**Problem**: `ImportError: email-validator is not installed`  
**Solution**:
```bash
cd backend
python -m pip install pydantic[email]
# Or reinstall all deps
python -m pip install -r requirements.txt
```

### Backend - Port already in use
**Problem**: `[Errno 10048] only one usage of each socket address`  
**Solution**: Use a different port (8001, 8010, etc.)
```bash
python -m uvicorn app.main:app --host 127.0.0.1 --port 8001
```

### Frontend won't start
- Clear cache: `rm -rf node_modules .next`
- Reinstall: `npm install`
- Check Node version: `node --version` (need 18+)

### Frontend - Invalid notistack version
**Problem**: `No matching version found for notistack@^9.0.0`  
**Already Fixed**: `package.json` now uses `notistack@^3.0.1`

### API connection issues
- **Backend URL mismatch**: Create `frontend/.env.local` with:
  ```
  NEXT_PUBLIC_API_URL=http://localhost:8001
  ```
  (Update port to match your backend)
- Verify backend is running: `http://localhost:8001/health`
- Review CORS_ORIGINS in backend settings.py

### SQLite vs PostgreSQL
**Current Setup**: Using SQLite for development (simpler setup)  
**For Production**: Update `backend/.env`:
```
DATABASE_URL=postgresql://user:password@localhost:5432/payassured
```

## 📚 API Documentation

Auto-generated docs available at:
- **Swagger**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🎓 Component Architecture

### Layout Components
```
Layout
├── Sidebar (navigation)
├── Header (page title)
└── Content (pages)
```

### Reusable Components
- `StatusBadge`: Colored status display
- `EmptyState`: No data UI
- `LoadingSkeleton`: Loading state
- `Header`: Page header
- `Sidebar`: Navigation menu

## 💾 Database Tables

### clients
- id (Primary Key)
- name (Required)
- email, phone, company (Optional)
- created_at, updated_at

### cases
- id (Primary Key)
- client_id (Foreign Key)
- invoice_number (Unique)
- invoice_date, due_date
- amount (Decimal)
- status (Enum)
- follow_up_notes (Optional)
- created_at, updated_at

## 🔐 Best Practices

1. **Always validate** on both frontend and backend
2. **Use confirmation dialogs** for delete operations
3. **Handle errors gracefully** with user-friendly messages
4. **Provide loading feedback** during API calls
5. **Use TypeScript types** for type safety
6. **Keep components small** and reusable

## 📈 Future Enhancements

- [ ] User authentication & authorization
- [ ] Role-based access control
- [ ] Export to Excel/CSV
- [ ] Advanced analytics & reports
- [ ] Email notifications
- [ ] Document attachment support
- [ ] Activity timeline/audit log
- [ ] Batch operations

## 🚢 Production Deployment

### Backend
```bash
# Build production
pip install -r requirements.txt
gunicorn app.main:app -w 4 -b 0.0.0.0:8000
```

### Frontend
```bash
# Build production
npm run build
npm start
```

## 📞 Support Resources

- FastAPI Docs: https://fastapi.tiangolo.com/
- React Docs: https://react.dev/
- Next.js Docs: https://nextjs.org/docs
- MUI Docs: https://mui.com/
- SQLAlchemy: https://www.sqlalchemy.org/

---

**Ready to go!** Start with Step 1-3 above and you'll have the full system running. 🎉
