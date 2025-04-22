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
function corsOptionsDelegate (origin, callback) {
    // Check if the origin is in the allowedOrigins array
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
    } else {
        callback(new Error('Not allowed by CORS'));
    }
}

// CORS configuration
const corsOptions = {
    origin: corsOptionsDelegate,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json()); // for JSON payloads

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
    app.use('/api/users', verifyToken("admin"), userRoutes);
    app.use('/api/products', verifyToken("user"), productRoutes);
    app.use('/api/orders', verifyToken("user"), orderRoutes);
    app.use('/api/reviews', verifyToken("user"), reviewRoutes);
    app.use('/api/coupons', verifyToken("admin"), couponRoutes);

// Error Handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
