import React, { useState } from 'react';
import api from '../api/axios';

// 1. ADD THESE PROPS: onGoToLogin, onGoToRegister
const Checkout = ({ product, onComplete, onGoToLogin, onGoToRegister }) => {
    
    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(false);

    // CHECK IF USER IS LOGGED IN
    const token = localStorage.getItem('token');

    // --- SCENARIO A: USER IS NOT LOGGED IN ---
    if (!token) {
        return (
            <div style={{ textAlign: 'center', padding: '50px', backgroundColor: '#f8f9fa', borderRadius: '10px', margin: '20px' }}>
                <h2 style={{ color: '#dc3545' }}>Access Denied</h2>
                <p>You must be logged in to purchase items.</p>
                <p>Please Login or Sign Up to proceed with your payment.</p>
                
                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                    
                    {/* CORRECT "Go to Login" BUTTON */}
                    <a 
                        href="#" 
                        onClick={(e) => { e.preventDefault(); if (onGoToLogin) onGoToLogin(); }} 
                        style={{ 
                            backgroundColor: '#007bff', color: 'white', padding: '10px 20px', 
                            borderRadius: '5px', textDecoration: 'none', cursor: 'pointer'
                        }}
                    >
                        Go to Login
                    </a>

                    {/* CORRECT "Sign Up" BUTTON */}
                    <a 
                        href="#" 
                        onClick={(e) => { e.preventDefault(); if (onGoToRegister) onGoToRegister(); }} 
                        style={{ 
                            backgroundColor: '#28a745', color: 'white', padding: '10px 20px', 
                            borderRadius: '5px', textDecoration: 'none', cursor: 'pointer'
                        }}
                    >
                        Sign Up
                    </a>
                </div>
            </div>
        );
    }

    // --- SCENARIO B: USER IS LOGGED IN (SHOW PAYMENT FORM) ---
    
    const handlePayment = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
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
                 if (onGoToLogin) onGoToLogin();
            } else {
                alert('Payment failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="checkout-container" style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
            <h2>Checkout</h2>
            <div style={{ background: '#eee', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                <h3>{product.name}</h3>
                <p style={{ fontSize: '1.2em', fontWeight: 'bold', color: '#007bff' }}>Price: KSH {product.price}</p>
            </div>

            <form onSubmit={handlePayment}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>M-Pesa Phone Number:</label>
                    <input 
                        type="text" 
                        placeholder="254712345678"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                        style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    style={{ 
                        width: '100%', padding: '12px', backgroundColor: '#28a745', color: 'white', 
                        border: 'none', borderRadius: '5px', fontSize: '16px', cursor: 'pointer' 
                    }}
                >
                    {loading ? 'Processing...' : 'Pay Now'}
                </button>
            </form>
        </div>
    );
};

export default Checkout;