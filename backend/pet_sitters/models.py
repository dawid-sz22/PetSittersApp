from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractUser
from phonenumber_field.modelfields import PhoneNumberField
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
    username = models.CharField(max_length=40)
    email = models.EmailField(max_length=70,unique=True)
    date_of_bith = models.DateField(null=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    age = models.IntegerField(null=True)
    phone_number = PhoneNumberField(blank=False)

    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.username

class PetSitter(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)

class PetOwner(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)

class PetsCategory(models.Model):
    name = models.CharField(max_length=50)
