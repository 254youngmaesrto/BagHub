import React, { useState } from 'react';
import api from '../../api/axios';

const Checkout = ({ product, onComplete }) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(false);

    const handlePayment = async (e) => {
        e.preventDefault();
        
        // 1. CHECK IF USER IS LOGGED IN
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please login to proceed with payment');
            window.location.href = '/login';
            return;
        }

        setLoading(true);

        try {
            // 2. SEND PAYMENT REQUEST
            // Adjust the URL and data fields to match your backend exactly
            await api.post('/checkout/', {
                phone_number: phoneNumber,
                amount: product.price,
                product_id: product.id
            });

            alert('Payment initiated! Check your phone to enter PIN.');
            if (onComplete) onComplete();
            
        } catch (error) {
            console.error('Payment error:', error);
            
            if (error.response && error.response.status === 403) {
                 alert('Session expired. Please login again.');
                 window.location.href = '/login';
            } else {
                alert('Payment failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="checkout-container">
            <h2>Checkout</h2>
            <div className="product-details">
                <h3>{product.name}</h3>
                <p>Price: KSH {product.price}</p>
            </div>

            <form onSubmit={handlePayment}>
                <div className="form-group">
                    <label>M-Pesa Phone Number:</label>
                    <input 
                        type="text" 
                        placeholder="254712345678"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Processing...' : 'Pay Now'}
                </button>
            </form>
        </div>
    );
};

export default Checkout;