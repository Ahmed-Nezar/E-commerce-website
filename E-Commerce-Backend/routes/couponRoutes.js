const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');
const verifyToken = require('../middlewares/VerifyToken');

router.get('/', verifyToken(), couponController.getCoupons);
router.post('/create', verifyToken('admin'), couponController.createCoupon);
router.put('/:id', verifyToken('admin'), couponController.updateCoupon);
router.delete('/:id', verifyToken('admin'), couponController.deleteCoupon);

module.exports = router;

