const express = require('express');
const taskController = require('../controllers/taskController');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();


/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         title:
 *           type: string
 *           example: "Nivelación del terreno"
 *         description:
 *           type: string
 *           example: "Preparar el suelo para la construcción del centro comunitario, asegurando el drenaje y la estabilidad."
 *         status:
 *           type: string
 *           enum: [todo, in_progress, done]
 *           example: "todo"
 *         dueDate:
 *           type: string
 *           format: date-time
 *           example: "2024-12-31T23:59:59Z"
 *         estimatedHours:
 *           type: number
 *           format: decimal
 *           example: 8.5
 *         actualHours:
 *           type: number
 *           format: decimal
 *           example: 6.0
 *         projectId:
 *           type: integer
 *           example: 1
 *         takenBy:
 *           type: integer
 *           example: 3
 *         createdBy:
 *           type: integer
 *           example: 1
 *         isCoverageRequest:
 *           type: boolean
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         taskType:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 5
 *             title:
 *               type: string
 *               example: "Colocación de cimientos"
 * 
 * 
 *     TasksListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Task'
 *           example:
 *             - id: 1
 *               title: "Instalación de paneles solares"
 *               description: "Montar 6 paneles fotovoltaicos y conectar al sistema comunitario."
 *               status: "todo"
 *               dueDate: "2024-12-31T23:59:59Z"
 *               estimatedHours: 8.5
 *               actualHours: null
 *               projectId: 7
 *               takenBy: 3
 *               createdBy: 1
 *               isCoverageRequest: true
 *               createdAt: "2024-01-15T10:30:00Z"
 *               updatedAt: "2024-01-15T10:30:00Z"
 *               taskType:
 *                 id: 2
 *                 title: "Instalación de paneles solares o eólicos"
 *             - id: 2
 *               title: "Instalación de luminarias LED"
 *               description: "Colocar luces de bajo consumo en la plaza y calles principales."
 *               status: "todo"
 *               dueDate: "2024-11-30T23:59:59Z"
 *               estimatedHours: 12.0
 *               actualHours: 6.5
 *               projectId: 7
 *               takenBy: 1
 *               createdBy: 1
 *               isCoverageRequest: false
 *               createdAt: "2024-01-14T09:15:00Z"
 *               updatedAt: "2024-01-16T14:20:00Z"
 *               taskType:
 *                 id: 2
 *                 title: "Instalación de paneles solares o eólicos"
 *         pagination:
 *           type: object
 *           properties:
 *             page:
 *               type: integer
 *               example: 1
 *               description: "Página actual"
 *             limit:
 *               type: integer
 *               example: 10
 *               description: "Cantidad de elementos por página"
 *             total:
 *               type: integer
 *               example: 25
 *               description: "Total de elementos disponibles"
 *             totalPages:
 *               type: integer
 *               example: 3
 *               description: "Total de páginas disponibles"
 *           example:
 *             page: 1
 *             limit: 10
 *             total: 25
 *             totalPages: 3
 *     
 *     
 *     CreateTaskRequest:
 *       type: object
 *       required: [title, taskTypeId]
 *       properties:
 *         title:
 *           type: string
 *           description: Título de la tarea
 *           example: "Colocación de cimientos"
 *         description:
 *           type: string
 *           description: Descripción detallada de la tarea
 *           example: "Ejecutar la base estructural con materiales donados y asistencia técnica."
 *         dueDate:
 *           type: string
 *           format: date-time
 *           description: Fecha límite de la tarea
 *           example: "2024-12-31T23:59:59Z"
 *         estimatedHours:
 *           type: number
 *           format: decimal
 *           description: Horas estimadas para completar la tarea
 *           example: 8.5
 *         projectId:
 *           type: integer
 *           description: ID del proyecto al que pertenece la tarea
 *           example: 1
 *         takenBy:
 *           type: integer
 *           description: ID de la ONG que se hace cargo de la tarea
 *           example: 3
 *         createdBy:
 *           type: integer
 *           description: ID del usuario que crea la tarea
 *           example: 1
 *         taskTypeId:
 *           type: integer
 *           description: ID del tipo de tarea
 *           example: 2
 *         isCoverageRequest:
 *           type: boolean
 *           description: Si es una solicitud de cobertura
 *           default: true
 *           example: true
 *     
 *     CreateMultipleTasksRequest:
 *       type: object
 *       required: [tasks]
 *       properties:
 *         tasks:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CreateTaskRequest'
 *           minItems: 1
 *           example:
 *             - title: "Pintura exterior del edificio"
 *               description: "Aplicar pintura ecológica en muros exteriores para mejorar la imagen y proteger las superficies."
 *               dueDate: "2025-12-31T23:59:59Z"
 *               estimatedHours: 120
 *               projectId: 1
 *               takenBy: 3
 *               createdBy: 1
 *               taskTypeId: 1
 *               isCoverageRequest: true
 *             - title: "Reparación de techos"
 *               description: "Sustituir chapas dañadas y reforzar la estructura ante lluvias."
 *               dueDate: "2026-05-31T23:59:59Z"
 *               estimatedHours: 190
 *               projectId: 1
 *               takenBy: 1
 *               createdBy: 1
 *               taskTypeId: 2
 *               isCoverageRequest: false
 *     
 *     MultipleTasksResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Task'
 *           example:
 *             - id: 1
 *               title: "Pintura exterior del edificio"
 *               description: "Aplicar pintura ecológica en muros exteriores para mejorar la imagen y proteger las superficies."
 *               status: "todo"
 *               dueDate: "2025-12-31T23:59:59Z"
 *               estimatedHours: 120
 *               actualHours: 0
 *               projectId: 1
 *               takenBy: 3
 *               createdBy: 1
 *               isCoverageRequest: true
 *               createdAt: "2025-01-15T10:30:00Z"
 *               updatedAt: "2025-01-15T10:30:00Z"
 *               taskType:
 *                 id: 1
 *                 title: "Pintura y acabados"
 *             - id: 2
 *               title: "Reparación de techos"
 *               description: "Sustituir chapas dañadas y reforzar la estructura ante lluvias."
 *               status: "todo"
 *               dueDate: "2026-05-31T23:59:59Z"
 *               estimatedHours: 190
 *               actualHours: 0
 *               projectId: 1
 *               takenBy: 8
 *               createdBy: 8
 *               isCoverageRequest: false
 *               createdAt: "2025-01-15T10:30:00Z"
 *               updatedAt: "2025-01-15T10:30:00Z"
 *               taskType:
 *                 id: 2
 *                 title: "Reparaciones estructurales"
 *         message:
 *           type: string
 *           example: "2 tareas creadas exitosamente"
 */


/**
 * @swagger
 * /api/tasks/project/{projectId}:
 *   get:
 *     summary: Recuperar pedidos de colaboración de un proyecto
 *     description: Método 3 - Método que permite recuperar todos los pedidos de colaboración asociados a un proyecto determinado.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         description: ID del proyecto
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: page
 *         description: Número de página para paginación
 *         schema:
 *           type: integer
 *           default: 1
 *           example: 1
 *       - in: query
 *         name: limit
 *         description: Cantidad de tareas por página
 *         schema:
 *           type: integer
 *           default: 10
 *           example: 10
 *     responses:
 *       200:
 *         description: Lista de tareas del proyecto obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TasksListResponse'
 *       400:
 *         description: projectId requerido
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
 *                   example: "projectId es requerido"
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
 *                   example: "Error al obtener las tareas por proyecto"
 *                 error:
 *                   type: string
 *                   example: "Database connection failed"
 */
router.get('/project/:projectId', authenticateToken, taskController.getTasksByProject);


/**
 * @swagger
 * /api/tasks/project/{projectId}/unassigned:
 *   get:
 *     summary: Recuperar pedidos de colaboración sin asignar de un proyecto
 *     description: Método 3 - Método que permite recuperar todos los pedidos de colaboración sin asignar que tiene un proyecto dado.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         description: ID del proyecto
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: page
 *         description: Número de página para paginación
 *         schema:
 *           type: integer
 *           default: 1
 *           example: 1
 *       - in: query
 *         name: limit
 *         description: Cantidad de tareas por página
 *         schema:
 *           type: integer
 *           default: 10
 *           example: 10
 *     responses:
 *       200:
 *         description: Lista de tareas sin asignar obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TasksListResponse'
 *       400:
 *         description: projectId requerido
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
 *                   example: "projectId es requerido"
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
 *                   example: "Error al obtener las tareas sin asignar"
 *                 error:
 *                   type: string
 *                   example: "Database connection failed"
 */
router.get('/project/:projectId/unassigned', authenticateToken, taskController.getUnassignedTasksByProject);


/**
 * @swagger
 * /api/tasks/bulk:
 *   post:
 *     summary: Generar pedidos de colaboración de un proyecto
 *     description: Método 2 - Método que permite cargar en el cloud pedidos de colaboración asociados a un proyecto determinado.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateMultipleTasksRequest'
 *     responses:
 *       201:
 *         description: Tareas creadas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MultipleTasksResponse'
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
 *                   example: "Los datos enviados no son válidos"
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
 *                   example: "Error interno del servidor"
 *                 error:
 *                   type: string
 *                   example: "Database connection failed"
 */
router.post('/bulk', authenticateToken, taskController.createMultipleTasks);


/**
 * @swagger
 * /api/tasks/{id}:
 *   patch:
 *     summary: Actualizar una tarea existente
 *     description: Permite actualizar parcialmente los campos de una tarea existente. Se pueden modificar campos como título, descripción, estado, fechas, horas, etc.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la tarea a actualizar
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Instalación de paneles solares"
 *               description:
 *                 type: string
 *                 example: "Montar paneles fotovoltaicos en el techo del edificio comunitario"
 *               status:
 *                 type: string
 *                 enum: [todo, in_progress, done]
 *                 example: "in_progress"
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-12-31T23:59:59Z"
 *               estimatedHours:
 *                 type: number
 *                 format: decimal
 *                 example: 10.5
 *               actualHours:
 *                 type: number
 *                 format: decimal
 *                 example: 8.0
 *               projectId:
 *                 type: integer
 *                 example: 1
 *               takenBy:
 *                 type: integer
 *                 example: 3
 *               createdBy:
 *                 type: integer
 *                 example: 1
 *               taskTypeId:
 *                 type: integer
 *                 example: 2
 *               isCoverageRequest:
 *                 type: boolean
 *                 example: true
 *             example:
 *               status: "in_progress"
 *               actualHours: 5.5
 *     responses:
 *       200:
 *         description: Tarea actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Task'
 *                 message:
 *                   type: string
 *                   example: "Tarea actualizada exitosamente"
 *       400:
 *         description: Error en los datos proporcionados
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
 *                   example: "Error al actualizar la tarea"
 *                 error:
 *                   type: string
 *                   example: "Validation error: status must be one of [todo, in_progress, done]"
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
 *                   example: "Error interno del servidor"
 *                 error:
 *                   type: string
 *                   example: "Database connection failed"
 */
router.patch('/:id', authenticateToken, taskController.updateTask);


module.exports = router;