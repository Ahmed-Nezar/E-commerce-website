import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import "./Navbar.css";

const Navbar = () => {
    const navigate = useNavigate();

    return (
        <AppBar
            position="fixed"
            sx={{
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
            }}
        >
            <Container maxWidth="xl">
                <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
                    <Typography
                        variant="h5"
                        component="div"
                        onClick={() => navigate('/')}
                        sx={{
                            cursor: 'pointer',
                            fontWeight: 700,
                            background: 'linear-gradient(90deg, #1976d2, #2196f3)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            '&:hover': {
                                transform: 'scale(1.05)',
                            },
                            transition: 'transform 0.3s ease'
                        }}
                    >
                        <ShoppingCartIcon sx={{ color: '#1976d2' }} />
                        E-Commerce
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            variant="text"
                            onClick={() => navigate('/signin')}
                            sx={{
                                color: '#1976d2',
                                fontWeight: 600,
                                position: 'relative',
                                overflow: 'hidden',
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '2px',
                                    backgroundColor: '#1976d2',
                                    transform: 'scaleX(0)',
                                    transformOrigin: 'right',
                                    transition: 'transform 0.3s ease',
                                },
                                '&:hover::after': {
                                    transform: 'scaleX(1)',
                                    transformOrigin: 'left',
                                },
                            }}
                        >
                            Sign In
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() => navigate('/register')}
                            sx={{
                                background: 'linear-gradient(90deg, #1976d2, #2196f3)',
                                borderRadius: '50px',
                                px: 3,
                                fontWeight: 600,
                                textTransform: 'none',
                                boxShadow: '0 4px 15px rgba(33, 150, 243, 0.3)',
                                '&:hover': {
                                    background: 'linear-gradient(90deg, #1565c0, #1976d2)',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 6px 20px rgba(33, 150, 243, 0.4)',
                                },
                                transition: 'all 0.3s ease',
                            }}
                        >
                            Register
                        </Button>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Navbar;
