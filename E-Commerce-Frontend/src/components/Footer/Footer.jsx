import { Container, Grid, Typography, IconButton, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import {useLocation} from "react-router-dom";

const Footer = () => {
    const location = useLocation();
    return (
        <Box
            component="footer"
            sx={{
                background: 'linear-gradient(135deg, #091540 0%, #2C3E7B 100%)',
                color: 'white',
                py: 6,
                mt: location.pathname.replaceAll("/", "") === "" || location.pathname.includes("/me") ? 0 : 12,
                position: 'relative',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '100%',
                    backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                    opacity: 0.3
                }
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={4} sx={{justifyContent: "space-between", '@media (max-width: 922px)': {justifyContent: "center"}}}>
                    <Grid item xs={12} md={4}>
                        <Box sx={{display: 'flex', alignItems: 'center', gap: 1, mb: 2}}>
                            <ShoppingBagIcon sx={{fontSize: 30}}/>
                            <Typography variant="h6" sx={{fontWeight: 700}}>
                                E-Commerce
                            </Typography>
                        </Box>
                        <Typography variant="body2" sx={{opacity: 0.8, mb: 2}}>
                            Your one-stop shop for all PC components.
                            Build your dream PC with premium parts.
                        </Typography>
                        <Box sx={{display: 'flex', gap: 1, justifyContent: 'center'}}>
                            <IconButton
                                sx={{
                                    color: 'white',
                                    '&:hover': {
                                        background: 'rgba(255,255,255,0.1)',
                                        transform: 'translateY(-3px)'
                                    },
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <GitHubIcon/>
                            </IconButton>
                            <IconButton
                                sx={{
                                    color: 'white',
                                    '&:hover': {
                                        background: 'rgba(255,255,255,0.1)',
                                        transform: 'translateY(-3px)'
                                    },
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <LinkedInIcon/>
                            </IconButton>
                            <IconButton
                                sx={{
                                    color: 'white',
                                    '&:hover': {
                                        background: 'rgba(255,255,255,0.1)',
                                        transform: 'translateY(-3px)'
                                    },
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <TwitterIcon/>
                            </IconButton>
                        </Box>
                    </Grid>
                    <Grid container>
                        <Grid item xs={12} md={4}>
                            <Typography variant="h6" sx={{mb: 2, fontWeight: 600}}>Quick Links</Typography>
                            {[
                                { text: 'Home', path: '/', onClick: () => window.scrollTo(0, 0) },
                                { text: 'Products', path: '/products' }
                            ].map((item) => (
                                <Link
                                    key={item.text}
                                    to={item.path}
                                    style={{
                                        color: 'white',
                                        opacity: 0.8,
                                        display: 'block',
                                        marginBottom: '8px',
                                        textDecoration: 'none',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onClick={item.onClick}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.opacity = '1';
                                        e.currentTarget.style.transform = 'translateX(5px)';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.opacity = '0.8';
                                        e.currentTarget.style.transform = 'translateX(0)';
                                    }}
                                >
                                    {item.text}
                                </Link>
                            ))}
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography variant="h6" sx={{mb: 2, fontWeight: 600}}>Contact Us</Typography>
                            <Typography variant="body2" sx={{opacity: 0.8, mb: 1}}>
                                1234 Tech Street
                            </Typography>
                            <Typography variant="body2" sx={{opacity: 0.8, mb: 1}}>
                                Silicon Valley, CA 94043
                            </Typography>
                            <Typography variant="body2" sx={{opacity: 0.8, mb: 1}}>
                                support@ecommerce.com
                            </Typography>
                            <Typography variant="body2" sx={{opacity: 0.8}}>
                                +1 (555) 123-4567
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Box
                    sx={{
                        mt: 6,
                        pt: 3,
                        borderTop: '1px solid rgba(255,255,255,0.1)',
                        textAlign: 'center'
                    }}
                >
                    <Typography variant="body2" sx={{opacity: 0.8}}>
                        © {new Date().getFullYear()} E-Commerce. All rights reserved.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
