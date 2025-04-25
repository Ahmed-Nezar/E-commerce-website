import React, { useState } from 'react';
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

const PaymentMethod = ({ 
  paymentMethod, 
  setPaymentMethod, 
  creditCardInfo, 
  setCreditCardInfo, 
  paypalEmail, 
  setPaypalEmail, 
  error 
}) => {
  
  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleCreditCardChange = (e) => {
    const { name, value } = e.target;
    setCreditCardInfo((prev) => ({
      ...prev,
      [name]: value,
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
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      <FormControl component="fieldset" sx={{ width: '100%' }}>
        <FormLabel component="legend" sx={{ mb: 2, fontWeight: 600, fontSize: '1.1rem' }}>
          Select Payment Method
        </FormLabel>
        <RadioGroup
          aria-label="payment-method"
          name="payment-method"
          value={paymentMethod}
          onChange={handlePaymentMethodChange}
        >
          {/* Credit Card Option */}
          <Paper
            elevation={0}
            sx={{
              mb: 2,
              p: 2,
              borderRadius: 2,
              border: '1px solid',
              borderColor: paymentMethod === 'Credit Card' ? 'primary.main' : 'divider',
              transition: 'all 0.3s ease',
              '&:hover': { borderColor: 'primary.main' },
            }}
          >
            <FormControlLabel
              value="Credit Card"
              control={<Radio />}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <Typography sx={{ fontWeight: 500 }}>Credit Card</Typography>
                  <Box component="span" sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
                    <img src="https://cdn.visa.com/v2/assets/images/logos/visa/logo.png" alt="Visa" width="40" height="25" style={{ objectFit: 'contain' }} />
                    <img src="https://www.mastercard.com/content/dam/public/brandcenter/assets/images/mastercard-logo-symbol.svg" alt="Mastercard" width="40" height="25" style={{ objectFit: 'contain' }} />
                    <img src="https://www.americanexpress.com/content/dam/amex/us/merchant/supplies-uplift/Card-Art/images/AmericanExpress-Blue.png" alt="American Express" width="40" height="25" style={{ objectFit: 'contain' }} />
                  </Box>
                </Box>
              }
            />
            
            <Collapse in={paymentMethod === 'Credit Card'}>
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
                      onChange={(e) => {
                        const formattedValue = formatCardNumber(e.target.value);
                        handleCreditCardChange({
                          target: { name: 'cardNumber', value: formattedValue }
                        });
                      }}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <CreditCardIcon color="action" />
                            </InputAdornment>
                          ),
                          maxLength: 19
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
                      onChange={(e) => {
                        const formattedValue = formatExpiryDate(e.target.value);
                        handleCreditCardChange({
                          target: { name: 'expiryDate', value: formattedValue }
                        });
                      }}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <CalendarTodayIcon color="action" />
                            </InputAdornment>
                          ),
                          maxLength: 5
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
                      onChange={(e) => {
                        // Only allow numbers
                        if (e.target.value.match(/^\d*$/)) {
                          handleCreditCardChange(e);
                        }
                      }}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockIcon color="action" />
                            </InputAdornment>
                          ),
                          maxLength: 4
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
              p: 2,
              borderRadius: 2,
              border: '1px solid',
              borderColor: paymentMethod === 'PayPal' ? 'primary.main' : 'divider',
              transition: 'all 0.3s ease',
              '&:hover': { borderColor: 'primary.main' },
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
              p: 2,
              borderRadius: 2,
              border: '1px solid',
              borderColor: paymentMethod === 'Cash On Delivery' ? 'primary.main' : 'divider',
              transition: 'all 0.3s ease',
              '&:hover': { borderColor: 'primary.main' },
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