from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractUser
from django.core.validators import MaxValueValidator, MinValueValidator
from phonenumber_field.modelfields import PhoneNumberField
from django.contrib.postgres.fields import DateTimeRangeField
# Create your models here.

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError('Please provide an email address')

        email = self.normalize_email(email)    
        user = self.model(
            email=email, 
            **extra_fields
        )

        user.set_password(password)

        user.save()
        return user
       
    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError(('Superuser must have is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(('Superuser must have is_superuser=True.'))

        user = self.create_user(email=email,password=password,**extra_fields)
        return user


class User(AbstractUser):
    username = models.CharField(max_length=40, unique=True)
    email = models.EmailField(max_length=70,unique=True)
    date_of_birth = models.DateField(null=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    phone_number = PhoneNumberField(blank=False)
    address_city = models.CharField(max_length=40)
    address_street = models.CharField(max_length=40)
    address_house = models.CharField(max_length=10)
    profile_picture_url = models.URLField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.username

class PetSitter(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    experience_in_months = models.IntegerField()
    daily_rate = models.IntegerField()
    hourly_rate = models.IntegerField()
    description_bio = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class PetOwner(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    description_bio = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class PetSpecies(models.Model):
    name = models.CharField(max_length=50)
    
class Pet(models.Model):
    pet_owner = models.ForeignKey(PetOwner, on_delete=models.CASCADE)
    species = models.ForeignKey(PetSpecies, on_delete=models.CASCADE)
    breed = models.CharField(max_length=50)
    age = models.IntegerField()
    weight = models.IntegerField()
    info_special_treatment = models.TextField()
    favorite_activities = models.TextField()
    feeding_info = models.TextField()
    photo_URL = models.URLField()

class Service(models.Model):
    name = models.CharField(max_length=30)

class Visit(models.Model):
    pet_sitter = models.ForeignKey(PetSitter, on_delete=models.CASCADE)
    pet = models.ForeignKey(Pet, on_delete=models.CASCADE)
    services = models.ManyToManyField(Service)
    rating = models.IntegerField(default=1, validators=[MaxValueValidator(5), MinValueValidator(1)])
    review = models.TextField()
    date_range_of_visit = DateTimeRangeField()
    visit_notes = models.TextField()
    is_accepted = models.BooleanField(default=False)


