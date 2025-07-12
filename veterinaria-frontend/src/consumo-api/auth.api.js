import apiClient from './api.config';

/**
 * Servicio para gestionar la autenticación de usuarios usando Axios
 */
class AuthService {
  /**
   * Realiza el inicio de sesión contra el backend
   * @param {string} correo - Correo del usuario
   * @param {string} contrasenia - Contraseña del usuario
   * @returns {Promise} - Respuesta del servidor con token y datos del usuario
   */
  async login(correo, contrasenia) {
    try {
      console.log('Intentando conectar a: /auth/login');
      
      const response = await apiClient.post('/auth/login', {
        correo,
        contrasenia
      });
      
      // Si la autenticación es exitosa, guardar el token y datos del usuario
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      
      return response.data;
    } catch (error) {
      console.error('Error en login service:', error);
      throw error.response?.data || error;
    }
  }

  /**
   * Cierra la sesión del usuario eliminando sus datos del localStorage
   */
  logout() {
    localStorage.removeItem('user');
  }

  /**
   * Obtiene el usuario actual desde el localStorage
   * @returns {Object|null} - Datos del usuario o null si no hay sesión
   */
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch (e) {
      this.logout(); // Si hay un error en el parsing, limpiar datos
      return null;
    }
  }

  /**
   * Obtiene el token JWT almacenado
   * @returns {string|null} - Token JWT o null si no hay sesión
   */
  getToken() {
    const user = this.getCurrentUser();
    return user?.token || null;
  }

  /**
   * Verifica si el usuario tiene un rol específico
   * @param {string} requiredRole - Rol requerido para acceder
   * @returns {boolean} - True si el usuario tiene el rol requerido
   */
  hasRole(requiredRole) {
    const user = this.getCurrentUser();
    return user?.usuario?.rol === requiredRole;
  }

  /**
   * Verifica si hay un usuario autenticado
   * @returns {boolean} - True si hay un usuario autenticado
   */
  isAuthenticated() {
    return this.getToken() !== null;
  }
}

// Crear una instancia del servicio
const authService = new AuthService();

// Exportar la instancia como valor predeterminado
export default authService;