const express = require('express');
const router = express.Router();
const webHooksController = require('../controllers/webHooks');

// ROUTES
router.post('/:zone/shopify_order_creation', webHooksController.shopifyOrderCreate);

router.get('/:zone/:orderNumber', webHooksController.getWebhookByOrderNumber);


module.exports = router;