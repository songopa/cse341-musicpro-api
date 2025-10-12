const express = require('express');
const router = express.Router();
const controller = require('../controllers/genresController');
const checkAuth = require('../middleware/checkAuth');

/**
 * Genre Routes - Full CRUD API Endpoints
 * Responsible Team Member: Nehikhare Efehi 
 * Collection: Genres (8+ fields - exceeds 7+ requirement)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Genre:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - originDecade
 *         - characteristics
 *         - popularArtists
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ObjectId
 *         name:
 *           type: string
 *           description: Genre name (unique)
 *           maxLength: 50
 *         description:
 *           type: string
 *           description: Detailed genre description
 *           maxLength: 500
 *         originDecade:
 *           type: string
 *           enum: ['1950s', '1960s', '1970s', '1980s', '1990s', '2000s', '2010s', '2020s']
 *           description: Decade when genre emerged
 *         parentGenre:
 *           type: string
 *           description: Parent genre if applicable
 *         characteristics:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of genre characteristics
 *         popularArtists:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of popular artists in this genre
 *         subgenres:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of subgenres
 *         popularityScore:
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
 * /api/genres:
 *   get:
 *     summary: Get all genres with optional filtering and pagination
 *     tags: [Genres]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by genre name (case-insensitive)
 *       - in: query
 *         name: originDecade
 *         schema:
 *           type: string
 *         description: Filter by origin decade
 *       - in: query
 *         name: parentGenre
 *         schema:
 *           type: string
 *         description: Filter by parent genre
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
 *         description: Genres retrieved successfully
 *       500:
 *         description: Internal server error
 */
router.get('/', controller.getAllGenres);

/**
 * @swagger
 * /api/genres/{id}:
 *   get:
 *     summary: Get genre by ID
 *     tags: [Genres]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Genre ObjectId
 *     responses:
 *       200:
 *         description: Genre retrieved successfully
 *       400:
 *         description: Invalid genre ID format
 *       404:
 *         description: Genre not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', controller.getGenreById);

/**
 * @swagger
 * /api/genres:
 *   post:
 *     summary: Create new genre (requires authentication)
 *     tags: [Genres]
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
 *               - description
 *               - originDecade
 *               - characteristics
 *               - popularArtists
 *             properties:
 *               name:
 *                 type: string
 *                 maxLength: 50
 *               description:
 *                 type: string
 *                 maxLength: 500
 *               originDecade:
 *                 type: string
 *                 enum: ['1950s','1960s','1970s','1980s','1990s','2000s','2010s','2020s']
 *               parentGenre:
 *                 type: string
 *               characteristics:
 *                 type: array
 *                 items:
 *                   type: string
 *               popularArtists:
 *                 type: array
 *                 items:
 *                   type: string
 *               subgenres:
 *                 type: array
 *                 items:
 *                   type: string
 *               popularityScore:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 100
 *     responses:
 *       201:
 *         description: Genre created successfully  
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       409:
 *         description: Genre name already exists
 *       500:
 *         description: Internal server error
 */
router.post('/', checkAuth, controller.createGenre);

/**
 * @swagger
 * /api/genres/{id}:
 *   put:
 *     summary: Update genre by ID (requires authentication)
 *     tags: [Genres]
 *     security:
 *       - Auth0: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Genre ObjectId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Genre'
 *     responses:
 *       200:
 *         description: Genre updated successfully
 *       400:
 *         description: Invalid ID or validation error
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Genre not found
 *       409:
 *         description: Genre name already exists
 *       500:
 *         description: Internal server error
 */
router.put('/:id', checkAuth, controller.updateGenre);

/**
 * @swagger
 * /api/genres/{id}:
 *   delete:
 *     summary: Delete genre by ID (requires authentication)
 *     tags: [Genres]
 *     security:
 *       - Auth0: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Genre ObjectId
 *     responses:
 *       200:
 *         description: Genre deleted successfully
 *       400:
 *         description: Invalid genre ID format
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Genre not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', checkAuth, controller.deleteGenre);

module.exports = router;



module.exports = router;
