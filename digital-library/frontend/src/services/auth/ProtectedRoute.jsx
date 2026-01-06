// services/auth/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ProtectedRoute = ({ 
  children, 
  requireAuth = true, 
  requireAdmin = false,
  requireLibrarian = false,
  requireUser = false,
  redirectTo = '/login'
}) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="auth-loading">
        <LoadingSpinner message="Verificando autenticación..." />
      </div>
    );
  }

  // Si requiere autenticación pero no está autenticado
  if (requireAuth && !isAuthenticated()) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Si está autenticado pero intenta acceder a login/register
  if (!requireAuth && isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }

  // Verificar roles específicos
  if (isAuthenticated()) {
    if (requireAdmin && user.role !== 'ADMIN') {
      return <Navigate to="/unauthorized" replace />;
    }

    if (requireLibrarian && !['ADMIN', 'LIBRARIAN'].includes(user.role)) {
      return <Navigate to="/unauthorized" replace />;
    }

    if (requireUser && user.role !== 'USER') {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;