import { createContext, useContext, useState, useEffect } from 'react';

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
  const [userId, setUserId] = useState(null);

  // Load cart data when user changes
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserId(payload._id);
        
        // Load cart data for this user
        const savedCart = localStorage.getItem(`cart_${payload._id}`);
        if (savedCart) {
          const { items, address, payment } = JSON.parse(savedCart);
          setCartItems(items || []);
          setShippingAddress(address || {
            address: '',
            city: '',
            postalCode: '',
            country: ''
          });
          setPaymentMethod(payment || '');
        }
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    } else {
      // Clear cart when logged out
      setUserId(null);
      setCartItems([]);
      setShippingAddress({
        address: '',
        city: '',
        postalCode: '',
        country: ''
      });
      setPaymentMethod('');
    }
  }, []);

  // Save cart data whenever it changes
  useEffect(() => {
    if (userId) {
      localStorage.setItem(`cart_${userId}`, JSON.stringify({
        items: cartItems,
        address: shippingAddress,
        payment: paymentMethod
      }));
    }
  }, [cartItems, shippingAddress, paymentMethod, userId]);

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
    if (userId) {
      localStorage.removeItem(`cart_${userId}`);
    }
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    total: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    cartCount: cartItems.length,
    shippingAddress,
    setShippingAddress,
    paymentMethod,
    setPaymentMethod
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};