import React from 'react';
import {
  Typography,
  Box,
  Grid,
  TextField,
  Alert,
  Divider
} from '@mui/material';

const ShippingInfo = ({ 
  shippingAddress, 
  setShippingAddress, 
  guestInfo, 
  setGuestInfo, 
  isLoggedIn, 
  error 
}) => {
  
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGuestInfoChange = (e) => {
    const { name, value } = e.target;
    setGuestInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Box sx={{ mt: 4 }}>
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {/* Guest information (only for non-logged-in users) */}
      {!isLoggedIn && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Guest Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="firstName"
                label="First Name"
                name="firstName"
                value={guestInfo.firstName}
                onChange={handleGuestInfoChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                value={guestInfo.lastName}
                onChange={handleGuestInfoChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                type="email"
                value={guestInfo.email}
                onChange={handleGuestInfoChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="phone"
                label="Phone Number"
                name="phone"
                value={guestInfo.phone}
                onChange={handleGuestInfoChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>
          </Grid>
          <Divider sx={{ my: 4 }} />
        </Box>
      )}

      {/* Shipping Information - for all users */}
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Shipping Address
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            id="address"
            label="Address"
            name="address"
            value={shippingAddress.address}
            onChange={handleAddressChange}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            id="city"
            label="City"
            name="city"
            value={shippingAddress.city}
            onChange={handleAddressChange}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            id="postalCode"
            label="Postal Code"
            name="postalCode"
            value={shippingAddress.postalCode}
            onChange={handleAddressChange}
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
            id="country"
            label="Country"
            name="country"
            value={shippingAddress.country}
            onChange={handleAddressChange}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ShippingInfo;