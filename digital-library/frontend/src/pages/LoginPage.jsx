import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/auth/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './LoginPage.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setLoginError('');
    
    try {
      // Simulación de login
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockUser = {
        id: 1,
        email: formData.email,
        name: 'Usuario Demo',
        role: 'USER',
        token: 'mock-jwt-token'
      };
      
      login(mockUser);
      navigate('/dashboard');
      
    } catch (error) {
      setLoginError('Credenciales inválidas. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleForgotPassword = () => {
    alert('Funcionalidad de recuperación de contraseña en desarrollo');
  };

  const handleDemoLogin = (role) => {
    setFormData({
      email: `${role.toLowerCase()}@demo.com`,
      password: 'demo123',
      rememberMe: false
    });
    
    // Auto-submit after a delay
    setTimeout(() => {
      handleSubmit({ preventDefault: () => {} });
    }, 500);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Left Panel - Branding */}
        <div className="login-left">
          <div className="brand-section">
            <div className="brand-logo">
              <span className="logo-icon">📚</span>
              <span className="logo-text">Biblioteca Digital</span>
            </div>
            <h1 className="brand-title">Bienvenido de vuelta</h1>
            <p className="brand-subtitle">
              Accede a tu cuenta para gestionar préstamos, reservas y explorar nuestro catálogo
            </p>
          </div>
          
          <div className="features-list">
            <div className="feature-item">
              <span className="feature-icon">📖</span>
              <span className="feature-text">Accede a miles de libros</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">⏰</span>
              <span className="feature-text">Gestiona tus préstamos 24/7</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🔔</span>
              <span className="feature-text">Recibe notificaciones</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">⭐</span>
              <span className="feature-text">Sistema de recomendaciones</span>
            </div>
          </div>
          
          <div className="stats-section">
            <div className="stat">
              <span className="stat-number">10,000+</span>
              <span className="stat-label">Libros</span>
            </div>
            <div className="stat">
              <span className="stat-number">5,000+</span>
              <span className="stat-label">Usuarios</span>
            </div>
            <div className="stat">
              <span className="stat-number">99%</span>
              <span className="stat-label">Satisfacción</span>
            </div>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="login-right">
          <div className="login-form-container">
            <div className="form-header">
              <h2>Iniciar Sesión</h2>
              <p>Ingresa tus credenciales para continuar</p>
            </div>

            {loginError && (
              <div className="alert alert-error">
                <span className="alert-icon">⚠️</span>
                <span className="alert-text">{loginError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  placeholder="usuario@ejemplo.com"
                  disabled={loading}
                />
                {errors.email && (
                  <span className="error-message">{errors.email}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Contraseña
                </label>
                <div className="password-input-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`form-input ${errors.password ? 'error' : ''}`}
                    placeholder="••••••••"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? '🙈' : '👁️'}
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
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <span className="checkbox-text">Recordarme</span>
                </label>
                <button
                  type="button"
                  className="forgot-password"
                  onClick={handleForgotPassword}
                  disabled={loading}
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="small" color="light" />
                    Iniciando sesión...
                  </>
                ) : (
                  'Iniciar Sesión'
                )}
              </button>
            </form>

            {/* Demo Accounts */}
            <div className="demo-accounts">
              <p className="demo-label">Cuentas de demostración:</p>
              <div className="demo-buttons">
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => handleDemoLogin('USER')}
                  disabled={loading}
                >
                  👤 Usuario
                </button>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => handleDemoLogin('LIBRARIAN')}
                  disabled={loading}
                >
                  📚 Bibliotecario
                </button>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => handleDemoLogin('ADMIN')}
                  disabled={loading}
                >
                  👑 Administrador
                </button>
              </div>
            </div>

            {/* Social Login */}
            <div className="social-login">
              <div className="divider">
                <span className="divider-text">o continuar con</span>
              </div>
              <div className="social-buttons">
                <button
                  type="button"
                  className="btn btn-outline btn-social"
                  disabled={loading}
                >
                  <span className="social-icon">🔵</span>
                  <span className="social-text">Google</span>
                </button>
                <button
                  type="button"
                  className="btn btn-outline btn-social"
                  disabled={loading}
                >
                  <span className="social-icon">🔵</span>
                  <span className="social-text">Microsoft</span>
                </button>
              </div>
            </div>

            {/* Register Link */}
            <div className="register-section">
              <p className="register-text">
                ¿No tienes una cuenta?{' '}
                <Link to="/register" className="register-link">
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="login-footer">
            <p className="footer-text">
              © 2024 Biblioteca Digital. Todos los derechos reservados.
            </p>
            <div className="footer-links">
              <Link to="/privacy" className="footer-link">
                Privacidad
              </Link>
              <Link to="/terms" className="footer-link">
                Términos
              </Link>
              <Link to="/help" className="footer-link">
                Ayuda
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;