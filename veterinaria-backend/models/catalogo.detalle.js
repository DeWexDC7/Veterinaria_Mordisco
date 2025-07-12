const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');


const CatalogoDetalle = sequelize.define('CatalogoDetalle', {
  id_catalogo_detalle: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  id_catalogo_cabecera: DataTypes.INTEGER,
  id_estado_cita: DataTypes.INTEGER,
  nombre_catalogo_cabecera: DataTypes.STRING,
  creado_en: DataTypes.DATE,
  actualizado_en: DataTypes.DATE,
  estado: { type: DataTypes.CHAR(1), defaultValue: 'A' },
}, {
  tableName: 'catalogo_detalle',
  timestamps: false,
});

module.exports = CatalogoDetalle;