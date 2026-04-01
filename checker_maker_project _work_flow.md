# 👥 User Roles Guide: Maker, Checker & Admin

## Overview
This document explains the three main roles in the HR Management System and their responsibilities.

---

## 1. MAKER (Employee) 👤

### Who is a Maker?
- Regular employees
- Team members
- Staff who need to submit requests

### What Can Makers Do? ✅
- Login to the system
- Submit **Expense Claims** (e.g., "I spent $100 on office supplies")
- Apply for **Leave** (e.g., "I need 2 days off")
- View **Onboarding** information
- Check **Attendance** records
- View their own submitted requests
- Edit pending requests (if not yet approved)

### What Can't Makers Do? ❌
- Approve or reject other employees' requests
- Access Admin Panel
- Allocate advances
- Create new user accounts
- View other employees' private data

### Maker Workflow
```
1. Employee logs in → Home Page
2. Clicks "Leave" → Fill leave form → Submit
3. Wait for Checker approval
4. Checker approves/rejects
5. Employee sees status updated
```

### Example
> Employee **John** submits an expense claim for **$200** (cab fare for client meeting)

---

## 2. CHECKER (Manager/Supervisor) 🔍

### Who is a Checker?
- Managers
- Supervisors
- Team leads
- Department heads

### What Can Checkers Do? ✅
- Login to the system
- View all **Expense Claims** submitted by makers
- View all **Leave Requests** from their team
- **APPROVE** ✓ requests
- **REJECT** ❌ requests with reason
- Add comments while approving/rejecting
- View submission history
- Track pending approvals

### What Can't Checkers Do? ❌
- Access Admin Dashboard
- Create new user accounts
- Allocate salary advances
- Manage employee roles
- Modify system settings

### Checker Workflow
```
1. Manager logs in → Home Page
2. Clicks "Approvals" tab
3. Sees pending expense/leave requests
4. Reviews each request
5. Clicks "Approve" or "Reject"
6. Adds comments if needed
7. Submits decision
```

### Example
> Manager **Jane** reviews **John's** $200 expense claim:
> - Views receipt
> - Checks if legitimate business expense
> - Clicks **"Approve"** ✅

---

## 3. ADMIN (HR/System Administrator) 👨‍💼

### Who is an Admin?
- HR Manager
- HR Head
- System Administrators
- Organization management

### What Can Admins Do? ✅
- Login to the system
- Access **Admin Dashboard**
- Create new employee accounts
- Assign/Change user roles (Maker, Checker, HR)
- View all expenses, leaves, attendance (full system access)
- Allocate **Salary Advances** to employees
- Manage **Candidates** (onboarding process)
- Approve final decisions on escalated requests
- Generate reports
- Manage system settings
- Deactivate user accounts

### What Can't Admins Do? ❌
- Bypass role permissions
- Delete approved financial records
- Modify past transactions (immutable for audit)

### Admin Workflow
```
1. Admin logs in → Admin Dashboard
2. Can access any section of the system
3. Create new users → Assign roles
4. View financial overview
5. Allocate advances
6. Manage candidates
7. Generate compliance reports
```

### Example
> HR **Admin** allocates **$500** salary advance to **John** after his expense was approved

---

## 📊 Comparison Table

| Feature               | Maker | Checker | Admin |
|-----------------------|-------|---------|-------|
| **Submit Expenses**   | ✅    | ❌     | ✅    |
| **Submit Leave**      | ✅    | ❌     | ✅    |
| **View Home**         | ✅    | ✅     | ✅    |
| **Approve Expenses**  | ❌    | ✅     | ✅    |
| **Approve Leave**     | ❌    | ✅     | ✅    |
| **Allocate Advances** | ❌    | ❌     | ✅    |
| **Manage Users**      | ❌    | ❌     | ✅    |
| **Access Admin Panel** | ❌   | ❌     | ✅    |
| **View Reports**      | Own only    | Own team  | All    |
| **Onboarding**        | View only     | View only  | Manage |

---

## 🔄 Complete Workflow Example

### Scenario: Employee Expense & Advance Process

#### Step 1: Maker Submits Expense
```
Employee (Maker) John:
- Submits expense claim for $200 (client lunch)
- Provides receipt
- Adds description: "Client lunch meeting on 01-Apr-2026"
- Status: PENDING
```

#### Step 2: Checker Reviews & Approves
```
Manager (Checker) Jane:
- Views John's expense claim
- Verifies receipt and amount
- Checks if business-related
- Clicks "Approve"
- Status: APPROVED
- Notification sent to John
```

#### Step 3: Admin Allocates Advance
```
HR Admin:
- Sees approved expenses
- Employee needs salary advance
- Allocates $500 advance to John
- Deducted from next salary
- Status: ADVANCE ALLOCATED
```

---

## 🔐 Security & Permissions

### Data Access Rules

**Maker sees:**
- Own submitted requests only
- Own attendance
- Own leave balance

**Checker sees:**
- All requests from assigned team members
- Team attendance
- Team leave balances

**Admin sees:**
- All data (full system visibility)
- All employees' records
- All financial transactions
- All audit logs

### Edit Permissions

**Maker can edit:**
- Own pending requests only
- Cannot edit after approval

**Checker can edit:**
- Cannot edit requests (only approve/reject)

**Admin can edit:**
- User roles
- System settings
- Escalated decisions

---

## 📋 Login & Access

### Step 1: Login
All three roles login with:
- Email address
- Password

### Step 2: Role Assignment
- **Admin** assigns role to each user during account creation
- Role stored in database
- System checks role on every login

### Step 3: Dashboard
System shows different dashboard based on role:
- **Maker** → Home (submit requests)
- **Checker** → Home + Approvals tab
- **Admin** → Admin Dashboard

---

## ⚠️ Common Issues & Solutions

### Issue: Admin Can't Login (403 Error)
**Solution:** 
- Admin needs active "Maker-Checker Role Assignment" in database
- Go to Django Admin → Create assignment with role="admin" and is_active=true

### Issue: Checker Can't See Requests to Approve
**Solution:**
- Ensure checker is assigned to the maker's team
- Verify checker role is "checker" in database

### Issue: Maker Can't Submit Expense
**Solution:**
- Check if maker role is "maker" or "employee"
- Verify maker account is active

---

## 🎯 Best Practices

### For Makers
1. ✅ Add clear descriptions for all requests
2. ✅ Attach receipts/documentation
3. ✅ Submit within organization deadline
4. ✅ Don't submit duplicate requests

### For Checkers
1. ✅ Review requests promptly
2. ✅ Add comments for rejections
3. ✅ Verify amount and legitimacy
4. ✅ Follow organization policies

### For Admins
1. ✅ Assign correct roles to users
2. ✅ Monitor approval rates
3. ✅ Ensure audit trail is maintained
4. ✅ Regularly review role assignments
5. ✅ Deactivate accounts when employees leave

---

## 📞 Support

For role-related issues:
- Contact your organization's HR Department
- Refer to system admin for role reassignment
- Check audit logs for transaction history

---

**Last Updated:** 01-Apr-2026  
**Version:** 1.0
