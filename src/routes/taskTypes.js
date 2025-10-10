const express = require('express');
const taskTypeController = require('../controllers/taskTypeController');

const router = express.Router();

// Rutas para tipos de tarea
router.get('/', taskTypeController.getAllTaskTypes);
router.get('/:id', taskTypeController.getTaskTypeById);
router.post('/', taskTypeController.createTaskType);
router.put('/:id', taskTypeController.updateTaskType);
router.delete('/:id', taskTypeController.deleteTaskType);

module.exports = router;