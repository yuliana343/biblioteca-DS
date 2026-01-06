import React, { useState, useEffect } from 'react';
import { useAuth } from '../services/auth/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [stats, setStats] = useState(null);
  
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    dni: '',
    birthDate: '',
    preferences: {
      notifications: true,
      emailUpdates: true,
      darkMode: false,
      language: 'es'
    }
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      // Simular carga de datos del usuario
      setProfileData({
        firstName: 'Juan',
        lastName: 'Pérez',
        email: user.email || 'usuario@ejemplo.com',
        phone: '+34 600 123 456',
        address: 'Calle Principal 123, Ciudad',
        dni: '12345678A',
        birthDate: '1990-01-01',
        preferences: {
          notifications: true,
          emailUpdates: true,
          darkMode: false,
          language: 'es'
        }
      });

      // Simular estadísticas
      setStats({
        totalLoans: 45,
        currentLoans: 2,
        overdueLoans: 0,
        totalReservations: 12,
        favoriteCategory: 'Ficción',
        memberSince: '2020-03-15',
        lastLogin: new Date().toISOString()
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('preferences.')) {
      const prefKey = name.split('.')[1];
      setProfileData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [prefKey]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Lógica para guardar perfil
      alert('Perfil actualizado exitosamente');
      updateProfile(profileData);
    } catch (error) {
      alert('Error al actualizar el perfil');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      alert('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    setSaving(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert('Contraseña cambiada exitosamente');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      alert('Error al cambiar la contraseña');
    } finally {
      setSaving(false);
    }
  };

  const handleUploadPhoto = () => {
    // Lógica para subir foto
    alert('Funcionalidad de subir foto en desarrollo');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      alert('Funcionalidad de eliminar cuenta en desarrollo');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading || !user || !stats) {
    return (
      <div className="profile-page">
        <div className="profile-loading">
          <LoadingSpinner message="Cargando perfil..." />
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      {/* Header */}
      <div className="profile-header">
        <div className="header-content">
          <h1>👤 Mi Perfil</h1>
          <p className="subtitle">Gestiona tu información personal y preferencias</p>
        </div>
        <div className="header-stats">
          <div className="mini-stat">
            <span className="stat-value">{stats.totalLoans}</span>
            <span className="stat-label">Préstamos</span>
          </div>
          <div className="mini-stat">
            <span className="stat-value">{stats.currentLoans}</span>
            <span className="stat-label">Activos</span>
          </div>
          <div className="mini-stat">
            <span className="stat-value">{stats.totalReservations}</span>
            <span className="stat-label">Reservas</span>
          </div>
        </div>
      </div>

      <div className="profile-content">
        {/* Left Column - Avatar and Stats */}
        <div className="profile-sidebar">
          <div className="avatar-section">
            <div className="avatar-container">
              <div className="avatar">
                {profileData.firstName.charAt(0)}{profileData.lastName.charAt(0)}
              </div>
              <button 
                className="avatar-upload"
                onClick={handleUploadPhoto}
              >
                📷 Cambiar foto
              </button>
            </div>
            <div className="user-info">
              <h2 className="user-name">
                {profileData.firstName} {profileData.lastName}
              </h2>
              <p className="user-email">{profileData.email}</p>
              <p className="user-role">
                <span className="role-badge">{user.role}</span>
              </p>
              <p className="member-since">
                Miembro desde: {formatDate(stats.memberSince)}
              </p>
            </div>
          </div>

          <div className="quick-stats">
            <div className="stat-card">
              <div className="stat-icon">📖</div>
              <div className="stat-details">
                <div className="stat-title">Préstamos Totales</div>
                <div className="stat-value">{stats.totalLoans}</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📅</div>
              <div className="stat-details">
                <div className="stat-title">Reservas</div>
                <div className="stat-value">{stats.totalReservations}</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <div className="stat-details">
                <div className="stat-title">Categoría Favorita</div>
                <div className="stat-value">{stats.favoriteCategory}</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-details">
                <div className="stat-title">Estado</div>
                <div className="stat-value status-active">Activo</div>
              </div>
            </div>
          </div>

          <div className="sidebar-actions">
            <Link to="/my-loans" className="sidebar-link">
              <span className="link-icon">📖</span>
              <span className="link-text">Mis Préstamos</span>
            </Link>
            <Link to="/reservations" className="sidebar-link">
              <span className="link-icon">📅</span>
              <span className="link-text">Mis Reservas</span>
            </Link>
            <Link to="/history" className="sidebar-link">
              <span className="link-icon">📊</span>
              <span className="link-text">Mi Historial</span>
            </Link>
            <Link to="/notifications" className="sidebar-link">
              <span className="link-icon">🔔</span>
              <span className="link-text">Notificaciones</span>
            </Link>
          </div>
        </div>

        {/* Right Column - Content */}
        <div className="profile-main">
          {/* Tabs */}
          <div className="profile-tabs">
            <button
              className={`profile-tab ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              📝 Información Personal
            </button>
            <button
              className={`profile-tab ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              🔒 Seguridad
            </button>
            <button
              className={`profile-tab ${activeTab === 'preferences' ? 'active' : ''}`}
              onClick={() => setActiveTab('preferences')}
            >
              ⚙️ Preferencias
            </button>
            <button
              className={`profile-tab ${activeTab === 'activity' ? 'active' : ''}`}
              onClick={() => setActiveTab('activity')}
            >
              📊 Actividad
            </button>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === 'profile' && (
              <form onSubmit={handleSaveProfile} className="profile-form">
                <div className="form-section">
                  <h3>Información Personal</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Nombre</label>
                      <input
                        type="text"
                        name="firstName"
                        value={profileData.firstName}
                        onChange={handleProfileChange}
                        className="form-input"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Apellido</label>
                      <input
                        type="text"
                        name="lastName"
                        value={profileData.lastName}
                        onChange={handleProfileChange}
                        className="form-input"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleProfileChange}
                        className="form-input"
                        required
                        disabled
                      />
                      <small className="form-help">
                        Contacta con administración para cambiar el email
                      </small>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Teléfono</label>
                      <input
                        type="tel"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleProfileChange}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">DNI/NIE</label>
                    <input
                      type="text"
                      name="dni"
                      value={profileData.dni}
                      onChange={handleProfileChange}
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Fecha de Nacimiento</label>
                    <input
                      type="date"
                      name="birthDate"
                      value={profileData.birthDate}
                      onChange={handleProfileChange}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Dirección</label>
                    <textarea
                      name="address"
                      value={profileData.address}
                      onChange={handleProfileChange}
                      className="form-input"
                      rows="3"
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={saving}
                  >
                    {saving ? 'Guardando...' : 'Guardar Cambios'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => window.location.reload()}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'security' && (
              <form onSubmit={handleChangePassword} className="security-form">
                <div className="form-section">
                  <h3>Cambiar Contraseña</h3>
                  <div className="form-group">
                    <label className="form-label">Contraseña Actual</label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="form-input"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Nueva Contraseña</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="form-input"
                      required
                    />
                    <small className="form-help">
                      Mínimo 6 caracteres
                    </small>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Confirmar Nueva Contraseña</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={saving}
                  >
                    {saving ? 'Cambiando...' : 'Cambiar Contraseña'}
                  </button>
                </div>

                <div className="security-notes">
                  <h4>🔐 Recomendaciones de Seguridad</h4>
                  <ul>
                    <li>Usa una contraseña única para esta cuenta</li>
                    <li>Incluye mayúsculas, minúsculas, números y símbolos</li>
                    <li>No uses información personal en tu contraseña</li>
                    <li>Cambia tu contraseña regularmente</li>
                  </ul>
                </div>
              </form>
            )}

            {activeTab === 'preferences' && (
              <div className="preferences-form">
                <div className="form-section">
                  <h3>Preferencias de Notificaciones</h3>
                  
                  <div className="preference-item">
                    <label className="preference-label">
                      <input
                        type="checkbox"
                        name="preferences.notifications"
                        checked={profileData.preferences.notifications}
                        onChange={handleProfileChange}
                      />
                      <div className="preference-content">
                        <h4>Notificaciones del Sistema</h4>
                        <p>Recibir notificaciones sobre préstamos, reservas y recordatorios</p>
                      </div>
                    </label>
                  </div>

                  <div className="preference-item">
                    <label className="preference-label">
                      <input
                        type="checkbox"
                        name="preferences.emailUpdates"
                        checked={profileData.preferences.emailUpdates}
                        onChange={handleProfileChange}
                      />
                      <div className="preference-content">
                        <h4>Actualizaciones por Email</h4>
                        <p>Recibir novedades y promociones por correo electrónico</p>
                      </div>
                    </label>
                  </div>

                  <div className="preference-item">
                    <label className="preference-label">
                      <input
                        type="checkbox"
                        name="preferences.darkMode"
                        checked={profileData.preferences.darkMode}
                        onChange={handleProfileChange}
                      />
                      <div className="preference-content">
                        <h4>Modo Oscuro</h4>
                        <p>Usar tema oscuro en la interfaz</p>
                      </div>
                    </label>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Idioma</label>
                    <select
                      name="preferences.language"
                      value={profileData.preferences.language}
                      onChange={handleProfileChange}
                      className="form-select"
                    >
                      <option value="es">Español</option>
                      <option value="en">English</option>
                      <option value="fr">Français</option>
                    </select>
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSaveProfile}
                    disabled={saving}
                  >
                    {saving ? 'Guardando...' : 'Guardar Preferencias'}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="activity-content">
                <div className="activity-section">
                  <h3>📊 Tu Actividad</h3>
                  
                  <div className="activity-stats">
                    <div className="activity-stat">
                      <div className="stat-icon">📖</div>
                      <div className="stat-info">
                        <div className="stat-value">{stats.totalLoans}</div>
                        <div className="stat-label">Préstamos Totales</div>
                      </div>
                    </div>
                    
                    <div className="activity-stat">
                      <div className="stat-icon">📅</div>
                      <div className="stat-info">
                        <div className="stat-value">{stats.totalReservations}</div>
                        <div className="stat-label">Reservas Realizadas</div>
                      </div>
                    </div>
                    
                    <div className="activity-stat">
                      <div className="stat-icon">⭐</div>
                      <div className="stat-info">
                        <div className="stat-value">4.8</div>
                        <div className="stat-label">Rating Promedio</div>
                      </div>
                    </div>
                    
                    <div className="activity-stat">
                      <div className="stat-icon">🕒</div>
                      <div className="stat-info">
                        <div className="stat-value">45h 30m</div>
                        <div className="stat-label">Tiempo de Lectura</div>
                      </div>
                    </div>
                  </div>

                  <div className="recent-activity">
                    <h4>Actividad Reciente</h4>
                    <div className="activity-list">
                      <div className="activity-item">
                        <div className="activity-icon">📖</div>
                        <div className="activity-content">
                          <div className="activity-title">Préstamo realizado</div>
                          <div className="activity-desc">"Cien años de soledad"</div>
                          <div className="activity-time">Hace 2 días</div>
                        </div>
                      </div>
                      <div className="activity-item">
                        <div className="activity-icon">📚</div>
                        <div className="activity-content">
                          <div className="activity-title">Libro devuelto</div>
                          <div className="activity-desc">"El principito"</div>
                          <div className="activity-time">Hace 1 semana</div>
                        </div>
                      </div>
                      <div className="activity-item">
                        <div className="activity-icon">📅</div>
                        <div className="activity-content">
                          <div className="activity-title">Reserva creada</div>
                          <div className="activity-desc">"Breve historia del tiempo"</div>
                          <div className="activity-time">Hace 2 semanas</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="export-section">
                    <button className="btn btn-outline">
                      <span className="btn-icon">📥</span>
                      Exportar Historial Completo
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Danger Zone */}
          {activeTab === 'profile' && (
            <div className="danger-zone">
              <h3>⚠️ Zona de Peligro</h3>
              <div className="danger-content">
                <p>
                  Estas acciones son permanentes y no se pueden deshacer. 
                  Por favor, procede con precaución.
                </p>
                <div className="danger-actions">
                  <button
                    className="btn btn-danger"
                    onClick={handleDeleteAccount}
                  >
                    🗑️ Eliminar Mi Cuenta
                  </button>
                  <button
                    className="btn btn-warning"
                    onClick={() => alert('Funcionalidad de desactivar cuenta en desarrollo')}
                  >
                    ⏸️ Desactivar Cuenta Temporalmente
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;