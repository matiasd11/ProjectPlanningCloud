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

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully');
    
    if (process.env.NODE_ENV !== 'test') {
      await sequelize.sync({ force: true, alter: true });
      console.log('✅ Database synchronized');
    }
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    console.error('Error details:', error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };