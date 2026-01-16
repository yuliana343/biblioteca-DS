
import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../api/authService';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = authService.getToken();
        if (token) {
          const currentUser = authService.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
          }
        }
      } catch (err) {
        console.error('Error al inicializar autenticación:', err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await authService.login(email, password);
      setUser(result.user);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Login con demo
  const demoLogin = async (role = 'USER') => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await authService.demoLogin(role);
      setUser(result.user);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Registro
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await authService.register(userData);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    setLoading(true);
    
    try {
      authService.logout();
      setUser(null);
      setError(null);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar perfil
  const updateProfile = async (userId, userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await authService.updateProfile(userId, userData);
      setUser(result.user || { ...user, ...userData });
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Cambiar contraseña
  const changePassword = async (userId, passwordData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await authService.changePassword(userId, passwordData);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Verificar si está autenticado
  const isAuthenticated = () => {
    return authService.isAuthenticated();
  };

  // Verificar rol
  const hasRole = (role) => {
    if (!user) return false;
    return user.role === role;
  };

  // Verificar cualquier rol de una lista
  const hasAnyRole = (roles) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  // Verificar todos los roles de una lista
  const hasAllRoles = (roles) => {
    if (!user) return false;
    return roles.every(role => user.roles?.includes(role));
  };

  // Obtener token
  const getToken = () => {
    return authService.getToken();
  };

  // Limpiar error
  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    demoLogin,
    register,
    logout,
    updateProfile,
    changePassword,
    isAuthenticated,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    getToken,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
