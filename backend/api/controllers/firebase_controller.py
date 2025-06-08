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
    products = database.child("Products").get()
    # If 'products.val()' is a dict, get all values; if it's a string, just use it
    data = products.val()
    if isinstance(data, dict):
        # If you expect multiple products in the future
        product_list = [str(v) for v in data.values()]
        return HttpResponse(f"Products: {', '.join(product_list)}")
    else:
        # If it's just a single product name
        return HttpResponse(f"Product: {data}")