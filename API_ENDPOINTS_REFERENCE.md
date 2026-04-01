# HR System - API Endpoints Quick Reference

## Authentication Endpoints

### Base URL: `http://localhost:8000/api/auth/`

| Method | Endpoint | Purpose | Auth Required | Input | Output |
|--------|----------|---------|---------------|-------|--------|
| POST | `/login/` | Login with credentials | ❌ | `{ username, password }` | `{ access, refresh, user }` |
| POST | `/refresh/` | Refresh access token | ❌ | `{ refresh }` | `{ access }` |
| GET | `/me/` | Get current user info | ✅ | — | `{ user_object }` |
| POST | `/logout/` | Logout (blacklist token) | ✅ | `{ refresh }` | `{ message }` |
| POST | `/register/` | Register new user | ❌ | User data | `{ user, token }` |
| GET | `/app-config/` | Get app configuration | ✅ | — | `{ config }` |

---

## Finance Endpoints

### Base URL: `http://localhost:8000/api/finance/`

#### **ADVANCES**

| Method | Endpoint | Purpose | Required Role | Input | Output |
|--------|----------|---------|----------------|-------|--------|
| GET | `/advances/` | List advances | All | Query: `?status=ACTIVE&maker=123` | `[advance_list]` |
| POST | `/advances/` | Allocate new advance | CHECKER | `{ maker, total_amount, remarks }` | `{ advance }` |
| GET | `/advances/<id>/` | Get advance details | All | — | `{ advance }` |
| GET | `/advances/<id>/ledger/` | Get ledger entries | All | — | `[ledger_entries]` |
| GET | `/advances/maker-balances/` | Get all maker balances | CHECKER | — | `[maker_balances]` |

**Key Points:**
- MAKER: Only see own advances
- CHECKER/ADMIN: See all advances
- Status: ACTIVE → PARTIALLY_USED → EXHAUSTED → CLOSED

#### **EXPENSES**

| Method | Endpoint | Purpose | Required Role | Input | Output |
|--------|----------|---------|----------------|-------|--------|
| GET | `/expenses/` | List expenses | All | Query: `?status=DRAFT&maker=123` | `[expense_list]` |
| POST | `/expenses/` | Create expense (DRAFT) | MAKER | Expense data | `{ expense }` |
| GET | `/expenses/<id>/` | Get expense details | All | — | `{ expense }` |
| PATCH | `/expenses/<id>/` | Update expense (DRAFT only) | MAKER | Updated fields | `{ expense }` |
| POST | `/expenses/<id>/submit/` | Submit for review | MAKER | — | `{ expense }` |
| POST | `/expenses/<id>/review/` | Review expense | CHECKER | `{ status: REVIEWED }` | `{ expense }` |
| POST | `/expenses/<id>/approve/` | Approve expense | CHECKER | — | `{ expense }` |
| POST | `/expenses/<id>/reject/` | Reject expense | CHECKER | `{ reason }` | `{ expense }` |
| POST | `/expenses/<id>/upload-bill/` | Upload bill PDF/image | MAKER | FormData: `{ bill_file }` | `{ expense }` |
| POST | `/expenses/<id>/close/` | Close & finalize | CHECKER | — | `{ expense }` |

**Expense Status Flow:**
```
DRAFT → SUBMITTED → REVIEWED → APPROVED → BILL_SUBMITTED → CLOSED
         ↓(reject)    ↓(reject)   ↓(reject)
         REJECTED     REJECTED    REJECTED
```

**Key Points:**
- MAKER: Create and upload bills for own expenses
- CHECKER: Review, approve, and close all expenses
- Bill upload requires: PDF/PNG/JPG, max 5MB

#### **LEDGER & BILLS**

| Method | Endpoint | Purpose | Required Role | Input | Output |
|--------|----------|---------|----------------|-------|--------|
| GET | `/ledger/` | Get ledger entries | All | Query: `?advance=123` | `[ledger_entries]` |
| GET | `/bills/pending-verification/` | Get bills pending review | CHECKER | — | `[pending_bills]` |
| GET | `/reports/` | Get financial reports | CHECKER/ADMIN | Query: `?date_from=...&date_to=...` | `{ report_data }` |

---

## Employee & Candidate Endpoints

### Base URL: `http://localhost:8000/api/app1/`

| Method | Endpoint | Purpose | Auth Required | Input | Output |
|--------|----------|---------|---------------|-------|--------|
| GET | `/candidates/` | List all candidates | ✅ | Query: `?status=Pending` | `[candidates]` |
| POST | `/candidates/` | Add new candidate | ✅ | FormData with candidate data | `{ message }` |
| GET | `/candidates/<id>/` | Get candidate details | ✅ | — | `{ candidate }` |
| DELETE | `/candidates/<id>/` | Delete candidate | ✅ | — | `{ message }` |
| GET | `/candidates/<id>/education/` | Get education history | ✅ | — | `[education]` |
| POST | `/candidates/<id>/education/` | Add education record | ✅ | Education data | `{ education }` |
| GET | `/candidates/<id>/experience/` | Get work experience | ✅ | — | `[experience]` |
| POST | `/candidates/<id>/experience/` | Add experience record | ✅ | Experience data | `{ experience }` |
| GET | `/employees/` | List employees | ✅ | Query: `?user_id=5` | `[employees]` |
| GET | `/employees/<id>/` | Get employee details | ✅ | — | `{ employee }` |

**Candidate Model Relationships:**
```
Candidate (1) ──────► (N) Education
           ├──────► (N) Experience
           └──────► (1) Photo (media file)
```

---

## Leave Endpoints

### Base URL: `http://localhost:8000/api/leave/`

| Method | Endpoint | Purpose | Auth Required | Input | Output |
|--------|----------|---------|---------------|-------|--------|
| POST | `/apply/` | Apply for leave | ✅ | `{ user_id, leave_type, from_date, to_date, reason }` | `{ message }` |
| GET | `/list/` | Get leaves | ✅ | Query: `?user_id=5` (own) or empty (all) | `[leaves]` |
| PUT | `/approve/<id>/` | Approve leave | ✅ (Admin) | — | `{ message }` |
| PUT | `/reject/<id>/` | Reject leave | ✅ (Admin) | — | `{ message }` |
| GET | `/employee/<user_id>/` | Get employee details (auto-fill) | ✅ | — | `{ employee }` |

**Leave Status:**
- Pending → Approved/Rejected

---

## Attendance Endpoints

### Base URL: `http://localhost:8000/api/attendance/`

| Method | Endpoint | Purpose | Auth Required | Input | Output |
|--------|----------|---------|---------------|-------|--------|
| POST | `/check-in/` | Check-in (once per day) | ✅ | `{ user_id }` | `{ message }` |
| POST | `/check-out/` | Check-out (once per day) | ✅ | `{ user_id, summary }` | `{ message }` |
| GET | `/attendance/` | Get user's attendance records | ✅ | Query: `?user_id=5` | `[attendance_records]` |
| GET | `/admin-dashboard/` | Get all employees attendance | ✅ (Admin) | — | `{ dashboard_data }` |

**Attendance Constraints:**
- One check-in per day (unique on user_id + date)
- One check-out per day
- Time fields: check_in, check_out

---

## Simple Login Endpoint (Legacy)

### Base URL: `http://localhost:8000/api/`

| Method | Endpoint | Purpose | Auth Required | Input | Output |
|--------|----------|---------|---------------|-------|--------|
| POST | `/login/` | Simple employee login | ❌ | `{ email, password }` | `{ access, refresh, user_id, name, role, email }` |

**Legend:**
- Uses Employee model (not accounts.User)
- Finds employee by email
- Validates password against stored hash
- Returns JWT tokens

---

## Role Assignment Endpoints

### Base URL: `http://localhost:8000/api/auth/`

| Method | Endpoint | Purpose | Required Role | Input | Output |
|--------|----------|---------|----------------|-------|--------|
| GET | `/role-assignments/` | List all role assignments | ADMIN | — | `[assignments]` |
| POST | `/role-assignments/` | Create role assignment | ADMIN | `{ employee, role }` | `{ assignment }` |
| GET | `/role-assignments/<id>/` | Get assignment details | ADMIN | — | `{ assignment }` |
| PUT | `/role-assignments/<id>/` | Update assignment | ADMIN | `{ role, is_active }` | `{ assignment }` |
| GET | `/users/` | List all users | ADMIN | — | `[users]` |
| GET | `/users/<id>/` | Get user details | ADMIN | — | `{ user }` |
| POST | `/users/<id>/reset-password/` | Reset user password | ADMIN | `{ password }` | `{ message }` |
| GET | `/checker-options/` | Get available checkers | ADMIN | — | `[checker_users]` |
| GET | `/admin/dashboard/` | Admin dashboard stats | ADMIN | — | `{ dashboard }` |

---

## Frontend API Client Setup

### Axios Configuration (appCore.js)

```javascript
// API Base URL
const API_BASE_URL = "http://localhost:8000/api/"

// Token Storage Keys
const ACCESS_TOKEN_KEY = "petty-cash-access"
const REFRESH_TOKEN_KEY = "petty-cash-refresh"

// Request Interceptor
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  }
)

// Response Interceptor (Auto-refresh on 401)
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)
      if (refreshToken) {
        const newTokens = await refreshAccessToken(refreshToken)
        localStorage.setItem(ACCESS_TOKEN_KEY, newTokens.access)
        // Retry original request
      }
    }
    return Promise.reject(error)
  }
)
```

---

## Example API Calls

### 1. Login & Store Token
```javascript
// Frontend
const response = await fetch("http://localhost:8000/api/auth/login/", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username: "EMP001", password: "pass123" })
})

const data = await response.json()
// {
//   "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
//   "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
//   "user": { "id": 10, "role": "MAKER" }
// }

localStorage.setItem("petty-cash-access", data.access)
localStorage.setItem("petty-cash-refresh", data.refresh)
```

### 2. Allocate Advance (Checker)
```javascript
const response = await fetch("http://localhost:8000/api/finance/advances/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("petty-cash-access")}`
  },
  body: JSON.stringify({
    maker: 5,
    total_amount: 50000,
    allocated_by: 10,
    remarks: "Travel advance for Q1"
  })
})
```

### 3. Create Expense (Maker)
```javascript
const response = await fetch("http://localhost:8000/api/finance/expenses/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("petty-cash-access")}`
  },
  body: JSON.stringify({
    advance: 1,
    payable_to: "Vendor ABC",
    amount: 5000,
    category: "Travel",
    purpose: "Business trip",
    payment_mode: "UPI",
    transaction_reference: "UTR1234567890"
  })
})
```

### 4. Upload Bill (Maker)
```javascript
const formData = new FormData()
formData.append("bill_file", fileInput.files[0])

const response = await fetch(
  "http://localhost:8000/api/finance/expenses/123/upload-bill/",
  {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("petty-cash-access")}`
    },
    body: formData
  }
)
```

### 5. Get Current User Info
```javascript
const response = await fetch("http://localhost:8000/api/auth/me/", {
  method: "GET",
  headers: {
    "Authorization": `Bearer ${localStorage.getItem("petty-cash-access")}`
  }
})

const currentUser = await response.json()
// { "id": 10, "role": "MAKER", "username": "EMP001", ... }
```

---

## Error Responses

### Common Error Codes

| Status | Meaning | Example Response |
|--------|---------|------------------|
| 400 | Bad Request | `{ "detail": "Invalid credentials." }` |
| 401 | Unauthorized | `{ "detail": "Token is invalid or expired." }` |
| 403 | Forbidden | `{ "detail": "Only checker users can allocate advances." }` |
| 404 | Not Found | `{ "error": "Expense not found" }` |
| 500 | Server Error | `{ "error": "Internal server error" }` |

### Token Refresh Error Response
```json
{
  "detail": "Token is blacklisted",
  "code": "authentication_failed"
}
```
→ Clear localStorage, redirect to login

---

## Quick Test Commands

### Using cURL

```bash
# Login
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"EMP001","password":"pass123"}'

# Get current user (replace TOKEN)
curl -X GET http://localhost:8000/api/auth/me/ \
  -H "Authorization: Bearer TOKEN"

# Get all expenses
curl -X GET "http://localhost:8000/api/finance/expenses/?status=SUBMITTED" \
  -H "Authorization: Bearer TOKEN"

# Create expense
curl -X POST http://localhost:8000/api/finance/expenses/ \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "advance": 1,
    "amount": 5000,
    "payable_to": "Vendor",
    "category": "Travel",
    "purpose": "Business trip",
    "payment_mode": "Cash"
  }'
```

---

**End of API Reference**
