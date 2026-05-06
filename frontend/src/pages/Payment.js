import React, { useState } from 'react';
import api from '../api/axios';

const Payment = ({ order, onComplete }) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handlePayment = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
             await api.post('/stk-push/', {
                phone_number: phoneNumber,
                amount: order.total_amount,
                order_id: order.id
            });

            setSuccess('STK Push sent! Check your phone and enter PIN.');
            
            // Poll for payment status
            setTimeout(() => checkPaymentStatus(order.id), 10000);
            
        } catch (err) {
            setError(err.response?.data?.error || 'Payment failed. Try again.');
        } finally {
            setLoading(false);
        }
    };

    const checkPaymentStatus = async (orderId) => {
        try {
            const response = await api.get(`/orders/${orderId}/`);
            if (response.data.status === 'confirmed') {
                setSuccess('Payment confirmed! Thank you.');
                setTimeout(() => onComplete(), 2000);
            }
        } catch (error) {
            console.error('Error checking status:', error);
        }
    };

    return (
        <div style={{ maxWidth: '500px', margin: '50px auto', padding: '30px', textAlign: 'center' }}>
            <h2>📱 M-Pesa Payment</h2>
            <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
                <p><strong>Order ID:</strong> {order.id}</p>
                <p><strong>Amount:</strong> KES {order.total_amount}</p>
            </div>

            {error && <p style={{ color: 'red', background: '#ffe6e6', padding: '10px' }}>{error}</p>}
            {success && <p style={{ color: 'green', background: '#e6ffe6', padding: '10px' }}>{success}</p>}

            <form onSubmit={handlePayment}>
                <input
                    type="text"
                    placeholder="Enter M-Pesa Phone (2547...)"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    style={{ width: '100%', padding: '15px', marginBottom: '15px', fontSize: '16px' }}
                />
                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '15px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {loading ? 'Sending...' : 'Pay with M-Pesa'}
                </button>
            </form>

            <div style={{ marginTop: '20px', padding: '15px', background: '#fff3cd', borderRadius: '5px' }}>
                <p style={{ margin: 0, fontSize: '14px' }}>
                    💡 <strong>How it works:</strong> After clicking pay, you'll receive an M-Pesa prompt on your phone. Enter your PIN to complete payment.
                </p>
            </div>
        </div>
    );
};

export default Payment;