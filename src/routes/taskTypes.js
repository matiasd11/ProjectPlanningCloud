const express = require('express');
const taskTypeController = require('../controllers/taskTypeController');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

const router = express.Router();


/**
 * @swagger
 * components:
 *   schemas:
 *     TaskType:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         title:
 *           type: string
 *           example: "Construcción de viviendas de emergencia"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-01-15T10:30:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2024-01-15T10:30:00Z"
 *     
 *     TaskTypesResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/TaskType'
 *           example:
 *             - id: 1
 *               title: "Construcción de viviendas de emergencia"
 *               createdAt: "2024-01-15T10:30:00Z"
 *               updatedAt: "2024-01-15T10:30:00Z"
 *             - id: 2
 *               title: "Instalación de paneles solares o eólicos"
 *               createdAt: "2024-01-15T10:30:00Z"
 *               updatedAt: "2024-01-15T10:30:00Z"
 *             - id: 3
 *               title: "Donación de materiales de construcción"
 *               createdAt: "2024-01-15T10:30:00Z"
 *               updatedAt: "2024-01-15T10:30:00Z"
 *             - id: 4
 *               title: "Voluntariado técnico"
 *               createdAt: "2024-01-15T10:30:00Z"
 *               updatedAt: "2024-01-15T10:30:00Z"
 *             - id: 5
 *               title: "Financiamiento económico"
 *               createdAt: "2024-01-15T10:30:00Z"
 *               updatedAt: "2024-01-15T10:30:00Z"
 */

/**
 * @swagger
 * /api/task-types:
 *   get:
 *     summary: Obtener todos los tipos de tarea
 *     description: Recupera la lista completa de tipos de tarea disponibles en el sistema, ordenados alfabéticamente por título.
 *     tags: [Task Types]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de tipos de tarea obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaskTypesResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Error al obtener los tipos de tarea"
 *                 error:
 *                   type: string
 *                   example: "Database connection failed"
 */
router.get('/', optionalAuth, taskTypeController.getAllTaskTypes);            // Lectura permite sin token
router.get('/:id', optionalAuth, taskTypeController.getTaskTypeById);         // Lectura permite sin token
router.post('/', authenticateToken, taskTypeController.createTaskType);       // Crear requiere token
router.put('/:id', authenticateToken, taskTypeController.updateTaskType);     // Actualizar requiere token
router.delete('/:id', authenticateToken, taskTypeController.deleteTaskType);  // Eliminar requiere token

module.exports = router;