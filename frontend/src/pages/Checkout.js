import React, { useState } from 'react';
import api from '../api/axios';
import Payment from './Payment';

const Checkout = ({ product, onComplete, onGoToLogin, onGoToRegister }) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(false);

    const handlePayment = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const response = await api.post('/stk-push/', {
                phone_number: phoneNumber,
                amount: product.price,
                order_id: 1
            });
            
            alert('STK Push sent! Check your phone.');
        } catch (error) {
            alert('Payment failed: ' + (error.response?.data?.error || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="checkout-container" style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
            <h2>Checkout</h2>
            
            {/* Product Details */}
            <div style={{ background: '#eee', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                <h3>{product.name}</h3>
                <p>Price: KSH {product.price}</p>
            </div>

            {/* Payment Form */}
            <form onSubmit={handlePayment}>
                <div style={{ marginBottom: '15px' }}>
                    <label>M-Pesa Phone Number:</label>
                    <input 
                        type="text" 
                        placeholder="254712345678" 
                        value={phoneNumber} 
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                        style={{ width: '100%', padding: '10px', marginTop: '5px' }}
                    />
                </div>
                <button 
                    type="submit" 
                    disabled={loading} 
                    style={{ 
                        width: '100%', 
                        padding: '12px', 
                        backgroundColor: loading ? '#ccc' : '#4CAF50',
                        color: 'white',
                        border: 'none',
                        cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {loading ? 'Processing...' : 'Pay Now'}
                </button>
            </form>
        </div>
    );
};

export default Checkout;