from rest_framework import serializers
from .models import Candidate, Education, Experience, EmployeeFile

class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = '__all__'


class CandidateSerializer(serializers.ModelSerializer):
    education = EducationSerializer(many=True, read_only=True)

    # ✅ ADD THIS FUNCTION
    def validate_employee_id(self, value):
        if Candidate.objects.filter(employee_id=value).exists():
            raise serializers.ValidationError("Employee ID already exists ❌")
        return value

    class Meta:
        model = Candidate
        fields = '__all__'


class EmployeeFileSerializer(serializers.ModelSerializer):
    employee_id = serializers.CharField(source="employee.employee_id", read_only=True)
    employee_name = serializers.CharField(source="employee.name", read_only=True)

    class Meta:
        model = EmployeeFile
        fields = [
            "id",
            "employee",
            "employee_id",
            "employee_name",
            "file_name",
            "file",
            "uploaded_at"
        ]