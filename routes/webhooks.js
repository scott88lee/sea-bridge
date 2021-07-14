const express = require('express');
const router = express.Router();
const webHooksController = require('../controllers/webHooks');

// ROUTES
router.post('/shopify_order_creation', webHooksController.shopifyOrderCreate);
router.get('/', (req,res)=>{res.send('hello hooker')})

module.exports = router;