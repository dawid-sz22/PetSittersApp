from django.shortcuts import render
from django.http import HttpResponse
from .serializers import SignUpSerializer
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes


@api_view(['POST'])
def signUpUser(request:Request):
    data = request.data
    seriallizer = SignUpSerializer(data=data)

    if seriallizer.is_valid():
        seriallizer.save()

        response = {
            "message" : "User registred successfully",
            "data" : seriallizer.data
        }
        return Response(data=response, status=status.HTTP_201_CREATED)
    
    return Response(data=seriallizer.errors, status=status.HTTP_400_BAD_REQUEST)

def index(request):
    return HttpResponse("Hello, world. You're at the polls index.")