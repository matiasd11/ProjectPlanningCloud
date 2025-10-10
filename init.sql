-- Script de inicialización para PostgreSQL
-- Este script se ejecuta automáticamente cuando se crea el contenedor de PostgreSQL

-- Crear algunas tablas básicas y datos de ejemplo
CREATE TABLE IF NOT EXISTS task_types (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insertar tipos de tarea por defecto
INSERT INTO task_types (title) VALUES 
('Desarrollo'),
('Diseño'),
('Testing'),
('Documentación'),
('Investigación'),
('Mantenimiento')
ON CONFLICT DO NOTHING;

-- Nota: Las tablas de tasks se crearán automáticamente por Sequelize
-- cuando se ejecute el sync() en el código de la aplicación