const express = require('express');
const router = express.Router();
const controller = require('../controllers/artistsController');
const checkAuth = require('../middleware/checkAuth');

/**
 * Artist Routes - Full CRUD API Endpoints
 * Responsible Team Member: Nehikhare Efehi (covering for Letlotlo)
 * Collection: Artists (10 fields - exceeds 7+ requirement)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Artist:
 *       type: object
 *       required:
 *         - name
 *         - biography
 *         - genres
 *         - activeYears
 *         - country
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ObjectId
 *         name:
 *           type: string
 *           description: Artist name (unique)
 *           maxLength: 100
 *         biography:
 *           type: string
 *           description: Artist biography
 *           maxLength: 1000
 *         genres:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of music genres
 *         activeYears:
 *           type: string
 *           description: Period when artist was/is active
 *           example: "1990-2023"
 *         country:
 *           type: string
 *           description: Artist's country of origin
 *         albums:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of album names
 *         labels:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of record labels
 *         socialMedia:
 *           type: object
 *           description: Social media links
 *           properties:
 *             twitter:
 *               type: string
 *             instagram:
 *               type: string
 *             facebook:
 *               type: string
 *             youtube:
 *               type: string
 *         isActive:
 *           type: boolean
 *           default: true
 *           description: Whether artist is currently active
 *         popularity:
 *           type: number
 *           minimum: 1
 *           maximum: 100
 *           default: 50
 *           description: Popularity rating (1-100)
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/artists:
 *   get:
 *     summary: Get all artists with optional filtering and pagination
 *     tags: [Artists]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by artist name (case-insensitive)
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *         description: Filter by country
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *         description: Filter by genre
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Artists retrieved successfully
 *       500:
 *         description: Internal server error
 */
router.get('/', controller.getAllArtists);

/**
 * @swagger
 * /api/artists/{id}:
 *   get:
 *     summary: Get artist by ID
 *     tags: [Artists]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Artist ObjectId
 *     responses:
 *       200:
 *         description: Artist retrieved successfully
 *       400:
 *         description: Invalid artist ID format
 *       404:
 *         description: Artist not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', controller.getArtistById);

/**
 * @swagger
 * /api/artists:
 *   post:
 *     summary: Create new artist (requires authentication)
 *     tags: [Artists]
 *     security:
 *       - Auth0: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - biography
 *               - genres
 *               - activeYears
 *               - country
 *             properties:
 *               name:
 *                 type: string
 *                 maxLength: 100
 *               biography:
 *                 type: string
 *                 maxLength: 1000
 *               genres:
 *                 type: array
 *                 items:
 *                   type: string
 *               activeYears:
 *                 type: string
 *                 example: "1990-2023"
 *               country:
 *                 type: string
 *               albums:
 *                 type: array
 *                 items:
 *                   type: string
 *               labels:
 *                 type: array
 *                 items:
 *                   type: string
 *               socialMedia:
 *                 type: object
 *               isActive:
 *                 type: boolean
 *               popularity:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 100
 *     responses:
 *       201:
 *         description: Artist created successfully  
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       409:
 *         description: Artist name already exists
 *       500:
 *         description: Internal server error
 */
router.post('/', checkAuth, controller.createArtist);

/**
 * @swagger
 * /api/artists/{id}:
 *   put:
 *     summary: Update artist by ID (requires authentication)
 *     tags: [Artists]
 *     security:
 *       - Auth0: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Artist ObjectId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Artist'
 *     responses:
 *       200:
 *         description: Artist updated successfully
 *       400:
 *         description: Invalid ID or validation error
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Artist not found
 *       409:
 *         description: Artist name already exists
 *       500:
 *         description: Internal server error
 */
router.put('/:id', checkAuth, controller.updateArtist);

/**
 * @swagger
 * /api/artists/{id}:
 *   delete:
 *     summary: Delete artist by ID (requires authentication)
 *     tags: [Artists]
 *     security:
 *       - Auth0: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Artist ObjectId
 *     responses:
 *       200:
 *         description: Artist deleted successfully
 *       400:
 *         description: Invalid artist ID format
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Artist not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', checkAuth, controller.deleteArtist);

module.exports = router;