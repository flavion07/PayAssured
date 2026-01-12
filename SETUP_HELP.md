# ⚙️ PayAssured CRM - Setup & Run Guide

## Prerequisites Verification

Before running, make sure you have:
- ✅ Python 3.10+ 
- ✅ Node.js 18+
- ✅ PostgreSQL running OR use SQLite for demo

## 🚀 Quick Start Options

### Option 1: With PostgreSQL (Production Setup)

**Step 1: Setup Database**
```bash
# Create database
createdb payassured

# Initialize schema
psql -U postgres -d payassured < db/init.sql
```

**Step 2: Setup & Run Backend**
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy and configure environment
cp .env.example .env
# Edit .env with your database credentials

# Run backend
python -m uvicorn app.main:app --reload --port 8000
```

**Step 3: Setup & Run Frontend (in a new terminal)**
```bash
cd frontend

# Install dependencies
npm install

# Copy environment
cp .env.example .env.local

# Run frontend
npm run dev
```

**Access Application**: http://localhost:3000

---

### Option 2: SQLite Demo (No PostgreSQL Required)

If you don't have PostgreSQL installed, we can quickly set up a SQLite version for demo purposes.

**Create** `backend/.env` with:
```
DATABASE_URL=sqlite:///./payassured.db
SECRET_KEY=demo-secret-key-change-in-production
DEBUG=True
CORS_ORIGINS=["http://localhost:3000"]
```

Then run:
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```

---

## ✅ Troubleshooting

### Python Not Found
```bash
python --version  # Check Python installation
# If needed, use: python3 instead of python
```

### npm Not Found
```bash
node --version   # Check Node.js installation
# Download from https://nodejs.org/
```

### PostgreSQL Connection Error
- Verify PostgreSQL is running
- Check DATABASE_URL in .env
- Or use SQLite option above

### Port Already in Use
```bash
# Backend on different port:
python -m uvicorn app.main:app --reload --port 8001

# Frontend on different port:
npm run dev -- -p 3001
```

### Module Not Found
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# For Python:
pip install --force-reinstall -r requirements.txt
```

---

## 📋 What to Do Next

1. **Backend Ready?** → http://localhost:8000/docs (API docs)
2. **Frontend Ready?** → http://localhost:3000 (Application)
3. **Create a Test Case** → Navigate to Cases → Create
4. **View Dashboard** → http://localhost:3000

---

## 🔗 Important URLs

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs
- API ReDoc: http://localhost:8000/redoc

---

**Ready to run? Follow Option 1 or 2 above!** 🚀
