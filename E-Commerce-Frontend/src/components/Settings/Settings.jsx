// src/components/Settings/SettingsLayout.jsx
import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Person        as PersonIcon,
  Payment       as PaymentIcon,
  ShoppingCart  as OrdersIcon,
  Favorite      as WishlistIcon,
  Logout        as LogoutIcon,
} from '@mui/icons-material';

const navItems = [
  { label: 'Profile',        to: '/settings/profile',   icon: <PersonIcon /> },
  { label: 'Payment Methods',to: '/settings/payments',  icon: <PaymentIcon /> },
  { label: 'Orders',         to: '/settings/orders',    icon: <OrdersIcon /> },
  { label: 'Wishlist',       to: '/settings/wishlist',  icon: <WishlistIcon /> },
  { label: 'Logout',         to: '/logout',             icon: <LogoutIcon /> },
];

export default function SettingsLayout() {
  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Box
        component="nav"
        sx={{
          width: 240,
          flexShrink: 0,
          backgroundColor: '#A1C4FD',
          color: theme.palette.text.primary,
          borderRight: 1,
          borderColor: alpha(theme.palette.text.primary, 0.3),
        }}
      >
        <Toolbar sx={{ justifyContent: 'center' }}>
          <Typography variant="h6" color="inherit">
            Settings
          </Typography>
        </Toolbar>
        <Divider sx={{ borderColor: alpha(theme.palette.text.primary, 0.6) }} />
        <List>
          {navItems.map(({ label, to, icon }) => (
            <ListItemButton
              key={to}
              component={NavLink}
              to={to}
              exact
              activeClassName="active"
              sx={{
                color: 'inherit',
                '&.active': {
                  backgroundColor: alpha(theme.palette.text.primary, 0.1),
                },
                '&:hover': {
                  backgroundColor: alpha(theme.palette.text.primary, 0.05),
                },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit' }}>
                {icon}
              </ListItemIcon>
              <ListItemText
                primary={label}
                primaryTypographyProps={{ color: 'inherit' }}
              />
            </ListItemButton>
          ))}
        </List>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          background: 'linear-gradient(to right, #7AA1ED, #A1C4FD)',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
