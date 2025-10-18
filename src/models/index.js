const { sequelize } = require('../config/database');
const Task = require('./Task');
const TaskType = require('./TaskType');

const Commitment = require('./Commitment');

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

module.exports = {
  sequelize,
  Task,
  TaskType
  ,Commitment
};