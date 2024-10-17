from .models import *
from rest_framework import serializers
from rest_framework.validators import ValidationError
from rest_framework.authtoken.models import Token

class SignUpSerializer(serializers.ModelSerializer):
    email = serializers.CharField(max_length=80)
    username = serializers.CharField(max_length=45)
    password = serializers.CharField(min_length=8,write_only=True)

    class Meta:
        model = User
        fields = ['email','username','password', 'date_of_birth', 'first_name', 'last_name',
                  'phone_number', 'address_city', 'address_street', 'address_house']
    
    def validate(self, attrs):
        email_check_copy = User.objects.filter(email=attrs['email']).exists()
        username_check_copy = User.objects.filter(username=attrs['username']).exists()

        if email_check_copy:
            raise ValidationError("Email has been already used")
        if username_check_copy:
            raise ValidationError("Username has been already used")
        
        return super().validate(attrs)
    
    def create(self, validated_data):
        password = validated_data.pop("password")

        user = super().create(validated_data)
        user.set_password(password)
        user.save()

        Token.objects.create(user=user)
        
        return user

class UserSerializer (serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email','username', 'date_of_birth', 'first_name', 'last_name',
                  'phone_number', 'address_city', 'address_street', 'profile_picture_url']

class PetSitterSerializer(serializers.ModelSerializer):
    user_data = UserSerializer(source='user', read_only=True)
    class Meta:
        model = PetSitter
        fields = ['experience_in_months', 'daily_rate', 'hourly_rate', 'description_bio','user_data']
        