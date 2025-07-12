const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Paciente = sequelize.define('Paciente', {
  id_paciente: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: DataTypes.STRING,
  especie: DataTypes.STRING,
  raza: DataTypes.STRING,
  edad: DataTypes.INTEGER,
  peso: DataTypes.DECIMAL(5,2),
  genero: DataTypes.STRING,
  id_cliente: DataTypes.INTEGER,
  historial_clinico: DataTypes.TEXT,
  creado_en: DataTypes.DATE,
  actualizado_en: DataTypes.DATE,
  estado: { type: DataTypes.CHAR(1), defaultValue: 'A' },
}, {
  tableName: 'paciente',
  timestamps: false,
});

module.exports = Paciente;
