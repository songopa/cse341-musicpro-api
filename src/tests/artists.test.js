
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

describe('GET /artists', () => {
    test('should return all artists', async () => {
        const res = await request(app).get('/artists');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
    });
});

describe('GET /artists/:id', () => {
    test('should return an artist by ID', async () => {
        const artists = await db.collection('artists').find().toArray();
        if (artists.length === 0) return; // Skip if no artists
        const artistId = artists.data[0]._id.toString();
        console.log(artistId)
        const res = await request(app).get(`/artists/${artistId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.data).toHaveProperty('_id', artistId);
    });
    test('should return 404 for non-existent artist ID', async () => {
        const res = await request(app).get('/artists/000000000000000000000000');
        expect(res.statusCode).toBe(404);
    });
});
