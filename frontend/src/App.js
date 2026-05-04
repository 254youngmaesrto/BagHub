import React, { useState, useEffect } from 'react';

// Import our components
import CustomerHome from './pages/CustomerHome';
import Checkout from './pages/Checkout';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Register from './pages/Register'; // <-- Added Register import

function App() {
  // --- STATE ---
  const [currentView, setCurrentView] = useState('customer');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // --- 1. CHECK LOGIN ON STARTUP ---
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // --- 2. LOGIN HANDLER ---
  const handleLogin = () => {
    setIsAuthenticated(true);
    setIsAdmin(userIsAdmin || false); // Store admin status
    setCurrentView('customer'); // Go back to shopping after login
  };

  // --- 3. LOGOUT HANDLER ---
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setCurrentView('customer');
  };

  // --- 4. NAVIGATION LOGIC ---
  const switchToAdmin = () => {
    if (isAdmin) { // Only allow if actually an admin
        setCurrentView('admin');
    } else {
        alert('Access Denied: You do not have admin privileges.');
    }
  };

  // --- 5. NEW: Handle "Go to Login" from Checkout ---
  const goToLogin = () => {
    setCurrentView('login');
  };

  // --- 6. NEW: Handle "Go to Register" from Checkout ---
  const goToRegister = () => {
    setCurrentView('register');
  };

  // --- 7. NEW: Handle successful registration ---
  const handleRegisterSuccess = () => {
    setCurrentView('login'); // After registering, go to login
  };
  const [isAdmin, setIsAdmin] = useState(false);

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
            onSwitchToRegister={goToRegister} // Allow switching to register from login
          />
        )}

        {/* REGISTER VIEW */}
        {currentView === 'register' && (
          <Register 
            onRegisterSuccess={handleRegisterSuccess}
            onSwitchToLogin={goToLogin} // Allow switching to login from register
          />
        )}

        {/* ADMIN VIEW */}
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
            onGoToLogin={goToLogin}      // <-- Pass login handler
            onGoToRegister={goToRegister} // <-- Pass register handler
          />
        )}
        
      </main>
    </div>
  );
}

export default App;