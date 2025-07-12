import apiClient from './api.config';

/**
 * Servicio para gestionar usuarios usando Axios
 */
class UsuarioAPI {
  /**
   * Obtiene todos los usuarios
   * @returns {Promise} - Lista de usuarios
   */
  async getAll() {
    try {
      const response = await apiClient.get('/usuarios');
      return response.data;
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw error.response?.data || error;
    }
  }

  /**
   * Obtiene un usuario por su ID
   * @param {number} id - ID del usuario
   * @returns {Promise} - Datos del usuario
   */
  async getById(id) {
    try {
      const response = await apiClient.get(`/usuarios/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener usuario con id ${id}:`, error);
      throw error.response?.data || error;
    }
  }

  /**
   * Crea un nuevo usuario
   * @param {Object} userData - Datos del nuevo usuario
   * @returns {Promise} - Usuario creado
   */
  async create(userData) {
    try {
      const response = await apiClient.post('/usuarios', userData);
      return response.data;
    } catch (error) {
      console.error('Error al crear usuario:', error);
      throw error.response?.data || error;
    }
  }

  /**
   * Actualiza un usuario existente
   * @param {number} id - ID del usuario a actualizar
   * @param {Object} userData - Datos actualizados del usuario
   * @returns {Promise} - Usuario actualizado
   */
  async update(id, userData) {
    try {
      const response = await apiClient.put(`/usuarios/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar usuario con id ${id}:`, error);
      throw error.response?.data || error;
    }
  }

  /**
   * Elimina un usuario
   * @param {number} id - ID del usuario a eliminar
   * @returns {Promise} - Respuesta de confirmación
   */
  async delete(id) {
    try {
      const response = await apiClient.delete(`/usuarios/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar usuario con id ${id}:`, error);
      throw error.response?.data || error;
    }
  }
}

export default new UsuarioAPI();