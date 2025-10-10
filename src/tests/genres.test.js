const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { MongoClient } = require('mongodb');

/**
 * Genre Collection Tests
 * Responsible Team Member: Nehikhare Efehi
 * Tests for Genre CRUD operations
 */

describe('Genre API Tests', () => {
  let mongoServer;
  let db;
  let app;
  
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    const client = new MongoClient(mongoUri);
    await client.connect();
    db = client.db('musicpro_test');
    
    // Mock database connection
    jest.mock('../config/db', () => ({
      connectToDb: jest.fn(),
      getDb: () => db
    }));
    
    app = require('../server');
  });

  afterAll(async () => {
    if (mongoServer) {
      await mongoServer.stop();
    }
  });

  beforeEach(async () => {
    await db.collection('genres').deleteMany({});
  });

  describe('GET /api/genres', () => {
    test('should return empty array when no genres exist', async () => {
      const response = await request(app)
        .get('/api/genres')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
    });

    test('should return genres with pagination', async () => {
      // Create test genres
      const genres = [];
      for (let i = 1; i <= 5; i++) {
        genres.push({
          name: `Genre ${i}`,
          description: `Description ${i}`,
          originDecade: '2000s',
          parentGenre: 'Pop',
          characteristics: ['test'],
          popularArtists: ['test artist'],
          subgenres: ['test sub'],
          popularityScore: 50,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
      await db.collection('genres').insertMany(genres);

      const response = await request(app)
        .get('/api/genres?limit=3')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBeLessThanOrEqual(3);
    });
  });

  describe('POST /api/genres', () => {
    test('should create a new genre with valid data', async () => {
      const genreData = {
        name: 'Test Rock',
        description: 'A test rock genre',
        originDecade: '1970s',
        parentGenre: 'Blues',
        characteristics: ['Electric guitars', 'Heavy drums'],
        popularArtists: ['Led Zeppelin', 'Queen'],
        subgenres: ['Hard Rock', 'Classic Rock'],
        popularityScore: 85
      };

      const response = await request(app)
        .post('/api/genres')
        .send(genreData)
        .expect(201);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(genreData.name);
      expect(response.body.data).toHaveProperty('_id');
    });

    test('should return validation error for missing required fields', async () => {
      const invalidGenre = {
        name: 'Test Genre'
        // Missing required fields
      };

      const response = await request(app)
        .post('/api/genres')
        .send(invalidGenre)
        .expect(400);
      
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Validation');
    });
  });

  describe('GET /api/genres/:id', () => {
    test('should return specific genre by ID', async () => {
      const genre = await db.collection('genres').insertOne({
        name: 'Jazz',
        description: 'Jazz music genre',
        originDecade: '1920s',
        parentGenre: 'Blues',
        characteristics: ['Improvisation'],
        popularArtists: ['Miles Davis'],
        subgenres: ['Bebop'],
        popularityScore: 75,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      const response = await request(app)
        .get(`/api/genres/${genre.insertedId}`)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Jazz');
    });

    test('should return 400 for invalid ID format', async () => {
      const response = await request(app)
        .get('/api/genres/invalid-id')
        .expect(400);
      
      expect(response.body.success).toBe(false);
    });

    test('should return 404 for non-existent genre', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .get(`/api/genres/${fakeId}`)
        .expect(404);
      
      expect(response.body.success).toBe(false);
    });
  });
});
const app = require('../server');