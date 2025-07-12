const { Usuario } = require('../models');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const getAll = async () => await Usuario.findAll();

const getById = async (id) => await Usuario.findByPk(id);

const create = async (data) => {
  // Hashear la contraseña antes de guardarla
  if (data.contrasenia) {
    data.contrasenia = await bcrypt.hash(data.contrasenia, saltRounds);
  }
  
  // Agregar fechas si no están presentes
  if (!data.creado_en) {
    data.creado_en = new Date();
  }
  if (!data.actualizado_en) {
    data.actualizado_en = new Date();
  }
  
  return await Usuario.create(data);
};

const update = async (id, data) => {
  const item = await Usuario.findByPk(id);
  if (!item) return null;
  
  // Hashear la contraseña si se está actualizando
  if (data.contrasenia) {
    data.contrasenia = await bcrypt.hash(data.contrasenia, saltRounds);
  }
  
  // Actualizar la fecha de actualización
  data.actualizado_en = new Date();
  
  await item.update(data);
  return item;
};

const deleteItem = async (id) => {
  const item = await Usuario.findByPk(id);
  if (!item) return null;
  await item.destroy();
  return item;
};

module.exports = { getAll, getById, create, update, deleteItem };
