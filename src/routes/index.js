const express = require('express');
const tasksRoutes = require('./tasks');
const taskTypesRoutes = require('./taskTypes');
const migrationRoutes = require('./migration');

const router = express.Router();

// Rutas de la API
router.use('/tasks', tasksRoutes);
router.use('/task-types', taskTypesRoutes);
router.use('/migration', migrationRoutes);

// Ruta de salud del API
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running properly',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Ruta por defecto
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Project Planning Cloud API',
    version: '1.0.0',
    endpoints: {
      tasks: '/api/tasks',
      taskTypes: '/api/task-types',
      health: '/api/health'
    }
  });
});

module.exports = router;