const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware');
const boardController = require('../controllers/boardControllers');
const cardController = require('../controllers/cardControllers');
const taskController = require('../controllers/taskControllers');

router.use(authenticateToken);

// Board
router.get('/', boardController.getAllBoard);
router.post('/', boardController.newBoard);
router.get('/user', boardController.getBoardsByUser);
router.get('/user/invites', boardController.getInvitations);
router.get('/:id', boardController.getBoard);
router.get('/:id/members', boardController.getMembers);
router.post('/:id/members', boardController.addMemberToBoard)
router.post('/:id/invite', boardController.sendInvite)
router.post('/invite-respone/:inviteId', boardController.responeInvite)
router.put('/:id', boardController.updateBoard);
router.delete('/:id', boardController.deleteBoard);


// Card
router.post('/:boardId/cards', cardController.newCard); //
router.get('/:boardId/cards', cardController.getAllCards); //
router.get('/:boardId/cards/:id', cardController.getCardById);
router.get('/:boardId/cards/user/:user_id', cardController.getCardsByUser)
router.put('/:boardId/cards/:id', cardController.updateCard);
router.delete('/:boardId/cards/:id', cardController.deleteCard);//

//Task
router.get('/:boardId/cards/:id/tasks', taskController.getTasksByCard)//
router.post('/:boardId/cards/:id/tasks', taskController.createTaskWithInCard)//
router.get('/:boardId/cards/:id/tasks/:taskId', taskController.getTaskByIdWithInCard)//
router.put('/:boardId/cards/:id/tasks/:taskId', taskController.updateTaskWithInCard)//
router.delete('/:boardId/cards/:id/tasks/:taskId', taskController.deleteTaskWithInCard)//
router.post('/:boardId/cards/:id/tasks/:taskId/assign', taskController.assignMemberToTaskWithInCard)
router.get('/:boardId/cards/:id/tasks/:taskId/assign', taskController.getAssignedMembersOfTaskWithInCard)
router.delete('/:boardId/cards/:id/tasks/:taskId/assign/:memberId', taskController.unassignMemberToTaskWithInCard)
router.put('/tasks/:taskId/move', taskController.dragAndDropMove)


module.exports = router;