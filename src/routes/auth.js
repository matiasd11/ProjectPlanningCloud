const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();


/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: Nombre de usuario
 *           example: "walter.bates"
 *         password:
 *           type: string
 *           description: Contraseña
 *           example: "bpm"
 *     LoginResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Autenticación exitosa"
 *         data:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *               description: JWT token
 *               example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IndhbGV0ci5iYXRlcyIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjUyMjU5MDIyfQ.2gI5zDn-C-e-fRRLY08d0j0c7o3tYwWxHxX-pB2V5E"
 *             user:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                   example: "walter.bates"
 *                 role:
 *                   type: string
 *                   example: "user"
 *             expiresIn:
 *               type: string
 *               example: "24h"
 */


/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Autenticar usuario.
 *     description: Método 1 - Método de autenticación a la API, donde se manda un usuario y contraseña y se obtiene un token jwt.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Autenticación exitosa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
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
 *                   example: "Username y password son requeridos"
 *       401:
 *         description: Credenciales inválidas
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
 *                   example: "Credenciales inválidas"
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
router.post('/login', authController.login);


// /**
//  * @swagger
//  * /api/auth/validate:
//  *   post:
//  *     summary: Validar token JWT
//  *     description: Valida si un token JWT es válido y no ha expirado
//  *     tags: [Authentication]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - token
//  *             properties:
//  *               token:
//  *                 type: string
//  *                 description: JWT token a validar
//  *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
//  *     responses:
//  *       200:
//  *         description: Token válido
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                   example: true
//  *                 message:
//  *                   type: string
//  *                   example: "Token válido"
//  *                 data:
//  *                   type: object
//  *                   properties:
//  *                     user:
//  *                       type: object
//  *                       description: Información del usuario decodificada
//  *                     isValid:
//  *                       type: boolean
//  *                       example: true
//  *       400:
//  *         description: Token requerido
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
//  *                   example: "Token requerido"
//  *       401:
//  *         description: Token inválido o expirado
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
//  *                   example: "Token inválido o expirado"
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
//  *                   example: "Error al validar token"
//  *                 error:
//  *                   type: string
//  *                   example: "JWT verification failed"
//  */
router.post('/validate', authController.validateToken);


module.exports = router;