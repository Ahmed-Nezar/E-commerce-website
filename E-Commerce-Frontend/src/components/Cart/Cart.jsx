import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  IconButton,
  Button,
  Divider,
  TextField,
  Fade,
  Slide,
  Badge,
  useTheme,
  Zoom,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { Stack } from '@mui/system';
import Loader from '../Loader/Loader.jsx';

const Cart = () => {
  const [removedItemId, setRemovedItemId] = useState(null);
  const [showAddedAnimation, setShowAddedAnimation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updatingItem, setUpdatingItem] = useState(null);
  const [removingItem, setRemovingItem] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const { 
    cartItems, 
    addToCart,
    removeFromCart, 
    updateQuantity,
    clearCart, 
    total, 
    cartCount,
    shippingAddress,
    setShippingAddress,
    paymentMethod,
    setPaymentMethod
  } = useCart();

  const handleUpdateQuantity = async (productId, change) => {
    setUpdatingItem(productId);
    try {
      await updateQuantity(productId, change);
      setShowAddedAnimation(true);
      setTimeout(() => setShowAddedAnimation(false), 1500);
    } finally {
      setUpdatingItem(null);
    }
  };

  const handleRemoveItem = async (productId) => {
    setRemovingItem(productId);
    setRemovedItemId(productId);
    try {
      await new Promise(resolve => setTimeout(resolve, 300)); // Animation delay
      await removeFromCart(productId);
    } finally {
      setRemovingItem(null);
      setRemovedItemId(null);
    }
  };

  const handleCheckout = () => {
    // Prepare order data based on schema
    const orderData = {
      orderItems: cartItems.map(item => ({
        product: item.product,
        quantity: item.quantity,
        price: item.price
      })),
      shippingAddress,
      paymentMethod,
      totalPrice: total
    };
    
    console.log('Processing order:', orderData);
    navigate('/checkout');
    // TODO: Implement checkout logic with backend
  };

  useEffect(() => {
    // Simulate loading state for cart data initialization
    setTimeout(() => setLoading(false), 800);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <Fade in timeout={800}>
      <Container maxWidth="xl" sx={{ py: 12, minHeight: '100vh' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            mb: 6,
            position: 'relative'
          }}
        >
          <Zoom in={showAddedAnimation} 
            style={{
              position: 'absolute',
              right: -20,
              top: -20,
            }}
          >
            <Paper
              sx={{
                p: 1,
                bgcolor: theme.palette.success.main,
                color: 'white',
                borderRadius: 2,
                boxShadow: theme.shadows[4],
              }}
            >
              <Typography variant="body2">Updated!</Typography>
            </Paper>
          </Zoom>
          <Badge 
            badgeContent={cartCount} 
            color="primary" 
            sx={{ 
              transform: 'scale(1.2)',
              '& .MuiBadge-badge': {
                animation: cartCount ? 'bounce 0.5s ease-in-out' : 'none',
                '@keyframes bounce': {
                  '0%, 100%': { transform: 'scale(1)' },
                  '50%': { transform: 'scale(1.3)' },
                },
              }
            }}
          >
            <ShoppingCartIcon sx={{ fontSize: 40, color: '#3D518C' }} />
          </Badge>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(45deg, #091540, #3D518C)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textAlign: 'center',
              letterSpacing: '0.5px'
            }}
          >
            Your Cart
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 4,
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
              }}
            >
              {cartItems.length === 0 ? (
                <Box
                  sx={{
                    textAlign: 'center',
                    py: 8,
                    px: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 3
                  }}
                >
                  <LocalMallIcon 
                    sx={{ 
                      fontSize: 120, 
                      color: '#bdbdbd',
                      animation: 'float 3s ease-in-out infinite',
                      '@keyframes float': {
                        '0%, 100%': { transform: 'translateY(0)' },
                        '50%': { transform: 'translateY(-10px)' },
                      }
                    }} 
                  />
                  <Typography 
                    variant="h5" 
                    color="text.secondary" 
                    sx={{
                      fontWeight: 600,
                      background: 'linear-gradient(45deg, #091540, #3D518C)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Your cart is feeling a bit lonely
                  </Typography>
                  <Typography 
                    variant="body1" 
                    color="text.secondary" 
                    sx={{ maxWidth: 400, mb: 2 }}
                  >
                    Why not explore our collection and find something special?
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => navigate('/')}
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      background: 'linear-gradient(45deg, #091540, #3D518C)',
                      boxShadow: '0 4px 15px rgba(9, 21, 64, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #091540, #1B2CC1)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 20px rgba(9, 21, 64, 0.4)',
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Discover Products
                  </Button>
                </Box>
              ) : (
                cartItems.map((item) => (
                  <Slide
                    direction="right"
                    in={removedItemId !== item.product}
                    timeout={300}
                    key={item.product}
                  >
                    <Card
                      sx={{
                        mb: 2,
                        display: 'flex',
                        borderRadius: 3,
                        overflow: 'hidden',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{
                            width: '100px',
                            height: '100px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                          }}
                        />
                      </Box>
                      <CardContent sx={{
                        flex: 1,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 3
                      }}>
                        <Stack spacing={1}>
                          <Typography variant="h5" component="div" fontWeight="600">
                            {item.name}
                          </Typography>
                          <Typography
                            variant="h5"
                            sx={{
                              fontWeight: '700',
                              background: 'linear-gradient(45deg, #091540, #3D518C)',
                              backgroundClip: 'text',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                            }}
                          >
                            ${item.price.toFixed(2)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Subtotal: ${(item.price * item.quantity).toFixed(2)}
                          </Typography>
                        </Stack>
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}>
                          <IconButton
                            onClick={() => handleUpdateQuantity(item.product, -1)}
                            disabled={updatingItem === item.product}
                            sx={{
                              bgcolor: 'rgba(9, 21, 64, 0.1)',
                              '&:hover': {
                                bgcolor: 'rgba(9, 21, 64, 0.2)',
                              },
                              opacity: updatingItem === item.product ? 0.5 : 1,
                            }}
                          >
                            <RemoveIcon />
                          </IconButton>
                          <TextField
                            value={item.quantity}
                            size="small"
                            InputProps={{
                              readOnly: true,
                              sx: {
                                width: '60px',
                                textAlign: 'center',
                                '& input': {
                                  textAlign: 'center',
                                },
                              },
                            }}
                          />
                          <IconButton
                            onClick={() => handleUpdateQuantity(item.product, 1)}
                            disabled={updatingItem === item.product}
                            sx={{
                              bgcolor: 'rgba(9, 21, 64, 0.1)',
                              '&:hover': {
                                bgcolor: 'rgba(9, 21, 64, 0.2)',
                              },
                              opacity: updatingItem === item.product ? 0.5 : 1,
                            }}
                          >
                            <AddIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => handleRemoveItem(item.product)}
                            disabled={removingItem === item.product}
                            sx={{
                              ml: 2,
                              color: '#d32f2f',
                              '&:hover': {
                                bgcolor: 'rgba(211, 47, 47, 0.1)',
                              },
                              opacity: removingItem === item.product ? 0.5 : 1,
                            }}
                          >
                            <DeleteOutlineIcon />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  </Slide>
                ))
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Slide direction="left" in timeout={500}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: 4,
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  position: 'sticky',
                  top: 100
                }}
              >
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>Order Summary</Typography>
                <Box sx={{ mb: 3 }}>
                  <Grid container justifyContent="space-between" sx={{ mb: 2 }}>
                    <Typography color="text.secondary">Subtotal</Typography>
                    <Typography fontWeight="500">${total.toFixed(2)}</Typography>
                  </Grid>
                  <Grid container justifyContent="space-between" sx={{ mb: 2 }}>
                    <Typography color="text.secondary">Shipping</Typography>
                    <Typography 
                      sx={{
                        color: '#2e7d32',
                        fontWeight: 500
                      }}
                    >
                      Free
                    </Typography>
                  </Grid>
                  <Divider sx={{ my: 3 }} />
                  <Grid container justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">Total</Typography>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        background: 'linear-gradient(45deg, #091540, #3D518C)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      ${total.toFixed(2)}
                    </Typography>
                  </Grid>
                </Box>
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={cartItems.length === 0}
                  onClick={handleCheckout}
                  sx={{
                    mt: 2,
                    py: 2,
                    borderRadius: 3,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    background: cartItems.length === 0 
                      ? 'rgba(0, 0, 0, 0.12)'
                      : 'linear-gradient(45deg, #091540, #3D518C)',
                    boxShadow: '0 4px 15px rgba(9, 21, 64, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #091540, #1B2CC1)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(9, 21, 64, 0.4)',
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Proceed to Checkout
                </Button>
                {cartItems.length === 0 && (
                  <Typography
                    variant="body2"
                    sx={{
                      mt: 2,
                      textAlign: 'center',
                      color: 'text.secondary'
                    }}
                  >
                    Add items to your cart to checkout
                  </Typography>
                )}
              </Paper>
            </Slide>
          </Grid>
        </Grid>
      </Container>
    </Fade>
  );
};

export default Cart;