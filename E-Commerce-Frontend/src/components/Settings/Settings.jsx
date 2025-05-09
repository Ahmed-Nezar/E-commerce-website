import React, {useEffect, useState} from 'react';
import {Outlet, NavLink, useNavigate} from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';
import {
    Box,
    CssBaseline,
    Toolbar,
    Typography,
    Divider,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    IconButton,
    alpha, useMediaQuery
} from '@mui/material';

import {
  Person        as PersonIcon,
  ShoppingCart  as OrdersIcon,
  Logout        as LogoutIcon,
  ChevronLeft   as ChevronLeftIcon,
  ChevronRight  as ChevronRightIcon,
} from '@mui/icons-material';
import {useCart} from "../../context/CartContext.jsx";

const drawerWidth = 240;

// Mixins for open/closed
const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing:   theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});
const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing:   theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

// Styled nav wrapper
const Sidebar = styled(Box, { shouldForwardProp: prop => prop !== 'open' })(
    ({ theme, open }) => ({
        width:           open ? drawerWidth : `calc(${theme.spacing(7)} + 1px)`,
        flexShrink:      0,
        whiteSpace:      'nowrap',
        boxSizing:       'border-box',
        ...(open
                ? { ...openedMixin(theme), '& .MuiDrawer-paper': openedMixin(theme) }
                : { ...closedMixin(theme), '& .MuiDrawer-paper': closedMixin(theme) }
        ),
    })
);

const DrawerHeader = styled(Toolbar)(({ theme }) => ({
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'space-between',
    padding:        theme.spacing(0, 1),
    ...theme.mixins.toolbar,
}));

const navItems = [
  { label: 'Profile',        to: '/me/profile',   icon: <PersonIcon /> },
  { label: 'Orders',         to: '/me/orders',    icon: <OrdersIcon /> },
  { label: 'Logout',         to: '/me/logout',             icon: <LogoutIcon /> },
];

const handleLogout = (setUser, navigate) => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
};

export default function SettingsLayout() {
    const theme = useTheme();
    const [open, setOpen] = useState(true);
    const isSmall = useMediaQuery('(max-width:840px)');
    useEffect(() => {
        if (isSmall) {
            setOpen(false);
        } else {
            setOpen(true);
        }
    }, [isSmall]);
    const navigate = useNavigate();
    const { setUser } = useCart();

    return (
        <Box sx={{display: 'flex', minHeight: '100vh'}}>
            <CssBaseline/>

            {/* Sidebar */}
            <Sidebar component="nav" open={open}>
                <DrawerHeader>
                    <Typography variant="h6" noWrap>
                        Settings
                    </Typography>
                    <IconButton onClick={() => setOpen(o => !o)}>
                        {open ? <ChevronLeftIcon/> : <ChevronRightIcon/>}
                    </IconButton>
                </DrawerHeader>
                <Divider/>

                <List>
                    {navItems.map(({label, to, icon}) => (
                        <ListItem key={to} disablePadding sx={{display: 'block'}}>
                            <ListItemButton
                                component={label === 'Logout' ? 'button' : NavLink}
                                {...(label === 'Logout' ?
                                    {onClick: (() => handleLogout(setUser, navigate))} : {to})}
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                    color: 'inherit',
                                    '&.active': {
                                        backgroundColor: alpha(theme.palette.text.primary, 0.1),
                                    },
                                    '&:hover': {
                                        backgroundColor: alpha(theme.palette.text.primary, 0.05),
                                    },
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                        color: 'inherit',
                                    }}
                                >
                                    {icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={label}
                                    primaryTypographyProps={{color: 'inherit'}}
                                    sx={{opacity: open ? 1 : 0}}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Sidebar>

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    background: 'linear-gradient(to right, #7AA1ED, #A1C4FD)',
                }}
            >
                {/*<Toolbar />*/}
                <Outlet />
            </Box>
        </Box>
    );
}

