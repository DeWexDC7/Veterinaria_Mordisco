const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
require('dotenv').config();

const app = express();

// Configuración CORS más específica
const corsOptions = {
  origin: ['http://localhost:3001', 'http://127.0.0.1:3001', 'http://192.168.3.15:3001'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
app.use(cors(corsOptions));

app.use(express.json());

// Imprimir detalles de las solicitudes para depuración
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Cuerpo:`, req.body);
  next();
});

// Importar rutas
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/usuarios', require('./routes/usuario.routes'));
app.use('/api/clientes', require('./routes/cliente.routes'));
app.use('/api/pacientes', require('./routes/paciente.routes'));
app.use('/api/citas', require('./routes/cita.routes'));
app.use('/api/catalogo', require('./routes/catalogo.routes'));
app.use('/api/catalogo/detalle', require('./routes/catalogo.detalle.routes'));

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API de Veterinaria Mordisco funcionando correctamente' });
});

const PORT = process.env.PORT || 3000;
sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, () => console.log(`✅ Servidor corriendo en http://localhost:${PORT}`));
});