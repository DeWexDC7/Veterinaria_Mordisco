import apiClient from './api.config';

const catalogoApi = {
  // Obtener detalles de catálogo por ID de cabecera
  getDetallesByCabecera: async (idCabecera) => {
    try {
      const response = await apiClient.get(`/catalogo/detalle/${idCabecera}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener detalles del catálogo:', error);
      throw error;
    }
  },

  // Obtener todas las cabeceras de catálogo
  getAllCabeceras: async () => {
    try {
      const response = await apiClient.get('/catalogo/cabeceras');
      return response.data;
    } catch (error) {
      console.error('Error al obtener cabeceras de catálogo:', error);
      throw error;
    }
  },

  // Crear nuevo detalle de catálogo
  createDetalle: async (detalle) => {
    try {
      const response = await apiClient.post('/catalogo/detalle', detalle);
      return response.data;
    } catch (error) {
      console.error('Error al crear detalle de catálogo:', error);
      throw error;
    }
  }
};

export default catalogoApi;
