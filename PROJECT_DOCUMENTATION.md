# HR Management System (HRMS) - Complete Project Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [User Roles & Access Control](#user-roles--access-control)
4. [Technology Stack](#technology-stack)
5. [Backend Structure](#backend-structure)
6. [Frontend Structure](#frontend-structure)
7. [Authentication & Login Flow](#authentication--login-flow)
8. [Database Models](#database-models)
9. [API Endpoints](#api-endpoints)
10. [Financial Workflow](#financial-workflow)
11. [Data Flow Diagrams](#data-flow-diagrams)
12. [Deployment Guide](#deployment-guide)

---

## 🎯 Project Overview

This is a **Hybrid HR Management System** combining:
- **Employee Onboarding & Management**
- **Attendance Tracking**
- **Leave Management**
- **Finance & Expense Management** with Maker-Checker workflow
- **Admin Dashboard**

**Key Feature**: Dual authentication system with separate models for **Employee** and **User** accounts to support Maker-Checker financial approvals.

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                         │
│              HR-Frontend-final/src                          │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ HTTP/REST API
                       ↓
┌─────────────────────────────────────────────────────────────┐
│              BACKEND (Django REST)                          │
│           HR-BACKEND/hrms (Django 4.2.7)                   │
├─────────────────────────────────────────────────────────────┤
│ Apps:                                                       │
│ ├─ accounts      (User & Role Management)                 │
│ ├─ app1          (Employee & Candidate Data)               │
│ ├─ attendance    (Attendance Tracking)                    │
│ ├─ leave         (Leave Management)                        │
│ ├─ finance       (Advances, Expenses, Approvals)          │
│ ├─ login         (Authentication)                          │
│ ├─ common        (Shared Choices & Utils)                 │
│ └─ hrms          (Django Settings & URLs)                  │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ↓
        ┌──────────────────────────┐
        │    SQLite Database       │
        │    (db.sqlite3)          │
        └──────────────────────────┘
```

---

## 👥 User Roles & Access Control

### Three Main Roles:

| Role | Permissions | Dashboard | Features |
|------|------------|-----------|----------|
| **ADMIN** | Full system access | Admin Dashboard | Approve/Reject all expenses, User management, System settings |
| **MAKER** | Create expense requests | Home Dashboard | Submit expenses, View personal advances, Track status |
| **CHECKER** | Review & approve expenses | Approval Dashboard | Review expenses, Approve/Reject, Allocate advances |

### Role Assignment in Database:
- **User.role** (in accounts app) - Primary role
- **MakerCheckerRoleAssignment.role** (in accounts app) - Specific role for finance workflow
- **Employee.role** (in app1 app) - Legacy employee role

---

## 💻 Technology Stack

### Backend
- **Framework**: Django 4.2.7
- **Database**: SQLite
- **API**: Django REST Framework (DRF)
- **Authentication**: JWT (djangorestframework-simplejwt)
- **CORS**: django-cors-headers
- **Filtering**: django-filters

### Frontend
- **Framework**: React 18
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Build Tool**: Create React App
- **Storage**: localStorage (for tokens & user data)

### Dependencies
- **Backend**: See [requirements.txt](HR-BACKEND/hrms/requirements.txt)
- **Frontend**: See [package.json](HR-Frontend-final/package.json)

---

## 📂 Backend Structure

```
HR-BACKEND/hrms/
├── manage.py                  # Django management
├── requirements.txt           # Python dependencies
├── db.sqlite3                 # SQLite database
│
├── hrms/                      # Django Project Settings
│   ├── settings.py           # App config, database, middleware
│   ├── urls.py               # Main URL routing
│   ├── wsgi.py               # WSGI config
│   └── asgi.py               # ASGI config
│
├── accounts/                  # User & Role Management
│   ├── models.py             # User, MakerCheckerRoleAssignment
│   ├── views.py              # User management endpoints
│   ├── serializers.py        # DRF serializers
│   ├── urls.py               # Account URLs
│   └── migrations/           # Database migrations
│
├── app1/                      # Employee & Candidate Management
│   ├── models.py             # Candidate, Education, Experience, Employee
│   ├── views.py              # Employee CRUD endpoints
│   ├── serializers.py        # Data serialization
│   ├── urls.py               # Employee URLs
│   └── migrations/           # Database migrations
│
├── attendance/               # Attendance Tracking
│   ├── models.py             # Attendance records
│   ├── views.py              # Mark attendance, view history
│   ├── serializers.py        # Attendance serializers
│   ├── urls.py               # Attendance URLs
│   └── migrations/           # Database migrations
│
├── leave/                    # Leave Management
│   ├── models.py             # Leave requests, approvals
│   ├── views.py              # Leave request endpoints
│   ├── serializers.py        # Leave serializers
│   ├── urls.py               # Leave URLs
│   └── migrations/           # Database migrations
│
├── finance/                  # 🔥 CORE FINANCIAL WORKFLOW
│   ├── models.py             # Advance, Expense, LedgerEntry
│   ├── views.py              # Expense CRUD, approvals
│   ├── serializers.py        # Expense & Advance serializers
│   ├── services.py           # Business logic (approve, reject)
│   ├── permissions.py        # Role-based permissions
│   ├── email_service.py      # Workflow email notifications
│   ├── urls.py               # Finance URLs
│   ├── management/           # Django management commands
│   ├── migrations/           # Database migrations
│   └── tests.py              # Unit tests
│
├── login/                    # Authentication
│   ├── views.py              # 🔑 login_view() - Main login endpoint
│   ├── urls.py               # Login URLs
│   └── migrations/           # Database migrations
│
└── common/                   # Shared Utilities
    ├── choices.py            # UserRole, ExpenseStatus, AdvanceStatus
    └── utils.py              # Helper functions (money, date validation)
```

---

## 📱 Frontend Structure

```
HR-Frontend-final/src/
├── App.js                     # 🔑 Main routing & ProtectedRoute
├── App.css                    # Global styles
├── index.js                   # React entry point
│
├── components/               # 🎨 Main Components
│   ├── Login.js              # Login page, token storage
│   ├── Home.js               # Protected home dashboard
│   ├── Navbar.jsx            # Top navigation
│   ├── Sidebar.jsx           # Role-based sidebar menu
│   ├── AdminPanel.js         # Admin dashboard
│   ├── EmployeesList.js      # Employee CRUD
│   ├── CandidatesList.js     # Candidate onboarding
│   ├── ApproveLeave.js       # Leave approvals
│   ├── EmployeeRequestsTable.jsx # Expense requests
│   ├── HrApprovalTable.jsx   # Finance approvals
│   ├── FileUpload.jsx        # Bill upload component
│   └── RoleCards.jsx         # Role-based dashboards
│
├── accounts/                 # Accounts Module
│   ├── AccountsApp.jsx       # Accounts routing
│   ├── components/           # Account-specific components
│   └── pages/                # Account pages
│
├── public/
│   ├── index.html            # HTML template
│   ├── manifest.json         # PWA manifest
│   └── robots.txt            # SEO
│
├── package.json              # Dependencies & scripts
├── tailwind.config.js        # Tailwind CSS config
└── postcss.config.js         # PostCSS config
```

---

## 🔐 Authentication & Login Flow

### Step 1: Frontend Login Form
```jsx
// Location: HR-Frontend-final/src/components/Login.js
const handleSubmit = async (e) => {
  e.preventDefault();
  const res = await fetch("http://127.0.0.1:8000/api/login/", {
    method: "POST",
    body: JSON.stringify({
      email: formData.email,
      password: formData.password,
    }),
  });
  const data = await res.json();
```

**API Endpoint**: `POST /api/login/`

### Step 2: Backend Validation
```python
# Location: HR-BACKEND/hrms/login/views.py
@api_view(['POST'])
def login_view(request):
    email = request.data.get('email')
    password = request.data.get('password')
    
    # Lookup in Employee model (app1)
    employee = Employee.objects.filter(email=email).first()
    
    # Validate password
    if not check_password(password, employee.password):
        return Response({"error": "Invalid password"}, status=400)
    
    # Generate JWT tokens
    refresh = RefreshToken.for_user(employee)
    
    return Response({
        "access": str(refresh.access_token),
        "refresh": str(refresh),
        "user_id": employee.id,
        "name": employee.name,
        "role": employee.role,
        ...
    })
```

### Step 3: Frontend Token Storage
```javascript
// In localStorage (persists across sessions)
localStorage.setItem("petty-cash-access", data.access);     // JWT access token
localStorage.setItem("petty-cash-refresh", data.refresh);   // JWT refresh token
localStorage.setItem("role", data.role);                    // User role (ADMIN/MAKER/CHECKER)
localStorage.setItem("userId", data.user_id);
localStorage.setItem("userName", data.name);
localStorage.setItem("employeeId", data.employee_id);
```

### Step 4: Protected Routes
```jsx
// Location: HR-Frontend-final/src/App.js
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("petty-cash-access");
  
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
};

// Usage
<Route path="/home/*" element={<ProtectedRoute><Home /></ProtectedRoute>} />
```

---

## 📊 Database Models

### 1. User Model (accounts app)
```python
class User(AbstractUser):
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=255)
    role = models.CharField(max_length=20, choices=UserRole.choices)
    employee = models.OneToOneField("app1.Employee", on_delete=models.PROTECT)
```

**Roles**: ADMIN, MAKER, CHECKER

### 2. Employee Model (app1 app)
```python
class Employee(models.Model):
    employee_id = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=200)
    email = models.EmailField()
    password = models.CharField(max_length=255)
    phone = models.CharField(max_length=15)
    department = models.CharField(max_length=100)
    date_of_joining = models.DateField()
    role = models.CharField(max_length=20, choices=[
        ('hr', 'HR'),
        ('checker', 'Checker'),
        ('employee', 'Employee'),
        ('admin', 'Admin'),
    ])
```

### 3. Candidate Model (app1 app)
```python
class Candidate(models.Model):
    first_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=10)
    password = models.CharField(max_length=255)
    aadhaar = models.CharField(max_length=12)
    pan = models.CharField(max_length=10)
    status = models.CharField(max_length=50, default="Pending")
```

### 4. Advance Model (finance app) 🔥
```python
class Advance(models.Model):
    reference = models.CharField(max_length=30, unique=True)
    maker = models.ForeignKey(User, related_name="advances")
    allocated_by = models.ForeignKey(User, related_name="allocated_advances")
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)
    spent_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    balance_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    status = models.CharField(choices=[
        ('ACTIVE', 'Active'),
        ('PARTIALLY_USED', 'Partially Used'),
        ('EXHAUSTED', 'Exhausted'),
        ('CLOSED', 'Closed'),
    ])
```

**Validation**: `maker.role == MAKER`, `allocated_by.role in (CHECKER, ADMIN)`

### 5. Expense Model (finance app) 🔥
```python
class Expense(models.Model):
    reference = models.CharField(max_length=30, unique=True)
    advance = models.ForeignKey(Advance, related_name="expenses")
    maker = models.ForeignKey(User, related_name="expenses")
    payable_to = models.CharField(max_length=255)
    expense_date = models.DateField()
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    category = models.CharField(max_length=255)
    purpose = models.TextField()
    payment_mode = models.CharField(max_length=50)
    bill_file = models.FileField(upload_to='bills/', validators=[validate_bill_file])
    status = models.CharField(choices=[
        ('DRAFT', 'Draft'),
        ('SUBMITTED', 'Submitted'),
        ('REVIEWED', 'Reviewed'),
        ('APPROVED', 'Approved'),
        ('BILL_SUBMITTED', 'Bill Submitted'),
        ('CLOSED', 'Closed'),
        ('REJECTED', 'Rejected'),
    ])
    reviewed_by = models.ForeignKey(User, related_name="expenses_to_review")
    approved_by = models.ForeignKey(User, related_name="expenses_to_approve")
    rejection_reason = models.TextField(blank=True)
```

**Validation**: `maker.role == MAKER`, `reviewed_by.role in (CHECKER, ADMIN)`, `approved_by.role in (CHECKER, ADMIN)`

---

## 🌐 API Endpoints

### Authentication
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/login/` | User login |
| POST | `/api/auth/refresh/` | Refresh JWT token |

### Employees
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/app1/employees/` | List all employees |
| POST | `/api/app1/employees/` | Create employee |
| GET | `/api/app1/employees/{id}/` | Get employee details |
| PUT | `/api/app1/employees/{id}/` | Update employee |
| DELETE | `/api/app1/employees/{id}/` | Delete employee |

### Candidates
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/app1/candidates/` | List candidates |
| POST | `/api/app1/candidates/` | Create candidate |
| GET | `/api/app1/candidates/{id}/` | Get candidate details |

### Attendance
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/attendance/mark/` | Mark attendance |
| GET | `/api/attendance/history/` | View attendance history |

### Leave
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/leave/request/` | Request leave |
| GET | `/api/leave/requests/` | List leave requests |
| POST | `/api/leave/approve/` | Approve leave |

### Finance 🔥
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/finance/advances/` | Create advance (by ADMIN/CHECKER) |
| GET | `/api/finance/advances/` | List advances |
| POST | `/api/finance/expenses/` | Submit expense (by MAKER) |
| GET | `/api/finance/expenses/` | List expenses |
| POST | `/api/finance/expenses/{id}/review/` | Review expense (by CHECKER) |
| POST | `/api/finance/expenses/{id}/approve/` | Approve expense (by ADMIN/CHECKER) |
| POST | `/api/finance/expenses/{id}/reject/` | Reject expense |

---

## 💰 Financial Workflow

### Expense Approval Flow

```
┌──────────────────────────────────────────────────────────────┐
│                     EXPENSE LIFECYCLE                        │
└──────────────────────────────────────────────────────────────┘

1️⃣ MAKER Creates Expense
   ├─ Status: DRAFT
   ├─ Can edit/delete
   └─ Connected to an Advance

        ↓

2️⃣ MAKER Submits Expense
   ├─ Status: SUBMITTED
   ├─ Email sent to CHECKER
   ├─ Cannot edit

        ↓

3️⃣ CHECKER Reviews Expense
   ├─ Status: REVIEWED
   ├─ Checker sees all details
   ├─ Can approve → APPROVED or reject → REJECTED

        ↓

4️⃣ (If APPROVED) MAKER Uploads Bill
   ├─ Status: BILL_SUBMITTED
   ├─ Bill file validation (PDF, PNG, JPG, max 5MB)

        ↓

5️⃣ ADMIN Final Approval
   ├─ Status: APPROVED
   ├─ Or REJECTED
   └─ Email notification to MAKER

        ↓

6️⃣ Expense Closed
   ├─ Status: CLOSED
   ├─ Amount deducted from Advance
   ├─ Advance balance updated
```

### Key Roles in Finance

| Role | Actions | View |
|------|---------|------|
| **ADMIN** | Allocate advances, Approve expenses, Reject expenses | All expenses |
| **MAKER** | Submit expenses, Upload bills | Own expenses |
| **CHECKER** | Review & approve/reject expenses | All expenses |

### Advance Lifecycle

```
ACTIVE (Initial)
  ├─ Balance = Total Amount
  └─ When expenses added → PARTIALLY_USED

PARTIALLY_USED
  ├─ 0 < Balance < Total Amount
  └─ Expenses tracking balance

EXHAUSTED
  ├─ Balance = 0
  ├─ All money spent
  └─ Can close to CLOSED

CLOSED
  └─ No new expenses allowed
```

---

## 📈 Data Flow Diagrams

### Login Flow
```
Frontend                          Backend                     Database
(React)                         (Django)                    (SQLite)
  │                               │                           │
  │─── POST /api/login/ ────────→ │                           │
  │   {email, password}           │                           │
  │                               │─── Query Employee ────→  │
  │                               │                           │
  │                               │ ← Employee record ────  │
  │                               │                           │
  │                               │ Check password            │
  │                               │ Generate JWT token        │
  │                               │                           │
  │ ← JSON response ──────────────│                           │
  │ {access, refresh, role}       │                           │
  │                               │                           │
  │ Save to localStorage          │                           │
  │ Redirect to /home             │                           │
```

### Expense Submission Flow
```
MAKER Frontend               Backend API              CHECKER         Email Service
      │                           │                    │                    │
      │──── Submit Expense ─────→ │                    │                    │
      │   (POST /api/finance/)    │                    │                    │
      │                           │                    │                    │
      │                           │─── Create Expense──│                    │
      │                           │─── Update Status   │                    │
      │                           │    to SUBMITTED    │                    │
      │                           │                    │                    │
      │                           │─────────────────────→ Send Email ──────→│
      │                           │                    │                    │
      │ ← Success 200            │                    │                    │
      │                           │                    │                    │
      │ Expense in SUBMITTED      │ CHECKER Views      │                    │
      │ status                    │ Pending Expenses   │                    │
      │                           │                    │                    │
      │                           │ ← Accept/Reject ──│                    │
      │                           │                    │                    │
      │ ← Update Status          │ Update Expense     │                    │
      │   APPROVED/REJECTED      │ Status             │                    │
```

### Advance & Expense Connection
```
Employee (MAKER)
    ↓
Request → Advance (allocated by CHECKER/ADMIN)
          ├─ Total Amount = X
          ├─ Spent Amount = 0
          └─ Balance Amount = X
              ↓
            Expense 1
            ├─ Amount = 500
            ├─ Status = APPROVED
            └─ Advance.spent = 500, Balance = X - 500
              ↓
            Expense 2
            ├─ Amount = 300
            ├─ Status = APPROVED
            └─ Advance.spent = 800, Balance = X - 800
```

---

## 🚀 Deployment Guide

### Prerequisites
- Python 3.9+
- Node.js 14+
- pip (Python package manager)
- npm (Node package manager)

### Backend Setup

```bash
# 1. Navigate to backend
cd HR-BACKEND/hrms

# 2. Create virtual environment
python -m venv venv

# 3. Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# 4. Install dependencies
pip install -r requirements.txt

# 5. Run migrations
python manage.py migrate

# 6. Create superuser (for Django admin)
python manage.py createsuperuser

# 7. Run development server
python manage.py runserver

# Server runs on: http://127.0.0.1:8000
```

### Frontend Setup

```bash
# 1. Navigate to frontend
cd HR-Frontend-final

# 2. Install dependencies
npm install

# 3. Start development server
npm start

# App runs on: http://localhost:3000
```

### Database Seeding (Optional)

```bash
# Add sample employees
python manage.py shell
>>> from app1.models import Employee
>>> from django.contrib.auth.hashers import make_password
>>> Employee.objects.create(
...     employee_id="EMP001",
...     name="John Doe",
...     email="john@example.com",
...     password=make_password("password123"),
...     phone="9876543210",
...     department="IT",
...     date_of_joining="2024-01-01",
...     role="employee"
... )
```

### Important Configuration

**Backend CORS Settings** (`settings.py`):
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
```

**Frontend API Base URL** (in components):
```javascript
const API_BASE = "http://127.0.0.1:8000";
```

---

## 🔗 Key Connections Summary

### 1. Login System
- Frontend → `Login.js` → `POST /api/login/`
- Backend → `login/views.py` → Validates against `Employee` model
- Response → JWT tokens + user data → stored in `localStorage`

### 2. Role-Based Access
- After login, `role` stored in `localStorage`
- Sidebar (`Sidebar.jsx`) checks role to show/hide menu items
- `ProtectedRoute` component checks for token existence
- Backend endpoints validate role in permissions

### 3. Financial Workflow
- MAKER submits expense → Status = SUBMITTED
- Email notifies CHECKER → CHECKER reviews
- CHECKER approves → Email notifies MAKER
- MAKER uploads bill → Final approval
- ADMIN/CHECKER approves → Expense CLOSED

### 4. Database Connection
- `Employee` model (legacy from `app1`) - has login credentials
- `User` model (new in `accounts`) - for role assignment & approvals
- `MakerCheckerRoleAssignment` - links Employee to role
- Finance models reference `User` model for role validation

---

## 📝 Important Notes

### Current Issues Found
1. **Duplicate Role Check** (Sidebar.jsx lines 183-186) - Redundant condition checking `role === "admin"` twice
2. **Two User Systems** - Both `Employee` (app1) and `User` (accounts) exist; need migration strategy

### Next Steps
1. Migrate completely to `User` model (remove Employee login model)
2. Implement refresh token rotation for security
3. Add role-based API middleware for all endpoints
4. Add logging & audit trails
5. Implement proper error handling & validation

---

**Last Updated**: April 1, 2026  
**Project Status**: Development  
**Version**: 1.0
