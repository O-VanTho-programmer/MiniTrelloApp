const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware');

const listController = require('../controllers/listControllers');

router.use(authenticateToken);

router.post('/', listController.newList);
router.get('/board/:board_id', listController.getListByBoardId);
router.delete('/:id', listController.deleteList);

module.exports = router;