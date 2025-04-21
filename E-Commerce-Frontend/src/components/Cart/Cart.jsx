import { useState } from 'react';
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
  TextField
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const Cart = () => {
  // Example cart items - replace with actual state management later
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
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography
        variant="h4"
        component="h1"
        sx={{
          mb: 4,
          fontWeight: 700,
          textAlign: 'center',
          background: 'linear-gradient(45deg, #1976d2, #2196f3)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}
      >
        Shopping Cart
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 2,
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)'
            }}
          >
            {cartItems.length === 0 ? (
              <Typography variant="h6" textAlign="center" color="text.secondary">
                Your cart is empty
              </Typography>
            ) : (
              cartItems.map((item) => (
                <Card
                  key={item.id}
                  sx={{
                    mb: 2,
                    display: 'flex',
                    borderRadius: 2,
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                >
                  <CardMedia
                    component="img"
                    sx={{ width: 150, height: 150, objectFit: 'cover' }}
                    image={item.image}
                    alt={item.name}
                  />
                  <CardContent sx={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3 }}>
                    <Box>
                      <Typography variant="h6" component="div">
                        {item.name}
                      </Typography>
                      <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                        ${item.price.toFixed(2)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconButton onClick={() => updateQuantity(item.id, -1)} size="small">
                        <RemoveIcon />
                      </IconButton>
                      <TextField
                        value={item.quantity}
                        size="small"
                        InputProps={{ readOnly: true }}
                        sx={{ width: '60px' }}
                      />
                      <IconButton onClick={() => updateQuantity(item.id, 1)} size="small">
                        <AddIcon />
                      </IconButton>
                      <IconButton onClick={() => removeItem(item.id)} color="error" sx={{ ml: 2 }}>
                        <DeleteOutlineIcon />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              ))
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 2,
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>Order Summary</Typography>
            <Box sx={{ mb: 2 }}>
              <Grid container justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography>Subtotal</Typography>
                <Typography>${calculateTotal().toFixed(2)}</Typography>
              </Grid>
              <Grid container justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography>Shipping</Typography>
                <Typography>Free</Typography>
              </Grid>
              <Divider sx={{ my: 2 }} />
              <Grid container justifyContent="space-between">
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6" color="primary">
                  ${calculateTotal().toFixed(2)}
                </Typography>
              </Grid>
            </Box>
            <Button
              variant="contained"
              fullWidth
              size="large"
              sx={{
                mt: 2,
                py: 1.5,
                borderRadius: 2,
                background: 'linear-gradient(45deg, #1976d2, #2196f3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1565c0, #1976d2)',
                }
              }}
            >
              Proceed to Checkout
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Cart;