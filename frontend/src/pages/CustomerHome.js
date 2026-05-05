import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const CustomerHome = ({ onCheckout }) => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/products/');
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white py-12 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">🛍️ BagHub Catalog</h1>
          <p className="text-blue-100 text-lg">Premium bags for every occasion. Shop with confidence.</p>
        </div>
      </div>

      {/* Search & Controls */}
      <div className="max-w-5xl mx-auto px-4 -mt-6">
        <div className="bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-gray-200">
          <input 
            type="text" 
            placeholder="🔍 Search for a bag by name..." 
            className="w-full p-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all"
            value={search} 
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 shadow animate-pulse">
                <div className="h-48 bg-gray-200 rounded-xl mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-5 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-10 bg-gray-200 rounded-xl"></div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700">No bags found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map(p => (
              <div 
                key={p.id} 
                className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden group"
              >
                {/* Image Container */}
                <div className="h-56 bg-gray-100 flex items-center justify-center relative overflow-hidden">
                  {p.image_url ? (
                    <img 
                      src={p.image_url} 
                      alt={p.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  ) : (
                    <span className="text-gray-400 text-lg">📦 No Image</span>
                  )}
                  
                  {/* Stock Badge */}
                  <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold shadow ${
                    p.stock_quantity > 5 ? 'bg-green-100 text-green-800' :
                    p.stock_quantity > 0 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {p.stock_quantity > 5 ? 'In Stock' : 
                     p.stock_quantity > 0 ? `Only ${p.stock_quantity} left` : 
                     'Sold Out'}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h2 className="text-xl font-bold text-gray-800 mb-1 truncate">{p.name}</h2>
                  <p className="text-2xl font-extrabold text-blue-600 mb-4">
                    KSH {Number(p.price).toLocaleString()}
                  </p>
                  
                  <button 
                    onClick={() => onCheckout(p)}
                    disabled={!p.is_available}
                    className={`w-full py-3 rounded-xl font-bold transition-all duration-200 shadow-md ${
                      p.is_available 
                        ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg active:scale-95' 
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {p.is_available ? '🛒 Purchase Now' : '🔒 Sold Out'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerHome;