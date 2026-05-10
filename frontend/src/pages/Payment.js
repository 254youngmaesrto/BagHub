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

        try {
            const response = await api.post('/intasend-payment/', {
                phone_number: phoneNumber,
                amount: order.total_amount,
                order_id: order.id,
                email: 'customer@example.com'
            });

            if (response.data.success) {
                setSuccess('✅ STK Push sent! Check your phone and enter PIN.');
                setTimeout(() => {
                    onComplete();
                }, 5000);
            } else {
                setError(response.data.error || 'Payment failed');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Payment failed. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '500px', margin: '50px auto', padding: '30px', textAlign: 'center' }}>
            <h2>📱 M-Pesa Payment via IntaSend</h2>
            <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
                <p><strong>Order ID:</strong> {order.id}</p>
                <p><strong>Amount:</strong> KES {order.total_amount}</p>
            </div>

            {error && <p style={{ color: 'red', background: '#ffe6e6', padding: '10px', borderRadius: '5px' }}>{error}</p>}
            {success && <p style={{ color: 'green', background: '#e6ffe6', padding: '10px', borderRadius: '5px' }}>{success}</p>}

            <form onSubmit={handlePayment}>
                <input
                    type="text"
                    placeholder="Enter M-Pesa Phone (2547...)"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    style={{ width: '100%', padding: '15px', marginBottom: '15px', fontSize: '16px', borderRadius: '5px', border: '2px solid #ddd' }}
                />
                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '15px',
                        backgroundColor: loading ? '#ccc' : '#28a745',
                        color: 'white',
                        border: 'none',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        borderRadius: '5px',
                        cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {loading ? 'Processing...' : 'Pay with M-Pesa'}
                </button>
            </form>

            <div style={{ marginTop: '20px', padding: '15px', background: '#fff3cd', borderRadius: '5px' }}>
                <p style={{ margin: 0, fontSize: '14px' }}>
                    💡 After clicking pay, you'll receive an M-Pesa prompt. Enter PIN to complete.
                </p>
            </div>
        </div>
    );
};

export default Payment;