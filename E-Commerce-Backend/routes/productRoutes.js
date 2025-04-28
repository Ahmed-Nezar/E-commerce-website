// routes/productRoutes.js

const express = require('express');
const pc      = require('../controllers/productController');
const verify  = require('../middlewares/VerifyToken');

const router = express.Router();

// ——— Wishlist must be defined _before_ the param route ———
router.get('/wishlist',               verify(), pc.getWishlist);
router.post('/wishlist/:productId',   verify(), pc.addToWishlist);
router.delete('/wishlist/:productId', verify(), pc.removeFromWishlist);

// ——— Public endpoints ———
router.get('/',       verify(), pc.getProducts);
router.get('/:id',    verify(), pc.getProductById);

// ——— Admin-only endpoints ———
router.post('/create',       verify('admin'), pc.createProduct);
router.put('/update/:id',    verify('admin'), pc.updateProduct);
router.delete('/delete/:id', verify('admin'), pc.deleteProduct);

module.exports = router;
