const { TaskType } = require('../models');

const taskTypeController = {
  // Obtener todos los tipos de tarea
  getAllTaskTypes: async (req, res) => {
    try {
      const taskTypes = await TaskType.findAll({
        order: [['title', 'ASC']]
      });

      res.json({
        success: true,
        data: taskTypes
      });
    } catch (error) {
      console.error('Error fetching task types:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener los tipos de tarea',
        error: error.message
      });
    }
  },

  // Obtener un tipo de tarea por ID
  getTaskTypeById: async (req, res) => {
    try {
      const { id } = req.params;
      const taskType = await TaskType.findByPk(id);

      if (!taskType) {
        return res.status(404).json({
          success: false,
          message: 'Tipo de tarea no encontrado'
        });
      }

      res.json({
        success: true,
        data: taskType
      });
    } catch (error) {
      console.error('Error fetching task type:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener el tipo de tarea',
        error: error.message
      });
    }
  },

  // Crear un nuevo tipo de tarea
  createTaskType: async (req, res) => {
    try {
      const taskType = await TaskType.create(req.body);

      res.status(201).json({
        success: true,
        data: taskType,
        message: 'Tipo de tarea creado exitosamente'
      });
    } catch (error) {
      console.error('Error creating task type:', error);
      res.status(400).json({
        success: false,
        message: 'Error al crear el tipo de tarea',
        error: error.message
      });
    }
  },

  // Actualizar un tipo de tarea
  updateTaskType: async (req, res) => {
    try {
      const { id } = req.params;
      const [updatedRows] = await TaskType.update(req.body, {
        where: { id },
        returning: true
      });

      if (updatedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Tipo de tarea no encontrado'
        });
      }

      const updatedTaskType = await TaskType.findByPk(id);

      res.json({
        success: true,
        data: updatedTaskType,
        message: 'Tipo de tarea actualizado exitosamente'
      });
    } catch (error) {
      console.error('Error updating task type:', error);
      res.status(400).json({
        success: false,
        message: 'Error al actualizar el tipo de tarea',
        error: error.message
      });
    }
  },

  // Eliminar un tipo de tarea
  deleteTaskType: async (req, res) => {
    try {
      const { id } = req.params;
      const deletedRows = await TaskType.destroy({
        where: { id }
      });

      if (deletedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Tipo de tarea no encontrado'
        });
      }

      res.json({
        success: true,
        message: 'Tipo de tarea eliminado exitosamente'
      });
    } catch (error) {
      console.error('Error deleting task type:', error);
      res.status(500).json({
        success: false,
        message: 'Error al eliminar el tipo de tarea',
        error: error.message
      });
    }
  }
};

module.exports = taskTypeController;