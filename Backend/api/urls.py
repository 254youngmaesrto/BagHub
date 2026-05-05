from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken import views as auth_views
from .views import ProductViewSet, CustomLoginView, RegisterView, CheckoutView, AdminPaymentVerificationView, get_my_receipt, create_admin_user


# 👇 THIS LINE IS THE FIX: Make sure CustomLoginView is here!
from .views import (
    ProductViewSet, 
    CheckoutView, 
    AdminPaymentVerificationView, 
    get_my_receipt, 
    create_admin_user, 
    RegisterView, 
    CustomLoginView  # <--- ADD THIS!
)

# Create router
router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')

urlpatterns = [
    # Include Router URLs
    path('', include(router.urls)),
    
    # 🔐 Authentication (Using our new CustomLoginView)
    path('api-token-auth/', CustomLoginView.as_view(), name='api-token-auth'),
    
    # 📝 User Registration
    path('register/', RegisterView.as_view(), name='register'),
    
    # 🛒 Checkout
    path('checkout/', CheckoutView.as_view(), name='checkout'),
    
    # 💼 Admin & Receipts
    path('admin/verify-payment/', AdminPaymentVerificationView.as_view(), name='verify-payment'),
    path('receipt/', get_my_receipt, name='my-receipt'),
    
    # 🛠️ Dev/Admin Utilities
    path('create-admin/', create_admin_user, name='create-admin'),
     path('', include(router.urls)),  # This adds /api/products/
]
