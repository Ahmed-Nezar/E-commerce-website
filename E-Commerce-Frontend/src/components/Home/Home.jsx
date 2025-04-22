import { useState, useEffect } from 'react';
import {
  Box, Container, Typography,
  Button, Grid, Card, CardContent,
  CardMedia, IconButton, Paper,
  Fade, useTheme, Stack, Rating,
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
import HeadphonesIcon from '@mui/icons-material/Headphones';
import { useCart } from '../../context/CartContext';
import Tilt from 'react-parallax-tilt';
import { motion } from 'framer-motion';
import ProductCard from "../ProductCard/ProductCard.jsx";

const Home = () => {
  const theme = useTheme();
  const { addToCart } = useCart();
  const [currentSlide, setCurrentSlide] = useState(0);

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
    { icon: <HeadphonesIcon sx={{ fontSize: 40 }} />, name: 'Headsets' },
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
          {
            carouselItems.map((item, index) => (
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
              background: 'linear-gradient(45deg, #091540, #3D518C)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Browse Categories
          </Typography>
          <Grid container spacing={2} justifyContent="center" sx={{ 
            flexWrap: 'nowrap', 
            overflowX: 'hidden',
            pb: 2,
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, rgba(171, 210, 250, 0.15) 0%, transparent 5%, transparent 95%, rgba(171, 210, 250, 0.15) 100%)',
              pointerEvents: 'none',
              zIndex: 1,
            },
            '@keyframes scrollCategories': {
              '0%': {
                transform: 'translateX(0)',
              },
              '100%': {
                transform: 'translateX(-50%)',
              },
            },
          }}>
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                animation: 'scrollCategories 30s linear infinite',
                '&:hover': {
                  animationPlayState: 'paused',
                },
              }}
            >
              {[...partCategories, ...partCategories].map((category, index) => (
                <Box
                  key={`${category.name}-${index}`}
                  sx={{ 
                    minWidth: 180,
                    flex: '0 0 auto',
                  }}
                >
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
                        color: '#3D518C',
                      }}
                    >
                      {category.icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {category.name}
                    </Typography>
                  </Paper>
                </Box>
              ))}
            </Box>
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
                  background: 'linear-gradient(-45deg, #091540, #3D518C, #1B2CC1, #7692FF)',
                  backgroundSize: '300% 300%',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  animation: 'gradient 8s ease infinite',
                  filter: 'drop-shadow(0 2px 4px rgba(9, 21, 64, 0.1))',
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
              <Grid container spacing={6} justifyContent="center" alignItems="center" sx={{ 
                display: 'flex',
                flexWrap: 'wrap',
                margin: '0 auto'
              }}>
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
                        <ProductCard
                            product={product}
                            handleAddToCart={product.id}
                            addedItems={product.id}
                        />
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