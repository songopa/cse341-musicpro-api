const express = require('express');
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

// Load the swagger.yaml file
const swaggerDocument = YAML.load(
    path.join(__dirname, '../../swagger/swagger.yaml')
);

// Serve Swagger UI at /api-docs
router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = router;