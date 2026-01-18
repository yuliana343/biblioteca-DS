import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../services/auth/AuthContext';
import LoadingSpinner, { TableSkeleton } from '../common/LoadingSpinner';
import RenewLoanModal from './RenewLoanModal';
import './Loans.css';

const ActiveLoans = ({ 
  loans = [],
  loading = false,
  error = null,
  onRenewLoan,
  onReturnLoan,
  onViewDetails,
  isAdminView = false
}) => {
  const { user } = useContext(AuthContext);
  const [filteredLoans, setFilteredLoans] = useState(loans);
  const [filter, setFilter] = useState('all'); // all, active, overdue, returned
  const [sortBy, setSortBy] = useState('dueDate');
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    active: 0,
    overdue: 0,
    returned: 0,
    total: 0
  });

  useEffect(() => {
    calculateStats();
    applyFiltersAndSort();
  }, [loans, filter, sortBy, searchTerm]);

  const calculateStats = () => {
    const active = loans.filter(loan => loan.status === 'ACTIVE').length;
    const overdue = loans.filter(loan => loan.status === 'OVERDUE').length;
    const returned = loans.filter(loan => loan.status === 'RETURNED').length;
    
    setStats({
      active,
      overdue,
      returned,
      total: loans.length
    });
  };

  const applyFiltersAndSort = () => {
    let result = [...loans];
 
    if (filter === 'active') {
      result = result.filter(loan => loan.status === 'ACTIVE');
    } else if (filter === 'overdue') {
      result = result.filter(loan => loan.status === 'OVERDUE');
    } else if (filter === 'returned') {
      result = result.filter(loan => loan.status === 'RETURNED');
    }
 
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(loan => 
        loan.book?.title?.toLowerCase().includes(term) ||
        loan.book?.isbn?.toLowerCase().includes(term) ||
        loan.user?.firstName?.toLowerCase().includes(term) ||
        loan.user?.lastName?.toLowerCase().includes(term)
      );
    }
 
    result.sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          return new Date(a.dueDate) - new Date(b.dueDate);
        case 'loanDate':
          return new Date(b.loanDate) - new Date(a.loanDate);
        case 'title':
          return a.book?.title?.localeCompare(b.book?.title);
        case 'user':
          return a.user?.lastName?.localeCompare(b.user?.lastName);
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

    setFilteredLoans(result);
  };

  const handleRenewClick = (loan) => {
    setSelectedLoan(loan);
    setShowRenewModal(true);
  };

  const handleRenewConfirm = async (loanId, newDueDate) => {
    try {
      await onRenewLoan(loanId, newDueDate);
      setShowRenewModal(false);
      setSelectedLoan(null);
    } catch (error) {
      console.error('Error al renovar préstamo:', error);
    }
  };

  const handleReturnLoan = async (loanId) => {
    if (window.confirm('¿Estás seguro de marcar este préstamo como devuelto?')) {
      try {
        await onReturnLoan(loanId);
      } catch (error) {
        console.error('Error al devolver préstamo:', error);
      }
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="badge badge-success">Activo</span>;
      case 'OVERDUE':
        return <span className="badge badge-error">Vencido</span>;
      case 'RETURNED':
        return <span className="badge badge-info">Devuelto</span>;
      case 'LOST':
        return <span className="badge badge-warning">Perdido</span>;
      default:
        return <span className="badge badge-secondary">{status}</span>;
    }
  };

  const getDaysRemaining = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return <span className="text-error">Vencido hace {Math.abs(diffDays)} días</span>;
    } else if (diffDays === 0) {
      return <span className="text-warning">Vence hoy</span>;
    } else if (diffDays <= 3) {
      return <span className="text-warning">Vence en {diffDays} días</span>;
    } else {
      return <span className="text-success">{diffDays} días restantes</span>;
    }
  };

  const calculateFine = (loan) => {
    if (loan.status !== 'OVERDUE' || loan.fineAmount > 0) {
      return loan.fineAmount || 0;
    }

    const today = new Date();
    const dueDate = new Date(loan.dueDate);
    const daysOverdue = Math.max(0, Math.floor((today - dueDate) / (1000 * 60 * 60 * 24)));
     
    return daysOverdue * 1;
  };

  if (loading) {
    return (
      <div className="active-loans">
        <div className="loans-header">
          <h2>Préstamos Activos</h2>
          <TableSkeleton rows={5} columns={6} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="loans-error">
        <div className="error-icon">❌</div>
        <h3>Error al cargar los préstamos</h3>
        <p>{error.message || 'No se pudo cargar la información de préstamos'}</p>
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
    <div className="active-loans">
      {/* Header con estadísticas */}
      <div className="loans-header">
        <div className="header-left">
          <h2>
            {isAdminView ? 'Gestión de Préstamos' : 'Mis Préstamos Activos'}
          </h2>
          <p className="subtitle">
            {isAdminView 
              ? 'Administra todos los préstamos del sistema' 
              : 'Gestiona tus libros prestados y fechas de devolución'}
          </p>
        </div>
        
        <div className="header-actions">
          <button className="btn btn-primary">
            <span className="btn-icon">📖</span>
            Nuevo Préstamo
          </button>
          <button className="btn btn-outline">
            <span className="btn-icon">📥</span>
            Exportar
          </button>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="loans-stats">
        <div className="stat-card">
          <div className="stat-icon success">📚</div>
          <div className="stat-info">
            <div className="stat-value">{stats.active}</div>
            <div className="stat-label">Activos</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon warning">⏰</div>
          <div className="stat-info">
            <div className="stat-value">{stats.overdue}</div>
            <div className="stat-label">Vencidos</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon info">✅</div>
          <div className="stat-info">
            <div className="stat-value">{stats.returned}</div>
            <div className="stat-label">Devueltos</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon primary">📊</div>
          <div className="stat-info">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total</div>
          </div>
        </div>
      </div>

      {/* Controles de filtro y búsqueda */}
      <div className="loans-controls">
        <div className="controls-left">
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              Todos ({stats.total})
            </button>
            <button 
              className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
              onClick={() => setFilter('active')}
            >
              Activos ({stats.active})
            </button>
            <button 
              className={`filter-btn ${filter === 'overdue' ? 'active' : ''}`}
              onClick={() => setFilter('overdue')}
            >
              Vencidos ({stats.overdue})
            </button>
            <button 
              className={`filter-btn ${filter === 'returned' ? 'active' : ''}`}
              onClick={() => setFilter('returned')}
            >
              Devueltos ({stats.returned})
            </button>
          </div>
        </div>

        <div className="controls-right">
          <div className="search-box">
            <input
              type="text"
              placeholder="Buscar por libro, usuario, ISBN..."
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
            <option value="dueDate">Ordenar por: Fecha de vencimiento</option>
            <option value="loanDate">Fecha de préstamo (más reciente)</option>
            <option value="title">Título del libro (A-Z)</option>
            <option value="user">Usuario (A-Z)</option>
            <option value="status">Estado</option>
          </select>
        </div>
      </div>

      {/* Tabla de préstamos */}
      <div className="loans-table-container">
        {filteredLoans.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h3>No se encontraron préstamos</h3>
            <p>
              {filter === 'all' 
                ? 'No hay préstamos registrados' 
                : `No hay préstamos con el filtro "${filter}"`}
            </p>
            {searchTerm && (
              <button 
                className="btn btn-outline"
                onClick={() => setSearchTerm('')}
              >
                Limpiar búsqueda
              </button>
            )}
          </div>
        ) : (
          <table className="loans-table">
            <thead>
              <tr>
                <th>Libro</th>
                {isAdminView && <th>Usuario</th>}
                <th>Fecha Préstamo</th>
                <th>Fecha Devolución</th>
                <th>Estado</th>
                <th>Días Restantes</th>
                <th>Renovaciones</th>
                <th>Multa</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredLoans.map(loan => {
                const fineAmount = calculateFine(loan);
                const canRenew = loan.status === 'ACTIVE' && loan.renewalsCount < 3;
                const canReturn = loan.status === 'ACTIVE' || loan.status === 'OVERDUE';
                
                return (
                  <tr key={loan.id} className={`loan-row ${loan.status.toLowerCase()}`}>
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
                    
                    {isAdminView && (
                      <td>
                        <div className="user-info-cell">
                          <div className="user-avatar-small">
                            {loan.user?.firstName?.charAt(0)}
                            {loan.user?.lastName?.charAt(0)}
                          </div>
                          <div className="user-details">
                            <strong>{loan.user?.firstName} {loan.user?.lastName}</strong>
                            <small>{loan.user?.email}</small>
                          </div>
                        </div>
                      </td>
                    )}
                    
                    <td>
                      <div className="date-cell">
                        <div className="date">{new Date(loan.loanDate).toLocaleDateString()}</div>
                        <small className="date-ago">
                          {Math.floor((new Date() - new Date(loan.loanDate)) / (1000 * 60 * 60 * 24))} días atrás
                        </small>
                      </div>
                    </td>
                    
                    <td>
                      <div className="date-cell">
                        <div className={`date ${loan.status === 'OVERDUE' ? 'overdue' : ''}`}>
                          {new Date(loan.dueDate).toLocaleDateString()}
                        </div>
                        {loan.returnDate && (
                          <small className="returned">
                            Devuelto: {new Date(loan.returnDate).toLocaleDateString()}
                          </small>
                        )}
                      </div>
                    </td>
                    
                    <td>{getStatusBadge(loan.status)}</td>
                    
                    <td>{getDaysRemaining(loan.dueDate)}</td>
                    
                    <td>
                      <div className="renewals-cell">
                        <span className="renewals-count">{loan.renewalsCount || 0}/3</span>
                        {loan.renewalsCount >= 3 && (
                          <small className="renewals-limit">Límite alcanzado</small>
                        )}
                      </div>
                    </td>
                    
                    <td>
                      <div className="fine-cell">
                        {fineAmount > 0 ? (
                          <>
                            <span className="fine-amount">${fineAmount.toFixed(2)}</span>
                            {loan.status === 'OVERDUE' && !loan.fineAmount && (
                              <small className="fine-calc">(calculada)</small>
                            )}
                          </>
                        ) : (
                          <span className="no-fine">Sin multa</span>
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
                        
                        {canRenew && (
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleRenewClick(loan)}
                            title="Renovar préstamo"
                          >
                            🔄
                          </button>
                        )}
                        
                        {canReturn && (isAdminView || user?.role === 'LIBRARIAN') && (
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleReturnLoan(loan.id)}
                            title="Marcar como devuelto"
                          >
                            ✅
                          </button>
                        )}
                        
                        {fineAmount > 0 && (
                          <button
                            className="btn btn-warning btn-sm"
                            onClick={() => {/* Lógica para pagar multa */}}
                            title="Pagar multa"
                          >
                            💰
                          </button>
                        )}
                        
                        {isAdminView && (
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => {/* Lógica para marcar como perdido */}}
                            title="Marcar como perdido"
                          >
                            🚫
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Resumen y acciones */}
      <div className="loans-footer">
        <div className="footer-stats">
          <div className="footer-stat">
            <span className="stat-label">Préstamos mostrados:</span>
            <span className="stat-value">{filteredLoans.length}</span>
          </div>
          <div className="footer-stat">
            <span className="stat-label">Multas pendientes:</span>
            <span className="stat-value">
              ${filteredLoans.reduce((sum, loan) => sum + calculateFine(loan), 0).toFixed(2)}
            </span>
          </div>
          <div className="footer-stat">
            <span className="stat-label">Renovaciones disponibles:</span>
            <span className="stat-value">
              {filteredLoans.filter(loan => loan.status === 'ACTIVE' && loan.renewalsCount < 3).length}
            </span>
          </div>
        </div>
        
        <div className="footer-actions">
          <button className="btn btn-outline">
            <span className="btn-icon">🖨️</span>
            Imprimir lista
          </button>
          <button className="btn btn-primary">
            <span className="btn-icon">📧</span>
            Enviar recordatorios
          </button>
        </div>
      </div>

      {/* Modal de renovación */}
      {showRenewModal && selectedLoan && (
        <RenewLoanModal
          loan={selectedLoan}
          onClose={() => {
            setShowRenewModal(false);
            setSelectedLoan(null);
          }}
          onConfirm={handleRenewConfirm}
        />
      )}
    </div>
  );
};

export default ActiveLoans;
