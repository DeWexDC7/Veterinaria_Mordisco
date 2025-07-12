const service = require('../services/cliente.service');

const getAll = async (req, res) => {
  const data = await service.getAll();
  res.json(data);
};

const getById = async (req, res) => {
  const item = await service.getById(req.params.id);
  if (!item) return res.status(404).json({ mensaje: 'cliente no encontrado' });
  res.json(item);
};

const create = async (req, res) => {
  const nuevo = await service.create(req.body);
  res.status(201).json(nuevo);
};

const update = async (req, res) => {
  const actualizado = await service.update(req.params.id, req.body);
  if (!actualizado) return res.status(404).json({ mensaje: 'cliente no encontrado' });
  res.json(actualizado);
};

const eliminar = async (req, res) => {
  const eliminado = await service.deleteItem(req.params.id);
  if (!eliminado) return res.status(404).json({ mensaje: 'cliente no encontrado' });
  res.json({ mensaje: 'cliente eliminado' });
};

module.exports = { getAll, getById, create, update, eliminar };
