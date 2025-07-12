-- Crear tabla catalogo_cabecera
CREATE TABLE public.catalogo_cabecera (
	id_catalogo_cabecera serial4 NOT NULL,
	nombre_tabla varchar(255) NULL,
	creado_en timestamptz NULL,
	actualizado_en timestamptz NULL,
	estado bpchar(1) DEFAULT 'A'::bpchar NULL,
	CONSTRAINT catalogo_cabecera_pk PRIMARY KEY (id_catalogo_cabecera)
);

-- Crear tabla catalogo_detalle
CREATE TABLE public.catalogo_detalle (
	id_catalogo_detalle serial4 NOT NULL,
	id_catalogo_cabecera int4 NULL,
	estado bpchar(1) DEFAULT 'A'::bpchar NULL,
	creado_en timestamptz NULL,
	actualizado_en timestamptz NULL,
	nombre_catalogo_cabecera varchar(255) NULL,
	CONSTRAINT catalogo_detalle_pk PRIMARY KEY (id_catalogo_detalle),
	CONSTRAINT catalogo_detalle_id_catalogo_cabecera_fkey FOREIGN KEY (id_catalogo_cabecera) REFERENCES public.catalogo_cabecera(id_catalogo_cabecera) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Agregar columna de estado a la tabla cita
ALTER TABLE cita ADD COLUMN id_estado_cita int4;

-- Insertar datos iniciales
INSERT INTO catalogo_cabecera (nombre_tabla, creado_en) VALUES ('estados_citas', current_timestamp);
INSERT INTO catalogo_detalle (id_catalogo_cabecera, creado_en, nombre_catalogo_cabecera) VALUES (1, current_timestamp, 'AGENDADA');
INSERT INTO catalogo_detalle (id_catalogo_cabecera, creado_en, nombre_catalogo_cabecera) VALUES (1, current_timestamp, 'REAGENDADA');
INSERT INTO catalogo_detalle (id_catalogo_cabecera, creado_en, nombre_catalogo_cabecera) VALUES (1, current_timestamp, 'REALIZADA');
INSERT INTO catalogo_detalle (id_catalogo_cabecera, creado_en, nombre_catalogo_cabecera) VALUES (1, current_timestamp, 'CANCELADA');
