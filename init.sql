-- Script de inicialización para PostgreSQL
-- Este script se ejecuta automáticamente cuando se crea el contenedor de PostgreSQL

-- Limpiar esquema
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

-- Crear tabla de tipos de tarea
CREATE TABLE task_types (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de tareas
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done')),
    due_date TIMESTAMP WITH TIME ZONE,
    estimated_hours DECIMAL(5,2),
    actual_hours DECIMAL(5,2) DEFAULT 0,
    project_id INTEGER,
    taken_by INTEGER,
    created_by INTEGER,
    task_type_id INTEGER NOT NULL,
    is_coverage_request BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de compromisos
CREATE TABLE commitments (
    id SERIAL PRIMARY KEY,
    task_id INTEGER NOT NULL,
    ong_id INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'done')),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de observaciones
CREATE TABLE task_observations (
    id SERIAL PRIMARY KEY,
    task_id INTEGER NOT NULL,
    observations TEXT NOT NULL,
    resolution TEXT,
    created_by INTEGER,
    resolved_by INTEGER,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices para optimización de rendimiento
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_task_type_id ON tasks(task_type_id);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_taken_by ON tasks(taken_by);
CREATE INDEX IF NOT EXISTS idx_tasks_created_by ON tasks(created_by);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at);

CREATE INDEX IF NOT EXISTS idx_commitments_task_id ON commitments(task_id);
CREATE INDEX IF NOT EXISTS idx_commitments_ong_id ON commitments(ong_id);
CREATE INDEX IF NOT EXISTS idx_commitments_status ON commitments(status);
CREATE INDEX IF NOT EXISTS idx_commitments_created_at ON commitments(created_at);

CREATE INDEX IF NOT EXISTS idx_task_observations_task_id ON task_observations(task_id);
CREATE INDEX IF NOT EXISTS idx_task_observations_created_by ON task_observations(created_by);
CREATE INDEX IF NOT EXISTS idx_task_observations_resolved_by ON task_observations(resolved_by);
CREATE INDEX IF NOT EXISTS idx_task_observations_resolved_at ON task_observations(resolved_at);
CREATE INDEX IF NOT EXISTS idx_task_observations_created_at ON task_observations(created_at);

CREATE INDEX IF NOT EXISTS idx_task_types_title ON task_types(title);
CREATE INDEX IF NOT EXISTS idx_task_types_created_at ON task_types(created_at);
CREATE INDEX IF NOT EXISTS idx_task_types_updated_at ON task_types(updated_at);

-- Agregar restricciones de clave foránea
ALTER TABLE tasks ADD CONSTRAINT fk_tasks_task_type_id FOREIGN KEY (task_type_id) REFERENCES task_types(id);
ALTER TABLE commitments ADD CONSTRAINT fk_commitments_task_id FOREIGN KEY (task_id) REFERENCES tasks(id);
ALTER TABLE task_observations ADD CONSTRAINT fk_task_observations_task_id FOREIGN KEY (task_id) REFERENCES tasks(id);

-- Insertar tipos de tarea por defecto
INSERT INTO task_types (title) VALUES 
('Construcción de viviendas de emergencia'),
('Instalación de paneles solares o eólicos'),
('Donación de materiales de construcción (cemento, ladrillos, chapas)'),
('Voluntariado técnico (ingenieros, arquitectos, electricistas)'),
('Financiamiento económico'),
('Refacción de escuelas u hospitales'),
('Reforestación o plantación de árboles'),
('Gestión de residuos y reciclaje'),
('Equipamiento informático o tecnológico')
ON CONFLICT DO NOTHING;

-- Insertar datos de ejemplo para tareas
INSERT INTO tasks (title, description, status, due_date, estimated_hours, project_id, taken_by, created_by, task_type_id, is_coverage_request) VALUES 
('Nivelación del terreno', 'Preparar el suelo para la construcción del centro comunitario, asegurando el drenaje y la estabilidad.', 'in_progress', '2024-12-31T23:59:59Z', 8.5, 1, 3, 1, 1, true),
('Instalación de sistema eléctrico', 'Instalar cableado eléctrico básico para el centro comunitario.', 'todo', '2024-11-30T23:59:59Z', 12.0, 1, 2, 1, 2, false),
('Construcción de muros', 'Levantar muros de ladrillo para las habitaciones principales.', 'todo', '2024-10-15T23:59:59Z', 24.0, 1, NULL, 1, 1, true),
('Pintura exterior', 'Aplicar pintura ecológica en muros exteriores para mejorar la imagen y proteger las superficies.', 'todo', '2024-09-30T23:59:59Z', 8.5, 1, 1, 1, 1, false),
('Instalación de paneles solares', 'Colocar paneles solares para energía renovable del centro.', 'todo', '2024-08-20T23:59:59Z', 16.0, 1, NULL, 1, 2, true)
ON CONFLICT DO NOTHING;

-- Insertar datos de ejemplo para compromisos
INSERT INTO commitments (task_id, ong_id, status, description) VALUES 
(1, 3, 'approved', 'Nos comprometemos a financiar esta etapa con un aporte mensual durante tres meses.'),
(2, 2, 'pending', 'Ofrecemos voluntarios técnicos especializados en instalaciones eléctricas.'),
(3, 1, 'pending', 'Donaremos los materiales de construcción necesarios: cemento, ladrillos y arena.'),
(4, 1, 'approved', 'Nos hacemos cargo de la pintura exterior con materiales ecológicos.'),
(5, 2, 'pending', 'Proporcionaremos los paneles solares y la instalación técnica.')
ON CONFLICT DO NOTHING;

-- Insertar datos de ejemplo para observaciones de tareas
INSERT INTO task_observations (task_id, observations, resolution, created_by, resolved_by, resolved_at) VALUES 
(1, 'El avance reportado es menor al esperado para esta etapa. Los materiales no han llegado según lo programado.', 'Se asignarán dos voluntarios adicionales para acelerar la ejecución y cumplir los tiempos.', 2, 1, '2024-01-18T15:30:00Z'),
(1, 'Se requiere verificación adicional de la calidad del suelo antes de continuar con la construcción.', 'Se ha contratado un ingeniero geotécnico para realizar un estudio completo del suelo. Los resultados estarán disponibles en 3 días hábiles.', 2, 1, '2024-01-18T11:45:00Z'),
(2, 'Los voluntarios reportan dificultades con el equipo eléctrico proporcionado. Se necesita capacitación adicional.', NULL, 3, NULL, NULL),
(3, 'Los materiales donados no cumplen con las especificaciones técnicas requeridas para la construcción.', NULL, 1, NULL, NULL),
(4, 'El clima lluvioso está retrasando la aplicación de la pintura exterior.', NULL, 2, NULL, NULL)
ON CONFLICT DO NOTHING;