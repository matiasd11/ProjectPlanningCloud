const { Task, TaskType, Commitment, TaskObservation } = require('../models');

const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Verificar si ya hay datos
    const existingTasks = await Task.count();
    if (existingTasks > 0) {
      console.log('📊 Database already has data, skipping seed');
      return;
    }

    // Crear datos de ejemplo para tasks
    const tasks = await Task.bulkCreate([
      {
        title: 'Nivelación del terreno',
        description: 'Preparar el suelo para la construcción del centro comunitario, asegurando el drenaje y la estabilidad.',
        status: 'in_progress',
        dueDate: new Date('2024-12-31T23:59:59Z'),
        estimatedHours: 8.5,
        projectId: 1,
        takenBy: 3,
        createdBy: 1,
        taskTypeId: 1,
        isCoverageRequest: true
      },
      {
        title: 'Instalación de sistema eléctrico',
        description: 'Instalar cableado eléctrico básico para el centro comunitario.',
        status: 'todo',
        dueDate: new Date('2024-11-30T23:59:59Z'),
        estimatedHours: 12.0,
        projectId: 1,
        takenBy: 2,
        createdBy: 1,
        taskTypeId: 2,
        isCoverageRequest: false
      },
      {
        title: 'Construcción de muros',
        description: 'Levantar muros de ladrillo para las habitaciones principales.',
        status: 'todo',
        dueDate: new Date('2024-10-15T23:59:59Z'),
        estimatedHours: 24.0,
        projectId: 1,
        takenBy: null,
        createdBy: 1,
        taskTypeId: 1,
        isCoverageRequest: true
      },
      {
        title: 'Pintura exterior',
        description: 'Aplicar pintura ecológica en muros exteriores para mejorar la imagen y proteger las superficies.',
        status: 'todo',
        dueDate: new Date('2024-09-30T23:59:59Z'),
        estimatedHours: 8.5,
        projectId: 1,
        takenBy: 1,
        createdBy: 1,
        taskTypeId: 1,
        isCoverageRequest: false
      },
      {
        title: 'Instalación de paneles solares',
        description: 'Colocar paneles solares para energía renovable del centro.',
        status: 'todo',
        dueDate: new Date('2024-08-20T23:59:59Z'),
        estimatedHours: 16.0,
        projectId: 1,
        takenBy: null,
        createdBy: 1,
        taskTypeId: 2,
        isCoverageRequest: true
      }
    ]);

    console.log(`✅ Created ${tasks.length} tasks`);

    // Crear datos de ejemplo para commitments
    const commitments = await Commitment.bulkCreate([
      {
        taskId: tasks[0].id, // Nivelación del terreno
        ongId: 3,
        status: 'approved',
        description: 'Nos comprometemos a financiar esta etapa con un aporte mensual durante tres meses.'
      },
      {
        taskId: tasks[1].id, // Instalación de sistema eléctrico
        ongId: 2,
        status: 'pending',
        description: 'Ofrecemos voluntarios técnicos especializados en instalaciones eléctricas.'
      },
      {
        taskId: tasks[2].id, // Construcción de muros
        ongId: 1,
        status: 'pending',
        description: 'Donaremos los materiales de construcción necesarios: cemento, ladrillos y arena.'
      },
      {
        taskId: tasks[3].id, // Pintura exterior
        ongId: 1,
        status: 'approved',
        description: 'Nos hacemos cargo de la pintura exterior con materiales ecológicos.'
      },
      {
        taskId: tasks[4].id, // Instalación de paneles solares
        ongId: 2,
        status: 'pending',
        description: 'Proporcionaremos los paneles solares y la instalación técnica.'
      }
    ]);

    console.log(`✅ Created ${commitments.length} commitments`);

    // Crear datos de ejemplo para task_observations
    const observations = await TaskObservation.bulkCreate([
      {
        taskId: tasks[0].id, // Nivelación del terreno
        observations: 'El avance reportado es menor al esperado para esta etapa. Los materiales no han llegado según lo programado.',
        resolution: 'Se asignarán dos voluntarios adicionales para acelerar la ejecución y cumplir los tiempos.',
        createdBy: 2,
        resolvedBy: 1,
        resolvedAt: new Date('2024-01-18T15:30:00Z')
      },
      {
        taskId: tasks[0].id, // Nivelación del terreno
        observations: 'Se requiere verificación adicional de la calidad del suelo antes de continuar con la construcción.',
        resolution: 'Se ha contratado un ingeniero geotécnico para realizar un estudio completo del suelo. Los resultados estarán disponibles en 3 días hábiles.',
        createdBy: 2,
        resolvedBy: 1,
        resolvedAt: new Date('2024-01-18T11:45:00Z')
      },
      {
        taskId: tasks[1].id, // Instalación de sistema eléctrico
        observations: 'Los voluntarios reportan dificultades con el equipo eléctrico proporcionado. Se necesita capacitación adicional.',
        resolution: null,
        createdBy: 3,
        resolvedBy: null,
        resolvedAt: null
      },
      {
        taskId: tasks[2].id, // Construcción de muros
        observations: 'Los materiales donados no cumplen con las especificaciones técnicas requeridas para la construcción.',
        resolution: null,
        createdBy: 1,
        resolvedBy: null,
        resolvedAt: null
      },
      {
        taskId: tasks[3].id, // Pintura exterior
        observations: 'El clima lluvioso está retrasando la aplicación de la pintura exterior.',
        resolution: null,
        createdBy: 2,
        resolvedBy: null,
        resolvedAt: null
      }
    ]);

    console.log(`✅ Created ${observations.length} task observations`);

    console.log('🎉 Database seeding completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - Tasks: ${tasks.length}`);
    console.log(`   - Commitments: ${commitments.length}`);
    console.log(`   - Observations: ${observations.length}`);

  } catch (error) {
    console.error('❌ Error during database seeding:', error);
    throw error;
  }
};

module.exports = seedData;
