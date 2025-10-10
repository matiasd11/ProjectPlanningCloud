const express = require('express');
const { TaskType } = require('../models');

const router = express.Router();

// Endpoint temporal para ejecutar migración de task types
router.post('/migrate-task-types', async (req, res) => {
  try {
    console.log('🚀 Ejecutando migración: Insertar tipos de tarea...');

    // Tipos de tarea a insertar
    const taskTypesToCreate = [
      'Planificación',
      'Ejecución',
      'Seguimiento',
      'Comunicación',
      'Evaluación',
      'Administración'
    ];

    const createdTypes = [];
    
    // Crear cada tipo de tarea
    for (const title of taskTypesToCreate) {
      const [taskType, created] = await TaskType.findOrCreate({
        where: { title },
        defaults: { title }
      });
      
      if (created) {
        console.log(`✅ Creado: ${title}`);
      } else {
        console.log(`ℹ️  Ya existe: ${title}`);
      }
      
      createdTypes.push(taskType);
    }

    console.log('✅ Migración completada');

    res.json({
      success: true,
      message: 'Tipos de tarea creados exitosamente',
      data: createdTypes
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