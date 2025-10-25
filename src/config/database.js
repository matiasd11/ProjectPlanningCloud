const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Crear la instancia de Sequelize
const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: { require: true, rejectUnauthorized: false }
    },
    logging: false, // no logea SQL en producción
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: true
    }
  })
  : new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      dialect: 'postgres',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      define: {
        timestamps: true,
        underscored: true
      }
    }
  );

// Función para conectar y opcionalmente inicializar la DB
const connectDB = async (retries = 10, delay = 5000) => {
  while (retries) {
    try {
      console.log('🔄 Attempting to connect to the database...');
      await sequelize.authenticate();
      console.log('✅ Database connection established successfully');

      // Ejecutar init.sql para inicializar datos (desarrollo y producción)
      if (process.env.NODE_ENV !== 'test') {
        try {
          console.log('🔄 Initializing database with init.sql...');
          const initSqlPath = path.join(__dirname, '../../init.sql');
          
          if (!fs.existsSync(initSqlPath)) {
            console.log('⚠️ init.sql not found. Skipping initialization.');
          } else {
            const initSql = fs.readFileSync(initSqlPath, 'utf8');

            const statements = initSql
              .split(';')
              .map(stmt => stmt.trim())
              .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

            for (const statement of statements) {
              if (statement.trim()) {
                try {
                  await sequelize.query(statement);
                } catch (err) {
                  // Ignorar errores de statements que ya existen (ON CONFLICT DO NOTHING)
                  console.log('ℹ️ Statement skipped:', err.message);
                }
              }
            }

            console.log('✅ Database initialization completed');
          }
        } catch (initError) {
          console.log('ℹ️ Database initialization error:', initError.message);
        }
      }

      // Sincronizar modelos
      await sequelize.sync({ force: false, alter: true });
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



