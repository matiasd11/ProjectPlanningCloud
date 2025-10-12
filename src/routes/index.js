const express = require('express');
const tasksRoutes = require('./tasks');
const taskTypesRoutes = require('./taskTypes');
const migrationRoutes = require('./migration');
const authRoutes = require('./auth');

const router = express.Router();

// Rutas de la API
router.use('/tasks', tasksRoutes);
router.use('/task-types', taskTypesRoutes);
router.use('/migration', migrationRoutes);
router.use('/auth', authRoutes);

// Ruta de salud del API
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running properly',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Ruta por defecto - Con información de autenticación JWT
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Project Planning Cloud API',
    version: '1.0.0',
    authentication: 'JWT Bearer Token',
    endpoints: {
      auth: {
        login: '/api/auth/login',
        validate: '/api/auth/validate'
      },
      tasks: '/api/tasks',
      taskTypes: '/api/task-types',
      health: '/api/health'
    },
    bonita_integration: {
      step1: 'POST /api/auth/login with {username, password}',
      step2: 'Use returned token in Authorization header',
      step3: 'Send as: Bearer {your_jwt_token}',
      example_credentials: {
        username: 'bonita_user',
        password: 'bonita_pass'
      }
    },
    security_levels: {
      read_operations: 'Optional authentication',
      write_operations: 'Required authentication',
      protected_endpoints: ['POST', 'PUT', 'DELETE']
    }
  });
});

module.exports = router;