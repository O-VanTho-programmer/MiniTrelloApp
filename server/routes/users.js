const express = require('express');
const router = express.Router();
const userController = require('../controllers/userControllers');
const authenticateToken = require('../middleware');

router.use(authenticateToken);

router.get('/current-user', userController.getUser);

module.exports = router;