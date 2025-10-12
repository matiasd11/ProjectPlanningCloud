const express = require('express');
const taskTypeController = require('../controllers/taskTypeController');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Rutas para tipos de tarea - Protegidas con JWT
router.get('/', optionalAuth, taskTypeController.getAllTaskTypes);            // Lectura permite sin token
router.get('/:id', optionalAuth, taskTypeController.getTaskTypeById);         // Lectura permite sin token
router.post('/', authenticateToken, taskTypeController.createTaskType);       // Crear requiere token
router.put('/:id', authenticateToken, taskTypeController.updateTaskType);     // Actualizar requiere token
router.delete('/:id', authenticateToken, taskTypeController.deleteTaskType);  // Eliminar requiere token

module.exports = router;