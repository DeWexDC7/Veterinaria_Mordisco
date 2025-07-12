const { CatalogoDetalle } = require('../models');

const getAll = async () => await CatalogoDetalle.findAll();

const getById = async (id) => await CatalogoDetalle.findByPk(id);

const create = async (data) => await CatalogoDetalle.create(data);

const getByCatalogoCabecera = async (idCatalogoCabecera) => {
  
  return await CatalogoDetalle.findAll({
    where: {id_catalogo_cabecera: parseInt(idCatalogoCabecera)}
  });

}

const update = async (id, data) => {
  const item = await CatalogoDetalle.findByPk(id);
  if (!item) return null;
  await item.update(data);
  return item;
};

const deleteItem = async (id) => {
  const item = await Cita.findByPk(id);
  if (!item) return null;
  await item.destroy();
  return item;
};

module.exports = { getAll, getById, create, update, deleteItem, getByCatalogoCabecera };