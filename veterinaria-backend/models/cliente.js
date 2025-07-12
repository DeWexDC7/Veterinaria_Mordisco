const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cliente = sequelize.define('Cliente', {
  id_cliente: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre_completo: DataTypes.STRING,
  cedula: DataTypes.STRING,
  correo: DataTypes.STRING,
  telefono: DataTypes.STRING,
  direccion: DataTypes.TEXT,
  creado_en: DataTypes.DATE,
  actualizado_en: DataTypes.DATE,
  estado: { type: DataTypes.CHAR(1), defaultValue: 'A' },
}, {
  tableName: 'cliente',
  timestamps: false,
});

module.exports = Cliente;
