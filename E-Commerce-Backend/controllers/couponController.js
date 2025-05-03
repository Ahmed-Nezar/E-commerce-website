const { Coupon } = require('../config/db');

exports.createCoupon = async (req, res, next) => {
    try {
        const { code, discountPercentage, validUntil, usageLimit } = req.body;

        if (!code || !discountPercentage || !validUntil) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const coupon = new Coupon({
            code: code.toUpperCase(),
            discountPercentage,
            validUntil: new Date(validUntil),
            usageLimit
        });

        const createdCoupon = await coupon.save();
        res.status(201).json({ data: createdCoupon });
    } catch (err) {
        next(err);
    }
};

exports.getCoupons = async (req, res, next) => {
    try {
        const coupons = await Coupon.find();
        res.status(200).json({ data: coupons });
    } catch (err) {
        next(err);
    }
};

exports.updateCoupon = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { code, discountPercentage, validUntil, usageLimit } = req.body;

        const coupon = await Coupon.findById(id);
        if (!coupon) {
            return res.status(404).json({ error: 'Coupon not found' });
        }

        if (code) coupon.code = code.toUpperCase();
        if (discountPercentage) coupon.discountPercentage = discountPercentage;
        if (validUntil) coupon.validUntil = new Date(validUntil);
        if (usageLimit) coupon.usageLimit = usageLimit;

        const updatedCoupon = await coupon.save();
        res.status(200).json({ data: updatedCoupon });
    } catch (err) {
        next(err);
    }
};

exports.deleteCoupon = async (req, res, next) => {
    try {
        const { id } = req.params;
        const coupon = await Coupon.findByIdAndDelete(id);
        
        if (!coupon) {
            return res.status(404).json({ error: 'Coupon not found' });
        }

        res.status(200).json({ message: 'Coupon deleted successfully' });
    } catch (err) {
        next(err);
    }
};