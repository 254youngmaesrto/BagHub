from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProductViewSet, 
    CheckoutView, 
    AdminPaymentVerificationView, 
    get_my_receipt, 
    create_admin_user, 
    RegisterView, 
    CustomLoginView, 
    get_all_products,  # Import this if you added the public product view
    stk_push,          # <-- IMPORT THIS
    mpesa_callback     # <-- IMPORT THIS
)

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')

urlpatterns = [
    # 1. Public Products Endpoint (The one we added to fix the 401 error)
    path('products/', get_all_products, name='get-all-products'),
    
    # 2. STK Push Endpoint (THE FIX FOR YOUR 404 ERROR)
    path('stk-push/', stk_push, name='stk-push'),
    
    # 3. M-Pesa Callback
    path('mpesa/callback/', mpesa_callback, name='mpesa-callback'),

    # 4. Auth & Other Views
    path('api-token-auth/', CustomLoginView.as_view(), name='api-token-auth'),
    path('register/', RegisterView.as_view(), name='register'),
    path('checkout/', CheckoutView.as_view(), name='checkout'),
    path('admin/verify-payment/', AdminPaymentVerificationView.as_view(), name='verify-payment'),
    path('receipt/', get_my_receipt, name='my-receipt'),
    path('create-admin/', create_admin_user, name='create-admin'),
    
    # 5. Router URLs
    path('', include(router.urls)),
]