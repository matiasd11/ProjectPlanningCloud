const { sequelize } = require('../config/database');
const Task = require('./Task');
const TaskType = require('./TaskType');

const Commitment = require('./Commitment');
// const User = require('./User'); // Uncomment if User model exists

// Definir asociaciones
Task.belongsTo(TaskType, {
  foreignKey: 'taskTypeId',
  as: 'taskType'
});

TaskType.hasMany(Task, {
  foreignKey: 'taskTypeId',
  as: 'tasks'
});

// Commitment associations
Task.hasMany(Commitment, { 
  foreignKey: 'taskId', 
  as: 'commitments' 
});

Commitment.belongsTo(Task, { 
  foreignKey: 'taskId', 
  as: 'task' 
});

// Uncomment if User model exists
// User.hasMany(Commitment, { 
//   foreignKey: 'ongId', 
//   as: 'commitments' 
// });

// Commitment.belongsTo(User, { 
//   foreignKey: 'ongId', 
//   as: 'ong' 
// });

module.exports = {
  sequelize,
  Task,
  TaskType
  ,Commitment
  // ,User
};