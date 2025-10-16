
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

describe('GET /genres', () => {
    test('should return all genres', async () => {
        const res = await request(app).get('/genres');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
    });
});

describe('GET /genres/:id', () => {
    test('should return a genre by ID', async () => {
        const genres = await db.collection('genres').find().toArray();
        if (genres.length === 0) return; // Skip if no genres
        const genreId = genres[0]._id.toString();
        const res = await request(app).get(`/genres/${genreId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.data).toHaveProperty('_id', genreId);
    });
    test('should return 404 for non-existent genre ID', async () => {
        const res = await request(app).get('/genres/000000000000000000000000');
        expect(res.statusCode).toBe(404);
    });
});
