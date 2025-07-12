const { CatalogoCabecera, CatalogoDetalle } = require('../models/catalogo');

// Obtener todos los detalles de un catálogo por ID de cabecera
const getDetallesByCabecera = async (req, res) => {
  try {
    const { id_cabecera } = req.params;

    const detalles = await CatalogoDetalle.findAll({
      where: {
        id_catalogo_cabecera: id_cabecera,
        estado: 'A'
      },
      order: [['id_catalogo_detalle', 'ASC']]
    });

    res.status(200).json(detalles);
  } catch (error) {
    console.error('Error al obtener detalles del catálogo:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor al obtener detalles del catálogo',
      error: error.message 
    });
  }
};

// Obtener todas las cabeceras de catálogo
const getAllCabeceras = async (req, res) => {
  try {
    const cabeceras = await CatalogoCabecera.findAll({
      where: { estado: 'A' },
      include: [{
        model: CatalogoDetalle,
        as: 'detalles',
        where: { estado: 'A' },
        required: false
      }],
      order: [['id_catalogo_cabecera', 'ASC']]
    });

    res.status(200).json(cabeceras);
  } catch (error) {
    console.error('Error al obtener cabeceras de catálogo:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor al obtener cabeceras de catálogo',
      error: error.message 
    });
  }
};

// Crear nuevo detalle de catálogo
const createDetalle = async (req, res) => {
  try {
    const { id_catalogo_cabecera, nombre_catalogo_cabecera } = req.body;

    const nuevoDetalle = await CatalogoDetalle.create({
      id_catalogo_cabecera,
      nombre_catalogo_cabecera,
      creado_en: new Date(),
      estado: 'A'
    });

    res.status(201).json({
      message: 'Detalle de catálogo creado exitosamente',
      detalle: nuevoDetalle
    });
  } catch (error) {
    console.error('Error al crear detalle de catálogo:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor al crear detalle de catálogo',
      error: error.message 
    });
  }
};

module.exports = {
  getDetallesByCabecera,
  getAllCabeceras,
  createDetalle
};
