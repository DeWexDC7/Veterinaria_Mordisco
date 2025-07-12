CREATE TABLE usuario (
    id_usuario SERIAL PRIMARY KEY,
    nombre VARCHAR(100),
    correo VARCHAR(100) UNIQUE,
    contrasenia VARCHAR(255),
    rol VARCHAR(50),
    estado CHAR(1) DEFAULT 'A',
    creado_en TIMESTAMP,
    actualizado_en TIMESTAMP
);

CREATE TABLE cliente (
    id_cliente SERIAL PRIMARY KEY,
    nombre_completo VARCHAR(100),
    cedula VARCHAR(20) UNIQUE,
    correo VARCHAR(100),
    telefono VARCHAR(20),
    direccion TEXT,
    estado CHAR(1) DEFAULT 'A',
    creado_en TIMESTAMP,
    actualizado_en TIMESTAMP
);

CREATE TABLE paciente (
    id_paciente SERIAL PRIMARY KEY,
    nombre VARCHAR(100),
    especie VARCHAR(50),
    raza VARCHAR(50),
    edad INT,
    peso DECIMAL(5,2),
    genero VARCHAR(10),
    id_cliente INT REFERENCES cliente(id_cliente) ON DELETE CASCADE,
    historial_clinico TEXT,
    estado CHAR(1) DEFAULT 'A',
    creado_en TIMESTAMP,
    actualizado_en TIMESTAMP
);

CREATE TABLE cita (
    id_cita SERIAL PRIMARY KEY,
    id_paciente INT REFERENCES paciente(id_paciente) ON DELETE CASCADE,
    id_veterinario INT REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    fecha DATE,
    hora TIME,
    motivo TEXT,
    estado_cita VARCHAR(20),
    observaciones TEXT,
    estado CHAR(1) DEFAULT 'A',
    creado_en TIMESTAMP,
    actualizado_en TIMESTAMP
);
