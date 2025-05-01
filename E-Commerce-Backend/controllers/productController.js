// controllers/productController.js
const { Product, User} = require('../config/db');


exports.getCategories = async (req, res, next) => {
    try {
        const categories = await Product.distinct('category');
        res.status(200).json({data: categories});
    } catch (err) {
        next(err);
    }
}

// GET /api/products/getBrands?category=CPU
exports.getBrands = async (req, res, next) => {
    try {
        const { category } = req.query;

        let filter = {};
        if (category) {
            filter = {
                category: { $regex: category, $options: 'i' }
            }
        }

        // Apply a filter to the distinct query
        const brands = await Product.distinct('brand', filter);

        res.status(200).json({data: brands});
    } catch (err) {
        next(err);
    }
};


// @desc    Fetch all products with optional filters + pagination
// @route   GET /api/products?page=&limit=&keyword=&category=&minPrice=&maxPrice=
// @access  Public
exports.getProducts = async (req, res, next) => {
    try {
        const {
            page:  pageQ,
            limit: limitQ,
            keyword,
            category,
            brand,
            minPrice,
            maxPrice,
            stock,
            sortQuery,  // 'lowToHigh' OR 'highToLow' OR 'nameAsc' OR 'nameDesc' OR 'ratingHigh' OR 'ratingLow'
        } = req.query;

        // Pagination
        const page  = Math.max(1, parseInt(pageQ, 10)  || 1);
        const limit = Math.max(1, parseInt(limitQ, 10) || 10);
        const skip  = (page - 1) * limit;

        // Filter
        const filter = {};
        if (keyword)  filter.name     = { $regex: keyword, $options: 'i' };
        if (category) filter.category = { $regex: category, $options: 'i' }; // ← added options:i
        if (brand)    filter.brand    = { $regex: brand, $options: 'i' };
        if (stock && (stock === "true"))    filter.stock  = { $gt: 0 };
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = +minPrice;
            if (maxPrice) filter.price.$lte = +maxPrice;
        }

        // Sort name, price, rating
        const sort = {};
        if (sortQuery === 'lowToHigh' || sortQuery === 'highToLow') {
            sort.price = sortQuery === 'lowToHigh' ? 1 : -1;
        }
        if (sortQuery === 'nameAsc' || sortQuery === 'nameDesc') {
            sort.name = sortQuery === 'nameAsc' ? 1 : -1;
        }
        if (sortQuery === 'ratingLow' || sortQuery === 'ratingHigh') {
            sort.rating = sortQuery === 'ratingLow' ? 1 : -1;
        }

        // Count
        const totalNumberOfItems = await Product.countDocuments(filter);

        // Fetch paginated + sorted
        const data = await Product.find(filter)
            .collation({ locale: 'en', strength: 1 }) // <- enables case-insensitive sorting
            .sort(sort)
            .skip(skip)
            .limit(limit);

        res.json({
            currentPage:  page,
            totalPages:   Math.max(1, Math.ceil(totalNumberOfItems / limit)),
            totalNumberOfItems,
            data,
        });
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
            res.status(200).json({ data: product});
        } else {
            res.status(404).json({ error: 'Product not found' });
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
            res.status(404).json({ error: 'Product not found' });
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
            return  res.status(400).json({ error: 'Product id is missing' });
        }
        const product = await Product.findOneAndDelete({_id: pid});
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted' });
    } catch (err) {
        next(err);
    }
};

// ——— Wishlist endpoints (user only) ———

// @desc    Get paginated wishlist
// @route   GET /api/products/wishlist?page=&limit=
// @access  User
exports.getWishlist = async (req, res, next) => {
    try {
        const page  = Math.max(1, parseInt(req.query.page, 10)  || 1);
        const limit = Math.max(1, parseInt(req.query.limit, 10) || 10);
        const skip  = (page - 1) * limit;

        // load full wishlist
        const user = await User.findById(req.user._id);
        const wishlistIds = user.wishList;

        const totalNumberOfItems = wishlistIds.length;
        const slice = wishlistIds.slice(skip, skip + limit);

        // populate just the page
        const data = await Product.find({ _id: { $in: slice } });

        res.json({
            currentPage:  page,
            totalPages:   Math.max(1, Math.ceil(totalNumberOfItems / limit)),
            totalNumberOfItems,
            data,
        });
    } catch (err) {
        next(err);
    }
};

// POST /api/products/wishlist/:productId
exports.addToWishlist = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const prod = await Product.findById(productId);
        if (!prod) return res.status(404).json({ error: 'Product not found' });

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