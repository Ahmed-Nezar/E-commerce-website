const express = require('express');
const app = express();
const { connectDB } = require('./config/db');
const dotenv = require('dotenv');
const verifyToken = require('./middlewares/VerifyToken');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const couponRoutes = require('./routes/couponRoutes');
const cors = require('cors');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');
const path = require('path');

// Load .env from one directory up
dotenv.config({ path: path.resolve(__dirname, '../.env') });
// Connect to MongoDB
connectDB().catch(e => console.error(e));

const allowedOrigins = process.env.VITE_FRONTEND_URL.split(',').map(origin => origin.trim());

// CORS configuration
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, origin);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json()); // for JSON payloads

app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// Serve static files from the public directory
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Middleware to serve static files from avatars directory
app.use(
    '/avatar',
    express.static(path.join(__dirname, 'avatars'), {
        extensions: ['png']
    })
);

// Routes
//* Does not require login
    app.use('/api/auth', authRoutes);
//* require login for all other routes
    app.use('/api/users', verifyToken("user"), userRoutes);
    app.use('/api/products', productRoutes);
    app.use('/api/orders', verifyToken("user"), orderRoutes);
    app.use('/api/reviews', reviewRoutes);
    app.use('/api/coupons', couponRoutes);

// Error Handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

module.exports = app;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
