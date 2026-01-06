// services/api/authService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Configuración global de axios
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const authService = {
  // Login de usuario
  async login(email, password) {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Registro de usuario
  async register(userData) {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Cerrar sesión
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return Promise.resolve();
  },

  // Obtener usuario actual
  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Verificar si está autenticado
  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  // Obtener token
  getToken() {
    return localStorage.getItem('token');
  },

  // Actualizar perfil
  async updateProfile(userId, userData) {
    try {
      const response = await axios.put(`${API_URL}/users/${userId}`, userData);
      
      // Actualizar usuario en localStorage
      const currentUser = this.getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        const updatedUser = { ...currentUser, ...userData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Cambiar contraseña
  async changePassword(userId, passwordData) {
    try {
      const response = await axios.put(`${API_URL}/users/${userId}/password`, passwordData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Recuperar contraseña
  async forgotPassword(email) {
    try {
      const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Resetear contraseña
  async resetPassword(token, newPassword) {
    try {
      const response = await axios.post(`${API_URL}/auth/reset-password`, {
        token,
        newPassword
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Verificar token
  async verifyToken(token) {
    try {
      const response = await axios.get(`${API_URL}/auth/verify-token/${token}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Login con Google
  async googleLogin(credential) {
    try {
      const response = await axios.post(`${API_URL}/auth/google`, { credential });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Login con Microsoft
  async microsoftLogin(token) {
    try {
      const response = await axios.post(`${API_URL}/auth/microsoft`, { token });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Demo login (para desarrollo)
  async demoLogin(role = 'USER') {
    // Datos de demo para pruebas
    const demoUsers = {
      ADMIN: {
        id: 1,
        email: 'admin@demo.com',
        name: 'Administrador Demo',
        role: 'ADMIN',
        firstName: 'Admin',
        lastName: 'Demo',
        dni: '12345678A',
        phone: '+34 600 000 001',
        address: 'Calle Demo 123'
      },
      LIBRARIAN: {
        id: 2,
        email: 'librarian@demo.com',
        name: 'Bibliotecario Demo',
        role: 'LIBRARIAN',
        firstName: 'Bibliotecario',
        lastName: 'Demo',
        dni: '87654321B',
        phone: '+34 600 000 002',
        address: 'Calle Demo 456'
      },
      USER: {
        id: 3,
        email: 'user@demo.com',
        name: 'Usuario Demo',
        role: 'USER',
        firstName: 'Usuario',
        lastName: 'Demo',
        dni: '11223344C',
        phone: '+34 600 000 003',
        address: 'Calle Demo 789'
      }
    };

    const user = demoUsers[role];
    if (!user) throw new Error('Rol de demo no válido');

    const token = `demo-token-${role.toLowerCase()}-${Date.now()}`;
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    return {
      token,
      user,
      message: 'Login de demostración exitoso'
    };
  },

  // Manejo de errores
  handleError(error) {
    console.error('Auth Service Error:', error);
    
    if (error.response) {
      // Error del servidor
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          return new Error(data.message || 'Datos de entrada inválidos');
        case 401:
          return new Error('Credenciales inválidas o sesión expirada');
        case 403:
          return new Error('No tienes permisos para realizar esta acción');
        case 404:
          return new Error('Recurso no encontrado');
        case 409:
          return new Error('El usuario ya existe');
        case 422:
          return new Error('Error de validación: ' + (data.errors || 'Datos inválidos'));
        case 500:
          return new Error('Error interno del servidor');
        default:
          return new Error(data.message || 'Error desconocido');
      }
    } else if (error.request) {
      // Error de red
      return new Error('Error de conexión. Verifica tu conexión a internet.');
    } else {
      // Error en la configuración
      return new Error('Error en la configuración de la solicitud');
    }
  }
};

export default authService;