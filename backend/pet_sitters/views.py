from django.conf.global_settings import EMAIL_HOST_USER
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.core.mail import send_mail
from django.shortcuts import get_object_or_404
from django.http import HttpResponse
from django.contrib.auth import authenticate
from .serializers import *
from rest_framework import generics, status, mixins, authentication
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import NotFound
from .models import PetSitter, PetOwner, PetSpecies, Service, Visit, User
from .permissions import *

import boto3
from botocore.config import Config
import os
import uuid
import datetime

my_config = Config(
    region_name='us-east-2',
    signature_version='v4',
)

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

        if serializer.errors.get('phone_number'):
            return Response(data={"errors": ["phone number already exists"]}, status=status.HTTP_400_BAD_REQUEST)
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
                "token":user.auth_token.key,
                "username": user.username,
                "user_id": user.id
            }
            return Response(data=response, status=status.HTTP_200_OK)
        else:
            return Response(data={"message" : "Invalid email or password"}, status=status.HTTP_401_UNAUTHORIZED)
        

    def get(self, request:Request):
        content = {
            "user": str(request.user),
            "auth": str(request.auth)
        }

        return Response(data=content, status=status.HTTP_200_OK)
    
class RequestPasswordResetEmail(generics.GenericAPIView):
    permission_classes = []
    serializer_class = PasswordResetRequestSerializer
    queryset = PasswordResetToken.objects.all()

    def post(self, request:Request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            email = self.request.data['email']
            user = User.objects.filter(email=email).first()
            print(user)
            if user is not None:
                token_gen = PasswordResetTokenGenerator()
                token = token_gen.make_token(user)
                reset = PasswordResetToken(user=user, token=token)
                reset.save()
                return Response(data={"message":"Email sent successfully"}, status=status.HTTP_200_OK)
            else:
                return Response(data={"message":"Email does not exist"}, status=status.HTTP_400_BAD_REQUEST)

        return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PasswordResetView(generics.GenericAPIView):
    permission_classes = []
    serializer_class = PasswordResetSerializer

    def post(self, request:Request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            token = self.request.query_params.get('token')
            if not token:
                return Response(data={"message":"Token is missing"}, status=status.HTTP_400_BAD_REQUEST)

            if self.request.data['password'] == self.request.data['confirm_password']:
                check_token_reset = PasswordResetToken.objects.filter(token=token).first()
                if check_token_reset:
                    user = check_token_reset.user
                    user.set_password(self.request.data['password'])
                    user.save()

                    # Delete used token
                    check_token_reset.delete()
                    return Response(data={"message":"Password reset successfully"}, status=status.HTTP_200_OK)
                else:
                    return Response(data={"message":"Invalid token"}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response(data={"message":"Passwords do not match"}, status=status.HTTP_400_BAD_REQUEST)

        return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class UserDeletePatchGetView(generics.GenericAPIView,
                          mixins.DestroyModelMixin,
                          mixins.UpdateModelMixin,
                          mixins.RetrieveModelMixin):
    permission_classes = [IsAuthenticated, AuthorOnly]
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
        self.serializer_class = UserSerializer
        return self.partial_update(request, *args, **kwargs)
    
    def get(self, request:Request, *args, **kwargs):
        self.serializer_class = UserAuthorizedSerializer
        return self.retrieve(request, *args, **kwargs)


class PetSitterListCreatePatchDeleteView(generics.GenericAPIView,
                              mixins.ListModelMixin,
                              mixins.DestroyModelMixin,
                              mixins.CreateModelMixin,
                              mixins.UpdateModelMixin):
    
    permission_classes = [AuthorOnlyOrReadOnly, IsAuthenticatedOrReadOnly]
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
    
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = PetSitterSerializer
    queryset = PetSitter.objects.all()

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
    def get(self, request:Request, *args, **kwargs):
        return self.retrieve(request,*args, **kwargs)
    

class UserPetSitterGetView(generics.GenericAPIView,
                       mixins.RetrieveModelMixin):
    
    permission_classes = [IsAuthenticated]
    serializer_class = PetSitterSerializer
    queryset = PetSitter.objects.all()

    def get_object(self):
        try:
            return PetSitter.objects.get(user=self.request.user)
        except PetSitter.DoesNotExist:
            raise NotFound(detail="Pet sitter profile not found.")

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

class UserPetOwnerGetView(generics.GenericAPIView,
                       mixins.RetrieveModelMixin):
    
    permission_classes = [IsAuthenticated]
    serializer_class = PetOwnerWithVisitsSerializer
    queryset = PetOwner.objects.all()

    def get_object(self):
        try:
            return PetOwner.objects.get(user=self.request.user)
        except PetOwner.DoesNotExist:
            raise NotFound(detail="Pet owner profile not found.")

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
    

class PetListCreateView(generics.GenericAPIView,
                        mixins.ListModelMixin,
                        mixins.CreateModelMixin):
    
    permission_classes = [IsAuthenticated]
    queryset = Pet.objects.all()
    serializer_class = PetSerializer

    def perform_create(self, serializer):
        serializer.save(pet_owner=PetOwner.objects.get(user=self.request.user))
        return super().perform_create(serializer)

    def get(self, request:Request, *args, **kwargs):
        return self.list(request,*args, **kwargs)
    
    def post(self, request:Request, *args, **kwargs):
        if PetOwner.objects.filter(user=self.request.user).exists():
            return self.create(request,*args, **kwargs)
        
        return Response(data={"error":"You're not a pet owner. Create pet owner profile first."}, status=status.HTTP_403_FORBIDDEN)
    
class PetGetDeletePatchView(generics.GenericAPIView,
                       mixins.RetrieveModelMixin,
                       mixins.DestroyModelMixin,
                       mixins.UpdateModelMixin):
    
    permission_classes = [IsAuthenticated, PetAuthorOnlyOrReadOnly]
    serializer_class = PetSerializer
    queryset = Pet.objects.all()

    def get(self, request:Request, *args, **kwargs):
        return self.retrieve(request,*args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        
        return Response({"message": "Pet successfully deleted."}, status=status.HTTP_200_OK)
    
    def delete(self, request:Request, *args, **kwargs):
        return self.destroy(request,*args, **kwargs)
    
    def patch(self, request:Request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)

class ServiceListView(generics.GenericAPIView,
                              mixins.ListModelMixin,
                              mixins.CreateModelMixin):
    
    permission_classes = [IsAuthenticated, AdminOnlyOrReadOnly]
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer

    def get(self, request:Request, *args, **kwargs):
        return self.list(request,*args, **kwargs)
    
    def post(self, request:Request, *args, **kwargs):
        name_service = request.data.get('name')
        name_service_copy = self.queryset.filter(name=name_service).exists()

        if name_service_copy:
            return Response(data={"error" : "This service already exists"}, status=status.HTTP_400_BAD_REQUEST)
        
        return self.create(request,*args, **kwargs)

class VisitListCreateView(generics.GenericAPIView,
                        mixins.ListModelMixin,
                        mixins.CreateModelMixin):
    
    permission_classes = [IsAuthenticated]
    queryset = Visit.objects.all()
    serializer_class = VisitCreateSeriallizer

    def get(self, request:Request, *args, **kwargs):
        return self.list(request,*args, **kwargs)
    
    def post(self, request:Request, *args, **kwargs):
        if get_object_or_404(Pet, id=request.data['pet']).pet_owner.user == self.request.user:
            return self.create(request,*args, **kwargs)
        
        return Response(data={"error":"You're not a pet owner of this pet."}, status=status.HTTP_403_FORBIDDEN)

        
    
class VisitGetDeletePatchView(generics.GenericAPIView,
                       mixins.RetrieveModelMixin,
                       mixins.DestroyModelMixin,
                       mixins.UpdateModelMixin):
    
    permission_classes = [IsAuthenticated, PetOwnerOnlyOrReadOnly]
    queryset = Visit.objects.all()
    serializer_class = VisitGetUpdateSeriallizer

    def get(self, request:Request, *args, **kwargs):
        return self.retrieve(request,*args, **kwargs)
    
    def destroy(self, request:Request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        
        return Response({"message": "Visit successfully deleted."}, status=status.HTTP_200_OK)
        
    def delete(self, request:Request, *args, **kwargs):
        return self.destroy(request,*args, **kwargs)
    
    def patch(self, request:Request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)
        
    
def index(request):
    return HttpResponse("Hello, world. You're at the polls index.")


class GetSecretUploadUrl(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request:Request, *args, **kwargs):
        timestamp = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
        random_uuid = str(uuid.uuid4())
        new_random_filename = f"{timestamp}_{random_uuid}"
        try:
            # Generate presigned URL with new filename
            s3_client = boto3.client('s3',
                    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
                    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY')
            )
            presigned_url = s3_client.generate_presigned_url(
                'put_object',
                Params={
                    'Bucket': os.getenv('AWS_STORAGE_BUCKET_NAME'),
                    'Key': new_random_filename
                },
                    ExpiresIn=1800
                )
        except Exception as e:
            return Response(data={"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({
            'upload_url': presigned_url
        }, status=status.HTTP_200_OK)
    