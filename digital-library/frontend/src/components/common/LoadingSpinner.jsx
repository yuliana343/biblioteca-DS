import React from 'react';
import SearchBar from './SearchBar'; 
import './LoadingSpinner.css';

const LoadingSpinner = ({
  size = 'medium',
  color = 'primary',
  message = 'Cargando...',
  fullScreen = false,
  overlay = false,
  type = 'spinner' 
}) => {
  const sizeClasses = {
    small: 'spinner-sm',
    medium: 'spinner-md',
    large: 'spinner-lg',
    xlarge: 'spinner-xl'
  };

  const colorClasses = {
    primary: 'spinner-primary',
    secondary: 'spinner-secondary',
    success: 'spinner-success',
    warning: 'spinner-warning',
    danger: 'spinner-danger',
    info: 'spinner-info',
    light: 'spinner-light',
    dark: 'spinner-dark'
  };

  const renderSpinner = () => {
    switch (type) {
      case 'dots':
        return (
          <div className={`dots-loader ${sizeClasses[size]} ${colorClasses[color]}`}>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        );
      
      case 'pulse':
        return (
          <div className={`pulse-loader ${sizeClasses[size]} ${colorClasses[color]}`}>
            <div className="pulse-ring"></div>
            <div className="pulse-ring delay-1"></div>
            <div className="pulse-ring delay-2"></div>
          </div>
        );
      
      case 'skeleton':
        return (
          <div className="skeleton-loader">
            <div className="skeleton-line"></div>
            <div className="skeleton-line"></div>
            <div className="skeleton-line"></div>
          </div>
        );
      
      default:
        return (
          <div className={`spinner ${sizeClasses[size]} ${colorClasses[color]}`}>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
          </div>
        );
    }
  };

  if (fullScreen) {
    return (
      <div className="fullscreen-loader">
        <div className="loader-content">
          {renderSpinner()}
          {message && <p className="loader-message">{message}</p>}
        </div>
      </div>
    );
  }

  if (overlay) {
    return (
      <div className="overlay-loader">
        <div className="overlay-content">
          {renderSpinner()}
          {message && <p className="loader-message">{message}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="inline-loader">
      {renderSpinner()}
      {message && <p className="loader-message">{message}</p>}
    </div>
  );
};

export const BookSkeleton = () => (
  <div className="book-skeleton">
    <div className="skeleton-cover"></div>
    <div className="skeleton-info">
      <div className="skeleton-title"></div>
      <div className="skeleton-author"></div>
      <div className="skeleton-meta"></div>
    </div>
  </div>
);

export const TableSkeleton = ({ rows = 5, columns = 4 }) => (
  <div className="table-skeleton">
    <div className="skeleton-header">
      {Array.from({ length: columns }).map((_, i) => (
        <div key={i} className="skeleton-header-cell"></div>
      ))}
    </div>
    <div className="skeleton-body">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="skeleton-row">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div key={colIndex} className="skeleton-cell"></div>
          ))}
        </div>
      ))}
    </div>
  </div>
);

export const CardSkeleton = () => (
  <div className="card-skeleton">
    <div className="skeleton-card-header"></div>
    <div className="skeleton-card-body">
      <div className="skeleton-line"></div>
      <div className="skeleton-line"></div>
      <div className="skeleton-line short"></div>
    </div>
    <div className="skeleton-card-footer"></div>
  </div>
);

export default LoadingSpinner;
