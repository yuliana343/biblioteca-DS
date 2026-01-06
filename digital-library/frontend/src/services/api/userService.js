// services/api/userService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const userService = {
  // Obtener todos los usuarios
  async getUsers(page = 0, size = 20, filters = {}) {
    try {
      const params = {
        page,
        size,
        ...filters
      };
      
      const response = await axios.get(`${API_URL}/users`, { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Obtener usuario por ID
  async getUserById(id) {
    try {
      const response = await axios.get(`${API_URL}/users/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Crear nuevo usuario (admin)
  async createUser(userData) {
    try {
      const response = await axios.post(`${API_URL}/users`, userData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Actualizar usuario
  async updateUser(id, userData) {
    try {
      const response = await axios.put(`${API_URL}/users/${id}`, userData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Eliminar usuario
  async deleteUser(id) {
    try {
      const response = await axios.delete(`${API_URL}/users/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Activar/Desactivar usuario
  async toggleUserStatus(id, active) {
    try {
      const response = await axios.patch(`${API_URL}/users/${id}/status`, { active });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Cambiar rol de usuario
  async changeUserRole(id, role) {
    try {
      const response = await axios.patch(`${API_URL}/users/${id}/role`, { role });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Obtener estadísticas de usuarios
  async getUserStats() {
    try {
      const response = await axios.get(`${API_URL}/users/stats`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Buscar usuarios
  async searchUsers(query, page = 0, size = 20) {
    try {
      const response = await axios.get(`${API_URL}/users/search`, {
        params: { query, page, size }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Obtener usuarios activos
  async getActiveUsers(page = 0, size = 20) {
    try {
      const response = await axios.get(`${API_URL}/users/active`, {
        params: { page, size }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Obtener usuarios inactivos
  async getInactiveUsers(page = 0, size = 20) {
    try {
      const response = await axios.get(`${API_URL}/users/inactive`, {
        params: { page, size }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Obtener usuarios por rol
  async getUsersByRole(role, page = 0, size = 20) {
    try {
      const response = await axios.get(`${API_URL}/users/role/${role}`, {
        params: { page, size }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Obtener actividad de usuario
  async getUserActivity(userId, page = 0, size = 20) {
    try {
      const response = await axios.get(`${API_URL}/users/${userId}/activity`, {
        params: { page, size }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Obtener estadísticas de usuario
  async getUserStatistics(userId) {
    try {
      const response = await axios.get(`${API_URL}/users/${userId}/statistics`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Exportar usuarios a CSV/Excel
  async exportUsers(format = 'csv', filters = {}) {
    try {
      const response = await axios.get(`${API_URL}/users/export`, {
        params: { format, ...filters },
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Enviar notificación a usuarios
  async sendNotificationToUsers(userIds, notificationData) {
    try {
      const response = await axios.post(`${API_URL}/users/notify`, {
        userIds,
        ...notificationData
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Resetear contraseña (admin)
  async resetUserPassword(id) {
    try {
      const response = await axios.post(`${API_URL}/users/${id}/reset-password`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Verificar DNI único
  async checkDniUnique(dni) {
    try {
      const response = await axios.get(`${API_URL}/users/check-dni/${dni}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Verificar email único
  async checkEmailUnique(email) {
    try {
      const response = await axios.get(`${API_URL}/users/check-email/${email}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Simulación de datos para desarrollo
  async getMockUsers(filters = {}, page = 0, size = 20) {
    const totalUsers = 156;
    const startIndex = page * size;
    const endIndex = startIndex + size;
    
    const mockUsers = Array.from({ length: Math.min(size, totalUsers - startIndex) }, (_, i) => {
      const index = startIndex + i + 1;
      const roles = ['ADMIN', 'LIBRARIAN', 'USER'];
      const role = index === 1 ? 'ADMIN' : index <= 5 ? 'LIBRARIAN' : 'USER';
      
      const registrationDate = new Date();
      registrationDate.setMonth(registrationDate.getMonth() - (index % 12));
      
      return {
        id: index,
        username: `user${index}`,
        email: `user${index}@email.com`,
        firstName: ['Juan', 'María', 'Carlos', 'Ana', 'Pedro', 'Laura'][i % 6],
        lastName: ['Pérez', 'García', 'López', 'Martínez', 'González', 'Rodríguez'][i % 6],
        dni: `1234567${String(index).padStart(2, '0')}A`,
        phone: `+34 600 ${String(index).padStart(6, '0')}`,
        address: `Calle ${['Principal', 'Secundaria', 'Mayor', 'Menor'][i % 4]} ${index}`,
        role,
        active: i % 10 !== 0, // 10% inactivos
        registrationDate: registrationDate.toISOString(),
        lastLogin: i % 3 === 0 ? new Date().toISOString() : null,
        totalLoans: Math.floor(Math.random() * 50),
        activeLoans: Math.floor(Math.random() * 5),
        overdueLoans: i % 15 === 0 ? 1 : 0,
        totalFines: i % 20 === 0 ? (Math.random() * 50).toFixed(2) : '0.00',
        createdAt: registrationDate.toISOString(),
        updatedAt: new Date().toISOString()
      };
    });

    // Aplicar filtros
    let filteredUsers = mockUsers;
    if (filters.role && filters.role !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.role === filters.role);
    }
    if (filters.status === 'active') {
      filteredUsers = filteredUsers.filter(user => user.active);
    } else if (filters.status === 'inactive') {
      filteredUsers = filteredUsers.filter(user => !user.active);
    }
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredUsers = filteredUsers.filter(user => 
        user.firstName.toLowerCase().includes(searchTerm) ||
        user.lastName.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        user.username.toLowerCase().includes(searchTerm) ||
        user.dni.toLowerCase().includes(searchTerm)
      );
    }

    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      content: filteredUsers,
      page,
      size,
      totalElements: filteredUsers.length,
      totalPages: Math.ceil(filteredUsers.length / size),
      last: page >= Math.ceil(filteredUsers.length / size) - 1
    };
  },

  // Simular estadísticas
  async getMockUserStats() {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      totalUsers: 156,
      activeUsers: 140,
      inactiveUsers: 16,
      admins: 1,
      librarians: 4,
      regularUsers: 151,
      newUsersThisMonth: 12,
      avgLoansPerUser: 8.5,
      usersWithOverdueLoans: 15,
      usersWithFines: 8
    };
  },

  // Manejo de errores
  handleError(error) {
    console.error('User Service Error:', error);
    
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          return new Error(data.message || 'Datos de usuario inválidos');
        case 404:
          return new Error('Usuario no encontrado');
        case 409:
          if (data.message?.includes('email')) {
            return new Error('El email ya está registrado');
          } else if (data.message?.includes('dni')) {
            return new Error('El DNI ya está registrado');
          } else if (data.message?.includes('username')) {
            return new Error('El nombre de usuario ya existe');
          }
          return new Error('El usuario ya existe');
        case 422:
          return new Error('Error de validación: ' + (data.errors || 'Datos inválidos'));
        case 403:
          return new Error('No tienes permisos para realizar esta acción');
        case 500:
          return new Error('Error interno del servidor');
        default:
          return new Error(data.message || 'Error desconocido');
      }
    } else if (error.request) {
      return new Error('Error de conexión. Verifica tu conexión a internet.');
    } else {
      return new Error('Error en la configuración de la solicitud');
    }
  }
};

export default userService;