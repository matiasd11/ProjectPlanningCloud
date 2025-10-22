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
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'created_at',
    comment: 'Fecha de creación del tipo de tarea'
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'updated_at',
    comment: 'Fecha de última actualización del tipo de tarea'
  }
}, {
  tableName: 'task_types',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['title'] },
    { fields: ['created_at'] },
    { fields: ['updated_at'] }
  ]
});

module.exports = TaskType;