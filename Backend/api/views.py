import requests
import json
from rest_framework import viewsets, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate
from django.db import transaction
from django.utils import timezone
import uuid

from .models import Product, Order, Receipt, Payment
from .serializers import ProductSerializer, OrderSerializer, ReceiptSerializer

# ==========================================
# INTASEND CONFIGURATION
# ==========================================
INTASEND_SECRET_KEY = "ISSecretKey_live_74e8344d-1a98-4912-835e-73a8264ef916"  
INTASEND_PUBLIC_KEY = "ISPubKey_live_506b6e8a-8be9-4cc5-87dd-43f01c03a75a"  

# Public Products Endpoint
@api_view(['GET'])
@permission_classes([AllowAny])
def get_all_products(request):
    try:
        products = Product.objects.filter(is_available=True).order_by('-created_at')
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({'error': str(e)}, status=500)

# IntaSend Payment Initialization
# IntaSend Payment Initialization
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def intasend_payment(request):
    try:
        amount = request.data.get('amount')
        order_id = request.data.get('order_id')
        phone_number = request.data.get('phone_number')
        email = request.data.get('email', 'customer@example.com')

        # ==========================================
        # FORMAT PHONE NUMBER
        # ==========================================
        phone_number = str(phone_number).replace("+", "").strip()

        if phone_number.startswith("0"):
            phone_number = "254" + phone_number[1:]

        # ==========================================
        # HEADERS
        # ==========================================
        headers = {
            "Authorization": f"Bearer {INTASEND_SECRET_KEY}",
            "Content-Type": "application/json"
        }

        # ==========================================
        # PAYLOAD
        # ==========================================
        payload = {
            "public_key": INTASEND_PUBLIC_KEY,
            "currency": "KES",
            "amount": float(amount),
            "phone_number": phone_number,
            "email": email,
            "api_ref": f"BagHub-{order_id}",
            "narration": f"Payment for BagHub Order #{order_id}"
        }

        # ==========================================
        # INTASEND REQUEST
        # ==========================================
        response = requests.post(
            "https://payment.intasend.com/api/v1/checkout/stk_push/",
            json=payload,
            headers=headers
        )

        # ==========================================
        # DEBUGGING
        # ==========================================
        print("STATUS CODE:", response.status_code)
        print("RESPONSE:", response.text)

        response_data = response.json()

        # ==========================================
        # SUCCESS
        # ==========================================
        if response.status_code in [200, 201]:

            try:
                order = Order.objects.get(id=order_id)

                order.status = 'pending_payment'
                order.save()

            except Exception as order_error:
                print("ORDER ERROR:", order_error)

            return Response({
                "success": True,
                "message": "STK Push sent successfully.",
                "data": response_data
            }, status=status.HTTP_200_OK)

        # ==========================================
        # FAILED
        # ==========================================
        return Response({
            "success": False,
            "error": response_data
        }, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        print("INTASEND ERROR:", str(e))

        return Response({
            "success": False,
            "error": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
# IntaSend Callback (Webhook)
@api_view(['POST'])
@permission_classes([AllowAny])
def intasend_callback(request):
    try:
        data = request.data
        
        # Verify payment status
        reference = data.get('reference')
        status_code = data.get('status')
        
        if status_code == 'SUCCESS':
            # Find order by reference
            try:
                order = Order.objects.get(mpesa_receipt_number=reference)
                order.status = 'confirmed'
                order.payment_status = 'paid'
                order.save()
                
                Payment.objects.create(
                    order=order,
                    amount=order.total_amount,
                    mpesa_code=reference,
                    status='confirmed'
                )
                
                return Response({'status': 'success'})
            except:
                pass
        
        return Response({'status': 'received'})
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'

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
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        if self.request.user.is_authenticated and self.request.user.is_staff:
            return Product.objects.all().order_by('-created_at')
        return Product.objects.filter(is_available=True).order_by('-created_at')

    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            serializer.save(posted_by=self.request.user, is_available=True)
        else:
            serializer.save(is_available=True)

class CheckoutView(APIView):
    permission_classes = [IsAuthenticated]
    
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
        
        customer = request.user
        
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
            "message": "Order placed successfully.",
            "order_id": order.id,
            "receipt_number": receipt_number
        }, status=status.HTTP_201_CREATED)

User = get_user_model()

class RegisterView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        
        if not username or not password:
            return Response({'error': 'Username and password required'}, status=status.HTTP_400_BAD_REQUEST)
        
        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password
            )
            return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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
    
    user = User.objects.filter(username=username).first()
    
    if user:
        user.set_password(password)
        user.is_staff = True
        user.is_superuser = True
        user.save()
        return Response({'message': f'Password for {username} updated successfully!'})
    else:
        user = User.objects.create_user(
            username=username,
            password=password,
            is_staff=True,
            is_superuser=True
        )
        return Response({'message': f'Admin user {username} created successfully!'})