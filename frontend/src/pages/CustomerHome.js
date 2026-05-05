import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const CustomerHome = ({ onCheckout }) => {
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
        <div className="customer-home" style={{ padding: '20px' }}>
            {/* Header */}
            <div style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                padding: '40px', 
                borderRadius: '10px', 
                marginBottom: '30px',
                textAlign: 'center',
                color: 'white'
            }}>
                <h1>BagHub Catalog</h1>
                <p>Premium bags for every occasion. Shop with confidence.</p>
            </div>

            {/* Search Bar */}
            <div style={{ 
                maxWidth: '800px', 
                margin: '0 auto 30px',
                padding: '15px',
                border: '1px solid #ddd',
                borderRadius: '5px'
            }}>
                <input
                    type="text"
                    placeholder="Search for a bag by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '10px',
                        fontSize: '16px',
                        border: 'none',
                        outline: 'none'
                    }}
                />
            </div>

            {/* Products Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '20px',
                maxWidth: '1200px',
                margin: '0 auto'
            }}>
                {filteredProducts.length === 0 ? (
                    <div style={{ 
                        gridColumn: '1 / -1', 
                        textAlign: 'center', 
                        padding: '40px',
                        color: '#999'
                    }}>
                        <h2>No bags found</h2>
                        <p>Try adjusting your search term</p>
                    </div>
                ) : (
                    filteredProducts.map(product => (
                        <div key={product.id} style={{
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            padding: '20px',
                            backgroundColor: 'white',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}>
                            {product.image ? (
                                <img 
                                    src={product.image} 
                                    alt={product.name}
                                    style={{
                                        width: '100%',
                                        height: '200px',
                                        objectFit: 'cover',
                                        borderRadius: '5px',
                                        marginBottom: '15px'
                                    }}
                                />
                            ) : (
                                <div style={{
                                    width: '100%',
                                    height: '200px',
                                    backgroundColor: '#f5f5f5',
                                    borderRadius: '5px',
                                    marginBottom: '15px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#999'
                                }}>
                                    No Image
                                </div>
                            )}
                            
                            <h3 style={{ margin: '0 0 10px 0' }}>{product.name}</h3>
                            <p style={{ color: '#666', margin: '5px 0' }}>{product.description}</p>
                            <p style={{ 
                                fontSize: '24px', 
                                fontWeight: 'bold', 
                                color: '#667eea',
                                margin: '10px 0'
                            }}>
                                KSH {product.price}
                            </p>
                            <p style={{ 
                                color: product.stock_quantity > 0 ? 'green' : 'red',
                                fontSize: '14px',
                                margin: '10px 0'
                            }}>
                                {product.stock_quantity > 0 
                                    ? `${product.stock_quantity} left in stock`
                                    : 'Out of stock'
                                }
                            </p>
                            
                            <button
                                onClick={() => onCheckout(product)}
                                disabled={!product.is_available || product.stock_quantity === 0}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    backgroundColor: product.is_available && product.stock_quantity > 0 
                                        ? '#28a745' 
                                        : '#ccc',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    cursor: product.is_available && product.stock_quantity > 0 
                                        ? 'pointer' 
                                        : 'not-allowed',
                                    marginTop: '10px'
                                }}
                            >
                                {product.is_available && product.stock_quantity > 0 
                                    ? 'Pay Now' 
                                    : 'Out of Stock'
                                }
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CustomerHome;