// services/api/bookService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const bookService = {
  // Obtener todos los libros con paginación
  async getBooks(page = 0, size = 20, filters = {}) {
    try {
      const params = {
        page,
        size,
        ...filters
      };
      
      const response = await axios.get(`${API_URL}/books`, { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Buscar libros
  async searchBooks(query, page = 0, size = 20) {
    try {
      const response = await axios.get(`${API_URL}/books/search`, {
        params: { query, page, size }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Obtener libro por ID
  async getBookById(id) {
    try {
      const response = await axios.get(`${API_URL}/books/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Obtener libro por ISBN
  async getBookByIsbn(isbn) {
    try {
      const response = await axios.get(`${API_URL}/books/isbn/${isbn}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Crear nuevo libro
  async createBook(bookData) {
    try {
      const response = await axios.post(`${API_URL}/books`, bookData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Actualizar libro
  async updateBook(id, bookData) {
    try {
      const response = await axios.put(`${API_URL}/books/${id}`, bookData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Eliminar libro
  async deleteBook(id) {
    try {
      const response = await axios.delete(`${API_URL}/books/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Obtener libros por categoría
  async getBooksByCategory(categoryId, page = 0, size = 20) {
    try {
      const response = await axios.get(`${API_URL}/books/category/${categoryId}`, {
        params: { page, size }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Obtener libros por autor
  async getBooksByAuthor(authorId, page = 0, size = 20) {
    try {
      const response = await axios.get(`${API_URL}/books/author/${authorId}`, {
        params: { page, size }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Obtener libros más populares
  async getPopularBooks(limit = 10) {
    try {
      const response = await axios.get(`${API_URL}/books/popular`, {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Obtener libros recientes
  async getRecentBooks(limit = 10) {
    try {
      const response = await axios.get(`${API_URL}/books/recent`, {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Obtener libros disponibles
  async getAvailableBooks(page = 0, size = 20) {
    try {
      const response = await axios.get(`${API_URL}/books/available`, {
        params: { page, size }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Obtener estadísticas de libros
  async getBookStats() {
    try {
      const response = await axios.get(`${API_URL}/books/stats`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Subir portada de libro
  async uploadBookCover(bookId, imageFile) {
    try {
      const formData = new FormData();
      formData.append('file', imageFile);
      
      const response = await axios.post(`${API_URL}/books/${bookId}/cover`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Actualizar copias disponibles
  async updateAvailableCopies(bookId, copies) {
    try {
      const response = await axios.patch(`${API_URL}/books/${bookId}/copies`, {
        availableCopies: copies
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Simulación de datos para desarrollo
  async getMockBooks(filters = {}, page = 0, size = 20) {
    // Generar datos de prueba
    const totalBooks = 156;
    const startIndex = page * size;
    const endIndex = startIndex + size;
    
    const mockBooks = Array.from({ length: Math.min(size, totalBooks - startIndex) }, (_, i) => {
      const index = startIndex + i + 1;
      return {
        id: index,
        title: `Libro ${index}: ${['El Gran Libro', 'Historia de', 'Ciencia Avanzada', 'Arte Moderno'][i % 4]}`,
        author: `Autor ${String.fromCharCode(65 + (i % 26))}. Autor`,
        isbn: `978-3-16-148410-${String(index).padStart(3, '0')}`,
        cover: `https://picsum.photos/200/300?random=${index}`,
        description: 'Descripción del libro con información relevante sobre su contenido y autoría.',
        category: ['Ficción', 'Ciencia', 'Historia', 'Arte', 'Tecnología'][i % 5],
        year: 2000 + (i % 24),
        pages: 300 + (i * 10),
        rating: 3.5 + (Math.random() * 1.5),
        availableCopies: i % 5,
        totalCopies: 5,
        publisher: ['Editorial A', 'Editorial B', 'Editorial C'][i % 3],
        language: ['Español', 'Inglés', 'Francés'][i % 3],
        createdAt: new Date(2023, i % 12, (i % 28) + 1).toISOString(),
        updatedAt: new Date(2023, i % 12, (i % 28) + 1).toISOString()
      };
    });

    // Aplicar filtros
    let filteredBooks = mockBooks;
    if (filters.category && filters.category !== 'all') {
      filteredBooks = filteredBooks.filter(book => book.category === filters.category);
    }
    if (filters.availability === 'available') {
      filteredBooks = filteredBooks.filter(book => book.availableCopies > 0);
    } else if (filters.availability === 'unavailable') {
      filteredBooks = filteredBooks.filter(book => book.availableCopies === 0);
    }
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredBooks = filteredBooks.filter(book => 
        book.title.toLowerCase().includes(searchTerm) ||
        book.author.toLowerCase().includes(searchTerm) ||
        book.description.toLowerCase().includes(searchTerm)
      );
    }

    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      content: filteredBooks,
      page,
      size,
      totalElements: filteredBooks.length,
      totalPages: Math.ceil(filteredBooks.length / size),
      last: page >= Math.ceil(filteredBooks.length / size) - 1
    };
  },

  // Manejo de errores
  handleError(error) {
    console.error('Book Service Error:', error);
    
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          return new Error(data.message || 'Datos de libro inválidos');
        case 404:
          return new Error('Libro no encontrado');
        case 409:
          return new Error('El libro con este ISBN ya existe');
        case 422:
          return new Error('Error de validación: ' + (data.errors || 'Datos inválidos'));
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

export default bookService;