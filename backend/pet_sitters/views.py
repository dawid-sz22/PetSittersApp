from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth import authenticate
from .serializers import SignUpSerializer
from rest_framework import generics, status, permissions, mixins
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from .models import PetSitter, PetOwner, PetSpecies, Service, Visit

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
    

class PetSitterListCreateView(generics.GenericAPIView,
                              mixins.ListModelMixin,
                              mixins.CreateModelMixin):
    
    queryset = PetSitter.objects.all()

    def get(self, request:Request, *args, **kwargs):
        return self.list(request,*args, **kwargs)
    
    def post(self, request:Request, *args, **kwargs):
        return self.create(request,*args, **kwargs)

def index(request):
    return HttpResponse("Hello, world. You're at the polls index.")