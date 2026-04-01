# HR Management System - Complete Architecture Overview

## Project Structure

```
hrv4/
├── HR-BACKEND/
│   └── hrms/
│       ├── manage.py
│       ├── requirements.txt
│       ├── db.sqlite3
│       ├── hrms/
│       │   ├── settings.py          (Django Configuration)
│       │   ├── urls.py              (Main URL Router)
│       │   ├── wsgi.py
│       │   └── asgi.py
│       ├── accounts/                (Auth & Role Management)
│       ├── app1/                    (Candidate & Employee Management)
│       ├── attendance/              (Attendance Tracking)
│       ├── finance/                 (Expense & Advance Management)
│       ├── leave/                   (Leave Requests)
│       ├── login/                   (Simple Login - Legacy)
│       ├── common/                  (Shared Utilities & Choices)
│       └── media/
│
└── HR-Frontend-final/
    ├── package.json
    ├── src/
    │   ├── App.js                   (Main Router)
    │   ├── index.js
    │   ├── components/              (Main HR Dashboard)
    │   └── accounts/                (Accounts/Finance Sub-App)
    └── public/
```

---

## Backend Architecture

### 1. Django Settings Configuration

**File:** [hrms/settings.py](hrms/settings.py)

#### Installed Apps
```python
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',              # Cross-Origin Request Support
    'rest_framework',           # REST API Framework
    'rest_framework_simplejwt', # JWT Authentication
    'django_filters',           # Query Filtering
    'app1',                     # Candidate/Employee
    'attendance',               # Attendance
    'login',                    # Simple Login (Legacy)
    'leave',                    # Leave Management
    'finance',                  # Expenses & Advances
    'common',                   # Shared Utilities
    'accounts',                 # User & Role Management
]
```

#### Middleware Stack
```python
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',          # CORS handling
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
]
```

---

### 2. Main URL Configuration

**File:** [hrms/urls.py](hrms/urls.py)

```
API ROUTES:
└── /api/
    ├── app1/              → Employee & Candidate Management
    ├── attendance/        → Attendance Check-in/Check-out
    ├── login/             → Simple Login (Legacy)
    ├── leave/             → Leave Application & Approval
    ├── finance/           → Expenses, Advances, Ledger
    ├── auth/              → Authentication & Role Assignment
    │   ├── login/         → JWT Login
    │   ├── refresh/       → Token Refresh
    │   ├── me/            → Current User Info
    │   ├── logout/        → Logout
    │   ├── role-assignments/  → Maker/Checker Role Management
    │   ├── users/         → User CRUD
    │   └── checker-options/   → Checker Role Options
    └── auth/refresh/      → Token Refresh (Legacy)
```

---

### 3. Role Types (Defined in common.choices)

**File:** [common/choices.py](common/choices.py)

```python
class UserRole(models.TextChoices):
    ADMIN = "ADMIN", "Admin"           # Full System Access
    MAKER = "MAKER", "Maker"           # Create & Submit Expenses
    CHECKER = "CHECKER", "Checker"     # Review & Approve Expenses
```

#### Role Responsibilities

| Role | Permissions |
|------|-------------|
| **ADMIN** | • System administration<br>• Full reports/dashboard<br>• Allocate advances<br>• Approve expenses<br>• Manage all users |
| **MAKER** | • Create/submit expenses<br>• View own advance balance<br>• Upload bills<br>• View own expenses<br>• Track attendance |
| **CHECKER** | • Review submitted expenses<br>• Allocate advances to makers<br>• Approve/reject expenses<br>• View pending approvals<br>• Financial reports |

---

### 4. Database Models

#### A. Authentication & Users

**File:** [accounts/models.py](accounts/models.py)

```python
class User(AbstractUser):
    """Custom User model with role-based access"""
    email = EmailField(unique=True)
    full_name = CharField(max_length=255)
    role = CharField(choices=UserRole.choices)  # ADMIN, MAKER, CHECKER
    employee = OneToOneField("app1.Employee", null=True, blank=True)
    
    # Login validation: Employee.email → User.role → API uses JWT tokens

class MakerCheckerRoleAssignment(models.Model):
    """Maps Employee to Maker/Checker User Account"""
    employee = OneToOneField("app1.Employee", on_delete=PROTECT)
    user = OneToOneField("accounts.User", on_delete=PROTECT)
    role = CharField(choices=UserRole.choices)
    is_active = BooleanField(default=True)
    assigned_by = ForeignKey("accounts.User", null=True, blank=True)
    assigned_at = DateTimeField(auto_now_add=True)
    
    # Purpose: An employee can have both a regular HR account AND a Maker/Checker account
```

#### B. Candidate & Employee Management

**File:** [app1/models.py](app1/models.py)

```python
class Candidate(models.Model):
    """Job Applicant Profile"""
    first_name = CharField(max_length=100)
    last_name = CharField(max_length=100, blank=True)
    email = EmailField()
    phone = CharField(max_length=10)
    password = CharField(max_length=255, null=True, blank=True)
    
    # Identity
    aadhaar = CharField(max_length=12)
    pan = CharField(max_length=10)
    uan = CharField(max_length=12, blank=True, null=True)
    official_email = EmailField(blank=True, null=True)
    
    # Address
    address_line1 = CharField(max_length=255, blank=True)
    address_line2 = CharField(max_length=255, blank=True)
    city = CharField(max_length=100, blank=True)
    
    # Career Info
    experience = CharField(max_length=100, blank=True)
    source = CharField(max_length=100, blank=True)
    skills = CharField(max_length=255, blank=True)
    department = CharField(max_length=100, default="IT")
    
    photo = ImageField(upload_to="candidates/photos/", blank=True, null=True)
    status = CharField(max_length=50, default="Pending")  # Pending, Approved, etc.
    date_of_joining = DateField(null=True, blank=True)

class Education(models.Model):
    """Candidate Education History"""
    candidate = ForeignKey(Candidate, on_delete=CASCADE, related_name="education")
    school = CharField(max_length=255)
    degree = CharField(max_length=255)
    field_of_study = CharField(max_length=255)
    start_date = DateField(blank=True, null=True)
    notes = TextField(blank=True)

class Experience(models.Model):
    """Candidate Work Experience"""
    candidate = ForeignKey(Candidate, on_delete=CASCADE, related_name="experiences")
    company_name = CharField(max_length=255)
    role = CharField(max_length=255)
    years = CharField(max_length=50)
    description = TextField(blank=True)

class Employee(models.Model):
    """Hired Employee / HR Staff"""
    name = CharField(max_length=100)
    email = EmailField(unique=True)
    phone = CharField(max_length=10)
    password = CharField(max_length=255)
    
    employee_id = CharField(max_length=50, unique=True)
    joining_date = DateField()
    department = CharField(max_length=100)
    
    role = CharField(
        max_length=50,
        choices=[...],
        default="employee"
    )  # employee, admin, hr, finance
    
    salary = DecimalField(max_digits=10, decimal_places=2)
    leave_balance = IntegerField(default=20)
    
    def save(self, *args, **kwargs):
        # Auto-hash password using make_password
        if not self.pk or (self.password and not self.password.startswith('pbkdf2_')):
            self.password = make_password(self.password)
        super().save(*args, **kwargs)
```

#### C. Finance Models

**File:** [finance/models.py](finance/models.py)

```python
class Advance(models.Model):
    """Cash Advance allocated to Maker by Checker"""
    reference = CharField(max_length=30, unique=True)  # AUTO001, AUTO002, etc.
    maker = ForeignKey(User, on_delete=PROTECT, related_name="advances")
    allocated_by = ForeignKey(User, on_delete=PROTECT, related_name="allocated_advances")
    
    total_amount = DecimalField(max_digits=12, decimal_places=2)
    spent_amount = DecimalField(max_digits=12, decimal_places=2, default=0)
    balance_amount = DecimalField(max_digits=12, decimal_places=2, default=0)
    
    status = CharField(
        choices=AdvanceStatus.choices,
        default=AdvanceStatus.ACTIVE
    )
    # Statuses: ACTIVE, PARTIALLY_USED, EXHAUSTED, CLOSED
    
    remarks = TextField(blank=True)
    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)
    
    def refresh_financials(self):
        """Auto-calculate balance and update status"""
        self.balance_amount = self.total_amount - self.spent_amount
        if self.balance_amount <= 0:
            self.status = AdvanceStatus.EXHAUSTED

class Expense(models.Model):
    """Expense claim against an Advance"""
    reference = CharField(max_length=30, unique=True)  # EXP001, EXP002, etc.
    advance = ForeignKey(Advance, on_delete=PROTECT, related_name="expenses")
    maker = ForeignKey(User, on_delete=PROTECT, related_name="expenses")
    
    payable_to = CharField(max_length=255)
    expense_date = DateField(default=timezone.localdate)
    amount = DecimalField(max_digits=12, decimal_places=2)
    amount_in_words = CharField(max_length=255, blank=True)
    
    category = CharField(max_length=255)  # Travel, Food, etc.
    purpose = TextField()
    payment_mode = CharField(max_length=50)  # Cash, Cheque, UPI, Bank Transfer
    transaction_reference = CharField(max_length=100, blank=True)
    remarks = TextField(blank=True)
    rejection_reason = TextField(blank=True)
    
    # Workflow Users
    reviewed_by = ForeignKey(User, on_delete=PROTECT, related_name="expenses_to_review")
    approved_by = ForeignKey(User, on_delete=PROTECT, related_name="expenses_to_approve")
    
    # Status: DRAFT → SUBMITTED → REVIEWED → APPROVED → BILL_SUBMITTED → CLOSED
    status = CharField(
        choices=ExpenseStatus.choices,
        default=ExpenseStatus.DRAFT
    )
    
    bill_file = FileField(upload_to="expense_bills/%Y/%m/%d/", blank=True, null=True)
    
    # Timestamps for workflow tracking
    created_at = DateTimeField(auto_now_add=True)
    submitted_at = DateTimeField(blank=True, null=True)
    reviewed_at = DateTimeField(blank=True, null=True)
    approved_at = DateTimeField(blank=True, null=True)
    bill_submitted_at = DateTimeField(blank=True, null=True)
    closed_at = DateTimeField(blank=True, null=True)

class LedgerEntry(models.Model):
    """Financial transaction log for Advance tracking"""
    advance = ForeignKey(Advance, on_delete=CASCADE, related_name="ledger_entries")
    expense = ForeignKey(Expense, on_delete=SET_NULL, null=True, blank=True)
    
    entry_type = CharField(choices=LedgerEntryType.choices)
    # ADVANCE: + to balance, SPEND: - from balance, ADJUSTMENT: manual correction
    
    amount = DecimalField(max_digits=12, decimal_places=2)
    balance_after = DecimalField(max_digits=12, decimal_places=2)
    note = TextField(blank=True)
    created_at = DateTimeField(auto_now_add=True)

class Notification(models.Model):
    """System notifications for workflow events"""
    notification_type = CharField(choices=NotificationType.choices)
    # EXPENSE_SUBMITTED, EXPENSE_REVIEWED, EXPENSE_APPROVED, etc.
    
    related_expense = ForeignKey(Expense, on_delete=CASCADE, null=True, blank=True)
    recipient = ForeignKey(User, on_delete=CASCADE)
    message = TextField()
    is_read = BooleanField(default=False)
    created_at = DateTimeField(auto_now_add=True)

class AuditLog(models.Model):
    """Track all system actions for compliance"""
    actor = ForeignKey(User, on_delete=CASCADE)
    action = CharField(max_length=255)
    related_expense = ForeignKey(Expense, on_delete=SET_NULL, null=True, blank=True)
    timestamp = DateTimeField(auto_now_add=True)
```

#### D. Leave & Attendance

**File:** [leave/models.py](leave/models.py) & [attendance/models.py](attendance/models.py)

```python
# LEAVE MODEL
class Leave(models.Model):
    user_id = IntegerField()  # filters by employee ID
    name = CharField(max_length=100)
    employee_id = CharField(max_length=50)
    department = CharField(max_length=100)
    
    leave_type = CharField(max_length=50)  # Sick, Casual, PTO, etc.
    from_date = DateField()
    to_date = DateField()
    reason = TextField()
    
    status = CharField(max_length=20, default="Pending")  # Pending, Approved, Rejected

# ATTENDANCE MODEL
class Attendance(models.Model):
    user_id = IntegerField()
    date = DateField()
    
    check_in = TimeField(null=True, blank=True)
    check_out = TimeField(null=True, blank=True)
    
    notes = TextField(blank=True, null=True)
    summary = TextField(blank=True, null=True)
    
    class Meta:
        unique_together = ('user_id', 'date')  # One entry per user per day
```

---

### 5. Backend API Endpoints

#### Authentication Endpoints

**File:** [accounts/views.py](accounts/views.py) & [accounts/urls.py](accounts/urls.py)

```
POST   /api/auth/login/
       - Input: { username, password }
       - Output: { access, refresh, user }
       - Purpose: Login with email or employee_id
       - Authentication: Maker/Checker or HR Employee

GET    /api/auth/me/
       - Output: Current user details
       - Purpose: Get authenticated user info
       - Requires: JWT Token

POST   /api/auth/logout/
       - Input: { refresh_token }
       - Purpose: Logout & invalidate tokens

POST   /api/auth/refresh/
       - Input: { refresh }
       - Output: { access }
       - Purpose: Refresh expired JWT token

GET    /api/auth/users/
GET    /api/auth/users/<id>/
POST   /api/auth/users/
PUT    /api/auth/users/<id>/
       - Purpose: Admin user management

POST   /api/auth/users/<id>/reset-password/
       - Purpose: Admin password reset

GET    /api/auth/role-assignments/
POST   /api/auth/role-assignments/
GET    /api/auth/role-assignments/<id>/
PUT    /api/auth/role-assignments/<id>/
       - Purpose: Maker/Checker role assignment management

GET    /api/auth/admin/dashboard/
       - Purpose: Admin dashboard statistics
       - Requires: ADMIN role

GET    /api/auth/checker-options/
       - Purpose: Get list of available checkers
       - Requires: ADMIN role
```

#### Finance Endpoints

**File:** [finance/views.py](finance/views.py) & [finance/urls.py](finance/urls.py)

```
ADVANCES:
GET    /api/finance/advances/
       - Query: status, maker, allocated_by
       - Filters: Maker only sees own, Checker sees all, Admin sees all

POST   /api/finance/advances/
       - Purpose: Allocate advance to maker
       - Requires: CHECKER role
       - Input: { maker_id, total_amount, remarks }

GET    /api/finance/advances/<id>/
GET    /api/finance/advances/<id>/ledger/
GET    /api/finance/advances/maker-balances/

EXPENSES:
GET    /api/finance/expenses/
POST   /api/finance/expenses/
       - Purpose: Create expense (DRAFT status)
       - Requires: MAKER role

GET    /api/finance/expenses/<id>/
PATCH  /api/finance/expenses/<id>/
       - Purpose: Update expense details

POST   /api/finance/expenses/<id>/submit/
       - Purpose: Submit expense for review (DRAFT → SUBMITTED)

POST   /api/finance/expenses/<id>/review/
       - Input: { status: REVIEWED }
       - Purpose: Review submitted expense (SUBMITTED → REVIEWED)
       - Requires: CHECKER role

POST   /api/finance/expenses/<id>/approve/
       - Purpose: Approve reviewed expense (REVIEWED → APPROVED)
       - Requires: CHECKER role

POST   /api/finance/expenses/<id>/reject/
       - Input: { reason }
       - Purpose: Reject expense at any stage
       - Requires: CHECKER role

POST   /api/finance/expenses/<id>/upload-bill/
       - Input: FormData with bill_file
       - Purpose: Upload bill PDF/image (APPROVED → BILL_SUBMITTED)
       - Requires: MAKER role

POST   /api/finance/expenses/<id>/close/
       - Purpose: Close expense after bill upload (BILL_SUBMITTED → CLOSED)
       - Requires: CHECKER role

BILLS:
GET    /api/finance/bills/pending-verification/
       - Purpose: Get expenses pending bill upload
       - Requires: CHECKER role

GET    /api/finance/ledger/
       - Purpose: Get ledger entries for an advance
```

#### Employee/Candidate Endpoints

**File:** [app1/views.py](app1/views.py) & [app1/urls.py](app1/urls.py)

```
CANDIDATES:
POST   /api/app1/candidates/
       - Purpose: Add new candidate
       - Input: FormData with photo + candidate details

GET    /api/app1/candidates/
       - Purpose: List all candidates

DELETE /api/app1/candidates/<id>/

EMPLOYEES:
GET    /api/app1/employees/
       - Query: user_id for filtering

GET    /api/app1/employees/<id>/

EDUCATION & EXPERIENCE:
GET    /api/app1/candidates/<id>/education/
POST   /api/app1/candidates/<id>/education/

GET    /api/app1/candidates/<id>/experience/
POST   /api/app1/candidates/<id>/experience/
```

#### Leave Endpoints

**File:** [leave/views.py](leave/views.py) & [leave/urls.py](leave/urls.py)

```
POST   /api/leave/apply/
       - Input: { user_id, leave_type, from_date, to_date, reason }
       - Purpose: Apply for leave

GET    /api/leave/list/
       - Query: user_id (returns user's leaves if provided, else all)
       - Purpose: List leaves

PUT    /api/leave/approve/<id>/
       - Purpose: Approve leave request

PUT    /api/leave/reject/<id>/
       - Purpose: Reject leave request

GET    /api/leave/employee/<user_id>/
       - Purpose: Get employee details for auto-fill
```

#### Attendance Endpoints

**File:** [attendance/views.py](attendance/views.py) & [attendance/urls.py](attendance/urls.py)

```
POST   /api/attendance/check-in/
       - Input: { user_id }
       - Purpose: Check-in (once per day)
       - Response: { message }

POST   /api/attendance/check-out/
       - Input: { user_id, summary }
       - Purpose: Check-out (once per day)

GET    /api/attendance/attendance/
       - Query: user_id
       - Purpose: Get user's attendance records

GET    /api/attendance/admin-dashboard/
       - Purpose: Admin dashboard with all employee attendance
```

#### Simple Login (Legacy)

**File:** [login/views.py](login/views.py)

```
POST   /api/login/
       - Input: { email, password }
       - Output: { access, refresh, user_id, name, role, employee_id, email }
       - Purpose: Employee simple login (generates JWT tokens)
       - Note: Uses Employee.email and Employee.password
```

---

## Frontend Architecture

### 1. Main App Structure

**File:** [HR-Frontend-final/src/App.js](HR-Frontend-final/src/App.js)

```jsx
App.js (Main Entry Point)
├── Login Route (/)
│   └── Login Component
├── Protected Route (/home/*)
│   └── Home Component (Requires JWT Token: "petty-cash-access")
└── Catch-all (*) → Redirects to /home or /

Authentication Check:
- Checks localStorage.getItem("petty-cash-access")
- If token exists: Navigate to /home
- If no token: Navigate to /
```

### 2. Token Management

**Storage Key:** `"petty-cash-access"` (JWT Access Token)

**Storage Location:** `localStorage` (not sessionStorage)

**Tokens Stored:**
```javascript
localStorage.setItem("petty-cash-access", data.access);      // JWT Access Token
localStorage.setItem("petty-cash-refresh", data.refresh);    // Refresh Token
localStorage.setItem("role", data.role);                     // User Role
localStorage.setItem("userId", data.user_id);                // Employee ID
localStorage.setItem("userName", data.name);                 // User's Name
localStorage.setItem("employeeId", data.employee_id);        // Employee ID
```

### 3. Login Flow

**File:** [src/components/Login.js](src/components/Login.js)

```
USER ENTERS CREDENTIALS
↓
handleSubmit() → POST /api/login/
↓
Backend Validates:
  1. Find Employee by email
  2. Check password hash
  3. Generate JWT tokens
↓
Response includes:
  - access token (JWT)
  - refresh token (JWT)
  - user_id, name, employee_id, role, email
↓
Store in localStorage
↓
Redirect to /home
↓
Protected Route checks token → ✅ Allows access
```

### 4. Frontend Routes & Components

**Home Dashboard Components:**
[src/components/Home.js](src/components/Home.js)

```jsx
Home Component Structure:
├── Sidebar Component               (Navigation menu)
├── Navbar Component                (Top bar with user info)
└── Routes (nested in Home)
    ├── Dashboard (/)                → Homepage/Summary
    ├── Onboarding (/onboarding)     → Add Candidates
    ├── Leave (/leave)               → Apply & Manage Leaves
    ├── Attendance (/attendance)     → Check-in/Check-out
    ├── Admin Dashboard (/admin)     → Admin approvals
    ├── Employee List (/employees)   → View all employees
    ├── Candidates List (/candidates) → View candidates
    └── Requests (/requests)         → Employee requests
```

**Component Library:**
```
src/components/
├── Home.js                    # Main dashboard layout & routes
├── Sidebar.jsx                # Navigation (CONDITIONAL by role)
├── Navbar.jsx                 # Top navigation bar
├── Login.js                   # Login form
├── RoleCards.jsx              # Dashboard cards for roles
├── EmployeeRequestForm.jsx    # Form to submit requests
├── EmployeeRequestsTable.jsx  # Display user requests
├── HrApprovalTable.jsx        # HR approval interface
├── AddCandidateModal.jsx      # Add new candidate modal
├── CandidateTable.jsx         # List candidates
├── CandidatesList.js          # Candidate page layout
├── EmployeesList.js           # Employee page layout
├── Education.jsx              # Education details form
├── Experience.jsx             # Experience details form
├── FileUpload.jsx             # File upload component
├── ApproveLeave.js            # Leave approval interface
└── AdminPanel.js              # Admin dashboard

Note: Sidebar has CONDITIONAL RENDERING based on role:
- Only ADMIN role sees "Admin Dashboard" option
- Components check localStorage.getItem("role")
```

### 5. Frontend Data Flow

#### Dashboard Page (/home)

```javascript
HomePage Component:
├── useEffect 1: Fetch user's attendance
│   GET /api/attendance/attendance/?user_id={userId}
│   ├── Count present_days (check_in + check_out)
│   ├── Count absent_days (no check_in)
│   └── Store in dashboard state
│
├── useEffect 2: Fetch employee details
│   GET /api/app1/employees/?user_id={userId}
│   └── Get user's department
│
└── useEffect 3: Fetch dashboard data
    GET /api/.../dashboard/  (Various endpoints)
```

#### Login Flow (Complete)

```
User fills email & password
↓
POST http://127.0.0.1:8000/api/login/
↓
Backend Response:
{
  "access": "eyJhbGciOiJIUzI1NiIs...",
  "refresh": "eyJhbGciOiJIUzI1NiIs...",
  "user_id": 123,
  "name": "John Doe",
  "employee_id": "EMP001",
  "department": "IT",
  "role": "admin",
  "email": "john@company.com"
}
↓
Store all data in localStorage
↓
Navigate to /home
↓
Home component reads from localStorage and displays personalized dashboard
```

#### Attendance Flow

```
User clicks Check-in
↓
POST /api/attendance/check-in/
Body: { "user_id": localStorage.userId }
↓
Backend:
1. Check if already checked in today
2. If not, create Attendance record with check_in time
3. Return success message
↓
User clicks Check-out
↓
POST /api/attendance/check-out/
Body: { "user_id": localStorage.userId, "summary": "..." }
↓
Backend:
1. Find today's attendance record
2. Set check_out time
3. Mark as complete
↓
Dashboard displays both check-in and check-out times
```

---

## Accounts Sub-App (Finance/Expenses)

### Structure

**File:** [src/accounts/AccountsApp.jsx](src/accounts/AccountsApp.jsx)

This is a separate React app within the main app used for **Maker/Checker** expense workflows.

```
/accounts/                           # Separate sub-application
├── components/
│   ├── AppProviders.jsx            # Auth Context & API Client
│   ├── appCore.js                  # API Base URL & Constants
│   └── FullScreenLoader.jsx
├── pages/
│   ├── LoginPage.jsx               # Maker/Checker Login
│   ├── DashboardPage.jsx           # Role-based Dashboard
│   ├── NewExpensePage.jsx          # Create new expense
│   ├── MyExpensesPage.jsx          # View own expenses
│   ├── PendingApprovalPage.jsx     # Checker: Approve expenses
│   ├── PendingVerificationPage.jsx # Checker: Review bills
│   ├── FinalBillVerificationPage.jsx
│   ├── AllocateAdvancePage.jsx     # Checker: Allocate advance
│   ├── ActiveAdvancesPage.jsx      # View active advances
│   ├── ExpenseDetailsPage.jsx      # View expense details
│   ├── AdvanceDetailsPage.jsx      # View advance details
│   ├── UploadBillPage.jsx          # Upload bill PDF
│   ├── ReportsPage.jsx             # Reports & Analytics
│   └── AdminDashboardPage.jsx      # Admin View
└── AccountsApp.jsx                  # Main Router
```

### Accounts Authentication (appCore.js)

**File:** [src/accounts/components/appCore.js](src/accounts/components/appCore.js)

```javascript
API_BASE_URL = "http://localhost:8000/api/"
APP_BASE_PATH = "/accounts"

ROLES = {
  ADMIN: "ADMIN",
  MAKER: "MAKER",
  CHECKER: "CHECKER"
}

ACCESS_TOKEN_KEY = "petty-cash-access"
REFRESH_TOKEN_KEY = "petty-cash-refresh"

SIDEBAR_SECTIONS = [
  {
    title: "Admin View",
    roles: [ROLES.ADMIN],
    items: [
      { label: "Admin Dashboard", path: "/admin/dashboard" },
      { label: "Reports", path: "/admin/reports" }
    ]
  },
  {
    title: "Maker View",
    roles: [ROLES.MAKER],
    items: [
      { label: "Dashboard", path: "/maker/dashboard" },
      { label: "New Expense", path: "/maker/new-expense" },
      { label: "My Expenses", path: "/maker/my-expenses" },
      { label: "Upload Bill", path: "/maker/upload-bill" }
    ]
  },
  {
    title: "Checker View",
    roles: [ROLES.CHECKER],
    items: [
      { label: "Dashboard", path: "/checker/dashboard" },
      { label: "Allocate Advance", path: "/checker/allocate-advance" },
      { label: "Pending Verification", path: "/checker/pending-verification" },
      { label: "Pending Approval", path: "/checker/pending-approval" },
      { label: "Active Advances", path: "/checker/active-advances" },
      { label: "Final Bill Verification", path: "/checker/final-bill-verification" },
      { label: "Reports", path: "/checker/reports" }
    ]
  }
]
```

### Accounts Auth Provider (AppProviders.jsx)

**File:** [src/accounts/components/AppProviders.jsx](src/accounts/components/AppProviders.jsx)

```jsx
AuthProvider Features:
├── Bootstrap on App Load
│   ├── Check if access token exists
│   ├── If yes: GET /api/auth/me/ to verify session
│   ├── If no: Clear auth & redirect to login
│
├── Login Function
│   └── POST /api/auth/login/ { username, password }
│
├── Logout Function
│   └── POST /api/auth/logout/ with refresh token
│
├── Token Refresh
│   └── Auto-refresh when token expires
│
└── useAuth Hook
    ├── isAuthenticated (boolean)
    ├── user (object)
    ├── role (ADMIN, MAKER, CHECKER)
    └── login(), logout(), refreshUser()
```

---

## Complete Data Flow: Expense Creation Workflow

### Step 1: Login (Maker)
```
1. Maker visits /accounts/login
2. Enters email/password
3. POST /api/auth/login/
4. Backend validates, returns JWT + user role (MAKER)
5. Store token in localStorage["petty-cash-access"]
6. AuthContext updates with role = MAKER
7. Redirect to /accounts/maker/dashboard
```

### Step 2: Allocate Advance (Checker)
```
1. Checker visits /accounts/checker/allocate-advance
2. Selects Maker from dropdown
3. Enters total amount to allocate
4. POST /api/finance/advances/
   {
     "maker": <maker_id>,
     "total_amount": 50000,
     "allocated_by": <checker_id>,
     "remarks": "Travel advance"
   }
5. Backend creates Advance record with status=ACTIVE
6. Checker sees confirmation: "Advance allocated"
```

### Step 3: Create Expense (Maker)
```
1. Maker visits /accounts/maker/new-expense
2. Selects Advance from dropdown (GET /api/finance/advances/ filtered for MAKER role)
3. Fills expense details:
   - Payable to
   - Amount
   - Category
   - Purpose
   - Payment Mode
   - Bill reference (if UPI)
4. Submits form
5. POST /api/finance/expenses/
   {
     "advance": <advance_id>,
     "maker": <maker_id>,
     "payable_to": "Vendor Name",
     "amount": 5000,
     "category": "Travel",
     "purpose": "Business trip",
     "payment_mode": "UPI",
     "transaction_reference": "UTR1234567890"
   }
6. Backend creates Expense with status=DRAFT
7. Expense saved, response includes expense ID
```

### Step 4: Submit Expense (Maker)
```
1. Maker views /accounts/maker/my-expenses
2. Clicks "Submit" button on DRAFT expense
3. POST /api/finance/expenses/<id>/submit/
4. Backend updates status: DRAFT → SUBMITTED
5. Creates Notification for Checker
6. Expense now appears in Checker's "Pending Approval" list
```

### Step 5: Review Expense (Checker)
```
1. Checker visits /accounts/checker/pending-approval
2. GET /api/finance/expenses/ filtered by status=SUBMITTED
3. Clicks on expense to view details
4. Reviews:
   - Amount vs available balance
   - Purpose and category
   - Supporting documents
5. Either:
   A. Approves: POST /api/finance/expenses/<id>/approve/
      - Status: SUBMITTED → REVIEWED → APPROVED
   B. Rejects: POST /api/finance/expenses/<id>/reject/
      - Status: SUBMITTED → REJECTED
      - Expense returns to Maker with rejection reason
```

### Step 6: Upload Bill (Maker)
```
1. Maker sees APPROVED expense in My Expenses
2. Clicks "Upload Bill"
3. FormData POST /api/finance/expenses/<id>/upload-bill/
   - file: <PDF or image>
   - Status updated: APPROVED → BILL_SUBMITTED
4. Backend validates:
   - File type: PDF, PNG, JPG, JPEG
   - Max size: 5MB
5. Bill stored: media/expense_bills/<date>/
6. Notification sent to Checker for final verification
```

### Step 7: Verify & Close (Checker)
```
1. Checker visits /accounts/checker/final-bill-verification
2. Sees BILL_SUBMITTED expenses
3. Reviews uploaded bill
4. Clicks "Approve & Close"
5. POST /api/finance/expenses/<id>/close/
   - Status: BILL_SUBMITTED → CLOSED
   - Advance balance updated: balance = balance - expense_amount
   - LedgerEntry created for audit
   - Notification sent to Maker
6. Maker receives: "Your expense was closed and reimbursed"
```

### Final State
```
Advance:
- total_amount: 50000
- spent_amount: 5000 (from accepted expense)
- balance_amount: 45000
- status: PARTIALLY_USED (since spent > 0 but balance > 0)

Expense:
- status: CLOSED
- All workflow timestamps populated
- Bill file attached
- Full audit trail in AuditLog

Notification:
- Sent to both Maker and Checker
- Marked as read when viewed
```

---

## Complete Role Flow

### ADMIN Role Flow

```
Login:
- Can login with Admin user
- Receives JWT token with role=ADMIN

Dashboard:
- Full system visibility
- All pending approvals
- All reports & analytics
- User management

Permissions:
- Can approve/reject ANY expense (not just as Checker)
- Can allocate advances
- Can reset user passwords
- Can manage Maker/Checker role assignments
- Can view all audit logs
- Can view system-wide reports

API Access:
- GET /api/auth/users/               (All users)
- GET /api/auth/role-assignments/    (All assignments)
- POST /api/auth/role-assignments/   (Create role)
- GET /api/finance/expenses/          (All expenses)
- GET /api/finance/advances/          (All advances)
- POST /api/auth/users/<id>/reset-password/
```

### MAKER Role Flow

```
Login:
- Employee with MAKER role
- Created by Admin/Checker via MakerCheckerRoleAssignment
- Can have different account from HR login

Dashboard:
- Allocated advances & balance
- Submitted expenses & status
- Pending bill uploads
- Personal attendance

Permissions:
- Create/Submit expenses ONLY against OWN advance
- Upload bills for OWN approved expenses
- View OWN expense history
- Check-in/check-out attendance
- Cannot approve or review expenses
- Cannot allocate advances

API Access:
- GET /api/finance/advances/ (only own)
- POST /api/finance/expenses/ (own maker)
- POST /api/finance/expenses/<id>/upload-bill/
- GET /api/attendance/attendance/
```

### CHECKER Role Flow

```
Login:
- Employee with CHECKER role
- Created by Admin via MakerCheckerRoleAssignment

Dashboard:
- Pending verifications
- Pending approvals
- Active advances summary
- Maker performance metrics

Permissions:
- Review submitted expenses
- Approve/reject expenses
- Allocate new advances to makers
- Upload final bills for expenses
- View all expenses (not just own)
- View all advances
- See financial reports

Workflow:
1. Allocate Advance: Check -> to Maker
2. Review: Expense (SUBMITTED) -> Approve/Reject
3. Verify: Bill (uploaded) -> Approve & Close
4. Monitor: Ledger entries & balance tracking

API Access:
- POST /api/finance/advances/        (Create)
- GET /api/finance/expenses/         (All)
- POST /api/finance/expenses/<id>/review/
- POST /api/finance/expenses/<id>/approve/
- POST /api/finance/expenses/<id>/reject/
- POST /api/finance/expenses/<id>/close/
- GET /api/finance/bills/pending-verification/
```

---

## Database Connection Flow

### Frontend → Backend Connection

```
1. Frontend Configuration (appCore.js):
   - API_BASE_URL = "http://localhost:8000/api/"
   - TOKEN in localStorage
   
2. API Requests Setup (Axios interceptor):
   - Every request: 
     Authorization: "Bearer {ACCESS_TOKEN}"
   - Auto-refresh token if expired
   
3. SQLite Database:
   - Backend: SQLite at /HR-BACKEND/hrms/db.sqlite3
   - Auto-created tables from models
   - Connected via Django ORM
   
4. Request-Response Flow:
   Frontend Component
      ↓
   fetch() or axios()
      ↓
   POST/GET http://127.0.0.1:8000/api/...
      ↓
   Django REST Framework Router
      ↓
   URL Matching (hrms/urls.py)
      ↓
   ViewSet/APIView
      ↓
   Serializer (Validation & Transformation)
      ↓
   Model (Database Query via Django ORM)
      ↓
   SQLite Database
      ↓
   Response JSON
      ↓
   Frontend State Update
      ↓
   Component Re-render
```

### Session Management

```
Initial Login:
1. Frontend: POST /api/login/ { email, password }
2. Backend: 
   - Find Employee by email
   - Verify password hash
   - Generate JWT access + refresh tokens
3. Frontend stores:
   - localStorage["petty-cash-access"] = JWT_TOKEN
   - localStorage["petty-cash-refresh"] = REFRESH_TOKEN
4. All subsequent requests include Authorization header

Token Expiry:
- Access token: ~15 minutes
- Refresh token: ~24 hours
- Frontend auto-refreshes using refresh token
- If refresh also expires: Logout & redirect to login

Logout:
1. Frontend: POST /api/auth/logout/ { refresh_token }
2. Backend: Invalidate refresh token (optional)
3. Frontend: Clear localStorage
4. Redirect to login page
```

---

## File Locations Summary

### Backend Core Files

| File | Purpose |
|------|---------|
| [hrms/settings.py](hrms/settings.py) | Django configuration, installed apps |
| [hrms/urls.py](hrms/urls.py) | Main URL router for all API endpoints |
| [accounts/models.py](accounts/models.py) | User, MakerCheckerRoleAssignment models |
| [accounts/views.py](accounts/views.py) | Authentication & role management views |
| [accounts/urls.py](accounts/urls.py) | Auth API routes |
| [app1/models.py](app1/models.py) | Candidate, Employee, Education, Experience |
| [app1/views.py](app1/views.py) | Employee/Candidate CRUD endpoints |
| [finance/models.py](finance/models.py) | Advance, Expense, LedgerEntry, Notification |
| [finance/views.py](finance/views.py) | Finance workflow views |
| [finance/services.py](finance/services.py) | Business logic for finance workflows |
| [leave/models.py](leave/models.py) | Leave model |
| [leave/views.py](leave/views.py) | Leave API endpoints |
| [attendance/models.py](attendance/models.py) | Attendance model |
| [attendance/views.py](attendance/views.py) | Check-in/Check-out endpoints |
| [login/views.py](login/views.py) | Simple login endpoint |
| [common/choices.py](common/choices.py) | UserRole, AdvanceStatus, ExpenseStatus enums |

### Frontend Core Files

| File | Purpose |
|------|---------|
| [src/App.js](src/App.js) | Main router, authentication check |
| [src/components/Login.js](src/components/Login.js) | Login form component |
| [src/components/Home.js](src/components/Home.js) | Dashboard & main routes |
| [src/components/Sidebar.jsx](src/components/Sidebar.jsx) | Navigation (role-based) |
| [src/components/Navbar.jsx](src/components/Navbar.jsx) | Top navigation bar |
| [src/accounts/AccountsApp.jsx](src/accounts/AccountsApp.jsx) | Maker/Checker sub-app |
| [src/accounts/components/AppProviders.jsx](src/accounts/components/AppProviders.jsx) | Auth context & API client |
| [src/accounts/components/appCore.js](src/accounts/components/appCore.js) | Constants & API config |
| [src/accounts/pages/LoginPage.jsx](src/accounts/pages/LoginPage.jsx) | Accounts app login |
| [src/accounts/pages/DashboardPage.jsx](src/accounts/pages/DashboardPage.jsx) | Role-based dashboard |
| [src/accounts/pages/NewExpensePage.jsx](src/accounts/pages/NewExpensePage.jsx) | Create expense workflow |
| [src/accounts/pages/PendingApprovalPage.jsx](src/accounts/pages/PendingApprovalPage.jsx) | Checker approval interface |

---

## Key Takeaways

### Three Login Scenarios

1. **HR Employee (Simple)**
   - Email + Password
   - POST /api/login/
   - Gets employee role (admin, hr, finance, employee)
   - Can access main HR dashboard

2. **Maker-Checker (Account User)**
   - Username (employee_id) + Password
   - POST /api/auth/login/
   - Gets JWT + MAKER/CHECKER role
   - Accesses /accounts sub-app expense workflow

3. **Admin (Full Access)**
   - Can login as both HR and Accounts
   - Full system visibility
   - Can approve, allocate, reject anything

### Three Key Workflows

1. **Leave Workflow:**
   Employee → Apply Leave → Manager Approves/Rejects → Approved/Rejected Status

2. **Attendance Workflow:**
   Employee → Check-in → Work → Check-out → Daily Record Saved

3. **Expense Workflow:**
   Advance Allocated → Expense Created → Submitted → Reviewed → Approved → Bill Uploaded → Closed

### Token & Auth

- Frontend uses JWT stored in localStorage
- Every API request includes `Authorization: Bearer <token>`
- Backend validates token signature & expiry
- Refresh token auto-extends session
- Logout clears tokens & redirects to login

### Role-Based Access

- Each API endpoint checks user.role
- Frontend hides UI elements based on role
- Backend enforces permissions (403 if unauthorized)
- Three roles: ADMIN, MAKER, CHECKER (plus HR employee roles)

---

## Running the Project

### Backend
```bash
cd HR-BACKEND/hrms
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
# Runs on http://localhost:8000
```

### Frontend
```bash
cd HR-Frontend-final
npm install
npm start
# Runs on http://localhost:3000
```

### Database
- SQLite at: `HR-BACKEND/hrms/db.sqlite3`
- auto-created on first migration
- User can be created via Django admin or API

---

**End of Architecture Overview**
