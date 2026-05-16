import React, { useState } from 'react';
import api from '../api/axios';

const Payment = ({ order, onComplete }) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handlePayment = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const response = await api.post('/intasend-payment/', {
                phone_number: phoneNumber,
                amount: order.total_amount,
                order_id: order.id,
                email: 'customer@example.com'
            });

            const data = response.data;
            
            if (data && data.success) {
                setSuccessMessage('✅ STK Push sent! Check your phone and enter PIN.');
                setTimeout(() => {
                    if (onComplete) onComplete();
                }, 5000);
            } else {
                setErrorMessage('Payment failed');
            }
        } catch (err) {
            let errorMsg = 'Payment failed. Try again.';
            
            if (err.response && err.response.data) {
                const data = err.response.data;
                
                // Try to extract error message from nested objects
                if (typeof data === 'object') {
                    if (data.error) {
                        if (typeof data.error === 'object') {
                            // Convert nested error object to string
                            errorMsg = JSON.stringify(data.error);
                        } else {
                            errorMsg = String(data.error);
                        }
                    } else if (data.message) {
                        errorMsg = String(data.message);
                    } else if (data.detail) {
                        errorMsg = String(data.detail);
                    } else if (data.non_field_errors) {
                        errorMsg = String(data.non_field_errors[0]);
                    } else {
                        // Stringify the whole object if no specific field
                        errorMsg = JSON.stringify(data);
                    }
                } else {
                    errorMsg = String(data);
                }
            } else if (err.message) {
                errorMsg = err.message;
            }
            
            setErrorMessage(errorMsg);
            console.error('Full error response:', err.response ? err.response.data : err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '500px', margin: '50px auto', padding: '30px', textAlign: 'center' }}>
            <h2>📱 M-Pesa Payment</h2>
            <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
                <p><strong>Order ID:</strong> {order && order.id ? order.id : 'N/A'}</p>
                <p><strong>Amount:</strong> KES {order && order.total_amount ? order.total_amount : '0'}</p>
            </div>

            {errorMessage && errorMessage !== '' && (
                <div style={{ color: 'red', background: '#ffe6e6', padding: '15px', borderRadius: '5px', marginBottom: '15px', wordWrap: 'break-word', textAlign: 'left' }}>
                    <strong>❌ Error:</strong><br/>
                    <code style={{ fontSize: '14px' }}>{errorMessage}</code>
                </div>
            )}
            
            {successMessage && successMessage !== '' && (
                <div style={{ color: 'green', background: '#e6ffe6', padding: '15px', borderRadius: '5px', marginBottom: '15px' }}>
                    {successMessage}
                </div>
            )}

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