const express = require('express');
const { sequelize } = require('../config/database');
const { QueryTypes } = require('sequelize');

const router = express.Router();

// Endpoint temporal para ejecutar migración de task types
router.post('/migrate-task-types', async (req, res) => {
  try {
    console.log('🚀 Ejecutando migración: Insertar tipos de tarea...');

    // Insertar tipos de tarea por defecto (PostgreSQL syntax)
    await sequelize.query(`
      INSERT INTO task_types (title, "createdAt", "updatedAt") VALUES 
        ('Planificación', NOW(), NOW()),
        ('Ejecución', NOW(), NOW()),
        ('Seguimiento', NOW(), NOW()),
        ('Comunicación', NOW(), NOW()),
        ('Evaluación', NOW(), NOW()),
        ('Administración', NOW(), NOW())
      ON CONFLICT (title) DO NOTHING
    `, { type: QueryTypes.INSERT });

    console.log('✅ Tipos de tarea insertados');

    // Verificar los tipos insertados
    const taskTypes = await sequelize.query(`
      SELECT id, title FROM task_types ORDER BY id
    `, { type: QueryTypes.SELECT });

    console.log('📋 Tipos de tarea disponibles:', taskTypes);

    res.json({
      success: true,
      message: 'Tipos de tarea creados exitosamente',
      data: taskTypes
    });
    
  } catch (error) {
    console.error('❌ Error en la migración:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error al crear tipos de tarea',
      error: error.message
    });
  }
});

module.exports = router;