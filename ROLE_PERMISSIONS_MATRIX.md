# System Role & Permission Matrix

## 🎭 Three Authentication Scenarios

```
╔════════════════════════════════════════════════════════════════════════════╗
║                        LOGIN ENTRY POINTS                                  ║
╚════════════════════════════════════════════════════════════════════════════╝

┌─ SCENARIO 1: HR EMPLOYEE LOGIN ─────────────────────────────────────────┐
│                                                                          │
│   Frontend: http://localhost:3000/                                      │
│                                                                          │
│   ┌──────────────────┐                                                  │
│   │ Login Form       │                                                  │
│   ├──────────────────┤                                                  │
│   │ Email:    □      │                                                  │
│   │ Password: □      │                                                  │
│   │ [LOGIN]          │                                                  │
│   └──────────────────┘                                                  │
│         ↓                                                                │
│   POST /api/login/                                                       │
│   (Looks up Employee by email)                                          │
│         ↓                                                                │
│   Backend Validates:                                                     │
│   ├─ Find Employee.email = input_email ✓                               │
│   ├─ Check password hash ✓                                             │
│   └─ Return JWT tokens + role                                          │
│         ↓                                                                │
│   Response:                                                              │
│   {                                                                      │
│     "access": "JWT_TOKEN",                                             │
│     "user_id": 5,                                                       │
│     "role": "admin",   ← Main role for HR                              │
│     "name": "John Doe"                                                  │
│   }                                                                      │
│         ↓                                                                │
│   localStorage:                                                          │
│   ├─ "petty-cash-access" = JWT_TOKEN                                   │
│   ├─ "role" = "admin"                                                  │
│   └─ "userName" = "John Doe"                                           │
│         ↓                                                                │
│   Redirect to: http://localhost:3000/home                              │
│         ↓                                                                │
│   HR DASHBOARD ACCESS:                                                  │
│   ├─ Menu: Home, Onboarding, Leave, Attendance                         │
│   ├─ If role="admin": Show "Admin Dashboard" option                   │
│   ├─ Can manage: Candidates, Employees, Leaves                         │
│   └─ Cannot: Approve expenses, allocate advances                        │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘

┌─ SCENARIO 2: MAKER/CHECKER LOGIN ─────────────────────────────────────┐
│                                                                        │
│   Frontend: http://localhost:3000/accounts/login                      │
│                                                                        │
│   ┌──────────────────┐                                                │
│   │ Login Form       │                                                │
│   ├──────────────────┤                                                │
│   │ Username: □      │ (Employee ID: EMP001)                         │
│   │ Password: □      │                                                │
│   │ [LOGIN]          │                                                │
│   └──────────────────┘                                                │
│         ↓                                                              │
│   POST /api/auth/login/                                               │
│   (Looks up accounts.User by username/employee_id)                    │
│         ↓                                                              │
│   Backend Validates:                                                   │
│   ├─ Find User.username = input_username ✓                           │
│   ├─ Check password hash ✓                                           │
│   ├─ Verify MakerCheckerRoleAssignment.is_active ✓                  │
│   └─ Return JWT tokens + MAKER/CHECKER role                          │
│         ↓                                                              │
│   Response:                                                            │
│   {                                                                    │
│     "access": "JWT_TOKEN",                                           │
│     "user": {                                                         │
│       "id": 10,                                                       │
│       "role": "MAKER",   ← Specific role                             │
│       "username": "EMP001",                                           │
│       "full_name": "Jane Smith"                                       │
│     }                                                                  │
│   }                                                                    │
│         ↓                                                              │
│   localStorage:                                                        │
│   ├─ "petty-cash-access" = JWT_TOKEN                                 │
│   └─ "role" = "MAKER"                                                │
│         ↓                                                              │
│   Redirect to: http://localhost:3000/accounts/maker/dashboard        │
│         ↓                                                              │
│   MAKER DASHBOARD ACCESS:                                             │
│   ├─ Menu: Dashboard, New Expense, My Expenses, Upload Bill          │
│   ├─ Can: Create & submit expenses, upload bills                     │
│   └─ Cannot: Approve, reject, allocate advances                       │
│                                                                        │
│   OR If role="CHECKER":                                               │
│   ├─ Menu: Dashboard, Allocate Advance, Pending Approvals            │
│   ├─ Can: Review, approve/reject, allocate, view reports             │
│   └─ Cannot: Create expenses (only makers can)                        │
│                                                                        │
└──────────────────────────────────────────────────────────────────────┘

┌─ SCENARIO 3: ADMIN (DUAL ACCESS) ────────────────────────────────────┐
│                                                                       │
│   Can login via BOTH paths:                                          │
│                                                                       │
│   Login Path 1: HR Dashboard                                         │
│   ├─ http://localhost:3000/                                         │
│   ├─ Role: "admin"                                                  │
│   └─ Access: /home (HR Dashboard)                                   │
│                                                                       │
│   Login Path 2: Accounts/Finance                                     │
│   ├─ http://localhost:3000/accounts/login                           │
│   ├─ Role: "ADMIN"                                                  │
│   └─ Access: /accounts/admin/dashboard                              │
│                                                                       │
│   Admin can:                                                          │
│   ├─ Manage employees & candidates                                   │
│   ├─ Approve leaves                                                  │
│   ├─ View/allocate advances                                          │
│   ├─ Approve/reject expenses                                         │
│   ├─ View all reports                                                │
│   └─ Manage user roles                                               │
│                                                                       │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 👥 Role Permissions Matrix

```
╔════════════════════════════════════════════════════════════════════════════╗
║                     ROLE-BASED PERMISSIONS                                 ║
╚════════════════════════════════════════════════════════════════════════════╝

┌────────────────────────────────────────────────────────────────────────────┐
│                          DASHBOARD ACCESS                                  │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  Role      │ URL Path              │ Dashboard              │ Menu Items  │
│  ────────────────────────────────────────────────────────────────────────│
│  ADMIN     │ /home                 │ HR Dashboard           │ All HR +    │
│  (HR)      │ /accounts/admin       │ Finance Dashboard      │ All Finance │
│            │                       │                        │             │
│  ────────────────────────────────────────────────────────────────────────│
│  MAKER     │ /accounts/maker       │ My Finances            │ Expense     │
│            │                       │ • My Balance           │ focused     │
│            │                       │ • Pending Expenses     │             │
│            │                       │ • Bills to Upload      │             │
│            │                       │                        │             │
│  ────────────────────────────────────────────────────────────────────────│
│  CHECKER   │ /accounts/checker     │ Approvals              │ Review &    │
│            │                       │ • Pending Reviews      │ Allocate    │
│            │                       │ • Pending Approvals    │ focused     │
│            │                       │ • Active Advances      │             │
│            │                       │                        │             │
│  ────────────────────────────────────────────────────────────────────────│
│  HR Emp    │ /home                 │ HR Dashboard           │ HR tasks    │
│  (Regular) │ (Cannot see /accounts)│ • Candidates           │ only        │
│            │                       │ • Leaves & Attendance  │             │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────┐
│                      FEATURE PERMISSIONS                                   │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  Feature                   │ Admin │ Maker │ Checker │ HR Emp │ Others  │
│  ───────────────────────────┼───────┼───────┼─────────┼────────┼─────── │
│  Create Expense            │  ✅   │  ✅   │   ❌    │   ❌   │   ❌   │
│  Submit Expense            │  ✅   │  ✅   │   ❌    │   ❌   │   ❌   │
│  Review Expense            │  ✅   │  ❌   │   ✅    │   ❌   │   ❌   │
│  Approve/Reject Expense    │  ✅   │  ❌   │   ✅    │   ❌   │   ❌   │
│  Upload Bill               │  ✅   │  ✅   │   ❌    │   ❌   │   ❌   │
│  Close Expense             │  ✅   │  ❌   │   ✅    │   ❌   │   ❌   │
│  Allocate Advance          │  ✅   │  ❌   │   ✅    │   ❌   │   ❌   │
│  View All Expenses         │  ✅   │  ❌   │   ✅    │   ❌   │   ❌   │
│  View Own Expenses         │  ✅   │  ✅   │   ✅    │   ❌   │   ❌   │
│                            │       │       │         │        │         │
│  Manage Candidates         │  ✅   │  ❌   │   ❌    │   ✅   │   ❌   │
│  Manage Employees          │  ✅   │  ❌   │   ❌    │   ✅   │   ❌   │
│  Approve Leaves            │  ✅   │  ❌   │   ❌    │   ✅   │   ❌   │
│  Apply Leave (own)         │  ✅   │  ✅   │   ✅    │  ✅    │   ❌   │
│                            │       │       │         │        │         │
│  Check-in/Check-out        │  ✅   │  ✅   │   ✅    │  ✅    │   ❌   │
│  View Own Attendance       │  ✅   │  ✅   │   ✅    │  ✅    │   ❌   │
│  View All Attendance       │  ✅   │  ❌   │   ❌    │   ✅   │   ❌   │
│                            │       │       │         │        │         │
│  View Financial Reports    │  ✅   │  ❌   │   ✅    │   ❌   │   ❌   │
│  Manage Users & Roles      │  ✅   │  ❌   │   ❌    │   ❌   │   ❌   │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────┐
│                      API ENDPOINT ACCESS                                   │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  Endpoint                 │ ADMIN │ MAKER │ CHECKER │ HR Emp │ Others  │
│  ───────────────────────────┼───────┼───────┼─────────┼────────┼─────── │
│  POST /api/auth/login/    │  ✅   │  ✅   │   ✅    │   ✅   │   ✅   │
│  GET  /api/auth/me/       │  ✅   │  ✅   │   ✅    │   ✅   │   ❌   │
│                           │       │       │         │        │         │
│  POST /api/finance/advances/ │ ✅  │  ❌   │   ✅    │   ❌   │   ❌   │
│  GET  /api/finance/advances/ │ ✅  │  ✅*  │   ✅    │   ❌   │   ❌   │
│  (*only own)              │       │       │         │        │         │
│                           │       │       │         │        │         │
│  POST /api/finance/expenses/  │ ✅ │  ✅   │   ❌    │   ❌   │   ❌   │
│  GET  /api/finance/expenses/  │ ✅ │  ✅*  │   ✅    │   ❌   │   ❌   │
│  (*only own)              │       │       │         │        │         │
│                           │       │       │         │        │         │
│  POST /api/leave/apply/   │  ✅   │  ✅   │   ✅    │   ✅   │   ❌   │
│  GET  /api/leave/list/    │  ✅   │  ✅*  │   ✅*   │   ✅*  │   ❌   │
│  (*own leaves)            │       │       │         │        │         │
│                           │       │       │         │        │         │
│  POST /api/attendance/    │  ✅   │  ✅   │   ✅    │   ✅   │   ❌   │
│  check-in/                │       │       │         │        │         │
│  GET  /api/attendance/    │  ✅   │  ✅*  │   ✅*   │   ✅*  │   ❌   │
│  (*own records)           │       │       │         │        │         │
│                           │       │       │         │        │         │
│  POST /api/app1/          │  ✅   │  ❌   │   ❌    │   ✅   │   ❌   │
│  candidates/              │       │       │         │        │         │
│  GET  /api/app1/          │  ✅   │  ❌   │   ❌    │   ✅   │   ❌   │
│  candidates/              │       │       │         │        │         │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Role Transition Flows

```
┌─────────────────────────────────────────────────────────────────────────┐
│                   POSSIBLE ROLE COMBINATIONS                             │
└─────────────────────────────────────────────────────────────────────────┘

Single Role Users:
┌─────────┐       ┌──────────┐       ┌─────────┐
│  MAKER  │       │ CHECKER  │       │  ADMIN  │
│         │       │          │       │         │
│ Create  │       │ Review   │       │ All     │
│ Submit  │       │ Approve  │       │ Perms   │
│ Upload  │       │ Allocate │       │         │
└─────────┘       │ Reports  │       └─────────┘
                  └──────────┘

Dual Role Users (via Maker/Checker Assignment):
┌──────────────────────────┐
│  MAKER + Admin Override  │
│  (Has both roles)        │
│  ✅ Can create expenses  │
│  ✅ Can approve expenses │
│  ✅ Admin dashboard      │
└──────────────────────────┘

┌──────────────────────────┐
│  CHECKER + Admin         │
│  (Has both roles)        │
│  ✅ Can allocate advance │
│  ✅ Can approve expenses │
│  ✅ Can manage users     │
│  ✅ Admin dashboard      │
└──────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────┐
│                     ADDING NEW MAKER/CHECKER                             │
└─────────────────────────────────────────────────────────────────────────┘

Step 1: ADMIN creates MakerCheckerRoleAssignment
POST /api/auth/role-assignments/
{
  "employee": <HR_EMPLOYEE_ID>,
  "role": "MAKER" or "CHECKER"
}
      ↓
Step 2: System auto-creates accounts.User
├─ username = employee.employee_id
├─ role = "MAKER" or "CHECKER"
├─ password = (set by admin or generated)
└─ linked to employee

Step 3: New user can login at /accounts/login
├─ Uses newly created username
├─ Gets MAKER or CHECKER role
└─ Cannot use old HR login path


┌─────────────────────────────────────────────────────────────────────────┐
│                     ROLE: EMPLOYEE → MAKER                               │
└─────────────────────────────────────────────────────────────────────────┘

BEFORE:
├─ Login: /home (HR dashboard)
├─ Role: "admin" or "employee"
├─ Can: Manage candidates, leaves, attendance

AFTER Admin assigns MAKER role:
├─ Now has TWO logins available:
│  ├─ /home → HR dashboard (old access)
│  └─ /accounts/login → Maker dashboard (new access)
│
├─ Can switch roles by logging out & choosing different login point
└─ Database:
   ├─ Employee.role = still "admin" or "employee"
   ├─ User.role = "MAKER" (new accounts.User)
   └─ MakerCheckerRoleAssignment links them


┌─────────────────────────────────────────────────────────────────────────┐
│              CHECKLIST: COMPLETE ROLE-BASED FLOW                         │
└─────────────────────────────────────────────────────────────────────────┘

SCENARIO: Create new Maker user

□ 1. Admin logs in (POST /api/auth/login/ or /home)
□ 2. Admin goes to User Management
□ 3. Admin creates role assignment:
     - Select Employee: "John Doe" (EMP001)
     - Assign Role: "MAKER"
     - POST /api/auth/role-assignments/
□ 4. System creates accounts.User:
     - username: "EMP001"
     - role: "MAKER"
     - password: (generated or sent to user)
□ 5. John Doe now has TWO accounts:
     - HR Account: email/password login → /home
     - Maker Account: EMP001/password login → /accounts/maker
□ 6. On first visit to /accounts/login:
     - John logs in with EMP001
     - System validates MakerCheckerRoleAssignment.is_active
     - Creates JWT token with role=MAKER
     - Redirects to /accounts/maker/dashboard
□ 7. John can now:
     - Create expenses
     - Submit for review
     - Upload bills
     - View own expense status
□ 8. Checker reviews John's expenses:
     - GET /api/finance/expenses/?status=SUBMITTED
     - Filters show John's submitted expense
     - Checker can approve/reject
     - John gets notified
```

---

## 🎯 Permission Enforcement Points

```
┌─────────────────────────────────────────────────────────────────────────┐
│              WHERE PERMISSIONS ARE CHECKED                               │
└─────────────────────────────────────────────────────────────────────────┘

1. FRONTEND (UI Level)
   ├─ localStorage["role"] used for conditional rendering
   │  └─ May show/hide menu items, buttons
   │
   └─ Sidebar component:
      └─ if (role === "admin") { show Admin Dashboard }
      └─ if (role === "MAKER") { show My Expenses }
      └─ if (role === "CHECKER") { show Pending Approvals }
      
   ⚠️  NOTE: Frontend checks are for UX only
   ⚠️  Backend MUST also validate permissions


2. BACKEND (API Level) - CRITICAL
   ├─ LoginView: Validates user exists & role assignment is active
   │
   ├─ APIView.permission_classes = [IsAuthenticated]
   │  └─ Requires valid JWT token
   │
   ├─ Custom permission checks in each endpoint:
   │  ├─ POST /advance/: if user.role != CHECKER → 403
   │  ├─ POST /expense/: if user.role != MAKER → 403
   │  ├─ POST /approve/: if user.role != CHECKER → 403
   │  └─ GET /expenses/: User sees only own if MAKER
   │
   └─ Serializer validation:
      └─ Validates data format, constraints
      └─ Can check user permissions on create
      
   ⚠️  CRITICAL: Backend is source of truth
   ⚠️  Never trust frontend role claims


3. DATABASE (Audit Level)
   ├─ AuditLog: Records WHO performed WHAT action WHEN
   │
   ├─ LedgerEntry: Financial audit trail
   │  └─ Can verify advance balance calculations
   │
   ├─ Expense.reviewed_by: Who reviewed this
   ├─ Expense.approved_by: Who approved this
   ├─ Advance.allocated_by: Who allocated this
   │
   └─ MakerCheckerRoleAssignment:
      ├─ assigned_by: Who created this role
      ├─ assigned_at: When created
      └─ is_active: Current status


4. TOKEN VALIDATION
   ├─ JWT signature verified
   ├─ Token expiry checked
   ├─ User status (is_active) verified
   ├─ Role still valid checked
   │
   └─ If any fail: 401 Unauthorized


FLOW DIAGRAM:

   Frontend Request
      ↓
   Check localStorage token exists
      ↓
   Send: Authorization: Bearer {TOKEN}
      ↓
   Backend receives request
      ↓
   [1] Verify JWT signature & expiry
      ↓ ✅ Valid token
      ↓
   [2] Load user from database
      ↓
   [3] Check user.is_active
      ↓ ✅ User active
      ↓
   [4] Check user.role for this endpoint
      ↓ ✅ Role permitted
      ↓
   [5] Query filtered by user context
      └─ If MAKER: expenses where maker=current_user
      └─ If CHECKER: all expenses
      └─ If ADMIN: all + admin tools
      ↓
   [6] Execute business logic
      ↓
   [7] Write AuditLog entry
      ↓
   Return response to frontend
```

---

**End of Role & Permission Matrix**

This document serves as the complete reference for understanding how roles, permissions, and access are managed throughout the system.
