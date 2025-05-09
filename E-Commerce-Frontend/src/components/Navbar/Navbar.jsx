import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Container,
    Badge,
    IconButton,
    Avatar
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { useCart } from '../../context/CartContext';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import "./Navbar.css";
import { jwtDecode } from 'jwt-decode';
import SearchBar from "../SearchBar/SearchBar.jsx";
import {RiLogoutBoxLine, RiMenuLine} from "react-icons/ri";
import { IoSettingsOutline } from "react-icons/io5";
import Drawer from "../Drawer/Drawer.jsx";
import { useMediaQuery } from '@mui/material';

const Navbar = ({reference}) => {
    const [refreshToken] = useState(true);
    const navigate = useNavigate();
    const { cartCount, user, setUser, showMessage } = useCart();
    const location = useLocation();
    const isDesktop = useMediaQuery('(min-width:850px)');
    const isMobile = useMediaQuery('(max-width:600px)');
    const [menuOpen, setmenuOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                // Decode the JWT token
                const payload = jwtDecode(token);
                //check token expiration
                const currentTime = Date.now() / 1000;
                if (payload.exp < currentTime) {
                    handleLogout();
                    showMessage("Session Expired, Please Login Again", true);
                    return;
                }
                !user && setUser(payload);
            } catch (error) {
                handleLogout();
                showMessage("Session Expired, Please Login Again", true);
            }
        } else if (user) {
            handleLogout()
        }
    }, [location.pathname, refreshToken]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/');
    };

    const userProfileBox = (
        <>
        {user ?
            (
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    background: 'linear-gradient(90deg, #091540, #3D518C)',
                    padding: '4px',
                    paddingRight: '16px',
                    borderRadius: '50px',
                    boxShadow: '0 4px 12px rgba(9, 21, 64, 0.2)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 16px rgba(9, 21, 64, 0.3)',
                        background: 'linear-gradient(90deg, #091540, #1B2CC1)',
                    }
                }}
                >
                    <Avatar
                        src={user.profilePic}
                        alt={user.name}
                        sx={{
                            width: 40,
                            height: 40,
                            border: '2px solid #fff'
                        }}
                    />
                    <Typography
                        sx={{
                            color: '#fff',
                            fontWeight: 600,
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                            maxWidth: "100px",
                        }}
                    >
                        {user.name}
                    </Typography>
                </Box>
            ): (<></>)}
        </>
    );

    const drawerContent = (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {user ? (
                <>
                    {userProfileBox}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-start' }}>
                        {user?.isAdmin && (
                            <Button startIcon={<DashboardIcon />} onClick={() => {
                                navigate('/admin')
                                setmenuOpen(false)
                            }} style={{color:'#3D518C', width:'100%', justifyContent:'left'}}>
                                Admin
                            </Button>
                        )}
                        <Button startIcon={<IoSettingsOutline />} onClick={() => {
                            navigate('/me/profile')
                            scroll(0,0)
                            setmenuOpen(false)
                        }} style={{color:'#3D518C', width:'100%', justifyContent:'left'}}>
                            Settings
                        </Button>
                        <Button startIcon={<RiLogoutBoxLine />} onClick={() => {
                            handleLogout()
                            setmenuOpen(false)
                        }} style={{color:'#3D518C', width:'100%', justifyContent:'left'}}>
                            Logout
                        </Button>
                    </Box>
                </>
            ) : (
                <>
                    <Button onClick={() => {
                        navigate('/signin')
                        setmenuOpen(false)
                    }} style={{color:'#3D518C'}}>Sign In</Button>
                    <Button onClick={() => {
                        navigate('/register')
                        setmenuOpen(false)
                    }} style={{color:'#3D518C'}}>Register</Button>
                </>
            )}
        </Box>
    );

    return (
        <AppBar
            position="fixed"
            sx={{
                background: 'rgba(171, 210, 250, 0.65)',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 8px 32px rgba(9, 21, 64, 0.12)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.4)',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                    background: 'rgba(171, 210, 250, 0.75)',
                    boxShadow: '0 8px 32px rgba(9, 21, 64, 0.18)',
                }
            }}
            ref={reference}
        >
            <Container maxWidth="xl" className="h-100">
                <Toolbar sx={{ justifyContent: 'space-between', py: 1, height: "100%" }}>
                    <Typography
                        variant="h5"
                        component="div"
                        onClick={() => {
                            scroll(0,0)
                            navigate('/')
                        }}
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
                    {!isMobile ? <SearchBar/> : null }
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        {isMobile ? <SearchBar/> : null }
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

                        {isDesktop && (
                            <>
                                {user?.isAdmin && (
                                    <IconButton
                                        color="primary"
                                        onClick={() => navigate('/admin')}
                                        sx={{
                                            transition: 'transform 0.2s ease',
                                            '&:hover': {
                                                transform: 'scale(1.1)',
                                            }
                                        }}
                                    >
                                        <DashboardIcon sx={{ color: '#3D518C' }} />
                                    </IconButton>
                                )}
                                {user ? (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }} onClick={() => setmenuOpen(true)}>
                                        {userProfileBox}
                                    </Box>
                                ) : (
                                    <>
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
                                    </>
                                )}
                            </>
                        )}
                        <Drawer
                            triggerButton={<RiMenuLine size={24}  color='#3D518C'/>}
                            anchor="right"
                            breakpoint={850}
                            defaultView={false}
                            menuOpen={menuOpen}
                            setMenuOpen={setmenuOpen}
                        >
                            {drawerContent}
                        </Drawer>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Navbar;
