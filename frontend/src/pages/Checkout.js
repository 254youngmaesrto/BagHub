import React, { useState } from 'react';
import api from '../api/axios';
import Payment from './Payment';

// Accept the props from App.js
const Checkout = ({ product, onComplete, onGoToLogin, onGoToRegister }) => {
    const [phoneNumber, _setPhoneNumber] = useState('');
    const [loading, _setLoading] = useState(false);
    const isAuthenticated = !!localStorage.getItem('token');
    
    
    // 1. CHECK IF USER IS LOGGED IN
    const token = localStorage.getItem('token');

    // --- SCENARIO A: USER IS NOT LOGGED IN ---
    if (!token) {
        return (
            <div style={{ textAlign: 'center', padding: '50px', backgroundColor: '#f8f9fa', borderRadius: '10px', margin: '20px' }}>
                <h2 style={{ color: '#dc3545' }}>Access Denied</h2>
                <p>You must be logged in to purchase items.</p>
                <p>Please Login or Sign Up to proceed with your payment.</p>
                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                    {/* Button to Login */}
                    <a 
                        href="/login" 
                        onClick={(e) => { e.preventDefault(); if (onGoToLogin) onGoToLogin(); }} 
                        style={{ backgroundColor: '#007bff', color: 'white', padding: '10px 20px', borderRadius: '5px', textDecoration: 'none', cursor: 'pointer' }}
                    >
                        Go to Login
                    </a>
                    {/* Button to Register */}
                    <a 
                        href="/register" 
                        onClick={(e) => { e.preventDefault(); if (onGoToRegister) onGoToRegister(); }} 
                        style={{ backgroundColor: '#28a745', color: 'white', padding: '10px 20px', borderRadius: '5px', textDecoration: 'none', cursor: 'pointer' }}
                    >
                        Sign Up
                    </a>
                </div>
            </div>
        );
    }

    // --- SCENARIO B: USER IS LOGGED IN (SHOW PAYMENT FORM) ---
    const _handlePayment = async (e) => {
        e.preventDefault();
        _setLoading(true);
        try {
            await api.post('/checkout/', {
                phone_number: phoneNumber,
                amount: product.price,
                product_id: product.id
            });
            alert('Payment initiated!');
            if (onComplete) onComplete();
        } catch (error) {
            alert('Payment failed.');
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

        {/* Payment Component - Only show if authenticated */}
        {isAuthenticated ? (
            <Payment 
                order={{ id: 1, total_amount: product.price }} 
                onComplete={() => {
                    alert('Payment successful!');
                    if (onComplete) onComplete();
                }}
            />
        ) : (
            <div style={{ textAlign: 'center', padding: '30px' }}>
                <p>Please login or create an account to proceed with payment</p>
                <button 
                    onClick={onGoToLogin}
                    style={{ margin: '10px', padding: '10px 20px', cursor: 'pointer' }}
                >
                    Login
                </button>
                <button 
                    onClick={onGoToRegister}
                    style={{ margin: '10px', padding: '10px 20px', cursor: 'pointer' }}
                >
                    Register
                </button>
            </div>
        )}
    </div>
    );
};
export default Checkout;