const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const TaskObservation = sequelize.define('TaskObservation', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  taskId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'task_id',
    references: {
      model: 'tasks',
      key: 'id'
    }
  },
  observations: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: [1, 2000],
      notEmpty: true
    },
    comment: 'Observaciones sobre el progreso de la tarea'
  },
  resolution: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: [0, 2000]
    },
    comment: 'Resolución o respuesta a las observaciones'
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'created_by',
    comment: 'Usuario que creó la observación'
  },
  resolvedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'resolved_by',
    comment: 'Usuario que resolvió la observación'
  },
  resolvedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'resolved_at',
    comment: 'Fecha de resolución'
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'created_at',
    comment: 'Fecha de creación de la observación'
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'updated_at',
    comment: 'Fecha de última actualización de la observación'
  },
  // Referencia al caso en Bonita BPM
  bonitaCaseId: {
    type: DataTypes.BIGINT,
    allowNull: true,
    field: 'bonita_case_id',
    comment: 'ID del caso en Bonita BPM'
  }
}, {
  tableName: 'task_observations',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['task_id'] },
    { fields: ['created_by'] },
    { fields: ['resolved_by'] },
    { fields: ['resolved_at'] },
    { fields: ['created_at'] },
    { fields: ['bonita_case_id'] }
  ]
});

module.exports = TaskObservation;
