const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const verifyToken = require('../middlewares/VerifyToken');

router.post('/create', verifyToken(), reviewController.createReview);
router.get('/get/:productId', reviewController.getReviews);
router.put('/update/:reviewId', verifyToken(), reviewController.updateReview);
router.delete('/delete/:reviewId', verifyToken(), reviewController.deleteReview);

module.exports = router;