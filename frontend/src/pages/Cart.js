import React, { useState, useEffect } from 'react';
import { getCart, removeFromCart, updateQuantity,  getCartTotal } from '../utils/cart';

const Cart = ({ onCheckout, onContinueShopping }) => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const loadCart = () => {
      const items = getCart();
      setCart(items);
      setTotal(getCartTotal());
    };
    loadCart();
  }, []);

  const handleQuantityChange = (id, newQty) => {
    updateQuantity(id, newQty);
    setCart(getCart());
    setTotal(getCartTotal());
  };

  const handleRemove = (id) => {
    removeFromCart(id);
    setCart(getCart());
    setTotal(getCartTotal());
  };

  const handleCheckout = () => {
    if (cart.length === 0) return alert('Cart is empty!');
    onCheckout(cart);
  };

  if (cart.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Your cart is empty 🛒</h2>
        <button onClick={onContinueShopping} style={{ padding: '10px 20px', marginTop: '20px', cursor: 'pointer' }}>
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h2>Shopping Cart ({cart.reduce((a, b) => a + b.quantity, 0)} items)</h2>
      
      {cart.map(item => (
        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', borderBottom: '1px solid #eee', marginBottom: '10px' }}>
          <div style={{ flex: 1 }}>
            <h3>{item.name}</h3>
            <p style={{ margin: '5px 0' }}>KES {item.price}</p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)} style={{ padding: '5px 10px' }}>-</button>
            <span>{item.quantity}</span>
            <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)} style={{ padding: '5px 10px' }}>+</button>
          </div>
          
          <div style={{ textAlign: 'right', minWidth: '100px' }}>
            <p>KES {item.price * item.quantity}</p>
            <button onClick={() => handleRemove(item.id)} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px' }}>
              Remove
            </button>
          </div>
        </div>
      ))}
      
      <div style={{ marginTop: '20px', textAlign: 'right', borderTop: '2px solid #333', paddingTop: '15px' }}>
        <h3>Total: KES {total}</h3>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '15px' }}>
          <button onClick={onContinueShopping} style={{ padding: '10px 20px', background: '#6c757d', color: 'white', border: 'none', cursor: 'pointer' }}>
            Continue Shopping
          </button>
          <button onClick={handleCheckout} style={{ padding: '10px 20px', background: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}>
            Proceed to Checkout 💳
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;