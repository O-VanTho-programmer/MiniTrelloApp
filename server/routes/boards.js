const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware');
const boardController = require('../controllers/boardControllers');

router.use(authenticateToken);

router.get('/', boardController.getAllBoard);
router.post('/', boardController.newBoard);
router.get('/:id', boardController.getBoard);
router.put('/:id', boardController.updateBoard);
router.delete('/:id', boardController.deleteBoard);

module.exports = router;