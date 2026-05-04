from rest_framework import viewsets, status, permissions
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from django.utils import timezone
import uuid
from .models import User, Product, Order, Receipt, Payment
from .serializers import ProductSerializer, OrderSerializer, ReceiptSerializer, PaymentSerializer

class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'

class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        if self.request.user.is_authenticated and self.request.user.role == 'admin':
            return Product.objects.all().order_by('-created_at')
        return Product.objects.filter(is_available=True).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(
            posted_by=self.request.user,
            is_available=True
        )
        print(f"Creating product... User: {self.request.user}")  # Debug line
        print(f"User is authenticated: {self.request.user.is_authenticated}")  # Debug line
        
        if self.request.user.is_authenticated:
            try:
                serializer.save(posted_by=self.request.user)
                print("Product saved successfully!")  # Debug line
            except Exception as e:
                print(f"Error saving product: {e}")  # Debug line
                raise
        else:
            print("User not authenticated!")  
class CheckoutView(APIView):
    
    permission_classes = [IsAuthenticated]  # <-- PASTE THIS EXACT LINE
    

    
    @transaction.atomic
    def post(self, request):
        product_id = request.data.get('product_id')
        try:
            product = Product.objects.select_for_update().get(id=product_id)
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)
            
        if not product.is_available or product.stock_quantity < 1:
            return Response({"error": "Item is sold out"}, status=status.HTTP_400_BAD_REQUEST)
            
        product.stock_quantity -= 1
        if product.stock_quantity == 0:
            product.is_available = False
        product.save()
        
        # Handle anonymous user - use admin as default customer
        if request.user.is_authenticated:
            customer = request.user
        else:
            try:
                customer = User.objects.get(id=1)
            except User.DoesNotExist:
                return Response({"error": "No users found. Create a user first."}, status=status.HTTP_400_BAD_REQUEST)
        
        order = Order.objects.create(
            customer=customer,
            product=product,
            total_amount=product.price,
            status='pending'
        )
        
        Payment.objects.create(order=order, amount=product.price)
        
        receipt_number = f"RH-{uuid.uuid4().hex[:8].upper()}"
        receipt_details = {
            "receipt_number": receipt_number,
            "product": product.name,
            "amount": str(product.price),
            "date": timezone.now().isoformat(),
            "transaction_id": order.id
        }
        Receipt.objects.create(order=order, receipt_number=receipt_number, details=receipt_details)
        
        return Response({
            "message": "Order placed successfully. Proceed to payment.",
            "order_id": order.id,
            "receipt_number": receipt_number
        }, status=status.HTTP_201_CREATED)
    

class RegisterView(APIView):
    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        
        # Check if user already exists
        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)
        
        if User.objects.filter(email=email).exists():
            return Response({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Create user
        user = User.objects.create_user(username=username, email=email, password=password)
        user.save()
        
        return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)

class AdminPaymentVerificationView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdmin]
    
    def post(self, request):
        order_id = request.data.get('order_id')
        mpesa_code = request.data.get('mpesa_code')
        
        try:
            order = Order.objects.get(id=order_id, status='pending')
        except Order.DoesNotExist:
            return Response({"error": "Invalid or already processed order"}, status=status.HTTP_400_BAD_REQUEST)
            
        with transaction.atomic():
            payment = Payment.objects.get(order=order)
            payment.mpesa_code = mpesa_code
            payment.status = 'confirmed'
            payment.verified_by_admin = request.user
            payment.verified_at = timezone.now()
            payment.save()
            
            order.status = 'confirmed'
            order.save()
            
        return Response({"message": "Payment verified and order confirmed"}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_my_receipt(request):
    order_id = request.query_params.get('order_id')
    try:
        receipt = Receipt.objects.get(order_id=order_id, order__customer=request.user)
        return Response(ReceiptSerializer(receipt).data)
    except Receipt.DoesNotExist:
        return Response({"error": "Receipt not found"}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['POST'])
@permission_classes([AllowAny])
def create_admin_user(request):
    SECRET_SETUP_KEY = "my-super-secret-setup-key-2026"
    
    provided_key = request.data.get('setup_key')
    username = request.data.get('username')
    password = request.data.get('password')
    
    if provided_key != SECRET_SETUP_KEY:
        return Response({'error': 'Invalid setup key'}, status=403)
    
    # Check if user exists
    user = User.objects.filter(username=username).first()
    
    if user:
        # User exists: Update password and ensure they are staff
        user.set_password(password)
        user.is_staff = True
        user.is_superuser = True
        user.save()
        return Response({'message': f'Password for {username} updated successfully! You can now login.'})
    else:
        # User doesn't exist: Create new admin
        user = User.objects.create_user(
            username=username,
            password=password,
            is_staff=True,
            is_superuser=True
        )
        return Response({'message': f'Admin user {username} created successfully!'})