# users/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from firebase.permissions import FirebaseAuthentication
from .models import VerifiedProduct, WatchlistItem, Product
from .serializers import VerifiedProductSerializer, WatchlistSerializer, ProductSerializer

class VerifiedProductsView(APIView):
    authentication_classes = [FirebaseAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        items = VerifiedProduct.objects.filter(user=request.user)
        serializer = VerifiedProductSerializer(items, many=True)
        return Response(serializer.data)

    def post(self, request):
        product_data = request.data
        product, _ = Product.objects.get_or_create(**product_data)
        VerifiedProduct.objects.get_or_create(user=request.user, product=product)
        return Response({"status": "Product added to verified list"})


class WatchlistView(APIView):
    authentication_classes = [FirebaseAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        items = WatchlistItem.objects.filter(user=request.user)
        serializer = WatchlistSerializer(items, many=True)
        return Response(serializer.data)

    def post(self, request):
        product_data = request.data
        product, _ = Product.objects.get_or_create(**product_data)
        WatchlistItem.objects.get_or_create(user=request.user, product=product)
        return Response({"status": "Product added to watchlist"})
