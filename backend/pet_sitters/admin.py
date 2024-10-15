from django.contrib import admin
from .models import PetOwner,PetsCategory,PetSitter,User
# Register your models here.

admin.site.register(PetOwner)
admin.site.register(PetsCategory)
admin.site.register(PetSitter)
admin.site.register(User)