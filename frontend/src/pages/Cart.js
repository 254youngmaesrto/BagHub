import React, { useState, useEffect } from 'react';
import {
  getCart,
  removeFromCart,
  updateQuantity,
  getCartTotal
} from '../utils/cart';

const Cart = ({ onCheckout, onContinueShopping }) => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  // LOAD CART
  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const items = getCart();

    // Ensure quantity always exists
    const fixedItems = items.map(item => ({
      ...item,
      quantity: item.quantity || 1
    }));

    setCart(fixedItems);
    setTotal(getCartTotal());
  };

  // CHANGE QUANTITY
  const handleQuantityChange = (id, newQty) => {
    if (newQty < 1) return;

    updateQuantity(id, newQty);

    setCart(getCart());
    setTotal(getCartTotal());
  };

  // REMOVE ITEM
  const handleRemove = (id) => {
    removeFromCart(id);

    setCart(getCart());
    setTotal(getCartTotal());
  };

  // CHECKOUT
  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Cart is empty!');
      return;
    }

    // 🔥 VERY IMPORTANT FIX
    if (onCheckout) {
      onCheckout(cart);
    }
  };

  // EMPTY CART UI
  if (cart.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '80px 20px'
        }}
      >
        <h2 style={{ fontSize: '32px', marginBottom: '15px' }}>
          🛒 Your cart is empty
        </h2>

        <p style={{ color: '#666', marginBottom: '25px' }}>
          Add some amazing bags to continue shopping.
        </p>

        <button
          onClick={onContinueShopping}
          style={{
            padding: '12px 25px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '20px'
      }}
    >

      {/* HEADER */}
      <div
        style={{
          marginBottom: '30px'
        }}
      >
        <h2
          style={{
            fontSize: '34px',
            marginBottom: '10px'
          }}
        >
          🛍️ Shopping Cart
        </h2>

        <p style={{ color: '#666' }}>
          {cart.reduce((a, b) => a + b.quantity, 0)} item(s) in your cart
        </p>
      </div>

      {/* CART ITEMS */}
      <div
        style={{
          background: 'white',
          borderRadius: '15px',
          padding: '20px',
          boxShadow: '0 3px 10px rgba(0,0,0,0.08)'
        }}
      >

        {cart.map(item => (
          <div
            key={item.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '20px 0',
              borderBottom: '1px solid #eee',
              gap: '15px',
              flexWrap: 'wrap'
            }}
          >

            {/* ITEM DETAILS */}
            <div style={{ flex: 1 }}>
              <h3
                style={{
                  marginBottom: '5px',
                  fontSize: '20px'
                }}
              >
                {item.name}
              </h3>

              <p
                style={{
                  color: '#007bff',
                  fontWeight: 'bold',
                  fontSize: '18px'
                }}
              >
                KES {item.price}
              </p>
            </div>

            {/* QUANTITY */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              <button
                onClick={() =>
                  handleQuantityChange(item.id, item.quantity - 1)
                }
                style={{
                  padding: '8px 12px',
                  border: 'none',
                  background: '#ddd',
                  cursor: 'pointer',
                  borderRadius: '5px'
                }}
              >
                -
              </button>

              <span
                style={{
                  fontWeight: 'bold',
                  minWidth: '20px',
                  textAlign: 'center'
                }}
              >
                {item.quantity}
              </span>

              <button
                onClick={() =>
                  handleQuantityChange(item.id, item.quantity + 1)
                }
                style={{
                  padding: '8px 12px',
                  border: 'none',
                  background: '#ddd',
                  cursor: 'pointer',
                  borderRadius: '5px'
                }}
              >
                +
              </button>
            </div>

            {/* PRICE + REMOVE */}
            <div
              style={{
                textAlign: 'right',
                minWidth: '120px'
              }}
            >
              <p
                style={{
                  fontWeight: 'bold',
                  fontSize: '18px'
                }}
              >
                KES {item.price * item.quantity}
              </p>

              <button
                onClick={() => handleRemove(item.id)}
                style={{
                  color: '#dc3545',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '13px',
                  marginTop: '5px'
                }}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* TOTAL + ACTIONS */}
      <div
        style={{
          marginTop: '30px',
          background: 'white',
          padding: '25px',
          borderRadius: '15px',
          boxShadow: '0 3px 10px rgba(0,0,0,0.08)'
        }}
      >

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '20px',
            flexWrap: 'wrap',
            gap: '10px'
          }}
        >
          <h3 style={{ fontSize: '28px' }}>
            Total:
          </h3>

          <h3
            style={{
              fontSize: '30px',
              color: '#28a745'
            }}
          >
            KES {total}
          </h3>
        </div>

        {/* BUTTONS */}
        <div
          style={{
            display: 'flex',
            gap: '15px',
            justifyContent: 'flex-end',
            flexWrap: 'wrap'
          }}
        >

          <button
            onClick={onContinueShopping}
            style={{
              padding: '12px 25px',
              background: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Continue Shopping
          </button>

          <button
            onClick={handleCheckout}
            style={{
              padding: '12px 25px',
              background: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '16px'
            }}
          >
            Proceed to Payment 💳
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;