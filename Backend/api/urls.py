from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken import views
from .views import ProductViewSet, CheckoutView, AdminPaymentVerificationView, get_my_receipt
from .views import create_admin_user

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')

urlpatterns = [
    path('', include(router.urls)),
    path('checkout/', CheckoutView.as_view(), name='checkout'),
    path('admin/verify-payment/', AdminPaymentVerificationView.as_view(), name='verify-payment'),
    path('receipt/', get_my_receipt, name='my-receipt'),
    path('api-token-auth/', views.obtain_auth_token),  # This is now at /api/api-token-auth/
]