import React, { useState } from 'react';
import api from '../api/axios';

const Checkout = ({ product, onComplete }) => {
  const [processing, setProcessing] = useState(false);
  const [paid, setPaid] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  const handlePayment = async () => {
    setProcessing(true);
    try {
      const response = await api.post('checkout/', {
        product_id: product.id
      });
      
      setPaid(true);
      setReceiptData(response.data);
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  if (paid && receiptData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-3xl font-bold text-green-600 mb-4">Payment Successful!</h2>
          
          <div className="bg-gray-50 p-6 rounded-xl mb-6 text-left">
            <p className="text-gray-600 mb-2"><strong>Receipt:</strong> {receiptData.receipt_number}</p>
            <p className="text-gray-600 mb-2"><strong>Product:</strong> {product.name}</p>
            <p className="text-gray-600 mb-2"><strong>Amount Paid:</strong> KSH {Number(product.price).toLocaleString()}</p>
            <p className="text-gray-600"><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
          </div>

          <button 
            onClick={onComplete}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
        <h2 className="text-3xl font-bold text-center mb-6">Checkout</h2>
        
        <div className="bg-gray-50 p-6 rounded-xl mb-6">
          <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
          <p className="text-3xl font-bold text-blue-600">
            KSH {Number(product.price).toLocaleString()}
          </p>
        </div>

        <button
          onClick={handlePayment}
          disabled={processing}
          className="w-full bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {processing ? '⏳ Processing...' : '💳 Pay with M-Pesa'}
        </button>

        <p className="text-center text-gray-500 text-sm mt-4">
          Secure payment simulation. In production, this will trigger M-Pesa STK Push.
        </p>
      </div>
    </div>
  );
};

export default Checkout;