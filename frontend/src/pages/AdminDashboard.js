import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    stock_quantity: '',
    image: null,  // Changed from image_url to image (file)
    image_preview: ''  // For preview
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      const response = await api.get('products/');
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    if (e.target.name === 'image') {
      const file = e.target.files[0];
      setFormData({
        ...formData,
        image: file,
        image_preview: file ? URL.createObjectURL(file) : ''
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      
      // Use FormData for file upload
      const data = new FormData();
      data.append('name', formData.name);
      data.append('price', formData.price);
      data.append('description', formData.description);
      data.append('stock_quantity', formData.stock_quantity);
      if (formData.image) {
        data.append('image', formData.image);
      }

      await api.post('products/', data, {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setMessage('✅ Product posted successfully!');
      setFormData({
        name: '',
        price: '',
        description: '',
        stock_quantity: '',
        image: null,
        image_preview: ''
      });
      fetchProducts();
    } catch (error) {
      console.error("Error posting product:", error);
      setMessage('❌ Error posting product. Check console.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-8">Admin Dashboard</h1>

      {/* Post Product Form */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Post New Product</h2>
        
        {message && (
          <div className={`p-4 rounded-xl mb-4 ${message.includes('success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1 font-semibold">Product Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
              placeholder="Enter product name"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-1 font-semibold">Price (KSH)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                placeholder="e.g., 3500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1 font-semibold">Stock Quantity</label>
              <input
                type="number"
                name="stock_quantity"
                value={formData.stock_quantity}
                onChange={handleChange}
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                placeholder="e.g., 10"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-semibold">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
              placeholder="Product description"
              rows="3"
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-gray-700 mb-1 font-semibold">Product Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
            />
            {formData.image_preview && (
              <div className="mt-3">
                <img 
                  src={formData.image_preview} 
                  alt="Preview" 
                  className="w-32 h-32 object-cover rounded-xl border-2 border-gray-200"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {loading ? '⏳ Posting...' : '📦 Post Product'}
          </button>
        </form>
      </div>

      {/* Current Inventory */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Current Inventory</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Image</th>
                <th className="p-3 text-left">Product</th>
                <th className="p-3 text-left">Price</th>
                <th className="p-3 text-left">Stock</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    {p.image ? (
                      <img 
                        src={p.image} 
                        alt={p.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                    ) : (
                      <span className="text-gray-400">📦</span>
                    )}
                  </td>
                  <td className="p-3 font-semibold">{p.name}</td>
                  <td className="p-3 font-semibold text-blue-600">
                    KSH {Number(p.price).toLocaleString()}
                  </td>
                  <td className="p-3">{p.stock_quantity}</td>
                  <td className="p-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      p.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {p.is_available ? 'Available' : 'Sold Out'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;