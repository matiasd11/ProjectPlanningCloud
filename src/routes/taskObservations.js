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
 *           example: "El avance reportado es menor al esperado para esta etapa."
 *         resolution:
 *           type: string
 *           example: null
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
 *           example: "El avance reportado es menor al esperado para esta etapa."
 *           maxLength: 2000
 *     
 *     ResolveObservationRequest:
 *       type: object
 *       required: [resolution, userId]
 *       properties:
 *         resolution:
 *           type: string
 *           description: Resolución o respuesta a la observación
 *           example: "Se asignarán dos voluntarios adicionales para acelerar la ejecución y cumplir los tiempos."
 *           maxLength: 2000
 *         userId:
 *           type: integer
 *           description: ID del usuario que resuelve la observación
 *           example: 1
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
 *           example:
 *             - id: 1
 *               taskId: 1
 *               observations: "El avance reportado es menor al esperado para esta etapa. Los materiales no han llegado según lo programado."
 *               resolution: null
 *               createdBy: 1
 *               resolvedBy: null
 *               resolvedAt: null
 *               createdAt: "2024-01-15T10:30:00Z"
 *               updatedAt: "2024-01-15T10:30:00Z"
 *               task:
 *                 id: 1
 *                 title: "Nivelación del terreno"
 *                 status: "in_progress"
 *             - id: 2
 *               taskId: 1
 *               observations: "Se requiere verificación adicional de la calidad del suelo antes de continuar con la construcción."
 *               resolution: "Se ha contratado un ingeniero geotécnico para realizar un estudio completo del suelo. Los resultados estarán disponibles en 3 días hábiles."
 *               createdBy: 2
 *               resolvedBy: 1
 *               resolvedAt: "2024-01-18T11:45:00Z"
 *               createdAt: "2024-01-16T14:20:00Z"
 *               updatedAt: "2024-01-18T11:45:00Z"
 *               task:
 *                 id: 1
 *                 title: "Nivelación del terreno"
 *                 status: "in_progress"
 *             - id: 3
 *               taskId: 2
 *               observations: "Los voluntarios reportan dificultades con el equipo eléctrico proporcionado. Se necesita capacitación adicional."
 *               resolution: null
 *               createdBy: 3
 *               resolvedBy: null
 *               resolvedAt: null
 *               createdAt: "2024-01-17T09:15:00Z"
 *               updatedAt: "2024-01-17T09:15:00Z"
 *               task:
 *                 id: 2
 *                 title: "Instalación de sistema eléctrico"
 *                 status: "todo"
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
 *               example: 3
 *             totalPages:
 *               type: integer
 *               example: 1
 *           example:
 *             page: 1
 *             limit: 10
 *             total: 3
 *             totalPages: 1
 */


/**
 * @swagger
 * /api/task-observations/task/{taskId}:
 *   get:
 *     summary: Recuperar historial de observaciones de una tarea
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
 *     summary: Generar observación para una tarea
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
 *   post:
 *     summary: Resolver observación de una tarea
 *     description: Agrega una resolución a una observación específica de una tarea
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
 *           example:
 *             resolution: "Se asignarán dos voluntarios adicionales para acelerar la ejecución y cumplir los tiempos."
 *             userId: 1
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
 *             example:
 *               success: true
 *               data:
 *                 id: 1
 *                 taskId: 1
 *                 observations: "El avance reportado es menor al esperado para esta etapa. Los materiales no han llegado según lo programado."
 *                 resolution: "Se asignarán dos voluntarios adicionales para acelerar la ejecución y cumplir los tiempos."
 *                 createdBy: 2
 *                 resolvedBy: 1
 *                 resolvedAt: "2024-01-18T15:30:00Z"
 *                 createdAt: "2024-01-15T10:30:00Z"
 *                 updatedAt: "2024-01-18T15:30:00Z"
 *                 task:
 *                   id: 1
 *                   title: "Nivelación del terreno"
 *                   status: "in_progress"
 *               message: "Observación resuelta exitosamente"
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
router.post('/:observationId/resolve', authenticateToken, taskObservationController.resolveObservation);

module.exports = router;
