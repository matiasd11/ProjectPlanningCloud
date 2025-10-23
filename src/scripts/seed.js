#!/usr/bin/env node

/**
 * Script para ejecutar seeds manualmente
 * Uso: node src/scripts/seed.js
 */

const { sequelize } = require('../config/database');
const seedData = require('../seeds/seedData');

const runSeeds = async () => {
  try {
    console.log('🌱 Running manual database seeding...');
    
    // Conectar a la base de datos
    await sequelize.authenticate();
    console.log('✅ Database connected');
    
    // Ejecutar seeds
    await seedData();
    
    console.log('🎉 Manual seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during manual seeding:', error);
    process.exit(1);
  }
};

runSeeds();
