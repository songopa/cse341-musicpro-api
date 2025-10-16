const express = require('express');
const router = express.Router();
const controller = require('../controllers/genresController');
const checkAuth = require('../middleware/checkAuth');

/**
 * Genre Routes - Full CRUD API Endpoints
 * Responsible Team Member: Nehikhare Efehi 
 * Collection: Genres (8+ fields - exceeds 7+ requirement)
 */

router.get('/', controller.getAllGenres);
router.get('/:id', controller.getGenreById);

router.post('/', checkAuth, controller.createGenre);
router.put('/:id', checkAuth, controller.updateGenre);
router.delete('/:id', checkAuth, controller.deleteGenre);

module.exports = router;