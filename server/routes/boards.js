const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware');
const boardController = require('../controllers/boardControllers');
const cardController = require('../controllers/cardControllers');

router.use(authenticateToken);

// Board
router.get('/', boardController.getAllBoard);
router.post('/', boardController.newBoard);
router.get('/user', boardController.getBoardsByUser);
router.get('/:id', boardController.getBoard);
router.put('/:id', boardController.updateBoard);
router.delete('/:id', boardController.deleteBoard);


// Card
router.post('/:boardId/cards', cardController.newCard); //
router.get('/:boardId/cards', cardController.getAllCards); //
router.get('/:boardId/cards/:id', cardController.getCardById);
router.get('/:boardId/cards/user/:user_id', cardController.getCardsByUser)
router.put('/:boardId/cards/:id', cardController.updateCard);
router.delete('/:boardId/cards/:id', cardController.deleteCard);//


module.exports = router;