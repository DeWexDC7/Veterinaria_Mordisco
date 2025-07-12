const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cita = sequelize.define('Cita', {
  id_cita: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  id_paciente: DataTypes.INTEGER,
  id_veterinario: DataTypes.INTEGER,
  fecha: DataTypes.DATEONLY,
  hora: DataTypes.TIME,
  motivo: DataTypes.TEXT,
  estado_cita: DataTypes.STRING,
  id_estado_cita: DataTypes.INTEGER, // Nueva columna para el catálogo de estados
  observaciones: DataTypes.TEXT,
  creado_en: DataTypes.DATE,
  actualizado_en: DataTypes.DATE,
  estado: { type: DataTypes.CHAR(1), defaultValue: 'A' },
}, {
  tableName: 'cita',
  timestamps: false,
});

module.exports = Cita;
