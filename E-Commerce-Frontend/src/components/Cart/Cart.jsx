import { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Paper,
    Grid,
    Card,
    CardContent,
    IconButton,
    Button,
    Divider,
    TextField,
    Fade,
    Slide,
    Badge,
    useTheme,
    Zoom,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { Stack } from '@mui/system';
import Loader from '../Loader/Loader.jsx';
import {ENV} from "../../App.jsx";

const Cart = () => {
    const [removedItemId, setRemovedItemId] = useState(null);
    const [showAddedAnimation, setShowAddedAnimation] = useState(false);
    const [loading, setLoading] = useState(true);
    const [updatingItem, setUpdatingItem] = useState(null);
    const [removingItem, setRemovingItem] = useState(null);
    const [discountInfo, setDiscountInfo] = useState(null);
    const [couponCode, setCouponCode] = useState('');
    const navigate = useNavigate();
    const theme = useTheme();
    const {
        cartItems,
        removeFromCart,
        updateQuantity,
        total,
        setTotal,
        subTotal,
        setSubTotal,
        cartCount,
        shippingFees,
        setShippingFees,
        setDiscount,
        shippingAddress,
        paymentMethod,
        showMessage
    } = useCart();


    const handleUpdateQuantity = async (productId, newQuantity) => {
        if (newQuantity <= 0) {
            handleRemoveItem(productId);
            return;
        }
        setUpdatingItem(productId);
        try {
            await updateQuantity(productId, newQuantity);
            setShowAddedAnimation(true);
            setTimeout(() => setShowAddedAnimation(false), 1500);
        } finally {
            setUpdatingItem(null);
        }
    };

    const handleRemoveItem = async (productId) => {
        setRemovingItem(productId);
        setRemovedItemId(productId);
        try {
            await new Promise(resolve => setTimeout(resolve, 300)); // Animation delay
            await removeFromCart(productId);
        } finally {
            setRemovingItem(null);
            setRemovedItemId(null);
        }
    };

    const handleApplyCoupon = async () => {
        try {
            const response = await fetch(`${ENV.VITE_BACKEND_URL}/api/coupons/apply`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ code: couponCode, totalPrice: total }),
            });
            console.log(response);
            const res = await response.json();
            if (res.error) throw new Error(res.error || 'Invalid coupon');
            setDiscountInfo(res.data);
        } catch (err) {
            setDiscountInfo(null);
            console.log(err);
        }
    };

    const handleCheckout = () => {
        // Prepare order data based on schema
        const orderData = {
            orderItems: cartItems.map(item => ({
                product: item.product,
                quantity: item.quantity,
                price: item.price
            })),
            shippingAddress,
            paymentMethod,
            totalPrice: total
        };
        // setTotal(parseFloat(subTotal.toFixed(2)) +
        //     parseFloat(shippingFees) +
        //     parseFloat(subTotal.toFixed(2) * 0.14) -
        //     (discountInfo ? parseFloat(discountInfo?.discountAmount).toFixed(2) : 0))
        setDiscount(parseFloat(discountInfo?.discountAmount).toFixed(2))
        setShippingFees(shippingFees);
        // setSubTotal(cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0));
        navigate('/checkout');
        // TODO: Implement checkout logic with backend
    };

    useEffect(() => {
        // Simulate loading state for cart data initialization
        setTimeout(() => setLoading(false), 800);
        const fetchUserLocation = async () => {
            try {
                const response = await fetch(`${ENV.VITE_BACKEND_URL}/api/orders/user-distance`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `${localStorage.getItem('token')}`
                    }
                });
                const data = await response.json();
                if (!data.error) {
                    if (cartItems.length === 0) {
                        setShippingFees(0);
                        return;
                    }
                    const distance = data?.data?.distance.toFixed(2);
                    if (distance) {
                        // if distanc is less than 5km, set shipping fees to 0
                        if (distance <= 5) {
                            setShippingFees(0);
                        } else {
                            setShippingFees(((distance / 10)-1) * 5);
                        }
                    } else {
                        setShippingFees(0);
                    }
                }
            } catch (error) {
                console.error('Error fetching user location:', error);
                showMessage('Error calculating shipping fees', true);
            }
        }
        fetchUserLocation();
    }, [cartItems]);

    useEffect(() => {
        setTotal(parseFloat(
            parseFloat(subTotal.toFixed(2)) +
            parseFloat(shippingFees) +
            parseFloat(subTotal.toFixed(2) * 0.14) -
            (discountInfo ? parseFloat(discountInfo?.discountAmount).toFixed(2) : 0)).toFixed(2));
    }, [subTotal,discountInfo,shippingFees]);


    if (loading) {
        return <Loader/>;
    }

    return (
        <Fade in timeout={800}>
            <Container maxWidth="xl" sx={{py: 12, minHeight: '100vh'}}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 2,
                        mb: 6,
                        position: 'relative'
                    }}
                >
                    <Zoom in={showAddedAnimation}
                          style={{
                              position: 'absolute',
                              right: -20,
                              top: -20,
                          }}
                    >
                        <Paper
                            sx={{
                                p: 1,
                                bgcolor: theme.palette.success.main,
                                color: 'white',
                                borderRadius: 2,
                                boxShadow: theme.shadows[4],
                            }}
                        >
                            <Typography variant="body2">Updated!</Typography>
                        </Paper>
                    </Zoom>
                    <Badge
                        badgeContent={cartCount}
                        color="primary"
                        sx={{
                            transform: 'scale(1.2)',
                            '& .MuiBadge-badge': {
                                animation: cartCount ? 'bounce 0.5s ease-in-out' : 'none',
                                '@keyframes bounce': {
                                    '0%, 100%': {transform: 'scale(1)'},
                                    '50%': {transform: 'scale(1.3)'},
                                },
                            }
                        }}
                    >
                        <ShoppingCartIcon sx={{fontSize: 40, color: '#3D518C'}}/>
                    </Badge>
                    <Typography
                        variant="h3"
                        component="h1"
                        sx={{
                            fontWeight: 700,
                            background: 'linear-gradient(45deg, #091540, #3D518C)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            textAlign: 'center',
                            letterSpacing: '0.5px'
                        }}
                    >
                        Your Cart
                    </Typography>
                </Box>

                <Grid container spacing={4} sx={{
                    flexWrap: 'nowrap !important',
                    width: '100%',
                    '@media (max-width: 925px)': {
                        flexWrap: 'wrap !important',
                    }
                }}>
                    <Grid item xs={12} md={8} sx={{
                        flexWrap: 'nowrap !important',
                        width: '100%'
                    }}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                borderRadius: 4,
                                background: 'rgba(255, 255, 255, 0.9)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                            }}
                        >
                            {cartItems.length === 0 ? (
                                <Box
                                    sx={{
                                        textAlign: 'center',
                                        py: 8,
                                        px: 2,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: 3
                                    }}
                                >
                                    <LocalMallIcon
                                        sx={{
                                            fontSize: 120,
                                            color: '#bdbdbd',
                                            animation: 'float 3s ease-in-out infinite',
                                            '@keyframes float': {
                                                '0%, 100%': {transform: 'translateY(0)'},
                                                '50%': {transform: 'translateY(-10px)'},
                                            }
                                        }}
                                    />
                                    <Typography
                                        variant="h5"
                                        color="text.secondary"
                                        sx={{
                                            fontWeight: 600,
                                            background: 'linear-gradient(45deg, #091540, #3D518C)',
                                            backgroundClip: 'text',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                        }}
                                    >
                                        Your cart is feeling a bit lonely
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        color="text.secondary"
                                        sx={{maxWidth: 400, mb: 2}}
                                    >
                                        Why not explore our collection and find something special?
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        onClick={() => navigate('/products')}
                                        sx={{
                                            px: 4,
                                            py: 1.5,
                                            borderRadius: 2,
                                            background: 'linear-gradient(45deg, #091540, #3D518C)',
                                            boxShadow: '0 4px 15px rgba(9, 21, 64, 0.3)',
                                            '&:hover': {
                                                background: 'linear-gradient(45deg, #091540, #1B2CC1)',
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 6px 20px rgba(9, 21, 64, 0.4)',
                                            },
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        Discover Products
                                    </Button>
                                </Box>
                            ) : (
                                cartItems.map((item) => (
                                    <Slide
                                        direction="right"
                                        in={removedItemId !== item.product}
                                        timeout={300}
                                        key={item.product}
                                    >
                                        <Card
                                            sx={{
                                                mb: 2,
                                                display: 'flex',
                                                borderRadius: 3,
                                                overflow: 'overlay',
                                                boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-4px)',
                                                    boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                                                },
                                            }}
                                        >
                                            <Box sx={{display: 'flex', alignItems: 'center', gap: 2, paddingLeft: "20px"}}>
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    style={{
                                                        width: '100px',
                                                        height: '100px',
                                                        objectFit: 'cover',
                                                        borderRadius: '8px',
                                                    }}
                                                />
                                            </Box>
                                            <CardContent sx={{
                                                flex: 1,
                                                display: 'flex',
                                                flexDirection: { xs: 'column', sm: 'row' },
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                p: { xs: 2, sm: 3 }
                                            }}>
                                                <Stack spacing={1} sx={{ textAlign: { xs: 'center', sm: 'left' }}}>
                                                    <Typography variant="h6" component="div" fontWeight="600">
                                                        {item.name}
                                                    </Typography>
                                                    <Typography
                                                        variant="h6"
                                                        sx={{
                                                            fontWeight: '700',
                                                            background: 'linear-gradient(45deg, #091540, #3D518C)',
                                                            backgroundClip: 'text',
                                                            WebkitBackgroundClip: 'text',
                                                            WebkitTextFillColor: 'transparent',
                                                        }}
                                                    >
                                                        ${item.price.toFixed(2)}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Subtotal: ${item.price.toFixed(2) * item.quantity}
                                                    </Typography>
                                                </Stack>
                                                <Box sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: { xs: 1, sm: 2 },
                                                    mt: { xs: 2, sm: 0 },
                                                }}>
                                                    <IconButton
                                                        onClick={() => handleUpdateQuantity(item.product, item.quantity - 1)}
                                                        disabled={updatingItem === item.product}
                                                        sx={{
                                                            p: { xs: 0.5, sm: 1 },
                                                            '& svg': { fontSize: { xs: '1rem', sm: '1.25rem' }},
                                                            bgcolor: 'rgba(9, 21, 64, 0.1)',
                                                            '&:hover': {
                                                                bgcolor: 'rgba(9, 21, 64, 0.2)',
                                                            },
                                                            opacity: updatingItem === item.product ? 0.5 : 1,
                                                        }}
                                                    >
                                                        <RemoveIcon/>
                                                    </IconButton>
                                                    <TextField
                                                        value={item.quantity}
                                                        size="small"
                                                        InputProps={{
                                                            readOnly: true,
                                                            sx: {
                                                                width: { xs: '40px', sm: '50px' },
                                                                height: { xs: '30px', sm: '40px' },
                                                                textAlign: 'center',
                                                                '& input': {
                                                                    textAlign: 'center',
                                                                },
                                                            },
                                                        }}
                                                    />
                                                    <IconButton
                                                        onClick={() => handleUpdateQuantity(item.product, item.quantity + 1)}
                                                        disabled={updatingItem === item.product}
                                                        sx={{
                                                            p: { xs: 0.5, sm: 1 },
                                                            '& svg': { fontSize: { xs: '1rem', sm: '1.25rem' }},
                                                            bgcolor: 'rgba(9, 21, 64, 0.1)',
                                                            '&:hover': {
                                                                bgcolor: 'rgba(9, 21, 64, 0.2)',
                                                            },
                                                            opacity: updatingItem === item.product ? 0.5 : 1,
                                                        }}
                                                    >
                                                        <AddIcon/>
                                                    </IconButton>
                                                    <IconButton
                                                        onClick={() => handleRemoveItem(item.product)}
                                                        disabled={removingItem === item.product}
                                                        sx={{
                                                            p: { xs: 0.5, sm: 1 },
                                                            '& svg': { fontSize: { xs: '1.5rem', sm: '1.75rem' }},
                                                            color: '#d32f2f',
                                                            '&:hover': {
                                                                bgcolor: 'rgba(211, 47, 47, 0.1)',
                                                            },
                                                            opacity: removingItem === item.product ? 0.5 : 1,
                                                        }}
                                                    >
                                                        <DeleteOutlineIcon/>
                                                    </IconButton>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Slide>
                                ))
                            )}
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={4} sx={{
                        maxWidth: '500px',
                        width: '500px',
                        '@media (max-width: 925px)': {
                            maxWidth: '100%',
                            width: '100%',
                        }
                    }}>
                        <Slide direction="left" in timeout={500}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 4,
                                    borderRadius: 4,
                                    background: 'rgba(255, 255, 255, 0.9)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255, 255, 255, 0.3)',
                                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                                    position: 'sticky',
                                    top: 100
                                }}
                            >
                                <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                                    Order Summary
                                </Typography>

                                {/* Subtotal, Shipping, Taxes */}
                                <Box sx={{ mb: 2 }}>
                                    <Grid container justifyContent="space-between" sx={{ mb: 2 }}>
                                        <Typography color="text.secondary">Subtotal</Typography>
                                        <Typography fontWeight="500">${subTotal.toFixed(2)}</Typography>
                                    </Grid>
                                    {discountInfo && (
                                    <Grid container justifyContent="space-between" sx={{ mb: 2 }}>
                                        <Typography color="text.secondary">Discount ({discountInfo.code})</Typography>
                                        <Typography fontWeight="600" color="success.main">
                                            -${discountInfo.discountAmount.toFixed(2)}
                                        </Typography>
                                    </Grid>)}
                                    <Grid container justifyContent="space-between" sx={{ mb: 2 }}>
                                        <Typography color="text.secondary">Shipping</Typography>
                                        <Typography sx={{ color: shippingFees ? 'red': "#2e7d32", fontWeight: 500 }}>
                                            {shippingFees > 0 ? `$${shippingFees.toFixed(2)}` : 'Free'}
                                        </Typography>
                                    </Grid>
                                    <Grid container justifyContent="space-between" sx={{ mb: 2 }}>
                                        <Typography color="text.secondary">Taxes</Typography>
                                        <Typography fontWeight="500">14%</Typography>
                                    </Grid>
                                </Box>

                                {/* ── NEW: Coupon Code ── */}
                                <Grid container sx={{
                                    display: 'flex',
                                    flexDirection: { xs: 'column', sm: 'row' },
                                    gap: 2,
                                    mb: 3
                                }}>
                                        <TextField
                                            label="Coupon Code"
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value)}
                                        />
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            size="small"
                                            onClick={handleApplyCoupon}
                                            sx={{
                                                height: '100%',
                                                borderRadius: 2,
                                                px: 2,
                                                whiteSpace: 'nowrap',
                                                background: 'linear-gradient(45deg, #091540, #3D518C)',
                                                '&:hover': {
                                                    background: 'linear-gradient(45deg, #091540, #1B2CC1)',
                                                    transform: 'translateY(-1px)',
                                                },
                                                transition: 'all 0.2s',
                                            }}
                                        >
                                            Apply
                                        </Button>
                                </Grid>

                                <Divider sx={{ my: 3 }} />

                                {/* Total */}
                                <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                                    <Typography variant="h6">Total</Typography>
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            fontWeight: 700,
                                            background: 'linear-gradient(45deg, #091540, #3D518C)',
                                            backgroundClip: 'text',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                        }}
                                    >
                                        ${
                                        total
                                    }
                                    </Typography>
                                </Grid>

                                <Button
                                    variant="contained"
                                    fullWidth
                                    size="large"
                                    disabled={cartItems.length === 0}
                                    onClick={handleCheckout}
                                    sx={{
                                        mt: 2,
                                        py: 2,
                                        borderRadius: 3,
                                        fontSize: '1.1rem',
                                        fontWeight: 600,
                                        textTransform: 'none',
                                        background: cartItems.length === 0
                                            ? 'rgba(0, 0, 0, 0.12)'
                                            : 'linear-gradient(45deg, #091540, #3D518C)',
                                        boxShadow: '0 4px 15px rgba(9, 21, 64, 0.3)',
                                        '&:hover': {
                                            background: 'linear-gradient(45deg, #091540, #1B2CC1)',
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 6px 20px rgba(9, 21, 64, 0.4)',
                                        },
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    Proceed to Checkout
                                </Button>

                                {cartItems.length === 0 && (
                                    <Typography
                                        variant="body2"
                                        sx={{ mt: 2, textAlign: 'center', color: 'text.secondary' }}
                                    >
                                        Add items to your cart to checkout
                                    </Typography>
                                )}
                            </Paper>
                        </Slide>
                    </Grid>

                </Grid>
            </Container>
        </Fade>
    );
};

export default Cart;