const { Commitment, Task } = require('../models');

const commitmentController = {
  // Marcar un commitment y su tarea como done
  commitmentDone: async (req, res) => {
    try {
      const { commitmentId } = req.body;
      if (!commitmentId) {
        return res.status(400).json({ success: false, message: 'commitmentId requerido' });
      }
      const commitment = await Commitment.findByPk(commitmentId);
      if (!commitment) {
        return res.status(404).json({ success: false, message: 'Commitment no encontrado' });
      }
      commitment.status = 'done';
      await commitment.save();
      // Marcar la tarea como done
      const task = await Task.findByPk(commitment.taskId);
      if (task) {
        task.status = 'done';
        await task.save();
      }
      res.json({ success: true, data: { commitment, task } });
    } catch (error) {
      console.error('Error marcando commitment y tarea como done:', error);
      res.status(500).json({ success: false, message: 'Error al marcar como done', error: error.message });
    }
  },
  // Obtener todos los commitments
  getAllCommitments: async (req, res) => {
    try {
      const commitments = await Commitment.findAll();
      res.json({ success: true, data: commitments });
    } catch (error) {
      console.error('Error fetching commitments:', error);
      res.status(500).json({ success: false, message: 'Error al obtener los commitments', error: error.message });
    }
  },
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
      // Permitir varios commitments por tarea
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
      // Verificar que no haya otro commitment aprobado para la tarea
      const alreadyApproved = await Commitment.findOne({ where: { taskId, status: 'approved' } });
      if (alreadyApproved) {
        return res.status(409).json({ success: false, message: 'Ya existe un Commitment aprobado para esta tarea' });
      }
      // Actualizar el commitment para asignar la tarea
      const commitment = await Commitment.findByPk(commitmentId);
      if (!commitment) {
        return res.status(404).json({ success: false, message: 'Commitment no encontrado' });
      }
      // Solo actualizar status y asegurar que el commitment corresponde a la tarea
      if (commitment.taskId !== taskId) {
        return res.status(400).json({ success: false, message: 'El Commitment no corresponde a la tarea indicada' });
      }
      commitment.status = 'approved';
      await commitment.save();
      res.json({ success: true, data: commitment });
    } catch (error) {
      console.error('Error asignando commitment:', error);
      res.status(500).json({ success: false, message: 'Error al asignar el commitment', error: error.message });
    }
  }
};

module.exports = commitmentController;
