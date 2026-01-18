
import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3 className="footer-title">📚 Biblioteca Digital</h3>
          <p className="footer-description">
            Sistema de gestión de bibliotecas para instituciones educativas
          </p>
          <p className="footer-version">Versión 1.0.0</p>
        </div>

        <div className="footer-section">
          <h4 className="footer-section-title">Enlaces Rápidos</h4>
          <ul className="footer-links">
            <li>
              <Link to="/catalog" className="footer-link">
                Catálogo de Libros
              </Link>
            </li>
            <li>
              <Link to="/loans" className="footer-link">
                Préstamos
              </Link>
            </li>
            <li>
              <Link to="/reservations" className="footer-link">
                Reservas
              </Link>
            </li>
            <li>
              <Link to="/help" className="footer-link">
                Ayuda
              </Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-section-title">Recursos</h4>
          <ul className="footer-links">
            <li>
              <Link to="/policy" className="footer-link">
                Política de Privacidad
              </Link>
            </li>
            <li>
              <Link to="/terms" className="footer-link">
                Términos de Uso
              </Link>
            </li>
            <li>
              <Link to="/faq" className="footer-link">
                Preguntas Frecuentes
              </Link>
            </li>
            <li>
              <Link to="/about" className="footer-link">
                Acerca de
              </Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-section-title">Contacto</h4>
          <ul className="footer-contact">
            <li className="contact-item">
              <span className="contact-icon">📧</span>
              <span>soporte@biblioteca.edu</span>
            </li>
            <li className="contact-item">
              <span className="contact-icon">📞</span>
              <span>(123) 456-7890</span>
            </li>
            <li className="contact-item">
              <span className="contact-icon">🏛️</span>
              <span>Universidad Digital, Ciudad</span>
            </li>
            <li className="contact-item">
              <span className="contact-icon">⏰</span>
              <span>Horario: 8:00 AM - 6:00 PM</span>
            </li>
          </ul>
          
          <div className="social-links">
            <a href="#" className="social-icon" aria-label="Facebook">
              📘
            </a>
            <a href="#" className="social-icon" aria-label="Twitter">
              🐦
            </a>
            <a href="#" className="social-icon" aria-label="Instagram">
              📷
            </a>
            <a href="#" className="social-icon" aria-label="YouTube">
              ▶️
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="copyright">
          © {currentYear} Sistema de Biblioteca Digital. Todos los derechos reservados.
        </p>
        <p className="disclaimer">
          Este es un sistema educativo de demostración.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
