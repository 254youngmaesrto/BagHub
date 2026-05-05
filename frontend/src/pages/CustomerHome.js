import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const CustomerHome = ({ onCheckout, isAuthenticated }) => {
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
      setProducts([]); // 🔒 prevent stale state
    } finally {
      setLoading(false);
    }
  };

  // 🔥 FIX: Refetch when login state changes
  useEffect(() => {
    fetchProducts();
  }, [isAuthenticated]);

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

      {/* Search */}
      <div className="max-w-5xl mx-auto px-4 -mt-6">
        <div className="bg-white p-4 rounded-2xl shadow-lg border">
          <input 
            type="text" 
            placeholder="🔍 Search for a bag..."
            className="w-full p-4 border rounded-xl"
            value={search} 
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Products */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        {loading ? (
          <p className="text-center text-gray-500">Loading products...</p>
        ) : filteredProducts.length === 0 ? (
          <p className="text-center text-gray-500">No bags found</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredProducts.map(p => (
              <div key={p.id} className="bg-white p-4 rounded-xl shadow">
                <h2 className="font-bold text-lg">{p.name}</h2>
                <p className="text-blue-600 font-bold">
                  KSH {Number(p.price).toLocaleString()}
                </p>

                <button 
                  onClick={() => onCheckout(p)}
                  disabled={!p.is_available}
                  className="mt-3 w-full bg-blue-600 text-white py-2 rounded"
                >
                  {p.is_available ? 'Purchase Now' : 'Sold Out'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerHome;