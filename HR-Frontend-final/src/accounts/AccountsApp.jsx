import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppProviders, useAuth } from "./components/AppProviders";
import { APP_BASE_PATH, ROLES, getDefaultRouteForRole } from "./components/appCore";
import DashboardPage from "./pages/DashboardPage";
import AllocateAdvancePage from "./pages/AllocateAdvancePage";
import FinalBillVerificationPage from "./pages/FinalBillVerificationPage";
import LoginPage from "./pages/LoginPage";
import MyExpensesPage from "./pages/MyExpensesPage";
import NewExpensePage from "./pages/NewExpensePage";
import PendingApprovalPage from "./pages/PendingApprovalPage";
import PendingVerificationPage from "./pages/PendingVerificationPage";
import ExpenseDetailsPage from "./pages/ExpenseDetailsPage";
import AdvanceDetailsPage from "./pages/AdvanceDetailsPage";
import UploadBillPage from "./pages/UploadBillPage";
import ActiveAdvancesPage from "./pages/ActiveAdvancesPage";
import ReportsPage from "./pages/ReportsPage";
import PortalPage from "./pages/PortalPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";

function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, isBootstrapping, role } = useAuth();

  if (isBootstrapping) {
    return <div className="p-8 text-sm text-slate-500">Loading session...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles?.length && !allowedRoles.includes(role)) {
    return <Navigate to={getDefaultRouteForRole(role)} replace />;
  }

  return children;
}

function AccountsRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PortalPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route path="/maker" element={<Navigate to="/maker/dashboard" replace />} />
      <Route
        path="/maker/dashboard"
        element={
          <ProtectedRoute allowedRoles={[ROLES.MAKER]}>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/maker/new-expense"
        element={
          <ProtectedRoute allowedRoles={[ROLES.MAKER]}>
            <NewExpensePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/maker/my-expenses"
        element={
          <ProtectedRoute allowedRoles={[ROLES.MAKER]}>
            <MyExpensesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/maker/upload-bill"
        element={
          <ProtectedRoute allowedRoles={[ROLES.MAKER]}>
            <UploadBillPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/maker/expenses/:id"
        element={
          <ProtectedRoute allowedRoles={[ROLES.MAKER]}>
            <ExpenseDetailsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/maker/advances/:id"
        element={
          <ProtectedRoute allowedRoles={[ROLES.MAKER]}>
            <AdvanceDetailsPage />
          </ProtectedRoute>
        }
      />

      <Route path="/checker" element={<Navigate to="/checker/dashboard" replace />} />
      <Route
        path="/checker/dashboard"
        element={
          <ProtectedRoute allowedRoles={[ROLES.CHECKER]}>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/checker/allocate-advance"
        element={
          <ProtectedRoute allowedRoles={[ROLES.CHECKER]}>
            <AllocateAdvancePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/checker/pending-verification"
        element={
          <ProtectedRoute allowedRoles={[ROLES.CHECKER]}>
            <PendingVerificationPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/checker/pending-approval"
        element={
          <ProtectedRoute allowedRoles={[ROLES.CHECKER]}>
            <PendingApprovalPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/checker/active-advances"
        element={
          <ProtectedRoute allowedRoles={[ROLES.CHECKER]}>
            <ActiveAdvancesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/checker/final-bill-verification"
        element={
          <ProtectedRoute allowedRoles={[ROLES.CHECKER]}>
            <FinalBillVerificationPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/checker/reports"
        element={
          <ProtectedRoute allowedRoles={[ROLES.CHECKER]}>
            <ReportsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/checker/expenses/:id"
        element={
          <ProtectedRoute allowedRoles={[ROLES.CHECKER]}>
            <ExpenseDetailsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/checker/advances/:id"
        element={
          <ProtectedRoute allowedRoles={[ROLES.CHECKER]}>
            <AdvanceDetailsPage />
          </ProtectedRoute>
        }
      />

      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/reports"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <ReportsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/expenses/:id"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <ExpenseDetailsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/advances/:id"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <AdvanceDetailsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/new-expense"
        element={
          <ProtectedRoute allowedRoles={[ROLES.MAKER]}>
            <NewExpensePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-expenses"
        element={
          <ProtectedRoute allowedRoles={[ROLES.MAKER]}>
            <MyExpensesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/expenses/:id"
        element={
          <ProtectedRoute>
            <ExpenseDetailsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/advances/:id"
        element={
          <ProtectedRoute>
            <AdvanceDetailsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/allocate-advance"
        element={
          <ProtectedRoute allowedRoles={[ROLES.CHECKER]}>
            <AllocateAdvancePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/active-advances"
        element={
          <ProtectedRoute allowedRoles={[ROLES.MAKER, ROLES.CHECKER]}>
            <ActiveAdvancesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/pending-verification"
        element={
          <ProtectedRoute allowedRoles={[ROLES.CHECKER]}>
            <PendingVerificationPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/pending-approval"
        element={
          <ProtectedRoute allowedRoles={[ROLES.CHECKER]}>
            <PendingApprovalPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/upload-bill"
        element={
          <ProtectedRoute allowedRoles={[ROLES.MAKER]}>
            <UploadBillPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/final-bill-verification"
        element={
          <ProtectedRoute allowedRoles={[ROLES.CHECKER]}>
            <FinalBillVerificationPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin-dashboard"
        element={<Navigate to="/admin/dashboard" replace />}
      />

      <Route
        path="/reports"
        element={
          <ProtectedRoute allowedRoles={[ROLES.CHECKER]}>
            <ReportsPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function AccountsApp() {
  return (
    <AppProviders>
      <BrowserRouter basename={APP_BASE_PATH}>
        <AccountsRoutes />
      </BrowserRouter>
    </AppProviders>
  );
}
