// CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { toast } from "react-toastify";

const API_ROOT = import.meta.env.VITE_BACKEND_URL; // e.g. "https://api.myshop.com"
const CART_API  = `${API_ROOT}/api/orders/cart`;

const CartContext = createContext();

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be inside CartProvider');
  return ctx;
};

let messagesList = [];

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [shippingAddress, setShippingAddress] = useState({});
  const [paymentMethod, setPaymentMethod] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shippingFees, setShippingFees] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const [total, setTotal] = useState(0);

  // load user from token
  useEffect(() => {
    const t = localStorage.getItem('token');
    if (!t) return void setLoading(false);
    try {
      const p = jwtDecode(t);
      setUser(p);
    } catch {
      showMessage("Invalid session, please re-login", "error");
    }
    setLoading(false);
  }, []);

  // whenever user changes, fetch or clear cart
  useEffect(() => {
    if (!user) {
      setCartItems([]);
      setShippingAddress({});
      setPaymentMethod('');
    } else {
      refreshCart();
    }
  }, [user]);

  const showMessage = (msg, error) => {
    if (msg && (error === true || error === false)) {
      if (!messagesList.includes(msg)) {
        messagesList.push(msg);
        toast[error ? "error" : "success"](msg, {
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          style: {
            userSelect: "none",
            gap: "10px",
            padding: "20px",
          },
          onClose: () => {
            messagesList = messagesList.filter((e) => e !== msg);
          },
        });
      }
    } else if (msg && error === null) {
      if (!messagesList.includes(msg)) {
        messagesList.push(msg);
        toast.info(msg, {
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          style: {
            userSelect: "none",
            gap: "10px",
            padding: "20px",
          },
          onClose: () => {
            messagesList = messagesList.filter((e) => e !== msg);
          },
        });
      }
    }
  };

  // Helper to guard all mutations
  const ensureAuth = () => {
    if (!user) {
      showMessage("Please log in to modify your cart", true);
      return false;
    }
    return true;
  };

  // common fetch headers
  const authHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      "Content-Type": "application/json",
      "Authorization": `${token}`
    };
  };

  // helper to reload cart after any mutation
  const refreshCart = async () => {
    if (!ensureAuth()) return;
    try {
      const res = await fetch(CART_API, {
        method: "GET",
        headers: authHeaders()
      });
      // backend sends res.json(cart)
      const data = await res.json();
      if (data.error) throw new Error(`Status ${data.error}`);
      setCartItems((data.orderItems||[]).map(i => ({
        product:  i.product._id,
        quantity: i.quantity,
        price:    i.price,
        name:     i.product.name,
        image:    i.product.image
      })));
      setShippingAddress(data.shippingAddress || {});
      setPaymentMethod(data.paymentMethod || '');
      !total && setTotal(data.orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0))
      setSubTotal(data.orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0))
    } catch (err) {
      showMessage("Could not load your cart", true);
      console.error("refreshCart error:", err);
    }
  };

  // Cart operations
  const addToCart = async (productId, quantity=1) => {
    if (!ensureAuth()) return;
    try {
      const res = await fetch(CART_API, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ productId, quantity })
      }).then(res => res.json());
      if (res.error) throw new Error(`Status ${res.error}`);
      showMessage("Product added to cart", false);
      await refreshCart();
    } catch (err) {
      showMessage("Failed to add to cart", true);
      console.error("addToCart error:", err);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (!ensureAuth()) return;
    try {
      const res = await fetch(`${CART_API}/${productId}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ quantity })
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      await refreshCart();
    } catch (err) {
      showMessage("Failed to update quantity", true);
      console.error("updateQuantity error:", err);
    }
  };

  const removeFromCart = async (productId) => {
    if (!ensureAuth()) return;
    try {
      const res = await fetch(`${CART_API}/${productId}`, {
        method: "DELETE",
        headers: authHeaders()
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      await refreshCart();
    } catch (err) {
      showMessage("Failed to remove item", true);
      console.error("removeFromCart error:", err);
    }
  };

  const clearCart = () => {
    if (!ensureAuth()) return Promise.resolve();
    // backend has no clearCart endpoint—simulate by removing each
    return Promise.all(cartItems.map(i => removeFromCart(i.product)));
  };


  const cartCount = cartItems.length;

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    refreshCart,
    total,
    setTotal,
    subTotal,
    setSubTotal,
    cartCount: cartItems.length,
    user, setUser,
    showMessage,
    shippingAddress,
    setShippingAddress,
    shippingFees,
    setShippingFees,
    discount, setDiscount,
    paymentMethod,
    setPaymentMethod
  };

  return (
      <CartContext.Provider value={value}>
        {children}
      </CartContext.Provider>
  );
};
