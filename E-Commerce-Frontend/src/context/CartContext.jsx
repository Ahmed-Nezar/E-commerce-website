// CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { ENV } from '../App.jsx';
import { toast } from "react-toastify"; // your backend URL

const CartContext = createContext();

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be inside CartProvider');
  return ctx;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems]         = useState([]);
  const [shippingAddress, setShippingAddress]     = useState({});
  const [paymentMethod, setPaymentMethod]  = useState('');
  const [user, setUser]                   = useState(null);
  const [loading, setLoading]             = useState(true);

  // set axios auth header and load cart
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    // decode & set user
    const payload = jwtDecode(token);
    setUser(payload);

    // attach header
    axios.defaults.baseURL = `${ENV.VITE_BACKEND_URL}/api/orders`;
    axios.defaults.headers.common.Authorization = `${token}`;

    // fetch cart from API
    axios.get('/cart')
        .then(({ data }) => {
          const cart = data;
          setCartItems(cart.orderItems.map(i => ({
            product: i.product._id,
            quantity: i.quantity,
            price: i.price,
            name: i.product.name,
            image: i.product.image
          })));
          setShippingAddress(cart.shippingAddress || {});
          setPaymentMethod(cart.paymentMethod || '');
        })
        .catch(err => console.error('Error loading cart:', err))
        .finally(() => setLoading(false));
  }, []);

  // Helper to guard all mutations
  const ensureAuth = () => {
    if (!user) {
      toast.error("Please log in to modify your cart");
      return false;
    }
    return true;
  };

  // helper to reload cart after any mutation
  const refreshCart = () => {
    if (!ensureAuth()) return Promise.resolve();
    return axios.get('/cart')
        .then(({ data }) => {
          const cart = data;
          setCartItems(cart.orderItems.map(i => ({
            product: i.product._id,
            quantity: i.quantity,
            price: i.price,
            name: i.product.name,
            image: i.product.image
          })));
          setShippingAddress(cart.shippingAddress || {});
          setPaymentMethod(cart.paymentMethod || '');
        })
        .catch(console.error);
  };

  const addToCart = (productId, quantity = 1) => {
    if (!ensureAuth()) return Promise.resolve();
    return axios.post('/cart', { productId, quantity })
        .then(() => {
          refreshCart();
          toast.success("Product added to cart");
        });
  };

  const updateQuantity = (productId, quantity) => {
    if (!ensureAuth()) return Promise.resolve();
    return axios.put(`/cart/${productId}`, { quantity })
        .then(() => refreshCart());
  };

  const removeFromCart = (productId) => {
    if (!ensureAuth()) return Promise.resolve();
    return axios.delete(`/cart/${productId}`)
        .then(() => refreshCart());
  };

  const clearCart = () => {
    if (!ensureAuth()) return Promise.resolve();
    // backend has no clearCart endpoint—simulate by removing each
    return Promise.all(cartItems.map(i => removeFromCart(i.product)));
  };

  const total = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const cartCount = cartItems.length;

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    total: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    cartCount: cartItems.length,
    user, setUser,
    shippingAddress,
    setShippingAddress,
    paymentMethod,
    setPaymentMethod
  };

  return (
      <CartContext.Provider value={value}>
        {children}
      </CartContext.Provider>
  );
};
