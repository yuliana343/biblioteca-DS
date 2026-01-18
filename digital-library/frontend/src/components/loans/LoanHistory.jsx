import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../services/auth/AuthContext';
import LoadingSpinner, { TableSkeleton } from '../common/LoadingSpinner';
import Pagination from '../common/Pagination';
import './Loans.css';

const LoanHistory = ({ 
  loans = [],
  loading = false,
  error = null,
  onViewDetails,
  onAddReview,
  userId = null  
}) => {
  const { user } = useContext(AuthContext);
  const [filteredLoans, setFilteredLoans] = useState(loans);
  const [filter, setFilter] = useState('all'); 
  const [sortBy, setSortBy] = useState('returnDate');
  const [searchTerm, setSearchTerm] = useState('');
  const [timeRange, setTimeRange] = useState('all');  
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [stats, setStats] = useState({
    total: 0,
    returned: 0,
    overdue: 0,
    lost: 0,
    averageLoanDays: 0
  });

  useEffect(() => {
    calculateStats();
    applyFiltersAndSort();
  }, [loans, filter, sortBy, searchTerm, timeRange, customStartDate, customEndDate]);

  const calculateStats = () => {
    const returned = loans.filter(loan => loan.status === 'RETURNED').length;
    const overdue = loans.filter(loan => loan.status === 'OVERDUE').length;
    const lost = loans.filter(loan => loan.status === 'LOST').length;
     
    const returnedLoans = loans.filter(loan => loan.status === 'RETURNED' && loan.loanDate && loan.returnDate);
    const totalDays = returnedLoans.reduce((sum, loan) => {
      const loanDate = new Date(loan.loanDate);
      const returnDate = new Date(loan.returnDate);
      return sum + Math.floor((returnDate - loanDate) / (1000 * 60 * 60 * 24));
    }, 0);
    
    const averageLoanDays = returnedLoans.length > 0 
      ? Math.round(totalDays / returnedLoans.length) 
      : 0;

    setStats({
      total: loans.length,
      returned,
      overdue,
      lost,
      averageLoanDays
    });
  };

  const applyFiltersAndSort = () => {
    let result = [...loans];
 
    if (filter !== 'all') {
      result = result.filter(loan => loan.status === filter.toUpperCase());
    }
 
    if (timeRange !== 'all') {
      const now = new Date();
      let startDate = new Date();

      switch (timeRange) {
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
        case 'custom':
          if (customStartDate) {
            startDate = new Date(customStartDate);
          }
          break;
      }

      if (timeRange !== 'custom' || customStartDate) {
        const endDate = timeRange === 'custom' && customEndDate 
          ? new Date(customEndDate)
          : now;

        result = result.filter(loan => {
          const loanDate = new Date(loan.loanDate);
          return loanDate >= startDate && loanDate <= endDate;
        });
      }
    }
 
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(loan => 
        loan.book?.title?.toLowerCase().includes(term) ||
        loan.book?.isbn?.toLowerCase().includes(term) ||
        loan.book?.authors?.some(author => 
          author.name.toLowerCase().includes(term)
        ) ||
        (userId && (
          loan.user?.firstName?.toLowerCase().includes(term) ||
          loan.user?.lastName?.toLowerCase().includes(term) ||
          loan.user?.email?.toLowerCase().includes(term)
        ))
      );
    }
 
    result.sort((a, b) => {
      switch (sortBy) {
        case 'returnDate':
          return new Date(b.returnDate || b.dueDate) - new Date(a.returnDate || a.dueDate);
        case 'loanDate':
          return new Date(b.loanDate) - new Date(a.loanDate);
        case 'title':
          return a.book?.title?.localeCompare(b.book?.title);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'daysLoaned':
          const aDays = a.returnDate 
            ? Math.floor((new Date(a.returnDate) - new Date(a.loanDate)) / (1000 * 60 * 60 * 24))
            : 0;
          const bDays = b.returnDate 
            ? Math.floor((new Date(b.returnDate) - new Date(b.loanDate)) / (1000 * 60 * 60 * 24))
            : 0;
          return bDays - aDays;
        default:
          return 0;
      }
    });

    setFilteredLoans(result);
  };

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
    if (range !== 'custom') {
      setCustomStartDate('');
      setCustomEndDate('');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'RETURNED':
        return <span className="badge badge-success">Devuelto</span>;
      case 'OVERDUE':
        return <span className="badge badge-error">Vencido</span>;
      case 'LOST':
        return <span className="badge badge-warning">Perdido</span>;
      default:
        return <span className="badge badge-secondary">{status}</span>;
    }
  };

  const getRatingStars = (rating) => {
    if (!rating) return 'Sin calificar';
    
    const fullStars = '★'.repeat(rating);
    const emptyStars = '☆'.repeat(5 - rating);
    return (
      <span className="rating-stars">
        {fullStars}{emptyStars} ({rating}/5)
      </span>
    );
  };

  const calculateLoanDays = (loan) => {
    if (!loan.loanDate) return 'N/A';
    
    const loanDate = new Date(loan.loanDate);
    const endDate = loan.returnDate ? new Date(loan.returnDate) : new Date();
    
    const days = Math.floor((endDate - loanDate) / (1000 * 60 * 60 * 24));
    return `${days} días`;
  };

  const calculateFinePaid = (loan) => {
    return loan.fineAmount || 0;
  };
 
  const totalPages = Math.ceil(filteredLoans.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedLoans = filteredLoans.slice(startIndex, startIndex + pageSize);

  if (loading) {
    return (
      <div className="loan-history">
        <div className="history-header">
          <h2>Historial de Préstamos</h2>
          <TableSkeleton rows={5} columns={7} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="history-error">
        <div className="error-icon">❌</div>
        <h3>Error al cargar el historial</h3>
        <p>{error.message || 'No se pudo cargar el historial de préstamos'}</p>
        <button 
          className="btn btn-primary"
          onClick={() => window.location.reload()}
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="loan-history">
      {/* Header */}
      <div className="history-header">
        <div className="header-left">
          <h2>
            {userId ? 'Historial del Usuario' : 'Mi Historial de Préstamos'}
          </h2>
          <p className="subtitle">
            {userId 
              ? 'Registro completo de préstamos del usuario' 
              : 'Revisa tu actividad pasada y califica los libros'}
          </p>
        </div>
        
        <div className="header-actions">
          <button className="btn btn-outline">
            <span className="btn-icon">📥</span>
            Exportar CSV
          </button>
          <button className="btn btn-outline">
            <span className="btn-icon">🖨️</span>
            Imprimir
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="history-stats">
        <div className="stat-card">
          <div className="stat-icon primary">📊</div>
          <div className="stat-info">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Préstamos</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon success">✅</div>
          <div className="stat-info">
            <div className="stat-value">{stats.returned}</div>
            <div className="stat-label">Devueltos</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon warning">📅</div>
          <div className="stat-info">
            <div className="stat-value">{stats.averageLoanDays}</div>
            <div className="stat-label">Días promedio</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon info">💰</div>
          <div className="stat-info">
            <div className="stat-value">
              ${loans.reduce((sum, loan) => sum + (loan.fineAmount || 0), 0).toFixed(2)}
            </div>
            <div className="stat-label">Multas totales</div>
          </div>
        </div>
      </div>

      {/* Controles de filtro */}
      <div className="history-controls">
        <div className="controls-left">
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              Todos ({stats.total})
            </button>
            <button 
              className={`filter-btn ${filter === 'returned' ? 'active' : ''}`}
              onClick={() => setFilter('returned')}
            >
              Devueltos ({stats.returned})
            </button>
            <button 
              className={`filter-btn ${filter === 'overdue' ? 'active' : ''}`}
              onClick={() => setFilter('overdue')}
            >
              Vencidos ({stats.overdue})
            </button>
            <button 
              className={`filter-btn ${filter === 'lost' ? 'active' : ''}`}
              onClick={() => setFilter('lost')}
            >
              Perdidos ({stats.lost})
            </button>
          </div>

          <div className="time-range">
            <select 
              value={timeRange}
              onChange={(e) => handleTimeRangeChange(e.target.value)}
              className="range-select"
            >
              <option value="all">Todo el tiempo</option>
              <option value="month">Último mes</option>
              <option value="year">Último año</option>
              <option value="custom">Personalizado</option>
            </select>

            {timeRange === 'custom' && (
              <div className="custom-dates">
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="date-input"
                  placeholder="Desde"
                />
                <span className="date-separator">a</span>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="date-input"
                  placeholder="Hasta"
                />
              </div>
            )}
          </div>
        </div>

        <div className="controls-right">
          <div className="search-box">
            <input
              type="text"
              placeholder={
                userId 
                  ? "Buscar por libro, usuario, email..." 
                  : "Buscar por libro, autor, ISBN..."
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>

          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="returnDate">Ordenar por: Fecha de devolución</option>
            <option value="loanDate">Fecha de préstamo (reciente)</option>
            <option value="title">Título del libro (A-Z)</option>
            <option value="rating">Calificación (alta)</option>
            <option value="daysLoaned">Días prestados (mayor)</option>
          </select>
        </div>
      </div>

      {/* Tabla de historial */}
      <div className="history-table-container">
        {filteredLoans.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <h3>No se encontraron registros</h3>
            <p>
              {filter === 'all' 
                ? 'No hay historial de préstamos disponible' 
                : `No hay préstamos con el filtro "${filter}" en el período seleccionado`}
            </p>
            {(searchTerm || timeRange !== 'all' || filter !== 'all') && (
              <button 
                className="btn btn-outline"
                onClick={() => {
                  setSearchTerm('');
                  setTimeRange('all');
                  setFilter('all');
                }}
              >
                Limpiar filtros
              </button>
            )}
          </div>
        ) : (
          <>
            <table className="history-table">
              <thead>
                <tr>
                  <th>Libro</th>
                  {userId && <th>Usuario</th>}
                  <th>Período</th>
                  <th>Duración</th>
                  <th>Estado</th>
                  <th>Calificación</th>
                  <th>Multa Pagada</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginatedLoans.map(loan => (
                  <tr key={loan.id} className="history-row">
                    <td>
                      <div className="book-info-cell">
                        {loan.book?.coverImageUrl ? (
                          <img 
                            src={loan.book.coverImageUrl} 
                            alt={loan.book.title}
                            className="book-cover-small"
                          />
                        ) : (
                          <div className="book-cover-placeholder-small">📖</div>
                        )}
                        <div className="book-details">
                          <strong>{loan.book?.title || 'Libro no disponible'}</strong>
                          <small>{loan.book?.authors?.[0]?.name || 'Autor desconocido'}</small>
                          <small>ISBN: {loan.book?.isbn || 'N/A'}</small>
                        </div>
                      </div>
                    </td>
                    
                    {userId && (
                      <td>
                        <div className="user-info-cell">
                          <div className="user-avatar-small">
                            {loan.user?.firstName?.charAt(0)}
                            {loan.user?.lastName?.charAt(0)}
                          </div>
                          <div className="user-details">
                            <strong>{loan.user?.firstName} {loan.user?.lastName}</strong>
                            <small>{loan.user?.email}</small>
                            <small>DNI: {loan.user?.dni || 'N/A'}</small>
                          </div>
                        </div>
                      </td>
                    )}
                    
                    <td>
                      <div className="period-cell">
                        <div className="loan-date">
                          <strong>Préstamo:</strong> {new Date(loan.loanDate).toLocaleDateString()}
                        </div>
                        <div className="return-date">
                          <strong>Devolución:</strong> {
                            loan.returnDate 
                              ? new Date(loan.returnDate).toLocaleDateString()
                              : 'Pendiente'
                          }
                        </div>
                        <div className="due-date">
                          <strong>Vencía:</strong> {new Date(loan.dueDate).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    
                    <td>
                      <div className="duration-cell">
                        <div className="duration-days">
                          {calculateLoanDays(loan)}
                        </div>
                        {loan.returnDate && (
                          <small className="duration-status">
                            {new Date(loan.returnDate) > new Date(loan.dueDate) 
                              ? 'Devuelto tarde' 
                              : 'Devuelto a tiempo'}
                          </small>
                        )}
                      </div>
                    </td>
                    
                    <td>{getStatusBadge(loan.status)}</td>
                    
                    <td>
                      <div className="rating-cell">
                        {getRatingStars(loan.rating)}
                        {!loan.rating && loan.status === 'RETURNED' && !userId && (
                          <button
                            className="btn-rate"
                            onClick={() => onAddReview(loan.id, loan.book?.id)}
                          >
                            Calificar
                          </button>
                        )}
                      </div>
                    </td>
                    
                    <td>
                      <div className="fine-cell">
                        {loan.fineAmount ? (
                          <span className="fine-paid">${loan.fineAmount.toFixed(2)}</span>
                        ) : (
                          <span className="no-fine">Sin multa</span>
                        )}
                        {loan.finePaidDate && (
                          <small className="fine-date">
                            Pagado: {new Date(loan.finePaidDate).toLocaleDateString()}
                          </small>
                        )}
                      </div>
                    </td>
                    
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => onViewDetails(loan.id)}
                          title="Ver detalles"
                        >
                          👁️
                        </button>
                        
                        {!userId && loan.status === 'RETURNED' && !loan.rating && (
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => onAddReview(loan.id, loan.book?.id)}
                            title="Calificar libro"
                          >
                            ⭐
                          </button>
                        )}
                        
                        {loan.status === 'LOST' && (
                          <button
                            className="btn btn-warning btn-sm"
                            onClick={() => {/* Lógica para marcar como encontrado */}}
                            title="Marcar como encontrado"
                          >
                            🔍
                          </button>
                        )}
                        
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => {/* Lógica para reimprimir comprobante */}}
                          title="Reimprimir comprobante"
                        >
                          🖨️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="history-pagination">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  pageSize={pageSize}
                  totalItems={filteredLoans.length}
                  onPageChange={setCurrentPage}
                  onPageSizeChange={setPageSize}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Gráficos y resumen */}
      <div className="history-summary">
        <div className="summary-section">
          <h4>Resumen Estadístico</h4>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-label">Libro más prestado:</span>
              <span className="summary-value">
                {(() => {
                  const bookCounts = {};
                  loans.forEach(loan => {
                    if (loan.book?.title) {
                      bookCounts[loan.book.title] = (bookCounts[loan.book.title] || 0) + 1;
                    }
                  });
                  const mostLoaned = Object.entries(bookCounts).sort((a, b) => b[1] - a[1])[0];
                  return mostLoaned ? `${mostLoaned[0]} (${mostLoaned[1]} veces)` : 'N/A';
                })()}
              </span>
            </div>
            
            <div className="summary-item">
              <span className="summary-label">Período más activo:</span>
              <span className="summary-value">
                {(() => {
                  const monthCounts = {};
                  loans.forEach(loan => {
                    const month = new Date(loan.loanDate).toLocaleString('es', { month: 'long' });
                    monthCounts[month] = (monthCounts[month] || 0) + 1;
                  });
                  const mostActive = Object.entries(monthCounts).sort((a, b) => b[1] - a[1])[0];
                  return mostActive ? `${mostActive[0]} (${mostActive[1]} préstamos)` : 'N/A';
                })()}
              </span>
            </div>
            
            <div className="summary-item">
              <span className="summary-label">Promedio de renovaciones:</span>
              <span className="summary-value">
                {loans.length > 0 
                  ? (loans.reduce((sum, loan) => sum + (loan.renewalsCount || 0), 0) / loans.length).toFixed(1)
                  : '0.0'
                } por préstamo
              </span>
            </div>
            
            <div className="summary-item">
              <span className="summary-label">Tasa de devolución a tiempo:</span>
              <span className="summary-value">
                {stats.returned > 0 
                  ? `${Math.round((loans.filter(loan => 
                      loan.status === 'RETURNED' && 
                      new Date(loan.returnDate) <= new Date(loan.dueDate)
                    ).length / stats.returned) * 100)}%`
                  : '0%'
                }
              </span>
            </div>
          </div>
        </div>

        <div className="summary-actions">
          <button className="btn btn-outline">
            <span className="btn-icon">📈</span>
            Ver análisis detallado
          </button>
          <button className="btn btn-primary">
            <span className="btn-icon">📋</span>
            Generar reporte
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoanHistory;
