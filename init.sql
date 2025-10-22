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
('Construcción de viviendas de emergencia'),
('Instalación de paneles solares o eólicos'),
('Donación de materiales de construcción (cemento, ladrillos, chapas)'),
('Voluntariado técnico (ingenieros, arquitectos, electricistas)')
('Financiamiento económico')
('Refacción de escuelas u hospitales'),
('Reforestación o plantación de árboles')
('Gestión de residuos y reciclaje')
('Equipamiento informático o tecnológico'),
ON CONFLICT DO NOTHING;

-- Nota: Las tablas de tasks se crearán automáticamente por Sequelize
-- cuando se ejecute el sync() en el código de la aplicación