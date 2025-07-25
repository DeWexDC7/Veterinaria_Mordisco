PGDMP  	    /                }            veterinaria_db    17.4 (Debian 17.4-1.pgdg120+2) #   17.5 (Ubuntu 17.5-0ubuntu0.25.04.1) �               0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false                       0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false                       0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false                       1262    16816    veterinaria_db    DATABASE     y   CREATE DATABASE veterinaria_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';
    DROP DATABASE veterinaria_db;
                     admin    false                        2615    2200    public    SCHEMA        CREATE SCHEMA public;
    DROP SCHEMA public;
                     pg_database_owner    false                       0    0    SCHEMA public    COMMENT     6   COMMENT ON SCHEMA public IS 'standard public schema';
                        pg_database_owner    false    4            �            1259    21635    catalogo_cabecera    TABLE        CREATE TABLE public.catalogo_cabecera (
    id_catalogo_cabecera integer NOT NULL,
    nombre_tabla character varying(255),
    creado_en timestamp with time zone,
    actualizado_en timestamp with time zone,
    estado character(1) DEFAULT 'A'::bpchar
);
 %   DROP TABLE public.catalogo_cabecera;
       public         heap r       admin    false    4            �            1259    21634 *   catalogo_cabecera_id_catalogo_cabecera_seq    SEQUENCE     �   CREATE SEQUENCE public.catalogo_cabecera_id_catalogo_cabecera_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 A   DROP SEQUENCE public.catalogo_cabecera_id_catalogo_cabecera_seq;
       public               admin    false    4    226                       0    0 *   catalogo_cabecera_id_catalogo_cabecera_seq    SEQUENCE OWNED BY     y   ALTER SEQUENCE public.catalogo_cabecera_id_catalogo_cabecera_seq OWNED BY public.catalogo_cabecera.id_catalogo_cabecera;
          public               admin    false    225            �            1259    21643    catalogo_detalle    TABLE     ,  CREATE TABLE public.catalogo_detalle (
    id_catalogo_detalle integer NOT NULL,
    id_catalogo_cabecera integer,
    estado character(1) DEFAULT 'A'::bpchar,
    creado_en timestamp with time zone,
    actualizado_en timestamp with time zone,
    nombre_catalogo_cabecera character varying(255)
);
 $   DROP TABLE public.catalogo_detalle;
       public         heap r       admin    false    4            �            1259    21642 (   catalogo_detalle_id_catalogo_detalle_seq    SEQUENCE     �   CREATE SEQUENCE public.catalogo_detalle_id_catalogo_detalle_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ?   DROP SEQUENCE public.catalogo_detalle_id_catalogo_detalle_seq;
       public               admin    false    4    228                       0    0 (   catalogo_detalle_id_catalogo_detalle_seq    SEQUENCE OWNED BY     u   ALTER SEQUENCE public.catalogo_detalle_id_catalogo_detalle_seq OWNED BY public.catalogo_detalle.id_catalogo_detalle;
          public               admin    false    227            �            1259    16855    cita    TABLE     �  CREATE TABLE public.cita (
    id_cita integer NOT NULL,
    id_paciente integer,
    id_veterinario integer,
    fecha date,
    hora time without time zone,
    motivo text,
    estado_cita character varying(255),
    observaciones text,
    creado_en timestamp with time zone,
    actualizado_en timestamp with time zone,
    estado character(1) DEFAULT 'A'::bpchar,
    id_estado_cita integer
);
    DROP TABLE public.cita;
       public         heap r       admin    false    4            �            1259    16854    cita_id_cita_seq    SEQUENCE     �   CREATE SEQUENCE public.cita_id_cita_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.cita_id_cita_seq;
       public               admin    false    4    224                       0    0    cita_id_cita_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.cita_id_cita_seq OWNED BY public.cita.id_cita;
          public               admin    false    223            �            1259    16830    cliente    TABLE     n  CREATE TABLE public.cliente (
    id_cliente integer NOT NULL,
    nombre_completo character varying(255),
    correo character varying(255),
    telefono character varying(255),
    direccion text,
    creado_en timestamp with time zone,
    actualizado_en timestamp with time zone,
    estado character(1) DEFAULT 'A'::bpchar,
    cedula character varying(255)
);
    DROP TABLE public.cliente;
       public         heap r       admin    false    4            �            1259    16829    cliente_id_cliente_seq    SEQUENCE     �   CREATE SEQUENCE public.cliente_id_cliente_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.cliente_id_cliente_seq;
       public               admin    false    4    220                       0    0    cliente_id_cliente_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.cliente_id_cliente_seq OWNED BY public.cliente.id_cliente;
          public               admin    false    219            �            1259    16840    paciente    TABLE     �  CREATE TABLE public.paciente (
    id_paciente integer NOT NULL,
    nombre character varying(255),
    especie character varying(255),
    raza character varying(255),
    edad integer,
    peso numeric(5,2),
    genero character varying(255),
    id_cliente integer,
    historial_clinico text,
    creado_en timestamp with time zone,
    actualizado_en timestamp with time zone,
    estado character(1) DEFAULT 'A'::bpchar
);
    DROP TABLE public.paciente;
       public         heap r       admin    false    4            �            1259    16839    paciente_id_paciente_seq    SEQUENCE     �   CREATE SEQUENCE public.paciente_id_paciente_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE public.paciente_id_paciente_seq;
       public               admin    false    222    4                       0    0    paciente_id_paciente_seq    SEQUENCE OWNED BY     U   ALTER SEQUENCE public.paciente_id_paciente_seq OWNED BY public.paciente.id_paciente;
          public               admin    false    221            �            1259    16818    usuario    TABLE     Q  CREATE TABLE public.usuario (
    id_usuario integer NOT NULL,
    nombre character varying(255),
    correo character varying(255),
    contrasenia character varying(255),
    rol character varying(255),
    creado_en timestamp with time zone,
    actualizado_en timestamp with time zone,
    estado character(1) DEFAULT 'A'::bpchar
);
    DROP TABLE public.usuario;
       public         heap r       admin    false    4            �            1259    16817    usuario_id_usuario_seq    SEQUENCE     �   CREATE SEQUENCE public.usuario_id_usuario_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.usuario_id_usuario_seq;
       public               admin    false    4    218                       0    0    usuario_id_usuario_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.usuario_id_usuario_seq OWNED BY public.usuario.id_usuario;
          public               admin    false    217            �           2604    21638 &   catalogo_cabecera id_catalogo_cabecera    DEFAULT     �   ALTER TABLE ONLY public.catalogo_cabecera ALTER COLUMN id_catalogo_cabecera SET DEFAULT nextval('public.catalogo_cabecera_id_catalogo_cabecera_seq'::regclass);
 U   ALTER TABLE public.catalogo_cabecera ALTER COLUMN id_catalogo_cabecera DROP DEFAULT;
       public               admin    false    226    225    226            �           2604    21646 $   catalogo_detalle id_catalogo_detalle    DEFAULT     �   ALTER TABLE ONLY public.catalogo_detalle ALTER COLUMN id_catalogo_detalle SET DEFAULT nextval('public.catalogo_detalle_id_catalogo_detalle_seq'::regclass);
 S   ALTER TABLE public.catalogo_detalle ALTER COLUMN id_catalogo_detalle DROP DEFAULT;
       public               admin    false    228    227    228            �           2604    16858    cita id_cita    DEFAULT     l   ALTER TABLE ONLY public.cita ALTER COLUMN id_cita SET DEFAULT nextval('public.cita_id_cita_seq'::regclass);
 ;   ALTER TABLE public.cita ALTER COLUMN id_cita DROP DEFAULT;
       public               admin    false    224    223    224            �           2604    16833    cliente id_cliente    DEFAULT     x   ALTER TABLE ONLY public.cliente ALTER COLUMN id_cliente SET DEFAULT nextval('public.cliente_id_cliente_seq'::regclass);
 A   ALTER TABLE public.cliente ALTER COLUMN id_cliente DROP DEFAULT;
       public               admin    false    220    219    220            �           2604    16843    paciente id_paciente    DEFAULT     |   ALTER TABLE ONLY public.paciente ALTER COLUMN id_paciente SET DEFAULT nextval('public.paciente_id_paciente_seq'::regclass);
 C   ALTER TABLE public.paciente ALTER COLUMN id_paciente DROP DEFAULT;
       public               admin    false    221    222    222            �           2604    16821    usuario id_usuario    DEFAULT     x   ALTER TABLE ONLY public.usuario ALTER COLUMN id_usuario SET DEFAULT nextval('public.usuario_id_usuario_seq'::regclass);
 A   ALTER TABLE public.usuario ALTER COLUMN id_usuario DROP DEFAULT;
       public               admin    false    217    218    218            
          0    21635    catalogo_cabecera 
   TABLE DATA           r   COPY public.catalogo_cabecera (id_catalogo_cabecera, nombre_tabla, creado_en, actualizado_en, estado) FROM stdin;
    public               admin    false    226   ��                 0    21643    catalogo_detalle 
   TABLE DATA           �   COPY public.catalogo_detalle (id_catalogo_detalle, id_catalogo_cabecera, estado, creado_en, actualizado_en, nombre_catalogo_cabecera) FROM stdin;
    public               admin    false    228   �                 0    16855    cita 
   TABLE DATA           �   COPY public.cita (id_cita, id_paciente, id_veterinario, fecha, hora, motivo, estado_cita, observaciones, creado_en, actualizado_en, estado, id_estado_cita) FROM stdin;
    public               admin    false    224   Z�                 0    16830    cliente 
   TABLE DATA           �   COPY public.cliente (id_cliente, nombre_completo, correo, telefono, direccion, creado_en, actualizado_en, estado, cedula) FROM stdin;
    public               admin    false    220   r�                 0    16840    paciente 
   TABLE DATA           �   COPY public.paciente (id_paciente, nombre, especie, raza, edad, peso, genero, id_cliente, historial_clinico, creado_en, actualizado_en, estado) FROM stdin;
    public               admin    false    222   /�                 0    16818    usuario 
   TABLE DATA           r   COPY public.usuario (id_usuario, nombre, correo, contrasenia, rol, creado_en, actualizado_en, estado) FROM stdin;
    public               admin    false    218   ��                  0    0 *   catalogo_cabecera_id_catalogo_cabecera_seq    SEQUENCE SET     X   SELECT pg_catalog.setval('public.catalogo_cabecera_id_catalogo_cabecera_seq', 1, true);
          public               admin    false    225                       0    0 (   catalogo_detalle_id_catalogo_detalle_seq    SEQUENCE SET     V   SELECT pg_catalog.setval('public.catalogo_detalle_id_catalogo_detalle_seq', 4, true);
          public               admin    false    227                       0    0    cita_id_cita_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.cita_id_cita_seq', 10, true);
          public               admin    false    223                       0    0    cliente_id_cliente_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public.cliente_id_cliente_seq', 3, true);
          public               admin    false    219                       0    0    paciente_id_paciente_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.paciente_id_paciente_seq', 6, true);
          public               admin    false    221                       0    0    usuario_id_usuario_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public.usuario_id_usuario_seq', 18, true);
          public               admin    false    217            h           2606    21641 &   catalogo_cabecera catalogo_cabecera_pk 
   CONSTRAINT     v   ALTER TABLE ONLY public.catalogo_cabecera
    ADD CONSTRAINT catalogo_cabecera_pk PRIMARY KEY (id_catalogo_cabecera);
 P   ALTER TABLE ONLY public.catalogo_cabecera DROP CONSTRAINT catalogo_cabecera_pk;
       public                 admin    false    226            j           2606    21649 $   catalogo_detalle catalogo_detalle_pk 
   CONSTRAINT     s   ALTER TABLE ONLY public.catalogo_detalle
    ADD CONSTRAINT catalogo_detalle_pk PRIMARY KEY (id_catalogo_detalle);
 N   ALTER TABLE ONLY public.catalogo_detalle DROP CONSTRAINT catalogo_detalle_pk;
       public                 admin    false    228            f           2606    16863    cita cita_pkey 
   CONSTRAINT     Q   ALTER TABLE ONLY public.cita
    ADD CONSTRAINT cita_pkey PRIMARY KEY (id_cita);
 8   ALTER TABLE ONLY public.cita DROP CONSTRAINT cita_pkey;
       public                 admin    false    224            b           2606    16838    cliente cliente_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.cliente
    ADD CONSTRAINT cliente_pkey PRIMARY KEY (id_cliente);
 >   ALTER TABLE ONLY public.cliente DROP CONSTRAINT cliente_pkey;
       public                 admin    false    220            d           2606    16848    paciente paciente_pkey 
   CONSTRAINT     ]   ALTER TABLE ONLY public.paciente
    ADD CONSTRAINT paciente_pkey PRIMARY KEY (id_paciente);
 @   ALTER TABLE ONLY public.paciente DROP CONSTRAINT paciente_pkey;
       public                 admin    false    222            �           2606    27143    usuario usuario_correo_key 
   CONSTRAINT     W   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key UNIQUE (correo);
 D   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key;
       public                 admin    false    218            �           2606    27145    usuario usuario_correo_key1 
   CONSTRAINT     X   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key1 UNIQUE (correo);
 E   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key1;
       public                 admin    false    218            �           2606    27121    usuario usuario_correo_key10 
   CONSTRAINT     Y   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key10 UNIQUE (correo);
 F   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key10;
       public                 admin    false    218            �           2606    27141    usuario usuario_correo_key11 
   CONSTRAINT     Y   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key11 UNIQUE (correo);
 F   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key11;
       public                 admin    false    218            �           2606    27079    usuario usuario_correo_key12 
   CONSTRAINT     Y   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key12 UNIQUE (correo);
 F   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key12;
       public                 admin    false    218            �           2606    27139    usuario usuario_correo_key13 
   CONSTRAINT     Y   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key13 UNIQUE (correo);
 F   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key13;
       public                 admin    false    218            �           2606    27081    usuario usuario_correo_key14 
   CONSTRAINT     Y   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key14 UNIQUE (correo);
 F   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key14;
       public                 admin    false    218            �           2606    27083    usuario usuario_correo_key15 
   CONSTRAINT     Y   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key15 UNIQUE (correo);
 F   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key15;
       public                 admin    false    218            �           2606    27137    usuario usuario_correo_key16 
   CONSTRAINT     Y   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key16 UNIQUE (correo);
 F   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key16;
       public                 admin    false    218            �           2606    27085    usuario usuario_correo_key17 
   CONSTRAINT     Y   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key17 UNIQUE (correo);
 F   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key17;
       public                 admin    false    218            �           2606    27135    usuario usuario_correo_key18 
   CONSTRAINT     Y   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key18 UNIQUE (correo);
 F   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key18;
       public                 admin    false    218            �           2606    27087    usuario usuario_correo_key19 
   CONSTRAINT     Y   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key19 UNIQUE (correo);
 F   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key19;
       public                 admin    false    218            �           2606    27147    usuario usuario_correo_key2 
   CONSTRAINT     X   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key2 UNIQUE (correo);
 E   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key2;
       public                 admin    false    218            �           2606    27127    usuario usuario_correo_key20 
   CONSTRAINT     Y   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key20 UNIQUE (correo);
 F   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key20;
       public                 admin    false    218            �           2606    27133    usuario usuario_correo_key21 
   CONSTRAINT     Y   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key21 UNIQUE (correo);
 F   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key21;
       public                 admin    false    218            �           2606    27129    usuario usuario_correo_key22 
   CONSTRAINT     Y   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key22 UNIQUE (correo);
 F   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key22;
       public                 admin    false    218            �           2606    27131    usuario usuario_correo_key23 
   CONSTRAINT     Y   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key23 UNIQUE (correo);
 F   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key23;
       public                 admin    false    218            �           2606    27111    usuario usuario_correo_key24 
   CONSTRAINT     Y   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key24 UNIQUE (correo);
 F   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key24;
       public                 admin    false    218            �           2606    27119    usuario usuario_correo_key25 
   CONSTRAINT     Y   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key25 UNIQUE (correo);
 F   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key25;
       public                 admin    false    218            �           2606    27113    usuario usuario_correo_key26 
   CONSTRAINT     Y   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key26 UNIQUE (correo);
 F   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key26;
       public                 admin    false    218            �           2606    27115    usuario usuario_correo_key27 
   CONSTRAINT     Y   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key27 UNIQUE (correo);
 F   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key27;
       public                 admin    false    218            �           2606    27117    usuario usuario_correo_key28 
   CONSTRAINT     Y   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key28 UNIQUE (correo);
 F   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key28;
       public                 admin    false    218            �           2606    27047    usuario usuario_correo_key29 
   CONSTRAINT     Y   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key29 UNIQUE (correo);
 F   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key29;
       public                 admin    false    218            �           2606    27149    usuario usuario_correo_key3 
   CONSTRAINT     X   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key3 UNIQUE (correo);
 E   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key3;
       public                 admin    false    218            �           2606    27075    usuario usuario_correo_key30 
   CONSTRAINT     Y   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key30 UNIQUE (correo);
 F   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key30;
       public                 admin    false    218            �           2606    27049    usuario usuario_correo_key31 
   CONSTRAINT     Y   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key31 UNIQUE (correo);
 F   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key31;
       public                 admin    false    218            �           2606    27051    usuario usuario_correo_key32 
   CONSTRAINT     Y   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key32 UNIQUE (correo);
 F   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key32;
       public                 admin    false    218            �           2606    27073    usuario usuario_correo_key33 
   CONSTRAINT     Y   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key33 UNIQUE (correo);
 F   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key33;
       public                 admin    false    218            �           2606    27053    usuario usuario_correo_key34 
   CONSTRAINT     Y   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key34 UNIQUE (correo);
 F   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key34;
       public                 admin    false    218            �           2606    27071    usuario usuario_correo_key35 
   CONSTRAINT     Y   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key35 UNIQUE (correo);
 F   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key35;
       public                 admin    false    218            �           2606    27055    usuario usuario_correo_key36 
   CONSTRAINT     Y   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key36 UNIQUE (correo);
 F   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key36;
       public                 admin    false    218            �           2606    27069    usuario usuario_correo_key37 
   CONSTRAINT     Y   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key37 UNIQUE (correo);
 F   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key37;
       public                 admin    false    218            �           2606    27065    usuario usuario_correo_key38 
   CONSTRAINT     Y   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key38 UNIQUE (correo);
 F   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key38;
       public                 admin    false    218            �           2606    27067    usuario usuario_correo_key39 
   CONSTRAINT     Y   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key39 UNIQUE (correo);
 F   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key39;
       public                 admin    false    218            �           2606    27043    usuario usuario_correo_key4 
   CONSTRAINT     X   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key4 UNIQUE (correo);
 E   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key4;
       public                 admin    false    218            �           2606    27063    usuario usuario_correo_key40 
   CONSTRAINT     Y   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key40 UNIQUE (correo);
 F   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key40;
       public                 admin    false    218            �           2606    27057    usuario usuario_correo_key41 
   CONSTRAINT     Y   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key41 UNIQUE (correo);
 F   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key41;
       public                 admin    false    218            �           2606    27061    usuario usuario_correo_key42 
   CONSTRAINT     Y   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key42 UNIQUE (correo);
 F   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key42;
       public                 admin    false    218            �           2606    27059    usuario usuario_correo_key43 
   CONSTRAINT     Y   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key43 UNIQUE (correo);
 F   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key43;
       public                 admin    false    218            �           2606    27041    usuario usuario_correo_key44 
   CONSTRAINT     Y   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key44 UNIQUE (correo);
 F   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key44;
       public                 admin    false    218                        2606    27155    usuario usuario_correo_key45 
   CONSTRAINT     Y   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key45 UNIQUE (correo);
 F   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key45;
       public                 admin    false    218                       2606    27039    usuario usuario_correo_key46 
   CONSTRAINT     Y   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key46 UNIQUE (correo);
 F   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key46;
       public                 admin    false    218                       2606    27157    usuario usuario_correo_key47 
   CONSTRAINT     Y   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key47 UNIQUE (correo);
 F   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key47;
       public                 admin    false    218                       2606    27037    usuario usuario_correo_key48 
   CONSTRAINT     Y   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key48 UNIQUE (correo);
 F   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key48;
       public                 admin    false    218                       2606    27023    usuario usuario_correo_key49 
   CONSTRAINT     Y   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key49 UNIQUE (correo);
 F   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key49;
       public                 admin    false    218            
           2606    27045    usuario usuario_correo_key5 
   CONSTRAINT     X   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key5 UNIQUE (correo);
 E   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key5;
       public                 admin    false    218                       2606    27025    usuario usuario_correo_key50 
   CONSTRAINT     Y   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key50 UNIQUE (correo);
 F   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key50;
       public                 admin    false    218                       2606    27035    usuario usuario_correo_key51 
   CONSTRAINT     Y   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key51 UNIQUE (correo);
 F   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key51;
       public                 admin    false    218                       2606    27033    usuario usuario_correo_key52 
   CONSTRAINT     Y   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key52 UNIQUE (correo);
 F   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key52;
       public                 admin    false    218                       2606    27027    usuario usuario_correo_key53 
   CONSTRAINT     Y   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key53 UNIQUE (correo);
 F   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key53;
       public                 admin    false    218                       2606    27031    usuario usuario_correo_key54 
   CONSTRAINT     Y   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key54 UNIQUE (correo);
 F   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key54;
       public                 admin    false    218                       2606    27029    usuario usuario_correo_key55 
   CONSTRAINT     Y   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key55 UNIQUE (correo);
 F   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key55;
       public                 admin    false    218                       2606    27173    usuario usuario_correo_key56 
   CONSTRAINT     Y   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key56 UNIQUE (correo);
 F   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key56;
       public                 admin    false    218                       2606    27159    usuario usuario_correo_key57 
   CONSTRAINT     Y   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key57 UNIQUE (correo);
 F   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key57;
       public                 admin    false    218                       2606    27171    usuario usuario_correo_key58 
   CONSTRAINT     Y   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key58 UNIQUE (correo);
 F   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key58;
       public                 admin    false    218                       2606    27161    usuario usuario_correo_key59 
   CONSTRAINT     Y   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key59 UNIQUE (correo);
 F   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key59;
       public                 admin    false    218                        2606    27077    usuario usuario_correo_key6 
   CONSTRAINT     X   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key6 UNIQUE (correo);
 E   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key6;
       public                 admin    false    218            "           2606    27169    usuario usuario_correo_key60 
   CONSTRAINT     Y   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key60 UNIQUE (correo);
 F   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key60;
       public                 admin    false    218            $           2606    27163    usuario usuario_correo_key61 
   CONSTRAINT     Y   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key61 UNIQUE (correo);
 F   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key61;
       public                 admin    false    218            &           2606    27167    usuario usuario_correo_key62 
   CONSTRAINT     Y   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key62 UNIQUE (correo);
 F   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key62;
       public                 admin    false    218            (           2606    27165    usuario usuario_correo_key63 
   CONSTRAINT     Y   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key63 UNIQUE (correo);
 F   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key63;
       public                 admin    false    218            *           2606    27125    usuario usuario_correo_key64 
   CONSTRAINT     Y   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key64 UNIQUE (correo);
 F   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key64;
       public                 admin    false    218            ,           2606    27089    usuario usuario_correo_key65 
   CONSTRAINT     Y   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key65 UNIQUE (correo);
 F   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key65;
       public                 admin    false    218            .           2606    27123    usuario usuario_correo_key66 
   CONSTRAINT     Y   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key66 UNIQUE (correo);
 F   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key66;
       public                 admin    false    218            0           2606    27091    usuario usuario_correo_key67 
   CONSTRAINT     Y   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key67 UNIQUE (correo);
 F   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key67;
       public                 admin    false    218            2           2606    27153    usuario usuario_correo_key68 
   CONSTRAINT     Y   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key68 UNIQUE (correo);
 F   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key68;
       public                 admin    false    218            4           2606    27093    usuario usuario_correo_key69 
   CONSTRAINT     Y   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key69 UNIQUE (correo);
 F   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key69;
       public                 admin    false    218            6           2606    27105    usuario usuario_correo_key7 
   CONSTRAINT     X   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key7 UNIQUE (correo);
 E   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key7;
       public                 admin    false    218            8           2606    27151    usuario usuario_correo_key70 
   CONSTRAINT     Y   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key70 UNIQUE (correo);
 F   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key70;
       public                 admin    false    218            :           2606    27095    usuario usuario_correo_key71 
   CONSTRAINT     Y   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key71 UNIQUE (correo);
 F   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key71;
       public                 admin    false    218            <           2606    27103    usuario usuario_correo_key72 
   CONSTRAINT     Y   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key72 UNIQUE (correo);
 F   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key72;
       public                 admin    false    218            >           2606    27097    usuario usuario_correo_key73 
   CONSTRAINT     Y   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key73 UNIQUE (correo);
 F   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key73;
       public                 admin    false    218            @           2606    27099    usuario usuario_correo_key74 
   CONSTRAINT     Y   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key74 UNIQUE (correo);
 F   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key74;
       public                 admin    false    218            B           2606    27101    usuario usuario_correo_key75 
   CONSTRAINT     Y   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key75 UNIQUE (correo);
 F   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key75;
       public                 admin    false    218            D           2606    27021    usuario usuario_correo_key76 
   CONSTRAINT     Y   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key76 UNIQUE (correo);
 F   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key76;
       public                 admin    false    218            F           2606    27175    usuario usuario_correo_key77 
   CONSTRAINT     Y   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key77 UNIQUE (correo);
 F   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key77;
       public                 admin    false    218            H           2606    27019    usuario usuario_correo_key78 
   CONSTRAINT     Y   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key78 UNIQUE (correo);
 F   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key78;
       public                 admin    false    218            J           2606    27017    usuario usuario_correo_key79 
   CONSTRAINT     Y   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key79 UNIQUE (correo);
 F   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key79;
       public                 admin    false    218            L           2606    27107    usuario usuario_correo_key8 
   CONSTRAINT     X   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key8 UNIQUE (correo);
 E   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key8;
       public                 admin    false    218            N           2606    27177    usuario usuario_correo_key80 
   CONSTRAINT     Y   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key80 UNIQUE (correo);
 F   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key80;
       public                 admin    false    218            P           2606    27015    usuario usuario_correo_key81 
   CONSTRAINT     Y   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key81 UNIQUE (correo);
 F   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key81;
       public                 admin    false    218            R           2606    27013    usuario usuario_correo_key82 
   CONSTRAINT     Y   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key82 UNIQUE (correo);
 F   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key82;
       public                 admin    false    218            T           2606    27179    usuario usuario_correo_key83 
   CONSTRAINT     Y   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key83 UNIQUE (correo);
 F   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key83;
       public                 admin    false    218            V           2606    27011    usuario usuario_correo_key84 
   CONSTRAINT     Y   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key84 UNIQUE (correo);
 F   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key84;
       public                 admin    false    218            X           2606    27009    usuario usuario_correo_key85 
   CONSTRAINT     Y   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key85 UNIQUE (correo);
 F   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key85;
       public                 admin    false    218            Z           2606    27181    usuario usuario_correo_key86 
   CONSTRAINT     Y   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key86 UNIQUE (correo);
 F   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key86;
       public                 admin    false    218            \           2606    27183    usuario usuario_correo_key87 
   CONSTRAINT     Y   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key87 UNIQUE (correo);
 F   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key87;
       public                 admin    false    218            ^           2606    27109    usuario usuario_correo_key9 
   CONSTRAINT     X   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_correo_key9 UNIQUE (correo);
 E   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_correo_key9;
       public                 admin    false    218            `           2606    16826    usuario usuario_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (id_usuario);
 >   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_pkey;
       public                 admin    false    218            o           2606    27197 ;   catalogo_detalle catalogo_detalle_id_catalogo_cabecera_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.catalogo_detalle
    ADD CONSTRAINT catalogo_detalle_id_catalogo_cabecera_fkey FOREIGN KEY (id_catalogo_cabecera) REFERENCES public.catalogo_cabecera(id_catalogo_cabecera) ON UPDATE CASCADE ON DELETE SET NULL;
 e   ALTER TABLE ONLY public.catalogo_detalle DROP CONSTRAINT catalogo_detalle_id_catalogo_cabecera_fkey;
       public               admin    false    3432    228    226            l           2606    27216    cita cita_id_estado_cita_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.cita
    ADD CONSTRAINT cita_id_estado_cita_fkey FOREIGN KEY (id_estado_cita) REFERENCES public.catalogo_detalle(id_catalogo_detalle) ON UPDATE CASCADE;
 G   ALTER TABLE ONLY public.cita DROP CONSTRAINT cita_id_estado_cita_fkey;
       public               admin    false    3434    228    224            m           2606    27204    cita cita_id_paciente_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.cita
    ADD CONSTRAINT cita_id_paciente_fkey FOREIGN KEY (id_paciente) REFERENCES public.paciente(id_paciente) ON UPDATE CASCADE ON DELETE CASCADE;
 D   ALTER TABLE ONLY public.cita DROP CONSTRAINT cita_id_paciente_fkey;
       public               admin    false    222    3428    224            n           2606    27209    cita cita_id_veterinario_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.cita
    ADD CONSTRAINT cita_id_veterinario_fkey FOREIGN KEY (id_veterinario) REFERENCES public.usuario(id_usuario) ON UPDATE CASCADE ON DELETE CASCADE;
 G   ALTER TABLE ONLY public.cita DROP CONSTRAINT cita_id_veterinario_fkey;
       public               admin    false    218    224    3424            k           2606    27188 !   paciente paciente_id_cliente_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.paciente
    ADD CONSTRAINT paciente_id_cliente_fkey FOREIGN KEY (id_cliente) REFERENCES public.cliente(id_cliente) ON UPDATE CASCADE ON DELETE CASCADE;
 K   ALTER TABLE ONLY public.paciente DROP CONSTRAINT paciente_id_cliente_fkey;
       public               admin    false    220    3426    222            
   @   x�3�L-.IL�/�O�,I,�4202�50�54R04�22�20�303400�60����t����� �6�         W   x���1
� �9��{Q~R��TJA:������=&&%��Ӳl� �;D���W�E�Y�O�Ǳ<�����B֞k�a8c�)�&�           x��ұN�@����Q-�g�}�Yx�.+�x�V�izE�)�O��8�E
Iadݣ�9�,����5KD������)Ol"l@�s�Rh����@�cۡպش��b�}~|��w󌍓'����#���~��Ty����ܱ��-j���}�N@���f�DZok�5}�Z��i�P��4OvKK�?�-4Wz�H��Y�]|2쮡R�`��A�/��[aWx�:��2t�U�^�CFF�@u���o!��R� �4��7�+         �   x�m�1�0���W���B�vҨ��+K�6iAAI��[�ƅ�%��/�>dc�$\���;1ۺ����x{м>�h��@YQiĜ�Kw>9�-� U
12AeTe0
�
���#*L^�B��6�>���lG���N4��B�~�e����vA%23 �@��������� �?�         �   x�m���@���+��K��t�1�%�
&��3���5�tӤ'�m�2�m{V��]�a�ER��R�	2i$��8�&�ݭVQo��>(�XS������$M�������O��L�{�A�EG��wX�b?\<�-����0�!$~��}��+�V#�ަ�$��9�%��9oR|ܗ�۳J�(���d�         �  x����N�@��>�6���n��40vbLbe�΢�t���;i/Yކ#�"/6N@B �\��T�TUKQ��s�]�e,XN�+BB�Im�h#���߇b���'�7h�Z_����l�q/�W�x����`�'e]�F�YQ
q!a��+H���b*�D� "����nZH�,d���<8��� }h9�D@���[v�l:����]i�*�,�l��%�Y�|+0��JUQ���˴�&RM�����o��7h
�>�W*wy~8>�����6��N����`��ǋ��*wA��B7�Ͳ�n�*=ue��]o~�+:0��-��w:9�Fo�r�^�ͫIH�V���+���q]gy�f���a�Y%��ʃ���d��/����04	D!_�����~�7�_�j��*��r     