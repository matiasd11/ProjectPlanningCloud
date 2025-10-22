-- Migración para agregar campo observations a la tabla tasks
-- Ejecutar este script en la base de datos para agregar el nuevo campo

-- Agregar la columna observations a la tabla tasks
ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS observations TEXT;

-- Agregar comentario a la columna
COMMENT ON COLUMN tasks.observations IS 'Observaciones sobre el progreso de la tarea';

-- Crear índice para búsquedas por observaciones (opcional)
CREATE INDEX IF NOT EXISTS idx_tasks_observations ON tasks USING gin(to_tsvector('spanish', observations));

-- Verificar que la columna se agregó correctamente
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'tasks' AND column_name = 'observations';
