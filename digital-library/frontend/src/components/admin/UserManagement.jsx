import React, { useState, useEffect } from 'react';
import LoadingSpinner, { TableSkeleton } from '../common/LoadingSpinner';
import Pagination from '../common/Pagination';
import './Admin.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [users, searchTerm, filterRole, filterStatus, sortBy]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Simulación de datos
      const mockUsers = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        username: `user${i + 1}`,
        email: `user${i + 1}@email.com`,
        firstName: ['Juan', 'María', 'Carlos', 'Ana', 'Pedro', 'Laura'][i % 6],
        lastName: ['Pérez', 'García', 'López', 'Martínez', 'González', 'Rodríguez'][i % 6],
        dni: `1234567${String(i).padStart(2, '0')}A`,
        phone: `+34 600 ${String(i).padStart(6, '0')}`,
        role: i === 0 ? 'ADMIN' : i < 5 ? 'LIBRARIAN' : 'USER',
        status: i % 10 === 0 ? 'INACTIVE' : 'ACTIVE',
        registrationDate: new Date(2023, i % 12, (i % 28) + 1).toISOString().split('T')[0],
        lastLogin: i % 3 === 0 ? new Date().toISOString() : null,
        totalLoans: Math.floor(Math.random() * 50),
        activeLoans: Math.floor(Math.random() * 5),
        overdueLoans: i % 15 === 0 ? 1 : 0,
        totalFines: i % 20 === 0 ? (Math.random() * 50).toFixed(2) : '0.00'
      }));

      setTimeout(() => {
        setUsers(mockUsers);
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error loading users:', error);
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let result = [...users];

    // Aplicar filtro por rol
    if (filterRole !== 'all') {
      result = result.filter(user => user.role === filterRole);
    }

    // Aplicar filtro por estado
    if (filterStatus !== 'all') {
      result = result.filter(user => user.status === filterStatus);
    }

    // Aplicar búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(user => 
        user.firstName.toLowerCase().includes(term) ||
        user.lastName.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.username.toLowerCase().includes(term) ||
        user.dni.toLowerCase().includes(term)
      );
    }

    // Aplicar ordenación
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
        case 'email':
          return a.email.localeCompare(b.email);
        case 'role':
          return a.role.localeCompare(b.role);
        case 'status':
          return a.status.localeCompare(b.status);
        case 'registrationDate':
          return new Date(b.registrationDate) - new Date(a.registrationDate);
        case 'totalLoans':
          return b.totalLoans - a.totalLoans;
        default:
          return 0;
      }
    });

    setFilteredUsers(result);
    setCurrentPage(1); // Resetear a primera página
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  const handleSelectAll = () => {
    const pageUsers = getCurrentPageUsers();
    if (selectedUsers.length === pageUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(pageUsers.map(user => user.id));
    }
  };

  const handleBulkAction = (action) => {
    if (selectedUsers.length === 0) {
      alert('Por favor selecciona al menos un usuario');
      return;
    }

    switch (action) {
      case 'activate':
        if (window.confirm(`¿Activar ${selectedUsers.length} usuario(s)?`)) {
          // Lógica de activación
          console.log('Activating users:', selectedUsers);
          setSelectedUsers([]);
        }
        break;
      case 'deactivate':
        if (window.confirm(`¿Desactivar ${selectedUsers.length} usuario(s)?`)) {
          // Lógica de desactivación
          console.log('Deactivating users:', selectedUsers);
          setSelectedUsers([]);
        }
        break;
      case 'delete':
        if (window.confirm(`¿Eliminar ${selectedUsers.length} usuario(s)? Esta acción no se puede deshacer.`)) {
          // Lógica de eliminación
          console.log('Deleting users:', selectedUsers);
          setSelectedUsers([]);
        }
        break;
      case 'export':
        // Lógica de exportación
        console.log('Exporting users:', selectedUsers);
        break;
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowUserModal(true);
  };

  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      console.log('Deleting user:', userToDelete.id);
      // Lógica de eliminación
      setShowDeleteConfirm(false);
      setUserToDelete(null);
    }
  };

  const getCurrentPageUsers = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredUsers.slice(startIndex, endIndex);
  };

  const getRoleBadge = (role) => {
    const roles = {
      ADMIN: { label: 'Administrador', color: 'error' },
      LIBRARIAN: { label: 'Bibliotecario', color: 'warning' },
      USER: { label: 'Usuario', color: 'success' }
    };
    
    const roleInfo = roles[role] || { label: role, color: 'secondary' };
    return <span className={`badge badge-${roleInfo.color}`}>{roleInfo.label}</span>;
  };

  const getStatusBadge = (status) => {
    return status === 'ACTIVE' 
      ? <span className="badge badge-success">Activo</span>
      : <span className="badge badge-error">Inactivo</span>;
  };

  const getUserStats = () => {
    const total = users.length;
    const active = users.filter(u => u.status === 'ACTIVE').length;
    const admins = users.filter(u => u.role === 'ADMIN').length;
    const librarians = users.filter(u => u.role === 'LIBRARIAN').length;
    const regularUsers = users.filter(u => u.role === 'USER').length;

    return { total, active, admins, librarians, regularUsers };
  };

  const stats = getUserStats();

  if (loading) {
    return (
      <div className="user-management">
        <div className="management-header">
          <h1>Gestión de Usuarios</h1>
          <TableSkeleton rows={5} columns={8} />
        </div>
      </div>
    );
  }

  const currentPageUsers = getCurrentPageUsers();
  const totalPages = Math.ceil(filteredUsers.length / pageSize);

  return (
    <div className="user-management">
      {/* Header */}
      <div className="management-header">
        <div className="header-left">
          <h1>Gestión de Usuarios</h1>
          <p className="subtitle">Administra usuarios del sistema</p>
        </div>
        <div className="header-right">
          <button 
            className="btn btn-primary"
            onClick={() => setShowUserModal(true)}
          >
            <span className="btn-icon">➕</span>
            Nuevo Usuario
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="management-stats">
        <div className="stat-card">
          <div className="stat-icon primary">👥</div>
          <div className="stat-info">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Usuarios Totales</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon success">✅</div>
          <div className="stat-info">
            <div className="stat-value">{stats.active}</div>
            <div className="stat-label">Activos</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon warning">👑</div>
          <div className="stat-info">
            <div className="stat-value">{stats.admins}</div>
            <div className="stat-label">Administradores</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon info">📚</div>
          <div className="stat-info">
            <div className="stat-value">{stats.librarians}</div>
            <div className="stat-label">Bibliotecarios</div>
          </div>
        </div>
      </div>

      {/* Acciones masivas */}
      {selectedUsers.length > 0 && (
        <div className="bulk-actions">
          <div className="bulk-info">
            <span className="selected-count">
              {selectedUsers.length} usuario(s) seleccionado(s)
            </span>
          </div>
          <div className="bulk-buttons">
            <button
              className="btn btn-success"
              onClick={() => handleBulkAction('activate')}
            >
              <span className="btn-icon">✅</span>
              Activar
            </button>
            <button
              className="btn btn-warning"
              onClick={() => handleBulkAction('deactivate')}
            >
              <span className="btn-icon">⏸️</span>
              Desactivar
            </button>
            <button
              className="btn btn-danger"
              onClick={() => handleBulkAction('delete')}
            >
              <span className="btn-icon">🗑️</span>
              Eliminar
            </button>
            <button
              className="btn btn-outline"
              onClick={() => handleBulkAction('export')}
            >
              <span className="btn-icon">📥</span>
              Exportar
            </button>
            <button
              className="btn btn-outline"
              onClick={() => setSelectedUsers([])}
            >
              <span className="btn-icon">✕</span>
              Limpiar
            </button>
          </div>
        </div>
      )}

      {/* Controles */}
      <div className="management-controls">
        <div className="controls-left">
          <div className="search-box">
            <input
              type="text"
              placeholder="Buscar por nombre, email, DNI..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>

          <div className="filter-group">
            <select 
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="filter-select"
            >
              <option value="all">Todos los roles</option>
              <option value="ADMIN">Administradores</option>
              <option value="LIBRARIAN">Bibliotecarios</option>
              <option value="USER">Usuarios</option>
            </select>

            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="all">Todos los estados</option>
              <option value="ACTIVE">Activos</option>
              <option value="INACTIVE">Inactivos</option>
            </select>
          </div>
        </div>

        <div className="controls-right">
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="name">Ordenar por: Nombre</option>
            <option value="email">Email</option>
            <option value="role">Rol</option>
            <option value="status">Estado</option>
            <option value="registrationDate">Fecha registro (nuevo)</option>
            <option value="totalLoans">Total préstamos (alto)</option>
          </select>

          <button 
            className="btn btn-outline"
            onClick={fetchUsers}
          >
            <span className="btn-icon">🔄</span>
            Actualizar
          </button>
        </div>
      </div>

      {/* Tabla de usuarios */}
      <div className="users-table-container">
        {filteredUsers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👤</div>
            <h3>No se encontraron usuarios</h3>
            <p>No hay usuarios que coincidan con los filtros aplicados</p>
            <button 
              className="btn btn-outline"
              onClick={() => {
                setSearchTerm('');
                setFilterRole('all');
                setFilterStatus('all');
              }}
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <>
            <table className="users-table">
              <thead>
                <tr>
                  <th style={{ width: '40px' }}>
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === currentPageUsers.length && currentPageUsers.length > 0}
                      onChange={handleSelectAll}
                      className="select-checkbox"
                    />
                  </th>
                  <th>Usuario</th>
                  <th>Información de Contacto</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Actividad</th>
                  <th>Fecha Registro</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentPageUsers.map(user => (
                  <tr key={user.id} className={`user-row ${user.status.toLowerCase()}`}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleSelectUser(user.id)}
                        className="select-checkbox"
                      />
                    </td>
                    <td>
                      <div className="user-info">
                        <div className="user-avatar">
                          {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                        </div>
                        <div className="user-details">
                          <div className="user-name">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="user-username">@{user.username}</div>
                          <div className="user-dni">DNI: {user.dni}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="contact-info">
                        <div className="contact-email">{user.email}</div>
                        <div className="contact-phone">{user.phone}</div>
                      </div>
                    </td>
                    <td>{getRoleBadge(user.role)}</td>
                    <td>
                      {getStatusBadge(user.status)}
                      {user.lastLogin && (
                        <div className="last-login">
                          Último acceso: {new Date(user.lastLogin).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="user-stats">
                        <div className="stat-item">
                          <span className="stat-label">Préstamos:</span>
                          <span className="stat-value">{user.totalLoans}</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">Activos:</span>
                          <span className="stat-value">{user.activeLoans}</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">Vencidos:</span>
                          <span className={`stat-value ${user.overdueLoans > 0 ? 'error' : ''}`}>
                            {user.overdueLoans}
                          </span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">Multas:</span>
                          <span className={`stat-value ${parseFloat(user.totalFines) > 0 ? 'warning' : ''}`}>
                            ${user.totalFines}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="registration-info">
                        <div className="registration-date">
                          {new Date(user.registrationDate).toLocaleDateString()}
                        </div>
                        <div className="registration-days">
                          {Math.floor((new Date() - new Date(user.registrationDate)) / (1000 * 60 * 60 * 24))} días
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => handleEditUser(user)}
                          title="Editar usuario"
                        >
                          ✏️
                        </button>
                        <button
                          className={`btn btn-sm ${user.status === 'ACTIVE' ? 'btn-warning' : 'btn-success'}`}
                          onClick={() => {/* Toggle status */}}
                          title={user.status === 'ACTIVE' ? 'Desactivar' : 'Activar'}
                        >
                          {user.status === 'ACTIVE' ? '⏸️' : '▶️'}
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteUser(user)}
                          title="Eliminar usuario"
                        >
                          🗑️
                        </button>
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => {/* Ver historial */}}
                          title="Ver historial"
                        >
                          📊
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="users-pagination">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  pageSize={pageSize}
                  totalItems={filteredUsers.length}
                  onPageChange={setCurrentPage}
                  onPageSizeChange={setPageSize}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Resumen */}
      <div className="management-summary">
        <div className="summary-section">
          <h4>📊 Resumen de Usuarios</h4>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-label">Usuarios nuevos (mes):</span>
              <span className="summary-value">+45</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Tasa de actividad:</span>
              <span className="summary-value">78%</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Promedio de préstamos:</span>
              <span className="summary-value">12.4 por usuario</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Usuarios con multas:</span>
              <span className="summary-value">8 (4.5%)</span>
            </div>
          </div>
        </div>

        <div className="summary-actions">
          <button className="btn btn-outline">
            <span className="btn-icon">📥</span>
            Exportar todos
          </button>
          <button className="btn btn-primary">
            <span className="btn-icon">📧</span>
            Enviar anuncio
          </button>
        </div>
      </div>

      {/* Modal de confirmación de eliminación */}
      {showDeleteConfirm && userToDelete && (
        <div className="modal-overlay">
          <div className="modal-container confirm-modal">
            <div className="modal-header">
              <h3>⚠️ Confirmar Eliminación</h3>
              <button 
                className="modal-close"
                onClick={() => setShowDeleteConfirm(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <div className="confirm-icon">🗑️</div>
              <h4>¿Eliminar usuario permanentemente?</h4>
              <p>
                Estás a punto de eliminar al usuario <strong>{userToDelete.firstName} {userToDelete.lastName}</strong> ({userToDelete.email}).
              </p>
              <div className="warning-box">
                <span className="warning-icon">⚠️</span>
                <p>
                  Esta acción no se puede deshacer. Se eliminarán todos los datos del usuario, 
                  excepto los registros de préstamos y transacciones históricas.
                </p>
              </div>
              <div className="modal-actions">
                <button
                  className="btn btn-outline"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancelar
                </button>
                <button
                  className="btn btn-danger"
                  onClick={confirmDelete}
                >
                  Eliminar Permanentemente
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de usuario (se puede expandir para edición/creación) */}
      {showUserModal && (
        <div className="modal-overlay">
          <div className="modal-container user-modal">
            <div className="modal-header">
              <h3>{editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}</h3>
              <button 
                className="modal-close"
                onClick={() => {
                  setShowUserModal(false);
                  setEditingUser(null);
                }}
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <div className="modal-placeholder">
                <span className="placeholder-icon">👤</span>
                <p>Formulario de usuario {editingUser ? 'para edición' : 'para creación'}</p>
                <small>Esta funcionalidad se implementará en la siguiente fase</small>
              </div>
              <div className="modal-actions">
                <button
                  className="btn btn-outline"
                  onClick={() => {
                    setShowUserModal(false);
                    setEditingUser(null);
                  }}
                >
                  Cancelar
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    // Lógica para guardar usuario
                    setShowUserModal(false);
                    setEditingUser(null);
                  }}
                >
                  {editingUser ? 'Guardar Cambios' : 'Crear Usuario'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;