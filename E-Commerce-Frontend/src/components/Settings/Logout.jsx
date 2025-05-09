// src/components/Settings/Logout.jsx
import React, { useEffect } from 'react';
import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Logout() {
  const navigate = useNavigate();
  useEffect(() => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  }, [navigate]);

  return <Typography variant="h4">You have been logged out.</Typography>;
}
