const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// ✅ Configurar Sequelize con Supabase
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // importante para Render/Supabase
    },
  },
  logging: false,
});

const connectDB = async (retries = 10, delay = 5000) => {
  while (retries) {
    try {
      console.log('🔄 Attempting to connect to the database...');
      await sequelize.authenticate();
      console.log('✅ Database connection established successfully');

      // 🚫 Solo ejecutar init.sql si estamos en desarrollo local
      if (process.env.NODE_ENV === 'development') {
        const initSqlPath = path.join(__dirname, '../../init.sql');
        if (fs.existsSync(initSqlPath)) {
          console.log('🔄 Running init.sql...');
          try {
            const initSql = fs.readFileSync(initSqlPath, 'utf8');
            const statements = initSql
              .split(';')
              .map(stmt => stmt.trim())
              .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

            for (const stmt of statements) {
              await sequelize.query(stmt);
            }
            console.log('✅ init.sql executed successfully');
          } catch (initError) {
            console.log('⚠️ Error executing init.sql:', initError.message);
          }
        } else {
          console.log('ℹ️ init.sql not found');
        }
      }

      // ✅ Sincronizar modelos (sin borrar datos)
      await sequelize.sync({ alter: true });
      console.log('✅ Database synchronized');

      return; // conexión exitosa → salir
    } catch (error) {
      console.error(`❌ Database connection failed: ${error.message}`);
      retries -= 1;
      if (!retries) {
        console.error('❌ All retries exhausted. Exiting.');
        process.exit(1);
      }
      console.log(`⏳ Retrying in ${delay / 1000}s... (${retries} attempts left)`);
      await new Promise(res => setTimeout(res, delay));
    }
  }
};

module.exports = { sequelize, connectDB };
