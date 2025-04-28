// tests/order.test.js
const request = require('supertest');
const mongoose = require('mongoose');
require('dotenv').config();

const app = require('../server');                 // your Express app
const { Product } = require('../config/db');

describe('🛒 Order Controller Flow (Deep Tests)', () => {
    let token;
    let prodA, prodB;
    const userCreds = {
        email:    'omaralaa927@gmail.com',
        password: '1',
    };

    beforeAll(async () => {
        // 1) connect to DB
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser:    true,
            useUnifiedTopology: true,
        });

        // 2) fetch two known products
        prodA = await Product.create({
            name:     'Test GPU',
            category: 'GPU',
            description: 'A great GPU',
            brand:    'NVIDIA',
            price:    100,
            stock:    10
        });
        prodB = await Product.create({
            name:     'Test CPU',
            category: 'CPU',
            description: 'A fast CPU',
            brand:    'Intel',
            price:    200,
            stock:    5
        });

        // 3) login to get token
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: userCreds.email, password: userCreds.password })
            .expect(200);

        token = res.body.token;
    });

    afterAll(async () => {
        // Remove the two seeded products by _id
        await Product.deleteMany({ _id: { $in: [prodA._id, prodB._id] } });
        await mongoose.connection.close();
    });

    it('0) GET /cart without token → error', async () => {
        const res = await request(app)
            .get('/api/orders/cart')
            .expect(401);
        expect(res.body.error).toMatch(/login first/i);
    });

    it('1) GET /cart → empty cart shell', async () => {
        const res = await request(app)
            .get('/api/orders/cart')
            .set('Authorization', token)
            .expect(200);

        expect(res.body).toMatchObject({
            orderItems: [],
            totalPrice: 0,
            isPaid:     false
        });
    });

    it('2) POST /cart add invalid product → 404', async () => {
        const res = await request(app)
            .post('/api/orders/cart')
            .set('Authorization', token)
            .send({ productId: new mongoose.Types.ObjectId().toString(), quantity: 1 })
            .expect(404);
        expect(res.body.message).toMatch(/product not found/i);
    });

    it('3) POST /cart → add prodA x2', async () => {
        const res = await request(app)
            .post('/api/orders/cart')
            .set('Authorization', token)
            .send({ productId: prodA._id, quantity: 2 })
            .expect(200);

        expect(res.body.orderItems).toHaveLength(1);
        expect(res.body.orderItems[0]).toMatchObject({
            product: expect.objectContaining({ _id: prodA._id.toString() }),
            quantity: 2,
            price: prodA.price
        });
        expect(res.body.totalPrice).toBe(2 * prodA.price);
    });

    it('4) POST /cart → add prodB x1', async () => {
        const res = await request(app)
            .post('/api/orders/cart')
            .set('Authorization', token)
            .send({ productId: prodB._id, quantity: 1 })
            .expect(200);

        expect(res.body.orderItems).toHaveLength(2);
        const itemB = res.body.orderItems.find(i => i.product._id === prodB._id.toString());
        expect(itemB).toMatchObject({ quantity: 1, price: prodB.price });
        expect(res.body.totalPrice).toBe(2 * prodA.price + 1 * prodB.price);
    });

    it('5) PUT /cart/:pid nonexistent → 404', async () => {
        const fakeId = new mongoose.Types.ObjectId().toString();
        const res = await request(app)
            .put(`/api/orders/cart/${fakeId}`)
            .set('Authorization', token)
            .send({ quantity: 5 })
            .expect(404);
        expect(res.body.message).toMatch(/item not in cart/i);
    });

    it('6) PUT /cart/:pid → update prodA to qty=5', async () => {
        const res = await request(app)
            .put(`/api/orders/cart/${prodA._id}`)
            .set('Authorization', token)
            .send({ quantity: 5 })
            .expect(200);

        const itemA = res.body.orderItems.find(i => i.product._id === prodA._id.toString());
        expect(itemA.quantity).toBe(5);
        expect(res.body.totalPrice).toBe(5 * prodA.price + 1 * prodB.price);
    });

    it('7) PUT /cart/:pid qty=0 → removes prodA', async () => {
        const res = await request(app)
            .put(`/api/orders/cart/${prodA._id}`)
            .set('Authorization', token)
            .send({ quantity: 0 })
            .expect(200);

        // prodA should be removed
        expect(res.body.orderItems.find(i => i.product._id === prodA._id.toString())).toBeUndefined();
    });

    it('8) DELETE /cart/:pid nonexistent → 404', async () => {
        const fakeId = new mongoose.Types.ObjectId().toString();
        const res = await request(app)
            .delete(`/api/orders/cart/${fakeId}`)
            .set('Authorization', token)
            .expect(404);
        expect(res.body.message).toMatch(/item not in cart/i);
    });

    it('9) DELETE /cart/:pid → remove prodB', async () => {
        // first re-add prodB
        await request(app)
            .post('/api/orders/cart')
            .set('Authorization', token)
            .send({ productId: prodB._id, quantity: 3 })
            .expect(200);

        const res = await request(app)
            .delete(`/api/orders/cart/${prodB._id}`)
            .set('Authorization', token)
            .expect(200);

        expect(res.body.orderItems).toHaveLength(0);
        expect(res.body.totalPrice).toBe(0);
    });

    it('10) POST /checkout with empty cart → 400', async () => {
        const res = await request(app)
            .post('/api/orders/checkout')
            .set('Authorization', token)
            .send({ shippingAddress: {}, paymentMethod: 'Card' })
            .expect(400);

        expect(res.body.message).toMatch(/cart is empty/i);
    });

    it('11) Full flow: add then checkout', async () => {
        // add items back
        await request(app)
            .post('/api/orders/cart')
            .set('Authorization', token)
            .send({ productId: prodA._id, quantity: 1 })
            .expect(200);

        // now checkout
        const shipping = {
            address:    '123 Test St',
            city:       'Cairo',
            postalCode: '11511',
            country:    'Egypt'
        };
        const res = await request(app)
            .post('/api/orders/checkout')
            .set('Authorization', token)
            .send({ shippingAddress: shipping, paymentMethod: 'Credit Card' })
            .expect(200);

        expect(res.body.order.isPaid).toBe(true);
        expect(res.body.order.shippingAddress).toMatchObject(shipping);
    });

    it('12) GET /cart after checkout → empty shell again', async () => {
        const res = await request(app)
            .get('/api/orders/cart')
            .set('Authorization', token)
            .expect(200);

        expect(res.body.orderItems).toHaveLength(0);
        expect(res.body.isPaid).toBe(false);
    });
});
