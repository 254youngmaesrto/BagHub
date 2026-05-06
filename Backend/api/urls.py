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
)

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')

urlpatterns = [
    # Products (handled ONLY by router)
    path('', include(router.urls)),

    # Auth
    path('api-token-auth/', CustomLoginView.as_view(), name='api-token-auth'),
    path('register/', RegisterView.as_view(), name='register'),

    # Checkout
    path('checkout/', CheckoutView.as_view(), name='checkout'),

    # Admin & receipts
    path('admin/verify-payment/', AdminPaymentVerificationView.as_view(), name='verify-payment'),
    path('receipt/', get_my_receipt, name='my-receipt'),

    # Dev
    path('create-admin/', create_admin_user, name='create-admin'),
]