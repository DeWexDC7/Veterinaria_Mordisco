const { Cliente } = require('../models');

const getAll = async () => await Cliente.findAll();

const getById = async (id) => await Cliente.findByPk(id);

const create = async (data) => await Cliente.create(data);

const update = async (id, data) => {
  const item = await Cliente.findByPk(id);
  if (!item) return null;
  await item.update(data);
  return item;
};

const deleteItem = async (id) => {
  const item = await Cliente.findByPk(id);
  if (!item) return null;
  await item.destroy();
  return item;
};

module.exports = { getAll, getById, create, update, deleteItem };
