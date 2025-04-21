import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Button,
  Divider,
  TextField,
  Fade,
  Slide,
  Badge
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const Cart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Product 1',
      price: 99.99,
      quantity: 1,
      image: 'https://via.placeholder.com/150'
    },
    {
      id: 2,
      name: 'Product 2',
      price: 149.99,
      quantity: 2,
      image: 'https://via.placeholder.com/150'
    }
  ]);

  const [removedItemId, setRemovedItemId] = useState(null);

  const updateQuantity = (id, change) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setRemovedItemId(id);
    setTimeout(() => {
      setCartItems(items => items.filter(item => item.id !== id));
      setRemovedItemId(null);
    }, 300);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <Fade in timeout={800}>
      <Container maxWidth="xl" sx={{ py: 12, minHeight: '100vh' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            mb: 6
          }}
        >
          <Badge badgeContent={cartItems.length} color="primary" sx={{ transform: 'scale(1.2)' }}>
            <ShoppingCartIcon sx={{ fontSize: 40, color: '#1976d2' }} />
          </Badge>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(45deg, #1976d2, #2196f3)',
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
                    px: 2
                  }}
                >
                  <ShoppingCartIcon sx={{ fontSize: 60, color: '#bdbdbd', mb: 2 }} />
                  <Typography variant="h5" color="text.secondary" gutterBottom>
                    Your cart is empty
                  </Typography>
                  <Typography variant="body1" color="text.secondary" mb={4}>
                    Looks like you haven't added any items to your cart yet.
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      background: 'linear-gradient(45deg, #1976d2, #2196f3)',
                      boxShadow: '0 4px 15px rgba(33, 150, 243, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #1565c0, #1976d2)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 20px rgba(33, 150, 243, 0.4)',
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Start Shopping
                  </Button>
                </Box>
              ) : (
                cartItems.map((item) => (
                  <Slide
                    direction="right"
                    in={removedItemId !== item.id}
                    timeout={300}
                    key={item.id}
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
                      <CardMedia
                        component="img"
                        sx={{
                          width: 180,
                          height: 180,
                          objectFit: 'cover',
                          transition: 'transform 0.3s ease',
                          '&:hover': {
                            transform: 'scale(1.05)',
                          },
                        }}
                        image={item.image}
                        alt={item.name}
                      />
                      <CardContent sx={{
                        flex: 1,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 3
                      }}>
                        <Box>
                          <Typography variant="h5" component="div" fontWeight="600" gutterBottom>
                            {item.name}
                          </Typography>
                          <Typography
                            variant="h5"
                            sx={{
                              color: '#1976d2',
                              fontWeight: '700',
                              mt: 1,
                              background: 'linear-gradient(45deg, #1976d2, #2196f3)',
                              backgroundClip: 'text',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                            }}
                          >
                            ${item.price.toFixed(2)}
                          </Typography>
                        </Box>
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}>
                          <IconButton
                            onClick={() => updateQuantity(item.id, -1)}
                            sx={{
                              bgcolor: 'rgba(25, 118, 210, 0.1)',
                              '&:hover': {
                                bgcolor: 'rgba(25, 118, 210, 0.2)',
                              },
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
                            onClick={() => updateQuantity(item.id, 1)}
                            sx={{
                              bgcolor: 'rgba(25, 118, 210, 0.1)',
                              '&:hover': {
                                bgcolor: 'rgba(25, 118, 210, 0.2)',
                              },
                            }}
                          >
                            <AddIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => removeItem(item.id)}
                            sx={{
                              ml: 2,
                              color: '#d32f2f',
                              '&:hover': {
                                bgcolor: 'rgba(211, 47, 47, 0.1)',
                              },
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
                    <Typography fontWeight="500">${calculateTotal().toFixed(2)}</Typography>
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
                        background: 'linear-gradient(45deg, #1976d2, #2196f3)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      ${calculateTotal().toFixed(2)}
                    </Typography>
                  </Grid>
                </Box>
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={cartItems.length === 0}
                  sx={{
                    mt: 2,
                    py: 2,
                    borderRadius: 3,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    background: cartItems.length === 0 
                      ? 'rgba(0, 0, 0, 0.12)'
                      : 'linear-gradient(45deg, #1976d2, #2196f3)',
                    boxShadow: '0 4px 15px rgba(33, 150, 243, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #1565c0, #1976d2)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(33, 150, 243, 0.4)',
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