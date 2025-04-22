import { AppBar, Toolbar, Typography, Button, Box, Container, Badge, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { useCart } from '../../context/CartContext';
import "./Navbar.css";

const Navbar = ({reference}) => {
    const navigate = useNavigate();
    const { cartCount } = useCart();

    return (
        <AppBar
            position="fixed"
            sx={{
                background: 'rgba(171, 210, 250, 0.8)', // ABD2FA with opacity
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 30px rgba(9, 21, 64, 0.1)', // 091540 with opacity
                borderBottom: '1px solid rgba(171, 210, 250, 0.3)',
            }}
            ref={reference}
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
                            background: 'linear-gradient(90deg, #091540, #3D518C)',
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
                        <ShoppingBagIcon sx={{ color: '#3D518C' }} />
                        E-Commerce
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <IconButton
                            color="primary"
                            onClick={() => navigate('/cart')}
                            sx={{
                                transition: 'transform 0.2s ease',
                                '&:hover': {
                                    transform: 'scale(1.1)',
                                }
                            }}
                        >
                            <Badge 
                                badgeContent={cartCount} 
                                color="error"
                                sx={{
                                    '& .MuiBadge-badge': {
                                        animation: cartCount ? 'bounce 0.5s ease-in-out' : 'none',
                                        '@keyframes bounce': {
                                            '0%, 100%': { transform: 'scale(1)' },
                                            '50%': { transform: 'scale(1.3)' },
                                        },
                                    }
                                }}
                            >
                                <ShoppingCartIcon sx={{ color: '#3D518C' }} />
                            </Badge>
                        </IconButton>
                        <Button
                            variant="text"
                            onClick={() => navigate('/signin')}
                            sx={{
                                color: '#3D518C',
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
                                    backgroundColor: '#3D518C',
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
                                background: 'linear-gradient(90deg, #091540, #3D518C)',
                                borderRadius: '50px',
                                px: 3,
                                fontWeight: 600,
                                textTransform: 'none',
                                boxShadow: '0 4px 15px rgba(9, 21, 64, 0.3)',
                                '&:hover': {
                                    background: 'linear-gradient(90deg, #091540, #1B2CC1)',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 6px 20px rgba(9, 21, 64, 0.4)',
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
