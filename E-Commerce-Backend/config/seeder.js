// seeder.js
const app = require('../server');
const path = require('path');
const { User, Product, Review, Order, Coupon } = require('./db');
const mongoose = require('mongoose');

async function seedData() {
    try {
        // 1) Connect
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser:    true,
            useUnifiedTopology: true
        });

        // 2) Clear existing data
        await Promise.all([
            User.deleteMany(),
            Product.deleteMany(),
            Review.deleteMany(),
            Order.deleteMany(),
            Coupon.deleteMany()
        ]);

        // 3) Seed Users
        const usersData = [
            { name: 'Alice Smith',         email: 'alice@example.com',       password: '1',     gender: 'Female' },
            { name: 'Bob Johnson',         email: 'bob@example.com',         password: '1',     gender: 'Male'   },
            { name: 'Carol Williams',      email: 'carol@example.com',       password: '1',     gender: 'Female' },
            { name: 'David Brown',         email: 'david@example.com',       password: '1',     gender: 'Male'   },
            { name: 'Eve Davis',           email: 'eve@example.com',         password: '1',     gender: 'Female' },
            { name: 'Frank Miller',        email: 'frank@example.com',       password: '1',     gender: 'Male'   },
            { name: 'Grace Wilson',        email: 'grace@example.com',       password: '1',     gender: 'Female' },
            { name: 'Hank Moore',          email: 'hank@example.com',        password: '1',     gender: 'Male'   },
            { name: 'Ivy Taylor',          email: 'ivy@example.com',         password: '1',     gender: 'Female' },
            { name: 'Jack Anderson',       email: 'jack@example.com',        password: '1',     gender: 'Male'   },
            { name: 'Omar Alaa',           email: 'omaralaa927@gmail.com',   password: '1',     gender: 'Male', isAdmin: true   },
            { name: 'Ahmed Nezar',         email: 'ahmednezarrr@gmail.com',  password: '1',     gender: 'Male', isAdmin: true   },
            { name: 'Abdelrahman Hesham',  email: 'ahksase2312@gmail.com',   password: '12345', gender: 'Male', isAdmin: true   },
        ];
        const createdUsers = await User.insertMany(usersData);
        const userIds = createdUsers.map(u => u._id);

        // 4) Seed Products
        const productsData = [
            { name: 'NVIDIA RTX 4090',      category: 'GPU',         brand: 'NVIDIA',   description: 'Top-tier gaming GPU',      price: 1599.99, image: '/images/RTX_4090.jpg',       stock: 5,  rating: 4.9 },
            { name: 'AMD Ryzen 9 7950X',     category: 'CPU',         brand: 'AMD',      description: '16-core desktop CPU',      price: 699.99,  image: '/images/Ryzen9_7950X.jpg',     stock: 10, rating: 4.8 },
            { name: 'Samsung 980 Pro 1TB',    category: 'Storage',     brand: 'Samsung',  description: 'High-speed NVMe SSD',      price: 149.99,  image: '/images/980Pro_1TB.jpg',      stock: 20, rating: 4.7 },
            { name: 'Corsair Vengeance 16GB', category: 'Memory',      brand: 'Corsair',  description: 'DDR5 RAM kit',             price: 129.99,  image: '/images/Vengeance_16GB.jpg',  stock: 15, rating: 4.6 },
            { name: 'ASUS ROG Strix B650E',   category: 'Motherboard', brand: 'ASUS',     description: 'AM5 ATX motherboard',      price: 279.99,  image: '/images/ROG_B650E.jpg',      stock: 8,  rating: 4.5 },
            { name: 'Seasonic Prime TX-850', category: 'PSU',         brand: 'Seasonic', description: '850W Platinum PSU',        price: 189.99,  image: '/images/Prime_TX-850.jpg',   stock: 12, rating: 4.8 },
            { name: 'Lian Li O11 Dynamic',   category: 'Case',        brand: 'Lian Li',  description: 'Tempered glass ATX case',  price: 149.99,  image: '/images/O11_Dynamic.jpg',    stock: 7,  rating: 4.7 },
            { name: 'LG UltraGear 27GN950',   category: 'Monitor',     brand: 'LG',       description: '4K 144Hz gaming monitor',  price: 799.99,  image: '/images/27GN950.jpg',       stock: 6,  rating: 4.6 },
            { name: 'Keychron K8 Pro',       category: 'Keyboard',    brand: 'Keychron', description: 'Wireless mechanical keyboard', price: 129.99, image: '/images/K8_Pro.jpg',        stock: 18, rating: 4.5 },
            { name: 'Logitech G502 Hero',    category: 'Mouse',       brand: 'Logitech', description: 'Wired gaming mouse',       price: 49.99,   image: '/images/G502_Hero.jpg',     stock: 25, rating: 4.8 },
        ];
        const createdProducts = await Product.insertMany(productsData);
        const productIds = createdProducts.map(p => p._id);

        // 5) Seed Wishlist for a few users
        //   - give user0 the first 3 products, user1 the next 2
        await User.findByIdAndUpdate(userIds[0], { $set: { wishList: productIds.slice(0,3) } });
        await User.findByIdAndUpdate(userIds[1], { $set: { wishList: productIds.slice(3,5) } });

        // 6) Seed Reviews (one per product)
        const reviewComments = [
            'Excellent!', 'Really good', 'Worth the price', 'Top performance',
            'Average', 'Solid build', 'Highly recommend', 'Good value',
            'Fantastic', 'Very pleased'
        ];
        const reviewsData = createdProducts.map((prod, i) => ({
            user:    userIds[i % userIds.length],
            product: productIds[i],
            rating:  [5,4,4,5,3,4,5,4,5,4][i],
            comment: reviewComments[i]
        }));
        await Review.insertMany(reviewsData);

        // 7) Seed Orders (all paid; alternate delivered)
        const ordersData = createdUsers.map((u, i) => ({
            user: u._id,
            orderItems: [{
                product: productIds[i % productIds.length],
                quantity: (i % 3) + 1,
                price: createdProducts[i % createdProducts.length].price
            }],
            shippingAddress: {
                address: `${i+1} Main St`,
                city: 'Cairo',
                postalCode: '11511',
                country: 'Egypt'
            },
            paymentMethod: 'Credit Card',
            totalPrice: createdProducts[i % createdProducts.length].price * ((i % 3) + 1),
            isPaid: true,
            paidAt: new Date(),
            isDelivered: i % 2 === 0,
            deliveredAt: i % 2 === 0 ? new Date() : undefined
        }));
        await Order.insertMany(ordersData);

        // 8) Seed Coupons
        const couponsData = [
            { code: 'SAVE10',    discountPercentage: 10, validUntil: new Date('2025-12-31'), usageLimit: 100 },
            { code: 'SAVE15',    discountPercentage: 15, validUntil: new Date('2025-11-30'), usageLimit: 50 },
            { code: 'NEWUSER',   discountPercentage: 20, validUntil: new Date('2025-12-31'), usageLimit: 1000 },
            { code: 'FREESHIP',  discountPercentage: 100,validUntil: new Date('2025-10-31'), usageLimit: 500 },
            { code: 'RAMDEAL',   discountPercentage: 5,  validUntil: new Date('2025-09-30'), usageLimit: 200 },
            { code: 'CPUSAVE',   discountPercentage: 7,  validUntil: new Date('2025-08-31'), usageLimit: 150 },
            { code: 'GPUPROMO',  discountPercentage: 12, validUntil: new Date('2025-07-31'), usageLimit: 120 },
            { code: 'MON10',     discountPercentage: 10, validUntil: new Date('2025-06-30'), usageLimit: 80 },
            { code: 'CASE5',     discountPercentage: 5,  validUntil: new Date('2025-05-31'), usageLimit: 60 },
            { code: 'KEYMOUSE',  discountPercentage: 8,  validUntil: new Date('2025-04-30'), usageLimit: 40 },
        ];
        await Coupon.insertMany(couponsData);

        console.log('✅ Seed data inserted');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error seeding data:', err);
        process.exit(1);
    }
}

seedData();
