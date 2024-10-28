from django.urls import path

from . import views

urlpatterns =[
    path("", views.index, name="index"),
    path("register/", views.SignUpUser.as_view(), name = "signUpUser"),
    path("login/", views.LoginView.as_view(), name = "LoginView"),
    path("pet_sitter/", views.PetSitterListCreatePatchDeleteView.as_view(), name="PetSitterListCreatePatchDeleteView"),
    path("pet_sitter/<int:pk>/", views.PetSitterGetView.as_view(), name="PetSitterGetView"),
    path("user/", views.UserDeletePatchGetView.as_view(), name="UserDeletePatchGetView"),
    path("pet_owner/", views.PetOwnerListCreatePatchDeleteView.as_view(), name="PetOwnerListCreatePatchDeleteView"),
    path("pet_owner/<int:pk>/", views.PetOwnerGetView.as_view(), name="PetOwnerGetView"),
    path("pet_species/", views.PetSpeciesListCreatePatchDeleteView.as_view(), name="PetSpeciesListCreatePatchDeleteView"),
    path("pet_species/<int:pk>/", views.PetSpeciesGetView.as_view(), name="PetSpeciesGetView"),
    path("pet/", views.PetListCreateView.as_view(), name="PetListCreateView"),
    path("pet/<int:pk>/", views.PetGetDeletePatchView.as_view(), name="PetGetDeletePatchView"),
    path("visit/", views.VisitListCreateView.as_view(), name="VisitListCreateView"),
    path("visit/<int:pk>/", views.VisitGetDeletePatchView.as_view(), name="VisitGetDeletePatchView"),
]