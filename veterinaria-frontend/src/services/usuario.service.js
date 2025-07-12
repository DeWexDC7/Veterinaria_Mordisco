import usuarioAPI from '../consumo-api/usuario.api';

/**
 * Servicio para la gestión de usuarios en la aplicación
 * Este servicio proporciona una interfaz limpia para las funcionalidades
 * de usuarios utilizando el API correspondiente
 */
class UsuarioService {
  /**
   * Obtiene todos los usuarios
   * @returns {Promise} - Lista de usuarios
   */
  getAll() {
    return usuarioAPI.getAll();
  }

  /**
   * Obtiene un usuario por su ID
   * @param {number} id - ID del usuario
   * @returns {Promise} - Datos del usuario
   */
  getById(id) {
    return usuarioAPI.getById(id);
  }

  /**
   * Crea un nuevo usuario
   * @param {Object} userData - Datos del nuevo usuario
   * @returns {Promise} - Usuario creado
   */
  create(userData) {
    return usuarioAPI.create(userData);
  }

  /**
   * Actualiza un usuario existente
   * @param {number} id - ID del usuario a actualizar
   * @param {Object} userData - Datos actualizados del usuario
   * @returns {Promise} - Usuario actualizado
   */
  update(id, userData) {
    return usuarioAPI.update(id, userData);
  }

  /**
   * Elimina un usuario
   * @param {number} id - ID del usuario a eliminar
   * @returns {Promise} - Respuesta de confirmación
   */
  delete(id) {
    return usuarioAPI.delete(id);
  }
}

export default new UsuarioService();