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
import {useCart} from "../../context/CartContext.jsx";

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
    const { shippingFees, discount } = useCart();
    return (
        <Box sx={{mt: 4}}>
            {error && (
                <Alert
                    severity="error"
                    sx={{
                        mb: 3,
                        borderRadius: 2,
                        animation: 'slideIn 0.3s ease-out',
                        '@keyframes slideIn': {
                            from: {transform: 'translateY(-20px)', opacity: 0},
                            to: {transform: 'translateY(0)', opacity: 1},
                        },
                    }}
                >
                    {error}
                </Alert>
            )}

            <Typography variant="h6" sx={{mb: 3, fontWeight: 600, color: '#091540'}}>
                Order Summary
            </Typography>

            {/* Order items */}
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    mb: 4,
                    borderRadius: 3,
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
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
                            borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
                            '&:last-child': {
                                mb: 0,
                                pb: 0,
                                borderBottom: 'none',
                            },
                            transition: 'transform 0.3s ease',
                            '&:hover': {
                                transform: 'translateX(8px)',
                            },
                        }}
                    >
                        <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                            <Box
                                sx={{
                                    width: 60,
                                    height: 60,
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                }}
                            >
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                    }}
                                />
                            </Box>
                            <Box>
                                <Typography variant="subtitle1" sx={{fontWeight: 600, color: '#091540'}}>
                                    {item.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Qty: {item.quantity}
                                </Typography>
                            </Box>
                        </Box>
                        <Typography
                            variant="subtitle1"
                            sx={{
                                fontWeight: 600,
                                background: 'linear-gradient(45deg, #091540, #3D518C)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            ${(item.price * item.quantity).toFixed(2)}
                        </Typography>
                    </Box>
                ))}
            </Paper>

      {/* Order details in a grid */}
        <Box
            sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' }, // column on mobile, row on md+
                gap: 3,                                     // spacing between panels
                width: '100%',
            }}
        >
        <Box sx={{ flex: 1 }}>
            <Paper
                elevation={0}
                sx={{
                    borderRadius: 3,
                    p: 3,
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                    transition: 'transform 0.3s ease',
                    '&:hover': { transform: 'translateY(-4px)' },
                    height: '100%',  // make both panels equal height
                }}
            >
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#091540' }}>
                    Shipping Information
                </Typography>
                { !isLoggedIn && (
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">Customer</Typography>
                        <Typography sx={{ fontWeight: 500 }}>
                            {guestInfo.firstName} {guestInfo.lastName}
                        </Typography>
                    </Box>
                )}
                <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">Address</Typography>
                    <Typography sx={{ fontWeight: 500 }}>{shippingAddress.address}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">City</Typography>
                    <Typography sx={{ fontWeight: 500 }}>{shippingAddress.city}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">Postal Code</Typography>
                    <Typography sx={{ fontWeight: 500 }}>{shippingAddress.postalCode}</Typography>
                </Box>
                <Box>
                    <Typography variant="subtitle2" color="text.secondary">Country</Typography>
                    <Typography sx={{ fontWeight: 500 }}>{shippingAddress.country}</Typography>
                </Box>
            </Paper>
        </Box>

        {/* Payment Details panel */}
        <Box sx={{ flex: 1 }}>
            <Paper
                elevation={0}
                sx={{
                    borderRadius: 3,
                    p: 3,
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                    transition: 'transform 0.3s ease',
                    '&:hover': { transform: 'translateY(-4px)' },
                    height: '100%',
                }}
            >
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#091540' }}>
                    Payment Details
                </Typography>
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle2" color="text.secondary">Payment Method</Typography>
                    <Typography sx={{ fontWeight: 500 }}>{paymentMethod}</Typography>
                </Box>

                {paymentMethod === 'Credit Card' && creditCardInfo.cardNumber && (
                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="subtitle2" color="text.secondary">Card Number</Typography>
                        <Typography sx={{ fontWeight: 500 }}>
                            **** **** **** {creditCardInfo.cardNumber.replace(/\s/g, '').slice(-4)}
                        </Typography>
                    </Box>
                )}

                {paymentMethod === 'PayPal' && paypalEmail && (
                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="subtitle2" color="text.secondary">PayPal Email</Typography>
                        <Typography sx={{ fontWeight: 500 }}>{paypalEmail}</Typography>
                    </Box>
                )}

                <Divider sx={{ my: 3 }} />

                <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between' }}>
                    <Typography color="text.secondary">Subtotal</Typography>
                    <Typography fontWeight={500}>${total.toFixed(2)}</Typography>
                </Box>
                <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between' }}>
                    <Typography color="text.secondary">Discount</Typography>
                    <Typography sx={{ color: 'success.main', fontWeight: 500 }}>{discount}</Typography>
                </Box>
                <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between' }}>
                    <Typography color="text.secondary">Shipping</Typography>
                    <Typography sx={{ color: 'success.main', fontWeight: 500 }}>{shippingFees}</Typography>
                </Box>
                <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between' }}>
                    <Typography color="text.secondary">Tax</Typography>
                    <Typography sx={{ color: 'success.main', fontWeight: 500 }}>{(0.14 * total).toFixed(2)}</Typography>
                </Box>
                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">Total</Typography>
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
                        ${(total.toFixed(2) + shippingFees).toFixed(2)}
                    </Typography>
                </Box>
            </Paper>
        </Box>
    </Box>
    </Box>
  );
};

export default OrderReview;