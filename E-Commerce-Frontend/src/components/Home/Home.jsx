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

const Home = () => {
  const theme = useTheme();
  const { addToCart } = useCart();
  const [currentSlide, setCurrentSlide] = useState(0);

  const carouselItems = [
    {
      image: 'https://source.unsplash.com/featured/?nvidia,gpu',
      title: 'NVIDIA RTX 4090',
      description: 'Experience next-gen gaming performance'
    },
    {
      image: 'https://source.unsplash.com/featured/?amd,processor',
      title: 'AMD Ryzen 9',
      description: 'Ultimate processing power'
    },
    {
      image: 'https://source.unsplash.com/featured/?intel,cpu',
      title: 'Intel Core i9',
      description: 'Unleash your productivity'
    },
  ];

  const partCategories = [
    { icon: <MonitorIcon sx={{ fontSize: 40 }} />, name: 'Monitors' },
    { icon: <MemoryIcon sx={{ fontSize: 40 }} />, name: 'CPUs' },
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
      name: 'ROG STRIX RTX 4080',
      price: 1299.99,
      image: 'https://source.unsplash.com/featured/?gpu',
      description: 'Next-gen gaming performance'
    },
    {
      id: 2,
      name: 'ROG Swift PG32UQX',
      price: 2999.99,
      image: 'https://source.unsplash.com/featured/?gaming,monitor',
      description: '4K 144Hz Gaming Monitor'
    },
    {
      id: 3,
      name: 'Corsair RM1000x',
      price: 219.99,
      image: 'https://source.unsplash.com/featured/?power,supply',
      description: '1000W Platinum PSU'
    },
  ]);

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
        <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
          <Container maxWidth="lg">
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
              New Releases
            </Typography>
            <Grid container spacing={4}>
              {newReleases.map((product) => (
                <Grid item key={product.id} xs={12} sm={6} md={4}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 4,
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                        '& .product-image': {
                          transform: 'scale(1.1)',
                        },
                      },
                    }}
                  >
                    <Box sx={{ position: 'relative', paddingTop: '56.25%', overflow: 'hidden' }}>
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
                          transition: 'transform 0.3s ease',
                        }}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 16,
                          right: 16,
                          bgcolor: '#1976d2',
                          color: 'white',
                          px: 2,
                          py: 0.5,
                          borderRadius: 2,
                          fontWeight: 600,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        }}
                      >
                        NEW
                      </Box>
                    </Box>
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Typography gutterBottom variant="h5" sx={{ fontWeight: 600 }}>
                        {product.name}
                      </Typography>
                      <Typography color="text.secondary" sx={{ mb: 2 }}>
                        {product.description}
                      </Typography>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            color: '#1976d2',
                          }}
                        >
                          ${product.price.toFixed(2)}
                        </Typography>
                        <Button
                          variant="contained"
                          startIcon={<ShoppingCartIcon />}
                          onClick={() => addToCart(product)}
                          sx={{
                            borderRadius: 2,
                            background: 'linear-gradient(90deg, #1976d2, #2196f3)',
                            '&:hover': {
                              background: 'linear-gradient(90deg, #1565c0, #1976d2)',
                            },
                          }}
                        >
                          Add to Cart
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      </Box>
    </Fade>
  );
};

export default Home;