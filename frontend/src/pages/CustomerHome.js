import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const CustomerHome = ({ onCheckout }) => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get('/products/');
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchProducts();
    }, []);

    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '0'
        }}>
            {/* Hero Section */}
            <div style={{
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%)',
                padding: '60px 20px',
                textAlign: 'center',
                color: 'white',
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
            }}>
                <h1 style={{
                    fontSize: '3em',
                    margin: '0 0 15px 0',
                    fontWeight: '700',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                    letterSpacing: '-1px'
                }}>
                    🛍️ BagHub Catalog
                </h1>
                <p style={{
                    fontSize: '1.3em',
                    margin: '0',
                    opacity: '0.95',
                    fontWeight: '300'
                }}>
                    Premium bags for every occasion. Shop with confidence.
                </p>
            </div>

            {/* Search Bar */}
            <div style={{
                maxWidth: '700px',
                margin: '-30px auto 40px',
                padding: '0 20px',
                position: 'relative',
                zIndex: '10'
            }}>
                <div style={{
                    background: 'white',
                    borderRadius: '50px',
                    padding: '8px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    <span style={{
                        padding: '0 20px',
                        fontSize: '20px',
                        color: '#999'
                    }}>
                        🔍
                    </span>
                    <input
                        type="text"
                        placeholder="Search for your perfect bag..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            flex: '1',
                            padding: '15px 20px',
                            fontSize: '16px',
                            border: 'none',
                            outline: 'none',
                            borderRadius: '50px',
                            background: 'transparent'
                        }}
                    />
                </div>
            </div>

            {/* Products Grid */}
            <div style={{
                maxWidth: '1400px',
                margin: '0 auto',
                padding: '0 20px 60px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '30px'
            }}>
                {loading ? (
                    // Loading Skeleton
                    Array(6).fill(0).map((_, index) => (
                        <div key={index} style={{
                            background: 'white',
                            borderRadius: '20px',
                            padding: '25px',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                            animation: 'pulse 2s infinite'
                        }}>
                            <div style={{
                                width: '100%',
                                height: '250px',
                                background: '#e0e0e0',
                                borderRadius: '15px',
                                marginBottom: '20px'
                            }}></div>
                            <div style={{ height: '25px', background: '#e0e0e0', borderRadius: '5px', marginBottom: '10px' }}></div>
                            <div style={{ height: '15px', background: '#e0e0e0', borderRadius: '5px', marginBottom: '15px' }}></div>
                            <div style={{ height: '30px', background: '#e0e0e0', borderRadius: '5px' }}></div>
                        </div>
                    ))
                ) : filteredProducts.length === 0 ? (
                    // Empty State
                    <div style={{
                        gridColumn: '1 / -1',
                        textAlign: 'center',
                        padding: '80px 20px',
                        background: 'white',
                        borderRadius: '20px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                        color: '#666'
                    }}>
                        <div style={{ fontSize: '80px', marginBottom: '20px' }}>🔍</div>
                        <h2 style={{ fontSize: '2em', margin: '0 0 10px', color: '#333' }}>No bags found</h2>
                        <p style={{ fontSize: '1.1em' }}>Try adjusting your search term</p>
                    </div>
                ) : (
                    // Products
                    filteredProducts.map((product, index) => (
                        <div key={product.id} style={{
                            background: 'white',
                            borderRadius: '20px',
                            overflow: 'hidden',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                            transition: 'all 0.3s ease',
                            transform: 'translateY(0)',
                            animation: `fadeInUp 0.5s ease ${index * 0.1}s both`
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-10px)';
                            e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.2)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
                        }}>
                            {/* Product Image */}
                            <div style={{
                                width: '100%',
                                height: '280px',
                                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden',
                                position: 'relative'
                            }}>
                                {product.image ? (
                                    <img 
                                        src={product.image} 
                                        alt={product.name}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            transition: 'transform 0.3s ease'
                                        }}
                                    />
                                ) : (
                                    <div style={{
                                        textAlign: 'center',
                                        color: '#999',
                                        fontSize: '14px'
                                    }}>
                                        <div style={{ fontSize: '60px', marginBottom: '10px' }}>👜</div>
                                        <div>No Image Available</div>
                                    </div>
                                )}
                                
                                {/* Stock Badge */}
                                <div style={{
                                    position: 'absolute',
                                    top: '15px',
                                    right: '15px',
                                    background: product.stock_quantity > 0 ? '#10b981' : '#ef4444',
                                    color: 'white',
                                    padding: '8px 15px',
                                    borderRadius: '25px',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                                }}>
                                    {product.stock_quantity > 0 
                                        ? `✓ In Stock (${product.stock_quantity})`
                                        : '✗ Out of Stock'
                                    }
                                </div>
                            </div>

                            {/* Product Details */}
                            <div style={{ padding: '25px' }}>
                                <h3 style={{
                                    margin: '0 0 10px',
                                    fontSize: '1.5em',
                                    fontWeight: '700',
                                    color: '#1f2937'
                                }}>
                                    {product.name}
                                </h3>
                                
                                <p style={{
                                    margin: '0 0 20px',
                                    color: '#6b7280',
                                    fontSize: '0.95em',
                                    lineHeight: '1.6',
                                    height: '45px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: '-webkit-box',
                                    WebkitLineClamp: '2',
                                    WebkitBoxOrient: 'vertical'
                                }}>
                                    {product.description || 'Premium quality bag perfect for any occasion.'}
                                </p>

                                {/* Price */}
                                <div style={{
                                    fontSize: '2em',
                                    fontWeight: '800',
                                    color: '#667eea',
                                    marginBottom: '20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '5px'
                                }}>
                                    <span>KSH</span>
                                    <span>{product.price.toLocaleString()}</span>
                                </div>

                                {/* Buy Button */}
                                <button
                                    onClick={() => onCheckout(product)}
                                    disabled={!product.is_available || product.stock_quantity === 0}
                                    style={{
                                        width: '100%',
                                        padding: '15px 25px',
                                        background: product.is_available && product.stock_quantity > 0 
                                            ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                                            : '#d1d5db',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '12px',
                                        fontSize: '1.1em',
                                        fontWeight: '700',
                                        cursor: product.is_available && product.stock_quantity > 0 
                                            ? 'pointer' 
                                            : 'not-allowed',
                                        boxShadow: product.is_available && product.stock_quantity > 0 
                                            ? '0 4px 15px rgba(16, 185, 129, 0.4)'
                                            : 'none',
                                        transition: 'all 0.3s ease',
                                        transform: 'scale(1)',
                                    }}
                                    onMouseEnter={(e) => {
                                        if (product.is_available && product.stock_quantity > 0) {
                                            e.target.style.transform = 'scale(1.02)';
                                            e.target.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.5)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.transform = 'scale(1)';
                                        e.target.style.boxShadow = product.is_available && product.stock_quantity > 0 
                                            ? '0 4px 15px rgba(16, 185, 129, 0.4)'
                                            : 'none';
                                    }}
                                >
                                    {product.is_available && product.stock_quantity > 0 
                                        ? '🛒 Pay Now' 
                                        : 'Out of Stock'
                                    }
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* CSS Animations */}
            <style>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes pulse {
                    0%, 100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.5;
                    }
                }
            `}</style>
        </div>
    );
};

export default CustomerHome;