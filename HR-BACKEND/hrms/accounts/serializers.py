from django.contrib.auth.password_validation import validate_password
from django.db import IntegrityError
from rest_framework import serializers

from app1.models import Employee
from common.choices import UserRole

from .models import MakerCheckerRoleAssignment, User, apply_role_flags, sync_role_assignment_user


def get_employee_assignment(employee):
    try:
        return employee.maker_checker_assignment
    except MakerCheckerRoleAssignment.DoesNotExist:
        return None


def get_employee_maker_checker_user(employee):
    try:
        return employee.maker_checker_user
    except User.DoesNotExist:
        return None


def get_user_assignment(user):
    try:
        return user.role_assignment
    except MakerCheckerRoleAssignment.DoesNotExist:
        return None


def resolve_reusable_user_for_employee(employee):
    linked_user = get_employee_maker_checker_user(employee)
    if linked_user is not None:
        return linked_user

    employee_code = str(employee.employee_id or "").strip()
    if employee_code:
        username_match = User.objects.select_related("employee").filter(
            username__iexact=employee_code
        ).first()
        if username_match is not None:
            return username_match

    email = str(employee.email or "").strip()
    if not email:
        return None

    email_matches = User.objects.select_related("employee").filter(email__iexact=email)
    if not email_matches.exists():
        return None

    hr_email_matches = Employee.objects.filter(email__iexact=email).count()
    if email_matches.count() == 1 and hr_email_matches == 1:
        return email_matches.first()

    raise serializers.ValidationError(
        {
            "employee_id": (
                "This HR user cannot be linked safely because the email is not unique "
                "across existing HR or Maker-Checker records."
            )
        }
    )


class UserSerializer(serializers.ModelSerializer):
    employee_id = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "full_name",
            "role",
            "is_active",
            "is_staff",
            "is_superuser",
            "employee_id",
        ]
        read_only_fields = fields

    def get_employee_id(self, obj):
        employee = getattr(obj, "employee", None)
        return getattr(employee, "employee_id", None)


class UserSummarySerializer(serializers.ModelSerializer):
    employee_id = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "full_name",
            "role",
            "is_active",
            "employee_id",
        ]
        read_only_fields = fields

    def get_employee_id(self, obj):
        employee = getattr(obj, "employee", None)
        return getattr(employee, "employee_id", None)


class MakerCheckerLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)


class EmployeeOptionSerializer(serializers.ModelSerializer):
    maker_checker_assignment_id = serializers.SerializerMethodField()
    maker_checker_role = serializers.SerializerMethodField()
    maker_checker_active = serializers.SerializerMethodField()

    class Meta:
        model = Employee
        fields = [
            "id",
            "employee_id",
            "name",
            "email",
            "department",
            "role",
            "maker_checker_assignment_id",
            "maker_checker_role",
            "maker_checker_active",
        ]
        read_only_fields = fields

    def get_maker_checker_assignment_id(self, obj):
        assignment = get_employee_assignment(obj)
        return assignment.id if assignment else None

    def get_maker_checker_role(self, obj):
        assignment = get_employee_assignment(obj)
        return assignment.role if assignment else None

    def get_maker_checker_active(self, obj):
        assignment = get_employee_assignment(obj)
        return assignment.is_active if assignment else None


class RoleAssignmentSummarySerializer(serializers.ModelSerializer):
    employee = EmployeeOptionSerializer(read_only=True)
    user = UserSummarySerializer(read_only=True)
    assigned_by = UserSummarySerializer(read_only=True)

    class Meta:
        model = MakerCheckerRoleAssignment
        fields = [
            "id",
            "employee",
            "user",
            "role",
            "is_active",
            "assigned_by",
            "assigned_at",
            "updated_at",
        ]
        read_only_fields = fields


class RoleAssignmentCreateSerializer(serializers.Serializer):
    employee_id = serializers.IntegerField()
    role = serializers.ChoiceField(choices=UserRole.choices)

    def validate_employee_id(self, value):
        try:
            return Employee.objects.get(pk=value)
        except Employee.DoesNotExist as exc:
            raise serializers.ValidationError("Selected HR user was not found.") from exc

    def validate(self, attrs):
        employee = attrs["employee_id"]
        assignment = get_employee_assignment(employee)
        if assignment and assignment.is_active:
            raise serializers.ValidationError(
                {"employee_id": "This HR user already has an active Maker-Checker role assignment."}
            )
        return attrs

    def create(self, validated_data):
        employee = validated_data["employee_id"]
        role = validated_data["role"]
        assigned_by = self.context["request"].user

        try:
            linked_user = resolve_reusable_user_for_employee(employee)
            if linked_user is not None:
                existing_assignment = get_user_assignment(linked_user)
                if existing_assignment and existing_assignment.employee_id != employee.id:
                    raise serializers.ValidationError(
                        {
                            "employee_id": (
                                "This Maker-Checker account is already linked to another HR user."
                            )
                        }
                    )

            if linked_user is None:
                linked_user = User.objects.create(
                    username=f"pending-{employee.pk}",
                    email=employee.email,
                    full_name=employee.name,
                    role=role,
                    employee=employee,
                    is_active=True,
                )
                linked_user.set_unusable_password()
                apply_role_flags(linked_user, role)
                linked_user.save()

            assignment, _ = MakerCheckerRoleAssignment.objects.update_or_create(
                employee=employee,
                defaults={
                    "user": linked_user,
                    "role": role,
                    "is_active": True,
                    "assigned_by": assigned_by,
                },
            )
            sync_role_assignment_user(assignment)
            return assignment
        except IntegrityError as exc:
            raise serializers.ValidationError(
                {
                    "employee_id": (
                        "Unable to save this Maker-Checker role assignment because it conflicts "
                        "with an existing linked account."
                    )
                }
            ) from exc


class RoleAssignmentUpdateSerializer(serializers.ModelSerializer):
    role = serializers.ChoiceField(choices=UserRole.choices, required=False)
    is_active = serializers.BooleanField(required=False)

    class Meta:
        model = MakerCheckerRoleAssignment
        fields = ["role", "is_active"]

    def update(self, instance, validated_data):
        if "role" in validated_data:
            instance.role = validated_data["role"]
        if "is_active" in validated_data:
            instance.is_active = validated_data["is_active"]
        instance.assigned_by = self.context["request"].user
        instance.save()
        sync_role_assignment_user(instance)
        return instance


class AdminUserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["full_name", "username", "email", "role", "is_active"]

    def validate_email(self, value):
        email = value.lower().strip()
        queryset = User.objects.filter(email__iexact=email).exclude(pk=self.instance.pk)
        if queryset.exists():
            raise serializers.ValidationError("An account with this email already exists.")
        return email

    def validate_username(self, value):
        username = value.strip()
        if len(username) < 3:
            raise serializers.ValidationError("Username must be at least 3 characters.")
        queryset = User.objects.filter(username__iexact=username).exclude(pk=self.instance.pk)
        if queryset.exists():
            raise serializers.ValidationError("This username is already taken.")
        return username

    def validate_full_name(self, value):
        full_name = value.strip()
        if len(full_name) < 3:
            raise serializers.ValidationError("Full name must be at least 3 characters.")
        return full_name

    def validate_role(self, value):
        if value not in UserRole.values:
            raise serializers.ValidationError("Select a valid role.")
        return value

    def update(self, instance, validated_data):
        role = validated_data.get("role", instance.role)
        for field, value in validated_data.items():
            setattr(instance, field, value)
        apply_role_flags(instance, role)
        instance.save()
        return instance


class AdminPasswordResetSerializer(serializers.Serializer):
    new_password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        if attrs["new_password"] != attrs["confirm_password"]:
            raise serializers.ValidationError(
                {"confirm_password": "Password confirmation does not match."}
            )
        validate_password(attrs["new_password"])
        return attrs
