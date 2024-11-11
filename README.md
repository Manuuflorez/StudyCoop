# GruposEstudio
Tabla de usuarios

CREATE TABLE public.users (
	id bigserial NOT NULL,
	"name" varchar(200) NOT NULL,
	lastname varchar(200) NOT NULL,
	document_type varchar(2) NOT NULL,
	id_number varchar(20) NOT NULL,
	email varchar(200) NOT NULL,
	"program" varchar(200) NOT NULL,
	"password" varchar(200) NOT NULL,
	user_data jsonb NULL,
	active bool DEFAULT true NOT NULL,
	CONSTRAINT users_pkey PRIMARY KEY (id)
);





Tabla de solicitudes

CREATE TABLE public.solicitudes (
	solicitud_id serial4 NOT NULL,
	tipo_servicio varchar(50) NOT NULL,
	materia varchar(255) NOT NULL,
	tema_interes text NULL,
	fecha_reunion date NOT NULL,
	fecha_solicitud timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	user_data jsonb NULL,
	hora varchar(10) NOT NULL,
	CONSTRAINT solicitudes_pkey PRIMARY KEY (solicitud_id)
);






Tabla de agendas

CREATE TABLE public.agendas (
	agenda_id serial4 NOT NULL,
	user_data jsonb NULL,
	tema text NOT NULL,
	fecha timestamp NOT NULL,
	tutor varchar(255) NOT NULL,
	pago varchar(255) NOT NULL,
	hora varchar(10) NOT NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	solicitud_id int4 NOT NULL,
	CONSTRAINT agendas_pkey PRIMARY KEY (agenda_id)
);






Tablas para token, cambio de contraseña

CREATE TABLE public.password_resets (
	id serial4 NOT NULL,
	email varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT password_resets_pkey PRIMARY KEY (id)
);