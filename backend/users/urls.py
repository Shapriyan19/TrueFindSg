# users/urls.py
from django.urls import path
from .views import VerifiedProductsView, WatchlistView

urlpatterns = [
    path('verified/', VerifiedProductsView.as_view()),
    path('watchlist/', WatchlistView.as_view()),
]
