import axios from 'axios';

// Configuración base para Axios
const API_URL = 'http://localhost:3000/api';

// Crear una instancia de Axios con configuración predeterminada
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar errores de forma global
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Error en la petición API:', error);
    return Promise.reject(error);
  }
);

// Interceptor para añadir el token de autenticación si existe
apiClient.interceptors.request.use(
  (config) => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      } catch (e) {
        console.error('Error al parsear datos de usuario:', e);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;