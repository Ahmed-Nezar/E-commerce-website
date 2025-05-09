const mongoose = require('mongoose');
const { Review, Product } = require('../config/db');

// Create a new review
exports.createReview = async (req, res, next) => {
    try {
        const { productId, rating, comment } = req.body;
        const userId = req.user._id;

        // Validate productId
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ error: "Invalid product ID" });
        }

        // Check required
        if (!rating) {
            return res.status(400).json({ error: "Rating is required" });
        }

        // Validate rating
        if (typeof rating !== "number" || rating < 1 || rating > 5) {
            return res
                .status(400)
                .json({ error: "Rating must be a number between 1 and 5" });
        }

        // Validate comment length
        if (comment && comment.length > 500) {
            return res
                .status(400)
                .json({ error: "Comment must be less than 500 characters" });
        }

        // Check product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        // Create & save
        const review = new Review({
            user: userId,
            product: productId,
            rating,
            comment,
        });
        await review.save();

        // ─── UPDATE AGGREGATE RATING ON PRODUCT ───
        // Increment count
        const numReviews = await Review.countDocuments({
            product: mongoose.Types.ObjectId(productId)
        });
        // Recompute average
        product.rating =
            (product.rating * (numReviews - 1) + rating) /
            numReviews;
        await product.save();
        // ───────────────────────────────────────────

        // Populate the user’s name & profilePic
        await review.populate("user", "name profilePic");

        // Format to match getReviews output
        const formatted = {
            id: review._id.toString(),
            name: review.user.name,
            image: review.user.profilePic,
            rating: review.rating,
            date: review.createdAt.toISOString().split("T")[0], // YYYY-MM-DD
            comment: review.comment
        };

        return res
            .status(201)
            .json({ message: "Review created", data: formatted });
    } catch (err) {
        next(err);
    }
};

// Get all reviews for a product
exports.getReviews = async (req, res, next) => {
    try {
        const { productId } = req.params;

        // Validate productId
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ error: "Invalid product ID" });
        }

        const reviews = await Review.aggregate([
            // 1) only this product’s reviews
            {
                $match: {
                    product: new mongoose.Types.ObjectId(productId)
                }
            },
            // 2) bring in user’s first/last name
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "userDoc"
                }
            },
            { $unwind: "$userDoc" },
            // 3) assign a sequential id (1,2,3…) by createdAt order
            {
                $setWindowFields: {
                    sortBy: { createdAt: 1 },
                    output: {
                        id: { $documentNumber: {} }
                    }
                }
            },
            // 4) shape each document exactly how you want
            {
                $project: {
                    _id: 0,
                    id: "$_id",
                    name: "$userDoc.name",
                    image: "$userDoc.profilePic",
                    rating:  "$rating",
                    date:    {                        // format to YYYY-MM-DD
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$createdAt"
                        }
                    },
                    comment:  "$comment",
                }
            }
        ]);

        return res.status(200).json({ data: reviews });
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
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalReviews / limit),
            totalNumberOfItems: totalReviews
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