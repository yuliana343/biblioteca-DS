
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/auth/AuthContext';
import { NotificationBell } from '../notifications/NotificationBell';
import SearchBar from './SearchBar';
import './Header.css';

const Header = ({ toggleSidebar, sidebarOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isAdmin = user?.role === 'ADMIN';
  const isLibrarian = user?.role === 'LIBRARIAN';

  const handleLogout = () => {
    logout();
    navigate('/login');
    setUserDropdownOpen(false);
  };

  const handleProfileClick = () => {
    navigate('/profile');
    setUserDropdownOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleUserDropdown = () => {
    setUserDropdownOpen(!userDropdownOpen);
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo y menú móvil */}
        <div className="header-brand">
          <button 
            className="sidebar-toggle"
            onClick={toggleSidebar}
            aria-label={sidebarOpen ? 'Ocultar menú' : 'Mostrar menú'}
          >
            {sidebarOpen ? '←' : '→'}
          </button>

          <button 
            className="mobile-menu-btn"
            onClick={toggleMobileMenu}
            aria-label={mobileMenuOpen ? 'Cerrar menú móvil' : 'Abrir menú móvil'}
          >
            ☰
          </button>

          <Link to="/" className="logo-link">
            <div className="logo">
              <span className="logo-icon">📚</span>
              <span className="logo-text">Biblioteca Digital</span>
            </div>
          </Link>
        </div>

        {/* Barra de búsqueda */}
        <div className="header-search">
          <SearchBar />
        </div>

        {/* Navegación principal */}
        <nav className={`header-nav ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <ul className="nav-list">
            <li className="nav-item">
              <Link 
                to="/catalog" 
                className="nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="nav-icon">📖</span>
                <span className="nav-text">Catálogo</span>
              </Link>
            </li>
            
            {user && (
              <>
                <li className="nav-item">
                  <Link 
                    to="/loans" 
                    className="nav-link"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="nav-icon">🔄</span>
                    <span className="nav-text">Préstamos</span>
                  </Link>
                </li>
                
                <li className="nav-item">
                  <Link 
                    to="/reservations" 
                    className="nav-link"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="nav-icon">📅</span>
                    <span className="nav-text">Reservas</span>
                  </Link>
                </li>
                
                {(isAdmin || isLibrarian) && (
                  <li className="nav-item">
                    <Link 
                      to="/dashboard" 
                      className="nav-link"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="nav-icon">⚙️</span>
                      <span className="nav-text">Panel</span>
                    </Link>
                  </li>
                )}
              </>
            )}
          </ul>

          {/* Acciones de usuario */}
          <div className="user-actions">
            {user ? (
              <>
                <div className="notifications-wrapper">
                  <NotificationBell />
                </div>
                
                <div className="user-profile">
                  <div className="user-info">
                    <span className="user-name">
                      {user.firstName} {user.lastName}
                    </span>
                    <span className="user-role">{user.role}</span>
                  </div>
                  
                  <div className="dropdown">
                    <button 
                      className="dropdown-toggle"
                      onClick={toggleUserDropdown}
                      aria-label="Menú de usuario"
                    >
                      <span className="user-avatar">
                        {user.firstName?.charAt(0)}
                        {user.lastName?.charAt(0)}
                      </span>
                    </button>
                    
                    {userDropdownOpen && (
                      <div className="dropdown-menu">
                        <Link 
                          to="/profile" 
                          className="dropdown-item"
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          <span className="dropdown-icon">👤</span>
                          <span>Mi Perfil</span>
                        </Link>
                        {isAdmin && (
                          <Link 
                            to="/admin" 
                            className="dropdown-item"
                            onClick={() => setUserDropdownOpen(false)}
                          >
                            <span className="dropdown-icon">⚙️</span>
                            <span>Administración</span>
                          </Link>
                        )}
                        <button 
                          onClick={handleLogout}
                          className="dropdown-item logout-btn"
                        >
                          <span className="dropdown-icon">🚪</span>
                          <span>Cerrar Sesión</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="auth-buttons">
                <Link 
                  to="/login" 
                  className="btn btn-outline"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Iniciar Sesión
                </Link>
                <Link 
                  to="/register" 
                  className="btn btn-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
