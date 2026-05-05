import React, { useState, useEffect } from 'react';

// Import components
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
  const [isAdmin, setIsAdmin] = useState(false);

  // --- CHECK LOGIN ON STARTUP ---
  useEffect(() => {
    const token = localStorage.getItem('token');
    const admin = localStorage.getItem('isAdmin');

    if (token) {
      setIsAuthenticated(true);
      setIsAdmin(admin === 'true');
    }
  }, []);

  // --- LOGIN HANDLER ---
  const handleLogin = (userIsAdmin) => {
    setIsAuthenticated(true);
    setIsAdmin(userIsAdmin || false);

    // store in localStorage
    localStorage.setItem('token', 'dummy-token'); // replace with real token later
    localStorage.setItem('isAdmin', userIsAdmin);

    // redirect based on role
    if (userIsAdmin) {
      setCurrentView('admin');
    } else {
      setCurrentView('customer');
    }
  };

  // --- LOGOUT HANDLER ---
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');

    setIsAuthenticated(false);
    setIsAdmin(false);
    setSelectedProduct(null);
    setCurrentView('customer');
  };

  // --- NAVIGATION HELPERS ---
  const goToLogin = () => setCurrentView('login');
  const goToRegister = () => setCurrentView('register');

  // --- BLOCK UNAUTHORIZED ADMIN ACCESS ---
  if (currentView === 'admin' && (!isAuthenticated || !isAdmin)) {
    return (
      <div className="p-10 text-center text-red-600 font-bold text-xl">
        🚫 Access Denied. Admins only.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* --- NAVBAR --- */}
      <nav className="bg-blue-700 text-white p-4 shadow-lg flex justify-between items-center">
        <div
          className="text-2xl font-bold cursor-pointer"
          onClick={() => setCurrentView('customer')}
        >
          🛍️ BagHub
        </div>

        <div className="flex gap-4 items-center">

          {/* Guest */}
          {!isAuthenticated && (
            <button
              onClick={goToLogin}
              className="bg-green-500 px-4 py-2 rounded font-bold hover:bg-green-600"
            >
              Login
            </button>
          )}

          {/* Admin */}
          {isAuthenticated && isAdmin && (
            <button
              onClick={() => setCurrentView('admin')}
              className="bg-yellow-500 px-4 py-2 rounded font-bold hover:bg-yellow-600"
            >
              Admin Dashboard
            </button>
          )}

          {/* Logged in */}
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded font-bold hover:bg-red-600"
            >
              Logout
            </button>
          )}
        </div>
      </nav>

      {/* --- MAIN CONTENT --- */}
      <main className="p-4">

        {/* LOGIN */}
        {currentView === 'login' && (
          <Login
            onLogin={handleLogin}
            onSwitchToRegister={goToRegister}
          />
        )}

        {/* REGISTER */}
        {currentView === 'register' && (
          <Register
            onRegisterSuccess={goToLogin}
            onSwitchToLogin={goToLogin}
          />
        )}

        {/* ADMIN */}
        {currentView === 'admin' && isAuthenticated && isAdmin && (
          <AdminDashboard />
        )}

        {/* CUSTOMER HOME (GUEST + USERS) */}
        {currentView === 'customer' && !selectedProduct && (
          <CustomerHome
            onCheckout={(product) => {
              // 🔒 REQUIRE LOGIN BEFORE CHECKOUT
              if (!isAuthenticated) {
                setCurrentView('login');
                return;
              }

              setSelectedProduct(product);
              setCurrentView('checkout');
            }}
          />
        )}

        {/* CHECKOUT (ONLY AUTH USERS) */}
        {currentView === 'checkout' && selectedProduct && isAuthenticated && (
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