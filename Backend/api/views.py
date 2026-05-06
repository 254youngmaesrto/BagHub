from rest_framework import viewsets, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from django.contrib.auth import get_user_model, authenticate
from django.db import transaction
from django.utils import timezone
from django.core.exceptions import PermissionDenied

import uuid

from .models import Product, Order, Receipt, Payment
from .serializers import ProductSerializer, OrderSerializer, ReceiptSerializer

User = get_user_model()

# ==========================
# 🔐 CUSTOM ADMIN PERMISSION
# ==========================
class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_staff


# ==========================
# 🔑 LOGIN VIEW
# ==========================
class CustomLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)

        if user:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'username': user.username,
                'is_admin': user.is_staff
            })

        return Response(
            {'error': 'Invalid credentials'},
            status=status.HTTP_401_UNAUTHORIZED
        )


# ==========================
# 🛍️ PRODUCT VIEWSET
# ==========================
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        # 1. Start with the base query: Only show available products
        queryset = Product.objects.filter(is_available=True).order_by('-created_at')
        
        # 2. If user is logged in, check if they are Admin
        if self.request.user.is_authenticated:
            # Safely check for 'is_staff' OR 'role' field (whichever your model uses)
            is_admin = getattr(self.request.user, 'is_staff', False) or \
                       getattr(self.request.user, 'role', None) == 'admin'
            
            # If Admin, show ALL products (including out of stock)
            if is_admin:
                queryset = Product.objects.all().order_by('-created_at')
        
        return queryset

# ==========================
# 🛒 CHECKOUT VIEW
# ==========================
class CheckoutView(APIView):
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request):
        product_id = request.data.get('product_id')

        try:
            product = Product.objects.select_for_update().get(id=product_id)
        except Product.DoesNotExist:
            return Response(
                {"error": "Product not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        if not product.is_available or product.stock_quantity < 1:
            return Response(
                {"error": "Item is sold out"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Reduce stock
        product.stock_quantity -= 1
        if product.stock_quantity == 0:
            product.is_available = False
        product.save()

        # Create order
        order = Order.objects.create(
            customer=request.user,
            product=product,
            total_amount=product.price,
            status='pending'
        )

        # Create payment
        Payment.objects.create(
            order=order,
            amount=product.price
        )

        # Generate receipt
        receipt_number = f"RH-{uuid.uuid4().hex[:8].upper()}"
        receipt_details = {
            "receipt_number": receipt_number,
            "product": product.name,
            "amount": str(product.price),
            "date": timezone.now().isoformat(),
            "transaction_id": order.id
        }

        Receipt.objects.create(
            order=order,
            receipt_number=receipt_number,
            details=receipt_details
        )

        return Response({
            "message": "Order placed successfully. Proceed to payment.",
            "order_id": order.id,
            "receipt_number": receipt_number
        }, status=status.HTTP_201_CREATED)


# ==========================
# 📝 REGISTER VIEW
# ==========================
class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')

        if not username or not password:
            return Response(
                {'error': 'Username and password required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if User.objects.filter(username=username).exists():
            return Response(
                {'error': 'Username already exists'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password
            )

            return Response(
                {'message': 'User created successfully'},
                status=status.HTTP_201_CREATED
            )

        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# ==========================
# 💰 ADMIN PAYMENT VERIFY
# ==========================
class AdminPaymentVerificationView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def post(self, request):
        order_id = request.data.get('order_id')
        mpesa_code = request.data.get('mpesa_code')

        try:
            order = Order.objects.get(id=order_id, status='pending')
        except Order.DoesNotExist:
            return Response(
                {"error": "Invalid or already processed order"},
                status=status.HTTP_400_BAD_REQUEST
            )

        with transaction.atomic():
            payment = Payment.objects.get(order=order)
            payment.mpesa_code = mpesa_code
            payment.status = 'confirmed'
            payment.verified_by_admin = request.user
            payment.verified_at = timezone.now()
            payment.save()

            order.status = 'confirmed'
            order.save()

        return Response(
            {"message": "Payment verified and order confirmed"},
            status=status.HTTP_200_OK
        )


# ==========================
# 🧾 GET RECEIPT
# ==========================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_my_receipt(request):
    order_id = request.query_params.get('order_id')

    try:
        receipt = Receipt.objects.get(
            order_id=order_id,
            order__customer=request.user
        )
        return Response(ReceiptSerializer(receipt).data)

    except Receipt.DoesNotExist:
        return Response(
            {"error": "Receipt not found"},
            status=status.HTTP_404_NOT_FOUND
        )


# ==========================
# 👑 CREATE ADMIN (SETUP)
# ==========================
@api_view(['POST'])
@permission_classes([AllowAny])
def create_admin_user(request):
    SECRET_SETUP_KEY = "my-super-secret-setup-key-2026"

    provided_key = request.data.get('setup_key')
    username = request.data.get('username')
    password = request.data.get('password')

    if provided_key != SECRET_SETUP_KEY:
        return Response({'error': 'Invalid setup key'}, status=403)

    user = User.objects.filter(username=username).first()

    if user:
        user.set_password(password)
        user.is_staff = True
        user.is_superuser = True
        user.save()

        return Response({
            'message': f'Admin {username} updated successfully'
        })

    user = User.objects.create_user(
        username=username,
        password=password,
        is_staff=True,
        is_superuser=True
    )

    return Response({
        'message': f'Admin {username} created successfully'
    })
# ==========================================
# PUBLIC PRODUCTS ENDPOINT (NO AUTH REQUIRED)
# ==========================================
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

@api_view(['GET'])
@permission_classes([AllowAny])
def get_all_products(request):
    """Public endpoint - anyone can access"""
    try:
        products = Product.objects.filter(is_available=True).order_by('-created_at')
        serializer = ProductSerializer(products, many=True)
        print(f"✅ Returning {products.count()} products")
        return Response(serializer.data)
    except Exception as e:
        print(f"❌ Error: {e}")
        return Response({'error': str(e)}, status=500)