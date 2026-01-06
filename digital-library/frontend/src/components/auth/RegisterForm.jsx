import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../services/auth/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';
import { LoginForm, RegisterForm } from './components/auth';
import './Auth.css';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    dni: '',
    phone: '',
    acceptTerms: false
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.username.trim()) {
        newErrors.username = 'El nombre de usuario es requerido';
      } else if (formData.username.length < 3) {
        newErrors.username = 'Debe tener al menos 3 caracteres';
      }

      if (!formData.email.trim()) {
        newErrors.email = 'El email es requerido';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email inválido';
      }

      if (!formData.password) {
        newErrors.password = 'La contraseña es requerida';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Debe tener al menos 6 caracteres';
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
        newErrors.password = 'Debe incluir mayúsculas, minúsculas y números';
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Confirma tu contraseña';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
      }
    }

    if (step === 2) {
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'El nombre es requerido';
      }

      if (!formData.lastName.trim()) {
        newErrors.lastName = 'El apellido es requerido';
      }

      if (!formData.dni.trim()) {
        newErrors.dni = 'El DNI es requerido';
      } else if (!/^\d{8}[A-Za-z]?$/.test(formData.dni)) {
        newErrors.dni = 'DNI inválido (8 dígitos + letra opcional)';
      }
    }

    if (step === 3 && !formData.acceptTerms) {
      newErrors.acceptTerms = 'Debes aceptar los términos y condiciones';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) {
      return;
    }

    if (currentStep < totalSteps) {
      nextStep();
      return;
    }

    setIsLoading(true);

    try {
      const userData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        dni: formData.dni,
        phone: formData.phone || ''
      };

      await register(userData);
      navigate('/login', { 
        state: { message: 'Registro exitoso. Ahora puedes iniciar sesión.' }
      });
      
    } catch (error) {
      setErrors({
        submit: error.message || 'Error en el registro. Intenta nuevamente.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content">
            <h3 className="step-title">Información de Cuenta</h3>
            <p className="step-description">Crea tus credenciales de acceso</p>
            
            <div className="form-group">
              <label htmlFor="username" className="form-label">
                <span className="label-icon">👤</span>
                Nombre de Usuario *
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`form-input ${errors.username ? 'error' : ''}`}
                placeholder="ejemplo: juan.perez"
                disabled={isLoading}
              />
              {errors.username && (
                <span className="error-message">{errors.username}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                <span className="label-icon">📧</span>
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="ejemplo@email.com"
                disabled={isLoading}
              />
              {errors.email && (
                <span className="error-message">{errors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                <span className="label-icon">🔒</span>
                Contraseña *
              </label>
              <div className="password-input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  placeholder="Mínimo 6 caracteres"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {errors.password && (
                <span className="error-message">{errors.password}</span>
              )}
              <div className="password-strength">
                <div className={`strength-bar ${formData.password.length >= 6 ? 'active' : ''}`}></div>
                <div className={`strength-bar ${/(?=.*[a-z])/.test(formData.password) ? 'active' : ''}`}></div>
                <div className={`strength-bar ${/(?=.*[A-Z])/.test(formData.password) ? 'active' : ''}`}></div>
                <div className={`strength-bar ${/(?=.*\d)/.test(formData.password) ? 'active' : ''}`}></div>
              </div>
              <small className="password-hint">
                La contraseña debe incluir mayúsculas, minúsculas y números
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                <span className="label-icon">🔒</span>
                Confirmar Contraseña *
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                placeholder="Repite tu contraseña"
                disabled={isLoading}
              />
              {errors.confirmPassword && (
                <span className="error-message">{errors.confirmPassword}</span>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="step-content">
            <h3 className="step-title">Información Personal</h3>
            <p className="step-description">Completa tus datos personales</p>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName" className="form-label">
                  <span className="label-icon">👤</span>
                  Nombre *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`form-input ${errors.firstName ? 'error' : ''}`}
                  placeholder="Juan"
                  disabled={isLoading}
                />
                {errors.firstName && (
                  <span className="error-message">{errors.firstName}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="lastName" className="form-label">
                  <span className="label-icon">👤</span>
                  Apellido *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`form-input ${errors.lastName ? 'error' : ''}`}
                  placeholder="Pérez"
                  disabled={isLoading}
                />
                {errors.lastName && (
                  <span className="error-message">{errors.lastName}</span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="dni" className="form-label">
                <span className="label-icon">🆔</span>
                DNI / Identificación *
              </label>
              <input
                type="text"
                id="dni"
                name="dni"
                value={formData.dni}
                onChange={handleChange}
                className={`form-input ${errors.dni ? 'error' : ''}`}
                placeholder="12345678A"
                disabled={isLoading}
              />
              {errors.dni && (
                <span className="error-message">{errors.dni}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="phone" className="form-label">
                <span className="label-icon">📱</span>
                Teléfono (Opcional)
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="form-input"
                placeholder="+34 123 456 789"
                disabled={isLoading}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="step-content">
            <h3 className="step-title">Términos y Condiciones</h3>
            <p className="step-description">Revisa y acepta los términos</p>
            
            <div className="terms-container">
              <div className="terms-content">
                <h4>Política de Uso de la Biblioteca Digital</h4>
                <p>
                  1. Al registrarte, aceptas utilizar el sistema únicamente para fines educativos y de investigación.
                </p>
                <p>
                  2. Te comprometes a devolver los libros prestados en el plazo establecido.
                </p>
                <p>
                  3. Eres responsable de mantener la confidencialidad de tu cuenta y contraseña.
                </p>
                <p>
                  4. La biblioteca se reserva el derecho de suspender cuentas que violen las normas.
                </p>
                <p>
                  5. Tus datos personales serán protegidos de acuerdo con la ley de protección de datos.
                </p>
              </div>

              <label className="checkbox-label terms-checkbox">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                <span className="checkbox-custom"></span>
                <span className="terms-text">
                  He leído y acepto los{' '}
                  <Link to="/terms" className="terms-link">Términos y Condiciones</Link>{' '}
                  y la{' '}
                  <Link to="/privacy" className="terms-link">Política de Privacidad</Link>
                </span>
              </label>
              {errors.acceptTerms && (
                <span className="error-message">{errors.acceptTerms}</span>
              )}
            </div>

            <div className="registration-summary">
              <h4>Resumen de tu registro:</h4>
              <div className="summary-grid">
                <div className="summary-item">
                  <span className="summary-label">Usuario:</span>
                  <span className="summary-value">{formData.username}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Email:</span>
                  <span className="summary-value">{formData.email}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Nombre:</span>
                  <span className="summary-value">{formData.firstName} {formData.lastName}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">DNI:</span>
                  <span className="summary-value">{formData.dni}</span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card register-card">
        <div className="auth-header">
          <div className="auth-icon">
            📚
          </div>
          <h1 className="auth-title">Crear Cuenta</h1>
          <p className="auth-subtitle">
            Únete a nuestra biblioteca digital en {totalSteps} pasos
          </p>
        </div>

        {/* Progress Bar */}
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
          <div className="progress-steps">
            {[...Array(totalSteps)].map((_, index) => (
              <div 
                key={index} 
                className={`progress-step ${currentStep > index + 1 ? 'completed' : ''} ${currentStep === index + 1 ? 'active' : ''}`}
              >
                <span className="step-number">{index + 1}</span>
                <span className="step-label">
                  {index === 0 ? 'Cuenta' : index === 1 ? 'Personal' : 'Términos'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {errors.submit && (
          <div className="alert alert-error">
            <span className="alert-icon">⚠️</span>
            <span>{errors.submit}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {renderStep()}

          <div className="form-actions">
            {currentStep > 1 && (
              <button
                type="button"
                className="btn btn-outline"
                onClick={prevStep}
                disabled={isLoading}
              >
                ← Anterior
              </button>
            )}
            
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <LoadingSpinner size="small" color="light" />
              ) : currentStep < totalSteps ? (
                'Siguiente →'
              ) : (
                'Completar Registro'
              )}
            </button>
          </div>
        </form>

        <div className="auth-footer">
          <p className="auth-link-text">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="auth-link">
              Inicia sesión aquí
            </Link>
          </p>
          <p className="auth-link-text">
            ¿Problemas con el registro?{' '}
            <Link to="/contact" className="auth-link">
              Contacta al soporte
            </Link>
          </p>
        </div>

        <div className="auth-security">
          <p className="security-info">
            <span className="security-icon">🔒</span>
            Registro seguro - Tus datos están protegidos
          </p>
        </div>
      </div>

      <div className="auth-welcome">
        <div className="welcome-content">
          <h2 className="welcome-title">¡Únete a nuestra comunidad!</h2>
          <div className="welcome-features">
            <div className="feature-item">
              <span className="feature-icon">📖</span>
              <div className="feature-text">
                <h3>Acceso ilimitado</h3>
                <p>A miles de libros digitales y recursos educativos</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🔄</span>
              <div className="feature-text">
                <h3>Préstamos en línea</h3>
                <p>Reserva y renueva libros desde cualquier dispositivo</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🔔</span>
              <div className="feature-text">
                <h3>Notificaciones inteligentes</h3>
                <p>Recuerda fechas de entrega y nuevas disponibilidades</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">⭐</span>
              <div className="feature-text">
                <h3>Recomendaciones</h3>
                <p>Descubre libros basados en tus intereses de lectura</p>
              </div>
            </div>
          </div>
          
          <div className="benefits">
            <h3 className="benefits-title">Beneficios de registrarte:</h3>
            <ul className="benefits-list">
              <li>✅ Acceso gratuito a todo el catálogo</li>
              <li>✅ Hasta 5 préstamos simultáneos</li>
              <li>✅ Reserva de libros populares</li>
              <li>✅ Historial de lectura personalizado</li>
              <li>✅ Soporte técnico 24/7</li>
            </ul>
          </div>

          <div className="testimonial">
            <p className="testimonial-text">
              "La biblioteca digital ha transformado mi manera de estudiar. 
              Todo lo que necesito está a un clic de distancia."
            </p>
            <p className="testimonial-author">— María González, Estudiante</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;