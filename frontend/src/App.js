import React, { useState, useEffect } from 'react';

// Import our components
import CustomerHome from './pages/CustomerHome';
import Checkout from './pages/Checkout';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login'; // <--- Import the new Login page

function App() {
  // --- STATE ---
  const [currentView, setCurrentView] = useState('customer');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // --- 1. CHECK LOGIN ON STARTUP ---
  // useEffect runs once when the app loads
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true); // If token exists, user is already logged in
    }
  }, []);

  // --- 2. LOGIN HANDLER ---
  // Called by Login.js after successful authentication
  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentView('admin');
  };

  // --- 3. LOGOUT HANDLER ---
  const handleLogout = () => {
    localStorage.removeItem('token'); // Delete the token
    setIsAuthenticated(false);        // Set state to false
    setCurrentView('customer');       // Go back to home
  };

  // --- 4. NAVIGATION LOGIC ---
  const switchToAdmin = () => {
    if (isAuthenticated) {
      setCurrentView('admin');
    } else {
      setCurrentView('login'); // Force login screen if not authenticated
    }
  };

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      
      {/* --- NAVIGATION BAR --- */}
      <nav className="bg-blue-700 text-white p-4 shadow-lg flex justify-between items-center">
        <div className="text-2xl font-bold cursor-pointer" onClick={() => setCurrentView('customer')}>
          🛍️ BagHub
        </div>
        
        <div className="flex gap-4 items-center">
          {currentView === 'customer' && (
            <button 
              onClick={switchToAdmin}
              className="bg-white text-blue-700 px-4 py-2 rounded font-bold hover:bg-gray-100 transition"
            >
              Switch to Admin
            </button>
          )}

          {currentView === 'admin' && (
            <button 
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded font-bold hover:bg-red-600 transition"
            >
              Logout
            </button>
          )}
        </div>
      </nav>

      {/* --- MAIN CONTENT --- */}
      <main className="p-4">
        
        {currentView === 'login' && (
          <Login onLogin={handleLogin} />
        )}

        {currentView === 'admin' && isAuthenticated && (
          <AdminDashboard />
        )}

        {currentView === 'customer' && !selectedProduct && (
          <CustomerHome onCheckout={(product) => { setSelectedProduct(product); setCurrentView('checkout'); }} />
        )}

        {currentView === 'checkout' && selectedProduct && (
          <Checkout 
            product={selectedProduct} 
            onComplete={() => { setSelectedProduct(null); setCurrentView('customer'); }} 
          />
        )}
        
      </main>
    </div>
  );
}

export default App;