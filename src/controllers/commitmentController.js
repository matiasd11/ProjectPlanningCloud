const { Commitment, Task } = require('../models');

const commitmentController = {
  // Crear un nuevo commitment
  createCommitment: async (req, res) => {
    try {
      const { taskId, ongId, status, description } = req.body;
      if (!taskId || !ongId) {
        return res.status(400).json({
          success: false,
          message: 'taskId y ongId son requeridos'
        });
      }
      // Verificar que la tarea no tenga un commitment asignado
      const existing = await Commitment.findOne({ where: { taskId } });
      if (existing) {
        return res.status(409).json({
          success: false,
          message: 'La tarea ya tiene un Commitment asignado'
        });
      }
      const commitment = await Commitment.create({ taskId, ongId, status, description });
      res.status(201).json({ success: true, data: commitment });
    } catch (error) {
      console.error('Error creando commitment:', error);
      res.status(500).json({ success: false, message: 'Error al crear el commitment', error: error.message });
    }
  },

  // Asignar un commitment existente a una tarea
  assignCommitmentToTask: async (req, res) => {
    try {
      const { commitmentId, taskId } = req.body;
      if (!commitmentId || !taskId) {
        return res.status(400).json({ success: false, message: 'commitmentId y taskId son requeridos' });
      }
      // Verificar que la tarea no tenga un commitment asignado
      const existing = await Commitment.findOne({ where: { taskId } });
      if (existing) {
        return res.status(409).json({ success: false, message: 'La tarea ya tiene un Commitment asignado' });
      }
      // Actualizar el commitment para asignar la tarea
      const commitment = await Commitment.findByPk(commitmentId);
      if (!commitment) {
        return res.status(404).json({ success: false, message: 'Commitment no encontrado' });
      }
      commitment.taskId = taskId;
      await commitment.save();
      res.json({ success: true, data: commitment });
    } catch (error) {
      console.error('Error asignando commitment:', error);
      res.status(500).json({ success: false, message: 'Error al asignar el commitment', error: error.message });
    }
  }
};

module.exports = commitmentController;
