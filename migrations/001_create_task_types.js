const { sequelize } = require('../src/config/database');
const { QueryTypes } = require('sequelize');

/**
 * Migración para insertar tipos de tarea por defecto (PostgreSQL)
 * Ejecutar con: node migrations/001_create_task_types.js
 */

const runMigration = async () => {
  try {
    console.log('🚀 Iniciando migración: Insertar tipos de tarea...');

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

    console.log('📋 Tipos de tarea disponibles:');
    taskTypes.forEach(type => {
      console.log(`  ${type.id}: ${type.title}`);
    });

    console.log('🎉 Migración completada exitosamente!');
    
  } catch (error) {
    console.error('❌ Error en la migración:', error.message);
    throw error;
  }
};

// Ejecutar migración si se llama directamente
if (require.main === module) {
  runMigration()
    .then(() => {
      console.log('✅ Migración finalizada');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error:', error);
      process.exit(1);
    });
}

module.exports = { runMigration };