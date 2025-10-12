const express = require('express');
const taskController = require('../controllers/taskController');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Rutas para tareas - Protegidas con JWT
router.get('/', optionalAuth, taskController.getAllTasks);                    // Lectura permite sin token
router.get('/:id', optionalAuth, taskController.getTaskById);                 // Lectura permite sin token
router.post('/', authenticateToken, taskController.createTask);               // Crear requiere token
router.post('/bulk', authenticateToken, taskController.createMultipleTasks);  // Bulk requiere token
router.put('/:id', authenticateToken, taskController.updateTask);             // Actualizar requiere token
router.delete('/:id', authenticateToken, taskController.deleteTask);          // Eliminar requiere token

module.exports = router;
module.exports = router;