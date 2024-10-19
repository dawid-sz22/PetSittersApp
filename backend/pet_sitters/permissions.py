from rest_framework.permissions import BasePermission, SAFE_METHODS

class AuthorOnly(BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user == obj.user
    
class AuthorOnlyOrReadOnly(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True

        return request.user == obj.user
class AdminOnlyOrReadOnly(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        
        return request.user == obj.user.is_staff
        