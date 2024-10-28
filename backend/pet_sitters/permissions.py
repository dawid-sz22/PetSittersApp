from rest_framework.permissions import BasePermission, SAFE_METHODS

class AuthorOnly(BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user == obj.user
    
class AuthorOnlyOrReadOnly(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True

        return request.user == obj.user

class PetAuthorOnlyOrReadOnly(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True

        return request.user == obj.pet_owner.user

class PetOwnerOnlyOrReadOnly(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True

        return request.user == obj.pet.pet_owner.user
    
class AdminOnlyOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        
        return bool(request.user and request.user.is_staff)
        