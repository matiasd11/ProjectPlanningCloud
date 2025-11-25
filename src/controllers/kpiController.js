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
    },

    // Obtener el total de tareas con status 'todo'
    getTotalTasksTodo: async (req, res) => {
        try {
            const totalTasksTodo = await Task.count({
                where: {
                    status: 'todo'
                }
            });

            res.json({
                success: true,
                data: {
                    totalTasksTodo: totalTasksTodo
                }
            });
        } catch (error) {
            console.error('Error fetching total tasks todo:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener el total de tareas pendientes',
                error: error.message
            });
        }
    },

    // Obtener el total de tareas con status 'in_progress'
    getTotalTasksInProgress: async (req, res) => {
        try {
            const totalTasksInProgress = await Task.count({
                where: {
                    status: 'in_progress'
                }
            });

            res.json({
                success: true,
                data: {
                    totalTasksInProgress: totalTasksInProgress
                }
            });
        } catch (error) {
            console.error('Error fetching total tasks in progress:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener el total de tareas en progreso',
                error: error.message
            });
        }
    },

    // Obtener el total de tareas con status 'done'
    getTotalTasksDone: async (req, res) => {
        try {
            const totalTasksDone = await Task.count({
                where: {
                    status: 'done'
                }
            });

            res.json({
                success: true,
                data: {
                    totalTasksDone: totalTasksDone
                }
            });
        } catch (error) {
            console.error('Error fetching total tasks done:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener el total de tareas completadas',
                error: error.message
            });
        }
    }
};

module.exports = kpiController;