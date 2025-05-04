const express       = require('express');
const router        = express.Router();
const verifyToken   = require('../middlewares/VerifyToken');
const ctrl    = require('../controllers/couponController');

// → any logged-in user can APPLY
router.post('/apply', verifyToken(), ctrl.applyCoupon);

// All coupon endpoints are admin‐only
router.use(verifyToken('admin'));

router
    .route('/')
    .get(ctrl.getCoupons)     // GET    /api/coupons
    .post(ctrl.createCoupon); // POST   /api/coupons

router
    .route('/:id')
    .get(    ctrl.getCouponById)  // GET    /api/coupons/:id
    .put(    ctrl.updateCoupon)   // PUT    /api/coupons/:id
    .delete( ctrl.deleteCoupon);  // DELETE /api/coupons/:id

module.exports = router;
