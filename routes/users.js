const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');

const db = require('../config/db')

// ROUTES
router.get('/login', usersController.renderLogin);
router.post('/login', usersController.authUser);
router.get('/logout', usersController.logOut);

module.exports = router;