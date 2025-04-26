import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Paper,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Grid,
  Collapse,
  InputAdornment,
  Alert
} from '@mui/material';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';

const getCardType = (number) => {
  const cleaned = number?.replace(/\s/g, '');
  if (!cleaned) return '';
  // Visa
  if (cleaned.match(/^4/)) return 'visa';
  // Mastercard
  if (cleaned.match(/^5[1-5]/)) return 'mastercard';
  return '';
};

const getCardBackground = (type) => {
  switch (type) {
    case 'visa':
      return 'linear-gradient(135deg, #091540, #1B2CC1)';
    case 'mastercard':
      return 'linear-gradient(45deg, #1B2CC1, #C41E3A)';
    default:
      return 'linear-gradient(135deg, #666, #999)';
  }
};

const getCardLogo = (type) => {
  switch (type) {
    case 'visa':
      return '/images/logos/visa.png';
    case 'mastercard':
      return '/images/logos/mastercard.png';
    default:
      return '/images/logos/visa.png';
  }
};

// Card display component
const FloatingCard = ({ cardInfo, isFlipped }) => {
  const cardType = getCardType(cardInfo.cardNumber);
  const cardBackground = getCardBackground(cardType);
  const logoPath = getCardLogo(cardType);

  return (
    <Box
      sx={{
        perspective: '1000px',
        mb: 4,
        height: '200px',
        width: '340px',
        position: 'relative',
        mx: 'auto',
        transformStyle: 'preserve-3d',
        transition: 'transform 0.8s cubic-bezier(0.71, 0.03, 0.56, 0.85)',
        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
      }}
    >
      {/* Front of card */}
      <Paper
        className="card-front"
        sx={{
          p: 3,
          height: '100%',
          width: '100%',
          position: 'absolute',
          borderRadius: 3,
          background: cardBackground,
          color: 'white',
          backfaceVisibility: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '0 15px 35px rgba(0, 0, 0, 0.25)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0))',
            borderRadius: 3,
          }
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <Box 
            component="img" 
            src={logoPath}
            alt={cardType || 'credit card'}
            sx={{ 
              height: '40px',
              width: 'auto',
              objectFit: 'contain',
              filter: cardType === 'visa' ? 'brightness(0) invert(1)' : 'none',
              transition: 'all 0.3s ease',
              opacity: cardType ? 1 : 0.5,
            }} 
          />
          <Box
            sx={{
              width: '45px',
              height: '35px',
              background: 'linear-gradient(135deg, #FFD700, #FFA500)',
              borderRadius: '4px',
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `
                  linear-gradient(90deg, transparent 50%, rgba(255,255,255,0.15) 51%, transparent 51%),
                  linear-gradient(0deg, transparent 50%, rgba(255,255,255,0.15) 51%, transparent 51%)
                `,
                backgroundSize: '8px 8px',
                borderRadius: '4px',
              }
            }}
          />
        </Box>

        <Box sx={{ mt: 1, position: 'relative', zIndex: 1 }}>
          <Typography 
            variant="h5" 
            sx={{ 
              letterSpacing: '0.2em',
              fontFamily: 'monospace',
              fontSize: '1.5rem',
              textAlign: 'center',
              mb: 2,
              textShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}
          >
            **** **** **** ****
          </Typography>
        </Box>

        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-end',
            position: 'relative',
            zIndex: 1
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" sx={{ opacity: 0.8, display: 'block', mb: 0.5 }}>
              Card Holder
            </Typography>
            <Typography 
              sx={{ 
                textTransform: 'uppercase',
                fontSize: '0.9rem',
                letterSpacing: '0.1em',
                textShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}
            >
              {cardInfo.cardName || 'YOUR NAME'}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right', ml: 2 }}>
            <Typography variant="caption" sx={{ opacity: 0.8, display: 'block', mb: 0.5 }}>
              Expires
            </Typography>
            <Typography sx={{ fontSize: '0.9rem', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
              {cardInfo.expiryDate || 'MM/YY'}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Back of card */}
      <Paper
        className="card-back"
        sx={{
          p: 3,
          height: '100%',
          width: '100%',
          position: 'absolute',
          borderRadius: 3,
          background: cardBackground,
          color: 'white',
          backfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          boxShadow: '0 15px 35px rgba(0, 0, 0, 0.25)',
        }}
      >
        <Box 
          sx={{ 
            width: '100%', 
            height: '45px', 
            background: '#111',
            mt: 1 
          }} 
        />
        <Box 
          sx={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            mt: 3
          }}
        >
          <Typography 
            variant="caption" 
            sx={{ 
              opacity: 0.8,
              mb: 0.5,
              alignSelf: 'flex-end'
            }}
          >
            CVV
          </Typography>
          <Box 
            sx={{ 
              background: '#fff',
              p: '8px 12px',
              borderRadius: 1,
              width: '60px',
              textAlign: 'center',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: -30,
                right: -20,
                left: -140,
                height: '25px',
                background: 'rgba(255,255,255,0.1)',
              }
            }}
          >
            <Typography sx={{ color: '#000', letterSpacing: 1, fontFamily: 'monospace' }}>
              {cardInfo.cvv || '***'}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

const PaymentMethod = ({ 
  paymentMethod, 
  setPaymentMethod, 
  creditCardInfo, 
  setCreditCardInfo, 
  paypalEmail, 
  setPaypalEmail, 
  error 
}) => {
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  
  // Add focus handlers for CVV field
  const handleCVVFocus = () => setIsCardFlipped(true);
  const handleCVVBlur = () => setIsCardFlipped(false);

  // Add validation state
  const [validationErrors, setValidationErrors] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  const validateCardNumber = (number) => {
    const cleaned = number.replace(/\s/g, '');
    // Check length and format using Luhn algorithm
    if (!/^\d{16}$/.test(cleaned)) {
      return 'Card number must be 16 digits';
    }
    // Luhn algorithm check
    let sum = 0;
    let isEven = false;
    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned[i]);
      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      sum += digit;
      isEven = !isEven;
    }
    return sum % 10 === 0 ? '' : 'Invalid card number';
  };

  const validateExpiryDate = (date) => {
    if (!/^\d{2}\/\d{2}$/.test(date)) {
      return 'Use MM/YY format';
    }
    const [month, year] = date.split('/').map(num => parseInt(num));
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    
    if (month < 1 || month > 12) {
      return 'Invalid month';
    }
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return 'Card has expired';
    }
    return '';
  };

  const validateCVV = (cvv) => {
    return /^\d{3,3}$/.test(cvv) ? '' : 'CVV must be 3 digits';
  };

  const validateCardName = (name) => {
    return /^[A-Za-z\s]{2,25}$/.test(name) ? '' : 'Enter a valid name (2-25 characters)';
  };

  const handleCreditCardChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;
    let error = '';

    switch (name) {
      case 'cardNumber':
        formattedValue = formatCardNumber(value);
        error = validateCardNumber(formattedValue);
        break;
      case 'expiryDate':
        formattedValue = formatExpiryDate(value);
        error = validateExpiryDate(formattedValue);
        break;
      case 'cvv':
        if (value.match(/^\d{0,4}$/)) {
          error = validateCVV(value);
        } else {
          return; // Don't update if input is invalid
        }
        break;
      case 'cardName':
        if (value.match(/^[A-Za-z\s]{0,50}$/)) {
          error = validateCardName(value);
        } else {
          return; // Don't update if input is invalid
        }
        break;
    }

    setCreditCardInfo(prev => ({
      ...prev,
      [name]: formattedValue
    }));

    setValidationErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  // Format credit card number with spaces
  const formatCardNumber = (value) => {
    if (!value) return value;
    
    // Remove all non-digit characters
    const cleaned = value.replace(/\D/g, '');
    // Insert space after every 4 digits
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
    // Limit to 19 characters (16 digits + 3 spaces)
    return formatted.substring(0, 19);
  };

  // Format expiry date as MM/YY
  const formatExpiryDate = (value) => {
    if (!value) return value;
    
    // Remove all non-digit characters
    const cleaned = value.replace(/\D/g, '');
    
    // If we have more than 2 digits, add a slash
    if (cleaned.length > 2) {
      return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
    }
    return cleaned;
  };

  return (
    <Box sx={{ mt: 4 }}>
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3,
            borderRadius: 2,
            animation: 'slideIn 0.3s ease-out',
            '@keyframes slideIn': {
              from: { transform: 'translateY(-20px)', opacity: 0 },
              to: { transform: 'translateY(0)', opacity: 1 },
            },
          }}
        >
          {error}
        </Alert>
      )}
      
      <FormControl component="fieldset" sx={{ width: '100%' }}>
        <FormLabel 
          component="legend" 
          sx={{ 
            mb: 3,
            fontWeight: 600,
            fontSize: '1.2rem',
            color: '#091540',
            '&.Mui-focused': {
              color: '#091540'
            }
          }}
        >
          Select Payment Method
        </FormLabel>

        <RadioGroup
          aria-label="payment-method"
          name="payment-method"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          {/* Credit Card Option */}
          <Paper
            elevation={0}
            sx={{
              mb: 2,
              p: 3,
              borderRadius: 3,
              border: '1px solid',
              borderColor: paymentMethod === 'Credit Card' ? '#1B2CC1' : 'rgba(0, 0, 0, 0.1)',
              background: paymentMethod === 'Credit Card' ? 'rgba(27, 44, 193, 0.02)' : 'transparent',
              transition: 'all 0.3s ease',
              transform: paymentMethod === 'Credit Card' ? 'scale(1.02)' : 'scale(1)',
              '&:hover': { 
                borderColor: '#1B2CC1',
                transform: 'scale(1.02)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
              },
            }}
          >
            <FormControlLabel
              value="Credit Card"
              control={<Radio />}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <Typography sx={{ fontWeight: 500 }}>Credit Card</Typography>
                  <Box component="span" sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
                    <img src="/images/logos/visa.png" alt="Visa" width="40" height="25" style={{ objectFit: 'contain' }} />
                    <img src="/images/logos/mastercard.png" alt="Mastercard" width="40" height="25" style={{ objectFit: 'contain' }} />
                  </Box>
                </Box>
              }
            />
            
            <Collapse in={paymentMethod === 'Credit Card'}>
              {paymentMethod === 'Credit Card' && 
                <FloatingCard 
                  cardInfo={creditCardInfo} 
                  isFlipped={isCardFlipped}
                />
              }
              <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(25, 118, 210, 0.04)', borderRadius: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="cardNumber"
                      name="cardNumber"
                      label="Card Number"
                      value={formatCardNumber(creditCardInfo.cardNumber)}
                      onChange={handleCreditCardChange}
                      error={!!validationErrors.cardNumber}
                      helperText={validationErrors.cardNumber}
                      inputProps={{
                        maxLength: 19,
                        inputMode: 'numeric'
                      }}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <CreditCardIcon color="action" />
                            </InputAdornment>
                          )
                        }
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="cardName"
                      name="cardName"
                      label="Cardholder Name"
                      value={creditCardInfo.cardName}
                      onChange={handleCreditCardChange}
                      error={!!validationErrors.cardName}
                      helperText={validationErrors.cardName}
                      inputProps={{
                        maxLength: 50
                      }}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonIcon color="action" />
                            </InputAdornment>
                          )
                        }
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      required
                      fullWidth
                      id="expiryDate"
                      name="expiryDate"
                      label="Expiry Date (MM/YY)"
                      value={creditCardInfo.expiryDate}
                      onChange={handleCreditCardChange}
                      error={!!validationErrors.expiryDate}
                      helperText={validationErrors.expiryDate}
                      inputProps={{
                        maxLength: 5,
                        inputMode: 'numeric'
                      }}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <CalendarTodayIcon color="action" />
                            </InputAdornment>
                          )
                        }
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      required
                      fullWidth
                      id="cvv"
                      name="cvv"
                      label="CVV"
                      type="password"
                      value={creditCardInfo.cvv}
                      onChange={handleCreditCardChange}
                      onFocus={handleCVVFocus}
                      onBlur={handleCVVBlur}
                      error={!!validationErrors.cvv}
                      helperText={validationErrors.cvv}
                      inputProps={{
                        maxLength: 4,
                        inputMode: 'numeric'
                      }}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockIcon color="action" />
                            </InputAdornment>
                          )
                        }
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Collapse>
          </Paper>

          {/* PayPal Option */}
          <Paper
            elevation={0}
            sx={{
              mb: 2,
              p: 3,
              borderRadius: 3,
              border: '1px solid',
              borderColor: paymentMethod === 'PayPal' ? '#1B2CC1' : 'rgba(0, 0, 0, 0.1)',
              background: paymentMethod === 'PayPal' ? 'rgba(27, 44, 193, 0.02)' : 'transparent',
              transition: 'all 0.3s ease',
              transform: paymentMethod === 'PayPal' ? 'scale(1.02)' : 'scale(1)',
              '&:hover': { 
                borderColor: '#1B2CC1',
                transform: 'scale(1.02)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
              },
            }}
          >
            <FormControlLabel
              value="PayPal"
              control={<Radio />}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <Typography sx={{ fontWeight: 500 }}>PayPal</Typography>
                  <Box component="span" sx={{ ml: 'auto' }}>
                    <img src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg" alt="PayPal" width="80" height="25" style={{ objectFit: 'contain' }} />
                  </Box>
                </Box>
              }
            />
            
            <Collapse in={paymentMethod === 'PayPal'}>
              <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(25, 118, 210, 0.04)', borderRadius: 2 }}>
                <TextField
                  required
                  fullWidth
                  id="paypalEmail"
                  label="PayPal Email"
                  type="email"
                  value={paypalEmail}
                  onChange={(e) => setPaypalEmail(e.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon color="action" />
                        </InputAdornment>
                      )
                    }
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
                <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'text.secondary' }}>
                  You will be redirected to PayPal to complete your payment after reviewing your order.
                </Typography>
              </Box>
            </Collapse>
          </Paper>

          {/* Cash On Delivery Option */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: '1px solid',
              borderColor: paymentMethod === 'Cash On Delivery' ? '#1B2CC1' : 'rgba(0, 0, 0, 0.1)',
              background: paymentMethod === 'Cash On Delivery' ? 'rgba(27, 44, 193, 0.02)' : 'transparent',
              transition: 'all 0.3s ease',
              transform: paymentMethod === 'Cash On Delivery' ? 'scale(1.02)' : 'scale(1)',
              '&:hover': { 
                borderColor: '#1B2CC1',
                transform: 'scale(1.02)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
              },
            }}
          >
            <FormControlLabel
              value="Cash On Delivery"
              control={<Radio />}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <Typography sx={{ fontWeight: 500 }}>Cash On Delivery</Typography>
                </Box>
              }
            />
            
            <Collapse in={paymentMethod === 'Cash On Delivery'}>
              <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(25, 118, 210, 0.04)', borderRadius: 2 }}>
                <Typography variant="body2">
                  You will pay in cash when the order is delivered to your shipping address.
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                  Please make sure someone is available at the delivery address to receive the order and make the payment.
                </Typography>
              </Box>
            </Collapse>
          </Paper>
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

export default PaymentMethod;