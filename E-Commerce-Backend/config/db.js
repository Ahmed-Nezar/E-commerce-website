const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const clientOptions = { serverApi: { version: '1', strict: false, deprecationErrors: true } };

async function connectDB() {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is not defined!');
        }
        // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
        await mongoose.connect(process.env.MONGO_URI, clientOptions);
        await mongoose.connection.db.admin().command({ ping: 1 });
        console.log("Connected to MongoDB (Online - Cloud)");
    } catch (e) {
        throw new Error("Error connecting to MongoDB (Online - Cloud)");
    }
}

// Define Schema and Model for the database
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    gender: {
        type: String,
        required: true,
        enum: ['Male', 'Female'],
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePic: { type: String, default: '' },
    isAdmin: { type: Boolean, default: false },
    wishList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    }]
}, { timestamps: true });

// Hash password and set a random avatar before saving
userSchema.pre('save', async function(next) {
    // 1) Hash password if modified
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }

    // 2) Only set profilePic if new user or gender changed or not provided
    if (this.isNew || this.isModified('gender') || !this.profilePic) {
        const [min, max] = this.gender === 'Male' ? [1, 50] : [51, 100];
        const rand = Math.floor(Math.random() * (max - min + 1)) + min;
        // depending on your static route, you might need “/avatar/” or omit it
        this.profilePic = `${process.env.VITE_BACKEND_URL}/avatar}/${rand}`;
    }

    next();
});

// Set a random avatar before insertMany
userSchema.pre('insertMany', async function(next, docs) {
    for (let doc of docs) {
        doc.password = await bcrypt.hash(doc.password, 10);
        // only set if missing
        if (!doc.profilePic) {
            const [min, max] = doc.gender === 'Male' ? [1, 50] : [51, 100];
            const rand       = Math.floor(Math.random() * (max - min + 1)) + min;
            doc.profilePic   = `${process.env.VITE_BACKEND_URL}/avatar/${rand}`;
        }
    }
    next();
});

const User = mongoose.model('User', userSchema);

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true }, // e.g. GPU, Monitor, PSU
    description: { type: String },
    brand: { type: String },
    price: { type: Number, required: true },
    image: { type: String }, // URL or path
    stock: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 }
}, { timestamps: true });
const Product = mongoose.model('Product', productSchema);

const reviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    rating: { type: Number, required: true },
    comment: { type: String },
}, { timestamps: true });
const Review = mongoose.model('Review', reviewSchema);

// Item added to cart will have isPaid=false ELSE it will be true
const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderItems: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }
    }],
    shippingAddress: {
        address: String,
        city: String,
        postalCode: String,
        country: String
    },
    paymentMethod: { type: String, required: true },
    totalPrice: { type: Number, required: true },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, default: false },
    isShipped: { type: Boolean, default: false },
    deliveredAt: { type: Date },
    shippedAt: { type: Date },
}, { timestamps: true });
const Order = mongoose.model('Order', orderSchema);

const couponSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    discountPercentage: { type: Number, required: true },
    validUntil: { type: Date, required: true },
    usageLimit: { type: Number, default: 1 }
});
const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = {
    connectDB,
    User, Product, Review, Order, Coupon
};
