const express = require('express');
const { connectDB } = require('./config/db');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');
const path = require('path');

// Load .env from one directory up
dotenv.config({ path: path.resolve(__dirname, '../.env') });
connectDB().catch(e => console.error(e));

const app = express();
app.use(express.json()); // for JSON payloads

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Error Handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
