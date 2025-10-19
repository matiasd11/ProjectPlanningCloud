const express = require('express');
const taskController = require('../controllers/taskController');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Rutas para tareas - Protegidas con JWT
router.get('/project/:projectId/unassigned', optionalAuth, taskController.getUnassignedTasksByProject); 
router.get('/', optionalAuth, taskController.getAllTasks);                   
router.post('/', authenticateToken, taskController.createTask);               
router.post('/bulk', authenticateToken, taskController.createMultipleTasks); 
router.put('/:id', authenticateToken, taskController.updateTask);            
router.delete('/:id', authenticateToken, taskController.deleteTask);         

module.exports = router;
module.exports = router;