const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/orders');

// ROUTES
router.get('/', ordersController.getall);
router.get('/archive', ordersController.getArchive);

module.exports = router;