import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { addToCart } from '../utils/cart';

const CustomerHome = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products/');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ backgroundColor: '#f4f7fb', minHeight: '100vh', paddingBottom: '40px' }}>

      {/* HERO SECTION */}
      <div
        style={{
          background: 'linear-gradient(135deg, #007bff, #6610f2)',
          color: 'white',
          padding: '50px 20px',
          textAlign: 'center',
          borderRadius: '0 0 25px 25px',
          marginBottom: '30px',
          boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
        }}
      >
        <h1 style={{ fontSize: '42px', marginBottom: '10px', fontWeight: 'bold' }}>
          🛍️ Welcome to BagHub
        </h1>

        <p style={{ fontSize: '18px', opacity: '0.9' }}>
          Discover stylish, premium and affordable bags for every occasion.
        </p>

        {/* SEARCH BAR */}
        <div style={{ marginTop: '25px' }}>
          <input
            type="text"
            placeholder="🔍 Search for a bag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              maxWidth: '550px',
              padding: '15px',
              fontSize: '16px',
              border: 'none',
              borderRadius: '50px',
              outline: 'none',
              boxShadow: '0 2px 10px rgba(0,0,0,0.15)'
            }}
          />
        </div>
      </div>

      {/* FEATURE HIGHLIGHTS */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          flexWrap: 'wrap',
          marginBottom: '30px',
          padding: '0 20px'
        }}
      >
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '15px',
          width: '220px',
          textAlign: 'center',
          boxShadow: '0 3px 8px rgba(0,0,0,0.08)'
        }}>
          <h3>🚚 Fast Delivery</h3>
          <p style={{ color: '#666', fontSize: '14px' }}>
            Get your bags delivered quickly anywhere.
          </p>
        </div>

        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '15px',
          width: '220px',
          textAlign: 'center',
          boxShadow: '0 3px 8px rgba(0,0,0,0.08)'
        }}>
          <h3>💳 Secure Payments</h3>
          <p style={{ color: '#666', fontSize: '14px' }}>
            Safe and reliable M-Pesa payments.
          </p>
        </div>

        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '15px',
          width: '220px',
          textAlign: 'center',
          boxShadow: '0 3px 8px rgba(0,0,0,0.08)'
        }}>
          <h3>⭐ Premium Quality</h3>
          <p style={{ color: '#666', fontSize: '14px' }}>
            Carefully selected stylish bags.
          </p>
        </div>
      </div>

      {/* PRODUCTS SECTION */}
      <div style={{ padding: '0 20px' }}>
        <h2
          style={{
            textAlign: 'center',
            marginBottom: '30px',
            fontSize: '32px',
            color: '#333'
          }}
        >
          Trending Bags
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '25px'
          }}
        >
          {filteredProducts.map(product => (
            <div
              key={product.id}
              style={{
                borderRadius: '18px',
                overflow: 'hidden',
                backgroundColor: 'white',
                boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.08)';
              }}
            >

              {/* IMAGE */}
              <div
                style={{
                  height: '250px',
                  backgroundColor: '#f5f5f5',
                  overflow: 'hidden',
                  position: 'relative'
                }}
              >
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  <div
                    style={{
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#999'
                    }}
                  >
                    No Image
                  </div>
                )}

                {/* STOCK BADGE */}
                <div
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    backgroundColor:
                      product.stock_quantity > 0 ? '#28a745' : '#dc3545',
                    color: 'white',
                    padding: '6px 10px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}
                >
                  {product.stock_quantity > 0
                    ? `${product.stock_quantity} Left`
                    : 'Out of Stock'}
                </div>
              </div>

              {/* PRODUCT DETAILS */}
              <div style={{ padding: '18px' }}>
                <h3
                  style={{
                    margin: '0 0 10px',
                    fontSize: '20px',
                    color: '#222'
                  }}
                >
                  {product.name}
                </h3>

                <p
                  style={{
                    color: '#666',
                    fontSize: '14px',
                    minHeight: '45px'
                  }}
                >
                  {product.description}
                </p>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '15px'
                  }}
                >
                  <span
                    style={{
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: '#007bff'
                    }}
                  >
                    KES {product.price}
                  </span>

                  <span style={{ color: '#ffc107', fontSize: '18px' }}>
                    ⭐ 4.8
                  </span>
                </div>

                {/* BUTTON */}
                <button
                  onClick={() => {
                    addToCart(product);
                    alert(`✅ ${product.name} added to cart!`);
                  }}
                  disabled={product.stock_quantity === 0}
                  style={{
                    width: '100%',
                    padding: '14px',
                    background:
                      product.stock_quantity > 0
                        ? 'linear-gradient(135deg, #007bff, #0056b3)'
                        : '#ccc',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor:
                      product.stock_quantity > 0
                        ? 'pointer'
                        : 'not-allowed',
                    marginTop: '18px',
                    transition: '0.3s'
                  }}
                >
                  🛒 Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* EMPTY STATE */}
        {filteredProducts.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '70px',
              color: '#666'
            }}
          >
            <h2>😢 No bags found</h2>
            <p>Try adjusting your search term</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerHome;