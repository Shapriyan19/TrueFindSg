from django.urls import path
from api.controllers import firebase_controller, auth_controller

urlpatterns = [
    path('firebase/', firebase_controller.home),
    path('auth/google/', auth_controller.GoogleSignInView.as_view(), name='google-signin'),
]