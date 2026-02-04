const express = require('express');
const router = express.Router();
const authController = require('../controllers/authControllers');

router.post('/github', authController.githubLogin);
router.post('/google', authController.googleLogin);

module.exports = router;