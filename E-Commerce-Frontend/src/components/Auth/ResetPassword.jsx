import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
} from '@mui/material';
import LockResetIcon from '@mui/icons-material/LockReset';
import { ENV } from "../../App.jsx";

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [status, setStatus] = useState({ type: '', message: '' });

    useEffect(() => {
        if (!token) {
            navigate('/forgot-password');
        }
    }, [token, navigate]);

    const validatePassword = (password) => {
        if (password.length < 8) {
            return 'Password must be at least 8 characters long';
        }
        return '';
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setStatus({ type: '', message: '' });

        // Validate password
        const passwordError = validatePassword(password);
        if (passwordError) {
            setStatus({ type: 'error', message: passwordError });
            return;
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            setStatus({ type: 'error', message: 'Passwords do not match' });
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${ENV.VITE_BACKEND_URL}/api/auth/reset-password/${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password }),
            });

            const data = await response.json();

            if (!data.error) {
                setStatus({
                    type: 'success',
                    message: 'Password has been reset successfully!'
                });
                setPassword('');
                setConfirmPassword('');
                // Redirect to signin page after 2 seconds
                setTimeout(() => {
                    navigate('/signin');
                }, 2000);
            } else {
                setStatus({
                    type: 'error',
                    message: data.error || 'An error occurred while resetting your password'
                });
            }
        } catch (error) {
            setStatus({
                type: 'error',
                message: 'An error occurred. Please try again later.'
            });
        } finally {
            setLoading(false);
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
                        <LockResetIcon sx={{ fontSize: 45, color: '#fff' }} />
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
                        Reset Password
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
                            name="password"
                            label="New Password"
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    '&:hover fieldset': {
                                        borderColor: 'primary.main',
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
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={loading}
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
                            {loading ? 'Resetting Password...' : 'Reset Password'}
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </Fade>
    );
};

export default ResetPassword;