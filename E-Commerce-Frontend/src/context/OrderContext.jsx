// src/context/OrderContext.jsx
import React, { createContext, useContext, useState } from 'react';

// Ensure you’re pointing at your real backend, not Vite’s dev server HTML
const API_ROOT = import.meta.env.VITE_BACKEND_URL; // e.g. "http://localhost:5000"

const OrderContext = createContext();

export const useOrderContext = () => {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrderContext must be inside OrderProvider');
  return ctx;
};

export const OrderProvider = ({ children }) => {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const fetchUserOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1) First fetch the raw Response
      const response = await fetch(`${API_ROOT}/api/orders/user`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${localStorage.getItem('token')}`,
        },
      });

      // 2) Then parse JSON into `res`
      const res = await response.json();

      // 3) Throw on non-2xx so we don’t try to use HTML or invalid data
      if (res.error) {
        throw new Error(res.error || `Status ${response.status}`);
      }

      // 4) Unwrap your payload
      const payload = res.data ?? res;
      setOrders(payload);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <OrderContext.Provider value={{ orders, loading, error, fetchUserOrders }}>
      {children}
    </OrderContext.Provider>
  );
};
