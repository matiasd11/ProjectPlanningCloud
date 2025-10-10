# Project Planning Cloud API

Una API RESTful dockerizada construida con Express.js y PostgreSQL para gestión de proyectos y tareas, diseñada para deployment en la nube (Render).

## 🚀 Características

- **Backend**: Node.js con Express.js
- **Base de datos**: PostgreSQL con Sequelize ORM
- **Containerización**: Docker y Docker Compose
- **Deployment**: Optimizado para Render
- **Seguridad**: Helmet, CORS, Rate Limiting
- **Modelos**: Task y TaskType con relaciones

## 📋 Prerequisitos

- Node.js 18+ 
- Docker y Docker Compose
- PostgreSQL (para desarrollo local sin Docker)

## 🛠️ Instalación Local

### Opción 1: Con Docker Compose (Recomendado)

1. **Clonar y configurar el proyecto:**
   ```bash
   git clone <tu-repositorio>
   cd ProjectPlanningCloud
   cp .env.example .env
   ```

2. **Ejecutar con Docker Compose:**
   ```bash
   docker-compose up --build
   ```

3. **La API estará disponible en:**
   - API: http://localhost:3000
   - Health Check: http://localhost:3000/api/health
   - Base de datos: localhost:5432

### Opción 2: Instalación Manual

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar base de datos PostgreSQL local**

3. **Configurar variables de entorno:**
   ```bash
   cp .env.example .env
   # Editar .env con tu configuración
   ```

4. **Ejecutar en modo desarrollo:**
   ```bash
   npm run dev
   ```

## 🌐 Deployment en Render

### Paso 1: Preparar la base de datos

1. **Crear una base de datos PostgreSQL en Render:**
   - Ve a Render Dashboard
   - Crea una nueva PostgreSQL database
   - Guarda la `DATABASE_URL` que te proporcionen

### Paso 2: Configurar el Web Service

1. **Crear un nuevo Web Service en Render:**
   - Conecta tu repositorio GitHub
   - Configuración:
     ```
     Build Command: npm install
     Start Command: npm start
     ```

2. **Variables de entorno en Render:**
   ```
   NODE_ENV=production
   DATABASE_URL=[URL de tu base de datos PostgreSQL]
   ALLOWED_ORIGINS=https://tu-frontend-domain.com
   ```

### Paso 3: Deploy

1. **Hacer push a tu repositorio**
2. **Render automáticamente detectará los cambios y hará el deploy**

## 📡 Endpoints de la API

### Health Check
```
GET /api/health
```

### Task Types
```
GET    /api/task-types     # Obtener todos los tipos de tarea
GET    /api/task-types/:id # Obtener tipo de tarea por ID
POST   /api/task-types     # Crear nuevo tipo de tarea
PUT    /api/task-types/:id # Actualizar tipo de tarea
DELETE /api/task-types/:id # Eliminar tipo de tarea
```

### Tasks
```
GET    /api/tasks          # Obtener todas las tareas (con paginación)
GET    /api/tasks/:id      # Obtener tarea por ID
POST   /api/tasks          # Crear nueva tarea
PUT    /api/tasks/:id      # Actualizar tarea
DELETE /api/tasks/:id      # Eliminar tarea
```

### Parámetros de consulta para Tasks:
- `page`: Número de página (default: 1)
- `limit`: Elementos por página (default: 10)
- `status`: Filtrar por estado (todo, in_progress, review, done, cancelled)
- `projectId`: Filtrar por ID del proyecto

## 📊 Estructura de Datos

### TaskType
```json
{
  "id": 1,
  "title": "Desarrollo",
  "createdAt": "2023-10-10T10:00:00.000Z",
  "updatedAt": "2023-10-10T10:00:00.000Z"
}
```

### Task
```json
{
  "id": 1,
  "title": "Implementar API de usuarios",
  "description": "Crear endpoints CRUD para gestión de usuarios",
  "status": "todo",
  "dueDate": "2023-12-01T00:00:00.000Z",
  "estimatedHours": 8.5,
  "actualHours": null,
  "projectId": 1,
  "takenBy": null,
  "createdBy": 1,
  "taskTypeId": 1,
  "isCoverageRequest": false,
  "createdAt": "2023-10-10T10:00:00.000Z",
  "updatedAt": "2023-10-10T10:00:00.000Z",
  "taskType": {
    "id": 1,
    "title": "Desarrollo"
  }
}
```

## 🔒 Seguridad

- **Helmet**: Headers de seguridad HTTP
- **CORS**: Control de acceso entre orígenes
- **Rate Limiting**: Protección contra ataques de fuerza bruta
- **Variables de entorno**: Configuración sensible protegida

## 🧪 Testing

```bash
# Ejecutar tests (cuando estén implementados)
npm test

# Linting
npm run lint
npm run lint:fix
```

## 📁 Estructura del Proyecto

```
ProjectPlanningCloud/
├── src/
│   ├── config/
│   │   └── database.js          # Configuración de base de datos
│   ├── controllers/
│   │   ├── taskController.js    # Lógica de negocio para tareas
│   │   └── taskTypeController.js # Lógica de negocio para tipos
│   ├── middleware/
│   │   ├── errorHandler.js      # Manejo de errores
│   │   └── rateLimiter.js       # Rate limiting
│   ├── models/
│   │   ├── index.js             # Configuración de modelos
│   │   ├── Task.js              # Modelo de tarea
│   │   └── TaskType.js          # Modelo de tipo de tarea
│   ├── routes/
│   │   ├── index.js             # Rutas principales
│   │   ├── tasks.js             # Rutas de tareas
│   │   └── taskTypes.js         # Rutas de tipos de tarea
│   └── app.js                   # Aplicación principal
├── .env.example                 # Variables de entorno ejemplo
├── .dockerignore               # Archivos ignorados por Docker
├── docker-compose.yml          # Configuración Docker Compose
├── Dockerfile                  # Configuración Docker
├── init.sql                    # Script inicial de base de datos
├── package.json                # Dependencias y scripts
└── README.md                   # Esta documentación
```

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit los cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📝 Notas de Desarrollo

- El proyecto usa Sequelize ORM para la gestión de base de datos
- Los modelos incluyen validaciones y métodos de instancia personalizados
- Rate limiting configurado para proteger la API
- Manejo robusto de errores con respuestas consistentes
- Preparado para producción con variables de entorno

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo LICENSE para detalles.

## 🆘 Soporte

Si tienes problemas o preguntas:

1. Revisa la documentación
2. Verifica los logs con `docker-compose logs app`
3. Asegúrate de que todas las variables de entorno estén configuradas
4. Para problemas de conexión a BD, verifica que PostgreSQL esté ejecutándose

---

**¡Tu API está lista para el deploy en la nube! 🚀**