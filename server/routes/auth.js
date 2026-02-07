const express = require('express');
const router = express.Router();
const authController = require('../controllers/authControllers');

router.post('/github', authController.githubLogin);
router.post('/google', authController.googleLogin);
router.post('/send-code-signup', authController.sendCode);
router.post('/send-code-login', authController.sendCodeForLogin);
router.post('/signup', authController.signUp);
router.post('/signin', authController.signIn);

module.exports = router;