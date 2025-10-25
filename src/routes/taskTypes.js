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
 *     
 *     TaskTypeCreateRequest:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         title:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *           example: "Construcción de viviendas de emergencia"
 *           description: "Título del tipo de tarea"
 *     
 *     TaskTypeCreateResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           $ref: '#/components/schemas/TaskType'
 *         message:
 *           type: string
 *           example: "Tipo de tarea creado exitosamente"
 *     
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: "Error en la operación"
 *         error:
 *           type: string
 *           example: "Detalles del error"
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

/**
 * @swagger
 * /api/task-types:
 *   post:
 *     summary: Crear un nuevo tipo de tarea
 *     description: Crea un nuevo tipo de tarea en el sistema. Requiere autenticación con token JWT.
 *     tags: [Task Types]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskTypeCreateRequest'
 *           examples:
 *             construccion:
 *               summary: Construcción de viviendas
 *               value:
 *                 title: "Construcción de viviendas de emergencia"
 *             instalacion:
 *               summary: Instalación de paneles
 *               value:
 *                 title: "Instalación de paneles solares o eólicos"
 *             voluntariado:
 *               summary: Voluntariado técnico
 *               value:
 *                 title: "Voluntariado técnico (ingenieros, arquitectos, electricistas)"
 *     responses:
 *       201:
 *         description: Tipo de tarea creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaskTypeCreateResponse'
 *             examples:
 *               success:
 *                 summary: Creación exitosa
 *                 value:
 *                   success: true
 *                   data:
 *                     id: 6
 *                     title: "Construcción de viviendas de emergencia"
 *                     createdAt: "2024-01-15T10:30:00Z"
 *                     updatedAt: "2024-01-15T10:30:00Z"
 *                   message: "Tipo de tarea creado exitosamente"
 *       400:
 *         description: Error de validación en los datos enviados
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               validation_error:
 *                 summary: Error de validación
 *                 value:
 *                   success: false
 *                   message: "El título es requerido"
 *                   error: "Validation error: title is required"
 *               duplicate_error:
 *                 summary: Tipo de tarea duplicado
 *                 value:
 *                   success: false
 *                   message: "Ya existe un tipo de tarea con ese título"
 *                   error: "Duplicate entry"
 *       401:
 *         description: Token de autenticación inválido o faltante
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               unauthorized:
 *                 summary: No autorizado
 *                 value:
 *                   success: false
 *                   message: "Token de acceso requerido"
 *                   error: "Unauthorized"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               server_error:
 *                 summary: Error del servidor
 *                 value:
 *                   success: false
 *                   message: "Error al crear el tipo de tarea"
 *                   error: "Database connection failed"
 */
router.post('/', authenticateToken, taskTypeController.createTaskType);       // Crear requiere token
router.put('/:id', authenticateToken, taskTypeController.updateTaskType);     // Actualizar requiere token
router.delete('/:id', authenticateToken, taskTypeController.deleteTaskType);  // Eliminar requiere token

module.exports = router;