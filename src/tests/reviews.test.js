
const request = require('supertest');
const app = require('../server');
const { connectToDb, getDb } = require('../config/db');

let db;

beforeAll(async () => {
    await connectToDb();
    db = getDb();
});

afterAll(async () => {
    // Close DB connection when tests are done
    if (db) {
        const client = db.client;
        if (client) await client.close();
    }
});

describe('GET /reviews', () => {
    test('should return all reviews', async () => {
        const res = await request(app).get('/reviews');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
    });
});

describe('GET /reviews/:id', () => {
    test('should return a review by ID', async () => {
        const reviews = await db.collection('reviews').find().toArray();
        if (reviews.length === 0) return; // Skip if no reviews
        const reviewId = reviews[0]._id.toString();
        const res = await request(app).get(`/reviews/${reviewId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.data).toHaveProperty('_id', reviewId);
    });
    test('should return 404 for non-existent review ID', async () => {
        const res = await request(app).get('/reviews/000000000000000000000000');
        expect(res.statusCode).toBe(404);
    });
});