const service = require('../services/cita.service');

const getAll = async (req, res) => {
  try {
    const data = await service.getAll();
    res.json(data);
  } catch (error) {
    console.error('Error al obtener citas:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor al obtener citas',
      error: error.message 
    });
  }
};

const getById = async (req, res) => {
  try {
    const item = await service.getById(req.params.id);
    if (!item) return res.status(404).json({ mensaje: 'Cita no encontrada' });
    res.json(item);
  } catch (error) {
    console.error('Error al obtener cita por ID:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor al obtener cita',
      error: error.message 
    });
  }
};

const create = async (req, res) => {
  try {
    const nuevo = await service.create(req.body);
    res.status(201).json(nuevo);
  } catch (error) {
    console.error('Error al crear cita:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor al crear cita',
      error: error.message 
    });
  }
};

const update = async (req, res) => {
  try {
    const actualizado = await service.update(req.params.id, req.body);
    if (!actualizado) return res.status(404).json({ mensaje: 'Cita no encontrada' });
    res.json(actualizado);
  } catch (error) {
    console.error('Error al actualizar cita:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor al actualizar cita',
      error: error.message 
    });
  }
};

const eliminar = async (req, res) => {
  try {
    const eliminado = await service.deleteItem(req.params.id);
    if (!eliminado) return res.status(404).json({ mensaje: 'Cita no encontrada' });
    res.json({ mensaje: 'Cita eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar cita:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor al eliminar cita',
      error: error.message 
    });
  }
};

module.exports = { getAll, getById, create, update, eliminar };
