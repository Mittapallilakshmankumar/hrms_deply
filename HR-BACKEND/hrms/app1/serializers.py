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