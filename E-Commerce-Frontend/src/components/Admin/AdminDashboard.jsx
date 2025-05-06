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
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
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

  // Fetch data based on active tab
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        switch (tabValue) {
          case 0: // Products
            await fetchProducts();
            break;
          case 1: // Users
            await fetchUsers();
            break;
          case 2: // Orders
            await fetchOrders();
            break;
          case 3: // Coupons
            await fetchCoupons();
            break;
          case 4: // Reviews
            await fetchReviews();
            break;
        }
      } catch (err) {
        setError('Failed to fetch data');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [tabValue]);

  // Fetch functions for each type
  const fetchProducts = async () => {
    const response = await fetch(`${ENV.VITE_BACKEND_URL}/api/products`, {
      headers: { Authorization: localStorage.getItem('token') }
    });
    const data = await response.json();
    setProducts(data.data || []);
  };  
  
  const fetchUsers = async () => {
    const response = await fetch(`${ENV.VITE_BACKEND_URL}/api/users`, {
      headers: { Authorization: localStorage.getItem('token') }
    });
    const data = await response.json();
    setUsers(Array.isArray(data) ? data : data.data || []);
  };

  const fetchOrders = async () => {
    const response = await fetch(`${ENV.VITE_BACKEND_URL}/api/orders`, {
      headers: { Authorization: localStorage.getItem('token') }
    });
    const data = await response.json();
    setOrders(data.data || []);
  };

  const fetchCoupons = async () => {
    const response = await fetch(`${ENV.VITE_BACKEND_URL}/api/coupons`, {
      headers: { Authorization: localStorage.getItem('token') }
    });
    const data = await response.json();
    setCoupons(data.data || []);
  };

  const fetchReviews = async () => {
    const response = await fetch(`${ENV.VITE_BACKEND_URL}/api/reviews/all`, {
      headers: { Authorization: localStorage.getItem('token') }
    });
    const data = await response.json();
    setReviews(data.data || []);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
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
            gender: '',
            isAdmin: false
          });
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
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to upload image');
      }
      
      const data = await response.json();
      return data.imagePath;
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
          url = `${ENV.VITE_BACKEND_URL}/api/users/${selectedItem._id}`;
          method = 'PUT';
          body = formData;
          break;
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: token
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) throw new Error('Failed to save');

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
          isDelivered: viewingOrder.isDelivered
        })
      });

      if (!response.ok) throw new Error('Failed to update order');

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
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
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
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
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
                          {order.isDelivered ? 'Delivered' : order.isPaid ? 'Paid' : 'Pending'}
                        </TableCell>
                        <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleOpenOrderView(order)}>
                            <VisibilityIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
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
            </TabPanel>

            <TabPanel value={tabValue} index={4}>
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
            </TabPanel>
          </Box>

          <Dialog 
            open={openDialog} 
            onClose={handleCloseDialog}
            maxWidth="sm"
            fullWidth
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
            <DialogTitle>
              {selectedItem ? `Edit ${dialogType}` : `Add New ${dialogType}`}
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
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      label="Gender"
                      name="gender"
                      select
                      SelectProps={{
                        native: true,
                      }}
                      value={formData.gender || ''}
                      onChange={handleChange}
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </TextField>
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
          sx={{
            '& .MuiDialog-paper': {
              borderRadius: 2,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
            }
          }}
        >
          <DialogTitle sx={{ pb: 1 }}>Confirm Delete</DialogTitle>
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
          maxWidth="md"
          fullWidth
          sx={{
            '& .MuiDialog-paper': {
              borderRadius: 2,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
            }
          }}
        >
          <DialogTitle sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
            mb: 2
          }}>
            <Typography variant="h6">
              {isEditing ? 'Edit Order' : 'Order Details'}
            </Typography>
            <Box>
              {!isEditing && (
                <IconButton 
                  onClick={handleOpenOrderEdit}
                  sx={{ mr: 1 }}
                >
                  <EditIcon />
                </IconButton>
              )}
              <IconButton onClick={handleCloseOrderView}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            {viewingOrder && (
              <Box sx={{ mt: 1 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary">Order ID</Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>{viewingOrder._id}</Typography>

                    <Typography variant="subtitle2" color="text.secondary">Customer</Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>{viewingOrder.user?.name}</Typography>

                    <Typography variant="subtitle2" color="text.secondary">Date</Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
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
                          label="Paid"
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
                          label="Delivered"
                        />
                      </Box>
                    ) : (
                      <>
                        <Typography variant="subtitle2" color="text.secondary">Payment Status</Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                          {viewingOrder.isPaid ? 'Paid' : 'Pending'}
                        </Typography>

                        <Typography variant="subtitle2" color="text.secondary">Delivery Status</Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                          {viewingOrder.isDelivered ? 'Delivered' : 'Pending'}
                        </Typography>
                      </>
                    )}
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary">Shipping Address</Typography>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        mb: 2,
                        background: 'rgba(0, 0, 0, 0.03)',
                        borderRadius: 1
                      }}
                    >
                      <Typography variant="body2">{viewingOrder.shippingAddress?.address}</Typography>
                      <Typography variant="body2">{viewingOrder.shippingAddress?.city}</Typography>
                      <Typography variant="body2">{viewingOrder.shippingAddress?.postalCode}</Typography>
                      <Typography variant="body2">{viewingOrder.shippingAddress?.country}</Typography>
                    </Paper>

                    <Typography variant="subtitle2" color="text.secondary">Payment Method</Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>{viewingOrder.paymentMethod}</Typography>

                    <Typography variant="subtitle2" color="text.secondary">Order Items</Typography>
                    <Paper
                      elevation={0}
                      sx={{
                        mt: 1,
                        maxHeight: 200,
                        overflow: 'auto',
                        background: 'rgba(0, 0, 0, 0.03)',
                        borderRadius: 1
                      }}
                    >
                      {viewingOrder.orderItems.map((item, index) => (
                        <Box
                          key={index}
                          sx={{
                            p: 2,
                            borderBottom: index < viewingOrder.orderItems.length - 1 ? '1px solid rgba(0, 0, 0, 0.1)' : 'none',
                          }}
                        >
                          <Typography variant="body2">
                            {item.name} x {item.quantity} - ${(item.price * item.quantity).toFixed(2)}
                          </Typography>
                        </Box>
                      ))}
                    </Paper>

                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle1">Total Amount</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        ${viewingOrder.totalPrice.toFixed(2)}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            )}
          </DialogContent>
          {isEditing && (
            <DialogActions sx={{ p: 2.5, pt: 0 }}>
              <Button 
                onClick={handleCloseOrderView}
                sx={{ color: '#666' }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleOrderStatusUpdate}
                variant="contained"
                disabled={actionLoading}
                sx={{
                  background: 'linear-gradient(45deg, #091540, #3D518C)',
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