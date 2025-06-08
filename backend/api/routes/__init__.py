from django.urls import path
from api.controllers import firebase_controller

urlpatterns = [
    path('firebase/',firebase_controller.home),
]