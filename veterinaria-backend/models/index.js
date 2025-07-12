const sequelize = require('../config/database');
const Usuario = require('./usuario');
const Cliente = require('./cliente');
const Paciente = require('./paciente');
const Cita = require('./cita');
const { CatalogoCabecera, CatalogoDetalle } = require('./catalogo');

Cliente.hasMany(Paciente, { foreignKey: 'id_cliente' });
Paciente.belongsTo(Cliente, { foreignKey: 'id_cliente' });

Usuario.hasMany(Cita, { foreignKey: 'id_veterinario' });
Paciente.hasMany(Cita, { foreignKey: 'id_paciente' });

Cita.belongsTo(Usuario, { foreignKey: 'id_veterinario' });
Cita.belongsTo(Paciente, { foreignKey: 'id_paciente' });

// Relación con catálogo de estados de cita
Cita.belongsTo(CatalogoDetalle, { 
  foreignKey: 'id_estado_cita',
  as: 'estado_catalogo'
});

CatalogoDetalle.hasMany(Cita, {
  foreignKey: 'id_estado_cita',
  as: 'citas'
});

module.exports = {
  sequelize,
  Usuario,
  Cliente,
  Paciente,
  Cita,
  CatalogoCabecera,
  CatalogoDetalle,
};