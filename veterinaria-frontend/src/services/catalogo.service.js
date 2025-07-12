import catalogoApi from '../consumo-api/catalogo.api';

const catalogoService = {
  // Obtener estados de citas
  getEstadosCitas: async () => {
    try {
      // ID 1 corresponde a 'estados_citas' según la migración
      return await catalogoApi.getDetallesByCabecera(1);
    } catch (error) {
      console.error('Error al obtener estados de citas:', error);
      throw error;
    }
  },

  // Obtener todas las cabeceras
  getAllCabeceras: async () => {
    try {
      return await catalogoApi.getAllCabeceras();
    } catch (error) {
      console.error('Error al obtener cabeceras:', error);
      throw error;
    }
  },

  // Crear nuevo detalle
  createDetalle: async (detalle) => {
    try {
      return await catalogoApi.createDetalle(detalle);
    } catch (error) {
      console.error('Error al crear detalle:', error);
      throw error;
    }
  },

  // Obtener nombre del estado por ID
  getEstadoNombre: (estados, idEstado) => {
    const estado = estados.find(e => e.id_catalogo_detalle === idEstado);
    return estado ? estado.nombre_catalogo_cabecera : 'Sin estado';
  },

  // Obtener clase CSS para el estado
  getEstadoClase: (nombreEstado) => {
    switch (nombreEstado?.toUpperCase()) {
      case 'AGENDADA':
        return 'estado-agendada';
      case 'REAGENDADA':
        return 'estado-reagendada';
      case 'REALIZADA':
        return 'estado-realizada';
      case 'CANCELADA':
        return 'estado-cancelada';
      default:
        return 'estado-default';
    }
  }
};

export default catalogoService;
