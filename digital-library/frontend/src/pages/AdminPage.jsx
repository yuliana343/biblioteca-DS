import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../services/auth/AuthContext';
import Dashboard from '../components/admin/Dashboard';
import UserManagement from '../components/admin/UserManagement';
import Reports from '../components/admin/Reports';
import Statistics from '../components/admin/Statistics';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ProtectedRoute from '../services/auth/ProtectedRoute';
import './AdminPage.css';

const AdminPage = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    setLoading(true);
    try {
      const mockStats = {
        totalUsers: 567,
        totalBooks: 1234,
        activeLoans: 89,
        pendingReservations: 23,
        systemHealth: 95,
        recentActivity: 45
      };

      setTimeout(() => {
        setStats(mockStats);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading admin stats:', error);
      setLoading(false);
    }
  };

  // Si el usuario no es admin, redirigir
  if (user?.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('/admin/users')) return 'users';
    if (path.includes('/admin/reports')) return 'reports';
    if (path.includes('/admin/statistics')) return 'statistics';
    return 'dashboard';
  };

  const activeTab = getActiveTab();

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-loading">
          <LoadingSpinner message="Cargando panel de administración..." />
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <div className="admin-brand">
            <span className="brand-icon">👑</span>
            <span className="brand-text">Administración</span>
          </div>
          <div className="admin-info">
            <div className="admin-avatar">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="admin-details">
              <div className="admin-name">{user?.name || 'Administrador'}</div>
              <div className="admin-role">Administrador</div>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <Link 
            to="/admin/dashboard" 
            className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
          >
            <span className="nav-icon">📊</span>
            <span className="nav-text">Dashboard</span>
          </Link>
          
          <div className="nav-section">
            <div className="section-label">GESTIÓN</div>
            <Link 
              to="/admin/users" 
              className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
            >
              <span className="nav-icon">👥</span>
              <span className="nav-text">Usuarios</span>
              {stats && <span className="nav-badge">{stats.totalUsers}</span>}
            </Link>
            <Link 
              to="/admin/books" 
              className="nav-link"
            >
              <span className="nav-icon">📚</span>
              <span className="nav-text">Libros</span>
              {stats && <span className="nav-badge">{stats.totalBooks}</span>}
            </Link>
            <Link 
              to="/admin/loans" 
              className="nav-link"
            >
              <span className="nav-icon">📖</span>
              <span className="nav-text">Préstamos</span>
              {stats && <span className="nav-badge">{stats.activeLoans}</span>}
            </Link>
            <Link 
              to="/admin/reservations" 
              className="nav-link"
            >
              <span className="nav-icon">📅</span>
              <span className="nav-text">Reservas</span>
              {stats && <span className="nav-badge">{stats.pendingReservations}</span>}
            </Link>
          </div>

          <div className="nav-section">
            <div className="section-label">ANÁLISIS</div>
            <Link 
              to="/admin/reports" 
              className={`nav-link ${activeTab === 'reports' ? 'active' : ''}`}
            >
              <span className="nav-icon">📄</span>
              <span className="nav-text">Reportes</span>
            </Link>
            <Link 
              to="/admin/statistics" 
              className={`nav-link ${activeTab === 'statistics' ? 'active' : ''}`}
            >
              <span className="nav-icon">📈</span>
              <span className="nav-text">Estadísticas</span>
            </Link>
            <Link 
              to="/admin/analytics" 
              className="nav-link"
            >
              <span className="nav-icon">📊</span>
              <span className="nav-text">Analítica</span>
            </Link>
          </div>

          <div className="nav-section">
            <div className="section-label">SISTEMA</div>
            <Link 
              to="/admin/settings" 
              className="nav-link"
            >
              <span className="nav-icon">⚙️</span>
              <span className="nav-text">Configuración</span>
            </Link>
            <Link 
              to="/admin/logs" 
              className="nav-link"
            >
              <span className="nav-icon">📋</span>
              <span className="nav-text">Registros</span>
            </Link>
            <Link 
              to="/admin/backup" 
              className="nav-link"
            >
              <span className="nav-icon">💾</span>
              <span className="nav-text">Backup</span>
            </Link>
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="system-health">
            <div className="health-label">Estado del Sistema</div>
            <div className="health-bar">
              <div 
                className="health-fill" 
                style={{ width: `${stats?.systemHealth || 0}%` }}
              ></div>
            </div>
            <div className="health-value">{stats?.systemHealth || 0}%</div>
          </div>
          <Link to="/" className="btn btn-outline btn-block">
            <span className="btn-icon">←</span>
            Volver al Sitio
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {/* Top Bar */}
        <header className="admin-topbar">
          <div className="topbar-left">
            <div className="page-title">
              <h1>
                {activeTab === 'dashboard' && 'Dashboard'}
                {activeTab === 'users' && 'Gestión de Usuarios'}
                {activeTab === 'reports' && 'Reportes'}
                {activeTab === 'statistics' && 'Estadísticas'}
              </h1>
              <p className="page-subtitle">
                {activeTab === 'dashboard' && 'Vista general del sistema'}
                {activeTab === 'users' && 'Administra usuarios y permisos'}
                {activeTab === 'reports' && 'Genera y gestiona reportes'}
                {activeTab === 'statistics' && 'Métricas y análisis del sistema'}
              </p>
            </div>
          </div>

          <div className="topbar-right">
            <div className="quick-stats">
              <div className="quick-stat">
                <span className="stat-icon">👥</span>
                <div className="stat-details">
                  <div className="stat-value">{stats?.totalUsers || 0}</div>
                  <div className="stat-label">Usuarios</div>
                </div>
              </div>
              <div className="quick-stat">
                <span className="stat-icon">📚</span>
                <div className="stat-details">
                  <div className="stat-value">{stats?.totalBooks || 0}</div>
                  <div className="stat-label">Libros</div>
                </div>
              </div>
              <div className="quick-stat">
                <span className="stat-icon">📖</span>
                <div className="stat-details">
                  <div className="stat-value">{stats?.activeLoans || 0}</div>
                  <div className="stat-label">Préstamos</div>
                </div>
              </div>
            </div>

            <div className="admin-actions">
              <button className="btn btn-outline">
                <span className="btn-icon">🔄</span>
                Actualizar
              </button>
              <button className="btn btn-primary">
                <span className="btn-icon">➕</span>
                Nuevo
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="admin-content">
          <Routes>
            <Route path="dashboard" element={
              <ProtectedRoute requireAdmin>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="users" element={
              <ProtectedRoute requireAdmin>
                <UserManagement />
              </ProtectedRoute>
            } />
            <Route path="reports" element={
              <ProtectedRoute requireAdmin>
                <Reports />
              </ProtectedRoute>
            } />
            <Route path="statistics" element={
              <ProtectedRoute requireAdmin>
                <Statistics />
              </ProtectedRoute>
            } />
            <Route index element={<Navigate to="dashboard" replace />} />
          </Routes>
        </div>

        {/* Footer */}
        <footer className="admin-footer">
          <div className="footer-left">
            <span className="footer-text">
              © 2024 Sistema de Biblioteca Digital v1.0.0
            </span>
            <span className="footer-status">
              <span className="status-dot online"></span>
              Sistema en línea
            </span>
          </div>
          <div className="footer-right">
            <span className="footer-update">
              Última actualización: {new Date().toLocaleTimeString()}
            </span>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default AdminPage;