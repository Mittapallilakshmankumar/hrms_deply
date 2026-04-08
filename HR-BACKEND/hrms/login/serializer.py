from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile

class RegisterSerializer(serializers.Serializer):
    name = serializers.CharField()
    email = serializers.EmailField()
    phone = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def create(self, validated_data):
        name = validated_data['name']
        email = validated_data['email']
        phone = validated_data['phone']
        password = validated_data['password']

        # create user (email + password)
        user = User.objects.create_user(
            username=email,
            email=email,
            password=password
        )

        # create profile (name + phone)
        Profile.objects.create(
            user=user,
            name=name,
            phone=phone
        )

        return user



        