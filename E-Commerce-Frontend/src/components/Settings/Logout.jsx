// src/components/Settings/Logout.jsx
import React, { useEffect } from 'react';
import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Logout() {
  const navigate = useNavigate();
  useEffect(() => {
    // TODO: clear auth, tokens, etc.
    console.log('Logging out…');
    navigate('/'); // back to home or login
  }, [navigate]);

  return <Typography variant="h4">You have been logged out.</Typography>;
}
