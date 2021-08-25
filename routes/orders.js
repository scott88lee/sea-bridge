const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/orders');

// ROUTES
router.get('/', ordersController.getall);
router.get('/archive', ordersController.listArchive);

router.post('/post/webhook', ordersController.postWebhook);

module.exports = router;