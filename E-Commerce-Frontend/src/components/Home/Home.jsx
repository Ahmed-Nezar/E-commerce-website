import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Paper,
  Fade,
  useTheme,
  Stack,
  Rating,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import MonitorIcon from '@mui/icons-material/Monitor';
import MemoryIcon from '@mui/icons-material/Memory';
import StorageIcon from '@mui/icons-material/Storage';
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';
import RouterIcon from '@mui/icons-material/Router';
import ComputerIcon from '@mui/icons-material/Computer';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import MouseIcon from '@mui/icons-material/Mouse';
import { useCart } from '../../context/CartContext';
import Tilt from 'react-parallax-tilt';
import { motion } from 'framer-motion';

const Home = () => {
  const theme = useTheme();
  const { addToCart } = useCart();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hoveredProduct, setHoveredProduct] = useState(null);

  const carouselItems = [
    {
      image: '/images/products/RTX_4090.jpg',
      title: 'NVIDIA RTX 4090',
      description: 'Experience next-gen gaming performance'
    },
    {
      image: '/images/products/ryzen9.png',
      title: 'AMD Ryzen 9',
      description: 'Ultimate processing power'
    },
    {
      image: '/images/products/Intel-Core-i9.jpg',
      title: 'Intel Core i9',
      description: 'Unleash your productivity'
    },
  ];

  const partCategories = [
    { icon: <MonitorIcon sx={{ fontSize: 40 }} />, name: 'Monitors' },
    { icon: <MemoryIcon sx={{ fontSize: 40 }} />, name: 'GPUs' },
    { icon: <StorageIcon sx={{ fontSize: 40 }} />, name: 'Storage' },
    { icon: <BatteryChargingFullIcon sx={{ fontSize: 40 }} />, name: 'PSUs' },
    { icon: <RouterIcon sx={{ fontSize: 40 }} />, name: 'Networking' },
    { icon: <ComputerIcon sx={{ fontSize: 40 }} />, name: 'Cases' },
    { icon: <KeyboardIcon sx={{ fontSize: 40 }} />, name: 'Keyboards' },
    { icon: <MouseIcon sx={{ fontSize: 40 }} />, name: 'Mice' },
  ];

  const [newReleases] = useState([
    {
      id: 1,
      name: 'Razer Basilisk V3',
      price: 69.99,
      image: '/images/products/Razer_Basilisk_V3.jpg',
      description: 'Pro Gaming Mouse',
      stock: 25,
      rating: 4.7
    },
    {
      id: 2,
      name: 'RTX 5060 Ti',
      price: 499.99,
      image: '/images/products/RTX_5060_Ti.png',
      description: 'Mid-Range Gaming GPU',
      stock: 3,
      rating: 4.9
    },
    {
      id: 3,
      name: 'Razer Kraken V4',
      price: 199.99,
      image: '/images/products/Razer_Kraken_V4.jpg',
      description: 'Wireless Gaming Headset',
      stock: 10,
      rating: 4.8
    },    
    {
      id: 4,
      name: 'Samsung Odyssey OLED G8',
      price: 1299.99,
      image: '/images/products/Samsung-Odyssey-OLED-G8.jpg',
      description: '34" Ultra-Wide Gaming Monitor',
      stock: 12,
      rating: 4.9
    },
    {
      id: 5,
      name: 'Keychron Q5 HE',
      price: 199.99,
      image: '/images/products/Keychron_Q5_HE.png',
      description: 'Hot-swappable Mechanical Keyboard',
      stock: 15,
      rating: 4.6
    },    
    {
      id: 6,
      name: 'Lian Li O11 Vision',
      price: 219.99,
      image: '/images/products/O11VP_000a.png',
      description: 'Premium ATX PC Case',
      stock: 7,
      rating: 4.8
    },
    {
      id: 7,
      name: 'NVIDIA Quantum X800',
      price: 1499.99,
      image: '/images/products/NVIDIA_Quantum-X800.jpg',
      description: 'Next-gen GPU Technology',
      stock: 5,
      rating: 4.8
    },
    {
      id: 8,
      name: 'Dark Power Pro 13 1600W',
      price: 399.99,
      image: '/images/products/Dark_Power_Pro_13_1600W.jpg',
      description: 'Platinum Rated PSU',
      stock: 8,
      rating: 4.7
    },
    {
      id: 9,
      name: 'ADATA SD 8.0 Express',
      price: 129.99,
      image: '/images/products/adata-SD-8.0-Express-UE720.jpg',
      description: 'High-Speed Storage Solution',
      stock: 20,
      rating: 4.5
    }
  ]);

  const [addedItems, setAddedItems] = useState({});

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedItems(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItems(prev => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <Fade in timeout={1000}>
      <Box sx={{ minHeight: '100vh' }}>
        {/* PC Parts Carousel */}
        <Box sx={{ position: 'relative', mb: 8, height: '70vh', overflow: 'hidden' }}>
          {carouselItems.map((item, index) => (
            <Box
              key={index}
              sx={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                opacity: currentSlide === index ? 1 : 0,
                transition: 'opacity 0.5s ease-in-out',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  backgroundImage: `url(${item.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: 'brightness(0.7)',
                }}
              />
              <Box
                sx={{
                  position: 'relative',
                  textAlign: 'center',
                  color: 'white',
                  zIndex: 1,
                  p: 4,
                }}
              >
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 700,
                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                    mb: 2,
                    animation: 'slideIn 0.5s ease-out',
                    '@keyframes slideIn': {
                      from: { transform: 'translateY(50px)', opacity: 0 },
                      to: { transform: 'translateY(0)', opacity: 1 },
                    },
                  }}
                >
                  {item.title}
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                    mb: 4,
                    animation: 'fadeIn 0.5s ease-out 0.3s forwards',
                    opacity: 0,
                    '@keyframes fadeIn': {
                      to: { opacity: 1 },
                    },
                  }}
                >
                  {item.description}
                </Typography>
              </Box>
            </Box>
          ))}
          <IconButton
            onClick={handlePrevSlide}
            sx={{
              position: 'absolute',
              left: 20,
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: 'rgba(255,255,255,0.3)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.5)' },
              zIndex: 2,
            }}
          >
            <KeyboardArrowLeftIcon sx={{ fontSize: 40, color: 'white' }} />
          </IconButton>
          <IconButton
            onClick={handleNextSlide}
            sx={{
              position: 'absolute',
              right: 20,
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: 'rgba(255,255,255,0.3)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.5)' },
              zIndex: 2,
            }}
          >
            <KeyboardArrowRightIcon sx={{ fontSize: 40, color: 'white' }} />
          </IconButton>
        </Box>

        {/* Part Categories */}
        <Container maxWidth="lg" sx={{ mb: 8 }}>
          <Typography
            variant="h3"
            align="center"
            sx={{
              mb: 6,
              fontWeight: 700,
              background: 'linear-gradient(45deg, #1976d2, #2196f3)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Browse Categories
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            {partCategories.map((category, index) => (
              <Grid item key={index} xs={6} sm={3} md={3}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                    borderRadius: 4,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                      '& .category-icon': {
                        transform: 'scale(1.2)',
                        color: '#1976d2',
                      },
                    },
                  }}
                >
                  <Box
                    className="category-icon"
                    sx={{
                      transition: 'all 0.3s ease',
                      color: '#666',
                    }}
                  >
                    {category.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {category.name}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* New Releases Section */}
        <Box 
          component={motion.div}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          sx={{ 
            py: { xs: 8, md: 12 },
            px: { xs: 2, md: 4 },
            background: 'linear-gradient(135deg, #f6f9fc 0%, #eef2f7 100%)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '100%',
              backgroundImage: 'radial-gradient(circle, #1976d2 1px, transparent 1px)',
              backgroundSize: '30px 30px',
              opacity: 0.05,
              animation: 'floatBackground 20s linear infinite',
              zIndex: 0,
            },
            '@keyframes floatBackground': {
              '0%': { transform: 'translateY(0)' },
              '100%': { transform: 'translateY(-50%)' },
            }
          }}
        >
          <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Typography
                variant="h2"
                align="center"
                sx={{
                  mb: 2,
                  fontWeight: 800,
                  background: 'linear-gradient(-45deg, #1976d2, #2196f3, #0d47a1, #42a5f5)',
                  backgroundSize: '300% 300%',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  animation: 'gradient 8s ease infinite',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                  '@keyframes gradient': {
                    '0%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                    '100%': { backgroundPosition: '0% 50%' },
                  },
                }}
              >
                Latest Arrivals
              </Typography>
              <Typography
                variant="h6"
                align="center"
                sx={{
                  mb: 8,
                  color: 'text.secondary',
                  maxWidth: '600px',
                  mx: 'auto',
                  opacity: 0.8,
                  lineHeight: 1.6,
                  fontSize: '1.1rem',
                  fontWeight: 500,
                  textShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}
              >
                Discover our curated selection of cutting-edge tech innovations
              </Typography>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <Grid container spacing={6}>
                {newReleases.map((product, index) => (
                  <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
                    <motion.div 
                      variants={itemVariants}
                      custom={index}
                      initial="hidden"
                      animate="visible"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Tilt
                        tiltMaxAngleX={8}
                        tiltMaxAngleY={8}
                        scale={1}
                        transitionSpeed={1500}
                        gyroscope={true}
                      >
                        <Card
                          onMouseEnter={() => setHoveredProduct(product.id)}
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
                            boxShadow: hoveredProduct === product.id 
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
                                transform: 'translateX(0)',
                                opacity: 1,
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
                                background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)',
                                opacity: 0,
                                transition: 'opacity 0.4s ease',
                                display: 'flex',
                                alignItems: 'flex-end',
                                p: 2,
                              }}
                            >
                              <Button
                                variant="contained"
                                fullWidth
                                onClick={() => handleAddToCart(product)}
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
                                startIcon={<ShoppingCartIcon />}
                              >
                                Quick Add
                              </Button>
                            </Box>

                            {/* Badges */}
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
                                  background: 'linear-gradient(45deg, #1976d2, #2196f3)',
                                  color: 'white',
                                  px: 2,
                                  py: 0.75,
                                  borderRadius: '12px',
                                  fontWeight: 600,
                                  fontSize: '0.75rem',
                                  boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
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

                          {/* Content */}
                          <CardContent sx={{ 
                              flexGrow: 1, 
                              p: { xs: 2, sm: 3 },
                              '&:last-child': {
                                pb: { xs: 2, sm: 3 }
                              }
                            }}>
                              <Typography 
                                variant="h6" 
                                sx={{ 
                                  fontWeight: 700,
                                  mb: 1,
                                  fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
                                  background: hoveredProduct === product.id 
                                    ? 'linear-gradient(45deg, #1976d2, #2196f3)' 
                                    : 'none',
                                  backgroundClip: 'text',
                                  WebkitBackgroundClip: 'text',
                                  WebkitTextFillColor: hoveredProduct === product.id ? 'transparent' : 'inherit',
                                  transition: 'all 0.3s ease',
                                }}
                              >
                                {product.name}
                              </Typography>

                            {/* Rating */}
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
                                sx={{ 
                                  ml: 1,
                                  color: 'text.secondary',
                                  fontWeight: 500
                                }}
                              >
                                ({product.rating})
                              </Typography>
                            </Box>

                            {/* Description */}
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                mb: 2.5,
                                color: 'text.secondary',
                                lineHeight: 1.6,
                                minHeight: '40px'
                              }}
                            >
                              {product.description}
                            </Typography>

                            {/* Price and Add to Cart */}
                            <Stack 
                              direction="row" 
                              justifyContent="space-between" 
                              alignItems="center"
                              spacing={2}
                            >
                              <Box
                                className="price-tag"
                                sx={{
                                  background: 'linear-gradient(45deg, #1976d2, #2196f3)',
                                  color: 'white',
                                  py: 1,
                                  px: 2,
                                  borderRadius: '12px',
                                  transform: 'translateX(-10px)',
                                  opacity: 0,
                                  transition: 'all 0.3s ease',
                                }}
                              >
                                <Typography
                                  variant="h6"
                                  sx={{
                                    fontWeight: 700,
                                    fontSize: '1.2rem',
                                  }}
                                >
                                  ${product.price.toFixed(2)}
                                </Typography>
                              </Box>
                              <Button
                                variant="contained"
                                startIcon={<ShoppingCartIcon />}
                                onClick={() => handleAddToCart(product)}
                                disabled={product.stock === 0}
                                sx={{
                                  borderRadius: '12px',
                                  px: 2,
                                  py: 1,
                                  background: addedItems[product.id]
                                    ? 'linear-gradient(45deg, #2e7d32, #4caf50)'
                                    : 'linear-gradient(45deg, #1976d2, #2196f3)',
                                  boxShadow: '0 4px 15px rgba(25, 118, 210, 0.3)',
                                  textTransform: 'none',
                                  fontWeight: 600,
                                  '&:hover': {
                                    background: addedItems[product.id]
                                      ? 'linear-gradient(45deg, #1b5e20, #2e7d32)'
                                      : 'linear-gradient(45deg, #1565c0, #1976d2)',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)',
                                  },
                                  transition: 'all 0.3s ease',
                                }}
                              >
                                {addedItems[product.id] ? 'Added!' : 'Add to Cart'}
                              </Button>
                            </Stack>
                          </CardContent>
                        </Card>
                      </Tilt>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          </Container>
        </Box>
      </Box>
    </Fade>
  );
};

export default Home;