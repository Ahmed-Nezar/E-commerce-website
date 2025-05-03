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
  DialogActions,
  TextField,
  MenuItem,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Rating,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { ENV } from '../../App';

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
    // works whether your API returns {data:[…]} or just […]
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let url, method, body;
      const token = localStorage.getItem('token');

      switch (dialogType) {
        case 'product':
          url = selectedItem 
            ? `${ENV.VITE_BACKEND_URL}/api/products/update/${selectedItem._id}`
            : `${ENV.VITE_BACKEND_URL}/api/products/create`;
          method = selectedItem ? 'PUT' : 'POST';
          body = formData;
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

      handleCloseDialog();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

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
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={0} sx={{ p: 4, borderRadius: 3, background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)' }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: '#091540', mb: 4 }}>
          Admin Dashboard 
        </Typography>

        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          sx={{
            mb: 4,
            '& .MuiTab-root': {
              fontWeight: 600,
              color: '#3D518C',
              '&.Mui-selected': {
                color: '#1B2CC1',
              }
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#1B2CC1',
            }
          }}
        >
          <Tab label="Products" />
          <Tab label="Users" />
          <Tab label="Orders" />
          <Tab label="Coupons" />
          <Tab label="Reviews" />
        </Tabs>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Products Tab */}
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
                      <IconButton onClick={() => handleDelete('product', product._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Users Tab */}
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
                      <IconButton onClick={() => handleDelete('user', user._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Orders Tab */}
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
                      <IconButton onClick={() => handleOpenDialog('order', order)}>
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Coupons Tab */}
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
                      <IconButton onClick={() => handleDelete('coupon', coupon._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Reviews Tab */}
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
                      <IconButton onClick={() => handleDelete('review', review._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Dialog for Add/Edit */}
        <Dialog open={openDialog} onClose={handleCloseDialog}>
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
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Image URL"
                    name="image"
                    value={formData.image || ''}
                    onChange={handleChange}
                  />
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
            <Button onClick={handleSubmit} variant="contained">
              {selectedItem ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default AdminDashboard;