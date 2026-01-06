// services/utils/helpers.js
import { 
  DATE_FORMATS, 
  LOAN_CONFIG, 
  ERROR_MESSAGES,
  COLORS 
} from './constants';

/**
 * Formatea una fecha para mostrar
 * @param {string|Date} date - Fecha a formatear
 * @param {string} format - Formato a usar
 * @returns {string} Fecha formateada
 */
export const formatDate = (date, format = DATE_FORMATS.DISPLAY) => {
  if (!date) return 'N/A';
  
  const d = new Date(date);
  
  if (isNaN(d.getTime())) return 'Fecha inválida';
  
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  
  switch (format) {
    case DATE_FORMATS.API:
      return `${year}-${month}-${day}`;
    case DATE_FORMATS.API_WITH_TIME:
      return `${year}-${month}-${day}T${hours}:${minutes}:00`;
    case DATE_FORMATS.DISPLAY_WITH_TIME:
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    default: // DISPLAY
      return `${day}/${month}/${year}`;
  }
};

/**
 * Calcula la diferencia en días entre dos fechas
 * @param {string|Date} date1 - Primera fecha
 * @param {string|Date} date2 - Segunda fecha
 * @returns {number} Diferencia en días
 */
export const daysBetween = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2 - d1);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Calcula días restantes hasta una fecha
 * @param {string|Date} dueDate - Fecha de vencimiento
 * @returns {number} Días restantes (negativo si ya pasó)
 */
export const daysRemaining = (dueDate) => {
  const now = new Date();
  const due = new Date(dueDate);
  const diffTime = due - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Calcula la multa por días de retraso
 * @param {number} daysOverdue - Días de retraso
 * @returns {number} Monto de la multa
 */
export const calculateFine = (daysOverdue) => {
  if (daysOverdue <= 0) return 0;
  return daysOverdue * LOAN_CONFIG.FINE_PER_DAY;
};

/**
 * Valida un email
 * @param {string} email - Email a validar
 * @returns {boolean} True si el email es válido
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida un DNI/NIE español
 * @param {string} dni - DNI a validar
 * @returns {boolean} True si el DNI es válido
 */
export const isValidDNI = (dni) => {
  const dniRegex = /^[0-9]{8}[A-Z]$/i;
  const nieRegex = /^[XYZ][0-9]{7}[A-Z]$/i;
  
  if (!dniRegex.test(dni) && !nieRegex.test(dni)) {
    return false;
  }
  
  // Validación de letra para DNI
  if (dniRegex.test(dni)) {
    const letters = 'TRWAGMYFPDXBNJZSQVHLCKE';
    const number = parseInt(dni.substring(0, 8), 10);
    const letter = dni.charAt(8).toUpperCase();
    const expectedLetter = letters[number % 23];
    return letter === expectedLetter;
  }
  
  return true; // Para NIE, solo validamos formato básico
};

/**
 * Valida un número de teléfono
 * @param {string} phone - Teléfono a validar
 * @returns {boolean} True si el teléfono es válido
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^[+]?[0-9\s\-\(\)]{9,20}$/;
  return phoneRegex.test(phone);
};

/**
 * Formatea un número con separadores de miles
 * @param {number} number - Número a formatear
 * @returns {string} Número formateado
 */
export const formatNumber = (number) => {
  if (number === null || number === undefined) return '0';
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

/**
 * Formatea un precio con símbolo de moneda
 * @param {number} amount - Monto a formatear
 * @param {string} currency - Moneda (por defecto EUR)
 * @returns {string} Precio formateado
 */
export const formatPrice = (amount, currency = 'EUR') => {
  if (amount === null || amount === undefined) return '0,00 €';
  
  const formatter = new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  
  return formatter.format(amount);
};

/**
 * Trunca un texto a un máximo de caracteres
 * @param {string} text - Texto a truncar
 * @param {number} maxLength - Longitud máxima
 * @returns {string} Texto truncado
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Capitaliza la primera letra de cada palabra
 * @param {string} text - Texto a capitalizar
 * @returns {string} Texto capitalizado
 */
export const capitalize = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Genera un color basado en un texto (para avatares)
 * @param {string} text - Texto para generar color
 * @returns {string} Color hexadecimal
 */
export const getColorFromText = (text) => {
  if (!text) return COLORS.PRIMARY;
  
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const colors = [
    '#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6',
    '#1abc9c', '#d35400', '#c0392b', '#16a085', '#8e44ad'
  ];
  
  return colors[Math.abs(hash) % colors.length];
};

/**
 * Obtiene iniciales de un nombre
 * @param {string} name - Nombre completo
 * @returns {string} Iniciales (máx 2 letras)
 */
export const getInitials = (name) => {
  if (!name) return '?';
  
  const parts = name.split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

/**
 * Ordena un array de objetos por una propiedad
 * @param {Array} array - Array a ordenar
 * @param {string} property - Propiedad por la que ordenar
 * @param {boolean} ascending - Orden ascendente
 * @returns {Array} Array ordenado
 */
export const sortByProperty = (array, property, ascending = true) => {
  if (!array || !Array.isArray(array)) return [];
  
  return [...array].sort((a, b) => {
    const aValue = a[property];
    const bValue = b[property];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return ascending 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    if (aValue < bValue) return ascending ? -1 : 1;
    if (aValue > bValue) return ascending ? 1 : -1;
    return 0;
  });
};

/**
 * Filtra y ordena libros según criterios
 * @param {Array} books - Array de libros
 * @param {Object} filters - Filtros a aplicar
 * @param {string} sortBy - Campo por el que ordenar
 * @returns {Array} Libros filtrados y ordenados
 */
export const filterAndSortBooks = (books, filters = {}, sortBy = 'title') => {
  if (!books || !Array.isArray(books)) return [];
  
  let filtered = [...books];
  
  // Aplicar filtros
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filtered = filtered.filter(book => 
      (book.title && book.title.toLowerCase().includes(searchTerm)) ||
      (book.author && book.author.toLowerCase().includes(searchTerm)) ||
      (book.isbn && book.isbn.toLowerCase().includes(searchTerm))
    );
  }
  
  if (filters.category && filters.category !== 'all') {
    filtered = filtered.filter(book => book.category === filters.category);
  }
  
  if (filters.author && filters.author !== 'all') {
    filtered = filtered.filter(book => book.author === filters.author);
  }
  
  if (filters.availability === 'available') {
    filtered = filtered.filter(book => book.availableCopies > 0);
  } else if (filters.availability === 'unavailable') {
    filtered = filtered.filter(book => book.availableCopies === 0);
  }
  
  if (filters.yearRange) {
    filtered = filtered.filter(book => 
      book.year >= filters.yearRange.min && 
      book.year <= filters.yearRange.max
    );
  }
  
  // Aplicar ordenación
  filtered.sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'author':
        return a.author.localeCompare(b.author);
      case 'year':
        return b.year - a.year;
      case 'rating':
        return b.rating - a.rating;
      case 'popularity':
        // Combinar rating y número de préstamos
        const aScore = (a.rating || 0) * 100 + (a.loanCount || 0);
        const bScore = (b.rating || 0) * 100 + (b.loanCount || 0);
        return bScore - aScore;
      default:
        return 0;
    }
  });
  
  return filtered;
};

/**
 * Agrupa elementos por una propiedad
 * @param {Array} array - Array a agrupar
 * @param {string} property - Propiedad por la que agrupar
 * @returns {Object} Objeto con grupos
 */
export const groupBy = (array, property) => {
  if (!array || !Array.isArray(array)) return {};
  
  return array.reduce((groups, item) => {
    const key = item[property];
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {});
};

/**
 * Genera un ID único
 * @returns {string} ID único
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Descarga un archivo desde un blob
 * @param {Blob} blob - Blob del archivo
 * @param {string} filename - Nombre del archivo
 */
export const downloadFile = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

/**
 * Copia texto al portapapeles
 * @param {string} text - Texto a copiar
 * @returns {Promise<boolean>} True si se copió exitosamente
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Error al copiar al portapapeles:', err);
    
    // Fallback para navegadores antiguos
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (fallbackErr) {
      console.error('Error en fallback de copia:', fallbackErr);
      return false;
    }
  }
};

/**
 * Maneja errores de API de forma consistente
 * @param {Error} error - Error a manejar
 * @returns {string} Mensaje de error amigable
 */
export const handleApiError = (error) => {
  console.error('API Error:', error);
  
  if (error.response) {
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return data.message || ERROR_MESSAGES.VALIDATION_ERROR;
      case 401:
        return ERROR_MESSAGES.UNAUTHORIZED;
      case 403:
        return ERROR_MESSAGES.FORBIDDEN;
      case 404:
        return ERROR_MESSAGES.NOT_FOUND;
      case 409:
        return data.message || 'Conflicto de datos';
      case 422:
        return data.message || ERROR_MESSAGES.VALIDATION_ERROR;
      case 429:
        return 'Demasiadas solicitudes. Por favor, intenta más tarde.';
      case 500:
        return ERROR_MESSAGES.SERVER_ERROR;
      default:
        return data.message || `Error ${status}`;
    }
  } else if (error.request) {
    return ERROR_MESSAGES.NETWORK_ERROR;
  } else {
    return error.message || 'Error desconocido';
  }
};

/**
 * Debounce function
 * @param {Function} func - Función a ejecutar
 * @param {number} wait - Tiempo de espera en ms
 * @returns {Function} Función debounced
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function
 * @param {Function} func - Función a ejecutar
 * @param {number} limit - Límite de tiempo en ms
 * @returns {Function} Función throttled
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Valida un objeto según un schema
 * @param {Object} data - Datos a validar
 * @param {Object} schema - Schema de validación
 * @returns {Object} { isValid, errors }
 */
export const validateSchema = (data, schema) => {
  const errors = {};
  
  Object.keys(schema).forEach(key => {
    const fieldSchema = schema[key];
    const value = data[key];
    
    if (fieldSchema.required && (value === undefined || value === null || value === '')) {
      errors[key] = fieldSchema.message || 'Este campo es requerido';
      return;
    }
    
    if (value !== undefined && value !== null && value !== '') {
      if (fieldSchema.type && typeof value !== fieldSchema.type) {
        errors[key] = `Debe ser un ${fieldSchema.type}`;
      }
      
      if (fieldSchema.minLength && value.length < fieldSchema.minLength) {
        errors[key] = `Mínimo ${fieldSchema.minLength} caracteres`;
      }
      
      if (fieldSchema.maxLength && value.length > fieldSchema.maxLength) {
        errors[key] = `Máximo ${fieldSchema.maxLength} caracteres`;
      }
      
      if (fieldSchema.pattern && !fieldSchema.pattern.test(value)) {
        errors[key] = fieldSchema.message || 'Formato inválido';
      }
      
      if (fieldSchema.min !== undefined && value < fieldSchema.min) {
        errors[key] = `Mínimo ${fieldSchema.min}`;
      }
      
      if (fieldSchema.max !== undefined && value > fieldSchema.max) {
        errors[key] = `Máximo ${fieldSchema.max}`;
      }
      
      if (fieldSchema.validate) {
        const customError = fieldSchema.validate(value, data);
        if (customError) {
          errors[key] = customError;
        }
      }
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export default {
  formatDate,
  daysBetween,
  daysRemaining,
  calculateFine,
  isValidEmail,
  isValidDNI,
  isValidPhone,
  formatNumber,
  formatPrice,
  truncateText,
  capitalize,
  getColorFromText,
  getInitials,
  sortByProperty,
  filterAndSortBooks,
  groupBy,
  generateId,
  downloadFile,
  copyToClipboard,
  handleApiError,
  debounce,
  throttle,
  validateSchema
};