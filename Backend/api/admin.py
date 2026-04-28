
from django.contrib import admin
from .models import User, Product, Order, Receipt, Payment

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'price', 'stock_quantity', 'is_available', 'posted_by']
    list_filter = ['is_available', 'created_at']
    search_fields = ['name', 'description']

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'customer', 'product', 'total_amount', 'status', 'created_at']
    list_filter = ['status', 'created_at']

@admin.register(Receipt)
class ReceiptAdmin(admin.ModelAdmin):
    list_display = ['receipt_number', 'order', ]
    search_fields = ['receipt_number']

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['order', 'amount', 'status', 'verified_by_admin']
    list_filter = ['status', 'verified_at']

admin.site.register(User)