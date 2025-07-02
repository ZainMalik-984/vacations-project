from .models import CustomUser
from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class registrationUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    id = serializers.IntegerField(read_only=True)  

    class Meta:
        model = CustomUser
        fields = ['id', 'first_name','last_name', 'email', 'password', 'role', 'is_active']

    def validate_email(self, value):
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError('User already exists')
        return value

    def create(self, validated_data):
        return CustomUser.objects.create_user(**validated_data)



class RegistrationAdminSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['first_name', 'email', 'password', 'role']
        read_only_fields = ['role']

    def validate_email(self, value):
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError('User already exists')
        return value

    def create(self, validated_data):
        validated_data['role'] = 'admin'  # Force role to 'admin'
        user = CustomUser.objects.create_user(**validated_data)
        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'email'

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if email and password:
            user = authenticate(
                request=self.context.get('request'),
                email=email,
                password=password
            )
            if not user:
                raise serializers.ValidationError('Invalid email or password')
        else:
            raise serializers.ValidationError('Must include "email" and "password"')

        # Save user for later access in view
        self.user = user

        refresh = RefreshToken.for_user(user)
        access = refresh.access_token

        return {
            'refresh': str(refresh),
            'access': str(access),
            'user': {
                'id': user.id,
                'first_name': user.first_name,
                'email': user.email,
                'role': user.role,
            }
        }
