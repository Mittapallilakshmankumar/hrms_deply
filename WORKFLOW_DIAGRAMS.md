# HR System - Visual Workflows

## 1. Complete Expense Workflow (MAKER → CHECKER → MAKER)

```
┌─────────────────────────────────────────────────────────────────┐
│                      EXPENSE WORKFLOW                            │
└─────────────────────────────────────────────────────────────────┘

CHECKER ALLOCATES ADVANCE
────────────────────────
    Checker Dashboard
         │
         ├─ Select Maker
         ├─ Enter Amount (e.g., 50,000)
         └─ POST /api/finance/advances/
              │
              ▼
         Create Advance Record
              │
              ├─ reference: AUTO001
              ├─ maker_id: <MAKER>
              ├─ allocated_by: <CHECKER>
              ├─ total_amount: 50,000
              ├─ spent_amount: 0
              ├─ status: ACTIVE
              └─ balance_amount: 50,000


MAKER CREATES EXPENSE
──────────────────────
    Maker Dashboard
         │
         ├─ Select Advance (AUTO001)
         ├─ Enter Details:
         │  ├─ Amount: 5,000
         │  ├─ Purpose: Business Trip
         │  ├─ Category: Travel
         │  └─ Payment Mode: UPI + UTR
         │
         └─ Click "Create"
              │
              ▼
         POST /api/finance/expenses/
              │
              ▼
         Create Expense Record
              │
              ├─ reference: EXP001
              ├─ advance_id: AUTO001
              ├─ maker: <MAKER>
              ├─ amount: 5,000
              ├─ status: DRAFT
              └─ [Ledger: No entry yet]


MAKER SUBMITS EXPENSE
──────────────────────
    Maker: "My Expenses" page
         │
         ├─ See EXP001 (status=DRAFT)
         └─ Click "Submit"
              │
              ▼
         POST /api/finance/expenses/{id}/submit/
              │
              ▼
         Update Expense
              │
              ├─ status: DRAFT → SUBMITTED
              ├─ submitted_at: NOW
              └─ Create Notification for Checker
                   │
                   └─ Message: "Expense EXP001 submitted"


CHECKER REVIEWS EXPENSE
───────────────────────
    Checker: "Pending Approval" page
         │
         ├─ GET /api/finance/expenses/?status=SUBMITTED
         ├─ See EXP001 (Maker: John, Amount: 5,000)
         └─ Click to View Details
              │
              ▼
         Review:
              │
              ├─ Amount: 5,000 ✓
              ├─ Purpose: Business Trip ✓
              ├─ Advance Balance: 50,000 ✓ (sufficient)
              └─ Category: Travel ✓
                   │
                   ▼
         Click "Approve"
              │
              ▼
         POST /api/finance/expenses/{id}/approve/
              │
              ▼
         Update Expense
              │
              ├─ status: SUBMITTED → APPROVED
              ├─ reviewed_by: <CHECKER>
              ├─ reviewed_at: NOW
              ├─ approved_by: <CHECKER>
              ├─ approved_at: NOW
              └─ Create Notification for Maker
                   │
                   └─ Message: "EXP001 approved"


MAKER UPLOADS BILL
──────────────────
    Maker: "Upload Bill" page
         │
         ├─ Get list of APPROVED expenses
         ├─ See EXP001 approved
         ├─ Upload PDF (max 5MB)
         └─ Submit
              │
              ▼
         POST /api/finance/expenses/{id}/upload-bill/
         with FormData: { bill_file: <PDF> }
              │
              ▼
         Backend Validation:
              │
              ├─ File type? (PDF/PNG/JPG) ✓
              ├─ File size? (<5MB) ✓
              ├─ User is Maker of this expense? ✓
              └─ Expense status is APPROVED? ✓
                   │
                   ▼
              Save file to: media/expense_bills/2025/01/15/
                   │
              ▼
         Update Expense
              │
              ├─ bill_file: <path_to_pdf>
              ├─ status: APPROVED → BILL_SUBMITTED
              ├─ bill_submitted_at: NOW
              └─ Create Notification for Checker
                   │
                   └─ Message: "EXP001 bill ready for verification"


CHECKER VERIFIES & CLOSES
──────────────────────────
    Checker: "Final Bill Verification" page
         │
         ├─ GET /api/finance/expenses/?status=BILL_SUBMITTED
         ├─ See EXP001 with bill
         ├─ Download & Review PDF
         └─ Click "Approve & Close"
              │
              ▼
         POST /api/finance/expenses/{id}/close/
              │
              ▼
         Update Expense
              │
              ├─ status: BILL_SUBMITTED → CLOSED
              ├─ closed_at: NOW
              │
              └─ [KEY: Update Advance Balance]
                   │
                   ├─ Get Advance (AUTO001)
                   ├─ spent_amount: 0 → 5,000
                   ├─ balance_amount: 50,000 → 45,000
                   ├─ status: ACTIVE → PARTIALLY_USED
                   │
                   └─ Create LedgerEntry
                       │
                       ├─ advance_id: AUTO001
                       ├─ expense_id: EXP001
                       ├─ entry_type: SPEND
                       ├─ amount: 5,000
                       └─ balance_after: 45,000


FINAL STATE
───────────
    Advance (AUTO001):
    ├─ total_amount: 50,000
    ├─ spent_amount: 5,000
    ├─ balance_amount: 45,000
    ├─ status: PARTIALLY_USED
    └─ Ledger:
       └─ [SPEND] 5,000 on 2025-01-15 → balance: 45,000

    Expense (EXP001):
    ├─ status: CLOSED
    ├─ amount: 5,000
    ├─ bill_file: media/expense_bills/.../file.pdf
    └─ All timestamps: submitted_at, reviewed_at, approved_at, bill_submitted_at, closed_at

    Notifications Sent:
    ├─ Maker: "Expense EXP001 approved"
    ├─ Maker: "Bill received for EXP001"
    └─ Maker: "Expense EXP001 closed - amount reimbursed"
```

---

## 2. Role-Based Access & Navigation

```
┌──────────────────────────────────────────────────────────────┐
│                    THREE LOGIN PATHS                         │
└──────────────────────────────────────────────────────────────┘

SCENARIO 1: HR EMPLOYEE (Simple Login)
─────────────────────────────────────
    URL: http://localhost:3000/
    
    Enter: email + password
         │
         ▼
    POST /api/login/
    (finds Employee by email)
         │
         ▼
    Backend returns:
    {
      "access": "JWT_TOKEN",
      "user_id": 5,
      "role": "admin",    ← Main role
      "name": "John Doe"
    }
         │
         ▼
    localStorage["petty-cash-access"] = JWT_TOKEN
    localStorage["role"] = "admin"
    
    Redirect to: /home
         │
         ▼
    Dashboard with menu:
    ├─ Home
    ├─ Onboarding (Add Candidates)
    ├─ Leave (Apply/View)
    ├─ Attendance (Check-in/out)
    ├─ Admin Dashboard (if role=admin) ← CONDITIONAL
    └─ Logout


SCENARIO 2: MAKER/CHECKER (Account Login)
──────────────────────────────────────────
    URL: http://localhost:3000/accounts/login
    
    Enter: username (employee_id) + password
         │
         ▼
    POST /api/auth/login/
    (finds accounts.User by username/email)
         │
         ▼
    Backend returns:
    {
      "access": "JWT_TOKEN",
      "user": {
        "id": 10,
        "role": "MAKER",   ← Maker/Checker role
        "username": "EMP001",
        "full_name": "Jane Smith"
      }
    }
         │
         ▼
    localStorage["petty-cash-access"] = JWT_TOKEN
    localStorage["role"] = "MAKER"
    
    Redirect to: /accounts/maker/dashboard
         │
         ▼
    Dashboard with menu:
    ├─ Dashboard (My summary)
    ├─ New Expense
    ├─ My Expenses
    ├─ Upload Bill
    └─ Logout


SCENARIO 3: ADMIN (Both Logins)
───────────────────────────────
    Can login twice:
    
    1. HR Admin Login:
       - /home (Main dashboard)
       - Manage employees, candidates, leaves
       - Approve leaves, view attendance
    
    2. Admin Accounts Login:
       - /accounts/admin/dashboard
       - View all expenses
       - Allocate advances
       - See reports
       - Manage users & roles


ROLE-BASED API ACCESS
─────────────────────

    GET /api/finance/expenses/
    
    If MAKER (user.role == "MAKER"):
        └─ Return only: expenses where expense.maker == user.id
    
    If CHECKER (user.role == "CHECKER"):
        └─ Return: All expenses (own + others)
    
    If ADMIN:
        └─ Return: All expenses + admin statistics


SIDEBAR CONDITIONAL RENDERING
──────────────────────────────
    
    const role = localStorage.getItem("role")
    
    if (role === "admin") {
        Show: Admin Dashboard menu item
    } else if (role === "MAKER") {
        Show: My Expenses, New Expense
    } else if (role === "CHECKER") {
        Show: Pending Approvals, Allocate Advance, Reports
    }
```

---

## 3. Leave Management Workflow

```
┌──────────────────────────────────────────────────────────────┐
│                    LEAVE WORKFLOW                            │
└──────────────────────────────────────────────────────────────┘

EMPLOYEE APPLIES LEAVE
─────────────────────
    Employee: /home/leave
         │
         ├─ Enter Details:
         │  ├─ Leave Type: Sick/Casual/PTO
         │  ├─ From Date: 2025-01-20
         │  ├─ To Date: 2025-01-22
         │  └─ Reason: "Medical procedure"
         │
         └─ Click "Apply"
              │
              ▼
         POST /api/leave/apply/
         {
           "user_id": 5,
           "leave_type": "Sick",
           "from_date": "2025-01-20",
           "to_date": "2025-01-22",
           "reason": "Medical procedure"
         }
              │
              ▼
         Create Leave Record:
         ├─ user_id: 5
         ├─ name: John Doe
         ├─ employee_id: EMP001
         ├─ department: IT
         ├─ leave_type: Sick
         ├─ from_date: 2025-01-20
         ├─ to_date: 2025-01-22
         ├─ status: Pending
         └─ Response: "Leave Applied Successfully"


ADMIN APPROVES/REJECTS
──────────────────────
    Admin: /home/admin
         │
         ├─ GET /api/leave/list/
         │  (No user_id, so gets ALL leaves)
         │
         ├─ See Leave from John (Pending)
         ├─ Review Reason
         │
         └─ Click Approve
              │
              ▼
         PUT /api/leave/approve/{leave_id}/
              │
              ▼
         Update Leave:
         ├─ status: Pending → Approved
         └─ Response: "Leave Approved"
              │
              ▼
         John can see: Status changed to "Approved"


VIEW LEAVE HISTORY
──────────────────
    Employee: /home/leave
         │
         ├─ GET /api/leave/list/?user_id=5
         │  (user_id provided, filters for self)
         │
         └─ See all own leaves:
            ├─ 2025-01-20 to 2025-01-22 (Approved)
            ├─ 2024-12-25 to 2024-12-26 (Approved)
            └─ 2024-11-10 to 2024-11-10 (Rejected)
```

---

## 4. Attendance Workflow

```
┌──────────────────────────────────────────────────────────────┐
│                  ATTENDANCE WORKFLOW                         │
└──────────────────────────────────────────────────────────────┘

MORNING: CHECK-IN
────────────────
    Employee: /home/attendance
         │
         ├─ Click "Check In" button
         └─ (automatically sends user_id)
              │
              ▼
         POST /api/attendance/check-in/
         { "user_id": 5 }
              │
              ▼
         Backend Logic:
         ├─ today = 2025-01-15
         ├─ Check if already checked in today
         │  ├─ If YES: Return "Already checked in"
         │  └─ If NO: Create entry
         │
         └─ Create Attendance Record:
            ├─ user_id: 5
            ├─ date: 2025-01-15
            ├─ check_in: 09:30:45
            ├─ check_out: NULL
            └─ Response: "Check-in success"
              │
              ▼
         Frontend displays:
         ├─ Check-in: 09:30 AM ✓
         ├─ Check-out: Not yet
         └─ Disable "Check In" button


EVENING: CHECK-OUT
──────────────────
    Employee: /home/attendance
         │
         ├─ Click "Check Out" button
         ├─ (optional) Enter summary
         └─ Submit
              │
              ▼
         POST /api/attendance/check-out/
         {
           "user_id": 5,
           "summary": "Completed project X and attended meetings"
         }
              │
              ▼
         Backend Logic:
         ├─ today = 2025-01-15
         ├─ Find record: user_id=5, date=2025-01-15
         ├─ Verify check_in exists
         ├─ Verify check_out is NULL
         │
         └─ Update Attendance Record:
            ├─ check_out: 17:45:30
            ├─ summary: "Completed project X..."
            └─ Response: "Check-out success"
              │
              ▼
         Frontend displays:
         ├─ Check-in: 09:30 AM ✓
         ├─ Check-out: 17:45 PM ✓
         ├─ Duration: 8h 14m
         └─ Disable "Check Out" button


DASHBOARD SUMMARY
──────────────────
    Employee: /home
         │
         ├─ GET /api/attendance/attendance/?user_id=5
         │  (Gets all attendance records for user)
         │
         └─ Frontend calculates:
            ├─ Present Days: Count records with check_in AND check_out
            ├─ Absent Days: Count records with NO check_in
            ├─ Today Status:
            │  ├─ If checked in+out: "Present"
            │  ├─ If only checked in: "Check-out pending"
            │  └─ If nothing: "Not checked in"
            └─ Display on dashboard card:
               ├─ Present: 18 days
               ├─ Absent: 2 days
               └─ Today: Check-out pending


ADMIN DASHBOARD
───────────────
    Admin: /home/admin
         │
         ├─ GET /api/attendance/admin-dashboard/
         │  (Gets ALL employees attendance)
         │
         └─ Display grid:
            ├─ Employee 1 | Present | Check-out pending
            ├─ Employee 2 | Absent | Not checked in
            ├─ Employee 3 | Present | Checked out
            └─ ...
```

---

## 5. Candidate Management Workflow

```
┌──────────────────────────────────────────────────────────────┐
│              CANDIDATE MANAGEMENT WORKFLOW                   │
└──────────────────────────────────────────────────────────────┘

ADD NEW CANDIDATE
─────────────────
    HR User: /home/onboarding
         │
         ├─ Click "Add Candidate" button
         └─ Modal/Form opens
              │
              ├─ Enter Details:
              │  ├─ Name: John Smith
              │  ├─ Email: john@email.com
              │  ├─ Phone: 9876543210
              │  ├─ Aadhaar: 123456789012
              │  ├─ PAN: ABCDE1234F
              │  ├─ UAN: 100123456789
              │  ├─ Address
              │  ├─ Experience: 2 years
              │  ├─ Skills: Java, Python
              │  ├─ Department: IT
              │  └─ Photo: <upload_image>
              │
              ├─ (Optional) Add Education:
              │  ├─ School: XYZ College
              │  ├─ Degree: B.Tech
              │  ├─ Field: Computer Science
              │  └─ [Add More]
              │
              ├─ (Optional) Add Experience:
              │  ├─ Company: ABC Corp
              │  ├─ Role: Software Engineer
              │  ├─ Years: 2
              │  └─ [Add More]
              │
              └─ Click "Submit"
                   │
                   ▼
              FormData POST /api/app1/candidates/
              {
                first_name: "John",
                last_name: "Smith",
                email: "john@email.com",
                phone: "9876543210",
                aadhaar: "123456789012",
                pan: "ABCDE1234F",
                uan: "100123456789",
                address_line1: "...",
                experience: "2 years",
                skills: "Java, Python",
                department: "IT",
                photo: <file_object>
              }
                   │
                   ▼
              Backend saves:
              ├─ Candidate Record (with photo in media/candidates/photos/)
              ├─ status: "Pending"
              ├─ Response: "Saved successfully"
              │
              └─ (Optional) Education records linked to Candidate
                   │
              └─ (Optional) Experience records linked to Candidate


VIEW CANDIDATES LIST
────────────────────
    HR User: /home/candidates
         │
         ├─ GET /api/app1/candidates/
         │
         └─ Display table:
            ├─ John Smith | john@email.com | Pending
            ├─ Jane Doe  | jane@email.com  | Approved
            └─ ...
                │
                ├─ Click candidate row
                └─ View full details:
                   ├─ Personal Info
                   ├─ Education History
                   ├─ Work Experience
                   └─ Photo


UPDATE CANDIDATE STATUS
───────────────────────
    
    HR User: Candidate Details
         │
         ├─ Change status: Pending → Approved
         ├─ Set joining date
         │
         └─ (Can convert to Employee upon approval)


DELETE CANDIDATE
────────────────
    
    HR User: Candidates List
         │
         ├─ Click Delete button
         │
         └─ DELETE /api/app1/candidates/{id}/
              │
              ▼
         Backend:
         ├─ Delete Candidate
         ├─ Cascade delete: Education records
         ├─ Cascade delete: Experience records
         └─ Response: "Deleted successfully"
```

---

## 6. Database Model Relationships

```
┌─────────────────────────────────────────────┐
│            DATABASE SCHEMA                  │
└─────────────────────────────────────────────┘

User (accounts.User)  ◄─── 1-to-1 ──► Employee (app1.Employee)
  ├─ id
  ├─ email (unique)
  ├─ username
  ├─ role: ADMIN, MAKER, CHECKER
  ├─ password
  └─ full_name
       │
       │ (MakerCheckerRoleAssignment)
       │      ↓
       ▼
(accounts.User can have Maker/Checker role assignment)


Advance ◄─── 1-to-Many ──► Expense
├─ id                        ├─ id
├─ reference                 ├─ reference
├─ maker ──────────► User    ├─ amount
├─ allocated_by ────► User   ├─ maker ──────────► User
├─ total_amount              ├─ advance ────────► Advance
├─ spent_amount              ├─ reviewed_by ────► User
├─ balance_amount            ├─ approved_by ────► User
├─ status                    ├─ status
└─ [...]                     └─ bill_file


Advance ◄─── 1-to-Many ──► LedgerEntry
                           ├─ id
                           ├─ advance ─────────► Advance
                           ├─ expense ─────────► Expense
                           ├─ entry_type: ADVANCE, SPEND, ADJUSTMENT
                           ├─ amount
                           ├─ balance_after
                           └─ created_at


Employee ◄─── 1-to-Many ──► Leave
├─ id                        ├─ id
├─ name                      ├─ user_id
├─ email                     ├─ leave_type
├─ employee_id               ├─ from_date
├─ department                ├─ to_date
├─ [...]                     ├─ reason
└─                           └─ status


Employee ◄─── 1-to-Many ──► Attendance
├─ id                        ├─ id
├─ name                      ├─ user_id
├─ employee_id               ├─ date
├─ [...]                     ├─ check_in
└─                           ├─ check_out
                             └─ summary


Candidate ◄─── 1-to-Many ──► Education
├─ id                        ├─ id
├─ first_name                ├─ candidate ────► Candidate
├─ email                     ├─ school
├─ [...]                     ├─ degree
└─                           └─ [...]


Candidate ◄─── 1-to-Many ──► Experience
├─ id                        ├─ id
├─ first_name                ├─ candidate ────► Candidate
├─ [...]                     ├─ company_name
└─                           ├─ role
                             └─ [...]
```

---

## 7. Authentication & Token Flow

```
┌─────────────────────────────────────────────┐
│         JWT TOKEN FLOW                      │
└─────────────────────────────────────────────┘

LOGIN REQUEST
─────────────
    Frontend:
    POST http://localhost:8000/api/auth/login/
    {
      "username": "EMP001",
      "password": "password123"
    }
         │
         ▼
    Backend (LoginView):
    ├─ Resolve user by username/email/employee_id
    ├─ Check password (hash comparison)
    ├─ Verify user is active
    ├─ Get role assignment (Maker/Checker)
    ├─ Generate JWT tokens:
    │  ├─ access_token: exp=15 mins
    │  └─ refresh_token: exp=24 hours
    │
    └─ Return JSON:
       {
         "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
         "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
         "user": {
           "id": 10,
           "role": "MAKER",
           "username": "EMP001",
           "full_name": "Jane Smith"
         }
       }


STORE TOKENS
────────────
    Frontend:
    localStorage["petty-cash-access"] = access_token
    localStorage["petty-cash-refresh"] = refresh_token


API REQUEST WITH TOKEN
──────────────────────
    Frontend:
    
    Every subsequent request includes:
    
    GET http://localhost:8000/api/finance/advances/
    Headers: {
      "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGc...",
      "Content-Type": "application/json"
    }
         │
         ▼
    Backend:
    ├─ Extract token from Authorization header
    ├─ Verify JWT signature
    ├─ Check token expiry
    ├─ Decode to get user_id
    ├─ Load user from database
    ├─ Attach to request.user
    │
    └─ Response: User-specific data


TOKEN EXPIRY (15 mins)
──────────────────────
    If expired:
         │
         ▼
    Backend returns: 401 Unauthorized
         │
         ▼
    Frontend (Axios Interceptor):
    ├─ Catch 401
    ├─ POST /api/auth/refresh/
    │  { "refresh": refresh_token }
    │
    ├─ Get new access_token
    ├─ localStorage["petty-cash-access"] = new_token
    │
    └─ Retry original request with new token


LOGOUT
──────
    Frontend:
    POST /api/auth/logout/
    { "refresh": refresh_token }
         │
         ▼
    Backend:
    ├─ Blacklist refresh token (optional)
    ├─ Response: Success
    │
    ▼
    Frontend:
    ├─ localStorage.clear()
    ├─ Redirect to /login
    └─ Show: "Logged out successfully"
```

---

**End of Visual Workflows**
