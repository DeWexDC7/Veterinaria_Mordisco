const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// Ruta para login - POST /api/auth/login
router.post('/login', authController.login);

// Ruta para obtener perfil - GET /api/auth/perfil
// Esta ruta está protegida, solo usuarios autenticados pueden acceder
router.get('/perfil', verifyToken, authController.getPerfil);

module.exports = router;