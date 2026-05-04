from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken import views as auth_views

# Import all views used in this file
from .views import (
    ProductViewSet,
    CheckoutView,
    AdminPaymentVerificationView,
    get_my_receipt,
    create_admin_user,
    RegisterView
)

# 1. Setup Router
router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')

# 2. Define URL Patterns
urlpatterns = [
    # Include Router URLs (handles /products/, /products/<id>/, etc.)
    path('', include(router.urls)),
    
    # Authentication
    path('api-token-auth/', CustomLoginView.as_view(), name='api-token-auth'),
    # User Registration
    path('register/', RegisterView.as_view(), name='register'),
    
    # Checkout
    path('checkout/', CheckoutView.as_view(), name='checkout'),
    
    # Admin & Receipts
    path('admin/verify-payment/', AdminPaymentVerificationView.as_view(), name='verify-payment'),
    path('receipt/', get_my_receipt, name='my-receipt'),
    
    # Dev/Admin Utilities
    path('create-admin/', create_admin_user, name='create-admin'),
]