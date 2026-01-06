// src/components/common/Sidebar.jsx
import React, { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../services/auth/AuthContext';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const sidebarRef = useRef();

  const isAdmin = user?.role === 'ADMIN';
  const isLibrarian = user?.role === 'LIBRARIAN';

  // Menú base para todos los usuarios
  const baseMenuItems = [
    { path: '/', icon: '🏠', label: 'Inicio', exact: true },
    { path: '/catalog', icon: '📚', label: 'Catálogo' },
  ];

  // Menú para usuarios autenticados
  const userMenuItems = user ? [
    { path: '/loans', icon: '🔄', label: 'Mis Préstamos' },
    { path: '/reservations', icon: '📅', label: 'Mis Reservas' },
    { path: '/favorites', icon: '⭐', label: 'Favoritos' },
    { path: '/history', icon: '📊', label: 'Historial' },
    { path: '/profile', icon: '👤', label: 'Mi Perfil' },
  ] : [];

  // Menú para bibliotecarios
  const librarianMenuItems = isLibrarian ? [
    { path: '/librarian/loans', icon: '🔄', label: 'Préstamos' },
    { path: '/librarian/reservations', icon: '📅', label: 'Reservas' },
    { path: '/librarian/returns', icon: '📦', label: 'Devoluciones' },
    { path: '/librarian/notifications', icon: '🔔', label: 'Notificaciones' },
    { path: '/dashboard', icon: '📊', label: 'Panel' },
  ] : [];

  // Menú para administradores
  const adminMenuItems = isAdmin ? [
    { path: '/admin/dashboard', icon: '📈', label: 'Dashboard' },
    { path: '/admin/books', icon: '📖', label: 'Libros' },
    { path: '/admin/users', icon: '👥', label: 'Usuarios' },
    { path: '/admin/loans', icon: '🔄', label: 'Préstamos' },
    { path: '/admin/reservations', icon: '📅', label: 'Reservas' },
    { path: '/admin/authors', icon: '✍️', label: 'Autores' },
    { path: '/admin/categories', icon: '🏷️', label: 'Categorías' },
    { path: '/admin/reports', icon: '📄', label: 'Reportes' },
    { path: '/admin/statistics', icon: '📊', label: 'Estadísticas' },
  ] : [];

  // Combinar menús según rol
  const menuItems = [
    ...baseMenuItems,
    ...userMenuItems,
    ...librarianMenuItems,
    ...adminMenuItems
  ];

  // Cerrar sidebar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && 
          !sidebarRef.current.contains(event.target) && 
          !event.target.closest('.mobile-menu-btn') &&
          !event.target.closest('.sidebar-toggle')) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Prevenir scroll del body cuando sidebar está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  return (
    <>
      {/* Overlay para móviles */}
      {isOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={onClose}
          aria-label="Cerrar menú"
        />
      )}

      <aside 
        ref={sidebarRef}
        className={`sidebar ${isOpen ? 'open' : ''}`}
        aria-label="Menú de navegación principal"
      >
        {/* Encabezado del sidebar */}
        <div className="sidebar-header">
          <div className="user-info">
            <div className="user-avatar">
              {user ? (
                <>
                  {user.firstName?.charAt(0)}
                  {user.lastName?.charAt(0)}
                </>
              ) : (
                '👤'
              )}
            </div>
            <div className="user-details">
              <h3 className="user-name">
                {user ? `${user.firstName} ${user.lastName}` : 'Invitado'}
              </h3>
              <p className="user-role">
                {user?.role ? user.role : 'USUARIO'}
              </p>
            </div>
          </div>
          
          <button 
            className="close-btn"
            onClick={onClose}
            aria-label="Cerrar menú"
          >
            ×
          </button>
        </div>

        {/* Navegación */}
        <nav className="sidebar-nav">
          <ul className="nav-menu">
            {menuItems.map((item) => (
              <li key={item.path} className="nav-item">
                <NavLink
                  to={item.path}
                  end={item.exact}
                  className={({ isActive }) =>
                    `nav-link ${isActive ? 'active' : ''}`
                  }
                  onClick={onClose}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                  {item.badge && (
                    <span className="nav-badge">{item.badge}</span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Pie del sidebar */}
        <div className="sidebar-footer">
          <div className="quick-stats">
            <div className="stat-item">
              <span className="stat-icon">📚</span>
              <div className="stat-info">
                <span className="stat-value">1,234</span>
                <span className="stat-label">Libros</span>
              </div>
            </div>
            <div className="stat-item">
              <span className="stat-icon">🔄</span>
              <div className="stat-info">
                <span className="stat-value">45</span>
                <span className="stat-label">Préstamos Activos</span>
              </div>
            </div>
          </div>

          <div className="system-info">
            <p className="system-status">
              <span className="status-indicator online"></span>
              Sistema en línea
            </p>
            <p className="last-update">Última actualización: hoy</p>
            <p className="support-info">
              <span>📧</span> soporte@biblioteca.edu
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;