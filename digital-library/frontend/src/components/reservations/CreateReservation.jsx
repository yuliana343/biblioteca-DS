import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../services/auth/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';
import './Reservations.css';

const CreateReservation = ({ 
  initialBook = null,
  onSearchBooks,
  onCheckAvailability,
  onCreateReservation,
  userReservations = [],
  maxReservations = 3
}) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    bookId: '',
    userId: user?.id || '',
    notes: '',
    priority: 1,
    autoRenew: false
  });
  
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedBook, setSelectedBook] = useState(initialBook);
  const [availability, setAvailability] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  
  // Validar si el usuario puede hacer más reservas
  const activeReservations = userReservations.filter(r => 
    r.status === 'PENDING' || r.status === 'ACTIVE'
  ).length;
  
  const canMakeReservation = activeReservations < maxReservations;

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/create-reservation' } });
    }
    
    if (initialBook) {
      setSelectedBook(initialBook);
      setFormData(prev => ({ ...prev, bookId: initialBook.id }));
      setStep(2);
      checkAvailability(initialBook.id);
    }
  }, [user, initialBook, navigate]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    setErrors({});
    
    try {
      const results = await onSearchBooks(searchTerm);
      setSearchResults(results);
    } catch (error) {
      setErrors({ search: error.message });
    } finally {
      setIsSearching(false);
    }
  };

  const checkAvailability = async (bookId) => {
    setIsChecking(true);
    setErrors({});
    
    try {
      const availabilityInfo = await onCheckAvailability(bookId);
      setAvailability(availabilityInfo);
    } catch (error) {
      setErrors({ availability: error.message });
    } finally {
      setIsChecking(false);
    }
  };

  const handleBookSelect = (book) => {
    setSelectedBook(book);
    setFormData(prev => ({ ...prev, bookId: book.id }));
    setSearchResults([]);
    setSearchTerm('');
    setStep(2);
    checkAvailability(book.id);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.bookId) {
      newErrors.bookId = 'Debes seleccionar un libro';
    }

    if (!formData.userId) {
      newErrors.userId = 'Usuario no identificado';
    }

    // Validar límite de reservas
    if (!canMakeReservation) {
      newErrors.limit = `Has alcanzado el límite de ${maxReservations} reservas activas`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});
    
    try {
      await onCreateReservation(formData);
      setSuccess('Reserva creada exitosamente');
      
      // Redirigir después de 2 segundos
      setTimeout(() => {
        navigate('/reservations');
      }, 2000);
      
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getQueuePosition = () => {
    if (!availability) return 1;
    return (availability.pendingReservations || 0) + 1;
  };

  const getEstimatedAvailability = () => {
    if (!availability) return 'No disponible';
    
    if (availability.availableCopies > 0) {
      return 'Disponible inmediatamente';
    }
    
    const avgLoanDays = 14; // Días promedio de préstamo
    const pendingLoans = availability.pendingLoans || 0;
    const estimatedDays = pendingLoans * avgLoanDays;
    
    if (estimatedDays <= 7) {
      return `Disponible en ~${estimatedDays} días`;
    } else if (estimatedDays <= 30) {
      return `Disponible en ~${Math.ceil(estimatedDays / 7)} semanas`;
    } else {
      return 'No disponible a corto plazo';
    }
  };

  const getExpiryDate = () => {
    const now = new Date();
    now.setHours(now.getHours() + 48); // 48 horas por defecto
    return now;
  };

  if (!user) {
    return (
      <div className="auth-required">
        <div className="auth-icon">🔒</div>
        <h3>Inicia sesión para reservar libros</h3>
        <p>Debes tener una cuenta activa para realizar reservas</p>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/login')}
        >
          Iniciar Sesión
        </button>
      </div>
    );
  }

  if (!canMakeReservation && !initialBook) {
    return (
      <div className="limit-reached">
        <div className="limit-icon">🚫</div>
        <h3>Límite de reservas alcanzado</h3>
        <p>
          Tienes {activeReservations} reservas activas de {maxReservations} permitidas.
          Cancela alguna reserva o espera a que se complete para hacer nuevas.
        </p>
        <button 
          className="btn btn-outline"
          onClick={() => navigate('/reservations')}
        >
          Ver mis reservas
        </button>
      </div>
    );
  }

  return (
    <div className="create-reservation">
      {/* Encabezado */}
      <div className="reservation-header">
        <h2>Crear Nueva Reserva</h2>
        <p className="subtitle">
          Reserva libros y sé notificado cuando estén disponibles
        </p>
        
        <div className="progress-steps">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>
            <span className="step-number">1</span>
            <span className="step-label">Buscar Libro</span>
          </div>
          <div className={`step-divider ${step >= 2 ? 'active' : ''}`}></div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>
            <span className="step-number">2</span>
            <span className="step-label">Verificar Disponibilidad</span>
          </div>
          <div className={`step-divider ${step >= 3 ? 'active' : ''}`}></div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}>
            <span className="step-number">3</span>
            <span className="step-label">Confirmar Reserva</span>
          </div>
        </div>
      </div>

      {/* Mensaje de éxito */}
      {success && (
        <div className="success-message">
          <div className="success-icon">✅</div>
          <div className="success-content">
            <h4>¡Reserva creada exitosamente!</h4>
            <p>{success}</p>
            <p>Redirigiendo a tus reservas...</p>
          </div>
        </div>
      )}

      {/* Paso 1: Buscar libro */}
      {step === 1 && (
        <div className="step-content">
          <div className="step-header">
            <h3>📚 Buscar Libro para Reservar</h3>
            <p>Encuentra el libro que deseas reservar</p>
          </div>

          <div className="search-section">
            <form onSubmit={handleSearch} className="search-form">
              <div className="search-input-group">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Busca por título, autor, ISBN..."
                  className="search-input-large"
                  disabled={isSearching}
                />
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSearching || !searchTerm.trim()}
                >
                  {isSearching ? (
                    <LoadingSpinner size="small" color="light" />
                  ) : (
                    '🔍 Buscar'
                  )}
                </button>
              </div>
            </form>

            {errors.search && (
              <div className="error-message">
                <span className="error-icon">❌</span>
                {errors.search}
              </div>
            )}

            {/* Resultados de búsqueda */}
            {searchResults.length > 0 ? (
              <div className="search-results">
                <h4>Resultados encontrados ({searchResults.length})</h4>
                <div className="results-grid">
                  {searchResults.map(book => (
                    <div 
                      key={book.id} 
                      className="book-result-card"
                      onClick={() => handleBookSelect(book)}
                    >
                      <div className="result-cover">
                        {book.coverImageUrl ? (
                          <img src={book.coverImageUrl} alt={book.title} />
                        ) : (
                          <div className="result-cover-placeholder">📖</div>
                        )}
                      </div>
                      <div className="result-info">
                        <h5>{book.title}</h5>
                        <p className="author">{book.authors?.[0]?.name || 'Autor desconocido'}</p>
                        <div className="result-meta">
                          <span className="meta-item">
                            <span className="meta-icon">📅</span>
                            {book.publicationYear || 'N/A'}
                          </span>
                          <span className="meta-item">
                            <span className="meta-icon">🏷️</span>
                            {book.categories?.[0]?.name || 'Sin categoría'}
                          </span>
                        </div>
                        <div className="availability-badge">
                          {book.availableCopies > 0 ? (
                            <span className="available">✅ {book.availableCopies} disponible(s)</span>
                          ) : (
                            <span className="unavailable">⏳ En lista de espera</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : searchTerm && !isSearching ? (
              <div className="no-results">
                <div className="no-results-icon">🔍</div>
                <p>No se encontraron libros con "{searchTerm}"</p>
                <button 
                  className="btn btn-outline"
                  onClick={() => setSearchTerm('')}
                >
                  Limpiar búsqueda
                </button>
              </div>
            ) : null}
          </div>

          {/* Información del usuario */}
          <div className="user-info-card">
            <h4>📋 Tu información de reservas</h4>
            <div className="user-stats">
              <div className="user-stat">
                <span className="stat-label">Reservas activas:</span>
                <span className={`stat-value ${activeReservations >= maxReservations ? 'limit' : ''}`}>
                  {activeReservations}/{maxReservations}
                </span>
              </div>
              <div className="user-stat">
                <span className="stat-label">Reservas canceladas:</span>
                <span className="stat-value">
                  {userReservations.filter(r => r.status === 'CANCELLED').length}
                </span>
              </div>
              <div className="user-stat">
                <span className="stat-label">Reservas completadas:</span>
                <span className="stat-value">
                  {userReservations.filter(r => r.status === 'EXPIRED' || r.status === 'COMPLETED').length}
                </span>
              </div>
            </div>
            
            {activeReservations >= maxReservations && (
              <div className="limit-warning">
                <span className="warning-icon">⚠️</span>
                Has alcanzado el límite de reservas. Cancela alguna para hacer nuevas.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Paso 2: Verificar disponibilidad */}
      {step === 2 && selectedBook && (
        <div className="step-content">
          <div className="step-header">
            <h3>✅ Verificar Disponibilidad</h3>
            <p>Revisa la disponibilidad del libro seleccionado</p>
            <button 
              className="btn btn-outline btn-sm"
              onClick={() => setStep(1)}
            >
              ← Cambiar libro
            </button>
          </div>

          <div className="book-details-card">
            <div className="book-header">
              <div className="book-cover-large">
                {selectedBook.coverImageUrl ? (
                  <img src={selectedBook.coverImageUrl} alt={selectedBook.title} />
                ) : (
                  <div className="book-cover-placeholder-large">📖</div>
                )}
              </div>
              <div className="book-info">
                <h4>{selectedBook.title}</h4>
                <p className="author">{selectedBook.authors?.[0]?.name || 'Autor desconocido'}</p>
                <div className="book-meta">
                  <span className="meta-item">
                    <strong>ISBN:</strong> {selectedBook.isbn || 'N/A'}
                  </span>
                  <span className="meta-item">
                    <strong>Categoría:</strong> {selectedBook.categories?.[0]?.name || 'N/A'}
                  </span>
                  <span className="meta-item">
                    <strong>Año:</strong> {selectedBook.publicationYear || 'N/A'}
                  </span>
                  <span className="meta-item">
                    <strong>Ubicación:</strong> {selectedBook.location || 'No especificada'}
                  </span>
                </div>
              </div>
            </div>

            {/* Disponibilidad */}
            <div className="availability-section">
              <h4>📊 Disponibilidad y Tiempos de Espera</h4>
              
              {isChecking ? (
                <div className="loading-availability">
                  <LoadingSpinner message="Verificando disponibilidad..." />
                </div>
              ) : availability ? (
                <div className="availability-grid">
                  <div className="availability-item">
                    <span className="item-label">Copias totales:</span>
                    <span className="item-value">{availability.totalCopies || 0}</span>
                  </div>
                  <div className="availability-item">
                    <span className="item-label">Disponibles ahora:</span>
                    <span className={`item-value ${availability.availableCopies > 0 ? 'available' : 'unavailable'}`}>
                      {availability.availableCopies || 0}
                    </span>
                  </div>
                  <div className="availability-item">
                    <span className="item-label">En préstamo:</span>
                    <span className="item-value">
                      {(availability.totalCopies || 0) - (availability.availableCopies || 0)}
                    </span>
                  </div>
                  <div className="availability-item">
                    <span className="item-label">Reservas pendientes:</span>
                    <span className="item-value">{availability.pendingReservations || 0}</span>
                  </div>
                  <div className="availability-item">
                    <span className="item-label">Tu posición en cola:</span>
                    <span className="item-value highlight">
                      #{getQueuePosition()}
                    </span>
                  </div>
                  <div className="availability-item">
                    <span className="item-label">Disponibilidad estimada:</span>
                    <span className="item-value">
                      {getEstimatedAvailability()}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="no-availability">
                  <p>No se pudo verificar la disponibilidad</p>
                </div>
              )}

              {errors.availability && (
                <div className="error-message">
                  <span className="error-icon">❌</span>
                  {errors.availability}
                </div>
              )}
            </div>

            {/* Información de la reserva */}
            <div className="reservation-info">
              <h4>📅 Información de la Reserva</h4>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Fecha de solicitud:</span>
                  <span className="info-value">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Fecha de expiración:</span>
                  <span className="info-value">
                    {getExpiryDate().toLocaleDateString()} (48 horas)
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Duración máxima:</span>
                  <span className="info-value">48 horas desde notificación</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Política de cancelación:</span>
                  <span className="info-value">Gratuita hasta 24 horas antes</span>
                </div>
              </div>
            </div>

            {/* Botón para continuar */}
            <div className="step-actions">
              <button
                className="btn btn-primary"
                onClick={() => setStep(3)}
                disabled={isChecking || errors.limit}
              >
                Continuar →
              </button>
              
              {errors.limit && (
                <div className="limit-error">
                  <span className="error-icon">🚫</span>
                  {errors.limit}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Paso 3: Confirmar reserva */}
      {step === 3 && selectedBook && (
        <div className="step-content">
          <div className="step-header">
            <h3>📝 Confirmar Reserva</h3>
            <p>Revisa y confirma los detalles de tu reserva</p>
            <button 
              className="btn btn-outline btn-sm"
              onClick={() => setStep(2)}
            >
              ← Volver a disponibilidad
            </button>
          </div>

          <form onSubmit={handleSubmit} className="reservation-form">
            {/* Resumen */}
            <div className="reservation-summary">
              <h4>📋 Resumen de la Reserva</h4>
              <div className="summary-grid">
                <div className="summary-item">
                  <span className="summary-label">Libro:</span>
                  <span className="summary-value">{selectedBook.title}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Autor:</span>
                  <span className="summary-value">{selectedBook.authors?.[0]?.name || 'N/A'}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Usuario:</span>
                  <span className="summary-value">
                    {user.firstName} {user.lastName}
                  </span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Posición en cola:</span>
                  <span className="summary-value highlight">#{getQueuePosition()}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Fecha de reserva:</span>
                  <span className="summary-value">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Fecha de expiración:</span>
                  <span className="summary-value">
                    {getExpiryDate().toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Opciones adicionales */}
            <div className="reservation-options">
              <h4>⚙️ Opciones Adicionales</h4>
              
              <div className="form-group">
                <label htmlFor="priority" className="form-label">
                  <span className="label-icon">🎯</span>
                  Prioridad de notificación
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="form-select"
                  disabled={isSubmitting}
                >
                  <option value="1">Alta (notificación inmediata)</option>
                  <option value="2">Media (notificación diaria)</option>
                  <option value="3">Baja (notificación semanal)</option>
                </select>
                <small className="form-hint">
                  Define cómo deseas ser notificado cuando el libro esté disponible
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="notes" className="form-label">
                  <span className="label-icon">📝</span>
                  Notas adicionales (opcional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="form-textarea"
                  rows="3"
                  placeholder="Ej: Necesito este libro para un proyecto, preferencia por edición en español..."
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-checkbox">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="autoRenew"
                    checked={formData.autoRenew}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                  <span className="checkbox-custom"></span>
                  <span className="checkbox-text">
                    Renovar automáticamente si no recojo el libro en 24 horas
                  </span>
                </label>
                <small className="checkbox-hint">
                  (Solo una renovación automática permitida)
                </small>
              </div>
            </div>

            {/* Términos y condiciones */}
            <div className="terms-section">
              <h4>📜 Términos y Condiciones</h4>
              <div className="terms-content">
                <p>
                  Al crear esta reserva, aceptas los siguientes términos:
                </p>
                <ul className="terms-list">
                  <li>✅ La reserva es válida por 48 horas desde la fecha de creación</li>
                  <li>✅ Deberás recoger el libro dentro de 24 horas tras la notificación de disponibilidad</li>
                  <li>⚠️ Las reservas no recogidas serán canceladas automáticamente</li>
                  <li>⚠️ 3 cancelaciones consecutivas pueden suspender tu capacidad de reserva por 30 días</li>
                  <li>📧 Serás notificado por email cuando el libro esté disponible</li>
                </ul>
              </div>

              <label className="terms-checkbox">
                <input
                  type="checkbox"
                  required
                  disabled={isSubmitting}
                />
                <span className="checkbox-custom"></span>
                <span className="terms-text">
                  He leído y acepto los{' '}
                  <a href="/terms/reservations" target="_blank" rel="noopener noreferrer">
                    términos y condiciones de reserva
                  </a>
                </span>
              </label>
            </div>

            {/* Mensajes de error */}
            {errors.submit && (
              <div className="error-message">
                <span className="error-icon">❌</span>
                {errors.submit}
              </div>
            )}

            {/* Botones de acción */}
            <div className="form-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setStep(2)}
                disabled={isSubmitting}
              >
                ← Atrás
              </button>
              
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <LoadingSpinner size="small" color="light" />
                    Creando reserva...
                  </>
                ) : (
                  <>
                    <span className="btn-icon">✅</span>
                    Confirmar Reserva
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Información de contacto */}
          <div className="contact-info">
            <h4>❓ ¿Necesitas ayuda?</h4>
            <p>
              Si tienes preguntas sobre tu reserva, contacta al equipo de la biblioteca:
            </p>
            <div className="contact-methods">
              <span className="contact-method">📧 reservas@biblioteca.edu</span>
              <span className="contact-method">📞 +1 234 567 890</span>
              <span className="contact-method">🏛️ Biblioteca Central, Piso 2</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateReservation;