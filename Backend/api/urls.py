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
    get_all_products,
    intasend_payment,
    intasend_callback
)

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')

urlpatterns = [
    path('products/', get_all_products, name='get-all-products'),
    path('intasend-payment/', intasend_payment, name='intasend-payment'),
    path('intasend-callback/', intasend_callback, name='intasend-callback'),
    path('api-token-auth/', CustomLoginView.as_view(), name='api-token-auth'),
    path('register/', RegisterView.as_view(), name='register'),
    path('checkout/', CheckoutView.as_view(), name='checkout'),
    path('receipt/', get_my_receipt, name='my-receipt'),
    path('admin/verify-payment/', AdminPaymentVerificationView.as_view(), name='verify-payment'),
    path('create-admin/', create_admin_user, name='create-admin'),
    path('', include(router.urls)),
]