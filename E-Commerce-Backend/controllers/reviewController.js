const { Review, Product } = require('../config/db');

// Create a new review
exports.createReview = async (req, res, next) => {
    try {
        const { productId, rating, comment } = req.body;
        const userId = req.user._id;

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Create review
        const review = new Review({
            user: userId,
            product: productId,
            rating,
            comment
        });
        await review.save();

        res.status(201).json({ message: 'Review created', data: review });
    } catch (err) {
        next(err);
    }
};

// Get all reviews for a product
exports.getReviews = async (req, res, next) => {
    try {
        const { productId } = req.params;

        const reviews = await Review.find({ product: productId }).populate('user', 'name');
        res.status(200).json({ data: reviews });
    } catch (err) {
        next(err);
    }
};

// Update a review
exports.updateReview = async (req, res, next) => {
    try {
        const { reviewId } = req.params;
        const { rating, comment } = req.body;

        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }

        // Update fields
        review.rating = rating ?? review.rating;
        review.comment = comment ?? review.comment;
        const updatedReview = await review.save();

        res.status(200).json({ message: 'Review updated', data: updatedReview });
    } catch (err) {
        next(err);
    }
};

// Delete a review
exports.deleteReview = async (req, res, next) => {
    try {
        const { reviewId } = req.params;

        const review = await Review.findByIdAndDelete(reviewId);
        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }

        res.status(200).json({ message: 'Review deleted' });
    } catch (err) {
        next(err);
    }
};