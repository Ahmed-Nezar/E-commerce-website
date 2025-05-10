import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Avatar,
    Button,
    TextField,
    Box,
    Typography,
    Container,
    Paper,
    Fade,
    Alert,
    IconButton
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ENV } from "../../App.jsx";

const ChangePassword = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const validatePassword = (password) => {
        if (password.length < 8) {
            return 'Password must be at least 8 characters long';
        }
        return '';
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setSuccess('');

        // Validate new password
        const passwordError = validatePassword(formData.newPassword);
        if (passwordError) {
            setError(passwordError);
            return;
        }

        // Validate passwords match
        if (formData.newPassword !== formData.confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${ENV.VITE_BACKEND_URL}/api/auth/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`
                },
                body: JSON.stringify({
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword
                }),
            });

            const data = await response.json();

            if (!data.error) {
                setSuccess('Password changed successfully!');
                // Clear form
                setFormData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
                // Redirect to profile page after 2 seconds
                setTimeout(() => {
                    navigate('/me/profile');
                }, 2000);
            } else {
                setError(data.error);
            }
        } catch (error) {
            setError('An error occurred. Please try again later.');
            console.error('Change password error:', error);
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
        <Fade in timeout={800}>
            <Container component="main" maxWidth="sm" sx={{ minHeight: '85vh', display: 'flex', alignItems: 'center' }}>
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
                        }
                    }}
                >
                    <IconButton
                        onClick={() => navigate('/me/profile')}
                        sx={{
                            position: 'absolute',
                            top: 20,
                            left: 20,
                            color: '#091540',
                            zIndex: 1,
                            background: 'rgba(255, 255, 255, 0.8)',
                            '&:hover': {
                                background: 'rgba(255, 255, 255, 1)',
                            },
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        <ArrowBackIcon />
                    </IconButton>

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
                        Change Password
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

                    {success && (
                        <Alert 
                            severity="success" 
                            sx={{ 
                                width: '100%', 
                                mb: 3,
                                borderRadius: 2
                            }}
                        >
                            {success}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="currentPassword"
                            label="Current Password"
                            type="password"
                            id="currentPassword"
                            value={formData.currentPassword}
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
                            name="newPassword"
                            label="New Password"
                            type="password"
                            id="newPassword"
                            value={formData.newPassword}
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
                            name="confirmPassword"
                            label="Confirm New Password"
                            type="password"
                            id="confirmPassword"
                            value={formData.confirmPassword}
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
                            {loading ? 'Changing Password...' : 'Change Password'}
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </Fade>
    );
};

export default ChangePassword;