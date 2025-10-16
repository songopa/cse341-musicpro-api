
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

describe('GET /labels', () => {
    test('should return all labels', async () => {
        const res = await request(app).get('/labels');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
    });
});

describe('GET /labels/:id', () => {
    test('should return a label by ID', async () => {
        const labels = await db.collection('labels').find().toArray();
        if (labels.length === 0) return; // Skip if no labels
        const labelId = labels[0]._id.toString();
        const res = await request(app).get(`/labels/${labelId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.data).toHaveProperty('_id', labelId);
    }); 
    test('should return 404 for non-existent label ID', async () => {
        const res = await request(app).get('/labels/000000000000000000000000');
        expect(res.statusCode).toBe(404);
    });
});
