const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware');

const githubRepoControllers = require('../controllers/githubRepoControllers');

router.use(authenticateToken);

router.get('/:repositoryId/github-info', githubRepoControllers.getRepository);
router.get('/github-info', githubRepoControllers.getRepositories);

module.exports = router;