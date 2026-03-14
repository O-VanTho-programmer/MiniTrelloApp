const express = require('express');
const router = express.Router();
const activityLogControllers = require('../controllers/activityLogControllers');
const authenticateToken = require('../middleware');

router.use(authenticateToken); // Protect all routes

router.post('/', activityLogControllers.createLog);
router.get('/board/:boardId', activityLogControllers.getLogsByBoard);
router.get('/:id', activityLogControllers.getLogById);
router.put('/:id', activityLogControllers.updateLog);
router.delete('/:id', activityLogControllers.deleteLog);

module.exports = router;
