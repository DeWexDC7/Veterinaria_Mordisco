// Servicio para realizar peticiones HTTP autenticadas
import authService from './auth.service';

// Usamos localhost porque estamos comprobado que funciona con curl
const API_URL = 'http://localhost:3000/api';

/**
 * Servicio para manejo de respuestas HTTP y errores
 * Esta clase proporciona métodos de utilidad para los servicios de la aplicación
 */
class HttpService {
  /**
   * Formatea una respuesta exitosa
   * @param {any} data - Datos de la respuesta
   * @param {string} mensaje - Mensaje opcional de éxito
   * @returns {Object} - Respuesta formateada
   */
  formatSuccess(data, mensaje = 'Operación exitosa') {
    return {
      success: true,
      mensaje,
      data
    };
  }

  /**
   * Formatea una respuesta de error
   * @param {string} mensaje - Mensaje de error
   * @param {number} statusCode - Código de estado HTTP
   * @param {any} error - Objeto de error original
   * @returns {Object} - Error formateado
   */
  formatError(mensaje = 'Ha ocurrido un error', statusCode = 500, error = null) {
    console.error('HTTP Error:', mensaje, error);
    
    return {
      success: false,
      mensaje,
      statusCode,
      error: process.env.NODE_ENV === 'development' ? error : undefined
    };
  }

  /**
   * Maneja un error y lo formatea de manera apropiada
   * @param {Error} error - Error capturado
   * @returns {Object} - Error formateado
   */
  handleError(error) {
    if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      const mensaje = error.response.data?.mensaje || 'Error del servidor';
      const statusCode = error.response.status;
      return this.formatError(mensaje, statusCode, error.response.data);
    } else if (error.request) {
      // La solicitud se realizó pero no se recibió respuesta
      return this.formatError('No se recibió respuesta del servidor', 0, error);
    } else {
      // Error al configurar la solicitud
      return this.formatError(error.message || 'Error de solicitud', 0, error);
    }
  }

  /**
   * Valida si un ID es válido (número entero positivo)
   * @param {any} id - ID a validar
   * @returns {boolean} - True si el ID es válido
   */
  isValidId(id) {
    return Number.isInteger(Number(id)) && Number(id) > 0;
  }

  /**
   * Valida si un objeto tiene todas las propiedades requeridas
   * @param {Object} obj - Objeto a validar
   * @param {Array} requiredProps - Lista de propiedades requeridas
   * @returns {boolean} - True si el objeto tiene todas las propiedades requeridas
   */
  validateRequiredProps(obj, requiredProps) {
    if (!obj || typeof obj !== 'object') return false;
    
    return requiredProps.every(prop => 
      Object.prototype.hasOwnProperty.call(obj, prop) && 
      obj[prop] !== null && 
      obj[prop] !== undefined
    );
  }

  /**
   * Realiza una solicitud GET autenticada
   * @param {string} endpoint - Endpoint de la API (sin /api)
   * @returns {Promise} - Respuesta de la API
   */
  async get(endpoint) {
    return this.fetchWithAuth(`${API_URL}${endpoint}`, {
      method: 'GET',
    });
  }

  /**
   * Realiza una solicitud POST autenticada
   * @param {string} endpoint - Endpoint de la API (sin /api)
   * @param {Object} data - Datos a enviar en el cuerpo de la solicitud
   * @returns {Promise} - Respuesta de la API
   */
  async post(endpoint, data) {
    return this.fetchWithAuth(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }

  /**
   * Realiza una solicitud PUT autenticada
   * @param {string} endpoint - Endpoint de la API (sin /api)
   * @param {Object} data - Datos a enviar en el cuerpo de la solicitud
   * @returns {Promise} - Respuesta de la API
   */
  async put(endpoint, data) {
    return this.fetchWithAuth(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }

  /**
   * Realiza una solicitud DELETE autenticada
   * @param {string} endpoint - Endpoint de la API (sin /api)
   * @returns {Promise} - Respuesta de la API
   */
  async delete(endpoint) {
    return this.fetchWithAuth(`${API_URL}${endpoint}`, {
      method: 'DELETE',
    });
  }

  /**
   * Método interno para realizar solicitudes con autenticación
   * @param {string} url - URL completa de la API
   * @param {Object} options - Opciones de fetch
   * @returns {Promise} - Respuesta procesada
   */
  async fetchWithAuth(url, options = {}) {
    try {
      // Obtener token JWT y agregarlo a los headers
      const token = authService.getToken();
      
      if (token) {
        options.headers = {
          ...options.headers,
          'Authorization': `Bearer ${token}`
        };
      }

      const response = await fetch(url, options);
      const data = await response.json();

      if (!response.ok) {
        // Si el error es de autenticación (401), limpiar datos de sesión
        if (response.status === 401) {
          authService.logout();
        }
        throw new Error(data.message || 'Ha ocurrido un error');
      }

      return data;
    } catch (error) {
      console.error('Error en HTTP service:', error);
      throw error;
    }
  }
}

export default new HttpService();