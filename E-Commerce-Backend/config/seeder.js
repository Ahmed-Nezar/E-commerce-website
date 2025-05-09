// seeder.js
const app = require('../server');
const path = require('path');
const { User, Product, Review, Order, Coupon } = require('./db');
const mongoose = require('mongoose');

async function seedData() {
    try {
        // 1) Connect
        await mongoose.connect(process.env.MONGO_URI_Local, {
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

        // read from json file and set products data
        const productsData = require("./productsData.json");

        const createdProducts = await Product.insertMany(productsData);
        const productIds = createdProducts.map(p => p._id);

        // 5) Seed Wishlist for a few users
        //   - give user0 the first 3 products, user1 the next 2
        await User.findByIdAndUpdate(userIds[0], { $set: { wishList: productIds.slice(0,3) } });
        await User.findByIdAndUpdate(userIds[1], { $set: { wishList: productIds.slice(3,5) } });

        // ————— 6) Seed Reviews —————
        const reviewComments = [
            'Excellent!', 'Really good', 'Worth the price', 'Top performance',
            'Average', 'Solid build', 'Highly recommend', 'Good value',
            'Fantastic', 'Very pleased'
        ];

        const reviewsData = createdProducts.map((prod, i) => ({
            user:    userIds[i % userIds.length],
            product: prod._id,
            // pick rating from 1–5 (or from your small array via modulo)
            rating:  reviewComments.length
                ? [5,4,4,5,3,4,5,4,5,4][i % reviewComments.length]
                : Math.floor(Math.random() * 5) + 1,
            comment: reviewComments[i % reviewComments.length]
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
            isShipped:   i % 2 === 0,
            isDelivered: i % 2 === 0,
            deliveredAt: i % 2 === 0 ? new Date() : undefined,
            shippedAt:   i % 2 !== 0 ? new Date() : undefined
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
