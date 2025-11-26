const { Task, TaskType, Commitment, TaskObservation, sequelize } = require('../models');
const { Op } = require('sequelize');

const taskController = {
  // Obtener todas las tareas
  getAllTasks: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const { status, projectId } = req.query;
      const offset = (page - 1) * limit;
      
      const whereClause = {};
      if (status) whereClause.status = status;
      if (projectId) whereClause.projectId = projectId;

      const tasks = await Task.findAndCountAll({
        where: whereClause,
        include: [{
          model: TaskType,
          as: 'taskType',
          attributes: ['id', 'title']
        }],
        limit: limit,
        offset: offset,
        order: [['id', 'DESC']]
      });

      res.json({
        success: true,
        data: tasks.rows,
        pagination: {
          page: page,
          limit: limit,
          total: tasks.count,
          totalPages: Math.ceil(tasks.count / limit)
        }
      });
    } catch (error) {
      console.error('Error fetching tasks:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener las tareas',
        error: error.message
      });
    }
  },

  // Obtener tareas por proyecto
  getTasksByProject: async (req, res) => {
    try {
      const { projectId } = req.params;
      const { status } = req.query;

      if (!projectId) {
        return res.status(400).json({
          success: false,
          message: 'projectId es requerido'
        });
      }

      const whereClause = { projectId };
      if (status) whereClause.status = status;

      const tasks = await Task.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: TaskType,
            as: 'taskType',
            attributes: ['id', 'title']
          },
          {
            model: Commitment,
            as: 'commitments',
            required: false
          },
          {
            model: TaskObservation,
            as: 'observations',
            required: false
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      res.json({
        success: true,
        data: tasks.rows,
      });
    } catch (error) {
      console.error('Error fetching tasks by project:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener las tareas por proyecto',
        error: error.message
      });
    }
  },

  // Obtener tareas por collaboratorId
  getTasksByCollaboratorId: async (req, res) => {
    try {
      const { collaboratorId } = req.params;
      const { status } = req.query;

      if (!collaboratorId) {
        return res.status(400).json({
          success: false,
          message: 'collaboratorId es requerido'
        });
      }

      const whereClause = { takenBy: collaboratorId };
      if (status) whereClause.status = status;

      const tasks = await Task.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: TaskType,
            as: 'taskType',
            attributes: ['id', 'title']
          },
          {
            model: Commitment,
            as: 'commitments',
            required: false
          },
          {
            model: TaskObservation,
            as: 'observations',
            required: false
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      res.json({
        success: true,
        data: tasks.rows,
      });
    } catch (error) {
      console.error('Error fetching tasks by project:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener las tareas por proyecto',
        error: error.message
      });
    }
  },

  // Obtener tareas de un proyecto que NO tienen Commitment asignado
  getUnassignedTasksByProject: async (req, res) => {
    try {
      const { projectId } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const { status } = req.query;
      const offset = (page - 1) * limit;

      if (!projectId) {
        return res.status(400).json({ success: false, message: 'projectId es requerido' });
      }

      // Buscar IDs de tareas con Commitment asignado y status 'approved'
      const assignedCommitments = await Commitment.findAll({
        attributes: ['taskId'],
        where: {
          taskId: { [Op.not]: null },
          status: 'approved'
        }
      });
      const assignedTaskIds = assignedCommitments.map(c => c.taskId);

      // Buscar tareas del proyecto que NO estén en assignedTaskIds
      const whereClause = {
        projectId
      };
      if (assignedTaskIds.length > 0) {
        whereClause.id = { [Op.notIn]: assignedTaskIds };
      }
      if (status) whereClause.status = status;

      const tasks = await Task.findAndCountAll({
        where: whereClause,
        include: [{
          model: TaskType,
          as: 'taskType',
          attributes: ['id', 'title']
        }],
        limit: limit,
        offset: offset,
        order: [['createdAt', 'DESC']]
      });

      res.json({
        success: true,
        data: tasks.rows,
        pagination: {
          page: page,
          limit: limit,
          total: tasks.count,
          totalPages: Math.ceil(tasks.count / limit)
        }
      });
    } catch (error) {
      console.error('Error fetching unassigned tasks by project:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener las tareas sin Commitment',
        error: error.message
      });
    }
  },

  // Obtener una tarea por ID
  getTaskById: async (req, res) => {
    try {
      const { id } = req.params;
      const task = await Task.findByPk(id, {
        include: [{
          model: TaskType,
          as: 'taskType',
          attributes: ['id', 'title']
        }]
      });

      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Tarea no encontrada'
        });
      }

      res.json({
        success: true,
        data: task
      });
    } catch (error) {
      console.error('Error fetching task:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener la tarea',
        error: error.message
      });
    }
  },

  // Crear una nueva tarea
  createTask: async (req, res) => {
    try {
      const task = await Task.create(req.body);
      const taskWithType = await Task.findByPk(task.id, {
        include: [{
          model: TaskType,
          as: 'taskType',
          attributes: ['id', 'title']
        }]
      });

      res.status(201).json({
        success: true,
        data: taskWithType,
        message: 'Tarea creada exitosamente'
      });
    } catch (error) {
      console.error('Error creating task:', error);
      res.status(400).json({
        success: false,
        message: 'Error al crear la tarea',
        error: error.message
      });
    }
  },

  // Actualizar el status de una tarea
  updateTask: async (req, res) => {
    try {
      const { taskId, status } = req.body;

      // Validar que se envíen los campos requeridos
      if (!taskId || !status) {
        return res.status(400).json({
          success: false,
          message: 'taskId y status son requeridos'
        });
      }

      // Validar que el status sea válido
      const validStatuses = ['todo', 'in_progress', 'done'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Status inválido. Valores permitidos: ${validStatuses.join(', ')}`
        });
      }

      // Actualizar solo el status
      const [updatedRows] = await Task.update(
        { status },
        {
          where: { id: taskId },
          returning: true
        }
      );

      if (updatedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Tarea no encontrada'
        });
      }

      const updatedTask = await Task.findByPk(taskId, {
        include: [{
          model: TaskType,
          as: 'taskType',
          attributes: ['id', 'title']
        }]
      });

      res.json({
        success: true,
        data: updatedTask,
        message: 'Status de la tarea actualizado exitosamente'
      });
    } catch (error) {
      console.error('Error updating task status:', error);
      res.status(400).json({
        success: false,
        message: 'Error al actualizar el status de la tarea',
        error: error.message
      });
    }
  },

  // Eliminar una tarea
  deleteTask: async (req, res) => {
    try {
      const { id } = req.params;
      const deletedRows = await Task.destroy({
        where: { id }
      });

      if (deletedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Tarea no encontrada'
        });
      }

      res.json({
        success: true,
        message: 'Tarea eliminada exitosamente'
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      res.status(500).json({
        success: false,
        message: 'Error al eliminar la tarea',
        error: error.message
      });
    }
  },

  // Crear múltiples tareas de una vez
  createMultipleTasks: async (req, res) => {
    try {
      const { tasks } = req.body;
      
      if (!Array.isArray(tasks) || tasks.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Se requiere un array de tareas válido'
        });
      }

      // Validar que todas las tareas tengan los campos requeridos
      for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        if (!task.title || !task.taskTypeId) {
          return res.status(400).json({
            success: false,
            message: `Tarea ${i + 1}: título y taskTypeId son requeridos`
          });
        }
        
        // Establecer valores por defecto
        task.isCoverageRequest = task.isCoverageRequest !== undefined ? task.isCoverageRequest : true;
        task.status = task.status || 'todo';
      }

      // Crear todas las tareas
      const createdTasks = await Task.bulkCreate(tasks, {
        returning: true
      });

      // Obtener las tareas creadas con sus relaciones
      const tasksWithTypes = await Task.findAll({
        where: {
          id: createdTasks.map(task => task.id)
        },
        include: [{
          model: TaskType,
          as: 'taskType',
          attributes: ['id', 'title']
        }],
        order: [['id', 'ASC']]
      });

      res.status(201).json({
        success: true,
        data: tasksWithTypes,
        message: `${createdTasks.length} tareas creadas exitosamente`
      });
    } catch (error) {
      console.error('Error creating multiple tasks:', error);
      res.status(400).json({
        success: false,
        message: 'Error al crear las tareas',
        error: error.message
      });
    }
  }
};

module.exports = taskController;