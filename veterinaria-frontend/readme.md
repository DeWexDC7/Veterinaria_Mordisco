# 🐾 Veterinaria Mordisco - Documentación del Proyecto

![Banner Veterinaria Mordisco](https://via.placeholder.com/800x200/5cad8a/FFFFFF?text=Veterinaria+Mordisco)

## 📋 Índice
1. [¿Qué es Veterinaria Mordisco?](#qué-es-veterinaria-mordisco)
2. [Manual Rápido de Uso](#manual-rápido-de-uso)
3. [Arquitectura Técnica](#arquitectura-técnica)
4. [Construcción del Backend](#construcción-del-backend)
5. [Construcción del Frontend](#construcción-del-frontend)
6. [Sistema de Autenticación y Roles](#sistema-de-autenticación-y-roles)
7. [Sistema de Diseño](#sistema-de-diseño)
8. [Componentes Reutilizables](#componentes-reutilizables)
9. [API de Integración](#api-de-integración)
10. [Proceso de Desarrollo](#proceso-de-desarrollo)
11. [Mejoras y Actualizaciones Implementadas](#mejoras-y-actualizaciones-implementadas)
12. [Guía Completa de Módulos del Sistema](#guía-completa-de-módulos-del-sistema)

## � ¿Qué es Veterinaria Mordisco?

Veterinaria Mordisco es una **aplicación web completa** para la gestión diaria de clínicas veterinarias, que permite:

🟢 **Gestionar clientes** con todos sus datos y contactos  
🟢 **Administrar pacientes** (mascotas) con historial y características  
🟢 **Agendar citas** con calendario y notificaciones  
🟢 **Controlar usuarios** del sistema con diferentes roles  

El sistema cuenta con:
- Interfaz moderna e intuitiva
- Modo claro y oscuro adaptable
- Diseño responsivo para dispositivos móviles
- Arquitectura escalable y mantenible

## 📱 Manual Rápido de Uso

### Iniciar sesión y navegación

**Paso 1:** Accede con tus credenciales en la pantalla de login  
![Login](https://via.placeholder.com/400x200/5cad8a/FFFFFF?text=Pantalla+Login)

**Paso 2:** Navega por el menú lateral para acceder a las diferentes secciones  
![Dashboard](https://via.placeholder.com/400x200/5cad8a/FFFFFF?text=Dashboard)

### Gestión de pacientes y clientes

**Añadir un nuevo paciente:**

```javascript
// Ejemplo simplificado del componente para crear un paciente
function CrearPaciente() {
  // 1. Definimos el estado para guardar los datos
  const [paciente, setPaciente] = useState({
    nombre: '',
    especie: '',
    raza: '',
    edad: '',
    clienteId: ''
  });
  
  // 2. Función para enviar datos
  const guardarPaciente = async () => {
    await pacienteService.crear(paciente);
    // Mostrar notificación de éxito
  };
  
  // 3. Formulario con campos necesarios
  return (
    <form onSubmit={guardarPaciente}>
      <input 
        value={paciente.nombre} 
        onChange={(e) => setPaciente({...paciente, nombre: e.target.value})}
      />
      {/* Más campos del formulario */}
      <button type="submit">Guardar Paciente</button>
    </form>
  );
}
```

### Flujo de trabajo recomendado:

1. **Registra al cliente** primero con todos sus datos de contacto
2. **Añade sus mascotas** (pacientes) vinculándolas al cliente
3. **Agenda citas** seleccionando la mascota y el motivo de la consulta
4. **Consulta el historial** para seguimiento de casos

## 🏗️ Estructura del Proyecto

El proyecto está organizado en dos carpetas principales:

### 🔹 veterinaria-backend
Contiene toda la lógica del servidor, implementada con Node.js y Express, siguiendo un patrón MVC.

### 🔹 veterinaria-frontend
Aplicación cliente desarrollada con React, organizada por componentes y siguiendo una arquitectura de servicios para la comunicación con el backend.

## ⚙️ Backend

### Estructura y módulos

```
veterinaria-backend/
├── app.js                   # Punto de entrada de la aplicación
├── package.json             # Dependencias del proyecto
├── veterinaria.sql          # Script de base de datos
├── config/                  # Configuraciones
│   ├── database.js          # Configuración de conexión a la BD
│   └── jwt/                 # Configuración de autenticación
│       └── jwt.config.js
├── controllers/             # Controladores
│   ├── auth.controller.js   # Manejo de autenticación
│   ├── cita.controller.js   # Controlador de citas
│   ├── cliente.controller.js # Controlador de clientes
│   ├── paciente.controller.js # Controlador de pacientes
│   └── usuario.controller.js # Controlador de usuarios
├── middleware/              # Middleware personalizado
│   └── auth.middleware.js   # Verificación de autenticación
├── models/                  # Modelos de datos
│   ├── cita.js
│   ├── cliente.js
│   ├── index.js             # Exportación de modelos
│   ├── paciente.js
│   └── usuario.js
├── routes/                  # Definición de rutas API
│   ├── auth.routes.js
│   ├── cita.routes.js
│   ├── cliente.routes.js
│   ├── paciente.routes.js
│   └── usuario.routes.js
└── services/                # Servicios de lógica de negocio
    ├── cita.service.js
    ├── cliente.service.js
    ├── paciente.service.js
    └── usuario.service.js
```

### Módulos y sus responsabilidades

#### 🔸 Models
Definen la estructura de datos y las operaciones de acceso a la base de datos.

- **usuario.js**: Gestión de usuarios y autenticación
- **cliente.js**: Administración de clientes
- **paciente.js**: Gestión de mascotas/pacientes
- **cita.js**: Gestión de citas y agenda

#### 🔸 Services
Contienen la lógica de negocio, actúan como intermediarios entre los controladores y los modelos.

- **usuario.service.js**: Servicios para gestión de usuarios
- **cliente.service.js**: Servicios para gestión de clientes
- **paciente.service.js**: Servicios para gestión de pacientes
- **cita.service.js**: Servicios para gestión de citas

#### 🔸 Controllers
Manejan las solicitudes HTTP, llaman a los servicios y devuelven las respuestas.

- **auth.controller.js**: Login, registro y gestión de sesiones
- **usuario.controller.js**: CRUD de usuarios
- **cliente.controller.js**: CRUD de clientes
- **paciente.controller.js**: CRUD de pacientes
- **cita.controller.js**: CRUD de citas

#### 🔸 Routes
Definen los endpoints de la API y conectan con los controladores correspondientes.

- **auth.routes.js**: `/api/auth/login`, `/api/auth/register`, etc.
- **usuario.routes.js**: `/api/usuarios`, `/api/usuarios/:id`, etc.
- **cliente.routes.js**: `/api/clientes`, `/api/clientes/:id`, etc.
- **paciente.routes.js**: `/api/pacientes`, `/api/pacientes/:id`, etc.
- **cita.routes.js**: `/api/citas`, `/api/citas/:id`, etc.

## 🛠️ Construcción del Backend

### Estructura en capas

El backend está organizado en una **estructura de carpetas intuitiva y modular**:

```
BACKEND
   │
   ├── models           # Definición de datos y acceso a base de datos
   │
   ├── services         # Lógica de negocio central
   │ 
   ├── controllers      # Manejo de peticiones HTTP
   │
   └── routes           # Definición de endpoints de API
```

### ¿Cómo funciona cada solicitud?

Cada petición sigue un **flujo claro y ordenado**:

```
Cliente → Ruta → Controlador → Servicio → Modelo → Base de Datos
```

**Ejemplo práctico:** Obtener todos los pacientes

1. **Ruta definida** en `paciente.routes.js`:
   ```javascript
   // Define URL y método HTTP
   router.get('/pacientes', pacienteController.listar);
   ```

2. **Controlador** en `paciente.controller.js`:
   ```javascript
   // Recibe la petición HTTP y llama al servicio
   exports.listar = async (req, res) => {
     try {
       // Obtiene parámetros de consulta (filtros, paginación)
       const { especie, estado } = req.query;
       
       // Llama al servicio correspondiente
       const pacientes = await pacienteService.listarPacientes(especie, estado);
       
       // Devuelve respuesta formateada
       return res.status(200).json({ 
         exito: true, 
         datos: pacientes 
       });
     } catch (error) {
       return res.status(500).json({ 
         exito: false, 
         mensaje: error.message 
       });
     }
   };
   ```

3. **Servicio** en `paciente.service.js`:
   ```javascript
   // Contiene la lógica de negocio
   exports.listarPacientes = async (especie, estado) => {
     // Prepara criterios de búsqueda
     const criterios = {};
     if (especie) criterios.especie = especie;
     if (estado) criterios.estadoSalud = estado;
     
     // Llama al modelo para acceder a datos
     return await Paciente.buscarPorCriterios(criterios);
   };
   ```

4. **Modelo** en `paciente.js`:
   ```javascript
   // Interactúa con la base de datos
   exports.buscarPorCriterios = async (criterios) => {
     // Construye y ejecuta consulta SQL
     const sql = 'SELECT * FROM pacientes WHERE ?';
     return await db.query(sql, criterios);
   };
   ```

### Base de datos

La estructura de datos está optimizada para almacenar toda la información necesaria:

```sql
-- Ejemplo simplificado del esquema
CREATE TABLE clientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE,
  telefono VARCHAR(20),
  direccion TEXT,
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pacientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  especie VARCHAR(50),
  raza VARCHAR(100),
  fecha_nacimiento DATE,
  cliente_id INT,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);
```

## 🖥️ Frontend

### Estructura y módulos

```
veterinaria-frontend/
├── public/                  # Archivos estáticos
├── src/
│   ├── App.js               # Componente principal
│   ├── index.js             # Punto de entrada
│   ├── assets/              # Recursos estáticos
│   │   └── images/
│   ├── components/          # Componentes React
│   │   ├── Login.js
│   │   ├── ProtectedRoute.js
│   │   ├── ThemeSwitcher.js
│   │   ├── AdminPanel/      # Componentes de administración
│   │   ├── Dashboard/       # Componentes del panel principal
│   │   │   └── Sidebar/
│   │   └── NotFound/
│   ├── consumo-api/         # Configuración de llamadas API
│   │   ├── api.config.js
│   │   ├── auth.api.js
│   │   ├── cita.api.js
│   │   ├── cliente.api.js
│   │   ├── paciente.api.js
│   │   └── usuario.api.js
│   ├── estilo/              # Hojas de estilo CSS
│   │   ├── DashboardLayout.css
│   │   ├── Login.css
│   │   ├── Pacientes.css
│   │   ├── Sidebar.css
│   │   ├── ThemeSwitcher.css
│   │   └── Usuarios.css
│   ├── services/            # Servicios del frontend
│   │   ├── auth.service.js
│   │   ├── cita.service.js
│   │   ├── cliente.service.js
│   │   ├── http.service.js
│   │   ├── paciente.service.js
│   │   └── usuario.service.js
│   └── styles/              # Estilos adicionales
```

### Módulos y componentes principales

#### 🔸 Componentes

**Autenticación y Seguridad**
- **Login.js**: Formulario de inicio de sesión
- **ProtectedRoute.js**: Componente HOC para proteger rutas privadas

**Panel de Administración**
- **AdminPanel.js**: Panel principal de administración
- **GestionClientes.js**: CRUD de clientes
- **GestionPacientes.js**: CRUD de pacientes
- **GestionUsuarios.js**: CRUD de usuarios

**Dashboard**
- **Dashboard.js**: Panel principal de inicio
- **DashboardLayout.js**: Layout común para todas las vistas internas
- **Sidebar.js**: Barra lateral de navegación

**Otros**
- **ThemeSwitcher.js**: Alternador de tema claro/oscuro
- **NotFound.js**: Página 404

#### 🔸 API y Servicios

**Configuración API**
- **api.config.js**: Configuración base para Axios
- **auth.api.js**: Endpoints de autenticación
- **cliente.api.js**: Endpoints de clientes
- **paciente.api.js**: Endpoints de pacientes
- **cita.api.js**: Endpoints de citas
- **usuario.api.js**: Endpoints de usuarios

**Servicios**
- **http.service.js**: Servicio base para solicitudes HTTP
- **auth.service.js**: Gestión de autenticación (login/logout)
- **cliente.service.js**: Funcionalidad de clientes
- **paciente.service.js**: Funcionalidad de pacientes
- **cita.service.js**: Funcionalidad de citas
- **usuario.service.js**: Funcionalidad de usuarios

## 🎨 Sistema de Diseño

### Temas claro y oscuro

La aplicación implementa un **sistema de temas completo** utilizando variables CSS:

![Temas](https://via.placeholder.com/600x300/5cad8a/FFFFFF?text=Modo+Claro+y+Oscuro)

```css
/* Variables CSS que permiten alternar temas */
:root {
  /* Tema claro (predeterminado) */
  --primary-color: #5cad8a;     /* Verde principal */
  --card-bg: #ffffff;           /* Fondo de tarjetas */
  --text-primary: #333333;      /* Texto principal */
  --text-secondary: #6c757d;    /* Texto secundario */
  --input-bg: #f8f9fa;          /* Fondo de inputs */
  --border-color: #dee2e6;      /* Color de bordes */
}

/* Tema oscuro activado con atributo data-theme */
[data-theme='dark'] {
  --card-bg: #212529;           /* Fondo oscuro */
  --text-primary: #e9ecef;      /* Texto claro */
  --text-secondary: #adb5bd;    /* Texto secundario */
  --input-bg: #2b3035;          /* Inputs oscuros */
  --border-color: #495057;      /* Bordes más visibles */
}
```

### Componentes visuales principales

Cada elemento visual está cuidadosamente diseñado para mantener **consistencia y usabilidad**:

#### 1. Fichas de información

Las fichas de pacientes muestran información clara y estructurada:

```css
/* Estilos de la ficha de paciente */
.ficha-paciente {
  /* Aspecto visual */
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 16px;
  padding: 22px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  /* Estructura y layout */
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 18px;
  
  /* Efectos visuales */
  box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.15);
  position: relative;
  overflow: hidden;
}

.ficha-item {
  /* Tarjeta individual de información */
  background-color: rgba(255, 255, 255, 0.03);
  padding: 12px 15px;
  border-radius: 12px;
  transition: all 0.2s ease;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

/* Efectos interactivos */
.ficha-item:hover {
  transform: translateY(-2px);
  background-color: rgba(255, 255, 255, 0.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
```

![Ficha de Paciente](https://via.placeholder.com/400x200/5cad8a/FFFFFF?text=Ficha+de+Paciente)

#### 2. Modales interactivos

Ventanas de diálogo para operaciones CRUD con estilo consistente:

```css
/* Sistema de modales */
.modal-backdrop {
  /* Fondo semi-transparente */
  position: fixed !important;
  background-color: rgba(0, 0, 0, 0.7) !important;
  
  /* Centrado perfecto */
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  
  /* Cobertura total */
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  z-index: 9999 !important;
}

.modal-content {
  /* Aspecto visual adaptable al tema */
  background-color: var(--card-bg) !important;
  color: var(--text-primary);
  
  /* Dimensiones y límites */
  max-width: 650px !important;
  width: 100% !important;
  max-height: 90vh !important;
  
  /* Estilo y efectos */
  border-radius: 12px !important;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5) !important;
  padding: 25px !important;
  overflow-y: auto;
}
```

![Modal de Edición](https://via.placeholder.com/400x200/5cad8a/FFFFFF?text=Modal+de+Edición)

#### 3. Tablas de datos

Sistema de visualización de datos con ordenamiento y paginación:

```css
/* Contenedor de tabla con scroll horizontal */
.datatable-container {
  width: 100%;
  overflow-x: auto;
  border-radius: 14px;
  
  /* Efectos visuales */
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15), 
              inset 0 0 15px rgba(0, 0, 0, 0.1);
  
  /* Estilizado del scroll */
  scrollbar-width: thin;
  scrollbar-color: rgba(92, 173, 138, 0.5) rgba(0, 0, 0, 0.2);
}

/* Tabla responsiva */
.datatable {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  color: var(--text-primary);
  font-size: 0.9rem;
}

/* Encabezados interactivos */
.datatable th.sortable:hover {
  background-color: rgba(92, 173, 138, 0.25);
  color: var(--primary-color);
}
```

### Responsividad adaptable

El diseño se **adapta automáticamente** a diferentes tamaños de pantalla:

```css
/* Tablets */
@media (max-width: 992px) {
  .datatable-container {
    padding: 0;
  }
  
  .pacientes-header {
    flex-direction: column;
    align-items: flex-start;
  }
}

/* Móviles */
@media (max-width: 768px) {
  .modal-content {
    padding: 15px !important;
  }
  
  .ficha-paciente {
    grid-template-columns: 1fr; /* Una sola columna */
  }
  
  .datatable th,
  .datatable td {
    padding: 8px 10px; /* Celdas más compactas */
  }
}
```

### Configuración de ThemeSwitcher

El cambiador de temas funciona modificando un atributo de datos en el HTML:

```javascript
// Componente ThemeSwitcher simplificado
function ThemeSwitcher() {
  const [theme, setTheme] = useState('dark');
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };
  
  return (
    <button onClick={toggleTheme} className="theme-switcher">
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}
```

## 🔐 Sistema de Autenticación y Roles

El sistema implementa un **robusto sistema de autenticación basado en JWT** con control de roles granular que garantiza la seguridad y el acceso controlado a las diferentes funcionalidades.

### Arquitectura del Sistema de Autenticación

```
┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│   Frontend   │──►│  JWT Token   │──►│  Middleware  │──►│   Backend    │
│              │   │ Verificación │   │ Autorización │   │   Seguro     │
│              │   │              │   │              │   │              │
└──────────────┘   └──────────────┘   └──────────────┘   └──────────────┘
```

### Roles del Sistema

El sistema maneja **dos tipos de usuarios principales**:

- **🔸 Administrador** (`admin`) - Acceso completo al sistema
- **🔸 Usuario/Veterinario** (`usuario`) - Acceso limitado a funciones operativas

### Implementación del Sistema de Roles

#### 1. Middleware de Autenticación (Backend)

```javascript
// auth.middleware.js - Verificación de tokens JWT
const verifyToken = (req, res, next) => {
  // Obtener el token del encabezado
  const token = req.headers['x-access-token'] || req.headers['authorization'];
  
  if (!token) {
    return res.status(403).json({ 
      success: false, 
      message: "Se requiere un token para la autenticación" 
    });
  }

  try {
    // Eliminar el prefijo "Bearer " si existe
    const tokenValue = token.startsWith('Bearer ') ? token.slice(7, token.length) : token;
    
    // Verificar el token
    const decoded = jwt.verify(tokenValue, jwtConfig.jwtSecret);
    
    // Agregar el usuario decodificado al request
    req.usuario = decoded.usuario;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token no válido o expirado"
    });
  }
};

// Middleware para verificar roles específicos
const verifyRole = (roles) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(403).json({
        success: false,
        message: "Se requiere autenticación"
      });
    }

    // Verificar si el usuario tiene uno de los roles permitidos
    if (roles.includes(req.usuario.rol)) {
      next();
    } else {
      res.status(403).json({
        success: false,
        message: "No tiene permisos para realizar esta acción"
      });
    }
  };
};
```

#### 2. Autenticación en el Controlador (Backend)

```javascript
// auth.controller.js - Manejo de login y generación de tokens
const login = async (req, res) => {
  try {
    const { correo, contrasenia } = req.body;

    // Buscar usuario por correo y verificar que esté activo
    const usuario = await Usuario.findOne({ 
      where: { 
        correo,
        estado: 'A' 
      } 
    });

    if (!usuario) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar la contraseña hasheada
    const passwordValido = await bcrypt.compare(contrasenia, usuario.contrasenia);

    if (!passwordValido) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Crear el payload del token con información del usuario y rol
    const payload = {
      usuario: {
        id: usuario.id_usuario,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol  // ⭐ Rol incluido en el token
      }
    };

    // Generar el token JWT
    jwt.sign(
      payload,
      jwtConfig.jwtSecret,
      { expiresIn: jwtConfig.jwtExpiration },
      (err, token) => {
        if (err) throw err;
        
        // Responder con el token y la información del usuario
        res.json({
          success: true,
          message: 'Login exitoso',
          token,
          usuario: {
            id: usuario.id_usuario,
            nombre: usuario.nombre,
            correo: usuario.correo,
            rol: usuario.rol  // ⭐ Rol disponible para el frontend
          }
        });
      }
    );
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor'
    });
  }
};
```

#### 3. Servicios de Autenticación (Frontend)

```javascript
// auth.service.js - Gestión de autenticación en el frontend
class AuthService {
  /**
   * Verifica si hay un usuario autenticado
   * @returns {boolean} - True si hay un usuario autenticado
   */
  isAuthenticated() {
    return this.getToken() !== null;
  }

  /**
   * Verifica si el usuario tiene un rol específico
   * @param {string} requiredRole - Rol requerido para acceder
   * @returns {boolean} - True si el usuario tiene el rol requerido
   */
  hasRole(requiredRole) {
    const user = this.getCurrentUser();
    return user?.usuario?.rol === requiredRole;
  }

  /**
   * Obtiene el usuario actual desde el localStorage
   * @returns {Object|null} - Datos del usuario o null si no hay sesión
   */
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch (e) {
      this.logout(); // Si hay un error en el parsing, limpiar datos
      return null;
    }
  }

  /**
   * Obtiene el token JWT almacenado
   * @returns {string|null} - Token JWT o null si no hay sesión
   */
  getToken() {
    const user = this.getCurrentUser();
    return user?.token || null;
  }
}
```

#### 4. Componente ProtectedRoute (Frontend)

```javascript
// ProtectedRoute.js - Componente de protección de rutas
const ProtectedRoute = ({ children, requiredRole }) => {
  // Verificar si el usuario está autenticado
  const isAuthenticated = authService.isAuthenticated();
  
  // Si se especificó un rol requerido, verificar si el usuario tiene ese rol
  const hasRequiredRole = requiredRole 
    ? authService.hasRole(requiredRole)
    : true;

  console.log('¿Está autenticado?', isAuthenticated);
  console.log('¿Tiene rol requerido?', hasRequiredRole, 'Rol requerido:', requiredRole);

  // Si el usuario no está autenticado o no tiene el rol requerido, redirigir al login
  if (!isAuthenticated || !hasRequiredRole) {
    console.log('Redirigiendo al login');
    return <Navigate to="/login" replace />;
  }

  // Si el usuario está autenticado y tiene el rol requerido, mostrar el contenido
  console.log('Renderizando ruta protegida');
  return children;
};
```

#### 5. Configuración de Rutas con Roles

```javascript
// App.js - Configuración de rutas protegidas por rol
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Ruta pública */}
          <Route path="/login" element={<Login />} />
          
          {/* Rutas protegidas básicas - Solo requieren autenticación */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          
          {/* Rutas protegidas con rol específico - Solo administradores */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requiredRole="admin">
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminPanel />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}
```

#### 6. Control de Acceso en Componentes

```javascript
// GestionUsuarios.js - Control granular de acceso
function GestionUsuarios() {
  // Verificar si el usuario es administrador
  const isAdmin = authService.hasRole('administrador');

  return (
    <div className="page-content">
      {/* Verificar si el usuario tiene permisos */}
      {!isAdmin ? (
        <div className="usuarios-container fade-in">
          <div className="alert alert-danger">
            <div className="alert-icon">🚫</div>
            <div className="alert-content">
              <p className="alert-message">
                <strong>Acceso Denegado:</strong> No tiene permisos para acceder a la gestión de usuarios. 
                Esta función está disponible únicamente para administradores.
              </p>
            </div>
          </div>
        </div>
      ) : (
        // Contenido para administradores
        <div className="usuarios-container fade-in">
          <div className="usuarios-header">
            <h2>👥 Gestión de Usuarios</h2>
            <button 
              className="btn btn-primary"
              onClick={() => handleShowModal('create')}
            >
              ➕ Nuevo Usuario
            </button>
          </div>
          
          {/* Tabla completa de usuarios con funciones CRUD */}
          <DataTable 
            datos={usuarios}
            columnas={columnasUsuarios}
            acciones={accionesUsuarios}
          />
        </div>
      )}
    </div>
  );
}
```

#### 7. Interceptores HTTP con Autenticación

```javascript
// api.config.js - Configuración de Axios con interceptores
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir el token de autenticación automáticamente
apiClient.interceptors.request.use(
  (config) => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      } catch (e) {
        console.error('Error al parsear datos de usuario:', e);
      }
    }
    return config;
  }
);

// Interceptor para manejar errores de autenticación
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si el token expiró o es inválido, redirigir al login
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### Flujo de Autenticación Completo

```
1. Usuario ingresa credenciales
2. Backend verifica credenciales y genera JWT
3. JWT contiene información del usuario + rol
4. Frontend almacena JWT en localStorage
5. Cada petición incluye JWT en headers
6. Backend verifica JWT en cada petición
7. Middleware de roles controla acceso a recursos
8. Frontend verifica roles para mostrar/ocultar componentes
```

### Ventajas del Sistema Implementado

✅ **Seguridad robusta** con tokens JWT firmados  
✅ **Control granular** de acceso por roles  
✅ **Verificación tanto en frontend como backend**  
✅ **Interceptores automáticos** para todas las peticiones  
✅ **Manejo centralizado** de expiración de tokens  
✅ **Componentes reutilizables** para protección de rutas  

## 🧩 Componentes Reutilizables

La aplicación está construida usando un enfoque **Component-First** que maximiza la reusabilidad:

### Componentes React compartidos

![Componentes Reutilizables](https://via.placeholder.com/600x300/5cad8a/FFFFFF?text=Componentes+Reutilizables)

#### 2. DashboardLayout

Proporciona una **estructura común** para todas las pantallas internas:

```javascript
// DashboardLayout.js - Layout principal
function DashboardLayout({ children }) {
  return (
    <div className="dashboard-container">
      <Sidebar />
      
      <div className="content-area">
        <header className="top-header">
          <h1>Veterinaria Mordisco</h1>
          <ThemeSwitcher />
          <UserMenu />
        </header>
        
        <main className="main-content">
          {children}
        </main>
        
        <footer className="app-footer">
          © 2025 Veterinaria Mordisco
        </footer>
      </div>
    </div>
  );
}
```

#### 3. DataTable

Componente **reutilizable para datos tabulares** con ordenamiento y paginación:

```javascript
// DataTable.js - Tabla de datos reutilizable
function DataTable({ datos, columnas, acciones, paginacion = true }) {
  const [sortBy, setSortBy] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [pagina, setPagina] = useState(1);
  const itemsPorPagina = 10;
  
  // Ordena los datos según la columna seleccionada
  const ordenarDatos = () => {
    if (!sortBy) return datos;
    
    return [...datos].sort((a, b) => {
      if (a[sortBy] < b[sortBy]) return sortDir === 'asc' ? -1 : 1;
      if (a[sortBy] > b[sortBy]) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  };
  
  // Calcula los datos para la página actual
  const datosPaginados = paginacion
    ? ordenarDatos().slice(
        (pagina - 1) * itemsPorPagina,
        pagina * itemsPorPagina
      )
    : ordenarDatos();
  
  // Renderiza la tabla con los datos
  return (
    <div className="datatable-container">
      <table className="datatable">
        {/* Cabecera con columnas ordenables */}
        <thead>
          <tr>
            {columnas.map(col => (
              <th 
                key={col.campo} 
                className={sortBy === col.campo ? `sorted-${sortDir}` : ''}
                onClick={() => /* lógica de ordenamiento */}
              >
                {col.titulo}
              </th>
            ))}
          </tr>
        </thead>
        
        {/* Cuerpo de la tabla */}
        <tbody>
          {datosPaginados.map(fila => (
            <tr key={fila.id}>
              {columnas.map(col => (
                <td key={`${fila.id}-${col.campo}`}>
                  {col.render ? col.render(fila) : fila[col.campo]}
                </td>
              ))}
              {/* Columna de acciones */}
              <td className="datatable-actions">
                {acciones && acciones(fila)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Paginación */}
      {paginacion && (
        <div className="datatable-pagination">
          {/* Controles de paginación */}
        </div>
      )}
    </div>
  );
}
```

### Servicios compartidos entre módulos

#### 1. http.service.js

Servicio base para **comunicación con el backend**:

```javascript
// http.service.js - Servicio base para peticiones HTTP
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Instancia de Axios con configuración base
const httpClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para incluir el token JWT en peticiones
httpClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar respuestas y errores
httpClient.interceptors.response.use(
  response => response.data,
  error => {
    // Manejo centralizado de errores
    if (error.response && error.response.status === 401) {
      // Token expirado - redirigir a login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Métodos simplificados para operaciones CRUD
export default {
  get: (url, params) => httpClient.get(url, { params }),
  post: (url, data) => httpClient.post(url, data),
  put: (url, data) => httpClient.put(url, data),
  delete: (url) => httpClient.delete(url)
};
```

## 🔌 API de Integración

La comunicación entre frontend y backend se realiza a través de una **API REST** bien definida:

### Formato de respuestas

Todas las respuestas siguen una **estructura consistente**:

```json
{
  "exito": true,                // Estado de la operación (true/false)
  "datos": [...],               // Datos solicitados (si aplica)
  "mensaje": "Texto descriptivo" // Mensaje informativo (si aplica)
}
```

### Endpoints principales con ejemplos

#### Autenticación

**Login** - `POST /api/auth/login`

Petición:
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

Respuesta:
```json
{
  "exito": true,
  "datos": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "usuario": {
      "id": 1,
      "nombre": "Juan Pérez",
      "email": "usuario@ejemplo.com",
      "rol": "admin"
    }
  },
  "mensaje": "Inicio de sesión exitoso"
}
```

#### Gestión de pacientes

**Listar pacientes** - `GET /api/pacientes`

Parámetros de consulta opcionales:
- `?especie=Perro` - Filtrar por especie
- `?clienteId=5` - Filtrar por cliente
- `?page=1&limit=10` - Paginación

Respuesta:
```json
{
  "exito": true,
  "datos": [
    {
      "id": 1,
      "nombre": "Leopoldo",
      "especie": "Perro",
      "raza": "french",
      "edad": "6 años",
      "sexo": "Macho",
      "clienteId": 5,
      "cliente": {
        "nombre": "Ana Gómez",
        "telefono": "555-1234"
      }
    },
    // Más pacientes...
  ],
  "paginacion": {
    "total": 45,
    "pagina": 1,
    "limite": 10,
    "paginas": 5
  }
}
```

### Códigos de respuesta HTTP

La API utiliza **códigos de estado HTTP estándar**:

- **200 OK** - Petición exitosa
- **201 Created** - Recurso creado exitosamente
- **400 Bad Request** - Error en los parámetros de la petición
- **401 Unauthorized** - Autenticación requerida o token inválido
- **404 Not Found** - Recurso no encontrado
- **500 Internal Server Error** - Error del servidor

## 🔄 Proceso de Desarrollo

El desarrollo de Veterinaria Mordisco siguió una **metodología ágil** con iteraciones incrementales:

### Fases del proyecto

```
┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│              │   │              │   │              │   │              │   │              │
│ PLANIFICACIÓN│──►│  DESARROLLO  │──►│  DESARROLLO  │──►│ INTEGRACIÓN  │──►│  DESPLIEGUE  │
│              │   │   BACKEND    │   │   FRONTEND   │   │  Y PRUEBAS   │   │              │
│              │   │              │   │              │   │              │   │              │
└──────────────┘   └──────────────┘   └──────────────┘   └──────────────┘   └──────────────┘
```

### 1. Fase de Planificación

Se definieron los **requisitos funcionales** del sistema:

✅ Gestión completa de clientes  
✅ Gestión de pacientes (mascotas)  
✅ Sistema de citas y calendario  
✅ Panel de administración  
✅ Reportes básicos  

También se crearon:
- Diagramas de base de datos
- Wireframes de interfaz
- Historias de usuario prioritizadas

### 2. Desarrollo Backend

Se implementó primero la **API REST completa**:

1. Configuración del entorno Node.js y Express
2. Conexión a base de datos MySQL
3. Implementación de modelos de datos
4. Desarrollo de servicios con lógica de negocio
5. Creación de controladores REST
6. Implementación de autenticación JWT
7. Documentación de la API

### 3. Desarrollo Frontend

Se construyó la **interfaz de usuario React**:

1. Configuración del proyecto con Create React App
2. Diseño de la estructura de componentes
3. Implementación del sistema de rutas
4. Desarrollo del sistema de autenticación
5. Creación de los módulos principales:
   - Login y registro
   - Dashboard principal
   - CRUD de clientes
   - CRUD de pacientes
   - CRUD de citas
   - CRUD de usuarios
6. Implementación del sistema de temas claro/oscuro

### 4. Integración y Pruebas

Se realizó la **integración completa** y pruebas:

1. Pruebas de integración entre frontend y backend
2. Pruebas de usabilidad
3. Optimización de rendimiento
4. Corrección de errores
5. Ajustes de diseño responsivo

### 5. Despliegue

Preparación para **entorno de producción**:

1. Configuración de variables de entorno
2. Optimización de assets
3. Configuración de servidor
4. Implementación de monitoreo básico
5. Documentación final

## � Mejoras y Actualizaciones Implementadas

### Sistema de Roles y Permisos Avanzado

El sistema ha sido **significativamente mejorado** con la implementación de un robusto sistema de autenticación y autorización:

#### ⭐ Nuevas Características Implementadas

**🔸 Autenticación JWT Completa**
- Tokens firmados con expiración automática
- Verificación en cada petición del backend
- Manejo automático de tokens expirados

**🔸 Control de Roles Granular**
- Roles diferenciados: `admin` y `usuario`
- Verificación tanto en frontend como backend
- Protección de rutas por nivel de acceso

**🔸 Componentes de Seguridad**
- `ProtectedRoute` mejorado con soporte para roles específicos
- Verificación automática de permisos en componentes
- Manejo centralizado de acceso denegado

#### 📋 Ejemplo de Implementación de Roles

```javascript
// Ejemplo real del componente GestionUsuarios
function GestionUsuarios() {
  // ⭐ Verificación automática de permisos de administrador
  const isAdmin = authService.hasRole('administrador');

  return (
    <div className="page-content">
      {!isAdmin ? (
        // 🚫 Mensaje de acceso denegado para usuarios sin permisos
        <div className="alert alert-danger">
          <div className="alert-icon">🚫</div>
          <div className="alert-content">
            <p className="alert-message">
              <strong>Acceso Denegado:</strong> No tiene permisos para acceder a la gestión de usuarios. 
              Esta función está disponible únicamente para administradores.
            </p>
          </div>
        </div>
      ) : (
        // ✅ Contenido completo para administradores
        <div className="usuarios-container fade-in">
          <div className="usuarios-header">
            <h2>👥 Gestión de Usuarios</h2>
            <button 
              className="btn btn-primary"
              onClick={() => handleShowModal('create')}
            >
              ➕ Nuevo Usuario
            </button>
          </div>
          
          {/* Tabla completa de usuarios con funciones CRUD */}
          <DataTable 
            datos={usuarios}
            columnas={columnasUsuarios}
            acciones={accionesUsuarios}
          />
        </div>
      )}
    </div>
  );
}
```

#### 🛡️ Seguridad Multicapa

```javascript
// 1. Protección en rutas (App.js)
<Route path="/admin" element={
  <ProtectedRoute requiredRole="admin">
    <DashboardLayout />
  </ProtectedRoute>
}>

// 2. Verificación en componentes
const isAdmin = authService.hasRole('administrador');

// 3. Middleware en backend
router.post('/usuarios', verifyToken, verifyRole(['admin']), controller.create);

// 4. Interceptores automáticos
apiClient.interceptors.request.use((config) => {
  const token = authService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

#### 📊 Flujo de Verificación de Permisos

```
Usuario intenta acceder → ProtectedRoute verifica → authService.hasRole() 
    ↓                           ↓                       ↓
Token válido?              Rol requerido?           Comparar roles
    ↓                           ↓                       ↓
Backend valida JWT    →    Middleware verifica   →   Acceso permitido/denegado
```

#### 🎯 Beneficios de las Mejoras

✅ **Seguridad robusta** - Verificación en múltiples capas  
✅ **Experiencia de usuario mejorada** - Mensajes claros de acceso denegado  
✅ **Código mantenible** - Lógica centralizada de autenticación  
✅ **Escalabilidad** - Fácil agregar nuevos roles y permisos  
✅ **Depuración simplificada** - Logs detallados de autenticación  

### Arquitectura de Seguridad

```
┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
│    Frontend     │   │    Middleware   │   │    Backend      │
│                 │   │                 │   │                 │
│ ProtectedRoute  │──►│   verifyToken   │──►│  Controllers    │
│ authService     │   │   verifyRole    │   │  Secure Routes  │
│ hasRole()       │   │                 │   │                 │
└─────────────────┘   └─────────────────┘   └─────────────────┘
```

## �📝 Conclusión

Veterinaria Mordisco es un sistema **moderno, escalable y fácil de mantener** que proporciona todas las herramientas necesarias para la gestión eficiente de una clínica veterinaria.

### Principales ventajas

✅ **Arquitectura modular** que facilita el mantenimiento  
✅ **Diseño responsivo** adaptado a cualquier dispositivo  
✅ **Sistema de temas** para mayor comodidad visual  
✅ **Componentes reutilizables** para desarrollo ágil  
✅ **API REST** bien documentada para posibles integraciones  
✅ **Experiencia de usuario** intuitiva y agradable  
✅ **Sistema de roles robusto** con autenticación JWT  
✅ **Seguridad multicapa** frontend y backend  
✅ **Control de acceso granular** por funcionalidades

### Evolución futura

El sistema está preparado para evolucionar con nuevas características:

🔹 Módulo de inventario y productos  
🔹 Sistema de recordatorios y notificaciones  
🔹 Integración con pasarelas de pago  
🔹 Aplicación móvil complementaria  
🔹 Panel de estadísticas avanzadas  

---

## 🏛️ Guía Completa de Módulos del Sistema

Esta sección proporciona una **explicación detallada módulo por módulo** del funcionamiento del sistema, desde la perspectiva tanto del **usuario** como del **administrador**, incluyendo código crítico del frontend y backend.

### 🔐 Módulo de Autenticación (Login)

El proceso de autenticación es el **punto de entrada** al sistema para todos los usuarios.

#### Frontend - Componente Login

```javascript
// Login.js - Componente de autenticación
function Login() {
  const [correo, setCorreo] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [apiStatus, setApiStatus] = useState('checking');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // ⭐ Validación básica en frontend
    if (!correo.trim() || !contrasenia.trim()) {
      setError('Por favor, complete todos los campos');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      console.log('Intentando iniciar sesión con:', { correo });
      
      // 🔑 Llamada al servicio de autenticación
      const respuesta = await authService.login(correo, contrasenia);
      
      console.log('Login exitoso:', respuesta);
      
      // 🚦 Verificación de rol para redirección
      if (respuesta.usuario.rol === 'admin') {
        // Redirigir al panel de administrador
        window.location.href = '/admin';
      } else {
        // Redirigir al dashboard de usuario
        window.location.href = '/dashboard';
      }
      
    } catch (error) {
      console.error('Error en login:', error);
      setError(error.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>🐾 Veterinaria Mordisco</h2>
        
        {/* ⚠️ Mostrar errores de autenticación */}
        {error && <div className="error-message">{error}</div>}
        
        <input
          type="email"
          placeholder="Correo electrónico"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
        />
        
        <input
          type="password"
          placeholder="Contraseña"
          value={contrasenia}
          onChange={(e) => setContrasenia(e.target.value)}
          required
        />
        
        <button type="submit" disabled={loading}>
          {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
      </form>
    </div>
  );
}
```

#### Backend - Controlador de Autenticación

```javascript
// auth.controller.js - Lógica de autenticación en el servidor
const login = async (req, res) => {
  try {
    const { correo, contrasenia } = req.body;

    // 🔍 Validación de campos requeridos
    if (!correo || !contrasenia) {
      return res.status(400).json({
        success: false,
        message: 'El correo y contraseña son requeridos'
      });
    }

    // 🔍 Buscar usuario en la base de datos
    const usuario = await Usuario.findOne({ 
      where: { 
        correo,
        estado: 'A'  // Solo usuarios activos
      } 
    });

    if (!usuario) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // 🔒 Verificar contraseña hasheada
    const passwordValido = await bcrypt.compare(contrasenia, usuario.contrasenia);

    if (!passwordValido) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // 🎟️ Crear payload del token JWT
    const payload = {
      usuario: {
        id: usuario.id_usuario,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol  // ⭐ ROL CRÍTICO PARA AUTORIZACIÓN
      }
    };

    // 🔐 Generar token JWT firmado
    jwt.sign(
      payload,
      jwtConfig.jwtSecret,
      { expiresIn: jwtConfig.jwtExpiration },
      (err, token) => {
        if (err) throw err;
        
        // ✅ Respuesta exitosa con token y datos del usuario
        res.json({
          success: true,
          message: 'Login exitoso',
          token,
          usuario: {
            id: usuario.id_usuario,
            nombre: usuario.nombre,
            correo: usuario.correo,
            rol: usuario.rol  // ⭐ ROL DISPONIBLE PARA EL FRONTEND
          }
        });
      }
    );
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor'
    });
  }
};
```

#### Puntos Clave del Login:
- **🔑 Autenticación dual**: Verificación en frontend y backend
- **🔒 Seguridad**: Contraseñas hasheadas con bcrypt
- **🎟️ JWT**: Tokens firmados con información del usuario y rol
- **🚦 Redirección inteligente**: Según el rol del usuario
- **⚠️ Manejo de errores**: Mensajes claros para el usuario

---

### 👑 Vista Administrador

Los administradores tienen **acceso completo** a todas las funcionalidades del sistema.

#### 📊 Dashboard Administrativo

```javascript
// AdminPanel.js - Panel principal de administración
const AdminPanel = () => {
  return (
    <div className="admin-panel">
      <h1>👑 Panel de Administración</h1>
      <p>Esta sección es solo para administradores de la Veterinaria Mordisco</p>
      
      {/* 🎯 Tarjetas de acceso rápido */}
      <div className="admin-cards">
        <div className="admin-card">
          <h3>👥 Gestión de Usuarios</h3>
          <p>Administrar cuentas del sistema</p>
          <Link to="/admin/usuarios">Acceder</Link>
        </div>
        
        <div className="admin-card">
          <h3>👤 Gestión de Clientes</h3>
          <p>Administrar información de clientes</p>
          <Link to="/admin/clientes">Acceder</Link>
        </div>
        
        <div className="admin-card">
          <h3>🐾 Gestión de Pacientes</h3>
          <p>Administrar mascotas registradas</p>
          <Link to="/admin/pacientes">Acceder</Link>
        </div>
        
        <div className="admin-card">
          <h3>📅 Gestión de Citas</h3>
          <p>Administrar agenda de citas</p>
          <Link to="/admin/citas">Acceder</Link>
        </div>
      </div>
      
      <div className="admin-notification">
        <h3>🔐 Acceso administrativo</h3>
        <p>Has iniciado sesión como administrador y tienes acceso a funcionalidades privilegiadas.</p>
      </div>
    </div>
  );
};
```

#### 👥 Gestión de Usuarios (Solo Administradores)

**Frontend - Componente crítico:**

```javascript
// GestionUsuarios.js - CRUD completo de usuarios
function GestionUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    contrasenia: '',
    rol: 'usuario'  // ⭐ ROL POR DEFECTO
  });

  // 🔐 VERIFICACIÓN CRÍTICA DE PERMISOS
  const isAdmin = authService.hasRole('administrador');

  // 📥 Cargar usuarios desde la API
  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const data = await usuarioService.getAll();
      setUsuarios(data);
      setError(null);
    } catch (err) {
      console.error("Error al cargar usuarios:", err);
      setError("Error al cargar los usuarios. Por favor, intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  // ➕ Crear nuevo usuario
  const handleSaveUser = async () => {
    if (!validateForm()) return;
    
    try {
      if (modalMode === 'create') {
        // 🔐 Hash de contraseña en el backend
        await usuarioService.create(formData);
        showAlert('success', 'Usuario creado exitosamente');
      } else {
        await usuarioService.update(selectedUser.id_usuario, formData);
        showAlert('success', 'Usuario actualizado exitosamente');
      }
      
      fetchUsuarios(); // Recargar lista
      handleCloseModal();
    } catch (err) {
      console.error('Error al guardar usuario:', err);
      showAlert('error', 'Error al guardar el usuario');
    }
  };

  return (
    <div className="page-content">
      {/* 🚫 CONTROL DE ACCESO CRÍTICO */}
      {!isAdmin ? (
        <div className="alert alert-danger">
          <div className="alert-icon">🚫</div>
          <div className="alert-content">
            <p className="alert-message">
              <strong>Acceso Denegado:</strong> No tiene permisos para acceder a la gestión de usuarios. 
              Esta función está disponible únicamente para administradores.
            </p>
          </div>
        </div>
      ) : (
        <div className="usuarios-container fade-in">
          <div className="usuarios-header">
            <h2>👥 Gestión de Usuarios</h2>
            <button 
              className="btn btn-primary"
              onClick={() => handleShowModal('create')}
            >
              ➕ Nuevo Usuario
            </button>
          </div>
          
          {/* 🔍 Barra de búsqueda */}
          <div className="search-container">
            <input
              type="text"
              placeholder="Buscar usuarios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          {/* 📊 Tabla de usuarios con funciones CRUD */}
          <DataTableUsuarios 
            usuarios={paginatedData}
            onEdit={handleShowModal}
            onDelete={handleShowDeleteModal}
            sortConfig={sortConfig}
            onSort={requestSort}
          />
        </div>
      )}
    </div>
  );
}
```

**Backend - Controlador de usuarios:**

```javascript
// usuario.controller.js - Lógica del servidor para usuarios
const create = async (req, res) => {
  try {
    console.log('Datos recibidos en la petición:', req.body);
    
    // 🔍 Verificar campos requeridos
    if (!req.body.nombre || !req.body.correo || !req.body.contrasenia) {
      return res.status(400).json({ 
        success: false, 
        mensaje: 'Los campos nombre, correo y contraseña son obligatorios',
        datosRecibidos: req.body
      });
    }
    
    // ⭐ PUNTO CRÍTICO: Hash de contraseña antes de guardar
    const usuarioData = {
      ...req.body,
      contrasenia: await bcrypt.hash(req.body.contrasenia, 10),
      creado_en: new Date(),
      actualizado_en: new Date(),
      estado: 'A'
    };
    
    const nuevo = await service.create(usuarioData);
    console.log('Usuario creado:', nuevo);
    res.status(201).json(nuevo);
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ 
      success: false, 
      mensaje: 'Error al crear usuario', 
      error: error.message 
    });
  }
};

const getAll = async (req, res) => {
  try {
    // 🔐 SOLO USUARIOS AUTENTICADOS pueden ver la lista
    const data = await service.getAll();
    res.json(data);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      mensaje: 'Error al obtener usuarios' 
    });
  }
};
```

#### 👤 Gestión de Clientes

**Frontend - Funcionalidad completa:**

```javascript
// GestionClientes.js - CRUD de clientes para administradores
function GestionClientes() {
  const [clientes, setClientes] = useState([]);
  const [formData, setFormData] = useState({
    nombre_completo: '',
    cedula: '',
    correo: '',
    telefono: '',
    direccion: ''
  });

  // 📥 Cargar clientes desde la API
  const fetchClientes = async () => {
    try {
      setLoading(true);
      const data = await clienteService.getAll();
      setClientes(data);
      setError(null);
    } catch (err) {
      console.error("Error al cargar clientes:", err);
      setError("Error al cargar los clientes. Por favor, intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Validación de datos del cliente
  const validateForm = () => {
    const errors = {};
    
    if (!formData.nombre_completo.trim()) {
      errors.nombre_completo = 'El nombre es obligatorio';
    }
    
    if (!formData.cedula.trim()) {
      errors.cedula = 'La cédula es obligatoria';
    } else if (!/^\d+$/.test(formData.cedula)) {
      errors.cedula = 'La cédula debe contener solo números';
    }
    
    if (!formData.correo.trim()) {
      errors.correo = 'El correo es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
      errors.correo = 'Formato de correo inválido';
    }
    
    if (!formData.telefono.trim()) {
      errors.telefono = 'El teléfono es obligatorio';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // 💾 Guardar cliente (crear o actualizar)
  const handleSaveCliente = async () => {
    if (!validateForm()) return;
    
    try {
      if (modalMode === 'create') {
        await clienteService.create(formData);
        showAlert('success', 'Cliente creado exitosamente');
      } else {
        await clienteService.update(selectedCliente.id_cliente, formData);
        showAlert('success', 'Cliente actualizado exitosamente');
      }
      
      fetchClientes(); // ♻️ Recargar lista
      handleCloseModal();
    } catch (err) {
      console.error('Error al guardar cliente:', err);
      showAlert('error', 'Error al guardar el cliente');
    }
  };

  return (
    <div className="clientes-container">
      <div className="clientes-header">
        <h2>👤 Gestión de Clientes</h2>
        <button onClick={() => handleShowModal('create')}>
          ➕ Nuevo Cliente
        </button>
      </div>
      
      {/* 📊 Tabla de clientes */}
      <DataTable 
        datos={clientes}
        columnas={columnasClientes}
        acciones={(cliente) => (
          <>
            <button onClick={() => handleEditCliente(cliente)}>✏️ Editar</button>
            <button onClick={() => handleDeleteCliente(cliente)}>🗑️ Eliminar</button>
          </>
        )}
      />
    </div>
  );
}
```

**Backend - Servicio de clientes:**

```javascript
// cliente.service.js - Lógica de negocio para clientes
const { Cliente } = require('../models');

const getAll = async () => {
  try {
    // 📊 Obtener todos los clientes con información ordenada
    return await Cliente.findAll({
      order: [['creado_en', 'DESC']],
      attributes: { exclude: ['contrasenia'] } // 🔐 Excluir campos sensibles
    });
  } catch (error) {
    console.error('Error en getAll clientes:', error);
    throw error;
  }
};

const create = async (data) => {
  try {
    // ✅ Validaciones críticas del servidor
    if (!data.nombre_completo || !data.cedula || !data.correo) {
      throw new Error('Campos obligatorios faltantes');
    }
    
    // 🔍 Verificar que la cédula no esté duplicada
    const existeCliente = await Cliente.findOne({
      where: { cedula: data.cedula }
    });
    
    if (existeCliente) {
      throw new Error('Ya existe un cliente con esta cédula');
    }
    
    // ➕ Agregar fechas automáticas
    const clienteData = {
      ...data,
      creado_en: new Date(),
      actualizado_en: new Date(),
      estado: 'A'
    };
    
    return await Cliente.create(clienteData);
  } catch (error) {
    console.error('Error en create cliente:', error);
    throw error;
  }
};
```

#### 🐾 Gestión de Pacientes

**Frontend - Control de mascotas:**

```javascript
// GestionPacientes.js - CRUD de pacientes
function GestionPacientes() {
  const [pacientes, setPacientes] = useState([]);
  const [clientes, setClientes] = useState([]); // Para el dropdown
  const [formData, setFormData] = useState({
    nombre: '',
    especie: '',
    raza: '',
    edad: '',
    sexo: '',
    color: '',
    peso: '',
    fecha_nacimiento: '',
    observaciones: '',
    cliente_id: ''  // ⭐ RELACIÓN CRÍTICA CON CLIENTE
  });

  // 📥 Cargar pacientes y clientes
  useEffect(() => {
    const loadData = async () => {
      try {
        const [pacientesData, clientesData] = await Promise.all([
          pacienteService.getAll(),
          clienteService.getAll()
        ]);
        setPacientes(pacientesData);
        setClientes(clientesData);
      } catch (error) {
        console.error('Error cargando datos:', error);
      }
    };
    
    loadData();
  }, []);

  // 💾 Guardar paciente con validaciones
  const handleSavePaciente = async () => {
    if (!validatePacienteForm()) return;
    
    try {
      // 🔗 Datos con relación al cliente
      const pacienteData = {
        ...formData,
        cliente_id: parseInt(formData.cliente_id), // ⭐ CONVERSIÓN CRÍTICA
        peso: parseFloat(formData.peso) || null,
        edad: parseInt(formData.edad) || null
      };
      
      if (modalMode === 'create') {
        await pacienteService.create(pacienteData);
        showAlert('success', '🐾 Paciente registrado exitosamente');
      } else {
        await pacienteService.update(selectedPaciente.id_paciente, pacienteData);
        showAlert('success', '🐾 Paciente actualizado exitosamente');
      }
      
      fetchPacientes();
      handleCloseModal();
    } catch (err) {
      console.error('Error al guardar paciente:', err);
      showAlert('error', 'Error al guardar el paciente');
    }
  };

  return (
    <div className="pacientes-container">
      <div className="pacientes-header">
        <h2>🐾 Gestión de Pacientes</h2>
        <button onClick={() => handleShowModal('create')}>
          ➕ Nuevo Paciente
        </button>
      </div>
      
      {/* 🔍 Filtros por especie */}
      <div className="filtros-container">
        <select onChange={(e) => filtrarPorEspecie(e.target.value)}>
          <option value="">Todas las especies</option>
          <option value="Perro">🐶 Perros</option>
          <option value="Gato">🐱 Gatos</option>
          <option value="Ave">🐦 Aves</option>
          <option value="Otros">🐾 Otros</option>
        </select>
      </div>
      
      {/* 📊 Tabla de pacientes con información del cliente */}
      <DataTable 
        datos={pacientes}
        columnas={columnasPacientes}
        acciones={(paciente) => (
          <>
            <button onClick={() => verHistorial(paciente)}>📋 Historial</button>
            <button onClick={() => handleEditPaciente(paciente)}>✏️ Editar</button>
            <button onClick={() => handleDeletePaciente(paciente)}>🗑️ Eliminar</button>
          </>
        )}
      />
    </div>
  );
}
```

**Backend - Controlador con relaciones:**

```javascript
// paciente.controller.js - Manejo de pacientes con relaciones
const { Paciente, Cliente } = require('../models');

const getAll = async (req, res) => {
  try {
    // 🔗 RELACIÓN CRÍTICA: Incluir datos del cliente
    const pacientes = await Paciente.findAll({
      include: [{
        model: Cliente,
        as: 'cliente',
        attributes: ['id_cliente', 'nombre_completo', 'telefono', 'correo']
      }],
      order: [['creado_en', 'DESC']]
    });
    
    res.json(pacientes);
  } catch (error) {
    console.error('Error al obtener pacientes:', error);
    res.status(500).json({ 
      success: false, 
      mensaje: 'Error al obtener pacientes' 
    });
  }
};

const create = async (req, res) => {
  try {
    // ✅ Validaciones críticas
    if (!req.body.nombre || !req.body.especie || !req.body.cliente_id) {
      return res.status(400).json({
        success: false,
        mensaje: 'Nombre, especie y cliente son obligatorios'
      });
    }
    
    // 🔍 Verificar que el cliente existe
    const clienteExiste = await Cliente.findByPk(req.body.cliente_id);
    if (!clienteExiste) {
      return res.status(400).json({
        success: false,
        mensaje: 'El cliente especificado no existe'
      });
    }
    
    const nuevoPaciente = await Paciente.create({
      ...req.body,
      creado_en: new Date(),
      actualizado_en: new Date(),
      estado: 'A'
    });
    
    res.status(201).json(nuevoPaciente);
  } catch (error) {
    console.error('Error al crear paciente:', error);
    res.status(500).json({ 
      success: false, 
      mensaje: 'Error al crear paciente' 
    });
  }
};
```

#### 📅 Gestión de Citas

**Frontend - Sistema de agenda:**

```javascript
// GestionCitas.js - CRUD de citas con calendario
function GestionCitas() {
  const [citas, setCitas] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [formData, setFormData] = useState({
    fecha_cita: '',
    hora_cita: '',
    motivo: '',
    estado: 'Programada',
    observaciones: '',
    paciente_id: '',  // ⭐ RELACIÓN CRÍTICA CON PACIENTE
    veterinario: ''
  });

  // 📅 Validar fecha y hora de la cita
  const validateCitaForm = () => {
    const errors = {};
    
    // 📅 Validar que la fecha no sea en el pasado
    const fechaCita = new Date(formData.fecha_cita + 'T' + formData.hora_cita);
    const ahora = new Date();
    
    if (fechaCita <= ahora) {
      errors.fecha_cita = 'La fecha y hora debe ser en el futuro';
    }
    
    // 🕒 Validar horario de atención (8:00 AM - 6:00 PM)
    const hora = parseInt(formData.hora_cita.split(':')[0]);
    if (hora < 8 || hora >= 18) {
      errors.hora_cita = 'Horario de atención: 8:00 AM - 6:00 PM';
    }
    
    if (!formData.paciente_id) {
      errors.paciente_id = 'Debe seleccionar un paciente';
    }
    
    if (!formData.motivo.trim()) {
      errors.motivo = 'El motivo de la cita es obligatorio';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // 💾 Guardar cita con validaciones
  const handleSaveCita = async () => {
    if (!validateCitaForm()) return;
    
    try {
      const citaData = {
        ...formData,
        paciente_id: parseInt(formData.paciente_id),
        fecha_hora: new Date(formData.fecha_cita + 'T' + formData.hora_cita)
      };
      
      if (modalMode === 'create') {
        await citaService.create(citaData);
        showAlert('success', '📅 Cita programada exitosamente');
      } else {
        await citaService.update(selectedCita.id_cita, citaData);
        showAlert('success', '📅 Cita actualizada exitosamente');
      }
      
      fetchCitas();
      handleCloseModal();
    } catch (err) {
      console.error('Error al guardar cita:', err);
      showAlert('error', 'Error al programar la cita');
    }
  };

  return (
    <div className="citas-container">
      <div className="citas-header">
        <h2>📅 Gestión de Citas</h2>
        <button onClick={() => handleShowModal('create')}>
          ➕ Nueva Cita
        </button>
      </div>
      
      {/* 📊 Vista de calendario */}
      <div className="calendario-container">
        <CalendarioCitas citas={citas} onCitaClick={handleEditCita} />
      </div>
      
      {/* 📋 Lista de citas por estado */}
      <div className="filtros-estado">
        <button onClick={() => filtrarPorEstado('Programada')}>
          🟡 Programadas
        </button>
        <button onClick={() => filtrarPorEstado('Completada')}>
          🟢 Completadas
        </button>
        <button onClick={() => filtrarPorEstado('Cancelada')}>
          🔴 Canceladas
        </button>
      </div>
    </div>
  );
}
```

---

### 👤 Vista Usuario (Veterinario)

Los usuarios con rol **veterinario** tienen acceso limitado a funcionalidades operativas.

#### 📊 Dashboard de Usuario

```javascript
// Dashboard.js - Panel principal para veterinarios
const Dashboard = () => {
  const [clientesCount, setClientesCount] = useState(0);
  const [pacientesCount, setPacientesCount] = useState(0);
  const [especiesDistribution, setEspeciesDistribution] = useState({
    perros: 0,
    gatos: 0,
    otros: 0
  });
  const [latestPaciente, setLatestPaciente] = useState(null);

  // 📊 Cargar estadísticas del dashboard
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // 📈 Obtener conteos y estadísticas
        const [clientesData, pacientesData] = await Promise.all([
          clienteService.getAll(),
          pacienteService.getAll()
        ]);
        
        setClientesCount(clientesData.length);
        setPacientesCount(pacientesData.length);
        
        // 📊 Calcular distribución por especies
        const distribucion = pacientesData.reduce((acc, paciente) => {
          const especie = paciente.especie?.toLowerCase();
          if (especie === 'perro') acc.perros++;
          else if (especie === 'gato') acc.gatos++;
          else acc.otros++;
          return acc;
        }, { perros: 0, gatos: 0, otros: 0 });
        
        setEspeciesDistribution(distribucion);
        
        // 🆕 Último paciente registrado
        if (pacientesData.length > 0) {
          setLatestPaciente(pacientesData[0]);
        }
      } catch (error) {
        console.error('Error cargando datos del dashboard:', error);
      }
    };
    
    loadDashboardData();
  }, []);

  return (
    <div className="dashboard-container">
      <h1>🏥 Dashboard - Veterinaria Mordisco</h1>
      
      {/* 📊 Tarjetas de estadísticas */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>{clientesCount}</h3>
            <p>Clientes Registrados</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🐾</div>
          <div className="stat-info">
            <h3>{pacientesCount}</h3>
            <p>Pacientes Registrados</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🐶</div>
          <div className="stat-info">
            <h3>{especiesDistribution.perros}</h3>
            <p>Perros</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🐱</div>
          <div className="stat-info">
            <h3>{especiesDistribution.gatos}</h3>
            <p>Gatos</p>
          </div>
        </div>
      </div>
      
      {/* 🆕 Último paciente registrado */}
      {latestPaciente && (
        <div className="latest-patient">
          <h3>🆕 Último Paciente Registrado</h3>
          <div className="patient-card">
            <span className="patient-icon">
              {getSpeciesIcon(latestPaciente.especie)}
            </span>
            <div className="patient-info">
              <h4>{latestPaciente.nombre}</h4>
              <p>{latestPaciente.especie} - {latestPaciente.raza}</p>
              <p>Cliente: {latestPaciente.cliente?.nombre_completo}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* 🎯 Accesos rápidos para veterinarios */}
      <div className="quick-actions">
        <h3>🎯 Accesos Rápidos</h3>
        <div className="action-buttons">
          <Link to="/pacientes" className="action-btn">
            🐾 Ver Pacientes
          </Link>
          <Link to="/citas" className="action-btn">
            📅 Ver Citas del Día
          </Link>
          <Link to="/clientes" className="action-btn">
            👥 Buscar Clientes
          </Link>
        </div>
      </div>
    </div>
  );
};
```

#### Limitaciones del Usuario Veterinario:

**❌ No puede acceder a:**
- Gestión de usuarios del sistema
- Configuraciones administrativas
- Reportes financieros
- Eliminación de registros críticos

**✅ Puede acceder a:**
- Dashboard con estadísticas
- Consulta de clientes y pacientes
- Gestión de citas
- Historial médico de pacientes

### 🔑 Puntos Críticos del Sistema

#### 1. **Seguridad Multicapa**
```javascript
// Verificación en cada nivel
Frontend: authService.hasRole('admin') 
Backend: verifyToken + verifyRole(['admin'])
Database: Estado activo + validaciones
```

#### 2. **Relaciones de Base de Datos**
```sql
-- Relaciones críticas
Paciente -> Cliente (FOREIGN KEY)
Cita -> Paciente (FOREIGN KEY)
Usuario -> Roles (ENUM: 'admin', 'usuario')
```

#### 3. **Validaciones Críticas**
- **Frontend**: Validación inmediata de UX
- **Backend**: Validación de seguridad obligatoria
- **Database**: Constraints y triggers

#### 4. **Manejo de Estados**
```javascript
// Estados críticos del sistema
Estado Usuario: 'A' (Activo), 'I' (Inactivo)
Estado Cita: 'Programada', 'Completada', 'Cancelada'
Estado Paciente: 'A' (Activo), 'I' (Inactivo)
```

Esta arquitectura garantiza que cada **módulo funcione de manera independiente** pero **integrada**, con controles de seguridad robustos y una experiencia de usuario fluida tanto para administradores como para veterinarios.

