const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');


const CatalogoCabecera = sequelize.define('CatalogoCabecera', {
  id_catalogo_cabecera: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre_tabla: DataTypes.STRING,
  creado_en: DataTypes.DATE,
  actualizado_en: DataTypes.DATE,
  estado: { type: DataTypes.CHAR(1), defaultValue: 'A' },
}, {
  tableName: 'catalogo_cabecera',
  timestamps: false,
});

module.exports = CatalogoCabecera;