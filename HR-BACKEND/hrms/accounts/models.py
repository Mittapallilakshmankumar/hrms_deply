from django.contrib.auth.models import AbstractUser
from django.db import models

from common.choices import UserRole


def apply_role_flags(user, role):
    if role == UserRole.ADMIN:
        user.is_staff = True
    elif not user.is_superuser:
        user.is_staff = False


class User(AbstractUser):
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=255)
    role = models.CharField(max_length=20, choices=UserRole.choices)
    employee = models.OneToOneField(
        "app1.Employee",
        on_delete=models.PROTECT,
        related_name="maker_checker_user",
        null=True,
        blank=True,
    )

    def __str__(self):
        return self.username


class MakerCheckerRoleAssignment(models.Model):
    employee = models.OneToOneField(
        "app1.Employee",
        on_delete=models.PROTECT,
        related_name="maker_checker_assignment",
    )
    user = models.OneToOneField(
        "accounts.User",
        on_delete=models.PROTECT,
        related_name="role_assignment",
    )
    role = models.CharField(max_length=20, choices=UserRole.choices)
    is_active = models.BooleanField(default=True)
    assigned_by = models.ForeignKey(
        "accounts.User",
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="assigned_maker_checker_roles",
    )
    assigned_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["employee__name", "employee__employee_id"]

    def __str__(self):
        return f"{self.employee.name} - {self.role}"


def build_maker_checker_username(employee):
    employee_code = (employee.employee_id or "").strip()
    if employee_code:
        return employee_code
    return f"hr-{employee.pk}"


def sync_role_assignment_user(assignment):
    employee = assignment.employee
    user = assignment.user

    if not user.username:
        user.username = build_maker_checker_username(employee)

    base_username = build_maker_checker_username(employee)
    candidate_username = base_username
    suffix = 1
    while User.objects.exclude(pk=user.pk).filter(username__iexact=candidate_username).exists():
        suffix += 1
        candidate_username = f"{base_username}-{suffix}"

    user.username = candidate_username
    user.email = employee.email
    user.full_name = employee.name
    user.role = assignment.role
    user.employee = employee
    user.is_active = assignment.is_active
    apply_role_flags(user, assignment.role)
    if not user.password:
        user.set_unusable_password()
    user.save()
    return user
