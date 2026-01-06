import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../services/auth/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';
import { LoginForm, RegisterForm } from './components/auth';
import './Auth.css';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'El nombre de usuario es requerido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      await login(formData.username, formData.password, rememberMe);
      
      // Redirección basada en rol (se manejará en AuthContext)
      navigate('/dashboard');
      
    } catch (error) {
      setErrors({
        submit: error.message || 'Error al iniciar sesión. Verifica tus credenciales.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (role) => {
    const demoCredentials = {
      ADMIN: { username: 'admin', password: 'Admin123' },
      LIBRARIAN: { username: 'bibliotecario1', password: 'password123' },
      USER: { username: 'usuario1', password: 'password123' }
    };

    setFormData(demoCredentials[role]);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon">
            📚
          </div>
          <h1 className="auth-title">Iniciar Sesión</h1>
          <p className="auth-subtitle">
            Accede a tu cuenta de la biblioteca digital
          </p>
        </div>

        {errors.submit && (
          <div className="alert alert-error">
            <span className="alert-icon">⚠️</span>
            <span>{errors.submit}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              <span className="label-icon">👤</span>
              Nombre de Usuario o Email
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`form-input ${errors.username ? 'error' : ''}`}
              placeholder="Ingresa tu usuario o email"
              disabled={isLoading}
              autoComplete="username"
            />
            {errors.username && (
              <span className="error-message">{errors.username}</span>
            )}
          </div>

          <div className="form-group">
            <div className="form-label-row">
              <label htmlFor="password" className="form-label">
                <span className="label-icon">🔒</span>
                Contraseña
              </label>
              <Link to="/forgot-password" className="forgot-password">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <div className="password-input-group">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="Ingresa tu contraseña"
                disabled={isLoading}
                autoComplete="current-password"
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
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLoading}
              />
              <span className="checkbox-custom"></span>
              Recordarme
            </label>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-auth"
            disabled={isLoading}
          >
            {isLoading ? (
              <LoadingSpinner size="small" color="light" />
            ) : (
              'Iniciar Sesión'
            )}
          </button>

          <div className="auth-divider">
            <span>O inicia sesión como</span>
          </div>

          <div className="demo-buttons">
            <button
              type="button"
              className="btn btn-outline demo-btn"
              onClick={() => handleDemoLogin('ADMIN')}
              disabled={isLoading}
            >
              <span className="demo-icon">👑</span>
              Admin
            </button>
            <button
              type="button"
              className="btn btn-outline demo-btn"
              onClick={() => handleDemoLogin('LIBRARIAN')}
              disabled={isLoading}
            >
              <span className="demo-icon">📚</span>
              Bibliotecario
            </button>
            <button
              type="button"
              className="btn btn-outline demo-btn"
              onClick={() => handleDemoLogin('USER')}
              disabled={isLoading}
            >
              <span className="demo-icon">👤</span>
              Usuario
            </button>
          </div>
        </form>

        <div className="auth-footer">
          <p className="auth-link-text">
            ¿No tienes una cuenta?{' '}
            <Link to="/register" className="auth-link">
              Regístrate aquí
            </Link>
          </p>
          <p className="auth-link-text">
            ¿Problemas para acceder?{' '}
            <Link to="/contact" className="auth-link">
              Contacta al soporte
            </Link>
          </p>
        </div>

        <div className="auth-security">
          <p className="security-info">
            <span className="security-icon">🔒</span>
            Tu información está protegida con encriptación SSL
          </p>
        </div>
      </div>

      <div className="auth-welcome">
        <div className="welcome-content">
          <h2 className="welcome-title">¡Bienvenido de nuevo!</h2>
          <div className="welcome-features">
            <div className="feature-item">
              <span className="feature-icon">📖</span>
              <div className="feature-text">
                <h3>Accede al catálogo completo</h3>
                <p>Miles de libros digitales disponibles</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🔄</span>
              <div className="feature-text">
                <h3>Gestiona tus préstamos</h3>
                <p>Renueva y reserva libros fácilmente</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">⭐</span>
              <div className="feature-text">
                <h3>Recomendaciones personalizadas</h3>
                <p>Descubre libros basados en tus intereses</p>
              </div>
            </div>
          </div>
          <div className="stats">
            <div className="stat">
              <strong>1,234+</strong>
              <span>Libros disponibles</span>
            </div>
            <div className="stat">
              <strong>890+</strong>
              <span>Usuarios activos</span>
            </div>
            <div className="stat">
              <strong>99%</strong>
              <span>Satisfacción</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;