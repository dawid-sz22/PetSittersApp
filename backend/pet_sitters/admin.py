from django.contrib import admin
from .models import PetOwner, PetSpecies, PetSitter, User, Service, Visit, Pet, PasswordResetToken

# Register your models here.

admin.site.register(PetOwner)
admin.site.register(PetSpecies)
admin.site.register(PetSitter)
admin.site.register(Pet)
admin.site.register(User)
admin.site.register(Service)
admin.site.register(Visit)
admin.site.register(PasswordResetToken)
