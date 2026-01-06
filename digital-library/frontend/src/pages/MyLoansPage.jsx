import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Pagination from '../components/common/Pagination';
import './MyLoansPage.css';

const MyLoansPage = () => {
  const [loans, setLoans] = useState([]);
  const [filteredLoans, setFilteredLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, active, overdue, returned
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchLoans();
  }, [filter]);

  const fetchLoans = async () => {
    setLoading(true);
    try {
      // Simulación de datos
      const mockLoans = Array.from({ length: 25 }, (_, i) => ({
        id: i + 1,
        bookTitle: `Libro ${i + 1}: ${['Cien años de soledad', 'El principito', '1984', 'Orgullo y prejuicio'][i % 4]}`,
        author: `Autor ${String.fromCharCode(65 + (i % 26))}. Autor`,
        isbn: `978-3-16-148410-${String(i).padStart(3, '0')}`,
        cover: 'https://via.placeholder.com/100x130',
        loanDate: new Date(2023, 10, 30 - i * 2).toISOString(),
        dueDate: new Date(2023, 11, 15 - i).toISOString(),
        returnDate: i % 3 === 0 ? new Date(2023, 11, 10 - i).toISOString() : null,
        status: i % 5 === 0 ? 'overdue' : i % 3 === 0 ? 'returned' : 'active',
        renewals: i % 4,
        fine: i % 7 === 0 ? (Math.random() * 50).toFixed(2) : '0.00',
        notes: i % 6 === 0 ? 'Renovado una vez' : ''
      }));

      // Filtrar según estado
      let filtered = [...mockLoans];
      if (filter !== 'all') {
        filtered = filtered.filter(loan => loan.status === filter);
      }

      // Calcular estadísticas
      const stats = {
        total: mockLoans.length,
        active: mockLoans.filter(l => l.status === 'active').length,
        overdue: mockLoans.filter(l => l.status === 'overdue').length,
        returned: mockLoans.filter(l => l.status === 'returned').length,
        totalFines: mockLoans.reduce((sum, loan) => sum + parseFloat(loan.fine), 0).toFixed(2)
      };

      setTimeout(() => {
        setLoans(mockLoans);
        setFilteredLoans(filtered);
        setStats(stats);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading loans:', error);
      setLoading(false);
    }
  };

  const handleRenewLoan = (loanId) => {
    const loan = loans.find(l => l.id === loanId);
    if (loan && loan.renewals < 3) {
      alert(`¿Renovar préstamo del libro "${loan.bookTitle}"?`);
      // Lógica de renovación aquí
    } else {
      alert('No se puede renovar este préstamo. Límite de renovaciones alcanzado.');
    }
  };

  const handleReturnLoan = (loanId) => {
    const loan = loans.find(l => l.id === loanId);
    if (loan) {
      alert(`¿Marcar como devuelto el libro "${loan.bookTitle}"?`);
      // Lógica de devolución aquí
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <span className="badge badge-success">Activo</span>;
      case 'overdue':
        return <span className="badge badge-error">Vencido</span>;
      case 'returned':
        return <span className="badge badge-info">Devuelto</span>;
      default:
        return <span className="badge badge-secondary">{status}</span>;
    }
  };

  const getDaysRemaining = (dueDate) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return <span className="days-overdue">Vencido hace {Math.abs(diffDays)} días</span>;
    } else if (diffDays === 0) {
      return <span className="days-today">Vence hoy</span>;
    } else {
      return <span className="days-remaining">Vence en {diffDays} días</span>;
    }
  };

  // Paginación
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedLoans = filteredLoans.slice(startIndex, startIndex + pageSize);
  const totalPages = Math.ceil(filteredLoans.length / pageSize);

  if (loading) {
    return (
      <div className="my-loans-page">
        <div className="loans-loading">
          <LoadingSpinner message="Cargando préstamos..." />
        </div>
      </div>
    );
  }

  return (
    <div className="my-loans-page">
      {/* Header */}
      <div className="loans-header">
        <div className="header-content">
          <h1>📖 Mis Préstamos</h1>
          <p className="subtitle">Historial y gestión de tus préstamos</p>
        </div>
        <div className="header-actions">
          <Link to="/catalog" className="btn btn-primary">
            <span className="btn-icon">🔍</span>
            Buscar Libros
          </Link>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="loans-stats">
          <div className="stat-card">
            <div className="stat-icon primary">📖</div>
            <div className="stat-info">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Total Préstamos</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon warning">⏰</div>
            <div className="stat-info">
              <div className="stat-value">{stats.active}</div>
              <div className="stat-label">Activos</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon error">🚨</div>
            <div className="stat-info">
              <div className="stat-value">{stats.overdue}</div>
              <div className="stat-label">Vencidos</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon info">💰</div>
            <div className="stat-info">
              <div className="stat-value">${stats.totalFines}</div>
              <div className="stat-label">Multas Totales</div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="loans-filters">
        <div className="filter-tabs">
          <button
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Todos ({stats.total})
          </button>
          <button
            className={`filter-tab ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            Activos ({stats.active})
          </button>
          <button
            className={`filter-tab ${filter === 'overdue' ? 'active' : ''}`}
            onClick={() => setFilter('overdue')}
          >
            Vencidos ({stats.overdue})
          </button>
          <button
            className={`filter-tab ${filter === 'returned' ? 'active' : ''}`}
            onClick={() => setFilter('returned')}
          >
            Devueltos ({stats.returned})
          </button>
        </div>
      </div>

      {/* Loans Table */}
      <div className="loans-table-container">
        {filteredLoans.length === 0 ? (
          <div className="empty-loans">
            <div className="empty-icon">📚</div>
            <h3>No hay préstamos</h3>
            <p>
              {filter === 'all' 
                ? 'No tienes préstamos registrados'
                : `No tienes préstamos ${filter === 'active' ? 'activos' : filter === 'overdue' ? 'vencidos' : 'devueltos'}`
              }
            </p>
            <Link to="/catalog" className="btn btn-primary">
              <span className="btn-icon">🔍</span>
              Explorar Catálogo
            </Link>
          </div>
        ) : (
          <>
            <table className="loans-table">
              <thead>
                <tr>
                  <th>Libro</th>
                  <th>Fechas</th>
                  <th>Estado</th>
                  <th>Renovaciones</th>
                  <th>Multa</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginatedLoans.map(loan => (
                  <tr key={loan.id} className={`loan-row ${loan.status}`}>
                    <td>
                      <div className="loan-book-info">
                        <div className="book-cover">
                          <img src={loan.cover} alt={loan.bookTitle} />
                        </div>
                        <div className="book-details">
                          <h4>{loan.bookTitle}</h4>
                          <p className="author">{loan.author}</p>
                          <p className="isbn">ISBN: {loan.isbn}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="loan-dates">
                        <div className="date-item">
                          <span className="date-label">Préstamo:</span>
                          <span className="date-value">
                            {new Date(loan.loanDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="date-item">
                          <span className="date-label">Vencimiento:</span>
                          <span className="date-value">
                            {new Date(loan.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                        {loan.returnDate && (
                          <div className="date-item">
                            <span className="date-label">Devolución:</span>
                            <span className="date-value">
                              {new Date(loan.returnDate).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="loan-status-cell">
                        {getStatusBadge(loan.status)}
                        {loan.status === 'active' && (
                          <div className="days-info">
                            {getDaysRemaining(loan.dueDate)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="renewals-cell">
                        <span className="renewals-count">{loan.renewals}/3</span>
                        {loan.renewals < 3 && loan.status === 'active' && (
                          <button
                            className="renew-btn"
                            onClick={() => handleRenewLoan(loan.id)}
                          >
                            Renovar
                          </button>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="fine-cell">
                        <span className={`fine-amount ${parseFloat(loan.fine) > 0 ? 'has-fine' : ''}`}>
                          ${loan.fine}
                        </span>
                        {parseFloat(loan.fine) > 0 && loan.status !== 'returned' && (
                          <button className="pay-fine-btn">
                            Pagar
                          </button>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="loan-actions-cell">
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => {/* Ver detalles */}}
                        >
                          👁️
                        </button>
                        {loan.status === 'active' && (
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleReturnLoan(loan.id)}
                          >
                            Devolver
                          </button>
                        )}
                        {parseFloat(loan.fine) > 0 && (
                          <button className="btn btn-warning btn-sm">
                            💰 Pagar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="loans-pagination">
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

      {/* Important Notes */}
      <div className="loan-notes">
        <div className="notes-header">
          <h3>📝 Información Importante</h3>
        </div>
        <div className="notes-content">
          <div className="note-item">
            <span className="note-icon">⏰</span>
            <div className="note-text">
              <strong>Duración del préstamo:</strong> 15 días por defecto
            </div>
          </div>
          <div className="note-item">
            <span className="note-icon">🔄</span>
            <div className="note-text">
              <strong>Renovaciones:</strong> Máximo 3 renovaciones por préstamo
            </div>
          </div>
          <div className="note-item">
            <span className="note-icon">💰</span>
            <div className="note-text">
              <strong>Multas:</strong> $5 por día de retraso después del vencimiento
            </div>
          </div>
          <div className="note-item">
            <span className="note-icon">📧</span>
            <div className="note-text">
              <strong>Notificaciones:</strong> Recibirás recordatorios 3 días antes del vencimiento
            </div>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="export-section">
        <button className="btn btn-outline">
          <span className="btn-icon">📥</span>
          Exportar Historial
        </button>
        <button className="btn btn-outline">
          <span className="btn-icon">📧</span>
          Recibir Resumen por Email
        </button>
      </div>
    </div>
  );
};

export default MyLoansPage;