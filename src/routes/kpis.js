const express = require('express');
const kpiController = require('../controllers/kpiController');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     TotalTasksResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             totalTasks:
 *               type: integer
 *               description: Total de tareas cargadas en el sistema
 *               example: 156
 *     TotalTasksTodoResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             totalTasksTodo:
 *               type: integer
 *               description: Total de tareas con status 'todo'
 *               example: 42
 *     TotalTasksInProgressResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             totalTasksInProgress:
 *               type: integer
 *               description: Total de tareas con status 'in_progress'
 *               example: 18
 */

/**
 * @swagger
 * /api/kpis/total-tasks:
 *   get:
 *     summary: Obtener el total de tareas cargadas
 *     description: Endpoint que devuelve el número total de tareas que hay cargadas en el sistema.
 *     tags: [KPIs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Total de tareas obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TotalTasksResponse'
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
 *                   example: "Error al obtener el total de tareas"
 *                 error:
 *                   type: string
 *                   example: "Database connection failed"
 */
router.get('/total-tasks', authenticateToken, kpiController.getTotalTasks);

/**
 * @swagger
 * /api/kpis/total-tasks-todo:
 *   get:
 *     summary: Obtener el total de tareas pendientes
 *     description: Endpoint que devuelve el número total de tareas con status 'todo'.
 *     tags: [KPIs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Total de tareas pendientes obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TotalTasksTodoResponse'
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
 *                   example: "Error al obtener el total de tareas pendientes"
 *                 error:
 *                   type: string
 *                   example: "Database connection failed"
 */
router.get('/total-tasks-todo', authenticateToken, kpiController.getTotalTasksTodo);

/**
 * @swagger
 * /api/kpis/total-tasks-in-progress:
 *   get:
 *     summary: Obtener el total de tareas en progreso
 *     description: Endpoint que devuelve el número total de tareas con status 'in_progress'.
 *     tags: [KPIs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Total de tareas en progreso obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TotalTasksInProgressResponse'
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
 *                   example: "Error al obtener el total de tareas en progreso"
 *                 error:
 *                   type: string
 *                   example: "Database connection failed"
 */
router.get('/total-tasks-in-progress', authenticateToken, kpiController.getTotalTasksInProgress);

module.exports = router;
