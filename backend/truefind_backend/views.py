from django.shortcuts import render
from django.http import HttpResponse
import pyrebase

config = {
    "apiKey": "AIzaSyBzxsu0jN_Ew7hZj0MV2fdQhWbmHyqAEJE",
    "authDomain": "truefindsg.firebaseapp.com",
    "databaseURL": "https://truefindsg-default-rtdb.asia-southeast1.firebasedatabase.app",
    "projectId": "truefindsg",
    "storageBucket": "truefindsg.firebasestorage.app",
    "messagingSenderId": "1072389490184",
    "appId": "1:1072389490184:web:6e28ebce6bcbb3021a33bd",
    "measurementId": "G-96M9M011QC"
}

firebase = pyrebase.initialize_app(config)
authe = firebase.auth()
database = firebase.database()

def home(request):
    if database:
        return HttpResponse("database connected")
    return HttpResponse("database connection failed")