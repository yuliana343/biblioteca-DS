// services/utils/constants.js

// Roles de usuario
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  LIBRARIAN: 'LIBRARIAN',
  USER: 'USER'
};

// Estados de préstamo
export const LOAN_STATUS = {
  ACTIVE: 'ACTIVE',
  RETURNED: 'RETURNED',
  OVERDUE: 'OVERDUE',
  LOST: 'LOST'
};

// Estados de reserva
export const RESERVATION_STATUS = {
  PENDING: 'PENDING',
  ACTIVE: 'ACTIVE',
  CANCELLED: 'CANCELLED',
  EXPIRED: 'EXPIRED',
  COMPLETED: 'COMPLETED'
};

// Tipos de notificación
export const NOTIFICATION_TYPES = {
  LOAN_REMINDER: 'LOAN_REMINDER',
  RESERVATION_AVAILABLE: 'RESERVATION_AVAILABLE',
  OVERDUE: 'OVERDUE',
  SYSTEM: 'SYSTEM'
};

// Categorías de libros
export const BOOK_CATEGORIES = [
  { id: 1, name: 'Ficción', description: 'Libros de ficción y literatura' },
  { id: 2, name: 'No Ficción', description: 'Libros basados en hechos reales' },
  { id: 3, name: 'Ciencia', description: 'Libros científicos y técnicos' },
  { id: 4, name: 'Historia', description: 'Libros históricos' },
  { id: 5, name: 'Arte', description: 'Libros sobre arte y cultura' },
  { id: 6, name: 'Tecnología', description: 'Libros sobre tecnología e informática' },
  { id: 7, name: 'Negocios', description: 'Libros de negocios y emprendimiento' },
  { id: 8, name: 'Filosofía', description: 'Libros de filosofía y pensamiento' },
  { id: 9, name: 'Poesía', description: 'Libros de poesía' },
  { id: 10, name: 'Biografía', description: 'Biografías y autobiografías' }
];

// Idiomas
export const LANGUAGES = [
  { code: 'es', name: 'Español' },
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
  { code: 'pt', name: 'Português' }
];

// Configuración de préstamos
export const LOAN_CONFIG = {
  DEFAULT_LOAN_DAYS: 15,
  MAX_RENEWALS: 3,
  RENEWAL_DAYS: 15,
  FINE_PER_DAY: 5,
  MAX_ACTIVE_LOANS: 5,
  RESERVATION_EXPIRY_DAYS: 3
};

// Rutas de la aplicación
export const APP_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  CATALOG: '/catalog',
  MY_LOANS: '/my-loans',
  RESERVATIONS: '/reservations',
  PROFILE: '/profile',
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users',
  ADMIN_BOOKS: '/admin/books',
  ADMIN_LOANS: '/admin/loans',
  ADMIN_REPORTS: '/admin/reports',
  ADMIN_STATISTICS: '/admin/statistics',
  NOT_FOUND: '/404',
  UNAUTHORIZED: '/unauthorized'
};

// Colores para la aplicación
export const COLORS = {
  PRIMARY: '#3498db',
  SECONDARY: '#2c3e50',
  SUCCESS: '#27ae60',
  WARNING: '#f39c12',
  ERROR: '#e74c3c',
  INFO: '#9b59b6',
  LIGHT: '#f8f9fa',
  DARK: '#343a40'
};

// Tamaños de pantalla para responsive
export const BREAKPOINTS = {
  XS: 0,
  SM: 576,
  MD: 768,
  LG: 992,
  XL: 1200,
  XXL: 1400
};

// Formatos de fecha
export const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YYYY',
  DISPLAY_WITH_TIME: 'DD/MM/YYYY HH:mm',
  API: 'YYYY-MM-DD',
  API_WITH_TIME: 'YYYY-MM-DDTHH:mm:ss'
};

// Mensajes de error comunes
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Error de conexión. Verifica tu conexión a internet.',
  UNAUTHORIZED: 'No estás autorizado para realizar esta acción.',
  FORBIDDEN: 'No tienes permisos para acceder a este recurso.',
  NOT_FOUND: 'El recurso solicitado no fue encontrado.',
  SERVER_ERROR: 'Error interno del servidor. Por favor, intenta más tarde.',
  VALIDATION_ERROR: 'Por favor, corrige los errores en el formulario.',
  DUPLICATE_EMAIL: 'El email ya está registrado.',
  DUPLICATE_DNI: 'El DNI ya está registrado.',
  INVALID_CREDENTIALS: 'Email o contraseña incorrectos.',
  ACCOUNT_INACTIVE: 'Tu cuenta está desactivada. Contacta con el administrador.'
};

// Mensajes de éxito
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: '¡Bienvenido de vuelta!',
  REGISTER_SUCCESS: '¡Registro exitoso! Por favor, inicia sesión.',
  UPDATE_SUCCESS: 'Cambios guardados exitosamente.',
  DELETE_SUCCESS: 'Eliminado exitosamente.',
  LOAN_SUCCESS: 'Préstamo realizado exitosamente.',
  RETURN_SUCCESS: 'Libro devuelto exitosamente.',
  RENEW_SUCCESS: 'Préstamo renovado exitosamente.',
  RESERVATION_SUCCESS: 'Reserva creada exitosamente.',
  CANCEL_SUCCESS: 'Cancelado exitosamente.'
};

// Configuración de paginación
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 12,
  PAGE_SIZES: [10, 20, 50, 100],
  MAX_PAGES_TO_SHOW: 5
};

// Configuración de API
export const API_CONFIG = {
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000
};

// Configuración de localStorage
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
  CART: 'cart'
};

// Temas de la aplicación
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto'
};

export default {
  USER_ROLES,
  LOAN_STATUS,
  RESERVATION_STATUS,
  NOTIFICATION_TYPES,
  BOOK_CATEGORIES,
  LANGUAGES,
  LOAN_CONFIG,
  APP_ROUTES,
  COLORS,
  BREAKPOINTS,
  DATE_FORMATS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  PAGINATION_CONFIG,
  API_CONFIG,
  STORAGE_KEYS,
  THEMES
};