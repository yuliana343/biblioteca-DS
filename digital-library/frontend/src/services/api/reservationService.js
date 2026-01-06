// services/api/reservationService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const reservationService = {
  // Obtener todas las reservas
  async getReservations(page = 0, size = 20, filters = {}) {
    try {
      const params = {
        page,
        size,
        ...filters
      };
      
      const response = await axios.get(`${API_URL}/reservations`, { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Obtener reserva por ID
  async getReservationById(id) {
    try {
      const response = await axios.get(`${API_URL}/reservations/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Crear nueva reserva
  async createReservation(reservationData) {
    try {
      const response = await axios.post(`${API_URL}/reservations`, reservationData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Actualizar reserva
  async updateReservation(id, reservationData) {
    try {
      const response = await axios.put(`${API_URL}/reservations/${id}`, reservationData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Cancelar reserva
  async cancelReservation(id) {
    try {
      const response = await axios.post(`${API_URL}/reservations/${id}/cancel`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Completar reserva (cuando el libro está disponible)
  async completeReservation(id) {
    try {
      const response = await axios.post(`${API_URL}/reservations/${id}/complete`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Obtener reservas de un usuario
  async getUserReservations(userId, page = 0, size = 20, status = null) {
    try {
      const params = { page, size };
      if (status) params.status = status;
      
      const response = await axios.get(`${API_URL}/users/${userId}/reservations`, { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Obtener reservas activas de un usuario
  async getUserActiveReservations(userId) {
    try {
      const response = await axios.get(`${API_URL}/users/${userId}/reservations/active`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Obtener reservas por libro
  async getBookReservations(bookId, page = 0, size = 20) {
    try {
      const response = await axios.get(`${API_URL}/books/${bookId}/reservations`, {
        params: { page, size }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Obtener posición en la cola de reserva
  async getReservationPosition(reservationId) {
    try {
      const response = await axios.get(`${API_URL}/reservations/${reservationId}/position`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Notificar usuario cuando el libro está disponible
  async notifyReservationAvailable(reservationId) {
    try {
      const response = await axios.post(`${API_URL}/reservations/${reservationId}/notify`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Obtener reservas expiradas
  async getExpiredReservations(page = 0, size = 20) {
    try {
      const response = await axios.get(`${API_URL}/reservations/expired`, {
        params: { page, size }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Limpiar reservas expiradas
  async cleanupExpiredReservations() {
    try {
      const response = await axios.post(`${API_URL}/reservations/cleanup-expired`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Obtener estadísticas de reservas
  async getReservationStats() {
    try {
      const response = await axios.get(`${API_URL}/reservations/stats`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Verificar si un usuario puede reservar un libro
  async canUserReserveBook(userId, bookId) {
    try {
      const response = await axios.get(`${API_URL}/reservations/can-reserve`, {
        params: { userId, bookId }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Simulación de datos para desarrollo
  async getMockReservations(filters = {}, page = 0, size = 20) {
    const totalReservations = 45;
    const startIndex = page * size;
    const endIndex = startIndex + size;
    
    const mockReservations = Array.from({ length: Math.min(size, totalReservations - startIndex) }, (_, i) => {
      const index = startIndex + i + 1;
      const reservationDate = new Date();
      reservationDate.setDate(reservationDate.getDate() - (index % 15));
      
      const expiryDate = new Date(reservationDate);
      expiryDate.setDate(expiryDate.getDate() + 3);
      
      const statuses = ['PENDING', 'ACTIVE', 'CANCELLED', 'EXPIRED', 'COMPLETED'];
      const status = statuses[i % 5];
      
      return {
        id: index,
        bookId: index % 30 + 1,
        bookTitle: `Libro ${index % 30 + 1}: ${['Harry Potter', 'El código Da Vinci', 'Breve historia del tiempo'][i % 3]}`,
        bookAuthor: `Autor ${String.fromCharCode(65 + (i % 26))}. Autor`,
        userId: (index % 10) + 1,
        userName: `Usuario ${(index % 10) + 1}`,
        reservationDate: reservationDate.toISOString(),
        expiryDate: expiryDate.toISOString(),
        status,
        priority: index % 5 + 1,
        notifiedAt: status === 'ACTIVE' ? new Date().toISOString() : null,
        createdAt: reservationDate.toISOString(),
        updatedAt: new Date().toISOString()
      };
    });

    // Aplicar filtros
    let filteredReservations = mockReservations;
    if (filters.status && filters.status !== 'all') {
      filteredReservations = filteredReservations.filter(res => res.status === filters.status.toUpperCase());
    }
    if (filters.userId) {
      filteredReservations = filteredReservations.filter(res => res.userId === parseInt(filters.userId));
    }
    if (filters.bookId) {
      filteredReservations = filteredReservations.filter(res => res.bookId === parseInt(filters.bookId));
    }

    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      content: filteredReservations,
      page,
      size,
      totalElements: filteredReservations.length,
      totalPages: Math.ceil(filteredReservations.length / size),
      last: page >= Math.ceil(filteredReservations.length / size) - 1
    };
  },

  // Simular creación de reserva
  async mockCreateReservation(userId, bookId) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      id: Date.now(),
      userId,
      bookId,
      bookTitle: `Libro ${bookId}`,
      reservationDate: new Date().toISOString(),
      expiryDate: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString(),
      status: 'PENDING',
      priority: 1,
      message: 'Reserva creada exitosamente. Te notificaremos cuando el libro esté disponible.'
    };
  },

  // Simular cancelación de reserva
  async mockCancelReservation(reservationId) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      message: 'Reserva cancelada exitosamente'
    };
  },

  // Manejo de errores
  handleError(error) {
    console.error('Reservation Service Error:', error);
    
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          return new Error(data.message || 'Datos de reserva inválidos');
        case 404:
          return new Error('Reserva no encontrada');
        case 409:
          return new Error('Ya tienes una reserva activa para este libro');
        case 422:
          return new Error('Error de validación: ' + (data.errors || 'Datos inválidos'));
        case 429:
          return new Error('Límite de reservas alcanzado');
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

export default reservationService;