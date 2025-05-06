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
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { ENV } from '../../App.jsx';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    isAdmin: false
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (!formData.gender) {
      setError('Please select your gender');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${ENV.VITE_BACKEND_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          gender: formData.gender,
          isAdmin: formData.isAdmin
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        navigate('/signin');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
            <PersonAddIcon sx={{ fontSize: 45, color: '#fff' }} />
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
            Create Account
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%', maxWidth: '800px' }}>
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
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="name"
                  label="Full Name"
                  name="name"
                  autoComplete="name"
                  autoFocus
                  value={formData.name}
                  onChange={handleChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl component="fieldset" sx={{ width: '100%' }}>
                  <FormLabel 
                    component="legend" 
                    sx={{ 
                      mb: 1,
                      fontWeight: 500,
                      color: '#091540',
                      '&.Mui-focused': {
                        color: '#091540'
                      }
                    }}
                  >
                    Gender
                  </FormLabel>
                  <RadioGroup
                    row
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <FormControlLabel 
                      value="Male" 
                      control={<Radio />} 
                      label="Male"
                      sx={{ 
                        '& .MuiRadio-root': {
                          color: '#3D518C',
                          '&.Mui-checked': {
                            color: '#1B2CC1'
                          }
                        }
                      }} 
                    />
                    <FormControlLabel 
                      value="Female" 
                      control={<Radio />} 
                      label="Female"
                      sx={{ 
                        '& .MuiRadio-root': {
                          color: '#3D518C',
                          '&.Mui-checked': {
                            color: '#1B2CC1'
                          }
                        }
                      }} 
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
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
                opacity: loading ? 0.7 : 1,
                '&:hover': {
                  background: 'linear-gradient(90deg, #091540, #1B2CC1)',
                  boxShadow: '0 6px 16px rgba(9, 21, 64, 0.4)',
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              {loading ? 'Creating Account...' : 'Create Your Account'}
            </Button>
            <Grid container justifyContent="center">
              <Grid item>
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => navigate('/signin')}
                  sx={{
                    color: '#3D518C',
                    textDecoration: 'none',
                    border: 'none',
                    background: 'none',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      color: '#1B2CC1',
                      transform: 'translateX(4px)',
                      display: 'inline-block'
                    }
                  }}
                >
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </Fade>
  );
};

export default Register;