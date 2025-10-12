const express = require('express');
const router = express.Router();
const reviewsController = require('../controllers/reviewsController');
const checkAuth = require('../middleware/checkAuth'); 

//  (GET)
router.get('/', reviewsController.getAll); 
router.get('/:id', reviewsController.getById);

// (POST, PUT, DELETE) - Auth
router.post('/', checkAuth, reviewsController.create); 
router.put('/:id', checkAuth, reviewsController.update);
router.delete('/:id', checkAuth, reviewsController.remove);

module.exports = router;