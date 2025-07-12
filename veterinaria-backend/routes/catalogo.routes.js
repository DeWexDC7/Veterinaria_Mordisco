const express = require('express');
const router = express.Router();
const catalogoController = require('../controllers/catalogo.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Aplicar middleware de autenticación a todas las rutas
router.use(authMiddleware.verifyToken);

// Rutas para catálogo
router.get('/detalle/:id_cabecera', catalogoController.getDetallesByCabecera);
router.get('/cabeceras', catalogoController.getAllCabeceras);
router.post('/detalle', catalogoController.createDetalle);

module.exports = router;
