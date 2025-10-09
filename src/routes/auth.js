const express = require('express');
const router = express.Router();

router.get('/profile', (req, res) => res.send(req.oidc && req.oidc.user ? req.oidc.user : {}));

module.exports = router;
