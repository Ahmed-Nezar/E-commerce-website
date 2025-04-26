import React from 'react';
import {
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Divider,
  Alert
} from '@mui/material';

const OrderReview = ({ 
  cartItems, 
  total, 
  shippingAddress, 
  guestInfo, 
  isLoggedIn, 
  paymentMethod, 
  creditCardInfo, 
  paypalEmail,
  error
}) => {
  return (
    <Box sx={{ mt: 4 }}>
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
        Order Summary
      </Typography>

      {/* Order items */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 2,
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
        }}
      >
        {cartItems.map((item) => (
          <Box
            key={item.id}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
              pb: 2,
              borderBottom: 1,
              borderColor: 'divider',
              '&:last-child': {
                mb: 0,
                pb: 0,
                borderBottom: 'none',
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <img
                src={item.image}
                alt={item.name}
                style={{
                  width: '50px',
                  height: '50px',
                  objectFit: 'cover',
                  borderRadius: '4px',
                }}
              />
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  {item.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Qty: {item.quantity}
                </Typography>
              </Box>
            </Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              ${(item.price * item.quantity).toFixed(2)}
            </Typography>
          </Box>
        ))}
      </Paper>

      {/* Order details */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card
            variant="outlined"
            sx={{
              borderRadius: 2,
              height: '100%',
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Shipping Information
              </Typography>
              {!isLoggedIn && (
                <Typography sx={{ mb: 1 }}>
                  <strong>Name:</strong> {guestInfo.firstName} {guestInfo.lastName}
                </Typography>
              )}
              <Typography sx={{ mb: 1 }}>
                <strong>Address:</strong> {shippingAddress.address}
              </Typography>
              <Typography sx={{ mb: 1 }}>
                <strong>City:</strong> {shippingAddress.city}
              </Typography>
              <Typography sx={{ mb: 1 }}>
                <strong>Postal Code:</strong> {shippingAddress.postalCode}
              </Typography>
              <Typography>
                <strong>Country:</strong> {shippingAddress.country}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card
            variant="outlined"
            sx={{
              borderRadius: 2,
              height: '100%',
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Payment Details
              </Typography>
              <Typography sx={{ mb: 1 }}>
                <strong>Payment Method:</strong> {paymentMethod}
              </Typography>
              
              {paymentMethod === 'Credit Card' && creditCardInfo.cardNumber && (
                <Typography sx={{ mb: 1 }}>
                  <strong>Card:</strong> **** **** **** {creditCardInfo.cardNumber.replace(/\s/g, '').slice(-4)}
                </Typography>
              )}
              
              {paymentMethod === 'PayPal' && paypalEmail && (
                <Typography sx={{ mb: 1 }}>
                  <strong>PayPal Email:</strong> {paypalEmail}
                </Typography>
              )}
              
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Subtotal:</Typography>
                <Typography fontWeight={500}>${total.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Shipping:</Typography>
                <Typography sx={{ color: 'success.main', fontWeight: 500 }}>
                  Free
                </Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mt: 2,
                }}
              >
                <Typography variant="h6">Total:</Typography>
                <Typography
                  variant="h6"
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
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OrderReview;