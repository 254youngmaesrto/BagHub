// Get cart from localStorage
export const getCart = () => JSON.parse(localStorage.getItem('cart') || '[]');

// Save cart to localStorage
export const saveCart = (cart) => localStorage.setItem('cart', JSON.stringify(cart));

// Add product to cart
export const addToCart = (product) => {
  let cart = getCart();
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  saveCart(cart);
};

// Remove product from cart
export const removeFromCart = (id) => {
  saveCart(getCart().filter(item => item.id !== id));
};

// Update quantity
export const updateQuantity = (id, qty) => {
  let cart = getCart();
  const item = cart.find(i => i.id === id);
  if (item) {
    item.quantity = Math.max(1, qty);
    saveCart(cart);
  }
};

// Clear cart
export const clearCart = () => localStorage.removeItem('cart');

// Get total price
export const getCartTotal = () => 
  getCart().reduce((sum, item) => sum + (item.price * item.quantity), 0);

// Get total items count
export const getCartCount = () => 
  getCart().reduce((sum, item) => sum + item.quantity, 0);