const { Task } = require('../models');

const kpiController = {
    // Obtener el total de tareas cargadas
    getTotalTasks: async (req, res) => {
        try {
            const totalTasks = await Task.count();

            res.json({
                success: true,
                data: {
                    totalTasks: totalTasks
                }
            });
        } catch (error) {
            console.error('Error fetching total tasks:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener el total de tareas',
                error: error.message
            });
        }
    }
};

module.exports = kpiController;