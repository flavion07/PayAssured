# PayAssured CRM - Internal Case Management System

A production-quality, enterprise-grade internal CRM module built for PayAssured. This application manages invoice cases, client relationships, and payment follow-ups with a clean, intuitive interface designed for seamless team collaboration.

## ✨ Features

- **Case Management**: Create, view, and manage invoice cases with status tracking
- **Client Management**: Maintain a comprehensive client database
- **Status Tracking**: Visual status badges (New, In Follow-up, Partially Paid, Closed)
- **Advanced Filtering**: Filter cases by status and sort by creation or due date
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Real-time Feedback**: Toast notifications for all actions
- **Form Validation**: Comprehensive client-side and server-side validation
- **Secure**: Built with production-ready authentication patterns

## 📋 Tech Stack

### Frontend
- **Framework**: Next.js 14 with React 18
- **UI Library**: Material-UI (MUI) v5
- **State Management**: React Hooks + Context API
- **Form Management**: React Hook Form + Yup validation
- **HTTP Client**: Axios
- **Date Handling**: date-fns
- **Notifications**: Notistack
- **Styling**: Emotion + MUI System

### Backend
- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL
- **ORM**: SQLAlchemy
- **API Documentation**: Swagger/OpenAPI
- **Validation**: Pydantic
- **Server**: Uvicorn

### Database
- PostgreSQL with SQLAlchemy ORM
- Enum types for status values
- Proper foreign key relationships and cascading deletes

## 🎨 UX/Design Philosophy

This application follows modern SaaS design principles:

1. **Clean Layout**: Generous spacing, clear hierarchy
2. **Intuitive Navigation**: Sidebar with clear menu structure
3. **Visual Hierarchy**: Typography and color convey importance
4. **Status Visualization**: Color-coded badges for quick scanning
5. **Responsive**: Desktop-first approach with mobile fallbacks
6. **Accessibility**: Proper labels, semantic HTML, keyboard navigation
7. **Performance**: Optimized loading states and empty states
8. **User Feedback**: Clear confirmation dialogs and toast notifications

### Color Scheme
- **Primary**: #1976D2 (Professional Blue)
- **Success**: #4CAF50 (Green - Closed cases)
- **Warning**: #FF9800 (Orange - Partially Paid)
- **Info**: #2196F3 (Blue - In Follow-up)
- **Neutral**: #9E9E9E (Grey - New cases)

## 📁 Project Structure

```
PayAssured/
├── backend/
│   ├── app/
│   │   ├── models/
│   │   │   └── models.py           # SQLAlchemy models
│   │   ├── routes/
│   │   │   ├── clients.py          # Client API endpoints
│   │   │   └── cases.py            # Case API endpoints
│   │   ├── schemas/
│   │   │   └── schemas.py          # Pydantic validation schemas
│   │   ├── database.py             # Database configuration
│   │   └── main.py                 # FastAPI application
│   ├── settings.py                 # Configuration
│   ├── requirements.txt            # Python dependencies
│   └── .env.example                # Environment template
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.tsx         # Navigation sidebar
│   │   │   ├── Header.tsx          # Page header
│   │   │   ├── Layout.tsx          # Main layout wrapper
│   │   │   ├── StatusBadge.tsx     # Status display component
│   │   │   └── EmptyState.tsx      # Empty state UI
│   │   ├── pages/
│   │   │   ├── _app.tsx            # App configuration
│   │   │   ├── _document.tsx       # Document setup
│   │   │   ├── index.tsx           # Dashboard
│   │   │   ├── cases/
│   │   │   │   ├── index.tsx       # Cases list
│   │   │   │   ├── create.tsx      # Create case
│   │   │   │   └── [id].tsx        # Case details
│   │   │   └── clients/
│   │   │       └── index.tsx       # Clients management
│   │   ├── services/
│   │   │   └── api.ts              # API client & methods
│   │   ├── types/
│   │   │   └── index.ts            # TypeScript types
│   │   ├── utils/
│   │   │   ├── api.ts              # Axios configuration
│   │   │   └── format.ts           # Formatting utilities
│   │   └── theme/
│   │       └── theme.ts            # MUI theme configuration
│   ├── package.json                # Node dependencies
│   ├── tsconfig.json               # TypeScript config
│   ├── next.config.js              # Next.js config
│   └── .env.example                # Environment template
├── db/
│   ├── SCHEMA.md                   # Database schema documentation
│   └── init.sql                    # Database initialization script
└── README.md                       # This file
```

## 🚀 Setup & Installation

### Prerequisites
- Node.js 18+ and npm
- Python 3.10+
- PostgreSQL 12+
- Git

### Backend Setup

1. **Install Python dependencies**:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Initialize database**:
   ```bash
   psql -U postgres -d payassured -f ../db/init.sql
   ```

4. **Run backend**:
   ```bash
   python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

   Backend will be available at: `http://localhost:8000`

### Frontend Setup

1. **Install Node dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Configure environment**:
   ```bash
   cp .env.example .env.local
   # Ensure NEXT_PUBLIC_API_URL matches your backend URL
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```

   Frontend will be available at: `http://localhost:3000`

## 📖 API Documentation

Once backend is running, visit:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

### Key Endpoints

**Cases**:
- `GET /api/cases` - List cases (with filtering & sorting)
- `GET /api/cases/{id}` - Get case details
- `POST /api/cases` - Create new case
- `PUT /api/cases/{id}` - Update case status/notes
- `DELETE /api/cases/{id}` - Delete case

**Clients**:
- `GET /api/clients` - List clients
- `GET /api/clients/{id}` - Get client details
- `POST /api/clients` - Create new client
- `PUT /api/clients/{id}` - Update client
- `DELETE /api/clients/{id}` - Delete client

## 📸 Screenshots

### Dashboard
![Dashboard](screenshots/dashboard.png)
Overview of case statistics with key metrics displayed in card format.

### Cases List
![Cases List](screenshots/cases-list.png)
Main data table showing all cases with status badges, filtering, and sorting capabilities.

### Create Case
![Create Case](screenshots/create-case.png)
Form for creating new cases with client selection, date pickers, and currency formatting.

### Case Details
![Case Details](screenshots/case-details.png)
Detailed view of a case with editable status and follow-up notes.

### Client Management
![Clients](screenshots/clients-list.png)
Client list with create/edit functionality in an inline modal.

## 🔐 Database Schema

### Clients Table
```sql
CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    company VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Cases Table
```sql
CREATE TABLE cases (
    id SERIAL PRIMARY KEY,
    client_id INTEGER NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    invoice_number VARCHAR(100) NOT NULL,
    invoice_date TIMESTAMP NOT NULL,
    due_date TIMESTAMP NOT NULL,
    amount NUMERIC(15, 2) NOT NULL,
    status case_status NOT NULL DEFAULT 'New',
    follow_up_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

See [db/SCHEMA.md](db/SCHEMA.md) for full documentation.

## 🎯 Usage Guide

### Dashboard
View summary statistics of all cases by status. This is your entry point to the system.

### Cases Management
1. **View Cases**: Go to "Cases" in the sidebar
2. **Filter**: Select a status filter to narrow results
3. **Sort**: Choose between creation date or due date
4. **Create**: Click "New Case" button
5. **Edit**: Click the edit icon on any case row
6. **Delete**: Click delete icon (with confirmation)

### Client Management
1. **View Clients**: Go to "Clients" in the sidebar
2. **Create**: Click "New Client" to open dialog
3. **Edit**: Click edit icon on any client row
4. **Delete**: Click delete icon with cascade confirmation

## 🧪 Testing

### Backend Testing
```bash
cd backend
pytest  # Run tests (if test files added)
```

### Frontend Testing
```bash
cd frontend
npm test  # Run Jest tests (if configured)
```

## 📝 Form Validation

### Client Form
- Name: Required, min 1 character
- Email: Optional, must be valid email
- Phone: Optional
- Company: Optional

### Case Form
- Client: Required
- Invoice Number: Required
- Invoice Date: Required
- Due Date: Required
- Amount: Required, must be positive number
- Follow-up Notes: Optional

## 🚨 Error Handling

The application includes comprehensive error handling:
- **Network errors**: User-friendly error messages via toasts
- **Validation errors**: Inline form error messages
- **Confirmation dialogs**: For destructive actions
- **Loading states**: Clear feedback during API calls
- **Empty states**: Friendly messages when no data exists

## 🔄 State Management

- **React Hooks**: useState for component state
- **Form State**: React Hook Form for form management
- **API Caching**: Direct async calls (add React Query for advanced caching)
- **Notifications**: Notistack for global notifications

## 📱 Responsive Design

- **Desktop**: Full sidebar + content layout
- **Tablet**: Collapsible sidebar with hamburger menu
- **Mobile**: Full-screen responsive tables with hidden columns

## 🛠️ Development Notes

### Adding New Features

1. **New API Endpoint**: Add route in `backend/app/routes/`
2. **New Schema**: Add validation in `backend/app/schemas/`
3. **New Page**: Create in `frontend/src/pages/`
4. **New Component**: Create in `frontend/src/components/`
5. **Type Support**: Update `frontend/src/types/`

### Code Standards
- **Backend**: Follow PEP 8 style guide
- **Frontend**: Follow Prettier + ESLint configuration
- **Comments**: Document complex logic only
- **Naming**: Use clear, descriptive names

## 📚 Dependencies

### Key Frontend Libraries
- `next`: React framework
- `@mui/material`: Component library
- `react-hook-form`: Form management
- `yup`: Schema validation
- `axios`: HTTP client
- `notistack`: Toast notifications

### Key Backend Libraries
- `fastapi`: Web framework
- `sqlalchemy`: ORM
- `pydantic`: Data validation
- `psycopg2`: PostgreSQL adapter

## 🤝 Contributing

When contributing:
1. Follow existing code style
2. Add comments for complex logic
3. Test thoroughly
4. Update documentation
5. Use meaningful commit messages

## 📄 License

Internal use only. PayAssured 2026.

## 🆘 Support

For issues or questions:
1. Check error messages in browser console
2. Review API docs at `/docs`
3. Check database logs
4. Verify environment variables

---

**Version**: 1.0.0  
**Last Updated**: January 2026  
**Status**: Production Ready ✅
