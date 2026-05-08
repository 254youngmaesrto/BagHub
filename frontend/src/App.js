import React, { useState, useEffect } from 'react';
import Cart from './pages/Cart';
import { getCartCount, clearCart } from './utils/cart';

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
  const [cartItems, setCartItems] = useState([]);

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

    // Save admin status
    localStorage.setItem('isAdmin', userIsAdmin);

    // Redirect based on role
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
    setCartItems([]);
    setCurrentView('customer');

    clearCart();
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

          {/* CART BUTTON */}
          <button
            onClick={() => setCurrentView('cart')}
            className="bg-yellow-500 text-white px-4 py-2 rounded font-bold hover:bg-yellow-600 transition flex items-center gap-2"
          >
            🛒 Cart ({getCartCount()})
          </button>

          {/* LOGIN */}
          {!isAuthenticated && (
            <button
              onClick={() => setCurrentView('login')}
              className="bg-green-500 text-white px-4 py-2 rounded font-bold hover:bg-green-600 transition"
            >
              Login
            </button>
          )}

          {/* ADMIN */}
          {isAuthenticated && isAdmin && (
            <button
              onClick={() => setCurrentView('admin')}
              className="bg-yellow-500 text-white px-4 py-2 rounded font-bold hover:bg-yellow-600 transition"
            >
              Admin
            </button>
          )}

          {/* LOGOUT */}
          {isAuthenticated && (
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

        {/* ADMIN DASHBOARD */}
        {currentView === 'admin' && isAuthenticated && isAdmin && (
          <AdminDashboard />
        )}

        {/* CUSTOMER HOME */}
        {currentView === 'customer' && !selectedProduct && (
          <CustomerHome
            isAuthenticated={isAuthenticated}
            onCheckout={(product) => {
              if (!isAuthenticated) {
                setCurrentView('login');
                return;
              }

              setSelectedProduct(product);
              setCurrentView('checkout');
            }}
          />
        )}

        {/* CHECKOUT */}
        {currentView === 'checkout' && selectedProduct && isAuthenticated && (
          <Checkout
            cart={cartItems}
            product={selectedProduct}
            onComplete={() => {
              clearCart();
              setSelectedProduct(null);
              setCartItems([]);
              setCurrentView('customer');
            }}
            onGoToLogin={goToLogin}
            onGoToRegister={goToRegister}
          />
        )}

        {/* CART */}
        {currentView === 'cart' && (
          <Cart
            onCheckout={(items) => {
              if (!isAuthenticated) {
                setCurrentView('login');
                return;
              }

              if (items && items.length > 0) {
                setCartItems(items);
                setSelectedProduct(items[0]); // first item for checkout compatibility
                setCurrentView('checkout');

                setCartView(false);
              }
            }}
            onContinueShopping={() => setCurrentView('customer')}
          />
        )}

      </main>
    </div>
  );
}

export default App;