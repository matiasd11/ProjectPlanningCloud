const { Task } = require('../models');

const kpiController = {
    // Obtener el total de tareas cargadas por día
    getTotalTasks: async (req, res) => {
        try {
            const days = parseInt(req.query.days) || 30;
            const { sequelize } = require('../models');
            const { Op } = require('sequelize');

            // Calcular fecha de inicio
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - days);

            // Total general
            const totalTasks = await Task.count();

            // Tareas por día
            const tasksPerDay = await Task.findAll({
                attributes: [
                    [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
                    [sequelize.fn('COUNT', sequelize.col('id')), 'total']
                ],
                where: {
                    createdAt: {
                        [Op.gte]: startDate,
                        [Op.lte]: endDate
                    }
                },
                group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
                order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'ASC']]
            });

            res.json({
                success: true,
                data: {
                    total: totalTasks,
                    period: {
                        startDate: startDate.toISOString().split('T')[0],
                        endDate: endDate.toISOString().split('T')[0],
                        days: days
                    },
                    tasksPerDay: tasksPerDay.map(item => ({
                        date: item.dataValues.date,
                        total: parseInt(item.dataValues.total)
                    }))
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

    // Obtener el total de tareas con status 'todo' por día
    getTotalTasksTodo: async (req, res) => {
        try {
            const days = parseInt(req.query.days) || 30;
            const { sequelize } = require('../models');
            const { Op } = require('sequelize');

            // Calcular fecha de inicio
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - days);

            // Total de tareas todo
            const totalTasksTodo = await Task.count({
                where: { status: 'todo' }
            });

            // Tareas todo por día
            const tasksPerDay = await Task.findAll({
                attributes: [
                    [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
                    [sequelize.fn('COUNT', sequelize.col('id')), 'total']
                ],
                where: {
                    status: 'todo',
                    createdAt: {
                        [Op.gte]: startDate,
                        [Op.lte]: endDate
                    }
                },
                group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
                order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'ASC']]
            });

            res.json({
                success: true,
                data: {
                    total: totalTasksTodo,
                    period: {
                        startDate: startDate.toISOString().split('T')[0],
                        endDate: endDate.toISOString().split('T')[0],
                        days: days
                    },
                    tasksPerDay: tasksPerDay.map(item => ({
                        date: item.dataValues.date,
                        total: parseInt(item.dataValues.total)
                    }))
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

    // Obtener el total de tareas con status 'in_progress' por día
    getTotalTasksInProgress: async (req, res) => {
        try {
            const days = parseInt(req.query.days) || 30;
            const { sequelize } = require('../models');
            const { Op } = require('sequelize');

            // Calcular fecha de inicio
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - days);

            // Total de tareas en progreso
            const totalTasksInProgress = await Task.count({
                where: { status: 'in_progress' }
            });

            // Tareas en progreso por día
            const tasksPerDay = await Task.findAll({
                attributes: [
                    [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
                    [sequelize.fn('COUNT', sequelize.col('id')), 'total']
                ],
                where: {
                    status: 'in_progress',
                    createdAt: {
                        [Op.gte]: startDate,
                        [Op.lte]: endDate
                    }
                },
                group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
                order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'ASC']]
            });

            res.json({
                success: true,
                data: {
                    total: totalTasksInProgress,
                    period: {
                        startDate: startDate.toISOString().split('T')[0],
                        endDate: endDate.toISOString().split('T')[0],
                        days: days
                    },
                    tasksPerDay: tasksPerDay.map(item => ({
                        date: item.dataValues.date,
                        total: parseInt(item.dataValues.total)
                    }))
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

    // Obtener el total de tareas con status 'done' por día
    getTotalTasksDone: async (req, res) => {
        try {
            const days = parseInt(req.query.days) || 30;
            const { sequelize } = require('../models');
            const { Op } = require('sequelize');

            // Calcular fecha de inicio
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - days);

            // Total de tareas completadas
            const totalTasksDone = await Task.count({
                where: { status: 'done' }
            });

            // Tareas completadas por día
            const tasksPerDay = await Task.findAll({
                attributes: [
                    [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
                    [sequelize.fn('COUNT', sequelize.col('id')), 'total']
                ],
                where: {
                    status: 'done',
                    createdAt: {
                        [Op.gte]: startDate,
                        [Op.lte]: endDate
                    }
                },
                group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
                order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'ASC']]
            });

            res.json({
                success: true,
                data: {
                    total: totalTasksDone,
                    period: {
                        startDate: startDate.toISOString().split('T')[0],
                        endDate: endDate.toISOString().split('T')[0],
                        days: days
                    },
                    tasksPerDay: tasksPerDay.map(item => ({
                        date: item.dataValues.date,
                        total: parseInt(item.dataValues.total)
                    }))
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