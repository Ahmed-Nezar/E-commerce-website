// controllers/productController.js
const { Product, User} = require('../config/db');

// @desc    Fetch all products with optional filters
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res, next) => {
    try {
        const { keyword, category, minPrice, maxPrice } = req.query;
        let filter = {};
        if (keyword) filter.name = { $regex: keyword, $options: 'i' };
        if (category) filter.category = category;
        if (minPrice) filter.price = { ...filter.price, $gte: Number(minPrice) };
        if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) };

        const products = await Product.find(filter);
        res.json(products);
    } catch (err) {
        next(err);
    }
};

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res, next) => {
    try {
        const pid = req.params.id;
        if (!pid) {
            return res.status(400).json({ error: 'Product id not found' });
        }
        const product = await Product.findById(pid);
        if (product) {
            res.status(200).json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (err) {
        next(err);
    }
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Admin
exports.createProduct = async (req, res, next) => {
    try {
        const { name, price, description, category, brand, stock, image } = req.body;
        const product = new Product({ name, price, description, category, brand, stock, image });
        const created = await product.save();
        res.status(201).json(created);
    } catch (err) {
        next(err);
    }
};

// @desc    Update an existing product
// @route   PUT /api/products/:id
// @access  Admin
exports.updateProduct = async (req, res, next) => {
    try {
        const { name, price, description, category, brand, stock, image } = req.body;
        const product = await Product.findById(req.params.id);
        if (!product) {
            res.status(404).json({ message: 'Product not found' });
        }
        product.name = name ?? product.name;
        product.price = price ?? product.price;
        product.description = description ?? product.description;
        product.category = category ?? product.category;
        product.brand = brand ?? product.brand;
        product.stock = stock ?? product.stock;
        product.image = image ?? product.image;
        const updated = await product.save();
        res.json(updated);
    } catch (err) {
        next(err);
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Admin
exports.deleteProduct = async (req, res, next) => {
    try {
        const pid = req.params.id;
        if (!pid) {
            return  res.status(400).json({ message: 'Product id is missing' });
        }
        const product = await Product.findOneAndDelete({_id: pid});
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted' });
    } catch (err) {
        next(err);
    }
};

// ——— Wishlist endpoints (user only) ———

// GET /api/products/wishlist
exports.getWishlist = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).populate('wishList');
        res.json(user.wishList);
    } catch (err) {
        next(err);
    }
};

// POST /api/products/wishlist/:productId
exports.addToWishlist = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const prod = await Product.findById(productId);
        if (!prod) return res.status(404).json({ message: 'Product not found' });

        await User.findByIdAndUpdate(
            req.user._id,
            { $addToSet: { wishList: productId } }
        );

        const updated = await User.findById(req.user._id).populate('wishList');
        res.json(updated.wishList);
    } catch (err) {
        next(err);
    }
};

// DELETE /api/products/wishlist/:productId
exports.removeFromWishlist = async (req, res, next) => {
    try {
        const { productId } = req.params;
        await User.findByIdAndUpdate(
            req.user._id,
            { $pull: { wishList: productId } }
        );

        const updated = await User.findById(req.user._id).populate('wishList');
        res.json(updated.wishList);
    } catch (err) {
        next(err);
    }
};