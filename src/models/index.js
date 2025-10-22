const { sequelize } = require('../config/database');
const Task = require('./Task');
const TaskType = require('./TaskType');
const Commitment = require('./Commitment');
const TaskObservation = require('./TaskObservation');

// Relaciones entre modelos
Task.belongsTo(TaskType, {
  foreignKey: 'taskTypeId',
  as: 'taskType'
});

TaskType.hasMany(Task, {
  foreignKey: 'taskTypeId',
  as: 'tasks'
});

Task.hasMany(Commitment, { 
  foreignKey: 'taskId', 
  as: 'commitments' 
});

Commitment.belongsTo(Task, { 
  foreignKey: 'taskId', 
  as: 'task' 
});

Task.hasMany(TaskObservation, {
  foreignKey: 'taskId',
  as: 'observations'
});

TaskObservation.belongsTo(Task, {
  foreignKey: 'taskId',
  as: 'task'
});

module.exports = {
  sequelize,
  Task,
  TaskType,
  Commitment,
  TaskObservation
};