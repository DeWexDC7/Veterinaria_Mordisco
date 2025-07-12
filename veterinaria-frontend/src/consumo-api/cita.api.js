import apiClient from './api.config';

/**
 * Servicio para gestionar las citas en la API
 */
class CitaAPI {
  /**
   * Obtiene todas las citas
   * @returns {Promise} Lista de citas
   */
  async getAll() {
    try {
      const response = await apiClient.get('/citas');
      return response.data;
    } catch (error) {
      console.error('Error al obtener citas:', error);
      throw error.response?.data || error;
    }
  }

  /**
   * Obtiene una cita por su ID
   * @param {number} id - ID de la cita
   * @returns {Promise} Datos de la cita
   */
  async getById(id) {
    try {
      const response = await apiClient.get(`/citas/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener cita con ID ${id}:`, error);
      throw error.response?.data || error;
    }
  }

  /**
   * Obtiene las citas por paciente
   * @param {number} pacienteId - ID del paciente
   * @returns {Promise} Lista de citas del paciente
   */
  async getByPacienteId(pacienteId) {
    try {
      const response = await apiClient.get(`/citas/paciente/${pacienteId}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener citas del paciente ${pacienteId}:`, error);
      throw error.response?.data || error;
    }
  }

  /**
   * Obtiene las citas por cliente
   * @param {number} clienteId - ID del cliente
   * @returns {Promise} Lista de citas del cliente
   */
  async getByClienteId(clienteId) {
    try {
      const response = await apiClient.get(`/citas/cliente/${clienteId}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener citas del cliente ${clienteId}:`, error);
      throw error.response?.data || error;
    }
  }

  /**
   * Crea una nueva cita
   * @param {Object} cita - Datos de la cita a crear
   * @returns {Promise} Cita creada
   */
  async create(cita) {
    try {
      const response = await apiClient.post('/citas', cita);
      return response.data;
    } catch (error) {
      console.error('Error al crear cita:', error);
      throw error.response?.data || error;
    }
  }

  /**
   * Actualiza una cita existente
   * @param {number} id - ID de la cita
   * @param {Object} cita - Datos actualizados
   * @returns {Promise} Cita actualizada
   */
  async update(id, cita) {
    try {
      const response = await apiClient.put(`/citas/${id}`, cita);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar cita con ID ${id}:`, error);
      throw error.response?.data || error;
    }
  }

  /**
   * Elimina una cita
   * @param {number} id - ID de la cita a eliminar
   * @returns {Promise} Resultado de la eliminación
   */
  async delete(id) {
    try {
      const response = await apiClient.delete(`/citas/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar cita con ID ${id}:`, error);
      throw error.response?.data || error;
    }
  }

  /**
   * Cambia el estado de una cita
   * @param {number} id - ID de la cita
   * @param {string} estado - Nuevo estado de la cita
   * @returns {Promise} Cita con estado actualizado
   */
  async cambiarEstado(id, estado) {
    try {
      const response = await apiClient.patch(`/citas/${id}/estado`, { estado });
      return response.data;
    } catch (error) {
      console.error(`Error al cambiar estado de la cita ${id}:`, error);
      throw error.response?.data || error;
    }
  }
}

export default new CitaAPI();