const express = require('express');
const router  = express.Router();
const oc = require('../controllers/orderController');

router.get('/cart', oc.getCart);
router.post('/cart', oc.addToCart);
router.put('/cart/:productId', oc.updateCartItem);
router.delete('/cart/:productId', oc.removeCartItem);
router.post('/checkout', oc.checkout);

module.exports = router;
