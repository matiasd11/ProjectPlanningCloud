-- Migración para crear tabla task_observations
-- Ejecutar este script en la base de datos para crear la nueva tabla

CREATE TABLE IF NOT EXISTS task_observations (
    id SERIAL PRIMARY KEY,
    task_id INTEGER NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    observations TEXT NOT NULL CHECK (length(observations) > 0 AND length(observations) <= 2000),
    resolution TEXT CHECK (length(resolution) <= 2000),
    created_by INTEGER,
    resolved_by INTEGER,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_task_observations_task_id ON task_observations(task_id);
CREATE INDEX IF NOT EXISTS idx_task_observations_created_by ON task_observations(created_by);
CREATE INDEX IF NOT EXISTS idx_task_observations_resolved_by ON task_observations(resolved_by);
CREATE INDEX IF NOT EXISTS idx_task_observations_resolved_at ON task_observations(resolved_at);
CREATE INDEX IF NOT EXISTS idx_task_observations_created_at ON task_observations(created_at);

-- Comentarios
COMMENT ON TABLE task_observations IS 'Historial de observaciones y resoluciones de tareas';
COMMENT ON COLUMN task_observations.observations IS 'Observaciones sobre el progreso de la tarea';
COMMENT ON COLUMN task_observations.resolution IS 'Resolución o respuesta a las observaciones';
COMMENT ON COLUMN task_observations.created_by IS 'Usuario que creó la observación';
COMMENT ON COLUMN task_observations.resolved_by IS 'Usuario que resolvió la observación';
COMMENT ON COLUMN task_observations.resolved_at IS 'Fecha de resolución';

-- Verificar que la tabla se creó correctamente
SELECT 
    table_name, 
    column_name, 
    data_type, 
    is_nullable, 
    column_default 
FROM information_schema.columns 
WHERE table_name = 'task_observations' 
ORDER BY ordinal_position;
