const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const verifyToken = require('../middlewares/VerifyToken');

// Cart operations
router.get('/cart', verifyToken(), orderController.getCart);
router.post('/cart', verifyToken(), orderController.addToCart);
router.put('/cart/:productId', verifyToken(), orderController.updateCartItem);
router.delete('/cart/:productId', verifyToken(), orderController.removeCartItem);

// Order operations
router.post('/checkout', verifyToken(), orderController.checkout);
router.get('/history', verifyToken(), orderController.getOrderHistory);

// Admin routes
router.get('/', verifyToken('admin'), orderController.getAllOrders);
router.post('/', verifyToken(), orderController.createOrder);
router.get('/user', verifyToken(), orderController.getUserOrders);
router.get('/:id', verifyToken(), orderController.getOrderById);
router.put('/:id', verifyToken('admin'), orderController.updateOrder);
router.delete('/:id', verifyToken('admin'), orderController.deleteOrder);
router.put('/:orderId', verifyToken(), orderController.editPaidOrder);

module.exports = router;
