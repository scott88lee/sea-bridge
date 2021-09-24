const express = require('express');
const router = express.Router();
const controller = require('../controllers/sandbox');

// ROUTES
router.get('/', controller.index);

module.exports = router;