const mongoose = require('mongoose');
const { Review, Product } = require('../config/db');

// Create a new review
exports.createReview = async (req, res, next) => {
    try {
        const { productId, rating, comment } = req.body;
        const userId = req.user._id;

        // Validate productId
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ error: 'Invalid product ID' });
        }

        // Check if all required fields are provided
        if (!productId || !rating) {
            return res.status(400).json({ error: 'Product ID and rating are required' });
        }

        // Validate rating
        if (typeof rating !== 'number' || rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Rating must be a number between 1 and 5' });
        }

        // Validate comment
        if (comment && (typeof comment !== 'string' || comment.trim() === '')) {
            return res.status(400).json({ error: 'Comment must be a non-empty string' });
        }

        // Validate comment length
        if (comment && comment.length > 500) {
            return res.status(400).json({ error: 'Comment must be less than 500 characters' });
        }

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

// Get all reviews (admin only) with pagination
exports.getAllReviews = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        const reviews = await Review.find()
            .populate('user', 'name')
            .populate('product', 'name')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const totalReviews = await Review.countDocuments();

        res.status(200).json({
            data: reviews,
            pagination: {
                total: totalReviews,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(totalReviews / limit),
            },
        });
    } catch (err) {
        next(err);
    }
};

// Update a review
exports.updateReview = async (req, res, next) => {
    try {
        const { reviewId } = req.params;
        const { rating, comment } = req.body;

        // Validate reviewId
        if (!mongoose.Types.ObjectId.isValid(reviewId)) {
            return res.status(400).json({ error: 'Invalid review ID' });
        }

        // Check if all required fields are provided
        if (!reviewId) {
            return res.status(400).json({ error: 'Review ID is required' });
        }

        // Validate rating
        if (rating !== undefined && (typeof rating !== 'number' || rating < 1 || rating > 5)) {
            return res.status(400).json({ error: 'Rating must be a number between 1 and 5' });
        }

        // Validate comment
        if (comment !== undefined && (typeof comment !== 'string' || comment.trim() === '')) {
            return res.status(400).json({ error: 'Comment must be a non-empty string' });
        }

        // Validate comment length
        if (comment && comment.length > 500) {
            return res.status(400).json({ error: 'Comment must be less than 500 characters' });
        }

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