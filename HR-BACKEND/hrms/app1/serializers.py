from rest_framework import serializers
from .models import Candidate, Education


class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = '__all__'


class CandidateSerializer(serializers.ModelSerializer):
    education = EducationSerializer(many=True, read_only=True) 

    class Meta:
        model = Candidate
        fields = '__all__'


from .models import Employee

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = '__all__'   # ✅ includes is_active