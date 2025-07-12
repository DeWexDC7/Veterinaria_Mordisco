import apiClient from './api.config';

/**
 * Servicio para gestionar clientes usando Axios
 */
class ClienteAPI {
  /**
   * Obtiene todos los clientes
   * @returns {Promise} - Lista de clientes
   */
  async getAll() {
    try {
      const response = await apiClient.get('/clientes');
      return response.data;
    } catch (error) {
      console.error('Error al obtener clientes:', error);
      throw error.response?.data || error;
    }
  }

  /**
   * Obtiene un cliente por su ID
   * @param {number} id - ID del cliente
   * @returns {Promise} - Datos del cliente
   */
  async getById(id) {
    try {
      const response = await apiClient.get(`/clientes/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener cliente con id ${id}:`, error);
      throw error.response?.data || error;
    }
  }

  /**
   * Crea un nuevo cliente
   * @param {Object} clienteData - Datos del nuevo cliente
   * @returns {Promise} - Cliente creado
   */
  async create(clienteData) {
    try {
      const response = await apiClient.post('/clientes', clienteData);
      return response.data;
    } catch (error) {
      console.error('Error al crear cliente:', error);
      throw error.response?.data || error;
    }
  }

  /**
   * Actualiza un cliente existente
   * @param {number} id - ID del cliente a actualizar
   * @param {Object} clienteData - Datos actualizados del cliente
   * @returns {Promise} - Cliente actualizado
   */
  async update(id, clienteData) {
    try {
      const response = await apiClient.put(`/clientes/${id}`, clienteData);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar cliente con id ${id}:`, error);
      throw error.response?.data || error;
    }
  }

  /**
   * Elimina un cliente
   * @param {number} id - ID del cliente a eliminar
   * @returns {Promise} - Respuesta de confirmación
   */
  async delete(id) {
    try {
      const response = await apiClient.delete(`/clientes/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar cliente con id ${id}:`, error);
      throw error.response?.data || error;
    }
  }
}

export default new ClienteAPI();