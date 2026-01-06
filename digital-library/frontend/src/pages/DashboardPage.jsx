import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../services/auth/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './DashboardPage.css';

const DashboardPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [activeLoans, setActiveLoans] = useState([]);
  const [pendingReservations, setPendingReservations] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Simulación de datos basado en el rol del usuario
      const mockStats = {
        activeLoans: user?.role === 'ADMIN' ? 89 : 2,
        pendingReservations: user?.role === 'ADMIN' ? 23 : 1,
        overdueLoans: user?.role === 'ADMIN' ? 12 : 0,
        totalBooks: user?.role === 'ADMIN' ? 12345 : 0,
        readBooks: user?.role === 'USER' ? 24 : 0,
        readingTime: user?.role === 'USER' ? '45h 30m' : '0'
      };

      const mockActivity = [
        { 
          id: 1, 
          type: 'loan', 
          title: 'Nuevo préstamo', 
          description: 'Cien años de soledad', 
          time: 'Hace 2 horas',
          icon: '📖'
        },
        { 
          id: 2, 
          type: 'return', 
          title: 'Libro devuelto', 
          description: 'El principito', 
          time: 'Ayer',
          icon: '📚'
        },
        { 
          id: 3, 
          type: 'reservation', 
          title: 'Reserva confirmada', 
          description: 'Harry Potter', 
          time: 'Hace 3 días',
          icon: '📅'
        },
        { 
          id: 4, 
          type: 'renewal', 
          title: 'Préstamo renovado', 
          description: '1984', 
          time: 'Hace 1 semana',
          icon: '🔄'
        }
      ];

      const mockLoans = [
        {
          id: 1,
          bookTitle: 'Cien años de soledad',
          author: 'Gabriel García Márquez',
          dueDate: '2024-01-15',
          daysLeft: 5,
          status: 'active',
          cover: 'https://via.placeholder.com/80x100'
        },
        {
          id: 2,
          bookTitle: 'El código Da Vinci',
          author: 'Dan Brown',
          dueDate: '2024-01-10',
          daysLeft: 0,
          status: 'overdue',
          cover: 'https://via.placeholder.com/80x100'
        }
      ];

      const mockReservations = [
        {
          id: 1,
          bookTitle: 'Breve historia del tiempo',
          author: 'Stephen Hawking',
          reservedDate: '2024-01-05',
          position: 1,
          status: 'pending',
          cover: 'https://via.placeholder.com/80x100'
        }
      ];

      const mockRecommendations = [
        {
          id: 1,
          title: 'El amor en los tiempos del cólera',
          author: 'Gabriel García Márquez',
          reason: 'Porque te gustó Cien años de soledad',
          match: 95,
          cover: 'https://via.placeholder.com/60x80'
        },
        {
          id: 2,
          title: 'La sombra del viento',
          author: 'Carlos Ruiz Zafón',
          reason: 'Novela misteriosa con alta calificación',
          match: 87,
          cover: 'https://via.placeholder.com/60x80'
        },
        {
          id: 3,
          title: 'Fahrenheit 451',
          author: 'Ray Bradbury',
          reason: 'Clásico de ciencia ficción',
          match: 78,
          cover: 'https://via.placeholder.com/60x80'
        }
      ];

      setTimeout(() => {
        setStats(mockStats);
        setRecentActivity(mockActivity);
        setActiveLoans(mockLoans);
        setPendingReservations(mockReservations);
        setRecommendations(mockRecommendations);
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 19) return 'Buenas tardes';
    return 'Buenas noches';
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-loading">
          <LoadingSpinner message="Cargando dashboard..." />
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {/* Welcome Section */}
      <div className="welcome-section">
        <div className="welcome-content">
          <h1>
            {getGreeting()}, <span className="user-name">{user?.name || 'Usuario'}</span>
          </h1>
          <p className="welcome-subtitle">
            {user?.role === 'ADMIN' 
              ? 'Panel de administración del sistema'
              : 'Tu centro de control de la biblioteca digital'}
          </p>
          <div className="date-info">
            <span className="current-date">
              {new Date().toLocaleDateString('es-ES', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>
        </div>
        <div className="welcome-actions">
          <button className="btn btn-primary">
            <span className="btn-icon">🔍</span>
            Buscar Libros
          </button>
          <button className="btn btn-outline">
            <span className="btn-icon">📖</span>
            Nuevo Préstamo
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">📖</div>
          <div className="stat-info">
            <div className="stat-value">{stats.activeLoans}</div>
            <div className="stat-label">
              {user?.role === 'ADMIN' ? 'Préstamos Activos' : 'Mis Préstamos'}
            </div>
            <Link to="/my-loans" className="stat-link">
              Ver detalles →
            </Link>
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-icon">📅</div>
          <div className="stat-info">
            <div className="stat-value">{stats.pendingReservations}</div>
            <div className="stat-label">
              {user?.role === 'ADMIN' ? 'Reservas Pendientes' : 'Mis Reservas'}
            </div>
            <Link to="/reservations" className="stat-link">
              Gestionar →
            </Link>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon">⏰</div>
          <div className="stat-info">
            <div className="stat-value">{stats.overdueLoans}</div>
            <div className="stat-label">
              {user?.role === 'ADMIN' ? 'Préstamos Vencidos' : 'Vencidos'}
            </div>
            <Link to="/my-loans?status=overdue" className="stat-link">
              Revisar →
            </Link>
          </div>
        </div>

        {user?.role === 'USER' && (
          <>
            <div className="stat-card info">
              <div className="stat-icon">📚</div>
              <div className="stat-info">
                <div className="stat-value">{stats.readBooks}</div>
                <div className="stat-label">Libros Leídos</div>
                <Link to="/history" className="stat-link">
                  Ver historial →
                </Link>
              </div>
            </div>
          </>
        )}

        {user?.role === 'ADMIN' && (
          <div className="stat-card info">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <div className="stat-value">{stats.totalBooks.toLocaleString()}</div>
              <div className="stat-label">Libros en Catálogo</div>
              <Link to="/admin/books" className="stat-link">
                Gestionar →
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="dashboard-main">
        {/* Left Column */}
        <div className="dashboard-left">
          {/* Active Loans */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3>📖 Préstamos Activos</h3>
              <Link to="/my-loans" className="header-link">
                Ver todos →
              </Link>
            </div>
            {activeLoans.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📚</div>
                <p>No tienes préstamos activos</p>
                <Link to="/catalog" className="btn btn-outline btn-sm">
                  Buscar libros
                </Link>
              </div>
            ) : (
              <div className="loans-list">
                {activeLoans.map(loan => (
                  <div key={loan.id} className="loan-item">
                    <div className="loan-cover">
                      <img src={loan.cover} alt={loan.bookTitle} />
                    </div>
                    <div className="loan-info">
                      <h4>{loan.bookTitle}</h4>
                      <p className="author">{loan.author}</p>
                      <div className="loan-status">
                        <span className={`status-badge ${loan.status}`}>
                          {loan.status === 'overdue' ? 'Vencido' : 'Activo'}
                        </span>
                        <span className="due-date">
                          Vence: {new Date(loan.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="loan-actions">
                        <button className="btn btn-outline btn-sm">
                          Renovar
                        </button>
                        <button className="btn btn-primary btn-sm">
                          Ver detalles
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3>🔄 Actividad Reciente</h3>
              <Link to="/activity" className="header-link">
                Ver historial →
              </Link>
            </div>
            <div className="activity-list">
              {recentActivity.map(activity => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-icon">{activity.icon}</div>
                  <div className="activity-content">
                    <div className="activity-title">{activity.title}</div>
                    <div className="activity-description">{activity.description}</div>
                  </div>
                  <div className="activity-time">{activity.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="dashboard-right">
          {/* Quick Actions */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3>🚀 Acciones Rápidas</h3>
            </div>
            <div className="quick-actions">
              <Link to="/catalog" className="quick-action-btn">
                <span className="action-icon">🔍</span>
                <span className="action-text">Buscar Libros</span>
              </Link>
              <Link to="/reservations/new" className="quick-action-btn">
                <span className="action-icon">📅</span>
                <span className="action-text">Nueva Reserva</span>
              </Link>
              <Link to="/profile" className="quick-action-btn">
                <span className="action-icon">👤</span>
                <span className="action-text">Mi Perfil</span>
              </Link>
              <Link to="/catalog?new=true" className="quick-action-btn">
                <span className="action-icon">🆕</span>
                <span className="action-text">Novedades</span>
              </Link>
              <Link to="/help" className="quick-action-btn">
                <span className="action-icon">❓</span>
                <span className="action-text">Ayuda</span>
              </Link>
              <Link to="/settings" className="quick-action-btn">
                <span className="action-icon">⚙️</span>
                <span className="action-text">Ajustes</span>
              </Link>
            </div>
          </div>

          {/* Reservations */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3>📅 Reservas Pendientes</h3>
              <Link to="/reservations" className="header-link">
                Ver todas →
              </Link>
            </div>
            {pendingReservations.length === 0 ? (
              <div className="empty-state small">
                <p>No tienes reservas pendientes</p>
              </div>
            ) : (
              <div className="reservations-list">
                {pendingReservations.map(reservation => (
                  <div key={reservation.id} className="reservation-item">
                    <div className="reservation-cover">
                      <img src={reservation.cover} alt={reservation.bookTitle} />
                    </div>
                    <div className="reservation-info">
                      <h4>{reservation.bookTitle}</h4>
                      <p className="author">{reservation.author}</p>
                      <div className="reservation-meta">
                        <span className="position">Posición: #{reservation.position}</span>
                        <span className="date">
                          Reservado: {new Date(reservation.reservedDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recommendations */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3>⭐ Recomendaciones Para Ti</h3>
              <Link to="/recommendations" className="header-link">
                Ver más →
              </Link>
            </div>
            <div className="recommendations-list">
              {recommendations.map(rec => (
                <div key={rec.id} className="recommendation-item">
                  <div className="rec-cover">
                    <img src={rec.cover} alt={rec.title} />
                  </div>
                  <div className="rec-info">
                    <h4>{rec.title}</h4>
                    <p className="author">{rec.author}</p>
                    <p className="reason">{rec.reason}</p>
                    <div className="rec-match">
                      <div className="match-bar">
                        <div 
                          className="match-fill" 
                          style={{ width: `${rec.match}%` }}
                        ></div>
                      </div>
                      <span className="match-value">{rec.match}% match</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Admin Quick Links */}
      {user?.role === 'ADMIN' && (
        <div className="admin-quick-links">
          <h3>🔧 Herramientas de Administración</h3>
          <div className="admin-links-grid">
            <Link to="/admin/users" className="admin-link">
              <span className="admin-link-icon">👥</span>
              <span className="admin-link-text">Gestión de Usuarios</span>
            </Link>
            <Link to="/admin/books" className="admin-link">
              <span className="admin-link-icon">📚</span>
              <span className="admin-link-text">Gestión de Libros</span>
            </Link>
            <Link to="/admin/loans" className="admin-link">
              <span className="admin-link-icon">📖</span>
              <span className="admin-link-text">Préstamos</span>
            </Link>
            <Link to="/admin/reports" className="admin-link">
              <span className="admin-link-icon">📊</span>
              <span className="admin-link-text">Reportes</span>
            </Link>
            <Link to="/admin/statistics" className="admin-link">
              <span className="admin-link-icon">📈</span>
              <span className="admin-link-text">Estadísticas</span>
            </Link>
            <Link to="/admin/settings" className="admin-link">
              <span className="admin-link-icon">⚙️</span>
              <span className="admin-link-text">Configuración</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;