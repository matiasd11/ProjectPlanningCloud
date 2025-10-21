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
 *           example: "Nos comprometemos a completar esta tarea en 2 semanas"
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
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
 *           description: ID de la ONG
 *           example: 3
 *         status:
 *           type: string
 *           enum: [pending, approved, rejected, done]
 *           default: "pending"
 *           example: "pending"
 *         description:
 *           type: string
 *           description: Descripción opcional del compromiso
 *           example: "Nos comprometemos a completar esta tarea en 2 semanas"
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
 *               description: Información de la tarea (solo en algunos endpoints)
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
 *     summary: Método 2 - Método que permite cargar en el cloud pedidos de colaboración asociados a un proyecto determinado.
 *     description: Método que permite cargar un pedido de colaboración generado por una ONG Colaboradora para una tarea de un proyecto creado por una ONG Principal.
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
 *     summary: Método 4 - Método que permite a una ONG comprometerse a realizar un pedido de colaboración determinado.
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
 *     summary: Método 5 - Método que permite a una ONG marcar un compromiso como realizado.
 *     description: Método que permite a una ONG Colaboradora marcar un compromiso como realizado.
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
 *     summary: Método que permite recuperar todos los pedidos de colaboración asociados a una tarea de un proyecto de una ONG específica.
 *     description: Método que permite recuperar todos los pedidos de colaboración asociados a una tarea de un proyecto de una ONG específica.
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

// Obtener commitments de un proyecto específico
router.get('/project/:projectId', authenticateToken, commitmentController.getCommitmentsByProject);


/**
 * @swagger
 * /api/commitments:
 *   get:
 *     summary: Método que permite recuperar todos los pedidos de colaboración
 *     description: Método que permite recuperar todos los pedidos de colaboración
 *     tags: [Commitments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de commitments obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CommitmentsListResponse'
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
 *                   example: "Error al obtener los commitments"
 *                 error:
 *                   type: string
 *                   example: "Database connection failed"
 */
router.get('/', authenticateToken, commitmentController.getAllCommitments);


module.exports = router;
