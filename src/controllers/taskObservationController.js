const { TaskObservation, Task } = require('../models');

const taskObservationController = {
  // Crear nueva observación para una tarea
  createObservation: async (req, res) => {
    try {
      const { taskId } = req.params;
      const { observations, userId, bonitaCaseId } = req.body;

      if (!taskId) {
        return res.status(400).json({
          success: false,
          message: 'taskId es requerido'
        });
      }

      if (!observations || observations.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Las observaciones son requeridas'
        });
      }

      // Buscar la tarea
      const task = await Task.findByPk(taskId);
      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Tarea no encontrada'
        });
      }

      // Verificar que la tarea esté en progreso
      if (task.status !== 'in_progress') {
        return res.status(400).json({
          success: false,
          message: 'Solo se pueden agregar observaciones a tareas en progreso'
        });
      }

      // Crear nueva observación en el historial
      const taskObservation = await TaskObservation.create({
        taskId: parseInt(taskId),
        observations: observations.trim(),
        createdBy: userId || null,
        bonitaCaseId: bonitaCaseId || null
      });

      // Obtener la observación con información adicional
      const observationWithDetails = await TaskObservation.findByPk(taskObservation.id, {
        include: [{
          model: Task,
          as: 'task',
          attributes: ['id', 'title', 'status']
        }]
      });

      res.status(201).json({
        success: true,
        data: observationWithDetails,
        message: 'Observación agregada al historial exitosamente'
      });

    } catch (error) {
      console.error('Error creating observation:', error);
      res.status(500).json({
        success: false,
        message: 'Error al crear observación',
        error: error.message
      });
    }
  },

  // Resolver una observación
  resolveObservation: async (req, res) => {
    try {
      const { observationId } = req.params;
      const { resolution, userId } = req.body;

      if (!observationId) {
        return res.status(400).json({
          success: false,
          message: 'observationId es requerido'
        });
      }

      if (!resolution || resolution.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'La resolución es requerida'
        });
      }

      // Buscar la observación
      const observation = await TaskObservation.findByPk(observationId);
      if (!observation) {
        return res.status(404).json({
          success: false,
          message: 'Observación no encontrada'
        });
      }

      // Verificar que no esté ya resuelta
      if (observation.resolution) {
        return res.status(400).json({
          success: false,
          message: 'Esta observación ya fue resuelta'
        });
      }

      // Actualizar con la resolución
      observation.resolution = resolution.trim();
      observation.resolvedBy = userId || null;
      observation.resolvedAt = new Date();
      await observation.save();

      // Obtener la observación actualizada
      const updatedObservation = await TaskObservation.findByPk(observationId, {
        include: [{
          model: Task,
          as: 'task',
          attributes: ['id', 'title', 'status']
        }]
      });

      res.json({
        success: true,
        data: updatedObservation,
        message: 'Observación resuelta exitosamente'
      });

    } catch (error) {
      console.error('Error resolving observation:', error);
      res.status(500).json({
        success: false,
        message: 'Error al resolver observación',
        error: error.message
      });
    }
  },

  // Obtener historial de observaciones de una tarea
  getTaskObservations: async (req, res) => {
    try {
      const { taskId } = req.params;
      const { page = 1, limit = 10, resolved } = req.query;
      const offset = (page - 1) * limit;

      if (!taskId) {
        return res.status(400).json({
          success: false,
          message: 'taskId es requerido'
        });
      }

      // Verificar que la tarea existe
      const task = await Task.findByPk(taskId);
      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Tarea no encontrada'
        });
      }

      // Construir filtros
      const whereClause = { taskId: parseInt(taskId) };
      if (resolved !== undefined) {
        if (resolved === 'true') {
          whereClause.resolution = { [Op.ne]: null };
        } else if (resolved === 'false') {
          whereClause.resolution = null;
        }
      }

      // Obtener observaciones con paginación
      const observations = await TaskObservation.findAndCountAll({
        where: whereClause,
        include: [{
          model: Task,
          as: 'task',
          attributes: ['id', 'title', 'status']
        }],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']]
      });

      res.json({
        success: true,
        data: observations.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: observations.count,
          totalPages: Math.ceil(observations.count / limit)
        }
      });

    } catch (error) {
      console.error('Error fetching task observations:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener observaciones de la tarea',
        error: error.message
      });
    }
  },

};

module.exports = taskObservationController;
