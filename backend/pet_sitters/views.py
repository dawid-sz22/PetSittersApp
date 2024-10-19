from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth import authenticate
from .serializers import *
from rest_framework import generics, status, permissions, mixins, authentication
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.exceptions import NotFound
from .models import PetSitter, PetOwner, PetSpecies, Service, Visit, User
from .permissions import AuthorOnly, AuthorOnlyOrReadOnly, AdminOnlyOrReadOnly

class TokenAuthentication(authentication.TokenAuthentication):
    authentication.TokenAuthentication.keyword = 'Bearer'

class SignUpUser(generics.GenericAPIView):
    permission_classes = []

    serializer_class = SignUpSerializer

    def post(self, request:Request):
        data = request.data
        
        serializer = self.serializer_class(data=data)

        if serializer.is_valid():
            serializer.save()

            response = {
                "message" : "User registred successfully",
                "data" : serializer.data
            }
            return Response(data=response, status=status.HTTP_201_CREATED)
        
        return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = []
    
    def post(self, request:Request):
        email = request.data.get('email')
        password = request.data.get('password')

        user=authenticate(email=email,password=password)

        if user is not None:
            response = {
                "message":"Success",
                "token":user.auth_token.key
            }
            return Response(data=response, status=status.HTTP_200_OK)
        else:
            return Response(data={"message":"Invalid email or password"}, status=status.HTTP_401_UNAUTHORIZED)
        

    def get(self, request:Request):
        content = {
            "user": str(request.user),
            "auth": str(request.auth)
        }

        return Response(data=content, status=status.HTTP_200_OK)
    
class UserDeletePatchGetView(generics.GenericAPIView,
                          mixins.DestroyModelMixin,
                          mixins.UpdateModelMixin,
                          mixins.RetrieveModelMixin):
    permission_classes = [IsAuthenticated, AuthorOnly]
    serializer_class = UserAuthorizedSerializer
    queryset = User.objects.all()

    def get_object(self):
        try:
            return User.objects.get(username=self.request.user)
        except User.DoesNotExist:
            raise NotFound(detail="User not found.")
        
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        
        return Response({"message": "User has been successfully deleted."}, status=status.HTTP_200_OK)
    
    def delete(self, request:Request, *args, **kwargs):
        return self.destroy(request,*args, **kwargs)
    
    def patch(self, request:Request, *args, **kwargs):
        return self.pa(request, *args, **kwargs)
    
    def get(self, request:Request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)


class PetSitterListCreatePatchDeleteView(generics.GenericAPIView,
                              mixins.ListModelMixin,
                              mixins.DestroyModelMixin,
                              mixins.CreateModelMixin,
                              mixins.UpdateModelMixin):
    
    permission_classes = [IsAuthenticated, AuthorOnlyOrReadOnly]
    queryset = PetSitter.objects.all()

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return PetSitterSerializer
        if self.request.method in ['PATCH', 'DELETE', 'POST']:
            return PetSitterUpdateDeleteSerializer
        return PetSitterSerializer
    
    def get_object(self):
        try:
            return PetSitter.objects.get(user=self.request.user)
        except PetSitter.DoesNotExist:
            raise NotFound(detail="Pet sitter profile not found.")

    def perform_create(self, serializer):
        user = self.request.user
        serializer.save(user=user)
        return super().perform_create(serializer)

    def get(self, request:Request, *args, **kwargs):
        return self.list(request,*args, **kwargs)
    
    def post(self, request:Request, *args, **kwargs):
        user = self.request.user
        user_copy = self.queryset.filter(user=user).exists()

        if user_copy:
            return Response(data={"error" : "Pet sitter with this user already exists"}, status=status.HTTP_400_BAD_REQUEST)
        
        return self.create(request,*args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        
        return Response({"message": "Pet sitter successfully deleted."}, status=status.HTTP_200_OK)
    
    def delete(self, request:Request, *args, **kwargs):
        return self.destroy(request,*args, **kwargs)
    
    def patch(self, request:Request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)
    
    
class PetSitterGetView(generics.GenericAPIView,
                       mixins.RetrieveModelMixin):
    
    permission_classes = [IsAuthenticated]
    serializer_class = PetSitterSerializer
    queryset = PetSitter.objects.all()

    def get(self, request:Request, *args, **kwargs):
        return self.retrieve(request,*args, **kwargs)
    

class PetOwnerListCreatePatchDeleteView(generics.GenericAPIView,
                              mixins.ListModelMixin,
                              mixins.DestroyModelMixin,
                              mixins.CreateModelMixin,
                              mixins.UpdateModelMixin):
    
    permission_classes = [IsAuthenticated, AuthorOnlyOrReadOnly]
    queryset =  PetOwner.objects.all()

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return PetOwnerSerializer
        if self.request.method in ['PATCH', 'DELETE', 'POST']:
            return PetOwnerUpdateDeleteSerializer
        return PetSitterSerializer
    
    def get_object(self):
        try:
            return PetOwner.objects.get(user=self.request.user)
        except PetOwner.DoesNotExist:
            raise NotFound(detail="Pet owner profile not found.")

    def perform_create(self, serializer):
        user = self.request.user
        serializer.save(user=user)
        return super().perform_create(serializer)

    def get(self, request:Request, *args, **kwargs):
        return self.list(request,*args, **kwargs)
    
    def post(self, request:Request, *args, **kwargs):
        user = self.request.user
        user_copy = self.queryset.filter(user=user).exists()

        if user_copy:
            return Response(data={"error" : "Pet owner with this user already exists"}, status=status.HTTP_400_BAD_REQUEST)
        
        return self.create(request,*args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        
        return Response({"message": "Pet owner successfully deleted."}, status=status.HTTP_200_OK)
    
    def delete(self, request:Request, *args, **kwargs):
        return self.destroy(request,*args, **kwargs)
    
    def patch(self, request:Request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)


class PetOwnerGetView(generics.GenericAPIView,
                       mixins.RetrieveModelMixin):
    
    permission_classes = [IsAuthenticated]
    serializer_class = PetOwnerSerializer
    queryset = PetOwner.objects.all()

    def get(self, request:Request, *args, **kwargs):
        return self.retrieve(request,*args, **kwargs)

class PetSpeciesListCreatePatchDeleteView(generics.GenericAPIView,
                              mixins.ListModelMixin,
                              mixins.CreateModelMixin):
    
    permission_classes = [IsAuthenticated, AdminOnlyOrReadOnly]
    queryset = PetSpecies.objects.all()
    serializer_class = PetSpeciesSerializer

    def get(self, request:Request, *args, **kwargs):
        return self.list(request,*args, **kwargs)
    
    def post(self, request:Request, *args, **kwargs):
        name_species = request.data.get('name')
        name_species_copy = self.queryset.filter(name=name_species).exists()

        if name_species_copy:
            return Response(data={"error" : "This pet species already exists"}, status=status.HTTP_400_BAD_REQUEST)
        
        return self.create(request,*args, **kwargs)
    
    
class PetSpeciesGetView(generics.GenericAPIView,
                       mixins.RetrieveModelMixin,
                       mixins.UpdateModelMixin,
                       mixins.DestroyModelMixin,
                       mixins.CreateModelMixin):
    
    permission_classes = [IsAuthenticated, AdminOnlyOrReadOnly]
    serializer_class = PetSpeciesSerializer
    queryset = PetSpecies.objects.all()

    def get(self, request:Request, *args, **kwargs):
        return self.retrieve(request,*args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        
        return Response({"message": "Pet species successfully deleted."}, status=status.HTTP_200_OK)
    
    def delete(self, request:Request, *args, **kwargs):
        return self.destroy(request,*args, **kwargs)
    
    def patch(self, request:Request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)
    
def index(request):
    return HttpResponse("Hello, world. You're at the polls index.")