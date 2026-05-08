import React, { useState, useEffect } from 'react';
import Cart from './pages/Cart';
import { getCartCount } from './utils/cart';

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
  const [cartView, setCartView] = useState(false);
  const [cartItems, setCartItems] = useState([]);

// Helper to refresh cart UI
const refreshCart = () => setCartItems(getCartCount());

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

    // ❌ REMOVED dummy token (this was breaking everything)

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
  <div className="text-2xl font-bold cursor-pointer" onClick={() => { setCurrentView('customer'); setCartView(false); }}>
    🛍️ BagHub
  </div>
  
  <div className="flex gap-4 items-center">
    {/* Cart Icon */}
    <button 
      onClick={() => { setCartView(true); setCurrentView('cart'); }}
      className="bg-yellow-500 text-white px-4 py-2 rounded font-bold hover:bg-yellow-600 transition flex items-center gap-2"
    >
      🛒 Cart ({getCartCount()})
    </button>

    {/* Login/Admin/Logout buttons (keep your existing ones) */}
    {!isAuthenticated && (
      <button onClick={() => setCurrentView('login')} className="bg-green-500 text-white px-4 py-2 rounded font-bold">Login</button>
    )}
    {isAuthenticated && isAdmin && (
      <button onClick={() => setCurrentView('admin')} className="bg-yellow-500 text-white px-4 py-2 rounded font-bold">Admin</button>
    )}
    {isAuthenticated && (
      <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded font-bold">Logout</button>
    )}
  </div>
</nav>
    

      {/* --- MAIN CONTENT --- */}
      <main className="p-4">


        {currentView === 'login' && (
          <Login
            onLogin={handleLogin}
            onSwitchToRegister={goToRegister}
          />
        )}

        {currentView === 'register' && (
          <Register
            onRegisterSuccess={goToLogin}
            onSwitchToLogin={goToLogin}
          />
        )}

        {currentView === 'admin' && isAuthenticated && isAdmin && (
          <AdminDashboard />
        )}

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

        {currentView === 'checkout' && selectedProduct && isAuthenticated && (
          <Checkout
            cart={cartItems}
            product={selectedProduct}
            onComplete={() => {
              clearCart();
              setSelectedProduct(null);
              setCurrentView('customer');
            }}
            onGoToLogin={goToLogin}
            onGoToRegister={goToRegister}
          />
        )}
        {currentView === 'cart' && (
  <Cart 
    onCheckout={(items) => {
      setCartItems(items);
      setCurrentView('checkout');
      setCartView(false);
    }}
    onContinueShopping={() => setCurrentView('customer')}

    
  />
)}

      </main>
    </div>
  );
}

export default App;