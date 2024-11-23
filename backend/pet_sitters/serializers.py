from django.utils.formats import date_format

from .models import *
from rest_framework import serializers
from rest_framework.validators import ValidationError
from rest_framework.authtoken.models import Token
from psycopg2.extras import DateTimeRange
from drf_extra_fields.fields import DateTimeRangeField
from rest_framework.serializers import SerializerMethodField

class SignUpSerializer(serializers.ModelSerializer):
    email = serializers.CharField(max_length=80)
    username = serializers.CharField(max_length=45)
    password = serializers.CharField(min_length=8,write_only=True)
    date_of_birth = serializers.DateField(input_formats=['%d/%m/%Y', '%Y-%m-%d', '%d-%m-%Y'])

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


class PasswordResetRequestSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(read_only=True)
    class Meta:
        model = PasswordResetToken
        fields = ['email']

class PasswordResetSerializer(serializers.ModelSerializer):
    password = serializers.CharField(min_length=8,write_only=True)
    confirm_password = serializers.CharField(min_length=8,write_only=True)
    class Meta:
        model = PasswordResetToken
        fields = ['password', 'confirm_password']

class PetSitterSerializer(serializers.ModelSerializer):
    user_data = UserSerializer(source='user', read_only=True)
    visits = SerializerMethodField()

    class Meta:
        model = PetSitter
        fields = ['id', 'experience_in_months', 'daily_rate', 'hourly_rate', 'description_bio', 'user_data', 'visits']

    def get_visits(self, obj):
        visits = Visit.objects.filter(pet_sitter=obj)
        return VisitGetUpdateSeriallizer(visits, many=True).data

class PetSitterWithoutVisitsSerializer(serializers.ModelSerializer):
    user_data = UserSerializer(source='user', read_only=True)
    class Meta:
        model = PetSitter
        fields = ['id', 'experience_in_months', 'daily_rate', 'hourly_rate', 'description_bio', 'user_data']

class PetSitterWithoutUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = PetSitter
        fields = ['id', 'experience_in_months', 'daily_rate', 'hourly_rate', 'description_bio']

class PetSitterUpdateDeleteSerializer(serializers.ModelSerializer):
    class Meta:
        model = PetSitter
        fields = ['experience_in_months', 'daily_rate', 'hourly_rate', 'description_bio']

class PetOwnerSerializer(serializers.ModelSerializer):
    user_data = UserSerializer(source='user', read_only=True)
    pets = SerializerMethodField()
    
    class Meta:
        model = PetOwner
        fields = ['id','description_bio','user_data', 'pets']
    
    def get_pets(self, obj):
        try:
            return PetWithoutOwnerSerializer(Pet.objects.filter(pet_owner=obj), many=True).data
        except:
            return None

class PetOwnerWithoutPetsSerializer(serializers.ModelSerializer):
    user_data = UserSerializer(source='user', read_only=True)
    
    class Meta:
        model = PetOwner
        fields = ['id','description_bio','user_data']
        
class PetOwnerWithVisitsSerializer(serializers.ModelSerializer):
    visits = SerializerMethodField()
    pets = SerializerMethodField()
    
    class Meta:
        model = PetOwner
        fields = ['id','description_bio', 'visits', 'pets']

    def get_visits(self, obj):
        try:
            return VisitGetUpdateSeriallizer(Visit.objects.filter(pet__pet_owner=obj), many=True).data
        except:
            return None
    
    def get_pets(self, obj):
        try:
            return PetWithoutOwnerSerializer(Pet.objects.filter(pet_owner=obj), many=True).data
        except:
            return None

class PetOwnerUpdateDeleteSerializer(serializers.ModelSerializer):
    class Meta:
        model = PetOwner
        fields = ['description_bio']

class PetSpeciesSerializer(serializers.ModelSerializer):
    class Meta:
        model = PetSpecies
        fields = ['id','name']

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['id','name', 'type']

class PetSerializer(serializers.ModelSerializer):
    pet_owner_data = PetOwnerSerializer(source='pet_owner', read_only=True)
    species_data = PetSpeciesSerializer(source='species', read_only=True)
    class Meta:
        model = Pet
        fields = ['id','species','breed','name', 'age', 'weight', 'info_special_treatment', 
        'favorite_activities', 'feeding_info', 'photo_URL', 'pet_owner_data', 'species_data']

class PetWithoutOwnerSerializer(serializers.ModelSerializer):
    species_data = PetSpeciesSerializer(source='species', read_only=True)
    class Meta:
        model = Pet
        fields = ['id','species','breed','name', 'age', 'weight', 'info_special_treatment', 
        'favorite_activities', 'feeding_info', 'photo_URL', 'species_data']

class PetWithoutOwnerPetsSerializer(serializers.ModelSerializer):
    pet_owner_data = PetOwnerWithoutPetsSerializer(source='pet_owner', read_only=True)
    species_data = PetSpeciesSerializer(source='species', read_only=True)
    class Meta:
        model = Pet
        fields = ['id','species','breed','name', 'age', 'weight', 'info_special_treatment', 
        'favorite_activities', 'feeding_info', 'photo_URL', 'pet_owner_data', 'species_data']

class VisitCreateSeriallizer(serializers.ModelSerializer):
    pet_data = PetSerializer(source='pet', read_only=True)
    pet_sitter_data = PetSitterWithoutVisitsSerializer(source='pet_sitter', read_only=True)
    date_range_of_visit = DateTimeRangeField()
    pet = serializers.PrimaryKeyRelatedField(write_only=True, queryset=Pet.objects.all())
    pet_sitter = serializers.PrimaryKeyRelatedField(write_only=True, queryset=PetSitter.objects.all())
    services = serializers.PrimaryKeyRelatedField(write_only=True, queryset=Service.objects.all(), many=True)
    services_data = ServiceSerializer(source='services', read_only=True, many=True)
    class Meta:
        model = Visit
        fields = ['id', 'pet_sitter', 'pet', 'services', 'price', 'date_range_of_visit', 'pet_data', 'pet_sitter_data', 'services_data']
        
class VisitGetUpdateSeriallizer(serializers.ModelSerializer):
    pet_data = PetWithoutOwnerPetsSerializer(source='pet', read_only=True)
    pet_sitter_data = PetSitterWithoutVisitsSerializer(source='pet_sitter', read_only=True)
    services_data = ServiceSerializer(source='services', read_only=True, many=True)
    date_range_of_visit = DateTimeRangeField()
    pet = serializers.PrimaryKeyRelatedField(write_only=True, queryset=Pet.objects.all())
    pet_sitter = serializers.PrimaryKeyRelatedField(write_only=True, queryset=PetSitter.objects.all())
    services = serializers.PrimaryKeyRelatedField(write_only=True, queryset=Service.objects.all(), many=True)
    class Meta:
        model = Visit
        fields = ['id', 'pet_sitter', 'pet', 'services', 'rating', 'review', 'price', 'date_range_of_visit',
                  'visit_notes', 'is_accepted', 'is_over','pet_data', 'pet_sitter_data', 'services_data']

class UserAuthorizedSerializer(serializers.ModelSerializer):
    is_pet_sitter = serializers.SerializerMethodField()
    is_pet_owner = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ['email', 'username', 'date_of_birth', 'first_name', 'last_name',
                 'phone_number', 'address_city', 'address_street', 'address_house', 
                 'profile_picture_url', 'created_at', 'updated_at', 'is_pet_sitter', 'is_pet_owner']
    
    def get_is_pet_sitter(self, obj):
        return PetSitter.objects.filter(user=obj).exists()
    
    def get_is_pet_owner(self, obj):
        return PetOwner.objects.filter(user=obj).exists()
