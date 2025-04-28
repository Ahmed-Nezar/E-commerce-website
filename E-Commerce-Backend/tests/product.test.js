// tests/product.test.js
const request = require('supertest');
const mongoose = require('mongoose');
require('dotenv').config();

const app = require('../server');              // your Express app
const { Product } = require('../config/db');

describe('🛍️ Product & Wishlist API', () => {
    let tokenUser, tokenAdmin;
    let prodA, prodB;

    const userCreds = {
        email:  'jack@example.com',
        password: '1',
    };
    const adminCreds = {
        email:   'omaralaa927@gmail.com',
        password:'1',
    };

    beforeAll(async () => {
        // 1) connect to DB
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser:    true,
            useUnifiedTopology: true
        });

        // 4) seed two products
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

        // 5) login regular user
        let res = await request(app)
            .post('/api/auth/login')
            .send({ email: userCreds.email, password: userCreds.password })
            .expect(200);
        tokenUser = res.body.token;

        // 6) login admin user
        res = await request(app)
            .post('/api/auth/login')
            .send({ email: adminCreds.email, password: adminCreds.password })
            .expect(200);
        tokenAdmin = res.body.token;
    });

    afterAll(async () => {
        // Remove the two seeded products by _id
        await Product.deleteMany({ _id: { $in: [prodA._id, prodB._id] } });
        // Close mongoose connection
        await mongoose.connection.close();
    });


    // ————————————————— Tests —————————————————

    it('√ GET /api/products without token → error', async () => {
        const res = await request(app).get('/api/products').expect(401);
        expect(res.body.error).toMatch(/login first/i);
    });

    it('√ GET /api/products → list products', async () => {
        const res = await request(app)
            .get('/api/products')
            .set('Authorization', tokenUser)
            .expect(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThanOrEqual(2);
    });

    it('√ GET /api/products/:id invalid → 404', async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const res = await request(app)
            .get(`/api/products/${fakeId}`)
            .set('Authorization', tokenUser)
            .expect(404);
        expect(res.body.message).toMatch(/not found/i);
    });

    it('√ GET /api/products/:id → product detail', async () => {
        const res = await request(app)
            .get(`/api/products/${prodA._id}`)
            .set('Authorization', tokenUser)
            .expect(200);
        expect(res.body._id).toBe(prodA._id.toString());
        expect(res.body.name).toBe(prodA.name);
    });

    it('√ GET /api/products/wishlist → initially empty', async () => {
        const res = await request(app)
            .get('/api/products/wishlist')
            .set('Authorization', tokenUser)
            .expect(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body).toHaveLength(0);
    });

    it('√ POST /api/products/wishlist/:prod invalid → 404', async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const res = await request(app)
            .post(`/api/products/wishlist/${fakeId}`)
            .set('Authorization', tokenUser)
            .expect(404);
        expect(res.body.message).toMatch(/not found/i);
    });

    it('√ POST /api/products/wishlist/:prodA → add to wishlist', async () => {
        const res = await request(app)
            .post(`/api/products/wishlist/${prodA._id}`)
            .set('Authorization', tokenUser)
            .expect(200);
        expect(res.body).toContainEqual(
            expect.objectContaining({ _id: prodA._id.toString() })
        );
    });

    it('√ POST /api/products/wishlist/:prodA again → no duplicate', async () => {
        const res = await request(app)
            .post(`/api/products/wishlist/${prodA._id}`)
            .set('Authorization', tokenUser)
            .expect(200);
        // still one entry
        expect(res.body.filter(p => p._id === prodA._id.toString())).toHaveLength(1);
    });

    it('√ GET /api/products/wishlist → one item', async () => {
        const res = await request(app)
            .get('/api/products/wishlist')
            .set('Authorization', tokenUser)
            .expect(200);
        expect(res.body).toHaveLength(1);
    });

    it('√ DELETE /api/products/wishlist/:invalid → 200 no change', async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const res = await request(app)
            .delete(`/api/products/wishlist/${fakeId}`)
            .set('Authorization', tokenUser)
            .expect(200);
        // still one item
        expect(res.body).toHaveLength(1);
    });

    it('√ DELETE /api/products/wishlist/:prodA → removes item', async () => {
        const res = await request(app)
            .delete(`/api/products/wishlist/${prodA._id}`)
            .set('Authorization', tokenUser)
            .expect(200);
        expect(res.body).toHaveLength(0);
    });

    it('√ POST /api/products/create without admin → 403', async () => {
        const res = await request(app)
            .post('/api/products/create')
            .set('Authorization', tokenUser)
            .send({ name: 'X', category: 'Y', price: 1, stock:1 })
            .expect(403);
        expect(res.body.error).toMatch(/not authorized/i);
    });

    it('√ POST /api/products/create with admin → create product', async () => {
        const res = await request(app)
            .post('/api/products/create')
            .set('Authorization', tokenAdmin)
            .send({ name: 'NewProd', category: 'Misc', price: 50, stock: 7 })
            .expect(201);
        expect(res.body.name).toBe('NewProd');
        prodB = res.body; // re-use for next tests
    });

    it('√ PUT /api/products/update/:id without admin → 403', async () => {
        const res = await request(app)
            .put(`/api/products/update/${prodB._id}`)
            .set('Authorization', tokenUser)
            .send({ price: 60 })
            .expect(403);
        expect(res.body.error).toMatch(/not authorized/i);
    });

    it('√ PUT /api/products/update/:id with admin → update product', async () => {
        const res = await request(app)
            .put(`/api/products/update/${prodB._id}`)
            .set('Authorization', tokenAdmin)
            .send({ price: 60 })
            .expect(200);
        expect(res.body.price).toBe(60);
    });

    it('√ DELETE /api/products/delete/:id without admin → 403', async () => {
        const res = await request(app)
            .delete(`/api/products/delete/${prodB._id}`)
            .set('Authorization', tokenUser)
            .expect(403);
        expect(res.body.error).toMatch(/not authorized/i);
    });

    it('√ DELETE /api/products/delete/:id with admin → remove product', async () => {
        const res = await request(app)
            .delete(`/api/products/delete/${prodA._id}`)
            .set('Authorization', tokenAdmin)
            .expect(200);
        expect(res.body.message).toMatch(/deleted/);
    });

});
