from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    AdminDashboardView,
    AppConfigView,
    CheckerOptionsView,
    HRUserLookupView,
    LoginView,
    LogoutView,
    MeView,
    RegisterView,
    RoleAssignmentDetailView,
    RoleAssignmentListView,
    UserDetailView,
    UserListView,
    UserPasswordResetView,
)

urlpatterns = [
    path("login/", LoginView.as_view(), name="auth-login"),
    path("refresh/", TokenRefreshView.as_view(), name="auth-refresh"),
    path("auth/refresh/", TokenRefreshView.as_view(), name="auth-refresh-legacy"),

    path("me/", MeView.as_view(), name="auth-me"),
    path("logout/", LogoutView.as_view(), name="auth-logout"),
    path("app-config/", AppConfigView.as_view(), name="auth-app-config"),
    path("register/", RegisterView.as_view(), name="auth-register"),
    path("hr-users/", HRUserLookupView.as_view(), name="auth-hr-users"),
    path("role-assignments/", RoleAssignmentListView.as_view(), name="auth-role-assignments"),
    path(
        "role-assignments/<int:assignment_id>/",
        RoleAssignmentDetailView.as_view(),
        name="auth-role-assignment-detail",
    ),
    path("users/", UserListView.as_view(), name="auth-users"),
    path("users/<int:user_id>/", UserDetailView.as_view(), name="auth-user-detail"),
    path(
        "users/<int:user_id>/reset-password/",
        UserPasswordResetView.as_view(),
        name="auth-user-reset-password",
    ),
    path("checker-options/", CheckerOptionsView.as_view(), name="auth-checker-options"),
    path("admin/dashboard/", AdminDashboardView.as_view(), name="auth-admin-dashboard"),
]
