# PayAssured CRM - Architecture & Design Documentation

## System Overview

PayAssured CRM is a modern, full-stack web application following microservices principles with a clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Browser                          │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTP/HTTPS
                     ↓
┌─────────────────────────────────────────────────────────────┐
│              Next.js Frontend (Port 3000)                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ React Components + MUI                              │   │
│  │ - Layout (Sidebar, Header)                          │   │
│  │ - Pages (Dashboard, Cases, Clients)                 │   │
│  │ - Forms (Create, Edit with validation)              │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Services Layer (API calls)                          │   │
│  │ - clientsAPI, casesAPI                              │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Utilities & Theme                                   │   │
│  │ - Format utilities (date, currency)                 │   │
│  │ - MUI theme configuration                           │   │
│  └─────────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ REST API (JSON)
                     ↓
┌─────────────────────────────────────────────────────────────┐
│           FastAPI Backend (Port 8000)                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Route Handlers                                      │   │
│  │ - /api/clients/* (CRUD operations)                  │   │
│  │ - /api/cases/* (CRUD + filtering)                   │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Service/Business Logic                              │   │
│  │ - Validation (Pydantic)                             │   │
│  │ - Error handling                                    │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Database Abstraction (SQLAlchemy ORM)               │   │
│  │ - Models (Client, Case)                             │   │
│  │ - Queries & transactions                            │   │
│  └─────────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ SQL
                     ↓
┌─────────────────────────────────────────────────────────────┐
│            PostgreSQL Database                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Tables:                                             │   │
│  │ - clients (id, name, email, phone, company)        │   │
│  │ - cases (id, client_id, invoice_number, dates, etc)│   │
│  │                                                     │   │
│  │ Relationships:                                      │   │
│  │ - clients (1) ──→ (∞) cases                         │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Frontend Architecture

### Component Hierarchy
```
_app.tsx (Theme Provider, Snackbar)
  ├── Layout.tsx
  │   ├── Sidebar.tsx (Navigation)
  │   ├── Header.tsx (Page Title)
  │   └── [Page Component]
  │       ├── Reusable Components
  │       │   ├── StatusBadge
  │       │   ├── EmptyState
  │       │   ├── LoadingSkeleton
  │       │   └── ...
  │       └── Forms
```

### Data Flow
```
Component State (useState)
    ↓
API Call (services/api.ts)
    ↓
Backend Response
    ↓
Update State / Show Notification
    ↓
Re-render Component
```

### Form Pattern
```
React Hook Form (useForm)
    ↓
Yup Validation Schema
    ↓
Controller (MUI TextField/Select)
    ↓
onSubmit Handler
    ↓
API Call
    ↓
Success/Error Toast
```

### File Organization
```
src/
├── components/          # Reusable UI components
├── pages/              # Next.js pages (routing)
├── services/           # API client functions
├── types/              # TypeScript interfaces
├── utils/              # Helper functions
└── theme/              # MUI theme config
```

## Backend Architecture

### Request Flow
```
HTTP Request
    ↓
CORS Middleware
    ↓
Router Handler
    ↓
Pydantic Validation
    ↓
Database Query (SQLAlchemy)
    ↓
Response Model Validation
    ↓
JSON Response
```

### API Patterns

#### List Endpoint
```python
@router.get("")
def list_items(
    skip: int = 0,
    limit: int = 10,
    filter: str = None,
    sort_by: str = "created_at",
    db: Session = Depends(get_db)
):
    query = db.query(Model)
    # Apply filters
    # Apply sorting
    # Apply pagination
    return query.offset(skip).limit(limit).all()
```

#### Create Endpoint
```python
@router.post("")
def create_item(
    payload: CreateSchema,
    db: Session = Depends(get_db)
):
    db_item = Model(**payload.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item
```

#### Update Endpoint
```python
@router.put("/{id}")
def update_item(
    id: int,
    payload: UpdateSchema,
    db: Session = Depends(get_db)
):
    db_item = db.query(Model).filter(Model.id == id).first()
    # Update fields
    # Commit transaction
    return db_item
```

#### Delete Endpoint
```python
@router.delete("/{id}")
def delete_item(id: int, db: Session = Depends(get_db)):
    db_item = db.query(Model).filter(Model.id == id).first()
    db.delete(db_item)
    db.commit()
    return {"message": "Item deleted"}
```

### Error Handling
```
Validation Error (422)
    ↓ Pydantic validates
    ↓ Returns validation details

Not Found (404)
    ↓ Resource doesn't exist
    ↓ Returns error message

Conflict (409)
    ↓ Business logic violation
    ↓ Returns error message

Server Error (500)
    ↓ Unexpected error
    ↓ Returns error message
```

## Database Design

### Entity Relationship Diagram
```
┌────────────┐
│  clients   │
├────────────┤
│ id (PK)    │
│ name       │
│ email      │
│ phone      │
│ company    │
│ created_at │
│ updated_at │
└─────┬──────┘
      │
      │ 1:N Relationship
      │ (CASCADE DELETE)
      │
      ↓
┌────────────────┐
│     cases      │
├────────────────┤
│ id (PK)        │
│ client_id (FK) │──→ clients.id
│ invoice_number │
│ invoice_date   │
│ due_date       │
│ amount         │
│ status         │
│ follow_up_notes│
│ created_at     │
│ updated_at     │
└────────────────┘
```

### Indexing Strategy
```
clients:
  - Index on name (fast search)

cases:
  - Index on client_id (FK joins)
  - Index on invoice_number (lookup)
  - Index on due_date (sorting, filtering)
  - Index on status (filtering)
```

## API Endpoints Reference

### Cases API
```
GET    /api/cases                    # List with filtering
GET    /api/cases?status=New         # Filter by status
GET    /api/cases?sort_by=due_date   # Sort by field
POST   /api/cases                    # Create
GET    /api/cases/{id}               # Get detail
PUT    /api/cases/{id}               # Update
DELETE /api/cases/{id}               # Delete
```

### Clients API
```
GET    /api/clients                  # List
POST   /api/clients                  # Create
GET    /api/clients/{id}             # Get detail
PUT    /api/clients/{id}             # Update
DELETE /api/clients/{id}             # Delete
```

## State Management Strategy

### Frontend State
```
Component Level:
  - Form inputs
  - Loading states
  - Modal open/close
  - UI toggles

Global Level:
  - Theme (MUI ThemeProvider)
  - Notifications (Notistack)
  - Auth (future)
```

### No Redux/Zustand?
Why we're using React Hooks instead:
- Simpler project scope
- API-driven state
- No complex shared state
- Can add later if needed

## Security Considerations

### Frontend
- ✅ Input validation (Yup)
- ✅ Error messages don't expose internals
- ✅ No sensitive data in localStorage
- 🚧 CSRF tokens (implement with backend)
- 🚧 Authentication/Authorization (future)

### Backend
- ✅ Pydantic input validation
- ✅ SQL injection prevented (SQLAlchemy ORM)
- ✅ CORS configured
- 🚧 Authentication middleware (future)
- 🚧 Rate limiting (future)
- 🚧 Input sanitization (future)

## Performance Optimization

### Frontend
- ✅ Code splitting (Next.js)
- ✅ Image optimization (Next.js Image)
- ✅ Lazy loading (dynamic imports)
- 🚧 State caching (React Query)
- 🚧 Memoization (React.memo)

### Backend
- ✅ Database indexing
- ✅ Pagination for list endpoints
- 🚧 Query optimization
- 🚧 Caching layer (Redis)
- 🚧 Response compression

## Error Handling Strategy

### Frontend
```
API Error
  ├── Network Error → "Connection failed"
  ├── Validation Error (422) → Field errors
  ├── Not Found (404) → "Resource not found"
  ├── Server Error (5xx) → "Server error"
  └── Show Toast Notification
```

### Backend
```
Exception Handling
  ├── Validation Error → 422
  ├── Not Found → 404
  ├── Permission Denied → 403
  ├── Business Logic Error → 400/409
  └── Unhandled → 500
```

## Deployment Architecture

### Frontend Deployment (Vercel/Netlify)
```
Git Push
  ↓
Build: npm run build
  ↓
Deploy to CDN
  ↓
Environment Variables Set
  ↓
Live at domain
```

### Backend Deployment (Heroku/AWS/DigitalOcean)
```
Git Push / Docker Push
  ↓
Build Uvicorn Server
  ↓
Connect to PostgreSQL
  ↓
Run on Production Port
  ↓
Health Checks
  ↓
Auto-Scaling
```

## Monitoring & Logging

### Frontend
- ✅ Browser console logs
- ✅ Error tracking (Sentry - future)
- ✅ Analytics (future)

### Backend
- ✅ Application logs
- ✅ Request/response logging (future)
- ✅ Database query logging (development)
- ✅ Error tracking (future)

## Code Quality Standards

### Frontend
- ESLint + Prettier for code formatting
- TypeScript for type safety
- React best practices
- MUI component patterns

### Backend
- PEP 8 style guide
- Type hints (Python 3.10+)
- Docstrings for functions
- SQLAlchemy best practices

## Testing Strategy

### Frontend Tests (Jest/React Testing Library)
```
- Component rendering
- User interactions
- Form validation
- API error handling
```

### Backend Tests (pytest)
```
- Endpoint functionality
- Validation schemas
- Database operations
- Error scenarios
```

## Future Scalability

### Phase 1 (Current)
- Single backend instance
- Single database
- Direct client-server

### Phase 2 (Production)
- Load balancer
- Multiple backend instances
- Database replication
- Caching layer (Redis)

### Phase 3 (Enterprise)
- Microservices
- Event streaming (Kafka)
- Message queues (RabbitMQ)
- Data warehouse
- Analytics

## Development Workflow

1. **Feature Planning**: Requirements → Tasks
2. **Backend Development**: Models → Routes → Tests
3. **Frontend Development**: Components → Pages → Integration
4. **Testing**: Unit → Integration → E2E
5. **Code Review**: PR review process
6. **Deployment**: Staging → Production

## Troubleshooting Guide

| Issue | Cause | Solution |
|-------|-------|----------|
| 404 Not Found | Endpoint doesn't exist | Check route definition |
| 422 Validation | Invalid input | Check Pydantic schema |
| CORS Error | Frontend origin not allowed | Add to CORS_ORIGINS |
| Connection Refused | Backend not running | Start backend server |
| Blank Page | Frontend build failed | Check build logs |
| Database Error | Connection string wrong | Verify DATABASE_URL |

---

**This architecture is scalable, maintainable, and follows industry best practices.** 🏗️
