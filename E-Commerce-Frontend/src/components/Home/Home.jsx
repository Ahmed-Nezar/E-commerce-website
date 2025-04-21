import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  IconButton,
  Paper,
  Fade,
  useTheme,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useCart } from '../../context/CartContext';

const Home = () => {
  const theme = useTheme();
  const { addToCart } = useCart();
  const [featuredProducts] = useState([
    {
      id: 1,
      name: 'Premium Headphones',
      price: 299.99,
      image: 'https://source.unsplash.com/featured/?headphones',
      description: 'High-quality wireless headphones with noise cancellation'
    },
    {
      id: 2,
      name: 'Smart Watch',
      price: 199.99,
      image: 'https://source.unsplash.com/featured/?smartwatch',
      description: 'Feature-rich smartwatch with health monitoring'
    },
    {
      id: 3,
      name: 'Laptop Pro',
      price: 1299.99,
      image: 'https://source.unsplash.com/featured/?laptop',
      description: 'Powerful laptop for professionals'
    },
  ]);

  const categories = [
    { name: 'Electronics', image: 'https://source.unsplash.com/featured/?electronics' },
    { name: 'Fashion', image: 'https://source.unsplash.com/featured/?fashion' },
    { name: 'Home & Living', image: 'https://source.unsplash.com/featured/?home' },
    { name: 'Books', image: 'https://source.unsplash.com/featured/?books' },
  ];

  return (
    <Fade in timeout={1000}>
      <Box sx={{ minHeight: '100vh' }}>
        {/* Hero Section */}
        <Paper
          sx={{
            position: 'relative',
            backgroundColor: 'grey.800',
            color: '#fff',
            mb: 4,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundImage: 'url(https://source.unsplash.com/featured/?shopping)',
            borderRadius: 0,
            height: '70vh',
            display: 'flex',
            alignItems: 'center',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,.5)',
            }
          }}
        >
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
            <Typography
              component="h1"
              variant="h2"
              color="inherit"
              gutterBottom
              sx={{
                fontWeight: 700,
                textShadow: '2px 2px 4px rgba(0,0,0,.5)',
                mb: 4
              }}
            >
              Discover Amazing Products
            </Typography>
            <Typography variant="h5" color="inherit" paragraph sx={{ mb: 4, maxWidth: 600 }}>
              Shop the latest trends and discover premium quality products at competitive prices.
              Start your shopping journey with us today.
            </Typography>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{
                px: 4,
                py: 2,
                borderRadius: 3,
                fontSize: '1.1rem',
                fontWeight: 600,
                textTransform: 'none',
                background: 'linear-gradient(90deg, #1976d2, #2196f3)',
                '&:hover': {
                  background: 'linear-gradient(90deg, #1565c0, #1976d2)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease'
              }}
            >
              Shop Now
            </Button>
          </Container>
        </Paper>

        {/* Categories Section */}
        <Container maxWidth="lg" sx={{ mb: 8 }}>
          <Typography
            component="h2"
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
            Shop by Category
          </Typography>
          <Grid container spacing={4}>
            {categories.map((category) => (
              <Grid item key={category.name} xs={12} sm={6} md={3}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 4,
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                    },
                  }}
                >
                  <CardMedia
                    component="div"
                    sx={{
                      pt: '100%',
                      position: 'relative',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.3)',
                      }
                    }}
                    image={category.image}
                  />
                  <Typography
                    variant="h5"
                    component="h3"
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      p: 2,
                      color: 'white',
                      textAlign: 'center',
                      fontWeight: 600,
                      textShadow: '1px 1px 2px rgba(0,0,0,0.6)',
                    }}
                  >
                    {category.name}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* Featured Products Section */}
        <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
          <Container maxWidth="lg">
            <Typography
              component="h2"
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
              Featured Products
            </Typography>
            <Grid container spacing={4}>
              {featuredProducts.map((product) => (
                <Grid item key={product.id} xs={12} sm={6} md={4}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 4,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                      },
                    }}
                  >
                    <CardMedia
                      component="div"
                      sx={{
                        pt: '56.25%',
                      }}
                      image={product.image}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h5" component="h3" sx={{ fontWeight: 600 }}>
                        {product.name}
                      </Typography>
                      <Typography color="text.secondary" sx={{ mb: 2 }}>
                        {product.description}
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          color: theme.palette.primary.main,
                          fontWeight: 700,
                        }}
                      >
                        ${product.price.toFixed(2)}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ p: 2 }}>
                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={<ShoppingCartIcon />}
                        onClick={() => addToCart(product)}
                        sx={{
                          borderRadius: 2,
                          py: 1,
                          background: 'linear-gradient(90deg, #1976d2, #2196f3)',
                          '&:hover': {
                            background: 'linear-gradient(90deg, #1565c0, #1976d2)',
                          },
                        }}
                      >
                        Add to Cart
                      </Button>
                    </CardActions>
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