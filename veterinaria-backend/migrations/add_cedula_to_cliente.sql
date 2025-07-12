-- Migración para agregar el campo cedula a la tabla cliente
-- Ejecutar este script en la base de datos existente

ALTER TABLE cliente ADD COLUMN cedula VARCHAR(20) UNIQUE;

-- Opcional: Agregar un índice para mejorar el rendimiento en búsquedas
CREATE INDEX idx_cliente_cedula ON cliente(cedula);

-- Comentario: Este script agrega el campo cedula que faltaba en la tabla cliente
-- La cédula debe ser única para cada cliente
