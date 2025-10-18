const express = require('express');
const commitmentController = require('../controllers/commitmentController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Obtener todos los commitments
router.get('/', authenticateToken, commitmentController.getAllCommitments);

// Crear un nuevo commitment 
router.post('/', authenticateToken, commitmentController.createCommitment);

// Asignar un commitment existente a una tarea 
router.post('/assign', authenticateToken, commitmentController.assignCommitmentToTask);

module.exports = router;
