import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import "./Navbar.css";

const Navbar = () => {
    const navigate = useNavigate();

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography
                    variant="h6"
                    component="div"
                    sx={{ flexGrow: 1, cursor: 'pointer' }}
                    onClick={() => navigate('/')}
                >
                    E-Commerce
                </Typography>
                <Box>
                    <Button
                        color="inherit"
                        onClick={() => navigate('/signin')}
                    >
                        Sign In
                    </Button>
                    <Button
                        color="inherit"
                        onClick={() => navigate('/register')}
                    >
                        Register
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
