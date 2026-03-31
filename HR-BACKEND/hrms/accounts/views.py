from django.conf import settings
from django.contrib.auth.hashers import check_password
from django.db.models import Q, Sum
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken, TokenError

from app1.models import Employee
from common.choices import UserRole

from .models import MakerCheckerRoleAssignment, User, sync_role_assignment_user
from .serializers import (
    AdminPasswordResetSerializer,
    EmployeeOptionSerializer,
    MakerCheckerLoginSerializer,
    RoleAssignmentCreateSerializer,
    RoleAssignmentSummarySerializer,
    RoleAssignmentUpdateSerializer,
    UserSerializer,
    UserSummarySerializer,
)


def is_admin(user):
    return bool(user and user.is_authenticated and user.role == UserRole.ADMIN)


def admin_forbidden_response():
    return Response(
        {"detail": "Only admin users can perform this action."},
        status=status.HTTP_403_FORBIDDEN,
    )


def resolve_hr_employee(identifier):
    normalized = str(identifier or "").strip()
    if not normalized:
        return None

    employee = Employee.objects.filter(
        Q(email__iexact=normalized) | Q(employee_id__iexact=normalized)
    ).first()
    if employee:
        return employee

    linked_user = (
        User.objects.select_related("employee")
        .filter(Q(username__iexact=normalized) | Q(email__iexact=normalized))
        .first()
    )
    if linked_user and linked_user.employee_id:
        return linked_user.employee
    return None


def resolve_maker_checker_user(identifier):
    normalized = str(identifier or "").strip()
    if not normalized:
        return None

    return (
        User.objects.select_related("employee")
        .filter(
            Q(username__iexact=normalized)
            | Q(email__iexact=normalized)
            | Q(employee__employee_id__iexact=normalized)
        )
        .first()
    )


def get_user_role_assignment(user):
    try:
        return user.role_assignment
    except MakerCheckerRoleAssignment.DoesNotExist:
        return None


class LoginView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = MakerCheckerLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        identifier = serializer.validated_data["username"]
        password = serializer.validated_data["password"]

        direct_user = resolve_maker_checker_user(identifier)
        if (
            direct_user
            and direct_user.has_usable_password()
            and check_password(password, direct_user.password)
        ):
            if not direct_user.is_active:
                return Response(
                    {"detail": "This Maker-Checker account is inactive."},
                    status=status.HTTP_403_FORBIDDEN,
                )

            if direct_user.employee_id:
                assignment = get_user_role_assignment(direct_user)
                if not assignment or not assignment.is_active:
                    return Response(
                        {
                            "detail": (
                                "You do not have an active Maker-Checker role assignment."
                            )
                        },
                        status=status.HTTP_403_FORBIDDEN,
                    )
                user = sync_role_assignment_user(assignment)
            else:
                user = direct_user

            refresh = RefreshToken.for_user(user)
            return Response(
                {
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                    "user": UserSerializer(user).data,
                }
            )

        employee = resolve_hr_employee(identifier)
        if not employee or not check_password(password, employee.password):
            return Response(
                {"detail": "Invalid credentials."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        assignment = (
            MakerCheckerRoleAssignment.objects.select_related("user", "employee")
            .filter(employee=employee)
            .first()
        )
        if not assignment or not assignment.is_active:
            return Response(
                {"detail": "You do not have an active Maker-Checker role assignment."},
                status=status.HTTP_403_FORBIDDEN,
            )

        user = sync_role_assignment_user(assignment)
        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": UserSerializer(user).data,
            }
        )


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        return Response(
            {
                "detail": (
                    "Direct Maker-Checker user creation is retired. "
                    "Assign an existing HR user from the admin dashboard."
                )
            },
            status=status.HTTP_410_GONE,
        )


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = str(request.data.get("refresh", "") or "").strip()
        if not refresh_token:
            return Response(
                {"detail": "Refresh token is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        response_payload = {
            "detail": "Logout completed on the client.",
            "refresh_revoked": False,
        }

        if "rest_framework_simplejwt.token_blacklist" not in settings.INSTALLED_APPS:
            response_payload["detail"] = (
                "Logout completed on the client. Refresh-token revocation is not enabled."
            )
            return Response(response_payload, status=status.HTTP_200_OK)

        try:
            RefreshToken(refresh_token).blacklist()
            response_payload["detail"] = "Logout completed and refresh token revoked."
            response_payload["refresh_revoked"] = True
        except TokenError:
            return Response(
                {"detail": "Refresh token is invalid or expired."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(response_payload, status=status.HTTP_200_OK)


class AppConfigView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, request):
        return Response(
            {
                "frontend_base_url": settings.FRONTEND_BASE_URL,
                "max_bill_upload_size": settings.MAX_BILL_UPLOAD_SIZE,
                "max_bill_upload_size_mb": settings.MAX_BILL_UPLOAD_SIZE_MB,
                "refresh_revocation_enabled": (
                    "rest_framework_simplejwt.token_blacklist" in settings.INSTALLED_APPS
                ),
                "shared_db_safety": "hr_identity_source_read_only_with_maker_checker_role_mapping",
            }
        )


class HRUserLookupView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not is_admin(request.user):
            return admin_forbidden_response()

        search = request.query_params.get("search", "").strip()
        employees = Employee.objects.select_related("maker_checker_assignment").all()

        if search:
            employees = employees.filter(
                Q(name__icontains=search)
                | Q(email__icontains=search)
                | Q(employee_id__icontains=search)
            )

        employees = employees.order_by("name", "employee_id")
        return Response(EmployeeOptionSerializer(employees, many=True).data)


class RoleAssignmentListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not is_admin(request.user):
            return admin_forbidden_response()

        search = request.query_params.get("search", "").strip()
        role = request.query_params.get("role")
        is_active = request.query_params.get("is_active")

        assignments = MakerCheckerRoleAssignment.objects.select_related(
            "employee", "user", "assigned_by"
        )
        if role in UserRole.values:
            assignments = assignments.filter(role=role)
        if is_active in {"true", "false"}:
            assignments = assignments.filter(is_active=is_active == "true")
        if search:
            assignments = assignments.filter(
                Q(employee__name__icontains=search)
                | Q(employee__email__icontains=search)
                | Q(employee__employee_id__icontains=search)
            )

        assignments = assignments.order_by("employee__name", "employee__employee_id")
        return Response(RoleAssignmentSummarySerializer(assignments, many=True).data)

    def post(self, request):
        if not is_admin(request.user):
            return admin_forbidden_response()

        serializer = RoleAssignmentCreateSerializer(
            data=request.data,
            context={"request": request},
        )
        serializer.is_valid(raise_exception=True)
        assignment = serializer.save()
        return Response(
            {
                "message": "Maker-Checker role assigned successfully.",
                "assignment": RoleAssignmentSummarySerializer(assignment).data,
            },
            status=status.HTTP_201_CREATED,
        )


class RoleAssignmentDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, assignment_id):
        if not is_admin(request.user):
            return admin_forbidden_response()

        assignment = get_object_or_404(
            MakerCheckerRoleAssignment.objects.select_related("employee", "user"),
            pk=assignment_id,
        )
        serializer = RoleAssignmentUpdateSerializer(
            assignment,
            data=request.data,
            partial=True,
            context={"request": request},
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {
                "message": "Maker-Checker role assignment updated successfully.",
                "assignment": RoleAssignmentSummarySerializer(assignment).data,
            }
        )


class UserListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        search = request.query_params.get("search", "").strip()
        role = request.query_params.get("role")
        is_active = request.query_params.get("is_active")
        users = User.objects.select_related("employee").all()

        if role in UserRole.values:
            users = users.filter(role=role)

        if is_active in {"true", "false"}:
            users = users.filter(is_active=is_active == "true")

        if search:
            users = users.filter(
                Q(full_name__icontains=search)
                | Q(username__icontains=search)
                | Q(email__icontains=search)
                | Q(employee__employee_id__icontains=search)
            )

        if request.user.role == UserRole.MAKER and role != UserRole.CHECKER:
            users = users.filter(id=request.user.id)
        elif request.user.role == UserRole.MAKER and role == UserRole.CHECKER:
            users = users.filter(is_active=True, role=UserRole.CHECKER)
        elif request.user.role == UserRole.CHECKER:
            users = users.filter(is_active=True, role__in=[UserRole.MAKER, UserRole.CHECKER])
        elif not is_admin(request.user):
            users = users.filter(id=request.user.id)

        users = users.order_by("full_name", "username")
        return Response(UserSummarySerializer(users, many=True).data)

    def post(self, request):
        return Response(
            {
                "detail": (
                    "Direct Maker-Checker user creation is retired. "
                    "Assign an existing HR user instead."
                )
            },
            status=status.HTTP_410_GONE,
        )


class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, user_id):
        if not is_admin(request.user):
            return admin_forbidden_response()

        user = get_object_or_404(User.objects.select_related("employee"), pk=user_id)
        if user.employee_id:
            return Response(
                {
                    "detail": (
                        "Direct edits for HR-linked Maker-Checker users are disabled. "
                        "Update the role assignment from the admin dashboard instead."
                    )
                },
                status=status.HTTP_410_GONE,
            )
        return admin_forbidden_response()


class UserPasswordResetView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, user_id):
        if not is_admin(request.user):
            return admin_forbidden_response()

        user = get_object_or_404(User.objects.select_related("employee"), pk=user_id)
        if user.employee_id:
            return Response(
                {
                    "detail": (
                        "Password reset for HR-linked users remains managed by HR. "
                        "Maker-Checker access uses the existing HR password."
                    )
                },
                status=status.HTTP_410_GONE,
            )
        serializer = AdminPasswordResetSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user.set_password(serializer.validated_data["new_password"])
        user.save(update_fields=["password"])
        return Response({"message": "Password reset successfully."})


class CheckerOptionsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        users = User.objects.filter(
            is_active=True,
            role=UserRole.CHECKER,
            role_assignment__is_active=True,
        ).order_by("full_name", "username")
        return Response(UserSummarySerializer(users, many=True).data)


class AdminDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not is_admin(request.user):
            return admin_forbidden_response()

        from finance.models import Advance, Expense
        from common.choices import AdvanceStatus, ExpenseStatus
        from common.utils import money

        all_assignments = MakerCheckerRoleAssignment.objects.all()
        active_assignments = all_assignments.filter(is_active=True)
        makers = User.objects.filter(role=UserRole.MAKER, is_active=True, role_assignment__is_active=True)
        checkers = User.objects.filter(role=UserRole.CHECKER, is_active=True, role_assignment__is_active=True)
        admins = User.objects.filter(role=UserRole.ADMIN, is_active=True, role_assignment__is_active=True)
        requests = Expense.objects.select_related(
            "maker", "reviewed_by", "approved_by", "advance"
        ).order_by("-created_at")

        expense_status_counts = {
            choice: requests.filter(status=choice).count() for choice in ExpenseStatus.values
        }
        recent_requests = [
            {
                "id": expense.id,
                "reference": expense.reference,
                "maker_name": (
                    getattr(expense.maker, "full_name", "")
                    or getattr(expense.maker, "username", "")
                    or "Unknown user"
                ),
                "amount": str(expense.amount),
                "status": expense.status,
                "created_at": expense.created_at,
            }
            for expense in requests[:8]
        ]
        advances = Advance.objects.all()

        payload = {
            "summary": {
                "total_users": all_assignments.count(),
                "active_users": active_assignments.count(),
                "makers": makers.count(),
                "checkers": checkers.count(),
                "admins": admins.count(),
                "active_advances": advances.filter(
                    status__in=[AdvanceStatus.ACTIVE, AdvanceStatus.PARTIALLY_USED]
                ).count(),
                "open_requests": requests.filter(
                    status__in=[
                        ExpenseStatus.SUBMITTED,
                        ExpenseStatus.REVIEWED,
                        ExpenseStatus.BILL_SUBMITTED,
                    ]
                ).count(),
                "approved_requests": requests.filter(status=ExpenseStatus.APPROVED).count(),
                "closed_requests": requests.filter(status=ExpenseStatus.CLOSED).count(),
                "inactive_users": all_assignments.filter(is_active=False).count(),
                "total_allocated": str(
                    money(advances.aggregate(total=Sum("total_amount"))["total"])
                ),
                "total_spent": str(
                    money(advances.aggregate(total=Sum("spent_amount"))["total"])
                ),
                "remaining_balance": str(
                    money(advances.aggregate(total=Sum("balance_amount"))["total"])
                ),
            },
            "charts": {
                "user_roles": {
                    "ADMIN": admins.count(),
                    "MAKER": makers.count(),
                    "CHECKER": checkers.count(),
                },
                "request_statuses": expense_status_counts,
                "user_statuses": {
                    "active": active_assignments.count(),
                    "inactive": all_assignments.filter(is_active=False).count(),
                },
            },
            "makers": UserSummarySerializer(makers.order_by("full_name", "username"), many=True).data,
            "checkers": UserSummarySerializer(checkers.order_by("full_name", "username"), many=True).data,
            "recent_requests": recent_requests,
        }
        return Response(payload)
