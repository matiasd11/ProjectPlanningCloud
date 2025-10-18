const express = require('express');
const commitmentController = require('../controllers/commitmentController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Crear un nuevo commitment (requiere token)
router.post('/', authenticateToken, commitmentController.createCommitment);

// Asignar un commitment existente a una tarea (requiere token)
router.post('/assign', authenticateToken, commitmentController.assignCommitmentToTask);

module.exports = router;
