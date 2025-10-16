
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

describe('GET /albums', () => {
    test('should return all albums', async () => {
        const res = await request(app).get('/albums');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
    });
});

describe('GET /albums/:id', () => {
    test('should return an album by ID', async () => {
        const albums = await db.collection('albums').find().toArray();
        if (albums.length === 0) return; // Skip if no albums
        const albumId = albums[0]._id.toString();
        const res = await request(app).get(`/albums/${albumId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.data).toHaveProperty('_id', albumId);
    });
    test('should return 404 for non-existent album ID', async () => {
        const res = await request(app).get('/albums/000000000000000000000000');
        expect(res.statusCode).toBe(404);
    });
});