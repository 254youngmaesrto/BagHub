import React from 'react';

const Checkout = ({ cart, onComplete, onGoToLogin, onGoToRegister }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleProceedToPayment = () => {
    if (isAuthenticated) {
      onComplete();
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', maxWidth: '500px', margin: '0 auto' }}>
        <h2>🔐 Login Required</h2>
        <p style={{ fontSize: '16px', color: '#666', marginBottom: '30px' }}>
          Please login or create an account to proceed with your order
        </p>
        
        <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
          <h3>Order Summary</h3>
          {cart.map(item => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #ddd' }}>
              <span>{item.name} x{item.quantity}</span>
              <span>KES {item.price * item.quantity}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', fontWeight: 'bold', fontSize: '18px' }}>
            <span>Total:</span>
            <span style={{ color: '#28a745' }}>KES {total}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <button 
            onClick={onGoToLogin}
            style={{ 
              padding: '12px 30px', 
              backgroundColor: '#007bff', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            Login
          </button>
          <button 
            onClick={onGoToRegister}
            style={{ 
              padding: '12px 30px', 
              backgroundColor: '#28a745', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            Register
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>📦 Checkout Summary</h2>
      
      <div style={{ background: '#f8f9fa', padding: '25px', borderRadius: '10px', marginBottom: '25px' }}>
        <h3 style={{ marginBottom: '15px' }}>Order Items ({cart.reduce((a, b) => a + b.quantity, 0)} items)</h3>
        {cart.map(item => (
          <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #ddd' }}>
            <div>
              <strong>{item.name}</strong>
              <div style={{ fontSize: '14px', color: '#666' }}>Qty: {item.quantity}</div>
            </div>
            <div style={{ fontWeight: 'bold' }}>
              KES {item.price * item.quantity}
            </div>
          </div>
        ))}
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', paddingTop: '15px', borderTop: '2px solid #333', fontSize: '20px', fontWeight: 'bold' }}>
          <span>Total:</span>
          <span style={{ color: '#28a745' }}>KES {total}</span>
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <button 
          onClick={handleProceedToPayment}
          style={{ 
            padding: '15px 40px', 
            backgroundColor: '#28a745', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: 'pointer',
            width: '100%'
          }}
        >
          Proceed to Payment 💳
        </button>
      </div>
    </div>
  );
};

export default Checkout;