const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING(150),
    allowNull: false,
    validate: {
      len: [3, 150],
      notEmpty: true
    }
  },
  description: {
    type: DataTypes.TEXT,
    validate: {
      len: [0, 1000]
    }
  },
  status: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'todo',
    validate: {
      isIn: [['todo', 'in_progress', 'done']]
    }
  },
  dueDate: {
    type: DataTypes.DATE,
    field: 'due_date',
    validate: {
      isDate: true
    }
  },
  estimatedHours: {
    type: DataTypes.DECIMAL(5, 2),
    field: 'estimated_hours',
    validate: {
      min: 0
    }
  },
  actualHours: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0,
    field: 'actual_hours',
    validate: {
      min: 0
    }
  },
  projectId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'project_id'
  },
  takenBy: {
    type: DataTypes.INTEGER,
    field: 'taken_by',
    comment: 'ONG que se hace cargo voluntariamente de esta tarea'
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'created_by'
  },
  taskTypeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'task_type_id',
    references: {
      model: 'task_types',
      key: 'id'
    }
  },
  isCoverageRequest: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_coverage_request'
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'created_at',
    comment: 'Fecha de creación de la tarea'
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'updated_at',
    comment: 'Fecha de última actualización de la tarea'
  }
}, {
  tableName: 'tasks',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['project_id'] },
    { fields: ['status'] },
    { fields: ['task_type_id'] },
    { fields: ['due_date'] },
    { fields: ['taken_by'] },
    { fields: ['created_by'] },
    { fields: ['created_at'] },
  ]
});

// Métodos de instancia
Task.prototype.isOverdue = function() {
  return this.dueDate && new Date() > this.dueDate && this.status !== 'done';
};

Task.prototype.getProgress = function() {
  const statusProgress = {
    todo: 0,
    in_progress: 25,
    done: 100,
  };
  return statusProgress[this.status] || 0;
};

module.exports = Task;