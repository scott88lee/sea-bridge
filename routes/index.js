const express = require('express');
const router = express.Router();
const indexController = require('../controllers/index');

// ROUTES
router.get('/', indexController.main);
router.get('/test', indexController.test)

module.exports = router;