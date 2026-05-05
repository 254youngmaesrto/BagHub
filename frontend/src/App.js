import React, { useState, useEffect } from 'react';

// Import our components
import CustomerHome from './pages/CustomerHome';
import Checkout from './pages/Checkout';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  // --- STATE ---
  const [currentView, setCurrentView] = useState('customer');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [_isAdmin, setIsAdmin] = useState(false); // State to track if user is admin

  // --- 1. CHECK LOGIN ON STARTUP ---
  useEffect(() => {
    const token = localStorage.getItem('token');
    // Note: We aren't checking is_admin here because we don't have it stored in localStorage.
    // We rely on the login function to set it.
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // --- 2. LOGIN HANDLER ---
  // This function receives 'userIsAdmin' (true/false) from Login.js
  const handleLogin = (userIsAdmin) => {
    setIsAuthenticated(true);
    setIsAdmin(userIsAdmin); // Set the admin state
    setCurrentView('customer');
  };

  // --- 3. LOGOUT HANDLER ---
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setIsAdmin(false); // Reset admin status
    setCurrentView('customer');
  };

  // --- 4. NAVIGATION LOGIC ---
  const switchToAdmin = () => {
    if (isAdmin) {
      setCurrentView('admin');
    } else {
      alert('Access Denied: You do not have admin privileges.');
    }
  };

  // --- 5. NAVIGATION HELPERS ---
  const goToLogin = () => setCurrentView('login');
  const goToRegister = () => setCurrentView('register');

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
        
        {/* LOGIN VIEW */}
        {currentView === 'login' && (
          <Login 
            onLogin={handleLogin} 
            onSwitchToRegister={goToRegister} 
          />
        )}

        {/* REGISTER VIEW */}
        {currentView === 'register' && (
          <Register 
            onRegisterSuccess={goToLogin}
            onSwitchToLogin={goToLogin} 
          />
        )}

        {/* ADMIN VIEW - ONLY SHOW IF isAdmin IS TRUE */}
        {currentView === 'admin' && isAdmin && (
          <AdminDashboard />
        )}

        {/* CUSTOMER HOME VIEW */}
        {currentView === 'customer' && !selectedProduct && (
          <CustomerHome 
            onCheckout={(product) => { 
              setSelectedProduct(product); 
              setCurrentView('checkout'); 
            }} 
          />
        )}

        {/* CHECKOUT VIEW */}
        {currentView === 'checkout' && selectedProduct && (
          <Checkout 
            product={selectedProduct} 
            onComplete={() => { 
              setSelectedProduct(null); 
              setCurrentView('customer'); 
            }}
            onGoToLogin={goToLogin}
            onGoToRegister={goToRegister}
          />
        )}
        
      </main>
    </div>
  );
}

export default App;