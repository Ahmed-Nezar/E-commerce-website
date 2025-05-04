const { Coupon } = require('../config/db');

// @desc    List all coupons (paginated)
// @route   GET /api/coupons
// @access  Admin
exports.getCoupons = async (req, res, next) => {
    try {
        const page  = Math.max(1, parseInt(req.query.page, 10)  || 1);
        const limit = Math.max(1, parseInt(req.query.limit, 10) || 10);
        const skip  = (page - 1) * limit;

        const totalNumberOfItems = await Coupon.countDocuments();
        const coupons = await Coupon.find()
            .sort({ validUntil: -1 }) // soonest‐to‐expire last
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            currentPage: page,
            totalPages: Math.max(1, Math.ceil(totalNumberOfItems / limit)),
            totalNumberOfItems,
            data: coupons
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get a single coupon by ID
// @route   GET /api/coupons/:id
// @access  Admin
exports.getCouponById = async (req, res, next) => {
    try {
        const id = req.params.id;


        if (!id) {
            return res.status(400).json({ error: 'Missing coupon ID' });
        }

        const coupon = await Coupon.findById(id);

        if (!coupon) {
            return res.status(404).json({ error: 'Coupon not found' });
        }

        res.status(200).json({ data: coupon });
    } catch (err) {
        next(err);
    }
};

// @desc    Create a new coupon
// @route   POST /api/coupons
// @access  Admin
exports.createCoupon = async (req, res, next) => {
    try {
        const { code, discountPercentage, validUntil, usageLimit } = req.body;

        if (!code || discountPercentage == null || !validUntil) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const coupon = new Coupon({
            code: code.toUpperCase(),
            discountPercentage,
            validUntil: new Date(validUntil),
            usageLimit
        });

        const created = await coupon.save();
        res.status(201).json({ data: created });
    } catch (err) {
        next(err);
    }
};

// @desc    Update an existing coupon
// @route   PUT /api/coupons/:id
// @access  Admin
exports.updateCoupon = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { code, discountPercentage, validUntil, usageLimit } = req.body;

        const coupon = await Coupon.findById(id);
        if (!coupon) {
            return res.status(404).json({ error: 'Coupon not found' });
        }

        if (code)                       coupon.code = code.toUpperCase();
        if (discountPercentage != null) coupon.discountPercentage = discountPercentage;
        if (validUntil)                 coupon.validUntil = new Date(validUntil);
        if (usageLimit != null)         coupon.usageLimit = usageLimit;

        const updated = await coupon.save();
        res.status(200).json({ data: updated });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete a coupon
// @route   DELETE /api/coupons/:id
// @access  Admin
exports.deleteCoupon = async (req, res, next) => {
    try {
        const deleted = await Coupon.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ error: 'Coupon not found' });
        }
        res.status(200).json({ message: 'Coupon deleted successfully' });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Apply a coupon code to a given total
 * @route   POST /api/coupons/apply
 * @access  User (any authenticated)
 */
exports.applyCoupon = async (req, res, next) => {
    try {
        const { code, totalPrice } = req.body;
        if (!code || totalPrice == null) {
            return res.status(400).json({ error: 'Missing code or totalPrice' });
        }

        // Look up coupon
        const coupon = await Coupon.findOne({ code: code.toUpperCase() });
        if (!coupon) {
            return res.status(404).json({ error: 'Coupon not found' });
        }

        // Check expiration
        if (coupon.validUntil < new Date()) {
            return res.status(400).json({ error: 'Coupon has expired' });
        }

        // Check remaining usages
        if (coupon.usageLimit <= 0) {
            return res.status(400).json({ error: 'Coupon usage limit exceeded' });
        }

        // Decrement usage and save
        coupon.usageLimit -= 1;
        await coupon.save();

        // Compute discount
        const discountAmount = +((totalPrice * coupon.discountPercentage) / 100).toFixed(2);
        const newTotal       = +(totalPrice - discountAmount).toFixed(2);

        // delete coupon if usage limit is 0
        if (coupon.usageLimit === 0) {
            await Coupon.findByIdAndDelete(coupon._id);
        }

        return res.status(200).json({
            data: {
                code:               coupon.code,
                discountPercentage: coupon.discountPercentage,
                discountAmount,
                newTotal
            }
        });
    } catch (err) {
        next(err);
    }
};
