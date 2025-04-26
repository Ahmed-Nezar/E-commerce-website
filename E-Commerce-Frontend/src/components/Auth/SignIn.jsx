import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Avatar,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Link,
  Grid,
  Box,
  Typography,
  Container,
  Paper,
  Fade,
  Alert
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token in localStorage regardless of rememberMe
        localStorage.setItem('token', data.token);
        // Force page reload to update all components
        window.location.href = '/';
      } else {
        setError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      setError('An error occurred. Please try again later.');
      console.error('Login error:', error);
    }
  };

  const handleChange = (event) => {
    const { name, value, checked } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rememberMe' ? checked : value
    }));
  };

  return (
    <Fade in timeout={1000}>
      <Container component="main" maxWidth="md" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
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
            boxShadow: '0 8px 32px rgba(9, 21, 64, 0.1)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: 0,
              padding: '2px',
              borderRadius: '24px',
              background: 'linear-gradient(45deg, #091540, #3D518C, #1B2CC1, #7692FF)',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
              animation: 'gradient 4s ease infinite',
            },
            '@keyframes gradient': {
              '0%': {
                backgroundPosition: '0% 50%'
              },
              '50%': {
                backgroundPosition: '100% 50%'
              },
              '100%': {
                backgroundPosition: '0% 50%'
              }
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
              background: 'linear-gradient(135deg, #091540 0%, #3D518C 100%)',
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
              background: 'linear-gradient(45deg, #091540, #3D518C)',
              boxShadow: '0 8px 32px rgba(9, 21, 64, 0.4)',
              transform: 'translateY(-8px)',
              transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
              '&:hover': {
                transform: 'translateY(-12px) scale(1.1)',
                boxShadow: '0 16px 40px rgba(9, 21, 64, 0.6)',
              }
            }}
          >
            <LockOutlinedIcon sx={{ fontSize: 45, color: '#fff' }} />
          </Avatar>
          <Typography
            component="h1"
            variant="h4"
            sx={{
              mb: 4,
              fontWeight: 700,
              background: 'linear-gradient(90deg, #091540, #3D518C)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textAlign: 'center',
              letterSpacing: '0.5px'
            }}
          >
            Welcome Back
          </Typography>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                width: '100%', 
                mb: 3,
                borderRadius: 2
              }}
            >
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%', maxWidth: '800px' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: 'secondary.main',
                  },
                },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: 'secondary.main',
                  },
                },
              }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="rememberMe"
                  color="secondary"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  sx={{ 
                    '&.Mui-checked': { 
                      color: '#9c27b0'
                    }
                  }}
                />
              }
              label="Remember me"
              sx={{ mt: 1 }}
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
                background: 'linear-gradient(90deg, #091540, #3D518C)',
                boxShadow: '0 4px 12px rgba(9, 21, 64, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(90deg, #091540, #1B2CC1)',
                  boxShadow: '0 6px 16px rgba(9, 21, 64, 0.4)',
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}
            >
              Sign In
            </Button>
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate('/forgot-password')}
                sx={{
                  color: '#3D518C',
                  textDecoration: 'none',
                  mx: 1.5,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: '#1B2CC1',
                    transform: 'translateY(-2px)',
                    display: 'inline-block'
                  }
                }}
              >
                Forgot password?
              </Link>
              <Typography
                variant="body2"
                component="span"
                sx={{ mx: 1 }}
              >
                |
              </Typography>
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate('/register')}
                sx={{
                  color: '#3D518C',
                  textDecoration: 'none',
                  mx: 1.5,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: '#1B2CC1',
                    transform: 'translateY(-2px)',
                    display: 'inline-block'
                  }
                }}
              >
                Don't have an account? Sign Up
              </Link>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Fade>
  );
};

export default SignIn;