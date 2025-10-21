const express = require('express');
const taskController = require('../controllers/taskController');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
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
 *           example: "Desarrollar funcionalidad de login"
 *         description:
 *           type: string
 *           example: "Implementar autenticación JWT"
 *         status:
 *           type: string
 *           enum: [todo, in_progress, review, done, cancelled]
 *           example: "todo"
 *         due_date:
 *           type: string
 *           format: date-time
 *           example: "2024-12-31T23:59:59Z"
 *         estimated_hours:
 *           type: number
 *           format: decimal
 *           example: 8.5
 *         actual_hours:
 *           type: number
 *           format: decimal
 *           example: 6.0
 *         project_id:
 *           type: integer
 *           example: 1
 *         taken_by:
 *           type: integer
 *           example: 3
 *         created_by:
 *           type: integer
 *           example: 1
 *         task_type_id:
 *           type: integer
 *           example: 2
 *         is_coverage_request:
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
 *             title:
 *               type: string
 *     
 *     CreateTaskRequest:
 *       type: object
 *       required: [title, taskTypeId]
 *       properties:
 *         title:
 *           type: string
 *           description: Título de la tarea
 *           example: "Desarrollar funcionalidad de login"
 *         description:
 *           type: string
 *           description: Descripción detallada de la tarea
 *           example: "Implementar autenticación JWT con refresh tokens"
 *         status:
 *           type: string
 *           enum: [todo, in_progress, review, done, cancelled]
 *           default: "todo"
 *           example: "todo"
 *         due_date:
 *           type: string
 *           format: date-time
 *           description: Fecha límite de la tarea
 *           example: "2024-12-31T23:59:59Z"
 *         estimated_hours:
 *           type: number
 *           format: decimal
 *           description: Horas estimadas para completar la tarea
 *           example: 8.5
 *         project_id:
 *           type: integer
 *           description: ID del proyecto al que pertenece la tarea
 *           example: 1
 *         taken_by:
 *           type: integer
 *           description: ID de la ONG que se hace cargo de la tarea
 *           example: 3
 *         created_by:
 *           type: integer
 *           description: ID del usuario que crea la tarea
 *           example: 1
 *         taskTypeId:
 *           type: integer
 *           description: ID del tipo de tarea
 *           example: 2
 *         is_coverage_request:
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
 *             - title: "Tarea 1"
 *               taskTypeId: 1
 *               project_id: 1
 *             - title: "Tarea 2"
 *               taskTypeId: 2
 *               project_id: 1
 *     
 *     TaskResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           $ref: '#/components/schemas/Task'
 *         message:
 *           type: string
 *           example: "Tarea creada exitosamente"
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
 *         message:
 *           type: string
 *           example: "3 tareas creadas exitosamente"
 */


/**
 * @swagger
 * /api/tasks/project/{projectId}:
 *   get:
 *     summary: Obtener todas las tareas de un proyecto específico.
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
 *       - in: query
 *         name: status
 *         description: Filtrar por estado de la tarea
 *         schema:
 *           type: string
 *           enum: [todo, in_progress, review, done, cancelled]
 *           example: "todo"
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
 *     summary: Obtener todas las tareas sin asignar de un proyecto específico.
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
 *       - in: query
 *         name: status
 *         description: Filtrar por estado de la tarea
 *         schema:
 *           type: string
 *           enum: [todo, in_progress, review, done, cancelled]
 *           example: "todo"
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


router.get('/', optionalAuth, taskController.getAllTasks); 


/**
 * @swagger
 * /api/tasks/bulk:
 *   post:
 *     summary: Crear múltiples tareas para un proyecto específico.
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
 *                   example: "Se requiere un array de tareas válido"
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


// /**
//  * @swagger
//  * /api/tasks:
//  *   post:
//  *     summary: Crear una nueva tarea
//  *     description: Método 2 - Método que permite cargar en el cloud un pedido de colaboración asociado a un proyecto determinado.
//  *     tags: [Tasks]
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             $ref: '#/components/schemas/CreateTaskRequest'
//  *     responses:
//  *       201:
//  *         description: Tarea creada exitosamente
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/TaskResponse'
//  *       400:
//  *         description: Datos de entrada inválidos
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                   example: false
//  *                 message:
//  *                   type: string
//  *                   example: "Error al crear la tarea"
//  *                 error:
//  *                   type: string
//  *                   example: "Validation error"
//  *       401:
//  *         description: Token de autenticación inválido o faltante
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                   example: false
//  *                 message:
//  *                   type: string
//  *                   example: "Token de autenticación requerido"
//  *       500:
//  *         description: Error interno del servidor
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                   example: false
//  *                 message:
//  *                   type: string
//  *                   example: "Error interno del servidor"
//  *                 error:
//  *                   type: string
//  *                   example: "Database connection failed"
//  */
router.post('/', authenticateToken, taskController.createTask);


router.put('/:id', authenticateToken, taskController.updateTask);            


router.delete('/:id', authenticateToken, taskController.deleteTask);         


module.exports = router;
module.exports = router;