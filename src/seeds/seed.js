const { TaskType, Task, Commitment, TaskObservation } = require('../models');

async function seed() {
    try {
        // ---- TaskTypes ----
        const taskTypeCount = await TaskType.count();
        if (taskTypeCount === 0) {
            await TaskType.bulkCreate([
                { title: 'Construcción de viviendas de emergencia' },
                { title: 'Instalación de paneles solares o eólicos' },
                { title: 'Donación de materiales de construcción' },
                { title: 'Voluntariado técnico' },
                { title: 'Financiamiento económico' },
                { title: 'Refacción de escuelas u hospitales' },
                { title: 'Reforestación o plantación de árboles' },
                { title: 'Gestión de residuos y reciclaje' },
                { title: 'Equipamiento informático o tecnológico' }
            ]);
            console.log('✅ TaskTypes seeded');
        }

        // ---- Tasks ----
        const taskCount = await Task.count();
        if (taskCount === 0) {
            // Obtener los TaskTypes para usar sus IDs reales
            const taskTypes = await TaskType.findAll();

            await Task.bulkCreate([
                {
                    title: 'Nivelación del terreno',
                    description: 'Preparar el suelo para la construcción del centro comunitario, asegurando el drenaje y la estabilidad.',
                    status: 'in_progress',
                    due_date: new Date('2024-12-31T23:59:59Z'),
                    estimated_hours: 8.5,
                    project_id: 1,
                    taken_by: 3,
                    created_by: 1,
                    task_type_id: taskTypes[0].id,
                    is_coverage_request: true
                },
                {
                    title: 'Instalación de sistema eléctrico',
                    description: 'Instalar cableado eléctrico básico para el centro comunitario.',
                    status: 'todo',
                    due_date: new Date('2024-11-30T23:59:59Z'),
                    estimated_hours: 12.0,
                    project_id: 1,
                    taken_by: 2,
                    created_by: 1,
                    task_type_id: taskTypes[1].id,
                    is_coverage_request: false
                },
                {
                    title: 'Construcción de muros',
                    description: 'Levantar muros de ladrillo para las habitaciones principales.',
                    status: 'todo',
                    due_date: new Date('2024-10-15T23:59:59Z'),
                    estimated_hours: 24.0,
                    project_id: 1,
                    taken_by: null,
                    created_by: 1,
                    task_type_id: taskTypes[2].id,
                    is_coverage_request: true
                },
                {
                    title: 'Pintura exterior',
                    description: 'Aplicar pintura ecológica en muros exteriores para mejorar la imagen y proteger las superficies.',
                    status: 'todo',
                    due_date: new Date('2024-09-30T23:59:59Z'),
                    estimated_hours: 8.5,
                    project_id: 1,
                    taken_by: 1,
                    created_by: 1,
                    task_type_id: taskTypes[3].id,
                    is_coverage_request: false
                },
                {
                    title: 'Instalación de paneles solares',
                    description: 'Colocar paneles solares para energía renovable del centro.',
                    status: 'todo',
                    due_date: new Date('2024-08-20T23:59:59Z'),
                    estimated_hours: 16.0,
                    project_id: 1,
                    taken_by: null,
                    created_by: 2,
                    task_type_id: taskTypes[4].id,
                    is_coverage_request: true
                }
            ]);
            console.log('✅ Tasks seeded');
        }

        // ---- Commitments ----
        const commitmentCount = await Commitment.count();
        if (commitmentCount === 0) {
            await Commitment.bulkCreate([
                { task_id: 1, ong_id: 3, status: 'approved', description: 'Nos comprometemos a financiar esta etapa con un aporte mensual durante tres meses.' },
                { task_id: 2, ong_id: 2, status: 'pending', description: 'Ofrecemos voluntarios técnicos especializados en instalaciones eléctricas.' },
                { task_id: 3, ong_id: 1, status: 'pending', description: 'Donaremos los materiales de construcción necesarios: cemento, ladrillos y arena.' },
                { task_id: 4, ong_id: 1, status: 'approved', description: 'Nos hacemos cargo de la pintura exterior con materiales ecológicos.' },
                { task_id: 5, ong_id: 2, status: 'pending', description: 'Proporcionaremos los paneles solares y la instalación técnica.' }
            ]);
            console.log('✅ Commitments seeded');
        }

        // ---- TaskObservations ----
        const obsCount = await TaskObservation.count();
        if (obsCount === 0) {
            await TaskObservation.bulkCreate([
                {
                    task_id: 1,
                    observations: 'El avance reportado es menor al esperado para esta etapa. Los materiales no han llegado según lo programado.',
                    resolution: 'Se asignarán dos voluntarios adicionales para acelerar la ejecución y cumplir los tiempos.',
                    created_by: 2,
                    resolved_by: 1,
                    resolved_at: new Date('2024-01-18T15:30:00Z')
                },
                {
                    task_id: 1,
                    observations: 'Se requiere verificación adicional de la calidad del suelo antes de continuar con la construcción.',
                    resolution: 'Se ha contratado un ingeniero geotécnico para realizar un estudio completo del suelo. Los resultados estarán disponibles en 3 días hábiles.',
                    created_by: 2,
                    resolved_by: 1,
                    resolved_at: new Date('2024-01-18T11:45:00Z')
                },
                {
                    task_id: 2,
                    observations: 'Los voluntarios reportan dificultades con el equipo eléctrico proporcionado. Se necesita capacitación adicional.',
                    resolution: null,
                    created_by: 3,
                    resolved_by: null,
                    resolved_at: null
                },
                {
                    task_id: 3,
                    observations: 'Los materiales donados no cumplen con las especificaciones técnicas requeridas para la construcción.',
                    resolution: null,
                    created_by: 1,
                    resolved_by: null,
                    resolved_at: null
                },
                {
                    task_id: 4,
                    observations: 'El clima lluvioso está retrasando la aplicación de la pintura exterior.',
                    resolution: null,
                    created_by: 2,
                    resolved_by: null,
                    resolved_at: null
                }
            ]);
            console.log('✅ TaskObservations seeded');
        }

        console.log('🎉 All seeds applied successfully!');
    } catch (error) {
        console.error('❌ Seeding failed:', error);
    }
}

module.exports = seed;
