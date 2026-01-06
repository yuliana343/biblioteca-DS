// services/api/loanService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const loanService = {
  // Obtener todos los préstamos
  async getLoans(page = 0, size = 20, filters = {}) {
    try {
      const params = {
        page,
        size,
        ...filters
      };
      
      const response = await axios.get(`${API_URL}/loans`, { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Obtener préstamo por ID
  async getLoanById(id) {
    try {
      const response = await axios.get(`${API_URL}/loans/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Crear nuevo préstamo
  async createLoan(loanData) {
    try {
      const response = await axios.post(`${API_URL}/loans`, loanData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Actualizar préstamo
  async updateLoan(id, loanData) {
    try {
      const response = await axios.put(`${API_URL}/loans/${id}`, loanData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Eliminar préstamo
  async deleteLoan(id) {
    try {
      const response = await axios.delete(`${API_URL}/loans/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Obtener préstamos de un usuario
  async getUserLoans(userId, page = 0, size = 20, status = null) {
    try {
      const params = { page, size };
      if (status) params.status = status;
      
      const response = await axios.get(`${API_URL}/users/${userId}/loans`, { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Obtener préstamos activos de un usuario
  async getUserActiveLoans(userId) {
    try {
      const response = await axios.get(`${API_URL}/users/${userId}/loans/active`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Obtener préstamos vencidos
  async getOverdueLoans(page = 0, size = 20) {
    try {
      const response = await axios.get(`${API_URL}/loans/overdue`, {
        params: { page, size }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Renovar préstamo
  async renewLoan(loanId) {
    try {
      const response = await axios.post(`${API_URL}/loans/${loanId}/renew`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Devolver libro
  async returnLoan(loanId, condition = 'GOOD') {
    try {
      const response = await axios.post(`${API_URL}/loans/${loanId}/return`, { condition });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Obtener estadísticas de préstamos
  async getLoanStats() {
    try {
      const response = await axios.get(`${API_URL}/loans/stats`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Obtener histórico de préstamos
  async getLoanHistory(userId, page = 0, size = 20) {
    try {
      const response = await axios.get(`${API_URL}/users/${userId}/loan-history`, {
        params: { page, size }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Calcular multa
  async calculateFine(loanId) {
    try {
      const response = await axios.get(`${API_URL}/loans/${loanId}/fine`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Pagar multa
  async payFine(loanId, amount) {
    try {
      const response = await axios.post(`${API_URL}/loans/${loanId}/pay-fine`, { amount });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Obtener préstamos por libro
  async getBookLoans(bookId, page = 0, size = 20) {
    try {
      const response = await axios.get(`${API_URL}/books/${bookId}/loans`, {
        params: { page, size }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Exportar préstamos a CSV/Excel
  async exportLoans(format = 'csv', filters = {}) {
    try {
      const response = await axios.get(`${API_URL}/loans/export`, {
        params: { format, ...filters },
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Simulación de datos para desarrollo
  async getMockLoans(filters = {}, page = 0, size = 20) {
    const totalLoans = 85;
    const startIndex = page * size;
    const endIndex = startIndex + size;
    
    const mockLoans = Array.from({ length: Math.min(size, totalLoans - startIndex) }, (_, i) => {
      const index = startIndex + i + 1;
      const loanDate = new Date();
      loanDate.setDate(loanDate.getDate() - (index % 30));
      
      const dueDate = new Date(loanDate);
      dueDate.setDate(dueDate.getDate() + 15);
      
      const returnDate = index % 3 === 0 ? new Date(dueDate) : null;
      const status = returnDate ? 'RETURNED' : (dueDate < new Date() ? 'OVERDUE' : 'ACTIVE');
      
      return {
        id: index,
        bookId: index % 50 + 1,
        bookTitle: `Libro ${index % 50 + 1}: ${['Cien años de soledad', 'El principito', '1984'][i % 3]}`,
        bookAuthor: `Autor ${String.fromCharCode(65 + (i % 26))}. Autor`,
        userId: (index % 10) + 1,
        userName: `Usuario ${(index % 10) + 1}`,
        loanDate: loanDate.toISOString(),
        dueDate: dueDate.toISOString(),
        returnDate: returnDate?.toISOString() || null,
        status,
        renewals: index % 4,
        fineAmount: status === 'OVERDUE' ? ((index % 10) * 5).toFixed(2) : '0.00',
        notes: index % 6 === 0 ? 'Renovado una vez' : '',
        createdAt: loanDate.toISOString(),
        updatedAt: new Date().toISOString()
      };
    });

    // Aplicar filtros
    let filteredLoans = mockLoans;
    if (filters.status && filters.status !== 'all') {
      filteredLoans = filteredLoans.filter(loan => loan.status === filters.status.toUpperCase());
    }
    if (filters.userId) {
      filteredLoans = filteredLoans.filter(loan => loan.userId === parseInt(filters.userId));
    }
    if (filters.bookId) {
      filteredLoans = filteredLoans.filter(loan => loan.bookId === parseInt(filters.bookId));
    }

    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      content: filteredLoans,
      page,
      size,
      totalElements: filteredLoans.length,
      totalPages: Math.ceil(filteredLoans.length / size),
      last: page >= Math.ceil(filteredLoans.length / size) - 1
    };
  },

  // Simular renovación
  async mockRenewLoan(loanId) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      message: 'Préstamo renovado exitosamente',
      newDueDate: new Date(new Date().setDate(new Date().getDate() + 15)).toISOString(),
      remainingRenewals: 2
    };
  },

  // Simular devolución
  async mockReturnLoan(loanId) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      message: 'Libro devuelto exitosamente',
      returnDate: new Date().toISOString(),
      fine: '0.00'
    };
  },

  // Manejo de errores
  handleError(error) {
    console.error('Loan Service Error:', error);
    
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          return new Error(data.message || 'Datos de préstamo inválidos');
        case 404:
          return new Error('Préstamo no encontrado');
        case 409:
          return new Error('El libro no está disponible para préstamo');
        case 422:
          return new Error('Error de validación: ' + (data.errors || 'Datos inválidos'));
        case 429:
          return new Error('Límite de préstamos alcanzado');
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

export default loanService;