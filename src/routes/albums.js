const express = require('express');
const router = express.Router();
const controller = require('../controllers/albumsController');
const checkAuth = require('../middleware/checkAuth');
/**
 * Album Routes - Full CRUD API Endpoints
 * Responsible Team Member: Julius Songopa
 */

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', checkAuth, controller.create);
router.put('/:id', checkAuth, controller.update);
router.delete('/:id', checkAuth, controller.remove);

module.exports = router;
