// routes/productRoutes.js

const express = require('express');
const pc      = require('../controllers/productController');
const verify  = require('../middlewares/VerifyToken');
const multer  = require('multer');
const path    = require('path');

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Store in Frontend's products-backend directory with correct case
    const uploadPath = path.join(__dirname, '../../../E-commerce-website/E-Commerce-Frontend/public/images/products-backend');
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload an image.'), false);
    }
  }
});

const router = express.Router();

// Image upload route - must be before other routes
router.post('/upload', verify('admin'), upload.single('image'), pc.uploadImage);

// ——— Wishlist must be defined _before_ the param route ———
router.get('/wishlist',               verify(), pc.getWishlist);
router.post('/wishlist/:productId',   verify(), pc.addToWishlist);
router.delete('/wishlist/:productId', verify(), pc.removeFromWishlist);

// ——— Public endpoints ———
router.get('/',              pc.getProducts);
router.get('/getById/:id',   pc.getProductById);
router.get('/getCategories', pc.getCategories);
router.get('/getBrands',     pc.getBrands);

// ——— Admin-only endpoints ———
router.post('/create',       verify('admin'), pc.createProduct);
router.put('/update/:id',    verify('admin'), pc.updateProduct);
router.delete('/delete/:id', verify('admin'), pc.deleteProduct);

module.exports = router;
