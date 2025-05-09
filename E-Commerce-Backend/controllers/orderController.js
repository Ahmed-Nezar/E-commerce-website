// controllers/orderController.js
const mongoose = require('mongoose');
const { Order, Product }   = require('../config/db');
const ObjectId = mongoose.Types.ObjectId;

// —————— Helper: aggregate the unpaid cart and populate products ——————
async function aggregateCart(userId) {
    // 1) Ensure there is an unpaid cart document for this user
    await Order.updateOne(
        { user: userId, isPaid: false },
        {
            $setOnInsert: {
                orderItems: [],
                shippingAddress: {},
                paymentMethod: '',
                totalPrice: 0,
                isPaid: false
            }
        },
        { upsert: true }
    );

    const [cart] = await Order.aggregate([
        {$match: {user: new ObjectId(userId), isPaid: false}},
        // unwind items (if any), lookup each product, then regroup
        {$unwind: {path: '$orderItems', preserveNullAndEmptyArrays: true}},
        {
            $lookup: {
                from: 'products',
                localField: 'orderItems.product',
                foreignField: '_id',
                as: 'orderItems.product'
            }
        },
        {$unwind: {path: '$orderItems.product', preserveNullAndEmptyArrays: true}},
        {
            $group: {
                _id: '$_id',
                user: {$first: '$user'},
                orderItems: {
                    $push: {
                        $cond: [
                            {$ifNull: ['$orderItems.product', false]},
                            {
                                product: '$orderItems.product',
                                quantity: '$orderItems.quantity',
                                price: '$orderItems.price'
                            },
                            '$$REMOVE'
                        ]
                    }
                },
                shippingAddress: {$first: '$shippingAddress'},
                paymentMethod: {$first: '$paymentMethod'},
                totalPrice: {$first: '$totalPrice'},
                isPaid: {$first: '$isPaid'},
                paidAt: {$first: '$paidAt'},
                isDelivered: {$first: '$isDelivered'},
                isShipped: {$first: '$isShipped'},
                deliveredAt: {$first: '$deliveredAt'},
                shippedAt: {$first: '$shippedAt'},
                createdAt: {$first: '$createdAt'},
                updatedAt: {$first: '$updatedAt'}
            }
        }
    ]);

    return cart;
}

// Your fixed “reference” coordinates:
// const REF = {
//     latitude:  30.0507,
//     longitude: 31.2489,
//     city:      "Cairo",
//     region:    "Cairo Governorate",
//     country:   "Egypt"
// };

const REF = {
    latitude:  31.2001,          // Alexandria latitude
    longitude: 29.9187,          // Alexandria longitude
    city:      "Alexandria",
    region:    "Alexandria Governorate",
    country:   "Egypt"
};

// Haversine formula
function haversine(lat1, lon1, lat2, lon2) {
    const toRad = x => (x * Math.PI) / 180;
    const R = 6371; // Earth radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat/2)**2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon/2)**2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Try ipapi.co, then on any error/timeout, fallback to ip-api.com
async function lookupGeo(ip) {
    const fetch = require('node-fetch');
    // Helper: fetch with timeout
    async function fetchWithTimeout(url, opts = {}, ms = 5000) {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), ms);
        try {
            const res = await fetch(url, {
                ...opts,
                signal: controller.signal
            });
            clearTimeout(id);
            return res;
        } catch (err) {
            clearTimeout(id);
            throw err;
        }
    }

    // 1) Try ipapi.co
    try {
        const url = `https://ipapi.co/${ip || 'json'}/json/`;
        const res = await fetchWithTimeout(url);
        if (!res.ok) throw new Error(`ipapi.co ${res.status}`);
        const data = await res.json();
        return data;
    } catch (err) {
        console.warn('ipapi.co failed, falling back:', err.message);
    }

    // 2) Fallback to ip-api.com
    try {
        const url = `http://ip-api.com/json/${ip || ''}`;
        const res = await fetchWithTimeout(url);
        if (!res.ok) throw new Error(`ip-api.com ${res.status}`);
        const d = await res.json();
        return {
            ip:           d.query,
            country_name: d.country,
            region:       d.regionName,
            city:         d.city,
            latitude:     d.lat,
            longitude:    d.lon
        };
    } catch (err) {
        console.error('ip-api.com also failed:', err.message);
        throw new Error('GeoIP lookup failed');
    }
}

// GET /api/orders/cart
exports.getCart = async (req, res, next) => {
    try {
        let cart = await aggregateCart(req.user._id);
        res.status(200).json(cart);
    } catch (err) {
        next(err);
    }
};

// POST /api/orders/cart
exports.addToCart = async (req, res, next) => {
    try {
        const { productId, quantity = 1 } = req.body;
        const userId = req.user._id;

        // 1) Validate productId early
        if (!ObjectId.isValid(productId)) {
            return res.status(400).json({ error: 'Invalid product ID' });
        }

        const prod = await Product.findById(productId, 'price');
        if (!prod) return res.status(404).json({ error: 'Product not found' });

        // Single atomic update: if item exists, increment qty, else push new
        await Order.updateOne(
            { user: userId, isPaid: false },
            [
                {
                    $set: {
                        orderItems: {
                            $let: {
                                vars: {
                                    items: { $ifNull: ['$orderItems', []] }
                                },
                                in: {
                                    $cond: [
                                        {
                                            $in: [
                                                new ObjectId(productId),
                                                { $map: { input: '$$items', as: 'i', in: '$$i.product' } }
                                            ]
                                        },
                                        {
                                            $map: {
                                                input: '$$items',
                                                as: 'i',
                                                in: {
                                                    $cond: [
                                                        { $eq: ['$$i.product', new ObjectId(productId)] },
                                                        {
                                                            product: '$$i.product',
                                                            quantity: { $add: ['$$i.quantity', quantity] },
                                                            price: '$$i.price'
                                                        },
                                                        '$$i'
                                                    ]
                                                }
                                            }
                                        },
                                        {
                                            $concatArrays: [
                                                '$$items',
                                                [{ product: new ObjectId(productId), quantity, price: prod.price }]
                                            ]
                                        }
                                    ]
                                }
                            }
                        },
                        totalPrice: {
                            $add: [
                                { $ifNull: ['$totalPrice', 0] },
                                { $multiply: [prod.price, quantity] }
                            ]
                        },
                        createdAt: { $ifNull: ['$createdAt', new Date()] },
                        updatedAt: new Date()
                    }
                }
            ],
            { upsert: true }
        );

        const cart = await aggregateCart(userId);
        res.status(200).json({data: cart});
    } catch (err) {
        next(err);
    }
};

// PUT /api/orders/cart/:productId
// { quantity }
exports.updateCartItem = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const { quantity }  = req.body;
        const userId = req.user._id;

        // 1) Validate productId early
        if (!ObjectId.isValid(productId)) {
            return res.status(400).json({ error: 'Invalid product ID' });
        }

        // Recalculate totalPrice delta: fetch old qty and price
        const [{ oldItem }] = await Order.aggregate([
            { $match: { user: new ObjectId(userId), isPaid: false } },
            {
                $project: {
                    oldItem: {
                        $first: {
                            $filter: {
                                input: '$orderItems',
                                as: 'i',
                                cond: { $eq: ['$$i.product', new ObjectId(productId)] }
                            }
                        }
                    }
                }
            }
        ]);

        if (!oldItem) return res.status(404).json({ error: 'Item not in cart' });

        const deltaQty = quantity - oldItem.quantity;
        const deltaPrice = deltaQty * oldItem.price;

        // Update the item's quantity and adjust totalPrice
        await Order.updateOne(
            { user: userId, isPaid: false, 'orderItems.product': new ObjectId(productId) },
            {
                $set: { 'orderItems.$.quantity': quantity },
                $inc: { totalPrice: deltaPrice }
            }
        );

        // If quantity <= 0, also pull the item
        if (quantity <= 0) {
            await Order.updateOne(
                { user: userId, isPaid: false },
                { $pull: { orderItems: { product: new ObjectId(productId) } } }
            );
        }

        const cart = await aggregateCart(userId);
        res.status(200).json({data: cart});
    } catch (err) {
        next(err);
    }
};

// DELETE /api/orders/cart/:productId
exports.removeCartItem = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const userId = req.user._id;

        // 1) Validate productId early
        if (!ObjectId.isValid(productId)) {
            return res.status(400).json({ error: 'Invalid product ID' });
        }

        // Find the item price*qty to decrement totalPrice
        const [{ oldItem }] = await Order.aggregate([
            { $match: { user: new ObjectId(userId), isPaid: false } },
            {
                $project: {
                    oldItem: {
                        $first: {
                            $filter: {
                                input: '$orderItems',
                                as: 'i',
                                cond: { $eq: ['$$i.product', new ObjectId(productId)] }
                            }
                        }
                    }
                }
            }
        ]);

        if (!oldItem) return res.status(404).json({ error: 'Item not in cart' });

        const decrement = oldItem.price * oldItem.quantity;

        // Pull item and decrement price in one go
        await Order.updateOne(
            { user: userId, isPaid: false },
            {
                $pull: { orderItems: { product: new ObjectId(productId) } },
                $inc:  { totalPrice: -decrement }
            }
        );

        const cart = await aggregateCart(userId);
        res.status(200).json({data: cart});
    } catch (err) {
        next(err);
    }
};

exports.getUserDistance = async (req, res, next) => {
    try {
        // Extract real client IP (trust proxy must be set)
        let ip = (req.headers['x-forwarded-for'] || '')
                .split(',')[0].trim() ||
            req.socket.remoteAddress;
        if (ip.startsWith('::ffff:')) ip = ip.slice(7);
        if (ip === '::1' || ip === '127.0.0.1') ip = '';  // dev fallback

        // Lookup geo
        const geo = await lookupGeo(ip);

        // Parse coords
        const userLat = parseFloat(geo.latitude);
        const userLon = parseFloat(geo.longitude);

        // Compute distance
        const distKm = haversine(userLat, userLon, REF.latitude, REF.longitude);
        const distMi = distKm * 0.621371;

        // Return
        return res.json({
            data: { distance: parseFloat(distKm.toFixed(2)) }
        });
    } catch (err) {
        console.error("Distance lookup failed:", err);
        return res.status(500).json({ error: 'Could not calculate distance' });
    }
}

// POST /api/orders/checkout
exports.checkout = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const {shippingAddress, paymentMethod} = req.body;

        // 1) Load the unpaid order
        const order = await Order.findOne({user: userId, isPaid: false});
        if (!order) {
            return res
                .status(400)
                .json({error: 'No open cart found'});
        }

        // 2) Fail if no items
        if (!order.orderItems || order.orderItems.length === 0) {
            return res
                .status(400)
                .json({error: 'Cart is empty, cannot checkout'});
        }

        // 3) Otherwise finalize it
        order.shippingAddress = shippingAddress;
        order.paymentMethod = paymentMethod;
        order.isPaid = true;
        order.paidAt = new Date();

        await order.save();
        await order.populate('orderItems.product');

        return res.status(200).json({message: 'Order completed', data: order});
    } catch (err) {
        next(err);
    }
};

// *********************** APIs For Order History ***********************

// ==========================
// GET /api/orders/history
// View all paid orders (paginated)
// ==========================
exports.getOrderHistory = async (req, res, next) => {
    try {
        const page  = Math.max(1, parseInt(req.query.page, 10)  || 1);
        const limit = Math.max(1, parseInt(req.query.limit, 10) || 10);
        const skip  = (page - 1) * limit;

        const userId = req.user._id;

        const filter = { user: userId, isPaid: true };

        const totalNumberOfItems = await Order.countDocuments(filter);
        const data = await Order.find(filter)
            .populate('orderItems.product')
            .sort({ paidAt: -1 }) // newest orders first
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            currentPage: page,
            totalPages:  Math.max(1, Math.ceil(totalNumberOfItems / limit)),
            totalNumberOfItems,
            data
        });
    } catch (err) {
        next(err);
    }
};

// ==========================
// PUT /api/orders/:orderId
// Edit an existing paid order
// ==========================
exports.editPaidOrder = async (req, res, next) => {
    try {
        const { orderId } = req.params;
        const userId = req.user._id;
        const { shippingAddress, isDelivered, isShipped } = req.body;

        // Find the paid order belonging to the user
        const order = await Order.findOne({ _id: orderId, user: userId, isPaid: true });
        if (!order) {
            return res.status(404).json({ error: 'Paid order not found' });
        }

        // Update allowed fields
        if (shippingAddress) {
            order.shippingAddress = shippingAddress;
        }
        if (typeof isDelivered === 'boolean') {
            order.isDelivered = isDelivered;
            if (isDelivered) {
                order.deliveredAt = new Date();
            }
        }

        if (typeof isShipped === 'boolean') {
            order.isShipped = isShipped;
            if (isShipped) {
                order.shippedAt = new Date();
            }
        }

        await order.save();
        await order.populate('orderItems.product');

        res.status(201).json({ message: 'Order updated', data: order });
    } catch (err) {
        next(err);
    }
};

// ==========================
// POST /api/orders
// Create a new order
// ==========================
exports.createOrder = async (req, res, next) => {
    try {
        const { 
            orderItems,
            shippingAddress,
            paymentMethod,
            totalPrice
        } = req.body;

        if (!orderItems || !shippingAddress || !paymentMethod || !totalPrice) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const order = new Order({
            user: req.user._id,
            orderItems,
            shippingAddress,
            paymentMethod,
            totalPrice
        });

        const createdOrder = await order.save();
        res.status(201).json({ data: createdOrder });
    } catch (err) {
        next(err);
    }
};

// ==========================
// GET /api/orders
// Get all orders (admin only)
// ==========================
exports.getAllOrders = async (req, res, next) => {
    try {
        const page  = Math.max(1, parseInt(req.query.page, 10)  || 1);
        const limit = Math.max(1, parseInt(req.query.limit, 10) || 20);
        const skip  = (page - 1) * limit;

        const totalNumberOfItems = await Order.countDocuments();
        const orders = await Order.find()
            .populate('user', 'name email')
            .populate('orderItems.product', 'name price')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({ 
            data: orders,
            currentPage: page,
            totalPages: Math.ceil(totalNumberOfItems / limit),
            totalNumberOfItems
        });
    } catch (err) {
        next(err);
    }
};

// ==========================
// GET /api/orders/user
// Get user's orders
// ==========================
exports.getUserOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate('orderItems.product')
            .sort({ createdAt: -1 });
        res.status(200).json({ data: orders });
    } catch (err) {
        next(err);
    }
};

// ==========================
// GET /api/orders/:id
// Get order by ID
// ==========================
exports.getOrderById = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email')
            .populate('orderItems.product', 'name price image');

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Check if the user is admin or the order belongs to the user
        if (!req.user.isAdmin && order.user._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        res.status(200).json({ data: order });
    } catch (err) {
        next(err);
    }
};

// ==========================
// PUT /api/orders/:id
// Update order status
// ==========================
exports.updateOrder = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { isPaid, isDelivered, isShipped, status } = req.body;

        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        if (isPaid !== undefined) order.isPaid = isPaid;
        if (isDelivered !== undefined) order.isDelivered = isDelivered;
        if (isShipped !== undefined) order.isShipped = isShipped;
        if (status) order.status = status;

        if (isPaid) order.paidAt = Date.now();
        if (isDelivered) order.deliveredAt = Date.now();
        if (isShipped) order.shippedAt = Date.now();

        const updatedOrder = await order.save();
        res.status(200).json({ data: updatedOrder });
    } catch (err) {
        next(err);
    }
};

// ==========================
// DELETE /api/orders/:id
// Delete order (admin only)
// ==========================
exports.deleteOrder = async (req, res, next) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (err) {
        next(err);
    }
};

