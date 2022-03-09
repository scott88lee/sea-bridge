const express = require('express');
const router = express.Router();
const Webhooks = require('../controllers/webhooks');

// ROUTES
router.post('/:zone/shopify_order_creation', Webhooks.shopifyOrderCreate);
router.post('/:zone/app_orders', Webhooks.saveMobileOrder);

module.exports = router;