const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/orders');

// ROUTES
router.get('/archive', ordersController.listArchive);
router.get('/process/:orderId', ordersController.processOrder);
router.get('/sendWH', ordersController.sendWH);

//Send Archived Webhook to URL
router.post('/post/webhook', ordersController.postWebhook);

module.exports = router;