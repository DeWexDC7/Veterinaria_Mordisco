const { Paciente } = require('../models');

const getAll = async () => await Paciente.findAll();

const getById = async (id) => await Paciente.findByPk(id);

const getLatest = async () => {
  return await Paciente.findOne({
    order: [['id_paciente', 'DESC']]
  });
};

const create = async (data) => await Paciente.create(data);

const update = async (id, data) => {
  const item = await Paciente.findByPk(id);
  if (!item) return null;
  await item.update(data);
  return item;
};

const deleteItem = async (id) => {
  const item = await Paciente.findByPk(id);
  if (!item) return null;
  await item.destroy();
  return item;
};

module.exports = { getAll, getById, getLatest, create, update, deleteItem };
