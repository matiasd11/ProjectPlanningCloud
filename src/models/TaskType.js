const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const TaskType = sequelize.define('TaskType', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      len: [2, 100],
      notEmpty: true
    }
  }
}, {
  tableName: 'task_types',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['title'] }
  ]
});

module.exports = TaskType;