import apiClient from './api.config';

/**
 * Servicio para gestionar los pacientes (mascotas) en la API
 */
class PacienteAPI {
  /**
   * Obtiene todos los pacientes
   * @returns {Promise} Lista de pacientes
   */
  async getAll() {
    try {
      const response = await apiClient.get('/pacientes');
      return response.data;
    } catch (error) {
      console.error('Error al obtener pacientes:', error);
      throw error.response?.data || error;
    }
  }

  /**
   * Obtiene un paciente por su ID
   * @param {number} id - ID del paciente
   * @returns {Promise} Datos del paciente
   */
  async getById(id) {
    try {
      const response = await apiClient.get(`/pacientes/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener paciente con ID ${id}:`, error);
      throw error.response?.data || error;
    }
  }

  /**
   * Obtiene el último paciente registrado
   * @returns {Promise} Datos del último paciente registrado
   */
  async getLatest() {
    try {
      const response = await apiClient.get('/pacientes/latest');
      return response.data;
    } catch (error) {
      console.error('Error al obtener el último paciente:', error);
      throw error.response?.data || error;
    }
  }

  /**
   * Obtiene los pacientes de un cliente específico
   * @param {number} clienteId - ID del cliente dueño de las mascotas
   * @returns {Promise} Lista de pacientes del cliente
   */
  async getByClienteId(clienteId) {
    try {
      const response = await apiClient.get(`/pacientes/cliente/${clienteId}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener pacientes del cliente ${clienteId}:`, error);
      throw error.response?.data || error;
    }
  }

  /**
   * Crea un nuevo paciente
   * @param {Object} paciente - Datos del paciente a crear
   * @returns {Promise} Paciente creado
   */
  async create(paciente) {
    try {
      const response = await apiClient.post('/pacientes', paciente);
      return response.data;
    } catch (error) {
      console.error('Error al crear paciente:', error);
      throw error.response?.data || error;
    }
  }

  /**
   * Actualiza un paciente existente
   * @param {number} id - ID del paciente
   * @param {Object} paciente - Datos actualizados
   * @returns {Promise} Paciente actualizado
   */
  async update(id, paciente) {
    try {
      const response = await apiClient.put(`/pacientes/${id}`, paciente);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar paciente con ID ${id}:`, error);
      throw error.response?.data || error;
    }
  }

  /**
   * Elimina un paciente
   * @param {number} id - ID del paciente a eliminar
   * @returns {Promise} Resultado de la eliminación
   */
  async delete(id) {
    try {
      const response = await apiClient.delete(`/pacientes/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar paciente con ID ${id}:`, error);
      throw error.response?.data || error;
    }
  }
}

export default new PacienteAPI();