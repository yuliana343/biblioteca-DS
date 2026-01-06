// src/routes.js
import React from 'react';

// Importación de páginas
const HomePage = React.lazy(() => import('./pages/HomePage'));
const CatalogPage = React.lazy(() => import('./pages/CatalogPage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));
const MyLoansPage = React.lazy(() => import('./pages/MyLoansPage'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));
const AdminPage = React.lazy(() => import('./pages/AdminPage'));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'));

// Importación de componentes de administración
const Dashboard = React.lazy(() => import('./components/admin/Dashboard'));
const UserManagement = React.lazy(() => import('./components/admin/UserManagement'));
const Reports = React.lazy(() => import('./components/admin/Reports'));
const Statistics = React.lazy(() => import('./components/admin/Statistics'));

// Importación de componentes de catálogo
const BookList = React.lazy(() => import('./components/books/BookList'));
const BookDetails = React.lazy(() => import('./components/books/BookDetails'));

// Importación de componentes de préstamos
const ActiveLoans = React.lazy(() => import('./components/loans/ActiveLoans'));
const LoanHistory = React.lazy(() => import('./components/loans/LoanHistory'));

// Rutas principales
export const publicRoutes = [
  {
    path: '/',
    element: <HomePage />,
    name: 'Inicio',
    exact: true
  },
  {
    path: '/catalogo',
    element: <CatalogPage />,
    name: 'Catálogo',
    children: [
      {
        path: '',
        element: <BookList />,
        name: 'Todos los libros'
      },
      {
        path: ':bookId',
        element: <BookDetails />,
        name: 'Detalles del libro'
      }
    ]
  },
  {
    path: '/login',
    element: <LoginPage />,
    name: 'Iniciar Sesión'
  }
];

// Rutas de usuario autenticado
export const userRoutes = [
  {
    path: '/prestamos',
    element: <MyLoansPage />,
    name: 'Mis Préstamos',
    children: [
      {
        path: 'activos',
        element: <ActiveLoans />,
        name: 'Préstamos Activos'
      },
      {
        path: 'historial',
        element: <LoanHistory />,
        name: 'Historial'
      }
    ]
  },
  {
    path: '/perfil',
    element: <ProfilePage />,
    name: 'Mi Perfil'
  }
];

// Rutas de bibliotecario
export const librarianRoutes = [
  ...userRoutes,
  {
    path: '/dashboard',
    element: <DashboardPage />,
    name: 'Panel de Control',
    icon: '📊'
  }
];

// Rutas de administrador
export const adminRoutes = [
  ...librarianRoutes,
  {
    path: '/admin',
    element: <AdminPage />,
    name: 'Administración',
    icon: '⚙️',
    children: [
      {
        path: 'dashboard',
        element: <Dashboard />,
        name: 'Dashboard',
        icon: '📊'
      },
      {
        path: 'usuarios',
        element: <UserManagement />,
        name: 'Usuarios',
        icon: '👥'
      },
      {
        path: 'reportes',
        element: <Reports />,
        name: 'Reportes',
        icon: '📄'
      },
      {
        path: 'estadisticas',
        element: <Statistics />,
        name: 'Estadísticas',
        icon: '📈'
      }
    ]
  }
];

// Rutas para manejo de errores
export const errorRoutes = [
  {
    path: '*',
    element: <NotFoundPage />,
    name: 'Página No Encontrada'
  }
];

// Función para generar rutas según el rol
export const getRoutesByRole = (role) => {
  switch (role) {
    case 'ADMIN':
      return [...publicRoutes, ...adminRoutes];
    case 'LIBRARIAN':
      return [...publicRoutes, ...librarianRoutes];
    case 'USER':
      return [...publicRoutes, ...userRoutes];
    default:
      return publicRoutes;
  }
};

// Función para generar menú de navegación según el rol
export const getMenuItemsByRole = (role) => {
  const baseMenu = [
    { path: '/', name: 'Inicio', icon: '🏠' },
    { path: '/catalogo', name: 'Catálogo', icon: '📚' }
  ];

  switch (role) {
    case 'ADMIN':
      return [
        ...baseMenu,
        { path: '/admin/dashboard', name: 'Dashboard', icon: '📊' },
        { path: '/admin/usuarios', name: 'Usuarios', icon: '👥' },
        { path: '/admin/reportes', name: 'Reportes', icon: '📄' },
        { path: '/admin/estadisticas', name: 'Estadísticas', icon: '📈' },
        { path: '/prestamos', name: 'Préstamos', icon: '📖' },
        { path: '/perfil', name: 'Perfil', icon: '👤' }
      ];
    case 'LIBRARIAN':
      return [
        ...baseMenu,
        { path: '/dashboard', name: 'Panel', icon: '📊' },
        { path: '/prestamos', name: 'Préstamos', icon: '📖' },
        { path: '/perfil', name: 'Perfil', icon: '👤' }
      ];
    case 'USER':
      return [
        ...baseMenu,
        { path: '/prestamos', name: 'Mis Préstamos', icon: '📖' },
        { path: '/perfil', name: 'Mi Perfil', icon: '👤' }
      ];
    default:
      return [
        ...baseMenu,
        { path: '/login', name: 'Iniciar Sesión', icon: '🔑' }
      ];
  }
};

// Configuración de la aplicación
export const appConfig = {
  name: 'Biblioteca Digital',
  version: '1.0.0',
  apiBaseUrl: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
  defaultPageSize: 10,
  maxRenewals: 3,
  loanDuration: 14, // días
  reservationExpiry: 48 // horas
};