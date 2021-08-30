const express = require('express');
const router= express.Router();
const packagesController = require('../controllers/packages');


// ROUTES
router.get('/new', packagesController.renderNew);

module.exports = router;