# HR System - Complete Documentation Summary

## 📚 Documentation Files Created

This comprehensive overview package includes:

1. **PROJECT_ARCHITECTURE_OVERVIEW.md** (Main Document)
   - Complete backend architecture & Django configuration
   - All database models with relationships
   - Full API endpoints documentation
   - Frontend structure & components
   - Complete data flows for all workflows
   - Role-based access control details
   - File locations & connections

2. **WORKFLOW_DIAGRAMS.md** (Visual Guides)
   - ASCII workflow diagrams for all major processes
   - Expense workflow (Allocate → Create → Submit → Approve → Close)
   - Leave management workflow
   - Attendance check-in/check-out workflow
   - Candidate management workflow
   - Role-based navigation & access flows
   - Database model relationship diagrams
   - JWT token flow & authentication

3. **API_ENDPOINTS_REFERENCE.md** (Quick Reference)
   - All API endpoints organized by module
   - Request/response specifications
   - Required authentication levels
   - Example cURL commands
   - Error codes & responses
   - Frontend API client setup
   - Testing commands

---

## 🎯 Quick Start Guide

### Backend Setup
```bash
cd HR-BACKEND/hrms
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
# Runs on http://localhost:8000
```

### Frontend Setup
```bash
cd HR-Frontend-final
npm install
npm start
# Runs on http://localhost:3000
```

### Access Points

| URL | Purpose | Default Route |
|-----|---------|----------------|
| http://localhost:3000 | HR Dashboard | `/home` |
| http://localhost:3000/accounts | Maker/Checker Finance | `/accounts/login` |
| http://localhost:8000/api | Backend API | `/api/auth/login/` |
| http://localhost:8000/admin | Django Admin | (for superuser only) |

---

## 🔑 Three Main Authentication Flows

### Flow 1: HR Employee Login
```
Email + Password → Employee model lookup
→ Password verification → JWT generation
→ Role returned (admin, hr, finance, employee)
→ Redirect to /home (HR Dashboard)
→ Access: Attendance, Leave, Candidates, Onboarding
```

### Flow 2: Maker/Checker Login
```
Username (employee_id) + Password → accounts.User lookup
→ Password verification → Validate MakerCheckerRoleAssignment
→ JWT generation → Role returned (MAKER, CHECKER, ADMIN)
→ Redirect to /accounts/maker or /accounts/checker
→ Access: Expense workflow (Create, Review, Approve)
```

### Flow 3: Admin Access
```
Can login via both flows
→ Access to HR Dashboard (/home)
→ Access to Accounts Dashboard (/accounts/admin)
→ Full system visibility & control
```

---

## 📊 System Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                      │
│  ┌────────────────────┬────────────────────────────────┐ │
│  │   HR App (/)       │  Accounts App (/accounts)      │ │
│  │                    │                                │ │
│  │ • Dashboard        │ • MAKER Dashboard             │ │
│  │ • Candidates       │ • Create Expense              │ │
│  │ • Employees        │ • My Expenses                 │ │
│  │ • Leave            │ • Upload Bill                 │ │
│  │ • Attendance       │                                │ │
│  │ • Admin Panel      │ • CHECKER Dashboard           │ │
│  │                    │ • Pending Approvals           │ │
│  │                    │ • Allocate Advance            │ │
│  │                    │ • Reports                     │ │
│  └────────────────────┴────────────────────────────────┘ │
│                          ↓ REST API                      │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│              BACKEND (Django Rest Framework)             │
│  ┌──────────┬──────────┬─────────┬──────────┬────────┐  │
│  │ accounts │  app1    │ finance │  leave   │ attend │  │
│  │          │          │         │          │  ance  │  │
│  │ • Auth   │ • Cand.. │ • Adv.. │ • Apply │ • Check│  │
│  │ • Users  │ • Empl.. │ • Exp.. │ • List  │ • in   │  │
│  │ • Roles  │ • Edu    │ • Lgr.. │ • App.. │ • out  │  │
│  │          │ • Exp    │ • Bill  │ • Rejet │ • List │  │
│  └──────────┴──────────┴─────────┴──────────┴────────┘  │
│                          ↓ ORM                          │
│  ┌───────────────────────────────────────────────────┐  │
│  │         SQLite Database (db.sqlite3)              │  │
│  │                                                   │  │
│  │ • Users & Employees                              │  │
│  │ • Advances & Expenses & Ledger                   │  │
│  │ • Leave & Attendance                             │  │
│  │ • Candidates & Education & Experience           │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 🔐 Role-Based Access Matrix

| Feature | ADMIN | MAKER | CHECKER | HR Employee |
|---------|-------|-------|---------|-------------|
| **View own expenses** | ✅ | ✅ | ✅ | ❌ |
| **Create expense** | ✅ | ✅ | ❌ | ❌ |
| **Review expense** | ✅ | ❌ | ✅ | ❌ |
| **Approve/Reject** | ✅ | ❌ | ✅ | ❌ |
| **Allocate advance** | ✅ | ❌ | ✅ | ❌ |
| **Upload bill** | ✅ | ✅ | ❌ | ❌ |
| **Close expense** | ✅ | ❌ | ✅ | ❌ |
| **View reports** | ✅ | ❌ | ✅ | ❌ |
| **Manage candidates** | ✅ | ❌ | ❌ | ✅ |
| **Manage employees** | ✅ | ❌ | ❌ | ✅ |
| **Approve leaves** | ✅ | ❌ | ❌ | ✅ |
| **View all attendance** | ✅ | ❌ | ❌ | ✅ |

---

## 🔄 Main Feature Workflows

### 1. Expense Workflow (Finance)
```
Advance Allocated (CHECKER)
    ↓
Expense Created (MAKER) [DRAFT]
    ↓
Expense Submitted (MAKER) [SUBMITTED]
    ↓
Expense Reviewed (CHECKER) [REVIEWED]
    ↓
Expense Approved (CHECKER) [APPROVED]
    ↓
Bill Uploaded (MAKER) [BILL_SUBMITTED]
    ↓
Expense Closed (CHECKER) [CLOSED]
    ↓
Balance Updated & Ledger Entry Created
```

### 2. Leave Workflow (HR)
```
Employee Apply Leave [PENDING]
    ↓
Admin Review
    ↓
APPROVED or REJECTED
    ↓
Employee Notified
```

### 3. Attendance Workflow (HR)
```
Employee Check-in (Morning)
    ↓
Employee Check-out (Evening)
    ↓
Record Complete (Present)
    ↓
Dashboard Shows Daily/Monthly Stats
```

### 4. Candidate Workflow (HR)
```
Add Candidate (HR User)
    ↓
Add Education & Experience
    ↓
Upload Photo
    ↓
Status: Pending/Approved/Rejected
    ↓
Convert to Employee (if approved)
```

---

## 💾 Database Models Overview

### Core Models
- **User** (accounts) - System users with roles
- **Employee** (app1) - HR employees with basic info
- **Candidate** (app1) - Job applicants with education/experience
- **MakerCheckerRoleAssignment** (accounts) - Links Employee to Maker/Checker User

### Finance Models
- **Advance** - Cash advance to makers (tracks total/spent/balance)
- **Expense** - Individual expense claims against advance
- **LedgerEntry** - Audit trail of all financial transactions
- **Notification** - System notifications for workflow events
- **AuditLog** - Compliance audit trail

### HR Models
- **Leave** - Leave requests (Pending, Approved, Rejected)
- **Attendance** - Daily check-in/check-out records

---

## 🔗 API Structure

### Authentication Module
```
POST   /api/auth/login/              → Login & get JWT
POST   /api/auth/refresh/            → Refresh access token
GET    /api/auth/me/                 → Current user info
POST   /api/auth/logout/             → Logout
```

### Finance Module
```
GET/POST   /api/finance/advances/       → Advance management
GET/POST   /api/finance/expenses/       → Expense management
GET        /api/finance/ledger/         → Ledger entries
GET        /api/finance/bills/pending-verification/  → Pending bills
GET        /api/finance/reports/        → Financial reports
```

### HR Module
```
GET/POST   /api/app1/candidates/        → Candidate management
GET        /api/app1/employees/         → Employee listing
POST/GET   /api/leave/apply/            → Leave application
POST/GET   /api/attendance/check-in/    → Check-in
POST/GET   /api/attendance/check-out/   → Check-out
```

---

## 🛠 Technical Stack

### Backend
- **Framework:** Django 4.2.7
- **API:** Django REST Framework
- **Database:** SQLite
- **Authentication:** JWT (rest_framework_simplejwt)
- **Permissions:** Role-based access control

### Frontend
- **Framework:** React.js
- **Routing:** React Router v6
- **HTTP Client:** Fetch API + Axios
- **Storage:** localStorage (JWT tokens)
- **Styling:** Tailwind CSS

### Key Dependencies
- `djangorestframework` - REST API
- `djangorestframework-simplejwt` - JWT auth
- `django-cors-headers` - CORS support
- `django-filter` - Query filtering
- `react-router-dom` - Frontend routing
- `axios` - HTTP requests

---

## ✅ Testing Checklist

Before deployment, verify:

- [ ] Backend runs on http://localhost:8000
- [ ] Frontend runs on http://localhost:3000
- [ ] CORS is properly configured
- [ ] Database migrations are applied
- [ ] JWT tokens are stored/retrieved correctly
- [ ] All three login flows work
- [ ] Expense workflow completes end-to-end
- [ ] Role-based access is enforced
- [ ] Bill uploads work correctly
- [ ] Token refresh on expiry works
- [ ] Logout clears tokens
- [ ] All API endpoints respond with correct data

---

## 📝 Key Files Reference

### Backend Core
- `hrms/settings.py` - Django configuration
- `hrms/urls.py` - Main URL router
- `accounts/models.py` - User & role models
- `finance/models.py` - Advance & expense models
- `common/choices.py` - Enum definitions

### Frontend Core
- `App.js` - Main router & auth check
- `components/Home.js` - HR dashboard
- `components/Login.js` - HR login
- `accounts/AccountsApp.jsx` - Accounts sub-app router
- `accounts/components/AppProviders.jsx` - Auth context
- `accounts/components/appCore.js` - API configuration

---

## 🚀 Deployment Notes

### Production Checklist
- [ ] Change `DEBUG = False` in settings.py
- [ ] Set `ALLOWED_HOSTS` to production domain
- [ ] Use environment variables for secrets
- [ ] Configure proper CORS origins
- [ ] Use secure session cookies
- [ ] Enable HTTPS
- [ ] Set up proper database
- [ ] Configure static files serving
- [ ] Set up error logging
- [ ] Enable rate limiting

### Environment Variables
```
DJANGO_SECRET_KEY=<your_secret_key>
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=yourdomain.com
REACT_APP_API_BASE_URL=https://yourdomain.com/api/
DATABASE_URL=psycopg2://user:password@host/dbname
```

---

## 📞 Support & Debugging

### Common Issues

**Issue:** Token not persisting
**Solution:** Check localStorage keys match: `"petty-cash-access"`

**Issue:** CORS error
**Solution:** Ensure Django CORS_ALLOWED_ORIGINS includes frontend URL

**Issue:** 401 Unauthorized on API calls
**Solution:** Check token is being sent in Authorization header

**Issue:** Expense not appearing after creation
**Solution:** Verify expense status and user role match query filters

---

## 📋 Documentation Map

```
PROJECT_ARCHITECTURE_OVERVIEW.md
  ├─ Backend Settings & Configuration
  ├─ All Database Models (detailed)
  ├─ All API Endpoints (with examples)
  ├─ Frontend Structure
  ├─ Login Flows (3 scenarios)
  ├─ Complete Data Flows
  ├─ Role-Based Access Details
  └─ File Locations & References

WORKFLOW_DIAGRAMS.md
  ├─ Expense Workflow (step-by-step)
  ├─ Leave Workflow
  ├─ Attendance Workflow
  ├─ Candidate Management
  ├─ Role-Based Navigation
  ├─ Database Relationships
  └─ JWT Token Flow

API_ENDPOINTS_REFERENCE.md
  ├─ All Endpoints (organized by module)
  ├─ Request/Response Specs
  ├─ Example API Calls
  ├─ cURL Commands
  ├─ Error Codes
  └─ Testing Guidelines
```

---

## 🎓 Learning Path

**For Frontend Developers:**
1. Read: App.js structure
2. Follow: Login flow (LOGIN_FLOW_1_HR)
3. Trace: Dashboard data loading (useEffect calls)
4. Understand: Protected routes & token checks

**For Backend Developers:**
1. Review: Django settings & apps
2. Study: Model relationships
3. Trace: API request flow (URL → View → Serializer → Model)
4. Implement: New endpoints following Expense workflow pattern

**For Full Owners/PMs:**
1. Understand: Three role types & their permissions
2. Follow: Complete expense workflow
3. Review: Database schema & data relationships
4. Check: Role-based access matrix

---

## 📞 Quick Reference Commands

```bash
# Backend Setup & Run
cd HR-BACKEND/hrms
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

# Frontend Setup & Run
cd HR-Frontend-final
npm install
npm start

# Access URLs
HR Dashboard: http://localhost:3000
Accounts App: http://localhost:3000/accounts
Backend API: http://localhost:8000/api
Django Admin: http://localhost:8000/admin
```

---

**Documentation created with complete system overview, visual workflows, and API quick reference. Ready for development, testing, and deployment!**
