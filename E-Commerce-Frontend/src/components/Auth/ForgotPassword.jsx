import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Button,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  Container,
  Paper,
  Fade,
  Alert,
} from '@mui/material';
import LockResetIcon from '@mui/icons-material/LockReset';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: '', message: '' });
    
    if (!email) {
      setStatus({ type: 'error', message: 'Please enter your email address' });
      return;
    }

    try {
      // TODO: Implement password reset logic
      console.log('Reset password for:', email);
      setStatus({ 
        type: 'success', 
        message: 'If an account exists with this email, you will receive password reset instructions.' 
      });
    } catch (error) {
      setStatus({ 
        type: 'error', 
        message: 'An error occurred. Please try again later.' 
      });
    }
  };

  return (
    <Fade in timeout={1000}>
      <Container component="main" maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
        <Paper
          elevation={24}
          sx={{
            width: '100%',
            p: { xs: 3, md: 6 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: '24px',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: 0,
              padding: '2px',
              borderRadius: '24px',
              background: 'linear-gradient(45deg, #2196f3, #1976d2, #0d47a1, #2196f3)',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
              animation: 'gradient 4s ease infinite',
            }
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '200px',
              background: 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)',
              opacity: 0.1,
              borderRadius: '24px 24px 100% 100%',
            }}
          />
          <Avatar
            sx={{
              m: 2,
              width: 88,
              height: 88,
              bgcolor: 'transparent',
              background: 'linear-gradient(45deg, #1976d2, #2196f3)',
              boxShadow: '0 8px 32px rgba(33,150,243,0.4)',
              transform: 'translateY(-8px)',
              transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
              '&:hover': {
                transform: 'translateY(-12px) scale(1.1)',
                boxShadow: '0 16px 40px rgba(33,150,243,0.6)',
              }
            }}
          >
            <LockResetIcon sx={{ fontSize: 45, color: '#fff' }} />
          </Avatar>
          <Typography
            component="h1"
            variant="h4"
            sx={{
              mb: 2,
              fontWeight: 700,
              background: 'linear-gradient(90deg, #1976d2, #2196f3)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textAlign: 'center',
              letterSpacing: '0.5px'
            }}
          >
            Reset Password
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mb: 4,
              textAlign: 'center',
              color: 'text.secondary',
              maxWidth: '400px'
            }}
          >
            Enter your email address and we'll send you instructions to reset your password.
          </Typography>

          {status.message && (
            <Alert 
              severity={status.type} 
              sx={{ 
                width: '100%', 
                mb: 3,
                borderRadius: 2
              }}
            >
              {status.message}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 4,
                mb: 3,
                py: 2,
                borderRadius: 3,
                fontSize: '1.1rem',
                fontWeight: 600,
                textTransform: 'none',
                background: 'linear-gradient(90deg, #1976d2, #2196f3)',
                boxShadow: '0 4px 12px rgba(33,150,243,0.3)',
                '&:hover': {
                  background: 'linear-gradient(90deg, #1565c0, #1976d2)',
                  boxShadow: '0 6px 16px rgba(33,150,243,0.4)',
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Send Reset Instructions
            </Button>
            <Grid container justifyContent="center">
              <Grid item>
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => navigate('/signin')}
                  sx={{
                    color: 'primary.main',
                    textDecoration: 'none',
                    border: 'none',
                    background: 'none',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      color: '#1565c0',
                      transform: 'translateX(4px)',
                      display: 'inline-block'
                    }
                  }}
                >
                  Back to Sign In
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </Fade>
  );
};

export default ForgotPassword;