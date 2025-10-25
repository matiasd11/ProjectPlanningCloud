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

-- Crear tabla de observaciones de tareas
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

-- Agregar claves foráneas
ALTER TABLE tasks ADD CONSTRAINT fk_tasks_task_type_id FOREIGN KEY (task_type_id) REFERENCES task_types(id);
ALTER TABLE commitments ADD CONSTRAINT fk_commitments_task_id FOREIGN KEY (task_id) REFERENCES tasks(id);
ALTER TABLE task_observations ADD CONSTRAINT fk_task_observations_task_id FOREIGN KEY (task_id) REFERENCES tasks(id);

-- Índices para optimización
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_task_type_id ON tasks(task_type_id);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_taken_by ON tasks(taken_by);
CREATE INDEX idx_tasks_created_by ON tasks(created_by);
CREATE INDEX idx_tasks_created_at ON tasks(created_at);

CREATE INDEX idx_commitments_task_id ON commitments(task_id);
CREATE INDEX idx_commitments_ong_id ON commitments(ong_id);
CREATE INDEX idx_commitments_status ON commitments(status);
CREATE INDEX idx_commitments_created_at ON commitments(created_at);

CREATE INDEX idx_task_observations_task_id ON task_observations(task_id);
CREATE INDEX idx_task_observations_created_by ON task_observations(created_by);
CREATE INDEX idx_task_observations_resolved_by ON task_observations(resolved_by);
CREATE INDEX idx_task_observations_resolved_at ON task_observations(resolved_at);
CREATE INDEX idx_task_observations_created_at ON task_observations(created_at);

CREATE INDEX idx_task_types_title ON task_types(title);
CREATE INDEX idx_task_types_created_at ON task_types(created_at);
CREATE INDEX idx_task_types_updated_at ON task_types(updated_at);
