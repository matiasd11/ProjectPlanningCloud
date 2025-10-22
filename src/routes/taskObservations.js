const express = require('express');
const taskObservationController = require('../controllers/taskObservationController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     TaskObservation:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         taskId:
 *           type: integer
 *           example: 1
 *         observations:
 *           type: string
 *           example: "Se completó el módulo de autenticación. Falta implementar la validación de permisos."
 *         resolution:
 *           type: string
 *           example: "Se implementó la validación de permisos usando middleware de autorización."
 *         createdBy:
 *           type: integer
 *           example: 1
 *         resolvedBy:
 *           type: integer
 *           example: 2
 *         resolvedAt:
 *           type: string
 *           format: date-time
 *           example: "2024-01-15T10:30:00Z"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         task:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             title:
 *               type: string
 *             status:
 *               type: string
 *     
 *     CreateObservationRequest:
 *       type: object
 *       required: [observations]
 *       properties:
 *         observations:
 *           type: string
 *           description: Observaciones sobre el progreso de la tarea
 *           example: "Se completó el módulo de autenticación. Falta implementar la validación de permisos."
 *           maxLength: 2000
 *     
 *     ResolveObservationRequest:
 *       type: object
 *       required: [resolution]
 *       properties:
 *         resolution:
 *           type: string
 *           description: Resolución o respuesta a la observación
 *           example: "Se implementó la validación de permisos usando middleware de autorización."
 *           maxLength: 2000
 *     
 *     ObservationsListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/TaskObservation'
 *         pagination:
 *           type: object
 *           properties:
 *             page:
 *               type: integer
 *               example: 1
 *             limit:
 *               type: integer
 *               example: 10
 *             total:
 *               type: integer
 *               example: 5
 *             totalPages:
 *               type: integer
 *               example: 1
 */


/**
 * @swagger
 * /api/task-observations/task/{taskId}:
 *   get:
 *     summary: Obtener observaciones de una tarea específica
 *     description: Retorna el historial completo de observaciones de una tarea específica
 *     tags: [Task Observations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         description: ID de la tarea
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: page
 *         description: Número de página para paginación
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         description: Cantidad de observaciones por página
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: resolved
 *         description: Filtrar por estado de resolución
 *         schema:
 *           type: string
 *           enum: [true, false]
 *           example: "false"
 *     responses:
 *       200:
 *         description: Historial de observaciones obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ObservationsListResponse'
 *       400:
 *         description: taskId requerido
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
 *                   example: "taskId es requerido"
 *       404:
 *         description: Tarea no encontrada
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
 *                   example: "Tarea no encontrada"
 *       401:
 *         description: Token de autenticación inválido o faltante
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
 *                   example: "Token de autenticación requerido"
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
 *                   example: "Error al obtener observaciones de la tarea"
 *                 error:
 *                   type: string
 *                   example: "Database connection failed"
 */
router.get('/task/:taskId', authenticateToken, taskObservationController.getTaskObservations);

/**
 * @swagger
 * /api/task-observations/task/{taskId}:
 *   post:
 *     summary: Crear observación para una tarea
 *     description: Método 4 - Método que permite agregar observaciones sobre el progreso de una tarea que está en estado 'in_progress'
 *     tags: [Task Observations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         description: ID de la tarea
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateObservationRequest'
 *     responses:
 *       201:
 *         description: Observación creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/TaskObservation'
 *                 message:
 *                   type: string
 *                   example: "Observación agregada al historial exitosamente"
 *       400:
 *         description: Datos de entrada inválidos
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
 *                   example: "Solo se pueden agregar observaciones a tareas en progreso"
 *       401:
 *         description: Token de autenticación inválido o faltante
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
 *                   example: "Token de autenticación requerido"
 *       404:
 *         description: Tarea no encontrada
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
 *                   example: "Tarea no encontrada"
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
 *                   example: "Error al crear observación"
 *                 error:
 *                   type: string
 *                   example: "Database connection failed"
 */
router.post('/task/:taskId', authenticateToken, taskObservationController.createObservation);

/**
 * @swagger
 * /api/task-observations/{observationId}/resolve:
 *   put:
 *     summary: Resolver una observación
 *     description: Agrega una resolución a una observación específica
 *     tags: [Task Observations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: observationId
 *         required: true
 *         description: ID de la observación
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResolveObservationRequest'
 *     responses:
 *       200:
 *         description: Observación resuelta exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/TaskObservation'
 *                 message:
 *                   type: string
 *                   example: "Observación resuelta exitosamente"
 *       400:
 *         description: Datos de entrada inválidos
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
 *                   example: "Esta observación ya fue resuelta"
 *       401:
 *         description: Token de autenticación inválido o faltante
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
 *                   example: "Token de autenticación requerido"
 *       404:
 *         description: Observación no encontrada
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
 *                   example: "Observación no encontrada"
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
 *                   example: "Error al resolver observación"
 *                 error:
 *                   type: string
 *                   example: "Database connection failed"
 */
router.put('/:observationId/resolve', authenticateToken, taskObservationController.resolveObservation);

module.exports = router;
