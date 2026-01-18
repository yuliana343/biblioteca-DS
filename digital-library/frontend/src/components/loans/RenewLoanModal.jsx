import React, { useState, useEffect } from 'react';
import './Loans.css';

const RenewLoanModal = ({ loan, onClose, onConfirm }) => {
  const [newDueDate, setNewDueDate] = useState('');
  const [renewalDays, setRenewalDays] = useState(14);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (loan) { 
      const currentDueDate = new Date(loan.dueDate);
      const newDate = new Date(currentDueDate);
      newDate.setDate(newDate.getDate() + renewalDays);
      
      setNewDueDate(newDate.toISOString().split('T')[0]);
    }
  }, [loan, renewalDays]);

  const validateRenewal = () => {
    if (!newDueDate) {
      setError('Por favor selecciona una fecha válida');
      return false;
    }

    const maxRenewalDays = 30;  
    const currentDueDate = new Date(loan.dueDate);
    const proposedDueDate = new Date(newDueDate);
    const daysDiff = Math.floor((proposedDueDate - currentDueDate) / (1000 * 60 * 60 * 24));

    if (daysDiff > maxRenewalDays) {
      setError(`No puedes renovar por más de ${maxRenewalDays} días`);
      return false;
    }

    if (daysDiff <= 0) {
      setError('La nueva fecha debe ser posterior a la fecha actual de vencimiento');
      return false;
    }

    if (loan.renewalsCount >= 3) {
      setError('Has alcanzado el límite máximo de renovaciones (3)');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateRenewal()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onConfirm(loan.id, newDueDate);
      
    } catch (err) {
      setError(err.message || 'Error al renovar el préstamo');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDaysChange = (days) => {
    setRenewalDays(days);
    setError('');
  };

  if (!loan) return null;

  const today = new Date();
  const currentDueDate = new Date(loan.dueDate);
  const isOverdue = currentDueDate < today;
  const daysOverdue = isOverdue 
    ? Math.floor((today - currentDueDate) / (1000 * 60 * 60 * 24))
    : 0;

  const calculateFineIfOverdue = () => {
    if (!isOverdue) return 0;
   
    return daysOverdue * 1;
  };

  const fineAmount = calculateFineIfOverdue();

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>Renovar Préstamo</h3>
          <button 
            className="modal-close"
            onClick={onClose}
            disabled={isSubmitting}
          >
            ×
          </button>
        </div>

        <div className="modal-content">
          {/* Información del préstamo */}
          <div className="loan-info">
            <div className="info-header">
              <h4>Detalles del Préstamo</h4>
            </div>
            
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Libro:</span>
                <span className="info-value">{loan.book?.title || 'N/A'}</span>
              </div>
              
              <div className="info-item">
                <span className="info-label">Usuario:</span>
                <span className="info-value">
                  {loan.user?.firstName} {loan.user?.lastName}
                </span>
              </div>
              
              <div className="info-item">
                <span className="info-label">Fecha de préstamo:</span>
                <span className="info-value">
                  {new Date(loan.loanDate).toLocaleDateString()}
                </span>
              </div>
              
              <div className="info-item">
                <span className="info-label">Vencimiento actual:</span>
                <span className={`info-value ${isOverdue ? 'overdue' : ''}`}>
                  {new Date(loan.dueDate).toLocaleDateString()}
                  {isOverdue && (
                    <span className="overdue-badge"> (Vencido)</span>
                  )}
                </span>
              </div>
              
              <div className="info-item">
                <span className="info-label">Renovaciones previas:</span>
                <span className="info-value">{loan.renewalsCount || 0}/3</span>
              </div>
              
              <div className="info-item">
                <span className="info-label">Días de retraso:</span>
                <span className="info-value">
                  {isOverdue ? `${daysOverdue} días` : 'Ninguno'}
                </span>
              </div>
            </div>
          </div>

          {/* Opciones de renovación */}
          <form onSubmit={handleSubmit} className="renewal-form">
            <div className="form-section">
              <h4>Opciones de Renovación</h4>
              
              <div className="days-options">
                <div className="days-option">
                  <input
                    type="radio"
                    id="days7"
                    name="renewalDays"
                    checked={renewalDays === 7}
                    onChange={() => handleDaysChange(7)}
                    disabled={isSubmitting}
                  />
                  <label htmlFor="days7">
                    <span className="option-label">7 días</span>
                    <span className="option-date">
                      {(() => {
                        const date = new Date(currentDueDate);
                        date.setDate(date.getDate() + 7);
                        return date.toLocaleDateString();
                      })()}
                    </span>
                  </label>
                </div>
                
                <div className="days-option">
                  <input
                    type="radio"
                    id="days14"
                    name="renewalDays"
                    checked={renewalDays === 14}
                    onChange={() => handleDaysChange(14)}
                    disabled={isSubmitting}
                  />
                  <label htmlFor="days14">
                    <span className="option-label">14 días (recomendado)</span>
                    <span className="option-date">
                      {(() => {
                        const date = new Date(currentDueDate);
                        date.setDate(date.getDate() + 14);
                        return date.toLocaleDateString();
                      })()}
                    </span>
                  </label>
                </div>
                
                <div className="days-option">
                  <input
                    type="radio"
                    id="days21"
                    name="renewalDays"
                    checked={renewalDays === 21}
                    onChange={() => handleDaysChange(21)}
                    disabled={isSubmitting}
                  />
                  <label htmlFor="days21">
                    <span className="option-label">21 días</span>
                    <span className="option-date">
                      {(() => {
                        const date = new Date(currentDueDate);
                        date.setDate(date.getDate() + 21);
                        return date.toLocaleDateString();
                      })()}
                    </span>
                  </label>
                </div>
                
                <div className="days-option">
                  <input
                    type="radio"
                    id="days30"
                    name="renewalDays"
                    checked={renewalDays === 30}
                    onChange={() => handleDaysChange(30)}
                    disabled={isSubmitting}
                  />
                  <label htmlFor="days30">
                    <span className="option-label">30 días (máximo)</span>
                    <span className="option-date">
                      {(() => {
                        const date = new Date(currentDueDate);
                        date.setDate(date.getDate() + 30);
                        return date.toLocaleDateString();
                      })()}
                    </span>
                  </label>
                </div>
              </div>

              <div className="custom-days">
                <label htmlFor="customDays" className="form-label">
                  Personalizar días:
                </label>
                <div className="custom-input-group">
                  <input
                    type="number"
                    id="customDays"
                    min="1"
                    max="30"
                    value={renewalDays}
                    onChange={(e) => handleDaysChange(parseInt(e.target.value) || 14)}
                    className="days-input"
                    disabled={isSubmitting}
                  />
                  <span className="input-suffix">días</span>
                </div>
              </div>

              <div className="date-picker">
                <label htmlFor="newDueDate" className="form-label">
                  Nueva fecha de vencimiento:
                </label>
                <input
                  type="date"
                  id="newDueDate"
                  value={newDueDate}
                  onChange={(e) => {
                    setNewDueDate(e.target.value);
                    setError('');
                  }}
                  className="date-input"
                  min={currentDueDate.toISOString().split('T')[0]}
                  max={(() => {
                    const maxDate = new Date(currentDueDate);
                    maxDate.setDate(maxDate.getDate() + 30);
                    return maxDate.toISOString().split('T')[0];
                  })()}
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>

            {/* Resumen de la renovación */}
            <div className="renewal-summary">
              <h4>Resumen de la Renovación</h4>
              
              <div className="summary-grid">
                <div className="summary-item">
                  <span className="summary-label">Fecha de vencimiento actual:</span>
                  <span className="summary-value">
                    {new Date(loan.dueDate).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="summary-item">
                  <span className="summary-label">Nueva fecha de vencimiento:</span>
                  <span className="summary-value highlight">
                    {new Date(newDueDate).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="summary-item">
                  <span className="summary-label">Días adicionales:</span>
                  <span className="summary-value">
                    {renewalDays} días
                  </span>
                </div>
                
                <div className="summary-item">
                  <span className="summary-label">Nuevo conteo de renovaciones:</span>
                  <span className="summary-value">
                    {(loan.renewalsCount || 0) + 1}/3
                  </span>
                </div>
                
                {fineAmount > 0 && (
                  <div className="summary-item">
                    <span className="summary-label">Multa por retraso:</span>
                    <span className="summary-value fine">
                      ${fineAmount.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>

              {fineAmount > 0 && (
                <div className="fine-notice">
                  <div className="notice-icon">⚠️</div>
                  <div className="notice-text">
                    Este préstamo tiene {daysOverdue} días de retraso. 
                    Se aplicará una multa de ${fineAmount.toFixed(2)}. 
                    La multa debe pagarse antes de la renovación.
                  </div>
                </div>
              )}

              {loan.renewalsCount >= 2 && (
                <div className="renewal-warning">
                  <div className="warning-icon">⚠️</div>
                  <div className="warning-text">
                    Este es el {loan.renewalsCount + 1}º intento de renovación. 
                    Recuerda que el límite máximo es de 3 renovaciones por préstamo.
                  </div>
                </div>
              )}
            </div>

            {/* Términos y condiciones */}
            <div className="terms-section">
              <label className="terms-checkbox">
                <input
                  type="checkbox"
                  required
                  disabled={isSubmitting}
                />
                <span className="checkbox-custom"></span>
                <span className="terms-text">
                  Acepto los{' '}
                  <a href="/terms" target="_blank" rel="noopener noreferrer">
                    términos y condiciones
                  </a>{' '}
                  de renovación. Entiendo que soy responsable de devolver el libro 
                  en la nueva fecha establecida.
                </span>
              </label>
            </div>

            {/* Mensaje de error */}
            {error && (
              <div className="error-message">
                <span className="error-icon">❌</span>
                {error}
              </div>
            )}

            {/* Botones de acción */}
            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner"></span>
                    Procesando...
                  </>
                ) : (
                  <>
                    <span className="btn-icon">🔄</span>
                    Confirmar Renovación
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RenewLoanModal;
