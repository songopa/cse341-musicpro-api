const express = require('express');
const router = express.Router();
const labelsController = require('../controllers/labelsController');
const { requiresAuth } = require('express-openid-connect'); 

//  (GET)
router.get('/', labelsController.getAll); 
router.get('/:id', labelsController.getById);

// (POST, PUT, DELETE) - Auth
router.post('/', requiresAuth(), labelsController.create); 
router.put('/:id', requiresAuth(), labelsController.update);
router.delete('/:id', requiresAuth(), labelsController.remove);

module.exports = router;
