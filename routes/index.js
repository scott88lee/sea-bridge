const express = require('express');
const router = express.Router();
const indexController = require('../controllers/index');

const db = require('../config/db')

// ROUTES
router.get('/', indexController.main);

module.exports = router;