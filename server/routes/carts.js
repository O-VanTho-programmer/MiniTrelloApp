const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware');

router.use(authenticateToken);

const cardController = require('../controllers/cardControllers');

// router.post('/', cardController.newCard