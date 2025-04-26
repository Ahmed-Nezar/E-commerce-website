import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Stepper,
  Step,
  StepLabel,
  Fade
} from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PaymentIcon from '@mui/icons-material/Payment';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { useCart } from '../../context/CartContext';

// Import step components
import ShippingInfo from '../Checkout/ShippingInfo';
import PaymentMethod from '../Checkout/PaymentMethod';
import OrderReview from '../Checkout/OrderReview';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, shippingAddress, setShippingAddress, paymentMethod, setPaymentMethod, total, clearCart } = useCart();
  
  // Check if user is logged in (token exists)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [guestInfo, setGuestInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  
  // Payment details state
  const [creditCardInfo, setCreditCardInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });
  const [paypalEmail, setPaypalEmail] = useState('');
  
  const [orderComplete, setOrderComplete] = useState(false);
  const [error, setError] = useState('');

  const steps = ['Shipping Information', 'Payment Method', 'Review Order'];

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    
    // If cart is empty, redirect to cart page
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems.length, navigate]);

  const handleNext = () => {
    // Validate current step before proceeding
    if (activeStep === 0) {
      // Validate shipping information
      if (!validateShippingInfo()) {
        setError('Please fill in all required shipping fields');
        return;
      }
    } else if (activeStep === 1) {
      // Validate payment method
      if (!validatePaymentMethod()) {
        return;
      }
    }
    
    setError('');
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
    setError('');
  };

  const validateShippingInfo = () => {
    // For logged in users, check shipping address fields
    if (isLoggedIn) {
      return (
        shippingAddress.address &&
        shippingAddress.city &&
        shippingAddress.postalCode &&
        shippingAddress.country
      );
    } 
    // For guests, check both shipping address and guest info fields
    else {
      return (
        shippingAddress.address &&
        shippingAddress.city &&
        shippingAddress.postalCode &&
        shippingAddress.country &&
        guestInfo.firstName &&
        guestInfo.lastName &&
        guestInfo.email
      );
    }
  };

  const validatePaymentMethod = () => {
    if (!paymentMethod) {
      setError('Please select a payment method');
      return false;
    }

    // Validate Credit Card fields
    if (paymentMethod === 'Credit Card') {
      if (!creditCardInfo.cardNumber || creditCardInfo.cardNumber.length < 13) {
        setError('Please enter a valid card number');
        return false;
      }
      if (!creditCardInfo.cardName) {
        setError('Please enter the cardholder name');
        return false;
      }
      if (!creditCardInfo.expiryDate || !creditCardInfo.expiryDate.match(/^\d{2}\/\d{2}$/)) {
        setError('Please enter a valid expiry date (MM/YY)');
        return false;
      }
      if (!creditCardInfo.cvv || creditCardInfo.cvv.length < 3) {
        setError('Please enter a valid CVV');
        return false;
      }
    }
    
    // Validate PayPal
    else if (paymentMethod === 'PayPal') {
      if (!paypalEmail || !paypalEmail.includes('@')) {
        setError('Please enter a valid PayPal email address');
        return false;
      }
    }

    return true;
  };

  const handleSubmitOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Prepare order data
      const orderData = {
        orderItems: cartItems.map((item) => ({
          product: item.product,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress,
        paymentMethod,
        totalPrice: total,
      };

      // Add payment details based on payment method
      if (paymentMethod === 'Credit Card') {
        orderData.paymentDetails = {
          type: 'Credit Card',
          cardName: creditCardInfo.cardName,
          // Send only last 4 digits for security
          lastFour: creditCardInfo.cardNumber.replace(/\s/g, '').slice(-4),
          expiryDate: creditCardInfo.expiryDate
        };
      } else if (paymentMethod === 'PayPal') {
        orderData.paymentDetails = {
          type: 'PayPal',
          email: paypalEmail
        };
      }

      // If guest checkout, add guest information
      if (!isLoggedIn) {
        orderData.guestInfo = guestInfo;
      }

      // Send order to backend
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token || '',
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (response.ok) {
        setOrderComplete(true);
        clearCart(); // Clear cart after successful order
      } else {
        setError(data.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Order submission error:', error);
      setError('An error occurred while processing your order. Please try again.');
    }
  };

  // Render the appropriate step component based on activeStep
  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <ShippingInfo
            shippingAddress={shippingAddress}
            setShippingAddress={setShippingAddress}
            guestInfo={guestInfo}
            setGuestInfo={setGuestInfo}
            isLoggedIn={isLoggedIn}
            error={error}
          />
        );
      
      case 1:
        return (
          <PaymentMethod
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            creditCardInfo={creditCardInfo}
            setCreditCardInfo={setCreditCardInfo}
            paypalEmail={paypalEmail}
            setPaypalEmail={setPaypalEmail}
            error={error}
          />
        );
      
      case 2:
        return (
          <OrderReview
            cartItems={cartItems}
            total={total}
            shippingAddress={shippingAddress}
            guestInfo={guestInfo}
            isLoggedIn={isLoggedIn}
            paymentMethod={paymentMethod}
            creditCardInfo={creditCardInfo}
            paypalEmail={paypalEmail}
            error={error}
          />
        );

      default:
        return 'Unknown step';
    }
  };

  if (orderComplete) {
    return (
      <Fade in timeout={800}>
        <Container maxWidth="md" sx={{ py: 12, minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 6 },
              width: '100%',
              borderRadius: 4,
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
            }}
          >
            <Box
              sx={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: 'linear-gradient(45deg, #091540, #3D518C)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 4,
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                  '0%': { boxShadow: '0 0 0 0 rgba(9, 21, 64, 0.7)' },
                  '70%': { boxShadow: '0 0 0 20px rgba(9, 21, 64, 0)' },
                  '100%': { boxShadow: '0 0 0 0 rgba(9, 21, 64, 0)' },
                },
              }}
            >
              <ReceiptIcon sx={{ fontSize: 60, color: '#fff' }} />
            </Box>
            <Typography
              variant="h3"
              sx={{
                mb: 3,
                fontWeight: 700,
                background: 'linear-gradient(45deg, #091540, #3D518C)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Thank You!
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, color: 'text.secondary' }}>
              Your order has been placed successfully.
            </Typography>
            <Typography variant="body1" sx={{ mb: 4 }}>
              {isLoggedIn
                ? 'You can track your order in your account dashboard.'
                : 'A confirmation email has been sent to your email address.'}
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/')}
              sx={{
                py: 1.5,
                px: 4,
                borderRadius: 3,
                fontSize: '1.1rem',
                fontWeight: 600,
                textTransform: 'none',
                background: 'linear-gradient(45deg, #091540, #3D518C)',
                boxShadow: '0 4px 15px rgba(9, 21, 64, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #091540, #1B2CC1)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(9, 21, 64, 0.4)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Continue Shopping
            </Button>
          </Paper>
        </Container>
      </Fade>
    );
  }

  return (
    <Fade in timeout={800}>
      <Container maxWidth="md" sx={{ py: 12, minHeight: '100vh' }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 4,
              gap: 2,
            }}
          >
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(45deg, #091540, #3D518C)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Checkout
            </Typography>
          </Box>

          <Stepper activeStep={activeStep} sx={{ mb: 5 }} alternativeLabel>
            {steps.map((label, index) => {
              let icon;
              if (index === 0) {
                icon = <LocalShippingIcon />;
              } else if (index === 1) {
                icon = <PaymentIcon />;
              } else {
                icon = <ReceiptIcon />;
              }

              return (
                <Step key={label}>
                  <StepLabel
                    StepIconProps={{
                      icon: icon,
                    }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              );
            })}
          </Stepper>

          {renderStepContent()}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 5 }}>
            <Button
              variant="outlined"
              onClick={activeStep === 0 ? () => navigate('/cart') : handleBack}
              sx={{
                borderRadius: 2,
                px: 4,
                py: 1,
                textTransform: 'none',
                fontWeight: 600,
                borderColor: '#3D518C',
                color: '#3D518C',
                '&:hover': {
                  borderColor: '#1B2CC1',
                  backgroundColor: 'rgba(27, 44, 193, 0.04)',
                },
              }}
            >
              {activeStep === 0 ? 'Back to Cart' : 'Back'}
            </Button>
            <Button
              variant="contained"
              onClick={activeStep === steps.length - 1 ? handleSubmitOrder : handleNext}
              sx={{
                borderRadius: 2,
                px: 4,
                py: 1,
                textTransform: 'none',
                fontWeight: 600,
                background: 'linear-gradient(45deg, #091540, #3D518C)',
                boxShadow: '0 4px 15px rgba(9, 21, 64, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #091540, #1B2CC1)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(9, 21, 64, 0.4)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              {activeStep === steps.length - 1 ? 'Place Order' : 'Continue'}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Fade>
  );
};

export default Checkout;