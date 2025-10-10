const express = require('express');
const router = express.Router();
const reviewsController = require('../controllers/reviewsController');
const { requiresAuth } = require('express-openid-connect'); 

//  (GET)
router.get('/', reviewsController.getAll); 
router.get('/:id', reviewsController.getById);

// (POST, PUT, DELETE) - Auth
router.post('/', requiresAuth(), reviewsController.create); 
router.put('/:id', requiresAuth(), reviewsController.update);
router.delete('/:id', requiresAuth(), reviewsController.remove);

module.exports = router;