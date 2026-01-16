import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../common/LoadingSpinner';
import './Admin.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('today'); // today, week, month, year
  const [selectedMetric, setSelectedMetric] = useState('overview');

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try { 
      const mockStats = {
        totalBooks: 1234,
        totalUsers: 567,
        activeLoans: 89,
        pendingReservations: 23,
        overdueLoans: 12,
        availableBooks: 987,
        newBooksThisMonth: 45,
        averageLoanDuration: 14.5,
        userSatisfaction: 4.8,
        systemUptime: 99.9
      };

      const mockActivity = [
        { id: 1, type: 'loan', user: 'Juan Pérez', book: 'Cien años de soledad', time: '10:30 AM', status: 'completed' },
        { id: 2, type: 'reservation', user: 'María García', book: 'Harry Potter', time: '11:15 AM', status: 'pending' },
        { id: 3, type: 'return', user: 'Carlos López', book: 'El principito', time: '12:00 PM', status: 'completed' },
        { id: 4, type: 'new_book', user: 'Admin', book: 'Nuevo libro añadido', time: '01:30 PM', status: 'completed' },
        { id: 5, type: 'user_registration', user: 'Ana Martínez', book: 'Nuevo usuario', time: '02:45 PM', status: 'completed' }
      ];

      setTimeout(() => {
        setStats(mockStats);
        setRecentActivity(mockActivity);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      setLoading(false);
    }
  };

  const getMetricTrend = (metric) => {
     
    const trends = {
      totalBooks: { value: '+12%', positive: true },
      totalUsers: { value: '+8%', positive: true },
      activeLoans: { value: '-3%', positive: false },
      overdueLoans: { value: '+5%', positive: false },
      userSatisfaction: { value: '+0.2', positive: true }
    };
    return trends[metric] || { value: '0%', positive: true };
  };

  const getActivityIcon = (type) => {
    const icons = {
      loan: '📖',
      return: '📚',
      reservation: '📅',
      new_book: '➕',
      user_registration: '👤',
      renewal: '🔄',
      fine: '💰'
    };
    return icons[type] || '📊';
  };

  const getActivityColor = (type) => {
    const colors = {
      loan: '#4fc3f7',
      return: '#4caf50',
      reservation: '#ff9800',
      new_book: '#9c27b0',
      user_registration: '#2196f3',
      renewal: '#00bcd4',
      fine: '#f44336'
    };
    return colors[type] || '#666';
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="dashboard-loading">
          <LoadingSpinner message="Cargando dashboard..." />
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Header del dashboard */}
      <div className="dashboard-header">
        <div className="header-left">
          <h1>Panel de Administración</h1>
          <p className="subtitle">Vista general del sistema de biblioteca</p>
        </div>
        <div className="header-right">
          <div className="time-selector">
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="time-select"
            >
              <option value="today">Hoy</option>
              <option value="week">Esta semana</option>
              <option value="month">Este mes</option>
              <option value="year">Este año</option>
              <option value="custom">Personalizado</option>
            </select>
          </div>
          <button className="btn btn-primary">
            <span className="btn-icon">🔄</span>
            Actualizar
          </button>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="metrics-grid">
        <div className="metric-card primary">
          <div className="metric-icon">📚</div>
          <div className="metric-content">
            <div className="metric-value">{stats.totalBooks.toLocaleString()}</div>
            <div className="metric-label">Libros Totales</div>
            <div className="metric-trend">
              <span className={`trend-value ${getMetricTrend('totalBooks').positive ? 'positive' : 'negative'}`}>
                {getMetricTrend('totalBooks').value}
              </span>
              <span className="trend-period"> vs. mes anterior</span>
            </div>
          </div>
        </div>

        <div className="metric-card success">
          <div className="metric-icon">👥</div>
          <div className="metric-content">
            <div className="metric-value">{stats.totalUsers.toLocaleString()}</div>
            <div className="metric-label">Usuarios Registrados</div>
            <div className="metric-trend">
              <span className={`trend-value ${getMetricTrend('totalUsers').positive ? 'positive' : 'negative'}`}>
                {getMetricTrend('totalUsers').value}
              </span>
              <span className="trend-period"> vs. mes anterior</span>
            </div>
          </div>
        </div>

        <div className="metric-card warning">
          <div className="metric-icon">📖</div>
          <div className="metric-content">
            <div className="metric-value">{stats.activeLoans}</div>
            <div className="metric-label">Préstamos Activos</div>
            <div className="metric-trend">
              <span className={`trend-value ${getMetricTrend('activeLoans').positive ? 'positive' : 'negative'}`}>
                {getMetricTrend('activeLoans').value}
              </span>
              <span className="trend-period"> vs. semana anterior</span>
            </div>
          </div>
        </div>

        <div className="metric-card info">
          <div className="metric-icon">📅</div>
          <div className="metric-content">
            <div className="metric-value">{stats.pendingReservations}</div>
            <div className="metric-label">Reservas Pendientes</div>
            <div className="metric-trend">
              <span className="trend-value positive">-2</span>
              <span className="trend-period"> desde ayer</span>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos y estadísticas */}
      <div className="charts-section">
        <div className="chart-card">
          <div className="chart-header">
            <h3>📈 Actividad del Sistema</h3>
            <div className="chart-actions">
              <button 
                className={`chart-btn ${selectedMetric === 'overview' ? 'active' : ''}`}
                onClick={() => setSelectedMetric('overview')}
              >
                Resumen
              </button>
              <button 
                className={`chart-btn ${selectedMetric === 'loans' ? 'active' : ''}`}
                onClick={() => setSelectedMetric('loans')}
              >
                Préstamos
              </button>
              <button 
                className={`chart-btn ${selectedMetric === 'users' ? 'active' : ''}`}
                onClick={() => setSelectedMetric('users')}
              >
                Usuarios
              </button>
            </div>
          </div>
          <div className="chart-placeholder">
            <div className="placeholder-content">
              <span className="placeholder-icon">📊</span>
              <p>Grafía de actividad del sistema</p>
              <small>Mostrando datos para: {timeRange}</small>
            </div>
          </div>
          <div className="chart-legend">
            <div className="legend-item">
              <span className="legend-color" style={{background: '#4fc3f7'}}></span>
              <span className="legend-text">Préstamos</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{background: '#4caf50'}}></span>
              <span className="legend-text">Devoluciones</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{background: '#ff9800'}}></span>
              <span className="legend-text">Reservas</span>
            </div>
          </div>
        </div>

        <div className="stats-card">
          <div className="stats-header">
            <h3>📊 Métricas de Rendimiento</h3>
          </div>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-label">Libros Disponibles</div>
              <div className="stat-value">{stats.availableBooks}</div>
              <div className="stat-percentage">80% del total</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Préstamos Vencidos</div>
              <div className="stat-value error">{stats.overdueLoans}</div>
              <div className="stat-percentage">13.5% de activos</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Nuevos Libros (Mes)</div>
              <div className="stat-value">{stats.newBooksThisMonth}</div>
              <div className="stat-percentage">+15 desde ayer</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Duración Promedio Préstamo</div>
              <div className="stat-value">{stats.averageLoanDuration} días</div>
              <div className="stat-percentage">+1.2 días vs promedio</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Satisfacción Usuarios</div>
              <div className="stat-value">{stats.userSatisfaction}/5</div>
              <div className="stat-percentage">96% satisfechos</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Disponibilidad Sistema</div>
              <div className="stat-value">{stats.systemUptime}%</div>
              <div className="stat-percentage">7 días sin interrupciones</div>
            </div>
          </div>
        </div>
      </div>

      {/* Actividad reciente y alertas */}
      <div className="activity-section">
        <div className="recent-activity">
          <div className="activity-header">
            <h3>🔄 Actividad Reciente</h3>
            <button className="btn btn-outline btn-sm">
              Ver todo →
            </button>
          </div>
          <div className="activity-list">
            {recentActivity.map(activity => (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon" style={{background: getActivityColor(activity.type)}}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="activity-content">
                  <div className="activity-title">
                    {activity.type === 'loan' && 'Nuevo préstamo registrado'}
                    {activity.type === 'return' && 'Libro devuelto'}
                    {activity.type === 'reservation' && 'Nueva reserva'}
                    {activity.type === 'new_book' && 'Nuevo libro añadido'}
                    {activity.type === 'user_registration' && 'Nuevo usuario registrado'}
                  </div>
                  <div className="activity-details">
                    <span className="user">{activity.user}</span>
                    {activity.book && <span className="book">• {activity.book}</span>}
                  </div>
                </div>
                <div className="activity-time">
                  <span className="time">{activity.time}</span>
                  <span className={`status ${activity.status}`}>{activity.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="alerts-card">
          <div className="alerts-header">
            <h3>⚠️ Alertas y Notificaciones</h3>
            <span className="alerts-count">3</span>
          </div>
          <div className="alerts-list">
            <div className="alert-item critical">
              <div className="alert-icon">🔴</div>
              <div className="alert-content">
                <div className="alert-title">Préstamos vencidos críticos</div>
                <div className="alert-desc">5 préstamos con más de 30 días de retraso</div>
              </div>
              <button className="btn btn-sm btn-outline">Ver</button>
            </div>
            <div className="alert-item warning">
              <div className="alert-icon">🟡</div>
              <div className="alert-content">
                <div className="alert-title">Libros agotados</div>
                <div className="alert-desc">12 libros con 0 copias disponibles</div>
              </div>
              <button className="btn btn-sm btn-outline">Reponer</button>
            </div>
            <div className="alert-item info">
              <div className="alert-icon">🔵</div>
              <div className="alert-content">
                <div className="alert-title">Reservas por expirar</div>
                <div className="alert-desc">8 reservas expiran en las próximas 24h</div>
              </div>
              <button className="btn btn-sm btn-outline">Notificar</button>
            </div>
          </div>
          <div className="alerts-footer">
            <button className="btn btn-outline btn-block">
              <span className="btn-icon">🔔</span>
              Configurar alertas
            </button>
          </div>
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="quick-actions-section">
        <h3>🚀 Acciones Rápidas</h3>
        <div className="quick-actions-grid">
          <button className="quick-action">
            <span className="action-icon">➕</span>
            <span className="action-text">Agregar Libro</span>
          </button>
          <button className="quick-action">
            <span className="action-icon">👤</span>
            <span className="action-text">Registrar Usuario</span>
          </button>
          <button className="quick-action">
            <span className="action-icon">📖</span>
            <span className="action-text">Nuevo Préstamo</span>
          </button>
          <button className="quick-action">
            <span className="action-icon">📊</span>
            <span className="action-text">Generar Reporte</span>
          </button>
          <button className="quick-action">
            <span className="action-icon">📧</span>
            <span className="action-text">Enviar Notificaciones</span>
          </button>
          <button className="quick-action">
            <span className="action-icon">⚙️</span>
            <span className="action-text">Configuración</span>
          </button>
        </div>
      </div>

      {/* Estado del sistema */}
      <div className="system-status">
        <h3>🖥️ Estado del Sistema</h3>
        <div className="status-grid">
          <div className="status-item online">
            <div className="status-indicator"></div>
            <div className="status-info">
              <div className="status-label">Servidor Principal</div>
              <div className="status-value">En línea</div>
            </div>
          </div>
          <div className="status-item online">
            <div className="status-indicator"></div>
            <div className="status-info">
              <div className="status-label">Base de Datos</div>
              <div className="status-value">Sincronizado</div>
            </div>
          </div>
          <div className="status-item warning">
            <div className="status-indicator"></div>
            <div className="status-info">
              <div className="status-label">Servicio de Email</div>
              <div className="status-value">Latencia alta</div>
            </div>
          </div>
          <div className="status-item online">
            <div className="status-indicator"></div>
            <div className="status-info">
              <div className="status-label">Almacenamiento</div>
              <div className="status-value">85% usado</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
