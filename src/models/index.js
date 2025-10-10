const { sequelize } = require('../config/database');
const Task = require('./Task');
const TaskType = require('./TaskType');

// Definir asociaciones
Task.belongsTo(TaskType, {
  foreignKey: 'taskTypeId',
  as: 'taskType'
});

TaskType.hasMany(Task, {
  foreignKey: 'taskTypeId',
  as: 'tasks'
});

module.exports = {
  sequelize,
  Task,
  TaskType
};