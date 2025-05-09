import { useState, useEffect } from 'react';
import {
  Box, Container, Typography, IconButton, Paper, Fade,
} from '@mui/material';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import MemoryIcon from '@mui/icons-material/Memory';
import { RiRam2Line } from "react-icons/ri";
import { useCart } from '../../context/CartContext';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiMonitor } from "react-icons/fi";
import { BsDeviceHdd, BsGpuCard, BsMotherboard, BsMouse2 } from "react-icons/bs";
import { GiComputerFan } from "react-icons/gi";
import { LiaHeadsetSolid } from "react-icons/lia";
import { FaRegKeyboard } from "react-icons/fa";
import { MdOutlinePower } from "react-icons/md";
import { LuPcCase } from "react-icons/lu";
import Loader from '../Loader/Loader.jsx';
import { ENV } from '../../App.jsx';
import ProductsGrid from "../ProductsGrid/ProductsGrid.jsx";

const fetchNewReleases = async (setNewReleases, setLoading) => {
  setLoading(true);
  const query = new URLSearchParams();
  query.append("limit", "8");
  query.append("page", "1");
  query.append("sortQuery", "date");

  const productRes = await fetch(`${ENV.VITE_BACKEND_URL}/api/products?${query.toString()}`)
      .then(res => res.json());
  setNewReleases(productRes.data);
  setLoading(false);
}

const Home = () => {
  const { addToCart } = useCart();
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const carouselItems = [
    {
      image: '/images/products/RTX_4090.jpg',
      name: 'NVIDIA RTX 4090',
      description: 'Experience next-gen gaming performance'
    },
    {
      image: '/images/products/ryzen9.png',
      name: 'AMD Ryzen 9',
      description: 'Ultimate processing power'
    },
    {
      image: '/images/products/Intel-Core-i9.jpg',
      name: 'Intel Core i9',
      description: 'Unleash your productivity'
    },
  ];

  const partCategories = [
    { icon: <BsMotherboard style={{ fontSize: '40px' }} />, name: 'Motherboards'},
    { icon: <MemoryIcon style={{ fontSize: '40px' }} />, name: 'CPUs' },
    { icon: <BsGpuCard style={{ fontSize: '40px' }} />, name: 'GPUs' },
    { icon: <RiRam2Line style={{ fontSize: '40px' }} />, name: 'RAMs' },
    { icon: <FiMonitor style={{ fontSize: '40px' }} />, name: 'Monitors' },
    { icon: <BsDeviceHdd style={{ fontSize: '40px' }} />, name: 'Storages' },
    { icon: <MdOutlinePower style={{ fontSize: '40px' }} />, name: 'PSUs' },
    { icon: <LuPcCase style={{ fontSize: '40px' }} />, name: 'Cases' },
    { icon: <FaRegKeyboard style={{ fontSize: '40px' }} />, name: 'Keyboards' },
    { icon: <BsMouse2 style={{ fontSize: '40px' }} />, name: 'Mice' },
    { icon: <LiaHeadsetSolid style={{ fontSize: '40px', transform: 'scaleX(-1)'}} />, name: 'Headsets' },
    { icon: <GiComputerFan style={{ fontSize: '40px' }}/>, name: 'Coolers'}
  ];

  const [newReleases, setNewReleases] = useState([]);

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
    fetchNewReleases(setNewReleases, setLoading);
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

  if (loading) {
    return <Loader />;
  }

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
                    fontSize: { xs: '1.9rem', sm: '2.5rem', md: '3.5rem', lg: '4rem', xl: '4.5rem' },
                    '@keyframes slideIn': {
                      from: { transform: 'translateY(50px)', opacity: 0 },
                      to: { transform: 'translateY(0)', opacity: 1 },
                    },
                  }}
                >
                  {item.name}
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                    mb: 4,
                    animation: 'fadeIn 0.5s ease-out 0.3s forwards',
                    opacity: 0,
                    fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.9rem', lg: '2.2rem', xl: '2.7rem' },
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
          <Box 
            sx={{
              width: '100%',
              overflow: 'hidden',
              py: 2,
              position: 'relative',
              '&::before, &::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                width: '100px',
                height: '100%',
                zIndex: 2,
              },
              '&::before': {
                left: 0,
                background: 'linear-gradient(90deg, rgba(246, 249, 252,1) 0%, rgba(246, 249, 252,0) 100%)',
              },
              '&::after': {
                right: 0,
                background: 'linear-gradient(90deg, rgba(246, 249, 252,0) 0%, rgba(246, 249, 252,1) 100%)',
              }
            }}
          >
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                width: 'max-content',
                animation: 'scroll 40s linear infinite',
                '&:hover': {
                  animationPlayState: 'paused',
                },
                '@keyframes scroll': {
                  '0%': {
                    transform: 'translateX(0)',
                  },
                  '100%': {
                    transform: 'translateX(calc(-50%))',
                  }
                }
              }}
            >
              {/* First set of categories */}
              {partCategories.map((category, index) => (
                <Box
                  key={`first-${category.name}-${index}`}
                  sx={{ 
                    minWidth: 180,
                    flex: '0 0 auto',
                  }}
                  onClick={() => navigate(`/products/${category.name}`, { state : { category: category.name } })}
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
              {/* Duplicate set for seamless loop */}
              {partCategories.map((category, index) => (
                <Box
                  key={`second-${category.name}-${index}`}
                  sx={{ 
                    minWidth: 180,
                    flex: '0 0 auto',
                  }}
                  onClick={() => {
                      navigate(`/products/${category.name}`, { state : { category: category.name } })
                      scroll(0,0)
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
          </Box>
        </Container>
          <div></div>
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
              <ProductsGrid isLoading={loading} products={newReleases}
                            handleAddToCart={handleAddToCart} addedItems={addedItems}/>

            </motion.div>
          </Container>
        </Box>
      </Box>
    </Fade>
  );
};

export default Home;