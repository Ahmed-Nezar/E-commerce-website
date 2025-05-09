import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
  Tabs,
  Tab,
  Rating,
  FormControlLabel,
  Switch,
  Fade,
  Grow,
  Zoom,
  InputLabel,
  Select,
  FormControl,
  Stack,
  CircularProgress,
  Pagination
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PaymentIcon from '@mui/icons-material/Payment';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ReviewsIcon from '@mui/icons-material/Reviews';
import { ENV } from '../../App';
import Loader from '../Loader/Loader.jsx';

// TabPanel component for content
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const AdminDashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [actionLoading, setActionLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    type: '',
    id: null,
    itemName: ''
  });
  const [viewingOrder, setViewingOrder] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [productsPagination, setProductsPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [usersPagination, setUsersPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [ordersPagination, setOrdersPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [couponsPagination, setCouponsPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [reviewsPagination, setReviewsPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  // Fetch functions for each type
  const fetchProducts = async (page = 1) => {
    const response = await fetch(`${ENV.VITE_BACKEND_URL}/api/products?page=${page}&limit=10`, {
      headers: { Authorization: localStorage.getItem('token') }
    });
    const data = await response.json();
    setProducts(data.data || []);
    setProductsPagination({ 
      page: data.currentPage, 
      totalPages: data.totalPages,
      total: data.totalNumberOfItems 
    });
  };  

  const fetchUsers = async (page = 1) => {
    const response = await fetch(`${ENV.VITE_BACKEND_URL}/api/users?page=${page}&limit=10`, {
      headers: { Authorization: localStorage.getItem('token') }
    });
    const data = await response.json();
    setUsers(data.data || []);
    setUsersPagination({ 
      page: data.currentPage, 
      totalPages: data.totalPages,
      total: data.totalNumberOfItems 
    });
  };

  const fetchOrders = async (page = 1) => {
    const response = await fetch(`${ENV.VITE_BACKEND_URL}/api/orders?page=${page}&limit=10`, {
      headers: { Authorization: localStorage.getItem('token') }
    });
    const data = await response.json();
    setOrders(data.data || []);
    setOrdersPagination({ 
      page: data.currentPage, 
      totalPages: data.totalPages,
      total: data.totalNumberOfItems 
    });
  };

  const fetchCoupons = async (page = 1) => {
    const response = await fetch(`${ENV.VITE_BACKEND_URL}/api/coupons?page=${page}&limit=10`, {
      headers: { Authorization: localStorage.getItem('token') }
    });
    const data = await response.json();
    setCoupons(data.data || []);
    setCouponsPagination({ 
      page: data.currentPage, 
      totalPages: data.totalPages,
      total: data.totalNumberOfItems 
    });
  };

  const fetchReviews = async (page = 1) => {
    const response = await fetch(`${ENV.VITE_BACKEND_URL}/api/reviews/all?page=${page}&limit=10`, {
      headers: { Authorization: localStorage.getItem('token') }
    });
    const data = await response.json();
    setReviews(data.data || []);
    setReviewsPagination({ 
      page: data.currentPage, 
      totalPages: data.totalPages,
      total: data.totalNumberOfItems 
    });
  };

  // Initial load for products only
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await fetchProducts(1);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, []);

  const handleTabChange = async (event, newValue) => {
    // Clear the previous tab's data
    switch (tabValue) {
      case 0:
        setProducts([]);
        setProductsPagination({ page: 1, totalPages: 1, total: 0 });
        break;
      case 1:
        setUsers([]);
        setUsersPagination({ page: 1, totalPages: 1, total: 0 });
        break;
      case 2:
        setOrders([]);
        setOrdersPagination({ page: 1, totalPages: 1, total: 0 });
        break;
      case 3:
        setCoupons([]);
        setCouponsPagination({ page: 1, totalPages: 1, total: 0 });
        break;
      case 4:
        setReviews([]);
        setReviewsPagination({ page: 1, totalPages: 1, total: 0 });
        break;
    }
    
    setTabValue(newValue);

    // Fetch data for the new tab
    try {
      switch (newValue) {
        case 0:
          await fetchProducts(1);
          break;
        case 1:
          await fetchUsers(1);
          break;
        case 2:
          await fetchOrders(1);
          break;
        case 3:
          await fetchCoupons(1);
          break;
        case 4:
          await fetchReviews(1);
          break;
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleOpenDialog = (type, item = null) => {
    setDialogType(type);
    setSelectedItem(item);
    if (item) {
      setFormData(item);
    } else {
      // Reset form data based on type
      switch (type) {
        case 'product':
          setFormData({
            name: '',
            category: '',
            description: '',
            brand: '',
            price: '',
            stock: '',
            image: ''
          });
          break;
        case 'coupon':
          setFormData({
            code: '',
            discountPercentage: '',
            validUntil: '',
            usageLimit: ''
          });
          break;
        case 'user':
          setFormData({
            name: '',
            email: '',
            password: '',
            gender: '',
            isAdmin: false
          });
          break;
        case 'review':
          setFormData({
            rating: 5,
            comment: '',
            product: '',
            user: ''
          });
          // Fetch products and users for dropdowns when opening review dialog
          fetch(`${ENV.VITE_BACKEND_URL}/api/products?editAddMode=true`, {
            headers: { Authorization: localStorage.getItem('token') }
          })
            .then(res => res.json())
            .then(data => setProducts(data.data || []));
          
          fetch(`${ENV.VITE_BACKEND_URL}/api/users?editAddMode=true`, {
            headers: { Authorization: localStorage.getItem('token') }
          })
            .then(res => res.json())
            .then(data => setUsers(data.data || []));
          break;
      }
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedItem(null);
    setFormData({});
    setSelectedImage(null);
    setImagePreview('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      
      // Update formData with temporary preview
      setFormData(prev => ({
        ...prev,
        image: URL.createObjectURL(file)
      }));
    }
  };

  const uploadImage = async (file) => {
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${ENV.VITE_BACKEND_URL}/api/products/upload`, {
        method: 'POST',
        headers: {
          'Authorization': localStorage.getItem('token')
        },
        body: formData // Don't set Content-Type header - browser will set it with boundary
      }).then(res => res.json());

      if (response.error) {
        throw new Error('Failed to upload image');
      }

      return response.imagePath;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      let imagePath = formData.image;
      
      // If there's a new image selected, upload it first
      if (selectedImage) {
        imagePath = await uploadImage(selectedImage);
      }

      let url, method, body;
      const token = localStorage.getItem('token');

      switch (dialogType) {
        case 'product':
          url = selectedItem 
            ? `${ENV.VITE_BACKEND_URL}/api/products/update/${selectedItem._id}`
            : `${ENV.VITE_BACKEND_URL}/api/products/create`;
          method = selectedItem ? 'PUT' : 'POST';
          body = { ...formData, image: imagePath };
          break;
        case 'coupon':
          url = selectedItem
            ? `${ENV.VITE_BACKEND_URL}/api/coupons/${selectedItem._id}`
            : `${ENV.VITE_BACKEND_URL}/api/coupons/create`;
          method = selectedItem ? 'PUT' : 'POST';
          body = formData;
          break;
        case 'user':
          url = selectedItem 
            ? `${ENV.VITE_BACKEND_URL}/api/users/${selectedItem._id}`
            : `${ENV.VITE_BACKEND_URL}/api/auth/register`;
          method = selectedItem ? 'PUT' : 'POST';
          body = formData;
          break;
        case 'review':
          url = selectedItem
            ? `${ENV.VITE_BACKEND_URL}/api/reviews/update/${selectedItem._id}`
            : `${ENV.VITE_BACKEND_URL}/api/reviews/create`;
          method = selectedItem ? 'PUT' : 'POST';
          // For review updates, we only need rating and comment
          body = selectedItem ? {
            rating: formData.rating,
            comment: formData.comment
          } : {
            productId: formData.product,
            user: formData.user,
            rating: formData.rating,
            comment: formData.comment
          };
          break;
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: token
        },
        body: JSON.stringify(body)
      }).then(res => res.json());

      if (response.error) throw new Error('Failed to save');

      // Refresh data
      switch (dialogType) {
        case 'product':
          await fetchProducts();
          break;
        case 'coupon':
          await fetchCoupons();
          break;
        case 'user':
          await fetchUsers();
          break;
        case 'review':
          await fetchReviews();
          break;
      }

      setSelectedImage(null);
      setImagePreview('');
      handleCloseDialog();
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenDeleteDialog = (type, id, itemName) => {
    setDeleteDialog({
      open: true,
      type,
      id,
      itemName
    });
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialog({
      open: false,
      type: '',
      id: null,
      itemName: ''
    });
  };

  const handleDelete = async () => {
    const { type, id } = deleteDialog;
    setDeletingId(id);
    try {
      let url;
      switch (type) {
        case 'product':
          url = `${ENV.VITE_BACKEND_URL}/api/products/delete/${id}`;
          break;
        case 'coupon':
          url = `${ENV.VITE_BACKEND_URL}/api/coupons/${id}`;
          break;
        case 'user':
          url = `${ENV.VITE_BACKEND_URL}/api/users/${id}`;
          break;
        case 'review':
          url = `${ENV.VITE_BACKEND_URL}/api/reviews/delete/${id}`;
          break;
        case 'order':
          url = `${ENV.VITE_BACKEND_URL}/api/orders/${id}`;
          break;
      }

      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          Authorization: localStorage.getItem('token')
        }
      });

      if (!response.ok) throw new Error('Failed to delete');

      // Refresh data
      switch (type) {
        case 'product':
          await fetchProducts();
          break;
        case 'coupon':
          await fetchCoupons();
          break;
        case 'user':
          await fetchUsers();
          break;
        case 'review':
          await fetchReviews();
          break;
        case 'order':
          await fetchOrders();
          break;
      }

      handleCloseDeleteDialog();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOpenOrderView = (order) => {
    setViewingOrder(order);
    setIsEditing(false);
  };

  const handleCloseOrderView = () => {
    setViewingOrder(null);
    setIsEditing(false);
  };

  const handleOpenOrderEdit = () => {
    setIsEditing(true);
  };

  const handleOrderStatusUpdate = async () => {
    setActionLoading(true);
    try {
      const response = await fetch(`${ENV.VITE_BACKEND_URL}/api/orders/${viewingOrder._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token')
        },
        body: JSON.stringify({
          status: viewingOrder.status,
          isPaid: viewingOrder.isPaid,
          isDelivered: viewingOrder.isDelivered,
          isShipped: viewingOrder.isShipped,
        })
      }).then(res => res.json());

      if (response.error) throw new Error('Failed to update order');

      await fetchOrders();
      handleCloseOrderView();
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Fade in timeout={800}>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: 0,
              padding: '2px',
              borderRadius: '16px',
              background: 'linear-gradient(45deg, #091540, #3D518C, #1B2CC1, #7692FF)',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
              animation: 'gradient 4s ease infinite',
            },
            '@keyframes gradient': {
              '0%': { backgroundPosition: '0% 50%' },
              '50%': { backgroundPosition: '100% 50%' },
              '100%': { backgroundPosition: '0% 50%' }
            }
          }}
        >
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700,
              mb: 5,
              background: 'linear-gradient(45deg, #091540, #3D518C, #1B2CC1)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textAlign: 'center',
              letterSpacing: '0.5px',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
            }}
          >
            Admin Dashboard
          </Typography>

          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              mb: 4,
              '& .MuiTab-root': {
                fontWeight: 600,
                fontSize: '1rem',
                minWidth: 120,
                color: '#666',
                transition: 'all 0.3s ease',
                '&.Mui-selected': {
                  color: '#1B2CC1',
                  background: 'rgba(27, 44, 193, 0.04)',
                  borderRadius: 2,
                }
              },
              '& .MuiTabs-indicator': {
                height: 3,
                borderRadius: 1.5,
                background: 'linear-gradient(90deg, #091540, #1B2CC1)',
              }
            }}
          >
            <Tab 
              label="Products" 
              icon={<Grow in timeout={600}><Box component="span" sx={{ display: 'inline-flex', mr: 1 }}>📦</Box></Grow>} 
              iconPosition="start" 
            />
            <Tab 
              label="Users" 
              icon={<Grow in timeout={800}><Box component="span" sx={{ display: 'inline-flex', mr: 1 }}>👥</Box></Grow>} 
              iconPosition="start"
            />
            <Tab 
              label="Orders" 
              icon={<Grow in timeout={1000}><Box component="span" sx={{ display: 'inline-flex', mr: 1 }}>🛍️</Box></Grow>} 
              iconPosition="start"
            />
            <Tab 
              label="Coupons" 
              icon={<Grow in timeout={1200}><Box component="span" sx={{ display: 'inline-flex', mr: 1 }}>🎟️</Box></Grow>} 
              iconPosition="start"
            />
            <Tab 
              label="Reviews" 
              icon={<Grow in timeout={1400}><Box component="span" sx={{ display: 'inline-flex', mr: 1 }}>⭐</Box></Grow>} 
              iconPosition="start"
            />
          </Tabs>

          {error && (
            <Zoom in>
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3,
                  borderRadius: 2,
                  animation: 'slideIn 0.3s ease-out',
                  '@keyframes slideIn': {
                    from: { transform: 'translateY(-20px)', opacity: 0 },
                    to: { transform: 'translateY(0)', opacity: 1 },
                  },
                }}
              >
                {error}
              </Alert>
            </Zoom>
          )}

          {/* Tabs Content */}
          <Box sx={{ 
            position: 'relative',
            '& .MuiTableContainer-root': {
              borderRadius: 2,
              border: '1px solid rgba(0,0,0,0.1)',
              background: 'rgba(255,255,255,0.8)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            },
            '& .MuiTableHead-root': {
              background: 'linear-gradient(45deg, rgba(9,21,64,0.03), rgba(61,81,140,0.03))',
              '& .MuiTableCell-head': {
                fontWeight: 600,
                color: '#091540',
              }
            },
            '& .MuiTableRow-root': {
              transition: 'background-color 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(9,21,64,0.02)',
              }
            },
            '& .MuiTableCell-root': {
              borderColor: 'rgba(0,0,0,0.1)',
            },
            '& .MuiIconButton-root': {
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.1)',
                background: 'rgba(9,21,64,0.05)',
              }
            }
          }}>
            <TabPanel value={tabValue} index={0}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog('product')}
                sx={{
                  mb: 3,
                  background: 'linear-gradient(90deg, #091540, #3D518C)',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #091540, #1B2CC1)',
                  }
                }}
              >
                Add New Product
              </Button>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Showing {((productsPagination.page - 1) * 20) + 1} - {Math.min(productsPagination.page * 20, productsPagination.total)} of {productsPagination.total} items
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Page {productsPagination.page} of {productsPagination.totalPages}
                </Typography>
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Brand</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Stock</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product._id}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>{product.brand}</TableCell>
                        <TableCell>${product.price}</TableCell>
                        <TableCell>{product.stock}</TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleOpenDialog('product', product)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton 
                            onClick={() => handleOpenDeleteDialog('product', product._id, product.name)}
                            disabled={deletingId === product._id}
                            sx={{
                              opacity: deletingId === product._id ? 0.5 : 1,
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                <Pagination 
                  count={productsPagination.totalPages}
                  page={productsPagination.page}
                  onChange={(event, value) => fetchProducts(value)}
                  color="primary"
                  shape="rounded"
                />
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Button
                variant="contained"
                startIcon={<PersonAddIcon />}
                onClick={() => handleOpenDialog('user')}
                sx={{
                  mb: 3,
                  background: 'linear-gradient(90deg, #091540, #3D518C)',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #091540, #1B2CC1)',
                  }
                }}
              >
                Add New User
              </Button>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Showing {((usersPagination.page - 1) * 20) + 1} - {Math.min(usersPagination.page * 20, usersPagination.total)} of {usersPagination.total} items
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Page {usersPagination.page} of {usersPagination.totalPages}
                </Typography>
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Gender</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.gender}</TableCell>
                        <TableCell>{user.isAdmin ? 'Admin' : 'User'}</TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleOpenDialog('user', user)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton 
                            onClick={() => handleOpenDeleteDialog('user', user._id, user.name)}
                            disabled={deletingId === user._id}
                            sx={{
                              opacity: deletingId === user._id ? 0.5 : 1,
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                <Pagination 
                  count={usersPagination.totalPages}
                  page={usersPagination.page}
                  onChange={(event, value) => fetchUsers(value)}
                  color="primary"
                  shape="rounded"
                />
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Showing {((ordersPagination.page - 1) * 20) + 1} - {Math.min(ordersPagination.page * 20, ordersPagination.total)} of {ordersPagination.total} items
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Page {ordersPagination.page} of {ordersPagination.totalPages}
                </Typography>
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Order ID</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Total</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order._id}>
                        <TableCell>{order._id}</TableCell>
                        <TableCell>{order.user?.name}</TableCell>
                        <TableCell>${order.totalPrice}</TableCell>
                        <TableCell>
                          {order.isDelivered ? 'Delivered' : order.isShipped ? 'Shipped' : order.isPaid ? 'Paid' : 'In Progress'}
                        </TableCell>
                        <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleOpenOrderView(order)}>
                            <VisibilityIcon />
                          </IconButton>
                          <IconButton 
                            onClick={() => handleOpenDeleteDialog('order', order._id, `Order #${order._id}`)}
                            disabled={deletingId === order._id}
                            sx={{
                              opacity: deletingId === order._id ? 0.5 : 1,
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                <Pagination 
                  count={ordersPagination.totalPages}
                  page={ordersPagination.page}
                  onChange={(event, value) => fetchOrders(value)}
                  color="primary"
                  shape="rounded"
                />
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={3}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog('coupon')}
                sx={{
                  mb: 3,
                  background: 'linear-gradient(90deg, #091540, #3D518C)',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #091540, #1B2CC1)',
                  }
                }}
              >
                Add New Coupon
              </Button>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Showing {((couponsPagination.page - 1) * 20) + 1} - {Math.min(couponsPagination.page * 20, couponsPagination.total)} of {couponsPagination.total} items
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Page {couponsPagination.page} of {couponsPagination.totalPages}
                </Typography>
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Code</TableCell>
                      <TableCell>Discount</TableCell>
                      <TableCell>Valid Until</TableCell>
                      <TableCell>Usage Limit</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {coupons.map((coupon) => (
                      <TableRow key={coupon._id}>
                        <TableCell>{coupon.code}</TableCell>
                        <TableCell>{coupon.discountPercentage}%</TableCell>
                        <TableCell>{new Date(coupon.validUntil).toLocaleDateString()}</TableCell>
                        <TableCell>{coupon.usageLimit}</TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleOpenDialog('coupon', coupon)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton 
                            onClick={() => handleOpenDeleteDialog('coupon', coupon._id, coupon.code)}
                            disabled={deletingId === coupon._id}
                            sx={{
                              opacity: deletingId === coupon._id ? 0.5 : 1,
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                <Pagination 
                  count={couponsPagination.totalPages}
                  page={couponsPagination.page}
                  onChange={(event, value) => fetchCoupons(value)}
                  color="primary"
                  shape="rounded"
                />
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={4}>
              <Button
                variant="contained"
                startIcon={<ReviewsIcon />}
                onClick={() => handleOpenDialog('review')}
                sx={{
                  mb: 3,
                  background: 'linear-gradient(90deg, #091540, #3D518C)',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #091540, #1B2CC1)',
                  }
                }}
              >
                Add New Review
              </Button>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Showing {((reviewsPagination.page - 1) * 20) + 1} - {Math.min(reviewsPagination.page * 20, reviewsPagination.total)} of {reviewsPagination.total} items
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Page {reviewsPagination.page} of {reviewsPagination.totalPages}
                </Typography>
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell>User</TableCell>
                      <TableCell>Rating</TableCell>
                      <TableCell>Comment</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reviews.map((review) => (
                      <TableRow key={review._id}>
                        <TableCell>{review.product?.name}</TableCell>
                        <TableCell>{review.user?.name}</TableCell>
                        <TableCell>
                          <Rating value={review.rating} readOnly />
                        </TableCell>
                        <TableCell>{review.comment}</TableCell>
                        <TableCell>{new Date(review.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleOpenDialog('review', review)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton 
                            onClick={() => handleOpenDeleteDialog('review', review._id, review.comment)}
                            disabled={deletingId === review._id}
                            sx={{
                              opacity: deletingId === review._id ? 0.5 : 1,
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                <Pagination 
                  count={reviewsPagination.totalPages}
                  page={reviewsPagination.page}
                  onChange={(event, value) => fetchReviews(value)}
                  color="primary"
                  shape="rounded"
                />
              </Box>
            </TabPanel>
          </Box>

          <Dialog 
            open={openDialog} 
            onClose={handleCloseDialog}
            maxWidth="sm"
            fullWidth
            onClick={(e) => e.stopPropagation()}
            sx={{
              '& .MuiDialog-paper': {
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.3)',
              }
            }}
          >
            <DialogTitle sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              background: 'linear-gradient(45deg, #091540, #3D518C)',
              color: 'white',
              p: 2
            }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {selectedItem ? `Edit ${dialogType}` : `Add New ${dialogType}`}
              </Typography>
              <IconButton
                onClick={handleCloseDialog}
                sx={{ 
                  color: 'white',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.1)'
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Box component="form" noValidate sx={{ mt: 1 }}>
                {dialogType === 'product' && (
                  <>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      label="Name"
                      name="name"
                      value={formData.name || ''}
                      onChange={handleChange}
                    />
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      label="Category"
                      name="category"
                      value={formData.category || ''}
                      onChange={handleChange}
                    />
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      label="Description"
                      name="description"
                      value={formData.description || ''}
                      onChange={handleChange}
                      multiline
                      rows={3}
                    />
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      label="Brand"
                      name="brand"
                      value={formData.brand || ''}
                      onChange={handleChange}
                    />
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      label="Price"
                      name="price"
                      type="number"
                      value={formData.price || ''}
                      onChange={handleChange}
                    />
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      label="Stock"
                      name="stock"
                      type="number"
                      value={formData.stock || ''}
                      onChange={handleChange}
                    />
                    <Box sx={{ mt: 2, mb: 2 }}>
                      <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="product-image"
                        type="file"
                        onChange={handleImageChange}
                      />
                      <label htmlFor="product-image">
                        <Button
                          variant="outlined"
                          component="span"
                          fullWidth
                          disabled={uploadingImage}
                          sx={{ mb: 1 }}
                        >
                          {uploadingImage ? 'Uploading...' : 'Choose Product Image'}
                        </Button>
                      </label>
                      {(imagePreview || formData.image) && (
                        <Box
                          sx={{
                            mt: 2,
                            width: '100%',
                            height: '200px',
                            borderRadius: 1,
                            overflow: 'hidden',
                            position: 'relative'
                          }}
                        >
                          <img
                            src={imagePreview || formData.image}
                            alt="Product preview"
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                          />
                        </Box>
                      )}
                    </Box>
                  </>
                )}

                {dialogType === 'coupon' && (
                  <>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      label="Code"
                      name="code"
                      value={formData.code || ''}
                      onChange={handleChange}
                    />
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      label="Discount Percentage"
                      name="discountPercentage"
                      type="number"
                      value={formData.discountPercentage || ''}
                      onChange={handleChange}
                    />
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      label="Valid Until"
                      name="validUntil"
                      type="date"
                      value={formData.validUntil ? new Date(formData.validUntil).toISOString().split('T')[0] : ''}
                      onChange={handleChange}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      label="Usage Limit"
                      name="usageLimit"
                      type="number"
                      value={formData.usageLimit || ''}
                      onChange={handleChange}
                    />
                  </>
                )}

                {dialogType === 'user' && (
                  <>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      label="Name"
                      name="name"
                      value={formData.name || ''}
                      onChange={handleChange}
                    />
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email || ''}
                      onChange={handleChange}
                    />
                    {!selectedItem && (
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password || ''}
                        onChange={handleChange}
                      />
                    )}
                    <FormControl fullWidth margin="normal">
                      <InputLabel>Gender</InputLabel>
                      <Select
                        name="gender"
                        value={formData.gender || ''}
                        onChange={handleChange}
                        label="Gender"
                      >
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.isAdmin || false}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            isAdmin: e.target.checked
                          }))}
                        />
                      }
                      label="Admin Access"
                      sx={{ mt: 1 }}
                    />
                  </>
                )}

                {dialogType === 'review' && (
                  <>
                    <FormControl fullWidth margin="normal">
                      <InputLabel>Product</InputLabel>
                      <Select
                        name="product"
                        value={formData.product?._id || formData.product || ''}
                        onChange={handleChange}
                        label="Product"
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 300,
                              overflow: 'auto'
                            },
                            sx: {
                              '&::-webkit-scrollbar': {
                                width: '8px'
                              },
                              '&::-webkit-scrollbar-track': {
                                background: 'transparent'
                              },
                              '&::-webkit-scrollbar-thumb': {
                                background: 'rgba(0, 0, 0, 0.2)',
                                borderRadius: '4px'
                              }
                            }
                          }
                        }}
                      >
                        {products.map(product => (
                          <MenuItem 
                            key={product._id} 
                            value={product._id}
                            sx={{
                              '&:hover': {
                                background: 'rgba(9, 21, 64, 0.08)'
                              }
                            }}
                          >
                            {product.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                      <InputLabel>User</InputLabel>
                      <Select
                        name="user"
                        value={formData.user?._id || formData.user || ''}
                        onChange={handleChange}
                        label="User"
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 300,
                              overflow: 'auto'
                            },
                            sx: {
                              '&::-webkit-scrollbar': {
                                width: '8px'
                              },
                              '&::-webkit-scrollbar-track': {
                                background: 'transparent'
                              },
                              '&::-webkit-scrollbar-thumb': {
                                background: 'rgba(0, 0, 0, 0.2)',
                                borderRadius: '4px'
                              }
                            }
                          }
                        }}
                      >
                        {users.map(user => (
                          <MenuItem 
                            key={user._id} 
                            value={user._id}
                            sx={{
                              '&:hover': {
                                background: 'rgba(9, 21, 64, 0.08)'
                              }
                            }}
                          >
                            {user.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <Box sx={{ mt: 2, mb: 2 }}>
                      <Typography component="legend">Rating</Typography>
                      <Rating
                        name="rating"
                        value={formData.rating || 5}
                        onChange={(event, newValue) => {
                          setFormData(prev => ({
                            ...prev,
                            rating: newValue
                          }));
                        }}
                        precision={1}
                        size="large"
                      />
                    </Box>
                    <TextField
                      margin="normal"
                      fullWidth
                      label="Comment"
                      name="comment"
                      multiline
                      rows={4}
                      value={formData.comment || ''}
                      onChange={handleChange}
                      placeholder="Write your review comment here..."
                    />
                    {selectedItem && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Created on: {new Date(selectedItem.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                    )}
                  </>
                )}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button
                onClick={handleSubmit}
                variant="contained"
                disabled={actionLoading || uploadingImage}
                sx={{
                  background: 'linear-gradient(45deg, #091540, #3D518C)',
                  opacity: (actionLoading || uploadingImage) ? 0.7 : 1,
                }}
              >
                {actionLoading || uploadingImage ? 'Saving...' : (selectedItem ? 'Update' : 'Create')}
              </Button>
            </DialogActions>
          </Dialog>
          
        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialog.open}
          onClose={handleCloseDeleteDialog}
          onClick={(e) => e.stopPropagation()}
          sx={{
            '& .MuiDialog-paper': {
              borderRadius: 2,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              overflow: 'hidden'
            }
          }}
        >
          <DialogTitle sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            background: 'linear-gradient(45deg, #d32f2f, #f44336)',
            color: 'white',
            p: 2 
          }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Confirm Delete
            </Typography>
            <IconButton
              onClick={handleCloseDeleteDialog}
              sx={{ 
                color: 'white',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.1)'
                },
                transition: 'all 0.2s ease'
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete {deleteDialog.itemName || 'this item'}? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ p: 2, pt: 1 }}>
            <Button 
              onClick={handleCloseDeleteDialog}
              sx={{ color: '#666' }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              variant="contained"
              color="error"
              disabled={deletingId === deleteDialog.id}
              sx={{
                opacity: deletingId === deleteDialog.id ? 0.7 : 1,
              }}
            >
              {deletingId === deleteDialog.id ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Order View/Edit Dialog */}
        <Dialog 
          open={Boolean(viewingOrder)} 
          onClose={handleCloseOrderView}
          onClick={(e) => e.stopPropagation()}
          maxWidth="md"
          fullWidth
          sx={{
            '& .MuiDialog-paper': {
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              overflow: 'hidden'
            }
          }}
        >
          <DialogTitle sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            background: 'linear-gradient(45deg, #091540, #3D518C)',
            color: 'white',
            p: 2
          }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {isEditing ? 'Edit Order' : 'Order Details'}
            </Typography>
            <Box>
              {!isEditing && (
                <IconButton 
                  onClick={handleOpenOrderEdit}
                  sx={{ 
                    mr: 1,
                    color: 'white',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.1)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  <EditIcon />
                </IconButton>
              )}
              <IconButton 
                onClick={handleCloseOrderView}
                sx={{ 
                  color: 'white',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.1)'
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ px: 3, py: 2 }}>
            {viewingOrder && (
              <Box sx={{ mt: 1 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 2, background: 'rgba(0, 0, 0, 0.02)' }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>Order ID</Typography>
                      <Typography variant="body1" sx={{ mb: 3, fontWeight: 500, fontFamily: 'monospace' }}>
                        {viewingOrder._id}
                      </Typography>

                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>Customer</Typography>
                      <Typography variant="body1" sx={{ mb: 3, fontWeight: 500 }}>
                        {viewingOrder.user?.name}
                      </Typography>

                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>Date</Typography>
                      <Typography variant="body1" sx={{ mb: 3, fontWeight: 500 }}>
                        {new Date(viewingOrder.createdAt).toLocaleString()}
                      </Typography>

                      {isEditing ? (
                        <Box sx={{ mt: 2 }}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={viewingOrder.isPaid}
                                onChange={(e) => setViewingOrder(prev => ({
                                  ...prev,
                                  isPaid: e.target.checked
                                }))}
                              />
                            }
                            label={
                              <Typography sx={{ fontWeight: 500 }}>
                                Payment Status: <span style={{ color: viewingOrder.isPaid ? '#2e7d32' : '#d32f2f' }}>
                                  {viewingOrder.isPaid ? 'Paid' : 'Pending'}
                                </span>
                              </Typography>
                            }
                          />
                          <FormControlLabel
                            control={
                              <Switch
                                checked={viewingOrder.isDelivered}
                                onChange={(e) => setViewingOrder(prev => ({
                                  ...prev,
                                  isDelivered: e.target.checked
                                }))}
                              />
                            }
                            label={
                              <Typography sx={{ fontWeight: 500 }}>
                                Delivery Status: <span style={{ color: viewingOrder.isDelivered ? '#2e7d32' : '#ed6c02' }}>
                                  {viewingOrder.isDelivered ? 'Delivered' : 'Pending'}
                                </span>
                              </Typography>
                            }
                          />
                          <FormControlLabel
                              control={
                                <Switch
                                    checked={viewingOrder.isShipped}
                                    onChange={(e) => setViewingOrder(prev => ({
                                      ...prev,
                                      isShipped: e.target.checked
                                    }))}
                                />
                              }
                              label={
                                <Typography sx={{ fontWeight: 500 }}>
                                  Shipping Status: <span style={{ color: viewingOrder.isShipped ? '#2e7d32' : '#ed6c02' }}>
                                  {viewingOrder.isShipped ? 'Shipped' : 'Pending'}
                                </span>
                                </Typography>
                              }
                          />
                        </Box>
                      ) : (
                        <>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>Payment Status</Typography>
                          <Typography variant="body1" sx={{ 
                            mb: 3, 
                            fontWeight: 500,
                            color: viewingOrder.isPaid ? '#2e7d32' : '#d32f2f'
                          }}>
                            {viewingOrder.isPaid ? 'Paid' : 'Pending'}
                          </Typography>

                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>Delivery Status</Typography>
                          <Typography variant="body1" sx={{ 
                            mb: 3, 
                            fontWeight: 500,
                            color: viewingOrder.isDelivered ? '#2e7d32' : viewingOrder.isShipped? '#ed6c02' : '#ed6c02'
                          }}>
                            {viewingOrder.isDelivered ? 'Delivered' : viewingOrder.isShipped? 'Shipped' : 'Pending'}
                          </Typography>
                        </>
                      )}
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={6} className="w-100">
                    <Paper elevation={0} sx={{ 
                      p: 3, 
                      borderRadius: 2, 
                      background: 'rgba(0, 0, 0, 0.02)',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column'
                    }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>Shipping Address</Typography>
                      <Paper elevation={0} sx={{
                        p: 2.5,
                        mb: 3,
                        background: 'white',
                        borderRadius: 2,
                        border: '1px solid rgba(0, 0, 0, 0.1)'
                      }}>
                        <Typography variant="body2" sx={{ mb: 1 }}>{viewingOrder.shippingAddress?.address}</Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>{viewingOrder.shippingAddress?.city}</Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>{viewingOrder.shippingAddress?.postalCode}</Typography>
                        <Typography variant="body2">{viewingOrder.shippingAddress?.country}</Typography>
                      </Paper>

                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>Payment Method</Typography>
                      <Typography variant="body1" sx={{ mb: 3, fontWeight: 500 }}>{viewingOrder.paymentMethod}</Typography>

                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>Order Items</Typography>
                      <Paper elevation={0} sx={{
                        maxHeight: 200,
                        overflow: 'auto',
                        background: 'white',
                        borderRadius: 2,
                        border: '1px solid rgba(0, 0, 0, 0.1)',
                        '&::-webkit-scrollbar': {
                          width: '8px',
                        },
                        '&::-webkit-scrollbar-track': {
                          background: 'transparent',
                        },
                        '&::-webkit-scrollbar-thumb': {
                          background: 'rgba(0, 0, 0, 0.2)',
                          borderRadius: '4px',
                        },
                      }}>
                        {viewingOrder.orderItems.map((item, index) => (
                          <Box
                            key={index}
                            sx={{
                              p: 2,
                              borderBottom: index < viewingOrder.orderItems.length - 1 ? '1px solid rgba(0, 0, 0, 0.1)' : 'none',
                              transition: 'background-color 0.2s',
                              '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.02)'
                              }
                            }}
                          >
                            <Typography variant="body2" sx={{ 
                              display: 'flex', 
                              justifyContent: 'space-between',
                              alignItems: 'center'
                            }}>
                              <span>{item.name} × {item.quantity}</span>
                              <span style={{ fontWeight: 600 }}>${(item.price * item.quantity).toFixed(2)}</span>
                            </Typography>
                          </Box>
                        ))}
                      </Paper>

                      <Box sx={{ 
                        mt: 'auto', 
                        pt: 3,
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center'
                      }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>Total Amount</Typography>
                        <Typography variant="h6" sx={{ 
                          fontWeight: 600,
                          background: 'linear-gradient(45deg, #091540, #3D518C)',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}>
                          ${viewingOrder.totalPrice.toFixed(2)}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            )}
          </DialogContent>
          {isEditing && (
            <DialogActions sx={{ 
              p: 3, 
              borderTop: '1px solid rgba(0, 0, 0, 0.1)',
              background: 'rgba(0, 0, 0, 0.02)'
            }}>
              <Button 
                onClick={handleCloseOrderView}
                sx={{ 
                  color: '#666',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.05)'
                  }
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleOrderStatusUpdate}
                variant="contained"
                disabled={actionLoading}
                sx={{
                  px: 3,
                  background: 'linear-gradient(45deg, #091540, #3D518C)',
                  opacity: actionLoading ? 0.7 : 1,
                  '&:hover': {
                    background: 'linear-gradient(45deg, #091540, #1B2CC1)',
                  }
                }}
              >
                {actionLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogActions>
          )}
        </Dialog>
        </Paper>
      </Container>
    </Fade>
  );
};

export default AdminDashboard;