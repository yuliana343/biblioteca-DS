import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../services/auth/AuthContext';
import LoadingSpinner, { TableSkeleton } from '../common/LoadingSpinner';
import Pagination from '../common/Pagination';
import './Reservations.css';

const ReservationList = ({ 
  reservations = [],
  loading = false,
  error = null,
  onCancelReservation,
  onNotifyUser,
  onConvertToLoan,
  onViewBook,
  onViewUser,
  isAdminView = false
}) => {
  const { user } = useContext(AuthContext);
  const [filteredReservations, setFilteredReservations] = useState(reservations);
  const [filter, setFilter] = useState('all'); // all, pending, active, cancelled, expired
  const [sortBy, setSortBy] = useState('expiryDate');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedReservations, setSelectedReservations] = useState([]);

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    active: 0,
    cancelled: 0,
    expired: 0,
    expiringSoon: 0
  });

  useEffect(() => {
    calculateStats();
    applyFiltersAndSort();
  }, [reservations, filter, sortBy, searchTerm]);

  const calculateStats = () => {
    const now = new Date();
    const pending = reservations.filter(r => r.status === 'PENDING').length;
    const active = reservations.filter(r => r.status === 'ACTIVE').length;
    const cancelled = reservations.filter(r => r.status === 'CANCELLED').length;
    const expired = reservations.filter(r => r.status === 'EXPIRED').length;
    
    const expiringSoon = reservations.filter(r => {
      if (r.status !== 'PENDING' && r.status !== 'ACTIVE') return false;
      if (!r.expiryDate) return false;
      
      const expiryDate = new Date(r.expiryDate);
      const hoursUntilExpiry = (expiryDate - now) / (1000 * 60 * 60);
      return hoursUntilExpiry <= 24 && hoursUntilExpiry > 0;
    }).length;

    setStats({
      total: reservations.length,
      pending,
      active,
      cancelled,
      expired,
      expiringSoon
    });
  };

  const applyFiltersAndSort = () => {
    let result = [...reservations];

    // Aplicar filtro
    if (filter !== 'all') {
      result = result.filter(reservation => 
        reservation.status === filter.toUpperCase()
      );
    }

    // Aplicar búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(reservation => 
        reservation.book?.title?.toLowerCase().includes(term) ||
        reservation.book?.isbn?.toLowerCase().includes(term) ||
        reservation.user?.firstName?.toLowerCase().includes(term) ||
        reservation.user?.lastName?.toLowerCase().includes(term) ||
        reservation.user?.email?.toLowerCase().includes(term)
      );
    }

    // Aplicar ordenación
    result.sort((a, b) => {
      switch (sortBy) {
        case 'expiryDate':
          return new Date(a.expiryDate || 0) - new Date(b.expiryDate || 0);
        case 'reservationDate':
          return new Date(b.reservationDate) - new Date(a.reservationDate);
        case 'title':
          return a.book?.title?.localeCompare(b.book?.title);
        case 'user':
          return a.user?.lastName?.localeCompare(b.user?.lastName);
        case 'priority':
          return (b.priority || 0) - (a.priority || 0);
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

    setFilteredReservations(result);
    setCurrentPage(1); // Resetear a primera página al filtrar
  };

  const handleSelectReservation = (reservationId) => {
    setSelectedReservations(prev => {
      if (prev.includes(reservationId)) {
        return prev.filter(id => id !== reservationId);
      } else {
        return [...prev, reservationId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedReservations.length === filteredReservations.length) {
      setSelectedReservations([]);
    } else {
      setSelectedReservations(filteredReservations.map(r => r.id));
    }
  };

  const handleBulkCancel = () => {
    if (selectedReservations.length === 0) {
      alert('Por favor selecciona al menos una reserva');
      return;
    }

    if (window.confirm(`¿Estás seguro de cancelar ${selectedReservations.length} reserva(s)?`)) {
      selectedReservations.forEach(reservationId => {
        onCancelReservation(reservationId);
      });
      setSelectedReservations([]);
    }
  };

  const handleBulkNotify = () => {
    if (selectedReservations.length === 0) {
      alert('Por favor selecciona al menos una reserva');
      return;
    }

    if (window.confirm(`¿Enviar notificaciones a ${selectedReservations.length} usuario(s)?`)) {
      selectedReservations.forEach(reservationId => {
        onNotifyUser(reservationId);
      });
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <span className="badge badge-warning">Pendiente</span>;
      case 'ACTIVE':
        return <span className="badge badge-success">Activa</span>;
      case 'CANCELLED':
        return <span className="badge badge-error">Cancelada</span>;
      case 'EXPIRED':
        return <span className="badge badge-secondary">Expirada</span>;
      default:
        return <span className="badge badge-secondary">{status}</span>;
    }
  };

  const getExpiryStatus = (expiryDate, status) => {
    if (!expiryDate || status === 'CANCELLED' || status === 'EXPIRED') {
      return null;
    }

    const now = new Date();
    const expiry = new Date(expiryDate);
    const hoursUntilExpiry = (expiry - now) / (1000 * 60 * 60);

    if (hoursUntilExpiry <= 0) {
      return <span className="expiry-status expired">Expirada</span>;
    } else if (hoursUntilExpiry <= 24) {
      return <span className="expiry-status expiring-soon">Expira pronto</span>;
    } else if (hoursUntilExpiry <= 72) {
      return <span className="expiry-status expiring">Expira en {Math.ceil(hoursUntilExpiry / 24)} días</span>;
    }
    
    return null;
  };

  const getPriorityBadge = (priority) => {
    if (priority === 1) return <span className="badge badge-high">Alta</span>;
    if (priority === 2) return <span className="badge badge-medium">Media</span>;
    return <span className="badge badge-low">Baja</span>;
  };

  const getTimeUntilExpiry = (expiryDate) => {
    if (!expiryDate) return 'No definida';
    
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffMs = expiry - now;
    
    if (diffMs <= 0) return 'Expirada';
    
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    const remainingHours = diffHours % 24;
    
    if (diffDays > 0) {
      return `${diffDays}d ${remainingHours}h`;
    }
    return `${diffHours}h`;
  };

  const canConvertToLoan = (reservation) => {
    return reservation.status === 'ACTIVE' && 
           reservation.book?.availableCopies > 0 &&
           (isAdminView || user?.role === 'LIBRARIAN');
  };

  const canCancel = (reservation) => {
    if (isAdminView || user?.role === 'LIBRARIAN') return true;
    return reservation.status === 'PENDING' || reservation.status === 'ACTIVE';
  };

  const canNotify = (reservation) => {
    return reservation.status === 'ACTIVE' && 
           !reservation.notifiedAt &&
           (isAdminView || user?.role === 'LIBRARIAN');
  };

  // Paginación
  const totalPages = Math.ceil(filteredReservations.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedReservations = filteredReservations.slice(startIndex, startIndex + pageSize);

  if (loading) {
    return (
      <div className="reservation-list">
        <div className="reservations-header">
          <h2>Gestión de Reservas</h2>
          <TableSkeleton rows={5} columns={8} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reservations-error">
        <div className="error-icon">❌</div>
        <h3>Error al cargar las reservas</h3>
        <p>{error.message || 'No se pudo cargar la información de reservas'}</p>
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
    <div className="reservation-list">
      {/* Header */}
      <div className="reservations-header">
        <div className="header-left">
          <h2>
            {isAdminView ? 'Gestionar Reservas' : 'Mis Reservas'}
          </h2>
          <p className="subtitle">
            {isAdminView 
              ? 'Administra todas las reservas del sistema' 
              : 'Revisa el estado de tus reservas de libros'}
          </p>
        </div>
        
        <div className="header-actions">
          <button className="btn btn-primary">
            <span className="btn-icon">➕</span>
            Nueva Reserva
          </button>
          <button className="btn btn-outline">
            <span className="btn-icon">📥</span>
            Exportar
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="reservations-stats">
        <div className="stat-card">
          <div className="stat-icon primary">📊</div>
          <div className="stat-info">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon warning">⏳</div>
          <div className="stat-info">
            <div className="stat-value">{stats.pending}</div>
            <div className="stat-label">Pendientes</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon success">✅</div>
          <div className="stat-info">
            <div className="stat-value">{stats.active}</div>
            <div className="stat-label">Activas</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon danger">⏰</div>
          <div className="stat-info">
            <div className="stat-value">{stats.expiringSoon}</div>
            <div className="stat-label">Por expirar</div>
          </div>
        </div>
      </div>

      {/* Acciones masivas */}
      {isAdminView && selectedReservations.length > 0 && (
        <div className="bulk-actions">
          <div className="bulk-info">
            <span className="selected-count">
              {selectedReservations.length} reserva(s) seleccionada(s)
            </span>
          </div>
          <div className="bulk-buttons">
            <button
              className="btn btn-warning"
              onClick={handleBulkNotify}
            >
              <span className="btn-icon">🔔</span>
              Notificar selección
            </button>
            <button
              className="btn btn-danger"
              onClick={handleBulkCancel}
            >
              <span className="btn-icon">🗑️</span>
              Cancelar selección
            </button>
            <button
              className="btn btn-outline"
              onClick={() => setSelectedReservations([])}
            >
              <span className="btn-icon">✕</span>
              Deseleccionar
            </button>
          </div>
        </div>
      )}

      {/* Controles */}
      <div className="reservations-controls">
        <div className="controls-left">
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              Todas ({stats.total})
            </button>
            <button 
              className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
              onClick={() => setFilter('pending')}
            >
              Pendientes ({stats.pending})
            </button>
            <button 
              className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
              onClick={() => setFilter('active')}
            >
              Activas ({stats.active})
            </button>
            <button 
              className={`filter-btn ${filter === 'cancelled' ? 'active' : ''}`}
              onClick={() => setFilter('cancelled')}
            >
              Canceladas ({stats.cancelled})
            </button>
            <button 
              className={`filter-btn ${filter === 'expired' ? 'active' : ''}`}
              onClick={() => setFilter('expired')}
            >
              Expiradas ({stats.expired})
            </button>
          </div>
        </div>

        <div className="controls-right">
          <div className="search-box">
            <input
              type="text"
              placeholder="Buscar por libro, usuario, email..."
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
            <option value="expiryDate">Ordenar por: Fecha de expiración</option>
            <option value="reservationDate">Fecha de reserva (reciente)</option>
            <option value="title">Título del libro (A-Z)</option>
            <option value="user">Usuario (A-Z)</option>
            <option value="priority">Prioridad (alta)</option>
            <option value="status">Estado</option>
          </select>
        </div>
      </div>

      {/* Tabla de reservas */}
      <div className="reservations-table-container">
        {filteredReservations.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h3>No se encontraron reservas</h3>
            <p>
              {filter === 'all' 
                ? 'No hay reservas registradas' 
                : `No hay reservas con el filtro "${filter}"`}
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
          <>
            <table className="reservations-table">
              <thead>
                <tr>
                  {isAdminView && (
                    <th style={{ width: '40px' }}>
                      <input
                        type="checkbox"
                        checked={selectedReservations.length === filteredReservations.length}
                        onChange={handleSelectAll}
                        className="select-checkbox"
                      />
                    </th>
                  )}
                  <th>Libro</th>
                  {isAdminView && <th>Usuario</th>}
                  <th>Fecha Reserva</th>
                  <th>Expiración</th>
                  <th>Estado</th>
                  <th>Prioridad</th>
                  <th>Notificada</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginatedReservations.map(reservation => {
                  const expiryStatus = getExpiryStatus(reservation.expiryDate, reservation.status);
                  const timeUntilExpiry = getTimeUntilExpiry(reservation.expiryDate);
                  
                  return (
                    <tr key={reservation.id} className={`reservation-row ${reservation.status.toLowerCase()}`}>
                      {isAdminView && (
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedReservations.includes(reservation.id)}
                            onChange={() => handleSelectReservation(reservation.id)}
                            className="select-checkbox"
                          />
                        </td>
                      )}
                      
                      <td>
                        <div className="book-info-cell">
                          {reservation.book?.coverImageUrl ? (
                            <img 
                              src={reservation.book.coverImageUrl} 
                              alt={reservation.book.title}
                              className="book-cover-small"
                            />
                          ) : (
                            <div className="book-cover-placeholder-small">📖</div>
                          )}
                          <div className="book-details">
                            <strong 
                              className="book-title-link"
                              onClick={() => onViewBook(reservation.book?.id)}
                            >
                              {reservation.book?.title || 'Libro no disponible'}
                            </strong>
                            <small>{reservation.book?.authors?.[0]?.name || 'Autor desconocido'}</small>
                            <small className="availability">
                              Disponibles: {reservation.book?.availableCopies || 0}
                            </small>
                          </div>
                        </div>
                      </td>
                      
                      {isAdminView && (
                        <td>
                          <div className="user-info-cell">
                            <div className="user-avatar-small">
                              {reservation.user?.firstName?.charAt(0)}
                              {reservation.user?.lastName?.charAt(0)}
                            </div>
                            <div className="user-details">
                              <strong 
                                className="user-name-link"
                                onClick={() => onViewUser(reservation.user?.id)}
                              >
                                {reservation.user?.firstName} {reservation.user?.lastName}
                              </strong>
                              <small>{reservation.user?.email}</small>
                              <small>Reservas activas: {reservation.user?.activeReservations || 0}</small>
                            </div>
                          </div>
                        </td>
                      )}
                      
                      <td>
                        <div className="date-cell">
                          <div className="date">
                            {new Date(reservation.reservationDate).toLocaleDateString()}
                          </div>
                          <small className="time">
                            {new Date(reservation.reservationDate).toLocaleTimeString()}
                          </small>
                        </div>
                      </td>
                      
                      <td>
                        <div className="expiry-cell">
                          {reservation.expiryDate ? (
                            <>
                              <div className="expiry-date">
                                {new Date(reservation.expiryDate).toLocaleDateString()}
                              </div>
                              <small className="expiry-time">
                                {new Date(reservation.expiryDate).toLocaleTimeString()}
                              </small>
                              <div className="expiry-countdown">
                                {timeUntilExpiry}
                              </div>
                              {expiryStatus}
                            </>
                          ) : (
                            <span className="no-expiry">Sin expiración</span>
                          )}
                        </div>
                      </td>
                      
                      <td>
                        {getStatusBadge(reservation.status)}
                      </td>
                      
                      <td>
                        {getPriorityBadge(reservation.priority)}
                        {reservation.queuePosition && (
                          <small className="queue-position">
                            Posición: {reservation.queuePosition}
                          </small>
                        )}
                      </td>
                      
                      <td>
                        <div className="notification-cell">
                          {reservation.notifiedAt ? (
                            <>
                              <span className="notified-icon">🔔</span>
                              <small className="notification-time">
                                {new Date(reservation.notifiedAt).toLocaleDateString()}
                              </small>
                            </>
                          ) : (
                            <span className="not-notified">No notificada</span>
                          )}
                        </div>
                      </td>
                      
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => {/* Ver detalles */}}
                            title="Ver detalles"
                          >
                            👁️
                          </button>
                          
                          {canConvertToLoan(reservation) && (
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => onConvertToLoan(reservation.id)}
                              title="Convertir a préstamo"
                            >
                              📖
                            </button>
                          )}
                          
                          {canNotify(reservation) && (
                            <button
                              className="btn btn-warning btn-sm"
                              onClick={() => onNotifyUser(reservation.id)}
                              title="Notificar usuario"
                            >
                              🔔
                            </button>
                          )}
                          
                          {canCancel(reservation) && (
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => onCancelReservation(reservation.id)}
                              title="Cancelar reserva"
                            >
                              ✕
                            </button>
                          )}
                          
                          {(reservation.status === 'CANCELLED' || reservation.status === 'EXPIRED') && (
                            <button
                              className="btn btn-outline btn-sm"
                              onClick={() => {/* Reactivar reserva */}}
                              title="Reactivar reserva"
                            >
                              🔄
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="reservations-pagination">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  pageSize={pageSize}
                  totalItems={filteredReservations.length}
                  onPageChange={setCurrentPage}
                  onPageSizeChange={setPageSize}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Información adicional */}
      <div className="reservations-info">
        <div className="info-section">
          <h4>📋 Política de Reservas</h4>
          <ul className="policy-list">
            <li>✅ Las reservas están activas por 48 horas</li>
            <li>✅ Prioridad según fecha de reserva</li>
            <li>✅ Máximo 3 reservas activas por usuario</li>
            <li>⚠️ Reservas expiradas se cancelan automáticamente</li>
            <li>⚠️ 3 cancelaciones consecutivas pueden suspender el servicio</li>
          </ul>
        </div>
        
        <div className="info-section">
          <h4>📊 Resumen de la Cola</h4>
          <div className="queue-summary">
            <div className="queue-item">
              <span className="queue-label">Reservas en espera:</span>
              <span className="queue-value">
                {reservations.filter(r => r.status === 'PENDING').length}
              </span>
            </div>
            <div className="queue-item">
              <span className="queue-label">Próximas a expirar:</span>
              <span className="queue-value">{stats.expiringSoon}</span>
            </div>
            <div className="queue-item">
              <span className="queue-label">Tiempo promedio de espera:</span>
              <span className="queue-value">2.3 días</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationList;