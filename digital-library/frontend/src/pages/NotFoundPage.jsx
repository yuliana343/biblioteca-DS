import React from 'react';
import { Link } from 'react-router-dom';
import './NotFoundPage.css';

const NotFoundPage = () => {
  return (
    <div className="not-found-page">
      <div className="not-found-container">
        <div className="error-code">
          <span className="code-number">4</span>
          <span className="code-icon">📚</span>
          <span className="code-number">4</span>
        </div>
        
        <div className="error-content">
          <h1 className="error-title">Página no encontrada</h1>
          <p className="error-description">
            Lo sentimos, la página que estás buscando no existe o ha sido movida.
            Mientras tanto, aquí tienes algunas opciones:
          </p>
          
          <div className="error-actions">
            <Link to="/" className="btn btn-primary">
              <span className="btn-icon">🏠</span>
              Ir al Inicio
            </Link>
            <Link to="/catalog" className="btn btn-outline">
              <span className="btn-icon">🔍</span>
              Explorar Catálogo
            </Link>
            <button 
              className="btn btn-outline"
              onClick={() => window.history.back()}
            >
              <span className="btn-icon">↩️</span>
              Volver atrás
            </button>
          </div>
          
          <div className="search-suggestions">
            <h3>¿Buscabas algo en específico?</h3>
            <div className="suggestion-links">
              <Link to="/catalog" className="suggestion-link">
                <span className="link-icon">📚</span>
                <span className="link-text">Catálogo de Libros</span>
              </Link>
              <Link to="/my-loans" className="suggestion-link">
                <span className="link-icon">📖</span>
                <span className="link-text">Mis Préstamos</span>
              </Link>
              <Link to="/profile" className="suggestion-link">
                <span className="link-icon">👤</span>
                <span className="link-text">Mi Perfil</span>
              </Link>
              <Link to="/help" className="suggestion-link">
                <span className="link-icon">❓</span>
                <span className="link-text">Ayuda</span>
              </Link>
            </div>
          </div>
          
          <div className="error-help">
            <h3>¿Necesitas ayuda?</h3>
            <div className="help-options">
              <div className="help-option">
                <div className="help-icon">📧</div>
                <div className="help-content">
                  <h4>Contactar Soporte</h4>
                  <p>soporte@biblioteca.edu</p>
                </div>
              </div>
              <div className="help-option">
                <div className="help-icon">📞</div>
                <div className="help-content">
                  <h4>Llamar a la Biblioteca</h4>
                  <p>+34 900 123 456</p>
                </div>
              </div>
              <div className="help-option">
                <div className="help-icon">💬</div>
                <div className="help-content">
                  <h4>Chat en Vivo</h4>
                  <p>Disponible 24/7</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="error-footer">
            <p className="footer-text">
              Si crees que esto es un error, por favor{' '}
              <Link to="/report-error" className="footer-link">
                reporta el problema
              </Link>
            </p>
          </div>
        </div>
      </div>
      
      {/* Floating Books Animation */}
      <div className="floating-books">
        <div className="book book-1">📕</div>
        <div className="book book-2">📗</div>
        <div className="book book-3">📘</div>
        <div className="book book-4">📙</div>
        <div className="book book-5">📔</div>
      </div>
    </div>
  );
};

export default NotFoundPage;