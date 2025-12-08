import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3004';

console.log('API_BASE_URL configurada:', API_BASE_URL);

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
  withCredentials: true,
});

// Interceptor para agregar token JWT a todas las peticiones
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ Token agregado a request:', config.method.toUpperCase(), config.url);
      console.log('   Token (primeros 30 chars):', token.substring(0, 30) + '...');
    } else {
      console.warn('⚠️ No hay token en localStorage para:', config.method.toUpperCase(), config.url);
    }
    return config;
  },
  (error) => {
    console.error('❌ Error en request interceptor:', error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('apiClient interceptor - Error response:', {
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url
    });

    if (error.response?.status === 401) {
      // Solo redirigir al login si el servidor indica que requiere login
      const requiresLogin = error.response?.data?.requiresLogin === true;
      const hasToken = !!localStorage.getItem('token');
      
      if (requiresLogin || !hasToken) {
        console.warn('Token inválido o expirado, redirigiendo al login...');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;