# users/serializers.py
from rest_framework import serializers
from .models import UserProfile, Product, VerifiedProduct, WatchlistItem

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class VerifiedProductSerializer(serializers.ModelSerializer):
    product = ProductSerializer()
    class Meta:
        model = VerifiedProduct
        fields = ['product']

class WatchlistSerializer(serializers.ModelSerializer):
    product = ProductSerializer()
    class Meta:
        model = WatchlistItem
        fields = ['product']
