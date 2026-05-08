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
    <div>
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <input
          type="text"
          placeholder="Search for a bag by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ 
            width: '100%', 
            maxWidth: '500px', 
            padding: '12px', 
            fontSize: '16px',
            border: '2px solid #ddd',
            borderRadius: '8px'
          }}
        />
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
        gap: '20px' 
      }}>
        {filteredProducts.map(product => (
          <div key={product.id} style={{ 
            border: '1px solid #ddd', 
            borderRadius: '10px', 
            padding: '15px',
            backgroundColor: 'white',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
          }}>
            <div style={{ height: '200px', backgroundColor: '#f5f5f5', borderRadius: '5px', marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {product.image ? (
                <img src={product.image} alt={product.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover', borderRadius: '5px' }} />
              ) : (
                <span style={{ color: '#999' }}>No Image</span>
              )}
            </div>
            
            <h3 style={{ margin: '10px 0', fontSize: '18px' }}>{product.name}</h3>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>{product.description}</p>
            <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#28a745', margin: '10px 0' }}>
              KES {product.price}
            </p>
            <p style={{ fontSize: '12px', color: product.stock_quantity > 0 ? '#28a745' : '#dc3545' }}>
              {product.stock_quantity > 0 ? `In Stock (${product.stock_quantity})` : 'Out of Stock'}
            </p>
            
            <button
              onClick={() => {
                addToCart(product);
                alert(`✅ ${product.name} added to cart!`);
              }}
              disabled={product.stock_quantity === 0}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: product.stock_quantity > 0 ? '#007bff' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: product.stock_quantity > 0 ? 'pointer' : 'not-allowed',
                marginTop: '10px'
              }}
            >
              🛒 Add to Cart
            </button>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
          <h2>No bags found</h2>
          <p>Try adjusting your search term</p>
        </div>
      )}
    </div>
  );
};

export default CustomerHome;