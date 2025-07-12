const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {
  id_usuario: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: DataTypes.STRING,
  correo: { type: DataTypes.STRING, unique: true },
  contrasenia: DataTypes.STRING,
  rol: DataTypes.STRING,
  creado_en: DataTypes.DATE,
  actualizado_en: DataTypes.DATE,
  estado: { type: DataTypes.CHAR(1), defaultValue: 'A' },
}, {
  tableName: 'usuario',
  timestamps: false,
});

module.exports = Usuario;
