from django.urls import path

from . import views

urlpatterns =[
    path("", views.index, name="index"),
    path("signup/", views.SignUpUser.as_view(), name = "signUpUser"),
    path("login/", views.LoginView.as_view(), name = "LoginView")
]