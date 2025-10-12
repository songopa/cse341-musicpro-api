const express = require('express');
const router = express.Router();
const labelsController = require('../controllers/labelsController');
const checkAuth = require('../middleware/checkAuth');

//  (GET)
router.get('/', labelsController.getAll); 
router.get('/:id', labelsController.getById);

// (POST, PUT, DELETE) - Auth
router.post('/', checkAuth, labelsController.create); 
router.put('/:id', checkAuth, labelsController.update);
router.delete('/:id', checkAuth, labelsController.remove);

module.exports = router;
