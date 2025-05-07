import React, {useState} from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    Rating,
    Stack,
    Typography
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useTheme } from '@mui/material/styles';
import "./ProductCard.css";
import { useNavigate } from 'react-router-dom';
import CustomModal from "../CustomModal/CustomModal.jsx";
import ProductDetails from "../ProductDetails/ProductDetails.jsx";

const ProductCard = ({
    product,
    handleAddToCart,
    addedItems
}) => {
    const theme = useTheme();
    const [hoveredProduct, setHoveredProduct] = useState(null);
    const navigate = useNavigate();

    return (
        <Card
            onMouseEnter={() => setHoveredProduct(product._id)}
            onMouseLeave={() => setHoveredProduct(null)}
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '24px',
                overflow: 'hidden',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: hoveredProduct === product._id
                    ? '0 22px 40px rgba(0,0,0,0.15), 0 8px 16px rgba(25, 118, 210, 0.1)'
                    : '0 8px 16px rgba(0,0,0,0.1)',
                '&:hover': {
                    transform: 'translateY(-12px)',
                    '& .product-image': {
                        transform: 'scale(1.1) rotate(2deg)',
                    },
                    '& .product-overlay': {
                        opacity: 1,
                    },
                    '& .price-tag': {
                        transform: 'translateX(0)'
                    }
                },
            }}
        >
            <Box sx={{ position: 'relative', pt: '100%', overflow: 'hidden' }}>
                <CardMedia
                    component="img"
                    image={product.image}
                    alt={product.name}
                    className="product-image"
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                />
                <Box
                    className="product-overlay"
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(to top, rgba(9, 21, 64, 0.8) 0%, rgba(9, 21, 64, 0.2) 50%, transparent 100%)',
                        opacity: 0,
                        transition: 'opacity 0.4s ease',
                        display: 'flex',
                        alignItems: 'flex-end',
                        p: 2,
                        cursor: 'pointer',
                    }}
                >
                    <CustomModal
                        triggerButton={
                            <Button
                                variant="contained"
                                fullWidth
                                disabled={product.stock === 0}
                                sx={{
                                    py: 1.5,
                                    borderRadius: '16px',
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    background: 'rgba(255,255,255,0.95)',
                                    color: 'primary.main',
                                    backdropFilter: 'blur(10px)',
                                    '&:hover': {
                                        background: 'rgba(255,255,255,1)',
                                        transform: 'scale(1.02)',
                                    },
                                    transition: 'all 0.3s ease',
                                }}
                                startIcon={<VisibilityIcon />}
                            >
                                Quick View
                            </Button>
                        }
                    >
                        <ProductDetails productId={product._id}/>
                    </CustomModal>
                </Box>

                <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                        position: 'absolute',
                        top: 16,
                        left: 16,
                        right: 16,
                        display: 'flex',
                        justifyContent: 'space-between',
                    }}
                >
                    <Box
                        sx={{
                            background: 'linear-gradient(45deg, #091540, #3D518C)',
                            color: 'white',
                            px: 2,
                            py: 0.75,
                            borderRadius: '12px',
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            boxShadow: '0 4px 12px rgba(9, 21, 64, 0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            animation: product.stock <= 5 ? 'pulse 2s infinite' : 'none',
                            '@keyframes pulse': {
                                '0%': { transform: 'scale(1)' },
                                '50%': { transform: 'scale(1.05)' },
                                '100%': { transform: 'scale(1)' },
                            },
                        }}
                    >
                        NEW
                    </Box>
                    {product.stock <= 5 && (
                        <Box
                            sx={{
                                background: product.stock === 0
                                    ? 'linear-gradient(45deg, #d32f2f, #f44336)'
                                    : 'linear-gradient(45deg, #ed6c02, #ff9800)',
                                color: 'white',
                                px: 2,
                                py: 0.75,
                                borderRadius: '12px',
                                fontWeight: 600,
                                fontSize: '0.75rem',
                                boxShadow: product.stock === 0
                                    ? '0 4px 12px rgba(211, 47, 47, 0.3)'
                                    : '0 4px 12px rgba(237, 108, 2, 0.3)',
                            }}
                        >
                            {product.stock === 0 ? 'Out of Stock' : `Only ${product.stock} left`}
                        </Box>
                    )}
                </Stack>
            </Box>

            <CardContent
                onClick={(e) => {
                    e.stopPropagation();
                    navigate('/productDetails/' + product._id);
                }}
                sx={{ flexGrow: 1, p: { xs: 2, sm: 3 }, '&:last-child': { pb: { xs: 2, sm: 3 } } ,cursor: "pointer" }}>
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 700,
                        mb: 1,
                        fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
                        background: hoveredProduct === product._id
                            ? 'linear-gradient(45deg, #091540, #3D518C)'
                            : 'none',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: hoveredProduct === product._id ? 'transparent' : 'inherit',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                    }}
                >
                    {product.name}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <Rating
                        value={product.rating}
                        precision={0.1}
                        size="small"
                        readOnly
                        sx={{
                            '& .MuiRating-iconFilled': {
                                color: theme.palette.primary.main,
                                filter: 'drop-shadow(0 2px 4px rgba(25, 118, 210, 0.2))',
                            },
                        }}
                    />
                    <Typography
                        variant="body2"
                        sx={{ ml: 1, color: 'text.secondary', fontWeight: 500 }}
                    >
                        ({product.rating})
                    </Typography>
                </Box>

                <Typography
                    variant="body2"
                    sx={{
                        mb: 2.5,
                        color: 'text.secondary',
                        lineHeight: 1.6,
                        minHeight: '50px',
                    }}
                >
                    {product.description.length > 70
                        ? `${product.description.substring(0, 70)}...`
                        : product.description}
                </Typography>

                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                    <Box
                        className="price-tag"
                        sx={{
                            background: 'linear-gradient(45deg, #091540, #3D518C)',
                            color: 'white',
                            py: 1,
                            px: 2,
                            borderRadius: '12px',
                            transform: 'translateX(-10px)',
                            transition: 'all 0.3s ease',
                        }}
                    >
                        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.2rem' }}>
                            ${product.price.toFixed(2)}
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        className="add-to-cart-button"
                        startIcon={<ShoppingCartIcon />}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(product)}
                        }
                        disabled={product.stock === 0}
                        sx={{
                            borderRadius: '12px',
                            px: 2,
                            py: 1,
                            background: addedItems[product._id]
                                ? 'linear-gradient(45deg, #2e7d32, #4caf50)'
                                : 'linear-gradient(45deg, #091540, #3D518C)',
                            boxShadow: '0 4px 15px rgba(9, 21, 64, 0.3)',
                            textTransform: 'none',
                            fontWeight: 600,
                            '&:hover': {
                                background: addedItems[product._id]
                                    ? 'linear-gradient(45deg, #1b5e20, #2e7d32)'
                                    : 'linear-gradient(45deg, #091540, #1B2CC1)',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 6px 20px rgba(9, 21, 64, 0.4)',
                            },
                            transition: 'all 0.3s ease',
                        }}
                    >
                        {addedItems[product._id] ? 'Added!' : 'Add to Cart'}
                    </Button>
                </Stack>
            </CardContent>
        </Card>
    );
};

export default ProductCard;