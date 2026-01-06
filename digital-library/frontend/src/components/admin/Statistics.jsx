import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../common/LoadingSpinner';
import './Admin.css';

const Statistics = () => {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month'); // day, week, month, year, custom
  const [selectedMetric, setSelectedMetric] = useState('overview');
  const [comparisonPeriod, setComparisonPeriod] = useState('previous');
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [topItems, setTopItems] = useState({
    books: [],
    authors: [],
    categories: [],
    users: []
  });

  useEffect(() => {
    fetchStatistics();
  }, [timeRange, comparisonPeriod]);

  const fetchStatistics = async () => {
    setLoading(true);
    try {
      // Simulación de datos estadísticos
      const mockStats = {
        overview: {
          totalLoans: 1245,
          totalReturns: 1189,
          totalReservations: 567,
          activeUsers: 432,
          newUsers: 45,
          overdueRate: 4.5,
          satisfactionScore: 4.7
        },
        trends: {
          loansGrowth: 12.5,
          returnsGrowth: 8.3,
          reservationsGrowth: 15.2,
          usersGrowth: 5.8
        },
        averages: {
          loanDuration: 14.2,
          reservationWaitTime: 3.5,
          userActivity: 2.3,
          bookPopularity: 3.8
        },
        peaks: {
          busiestDay: 'Lunes',
          busiestHour: '15:00',
          peakMonth: 'Septiembre',
          peakSeason: 'Otoño'
        }
      };

      // Datos para gráficos
      const mockChartData = {
        loansByDay: Array.from({ length: 7 }, (_, i) => ({
          day: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'][i],
          value: Math.floor(Math.random() * 100) + 50
        })),
        loansByCategory: [
          { category: 'Ficción', value: 45 },
          { category: 'No Ficción', value: 25 },
          { category: 'Ciencia', value: 15 },
          { category: 'Historia', value: 10 },
          { category: 'Arte', value: 5 }
        ],
        userActivity: Array.from({ length: 12 }, (_, i) => ({
          month: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'][i],
          active: Math.floor(Math.random() * 500) + 200,
          new: Math.floor(Math.random() * 50) + 10
        })),
        hourlyActivity: Array.from({ length: 24 }, (_, i) => ({
          hour: `${i}:00`,
          loans: Math.floor(Math.random() * 30) + 10,
          returns: Math.floor(Math.random() * 20) + 5
        }))
      };

      // Top items
      const mockTopItems = {
        books: [
          { id: 1, title: 'Cien años de soledad', author: 'García Márquez', loans: 245, rating: 4.8 },
          { id: 2, title: 'Harry Potter y la piedra filosofal', author: 'J.K. Rowling', loans: 198, rating: 4.9 },
          { id: 3, title: 'El código Da Vinci', author: 'Dan Brown', loans: 167, rating: 4.3 },
          { id: 4, title: '1984', author: 'George Orwell', loans: 145, rating: 4.7 },
          { id: 5, title: 'Orgullo y prejuicio', author: 'Jane Austen', loans: 132, rating: 4.6 }
        ],
        authors: [
          { id: 1, name: 'Gabriel García Márquez', books: 15, totalLoans: 567 },
          { id: 2, name: 'J.K. Rowling', books: 7, totalLoans: 489 },
          { id: 3, name: 'Stephen King', books: 65, totalLoans: 432 },
          { id: 4, name: 'Isabel Allende', books: 23, totalLoans: 345 },
          { id: 5, name: 'Mario Vargas Llosa', books: 18, totalLoans: 298 }
        ],
        categories: [
          { id: 1, name: 'Ficción', books: 456, loans: 2345, percentage: 45 },
          { id: 2, name: 'No Ficción', books: 234, loans: 1234, percentage: 25 },
          { id: 3, name: 'Ciencia', books: 123, loans: 678, percentage: 15 },
          { id: 4, name: 'Historia', books: 89, loans: 456, percentage: 10 },
          { id: 5, name: 'Arte', books: 67, loans: 234, percentage: 5 }
        ],
        users: [
          { id: 1, name: 'Juan Pérez', loans: 45, reservations: 12, active: true },
          { id: 2, name: 'María García', loans: 38, reservations: 8, active: true },
          { id: 3, name: 'Carlos López', loans: 32, reservations: 15, active: true },
          { id: 4, name: 'Ana Martínez', loans: 29, reservations: 6, active: false },
          { id: 5, name: 'Pedro Rodríguez', loans: 27, reservations: 10, active: true }
        ]
      };

      setTimeout(() => {
        setStats(mockStats);
        setChartData(mockChartData);
        setTopItems(mockTopItems);
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error loading statistics:', error);
      setLoading(false);
    }
  };

  const getTrendIcon = (value) => {
    if (value > 0) return '📈';
    if (value < 0) return '📉';
    return '➡️';
  };

  const getTrendColor = (value) => {
    if (value > 0) return '#4caf50';
    if (value < 0) return '#f44336';
    return '#ff9800';
  };

  const getPeakBadge = (type) => {
    const colors = {
      busiestDay: '#4fc3f7',
      busiestHour: '#9c27b0',
      peakMonth: '#ff9800',
      peakSeason: '#4caf50'
    };
    return colors[type] || '#666';
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const renderBarChart = (data, title, color = '#4fc3f7') => {
    const maxValue = Math.max(...data.map(item => item.value));
    
    return (
      <div className="simple-chart">
        <div className="chart-header">
          <h4>{title}</h4>
        </div>
        <div className="chart-bars">
          {data.map((item, index) => (
            <div key={index} className="bar-item">
              <div className="bar-label">{item.day || item.category}</div>
              <div className="bar-container">
                <div 
                  className="bar" 
                  style={{
                    width: `${(item.value / maxValue) * 100}%`,
                    background: color
                  }}
                >
                  <span className="bar-value">{item.value}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderPieChart = (data, title) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    
    return (
      <div className="simple-pie">
        <div className="pie-header">
          <h4>{title}</h4>
        </div>
        <div className="pie-chart">
          <div className="pie-visual">
            <div className="pie-circle">
              {data.map((item, index) => (
                <div
                  key={index}
                  className="pie-segment"
                  style={{
                    transform: `rotate(${data.slice(0, index).reduce((sum, i) => sum + (i.value / total) * 360, 0)}deg)`,
                    background: `conic-gradient(${getCategoryColor(index)} 0% ${(item.value / total) * 100}%, transparent ${(item.value / total) * 100}% 100%)`
                  }}
                />
              ))}
            </div>
            <div className="pie-center">
              <span className="pie-total">{formatNumber(total)}</span>
              <span className="pie-label">Total</span>
            </div>
          </div>
          <div className="pie-legend">
            {data.map((item, index) => (
              <div key={index} className="legend-item">
                <span 
                  className="legend-color" 
                  style={{ background: getCategoryColor(index) }}
                />
                <span className="legend-text">{item.category}</span>
                <span className="legend-value">{item.value} ({((item.value / total) * 100).toFixed(1)}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const getCategoryColor = (index) => {
    const colors = ['#4fc3f7', '#4caf50', '#ff9800', '#9c27b0', '#f44336'];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <div className="statistics">
        <div className="stats-loading">
          <LoadingSpinner message="Cargando estadísticas..." />
        </div>
      </div>
    );
  }

  return (
    <div className="statistics">
      {/* Header */}
      <div className="stats-header">
        <div className="header-left">
          <h1>Estadísticas Detalladas</h1>
          <p className="subtitle">Análisis y métricas del sistema</p>
        </div>
        <div className="header-right">
          <div className="controls-group">
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="time-select"
            >
              <option value="day">Hoy</option>
              <option value="week">Esta semana</option>
              <option value="month">Este mes</option>
              <option value="year">Este año</option>
              <option value="custom">Personalizado</option>
            </select>
            
            <select 
              value={comparisonPeriod}
              onChange={(e) => setComparisonPeriod(e.target.value)}
              className="compare-select"
            >
              <option value="previous">Vs. período anterior</option>
              <option value="sameLastYear">Vs. mismo período año pasado</option>
              <option value="average">Vs. promedio histórico</option>
              <option value="none">Sin comparación</option>
            </select>
          </div>
          
          <button className="btn btn-primary">
            <span className="btn-icon">📥</span>
            Exportar Datos
          </button>
        </div>
      </div>

      {/* Métricas clave */}
      <div className="key-metrics">
        <div className="metric-card primary">
          <div className="metric-header">
            <div className="metric-icon">📖</div>
            <div className="metric-trend">
              <span className="trend-icon">{getTrendIcon(stats.trends.loansGrowth)}</span>
              <span className="trend-value" style={{ color: getTrendColor(stats.trends.loansGrowth) }}>
                {stats.trends.loansGrowth > 0 ? '+' : ''}{stats.trends.loansGrowth}%
              </span>
            </div>
          </div>
          <div className="metric-value">{formatNumber(stats.overview.totalLoans)}</div>
          <div className="metric-label">Préstamos Totales</div>
          <div className="metric-subtext">Período actual</div>
        </div>

        <div className="metric-card success">
          <div className="metric-header">
            <div className="metric-icon">📚</div>
            <div className="metric-trend">
              <span className="trend-icon">{getTrendIcon(stats.trends.returnsGrowth)}</span>
              <span className="trend-value" style={{ color: getTrendColor(stats.trends.returnsGrowth) }}>
                {stats.trends.returnsGrowth > 0 ? '+' : ''}{stats.trends.returnsGrowth}%
              </span>
            </div>
          </div>
          <div className="metric-value">{formatNumber(stats.overview.totalReturns)}</div>
          <div className="metric-label">Devoluciones</div>
          <div className="metric-subtext">Tasa de devolución: 95.5%</div>
        </div>

        <div className="metric-card warning">
          <div className="metric-header">
            <div className="metric-icon">📅</div>
            <div className="metric-trend">
              <span className="trend-icon">{getTrendIcon(stats.trends.reservationsGrowth)}</span>
              <span className="trend-value" style={{ color: getTrendColor(stats.trends.reservationsGrowth) }}>
                {stats.trends.reservationsGrowth > 0 ? '+' : ''}{stats.trends.reservationsGrowth}%
              </span>
            </div>
          </div>
          <div className="metric-value">{formatNumber(stats.overview.totalReservations)}</div>
          <div className="metric-label">Reservas</div>
          <div className="metric-subtext">Tiempo promedio espera: {stats.averages.reservationWaitTime} días</div>
        </div>

        <div className="metric-card info">
          <div className="metric-header">
            <div className="metric-icon">👥</div>
            <div className="metric-trend">
              <span className="trend-icon">{getTrendIcon(stats.trends.usersGrowth)}</span>
              <span className="trend-value" style={{ color: getTrendColor(stats.trends.usersGrowth) }}>
                {stats.trends.usersGrowth > 0 ? '+' : ''}{stats.trends.usersGrowth}%
              </span>
            </div>
          </div>
          <div className="metric-value">{formatNumber(stats.overview.activeUsers)}</div>
          <div className="metric-label">Usuarios Activos</div>
          <div className="metric-subtext">+{stats.overview.newUsers} nuevos este mes</div>
        </div>
      </div>

      {/* Gráficos principales */}
      <div className="main-charts">
        <div className="chart-section">
          <div className="chart-card">
            <div className="chart-header">
              <h3>📊 Actividad por Día de la Semana</h3>
              <div className="chart-legend">
                <span className="legend-item">
                  <span className="legend-color" style={{background: '#4fc3f7'}}></span>
                  Préstamos
                </span>
              </div>
            </div>
            {chartData && renderBarChart(chartData.loansByDay, 'Préstamos por día')}
          </div>
        </div>

        <div className="chart-section">
          <div className="chart-card">
            <div className="chart-header">
              <h3>🥧 Distribución por Categoría</h3>
              <div className="chart-subtitle">Porcentaje de préstamos</div>
            </div>
            {chartData && renderPieChart(chartData.loansByCategory, 'Préstamos por categoría')}
          </div>
        </div>
      </div>

      {/* Estadísticas detalladas */}
      <div className="detailed-stats">
        <div className="stats-section">
          <div className="section-header">
            <h3>📈 Tendencias y Promedios</h3>
          </div>
          
          <div className="trends-grid">
            <div className="trend-item">
              <div className="trend-label">Duración promedio de préstamo</div>
              <div className="trend-value">{stats.averages.loanDuration} días</div>
              <div className="trend-change positive">+{Math.random().toFixed(1)} días vs. promedio</div>
            </div>
            
            <div className="trend-item">
              <div className="trend-label">Tasa de préstamos vencidos</div>
              <div className="trend-value">{stats.overview.overdueRate}%</div>
              <div className="trend-change negative">-{Math.random().toFixed(1)}% vs. mes anterior</div>
            </div>
            
            <div className="trend-item">
              <div className="trend-label">Satisfacción de usuarios</div>
              <div className="trend-value">{stats.overview.satisfactionScore}/5</div>
              <div className="trend-change positive">+{Math.random().toFixed(1)} vs. trimestre anterior</div>
            </div>
            
            <div className="trend-item">
              <div className="trend-label">Actividad promedio por usuario</div>
              <div className="trend-value">{stats.averages.userActivity} préstamos/mes</div>
              <div className="trend-change positive">+{Math.random().toFixed(1)} vs. promedio histórico</div>
            </div>
          </div>
        </div>

        <div className="stats-section">
          <div className="section-header">
            <h3>⏰ Picos de Actividad</h3>
          </div>
          
          <div className="peaks-grid">
            {Object.entries(stats.peaks).map(([key, value]) => (
              <div key={key} className="peak-item">
                <div className="peak-icon" style={{background: getPeakBadge(key)}}>
                  {key === 'busiestDay' && '📅'}
                  {key === 'busiestHour' && '🕒'}
                  {key === 'peakMonth' && '📆'}
                  {key === 'peakSeason' && '🍂'}
                </div>
                <div className="peak-content">
                  <div className="peak-label">
                    {key === 'busiestDay' && 'Día más ocupado'}
                    {key === 'busiestHour' && 'Hora pico'}
                    {key === 'peakMonth' && 'Mes más activo'}
                    {key === 'peakSeason' && 'Temporada alta'}
                  </div>
                  <div className="peak-value">{value}</div>
                  <div className="peak-desc">
                    {key === 'busiestDay' && 'Con 45% más actividad que el promedio'}
                    {key === 'busiestHour' && '35% de los préstamos diarios'}
                    {key === 'peakMonth' && 'Debido al inicio del año escolar'}
                    {key === 'peakSeason' && 'Actividad aumenta un 40%'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top rankings */}
      <div className="top-rankings">
        <div className="ranking-section">
          <div className="section-header">
            <h3>🏆 Libros Más Populares</h3>
            <button className="btn btn-outline btn-sm">
              Ver top 50 →
            </button>
          </div>
          
          <div className="ranking-list">
            {topItems.books.map((book, index) => (
              <div key={book.id} className="ranking-item">
                <div className="rank-number">{index + 1}</div>
                <div className="rank-content">
                  <div className="rank-title">{book.title}</div>
                  <div className="rank-subtitle">{book.author}</div>
                </div>
                <div className="rank-stats">
                  <div className="stat">
                    <span className="stat-value">{book.loans}</span>
                    <span className="stat-label">préstamos</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">{book.rating}</span>
                    <span className="stat-label">rating</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="ranking-section">
          <div className="section-header">
            <h3>✍️ Autores Más Leídos</h3>
          </div>
          
          <div className="ranking-list">
            {topItems.authors.map((author, index) => (
              <div key={author.id} className="ranking-item">
                <div className="rank-number">{index + 1}</div>
                <div className="rank-content">
                  <div className="rank-title">{author.name}</div>
                  <div className="rank-subtitle">{author.books} libros en catálogo</div>
                </div>
                <div className="rank-stats">
                  <div className="stat">
                    <span className="stat-value">{formatNumber(author.totalLoans)}</span>
                    <span className="stat-label">préstamos totales</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Usuarios más activos y categorías */}
      <div className="additional-rankings">
        <div className="ranking-section">
          <div className="section-header">
            <h3>👥 Usuarios Más Activos</h3>
          </div>
          
          <div className="users-ranking">
            {topItems.users.map((user, index) => (
              <div key={user.id} className="user-rank-item">
                <div className="user-rank">
                  <span className="rank-badge">#{index + 1}</span>
                  <div className="user-avatar">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="user-info">
                    <div className="user-name">{user.name}</div>
                    <div className="user-status">
                      <span className={`status-dot ${user.active ? 'active' : 'inactive'}`}></span>
                      {user.active ? 'Activo' : 'Inactivo'}
                    </div>
                  </div>
                </div>
                <div className="user-stats">
                  <div className="user-stat">
                    <span className="stat-icon">📖</span>
                    <span className="stat-value">{user.loans}</span>
                  </div>
                  <div className="user-stat">
                    <span className="stat-icon">📅</span>
                    <span className="stat-value">{user.reservations}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="ranking-section">
          <div className="section-header">
            <h3>🏷️ Categorías Más Populares</h3>
          </div>
          
          <div className="categories-ranking">
            {topItems.categories.map((category, index) => (
              <div key={category.id} className="category-item">
                <div className="category-info">
                  <div className="category-name">{category.name}</div>
                  <div className="category-meta">
                    <span className="meta-item">{category.books} libros</span>
                    <span className="meta-item">•</span>
                    <span className="meta-item">{formatNumber(category.loans)} préstamos</span>
                  </div>
                </div>
                <div className="category-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ 
                        width: `${category.percentage}%`,
                        background: getCategoryColor(index)
                      }}
                    ></div>
                  </div>
                  <div className="progress-value">{category.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Análisis comparativo */}
      <div className="comparative-analysis">
        <div className="section-header">
          <h3>📊 Análisis Comparativo</h3>
          <div className="section-subtitle">
            Comparando: {timeRange === 'month' ? 'Este mes' : 'Este período'} vs. {comparisonPeriod === 'previous' ? 'Período anterior' : 'Mismo período año pasado'}
          </div>
        </div>
        
        <div className="comparison-grid">
          <div className="comparison-item">
            <div className="comparison-label">Crecimiento de préstamos</div>
            <div className="comparison-value positive">+{stats.trends.loansGrowth}%</div>
            <div className="comparison-bar">
              <div className="bar current" style={{ width: '70%' }}></div>
              <div className="bar previous" style={{ width: '58%' }}></div>
            </div>
          </div>
          
          <div className="comparison-item">
            <div className="comparison-label">Crecimiento de usuarios</div>
            <div className="comparison-value positive">+{stats.trends.usersGrowth}%</div>
            <div className="comparison-bar">
              <div className="bar current" style={{ width: '65%' }}></div>
              <div className="bar previous" style={{ width: '59%' }}></div>
            </div>
          </div>
          
          <div className="comparison-item">
            <div className="comparison-label">Tasa de devolución</div>
            <div className="comparison-value positive">+2.3%</div>
            <div className="comparison-bar">
              <div className="bar current" style={{ width: '95%' }}></div>
              <div className="bar previous" style={{ width: '93%' }}></div>
            </div>
          </div>
          
          <div className="comparison-item">
            <div className="comparison-label">Satisfacción</div>
            <div className="comparison-value positive">+0.2 puntos</div>
            <div className="comparison-bar">
              <div className="bar current" style={{ width: '94%' }}></div>
              <div className="bar previous" style={{ width: '92%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Insights y recomendaciones */}
      <div className="insights-section">
        <div className="section-header">
          <h3>💡 Insights y Recomendaciones</h3>
        </div>
        
        <div className="insights-grid">
          <div className="insight-card">
            <div className="insight-icon">📈</div>
            <div className="insight-content">
              <h4>Oportunidad de crecimiento</h4>
              <p>Los préstamos de categoría "Ciencia" han crecido un 25% este mes. Considera aumentar el inventario en esta categoría.</p>
            </div>
          </div>
          
          <div className="insight-card">
            <div className="insight-icon">⏰</div>
            <div className="insight-content">
              <h4>Optimización de horarios</h4>
              <p>El 35% de la actividad ocurre entre las 14:00 y 16:00. Considera programar mantenimiento fuera de estas horas.</p>
            </div>
          </div>
          
          <div className="insight-card">
            <div className="insight-icon">👥</div>
            <div className="insight-content">
              <h4>Retención de usuarios</h4>
              <p>El 15% de usuarios nuevos no vuelven después del primer préstamo. Implementa un programa de bienvenida.</p>
            </div>
          </div>
          
          <div className="insight-card">
            <div className="insight-icon">💰</div>
            <div className="insight-content">
              <h4>Optimización de recursos</h4>
              <p>12 libros tienen 0 préstamos en los últimos 6 meses. Considera reubicarlos o donarlos.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;