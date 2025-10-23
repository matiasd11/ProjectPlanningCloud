const { Sequelize } = require('sequelize');
require('dotenv').config();

// Configuración para usar DATABASE_URL (Render) o variables individuales (local)
const sequelize = process.env.DATABASE_URL 
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      dialectOptions: {
        ssl: process.env.NODE_ENV === 'production' ? {
          require: true,
          rejectUnauthorized: false
        } : false
      },
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

const connectDB = async (retries = 10, delay = 5000) => {
  while (retries) {
    try {
      console.log('🔄 Attempting to connect to the database...');
      await sequelize.authenticate();
      console.log('✅ Database connection established successfully');

      if (process.env.NODE_ENV !== 'test') {
        await sequelize.sync({ force: false, alter: true });
        console.log('✅ Database synchronized');
        
        const seedData = require('../seeds/seedData');
        await seedData();
      }

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