import authAPI from '../consumo-api/auth.api';

/**
 * Servicio para la gestión de autenticación en la aplicación
 * Este servicio proporciona una interfaz limpia para las funcionalidades
 * de autenticación utilizando el API correspondiente
 */
class AuthService {
  /**
   * Inicia sesión del usuario
   * @param {string} correo - Correo electrónico del usuario
   * @param {string} contrasenia - Contraseña del usuario
   * @returns {Promise} - Datos del usuario autenticado
   */
  login(correo, contrasenia) {
    return authAPI.login(correo, contrasenia);
  }

  /**
   * Cierra la sesión del usuario actual
   */
  logout() {
    authAPI.logout();
  }

  /**
   * Obtiene los datos del usuario actual
   * @returns {Object|null} - Datos del usuario o null
   */
  getCurrentUser() {
    return authAPI.getCurrentUser();
  }

  /**
   * Verifica si hay un usuario autenticado
   * @returns {boolean} - True si hay un usuario autenticado
   */
  isAuthenticated() {
    return authAPI.isAuthenticated();
  }

  /**
   * Verifica si el usuario tiene un rol específico
   * @param {string} role - Rol a verificar
   * @returns {boolean} - True si el usuario tiene el rol especificado
   */
  hasRole(role) {
    return authAPI.hasRole(role);
  }
}

// Exportar una instancia única del servicio
export default new AuthService();