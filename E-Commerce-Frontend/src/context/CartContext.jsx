import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('');

  const addToCart = (product) => {
    setCartItems(prev => {
      const existingItem = prev.find(i => i.product === product._id);
      if (existingItem) {
        return prev.map(i =>
          i.product === product._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { 
        product: product._id,
        quantity: 1,
        price: product.price,
        name: product.name,
        image: product.image
      }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.product !== productId));
  };

  const updateQuantity = (productId, change) => {
    setCartItems(prev =>
      prev.map(item =>
        item.product === productId
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setShippingAddress({
      address: '',
      city: '',
      postalCode: '',
      country: ''
    });
    setPaymentMethod('');
  };

  const value = {
    cartItems,
    shippingAddress,
    setShippingAddress,
    paymentMethod,
    setPaymentMethod,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount: cartItems.length,
    total: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};