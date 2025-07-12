const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CatalogoCabecera = sequelize.define('CatalogoCabecera', {
  id_catalogo_cabecera: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre_tabla: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  creado_en: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW
  },
  actualizado_en: {
    type: DataTypes.DATE,
    allowNull: true
  },
  estado: {
    type: DataTypes.CHAR(1),
    allowNull: true,
    defaultValue: 'A'
  }
}, {
  tableName: 'catalogo_cabecera',
  timestamps: false
});

const CatalogoDetalle = sequelize.define('CatalogoDetalle', {
  id_catalogo_detalle: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_catalogo_cabecera: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: CatalogoCabecera,
      key: 'id_catalogo_cabecera'
    }
  },
  estado: {
    type: DataTypes.CHAR(1),
    allowNull: true,
    defaultValue: 'A'
  },
  creado_en: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW
  },
  actualizado_en: {
    type: DataTypes.DATE,
    allowNull: true
  },
  nombre_catalogo_cabecera: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  tableName: 'catalogo_detalle',
  timestamps: false
});

// Definir asociaciones
CatalogoCabecera.hasMany(CatalogoDetalle, {
  foreignKey: 'id_catalogo_cabecera',
  as: 'detalles'
});

CatalogoDetalle.belongsTo(CatalogoCabecera, {
  foreignKey: 'id_catalogo_cabecera',
  as: 'cabecera'
});

module.exports = {
  CatalogoCabecera,
  CatalogoDetalle
};
