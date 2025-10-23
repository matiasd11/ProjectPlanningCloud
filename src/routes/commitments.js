const express = require('express');
const commitmentController = require('../controllers/commitmentController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Commitment:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         taskId:
 *           type: integer
 *           example: 5
 *         ongId:
 *           type: integer
 *           example: 3
 *         status:
 *           type: string
 *           enum: [pending, approved, rejected, done]
 *           example: "pending"
 *         description:
 *           type: string
 *           example: "Aportaremos los fondos necesarios para cubrir la compra de materiales de construcción."
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     
 *     CreateCommitmentRequest:
 *       type: object
 *       required: [taskId, ongId]
 *       properties:
 *         taskId:
 *           type: integer
 *           description: ID de la tarea
 *           example: 5
 *         ongId:
 *           type: integer
 *           description: ID de la ONG Colaboradora
 *           example: 3
 *         description:
 *           type: string
 *           description: Descripción opcional del compromiso
 *           example: "Nos comprometemos a financiar esta etapa con un aporte mensual durante tres meses."
 *     
 *     AssignCommitmentRequest:
 *       type: object
 *       required: [commitmentId, taskId]
 *       properties:
 *         commitmentId:
 *           type: integer
 *           description: ID del commitment a asignar
 *           example: 1
 *         taskId:
 *           type: integer
 *           description: ID de la tarea
 *           example: 5
 *     
 *     CommitmentDoneRequest:
 *       type: object
 *       required: [commitmentId]
 *       properties:
 *         commitmentId:
 *           type: integer
 *           description: ID del commitment a marcar como completado
 *           example: 1
 *     
 *     CommitmentResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             commitment:
 *               $ref: '#/components/schemas/Commitment'
 *             task:
 *               type: object
 *               description: Información de la tarea
 *     
 *     CommitmentsListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Commitment'
 */


/**
 * @swagger
 * /api/commitments:
 *   post:
 *     summary: Generar compromiso para un pedido de colaboración
 *     description: Método 4 - Método que permita a una ONG comprometerse a realizar un pedido de colaboración determinado.
 *     tags: [Commitments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCommitmentRequest'
 *     responses:
 *       201:
 *         description: Commitment creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Commitment'
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
 *                   example: "taskId y ongId son requeridos"
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
 *                   example: "Error al crear el commitment"
 *                 error:
 *                   type: string
 *                   example: "Database connection failed"
 */
router.post('/', authenticateToken, commitmentController.createCommitment);


/**
 * @swagger
 * /api/commitments/assign:
 *   post:
 *     summary: Asignar compromiso a una tarea
 *     description: Método que permite a una ONG Principal seleccionar y asignar a una ONG Colaboradora un pedido de colaboración para una tarea especifica de su proyecto.
 *     tags: [Commitments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AssignCommitmentRequest'
 *     responses:
 *       200:
 *         description: Commitment asignado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Commitment'
 *             example:
 *               success: true
 *               data:
 *                 id: 1
 *                 taskId: 5
 *                 ongId: 3
 *                 status: "approved"
 *                 description: "Nos comprometemos a financiar esta etapa con un aporte mensual durante tres meses."
 *                 createdAt: "2024-01-15T10:30:00Z"
 *                 updatedAt: "2024-01-15T14:20:00Z"
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
 *                   example: "commitmentId y taskId son requeridos"
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
 *         description: Commitment no encontrado
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
 *                   example: "Commitment no encontrado"
 *       409:
 *         description: Ya existe un commitment aprobado para esta tarea
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
 *                   example: "Ya existe un Commitment aprobado para esta tarea"
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
 *                   example: "Error al asignar el commitment"
 *                 error:
 *                   type: string
 *                   example: "Database connection failed"
 */
router.post('/assign', authenticateToken, commitmentController.assignCommitmentToTask);


/**
 * @swagger
 * /api/commitments/done:
 *   post:
 *     summary: Marcar compromiso como realizado
 *     description: Método 5 - Método que permite a una ONG marcar un compromiso como realizado.
 *     tags: [Commitments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CommitmentDoneRequest'
 *     responses:
 *       200:
 *         description: Commitment y tarea marcados como completados exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     commitment:
 *                       $ref: '#/components/schemas/Commitment'
 *                     task:
 *                       type: object
 *                       description: Información de la tarea actualizada
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 5
 *                         title:
 *                           type: string
 *                           example: "Nivelación del terreno"
 *                         description:
 *                           type: string
 *                           example: "Preparar el suelo para la construcción del centro comunitario"
 *                         status:
 *                           type: string
 *                           enum: [todo, in_progress, done]
 *                           example: "done"
 *                         dueDate:
 *                           type: string
 *                           format: date-time
 *                           example: "2024-12-31T23:59:59Z"
 *                         estimatedHours:
 *                           type: number
 *                           format: decimal
 *                           example: 8.5
 *                         actualHours:
 *                           type: number
 *                           format: decimal
 *                           example: 6.0
 *                         projectId:
 *                           type: integer
 *                           example: 1
 *                         takenBy:
 *                           type: integer
 *                           example: 3
 *                         createdBy:
 *                           type: integer
 *                           example: 1
 *                         isCoverageRequest:
 *                           type: boolean
 *                           example: true
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           example: "2024-01-15T10:30:00Z"
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *                           example: "2024-01-16T14:20:00Z"
 *             example:
 *               success: true
 *               data:
 *                 commitment:
 *                   id: 1
 *                   taskId: 5
 *                   ongId: 3
 *                   status: "done"
 *                   description: "Nos comprometimos a financiar esta etapa con un aporte mensual durante tres meses."
 *                   createdAt: "2024-01-15T10:30:00Z"
 *                   updatedAt: "2024-01-16T14:20:00Z"
 *                 task:
 *                   id: 5
 *                   title: "Nivelación del terreno"
 *                   description: "Preparar el suelo para la construcción del centro comunitario, asegurando el drenaje y la estabilidad."
 *                   status: "done"
 *                   dueDate: "2024-12-31T23:59:59Z"
 *                   estimatedHours: 8.5
 *                   actualHours: 6.0
 *                   projectId: 1
 *                   takenBy: 3
 *                   createdBy: 1
 *                   isCoverageRequest: true
 *                   createdAt: "2024-01-15T10:30:00Z"
 *                   updatedAt: "2024-01-16T14:20:00Z"
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
 *                   example: "commitmentId requerido"
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
 *         description: Commitment no encontrado
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
 *                   example: "Commitment no encontrado"
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
 *                   example: "Error al marcar como done"
 *                 error:
 *                   type: string
 *                   example: "Database connection failed"
 */
router.post('/done', authenticateToken, commitmentController.commitmentDone);


/**
 * @swagger
 * /api/commitments/task/{taskId}:
 *   get:
 *     summary: Recuperar compromisos generados para una tarea
 *     description: Método que permite recuperar todos los compromisos asociados a una tarea de un proyecto de una ONG específica.
 *     tags: [Commitments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         description: ID de la tarea
 *         schema:
 *           type: integer
 *           example: 5
 *     responses:
 *       200:
 *         description: Lista de commitments de la tarea obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CommitmentsListResponse'
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
 *                   example: "taskId requerido"
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
 *                   example: "Error al obtener los commitments de la tarea"
 *                 error:
 *                   type: string
 *                   example: "Database connection failed"
 */
router.get('/task/:taskId', authenticateToken, commitmentController.getCommitmentsByTask);


module.exports = router;
