import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../common/LoadingSpinner';
import './Admin.css';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [generatedReports, setGeneratedReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportParams, setReportParams] = useState({});
  const [reportFormat, setReportFormat] = useState('pdf');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchAvailableReports();
    fetchGeneratedReports();
  }, []);

  const fetchAvailableReports = async () => {
    setLoading(true);
    try {
      // Simulación de reportes disponibles
      const mockReports = [
        {
          id: 1,
          name: 'Reporte de Préstamos',
          description: 'Listado detallado de todos los préstamos',
          category: 'préstamos',
          frequency: 'diario',
          icon: '📖',
          params: [
            { name: 'status', label: 'Estado', type: 'select', options: ['TODOS', 'ACTIVO', 'VENCIDO', 'DEVUELTO'] },
            { name: 'dateRange', label: 'Rango de fechas', type: 'dateRange' }
          ]
        },
        {
          id: 2,
          name: 'Reporte de Reservas',
          description: 'Reservas activas y pendientes',
          category: 'reservas',
          frequency: 'diario',
          icon: '📅',
          params: [
            { name: 'status', label: 'Estado', type: 'select', options: ['TODAS', 'PENDIENTE', 'ACTIVA', 'CANCELADA'] },
            { name: 'bookCategory', label: 'Categoría de libro', type: 'select', options: ['TODAS', 'FICCIÓN', 'NO FICCIÓN', 'CIENCIA'] }
          ]
        },
        {
          id: 3,
          name: 'Reporte de Usuarios',
          description: 'Usuarios registrados y su actividad',
          category: 'usuarios',
          frequency: 'semanal',
          icon: '👥',
          params: [
            { name: 'userType', label: 'Tipo de usuario', type: 'select', options: ['TODOS', 'ADMIN', 'BIBLIOTECARIO', 'USUARIO'] },
            { name: 'activityLevel', label: 'Nivel de actividad', type: 'select', options: ['TODOS', 'ALTO', 'MEDIO', 'BAJO'] }
          ]
        },
        {
          id: 4,
          name: 'Reporte de Inventario',
          description: 'Estado del inventario de libros',
          category: 'inventario',
          frequency: 'mensual',
          icon: '📚',
          params: [
            { name: 'availability', label: 'Disponibilidad', type: 'select', options: ['TODOS', 'DISPONIBLE', 'PRESTADO', 'RESERVADO'] },
            { name: 'location', label: 'Ubicación', type: 'text' }
          ]
        },
        {
          id: 5,
          name: 'Reporte Financiero',
          description: 'Multas y transacciones financieras',
          category: 'finanzas',
          frequency: 'mensual',
          icon: '💰',
          params: [
            { name: 'transactionType', label: 'Tipo de transacción', type: 'select', options: ['TODAS', 'MULTA', 'PAGO', 'DEVOLUCIÓN'] },
            { name: 'dateRange', label: 'Rango de fechas', type: 'dateRange' }
          ]
        },
        {
          id: 6,
          name: 'Reporte de Popularidad',
          description: 'Libros más populares y solicitados',
          category: 'estadísticas',
          frequency: 'trimestral',
          icon: '⭐',
          params: [
            { name: 'timePeriod', label: 'Período', type: 'select', options: ['ÚLTIMO MES', 'ÚLTIMO TRIMESTRE', 'ÚLTIMO AÑO'] },
            { name: 'topN', label: 'Top N resultados', type: 'number', min: 1, max: 100 }
          ]
        }
      ];

      setTimeout(() => {
        setReports(mockReports);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading reports:', error);
      setLoading(false);
    }
  };

  const fetchGeneratedReports = async () => {
    try {
      // Simulación de reportes generados
      const mockGenerated = [
        {
          id: 1,
          name: 'Reporte de Préstamos - Nov 2023',
          type: 'préstamos',
          generatedAt: new Date(2023, 10, 15).toISOString(),
          format: 'pdf',
          size: '2.4 MB',
          status: 'completed',
          downloadUrl: '#'
        },
        {
          id: 2,
          name: 'Reporte de Usuarios - Oct 2023',
          type: 'usuarios',
          generatedAt: new Date(2023, 9, 30).toISOString(),
          format: 'excel',
          size: '1.8 MB',
          status: 'completed',
          downloadUrl: '#'
        },
        {
          id: 3,
          name: 'Reporte Financiero - Q3 2023',
          type: 'finanzas',
          generatedAt: new Date(2023, 8, 30).toISOString(),
          format: 'pdf',
          size: '3.2 MB',
          status: 'completed',
          downloadUrl: '#'
        },
        {
          id: 4,
          name: 'Reporte de Inventario - Sep 2023',
          type: 'inventario',
          generatedAt: new Date(2023, 7, 31).toISOString(),
          format: 'excel',
          size: '4.1 MB',
          status: 'completed',
          downloadUrl: '#'
        }
      ];

      setGeneratedReports(mockGenerated);
    } catch (error) {
      console.error('Error loading generated reports:', error);
    }
  };

  const handleReportSelect = (report) => {
    setSelectedReport(report);
    // Inicializar parámetros
    const initialParams = {};
    report.params.forEach(param => {
      if (param.type === 'select') {
        initialParams[param.name] = param.options[0];
      } else if (param.type === 'dateRange') {
        initialParams[param.name] = dateRange;
      } else if (param.type === 'number') {
        initialParams[param.name] = param.min || 10;
      } else {
        initialParams[param.name] = '';
      }
    });
    setReportParams(initialParams);
  };

  const handleParamChange = (paramName, value) => {
    setReportParams(prev => ({
      ...prev,
      [paramName]: value
    }));
  };

  const generateReport = async () => {
    if (!selectedReport) return;

    setGenerating(true);
    try {
      // Simulación de generación de reporte
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newReport = {
        id: generatedReports.length + 1,
        name: `${selectedReport.name} - ${new Date().toLocaleDateString()}`,
        type: selectedReport.category,
        generatedAt: new Date().toISOString(),
        format: reportFormat,
        size: `${(Math.random() * 5 + 1).toFixed(1)} MB`,
        status: 'completed',
        downloadUrl: '#'
      };

      setGeneratedReports(prev => [newReport, ...prev]);
      alert(`Reporte "${selectedReport.name}" generado exitosamente`);
      
      // Resetear selección
      setSelectedReport(null);
      setReportParams({});
    } catch (error) {
      alert('Error al generar el reporte: ' + error.message);
    } finally {
      setGenerating(false);
    }
  };

  const downloadReport = (report) => {
    alert(`Descargando reporte: ${report.name}`);
    // Lógica de descarga real iría aquí
  };

  const deleteReport = (reportId) => {
    if (window.confirm('¿Estás seguro de eliminar este reporte?')) {
      setGeneratedReports(prev => prev.filter(r => r.id !== reportId));
    }
  };

  const scheduleReport = (report) => {
    alert(`Programando reporte: ${report.name}`);
    // Lógica de programación iría aquí
  };

  const getReportIcon = (category) => {
    const icons = {
      'préstamos': '📖',
      'reservas': '📅',
      'usuarios': '👥',
      'inventario': '📚',
      'finanzas': '💰',
      'estadísticas': '📊'
    };
    return icons[category] || '📄';
  };

  const getStatusBadge = (status) => {
    return status === 'completed' 
      ? <span className="badge badge-success">Completado</span>
      : <span className="badge badge-warning">En proceso</span>;
  };

  if (loading) {
    return (
      <div className="reports">
        <div className="reports-loading">
          <LoadingSpinner message="Cargando reportes..." />
        </div>
      </div>
    );
  }

  return (
    <div className="reports">
      {/* Header */}
      <div className="reports-header">
        <div className="header-left">
          <h1>Reportes y Análisis</h1>
          <p className="subtitle">Genera y gestiona reportes del sistema</p>
        </div>
        <div className="header-right">
          <button className="btn btn-primary">
            <span className="btn-icon">📊</span>
            Análisis Avanzado
          </button>
        </div>
      </div>

      <div className="reports-container">
        {/* Panel izquierdo: Reportes disponibles */}
        <div className="available-reports">
          <div className="section-header">
            <h3>📋 Reportes Disponibles</h3>
            <p>Selecciona un reporte para generarlo</p>
          </div>
          
          <div className="reports-grid">
            {reports.map(report => (
              <div 
                key={report.id} 
                className={`report-card ${selectedReport?.id === report.id ? 'selected' : ''}`}
                onClick={() => handleReportSelect(report)}
              >
                <div className="report-icon">{report.icon}</div>
                <div className="report-content">
                  <h4>{report.name}</h4>
                  <p className="report-description">{report.description}</p>
                  <div className="report-meta">
                    <span className="meta-category">{report.category}</span>
                    <span className="meta-frequency">• {report.frequency}</span>
                  </div>
                </div>
                <div className="report-arrow">→</div>
              </div>
            ))}
          </div>
        </div>

        {/* Panel derecho: Configuración y vista previa */}
        <div className="report-configuration">
          {selectedReport ? (
            <>
              <div className="config-header">
                <h3>⚙️ Configurar Reporte</h3>
                <div className="selected-report">
                  <span className="report-icon-small">{selectedReport.icon}</span>
                  <span className="report-name">{selectedReport.name}</span>
                </div>
              </div>

              <div className="config-content">
                {/* Parámetros del reporte */}
                <div className="params-section">
                  <h4>📝 Parámetros</h4>
                  {selectedReport.params.map(param => (
                    <div key={param.name} className="form-group">
                      <label className="form-label">{param.label}</label>
                      
                      {param.type === 'select' ? (
                        <select
                          value={reportParams[param.name] || ''}
                          onChange={(e) => handleParamChange(param.name, e.target.value)}
                          className="form-select"
                          disabled={generating}
                        >
                          {param.options.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      ) : param.type === 'dateRange' ? (
                        <div className="date-range-inputs">
                          <input
                            type="date"
                            value={reportParams[param.name]?.startDate || dateRange.startDate}
                            onChange={(e) => handleParamChange(param.name, {
                              ...reportParams[param.name],
                              startDate: e.target.value
                            })}
                            className="date-input"
                            disabled={generating}
                          />
                          <span className="date-separator">a</span>
                          <input
                            type="date"
                            value={reportParams[param.name]?.endDate || dateRange.endDate}
                            onChange={(e) => handleParamChange(param.name, {
                              ...reportParams[param.name],
                              endDate: e.target.value
                            })}
                            className="date-input"
                            disabled={generating}
                          />
                        </div>
                      ) : param.type === 'number' ? (
                        <input
                          type="number"
                          value={reportParams[param.name] || param.min || 10}
                          onChange={(e) => handleParamChange(param.name, parseInt(e.target.value))}
                          className="form-input"
                          min={param.min}
                          max={param.max}
                          disabled={generating}
                        />
                      ) : (
                        <input
                          type="text"
                          value={reportParams[param.name] || ''}
                          onChange={(e) => handleParamChange(param.name, e.target.value)}
                          className="form-input"
                          placeholder={`Ingrese ${param.label.toLowerCase()}`}
                          disabled={generating}
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* Opciones de formato */}
                <div className="format-section">
                  <h4>📄 Formato de Salida</h4>
                  <div className="format-options">
                    <label className="format-option">
                      <input
                        type="radio"
                        name="format"
                        value="pdf"
                        checked={reportFormat === 'pdf'}
                        onChange={(e) => setReportFormat(e.target.value)}
                        disabled={generating}
                      />
                      <span className="format-icon">📕</span>
                      <span className="format-label">PDF</span>
                      <span className="format-desc">(Para imprimir y compartir)</span>
                    </label>
                    <label className="format-option">
                      <input
                        type="radio"
                        name="format"
                        value="excel"
                        checked={reportFormat === 'excel'}
                        onChange={(e) => setReportFormat(e.target.value)}
                        disabled={generating}
                      />
                      <span className="format-icon">📗</span>
                      <span className="format-label">Excel</span>
                      <span className="format-desc">(Para análisis de datos)</span>
                    </label>
                    <label className="format-option">
                      <input
                        type="radio"
                        name="format"
                        value="csv"
                        checked={reportFormat === 'csv'}
                        onChange={(e) => setReportFormat(e.target.value)}
                        disabled={generating}
                      />
                      <span className="format-icon">📘</span>
                      <span className="format-label">CSV</span>
                      <span className="format-desc">(Para importar a otras apps)</span>
                    </label>
                  </div>
                </div>

                {/* Vista previa */}
                <div className="preview-section">
                  <h4>👁️ Vista Previa</h4>
                  <div className="preview-placeholder">
                    <div className="preview-content">
                      <span className="preview-icon">📊</span>
                      <p>Vista previa del reporte "{selectedReport.name}"</p>
                      <small>Se generará con los parámetros seleccionados</small>
                    </div>
                    <div className="preview-stats">
                      <div className="preview-stat">
                        <span className="stat-label">Parámetros:</span>
                        <span className="stat-value">{selectedReport.params.length}</span>
                      </div>
                      <div className="preview-stat">
                        <span className="stat-label">Tamaño estimado:</span>
                        <span className="stat-value">~2-5 MB</span>
                      </div>
                      <div className="preview-stat">
                        <span className="stat-label">Tiempo estimado:</span>
                        <span className="stat-value">10-30 segundos</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Acciones */}
                <div className="actions-section">
                  <button
                    className="btn btn-outline"
                    onClick={() => setSelectedReport(null)}
                    disabled={generating}
                  >
                    Cancelar
                  </button>
                  <button
                    className="btn btn-success"
                    onClick={() => scheduleReport(selectedReport)}
                    disabled={generating}
                  >
                    <span className="btn-icon">⏰</span>
                    Programar
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={generateReport}
                    disabled={generating}
                  >
                    {generating ? (
                      <>
                        <LoadingSpinner size="small" color="light" />
                        Generando...
                      </>
                    ) : (
                      <>
                        <span className="btn-icon">⚡</span>
                        Generar Reporte
                      </>
                    )}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="no-report-selected">
              <div className="selection-icon">📋</div>
              <h3>Selecciona un Reporte</h3>
              <p>Elige un reporte de la lista para configurarlo y generarlo</p>
              <div className="selection-tip">
                <span className="tip-icon">💡</span>
                <span className="tip-text">
                  Puedes programar reportes recurrentes para recibirlos automáticamente
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reportes generados */}
      <div className="generated-reports">
        <div className="section-header">
          <h3>📁 Reportes Generados</h3>
          <div className="section-actions">
            <button className="btn btn-outline btn-sm">
              <span className="btn-icon">🗑️</span>
              Limpiar antiguos
            </button>
          </div>
        </div>

        {generatedReports.length === 0 ? (
          <div className="empty-generated">
            <div className="empty-icon">📄</div>
            <p>No hay reportes generados todavía</p>
          </div>
        ) : (
          <div className="reports-table-container">
            <table className="reports-table">
              <thead>
                <tr>
                  <th>Reporte</th>
                  <th>Tipo</th>
                  <th>Generado</th>
                  <th>Formato</th>
                  <th>Tamaño</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {generatedReports.map(report => (
                  <tr key={report.id}>
                    <td>
                      <div className="report-info">
                        <span className="report-type-icon">{getReportIcon(report.type)}</span>
                        <div className="report-details">
                          <div className="report-name">{report.name}</div>
                          <div className="report-date">
                            {new Date(report.generatedAt).toLocaleDateString()} • 
                            {new Date(report.generatedAt).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="report-category">{report.type}</span>
                    </td>
                    <td>
                      <div className="time-ago">
                        {Math.floor((new Date() - new Date(report.generatedAt)) / (1000 * 60 * 60 * 24))} días
                      </div>
                    </td>
                    <td>
                      <span className="format-badge">{report.format.toUpperCase()}</span>
                    </td>
                    <td>{report.size}</td>
                    <td>{getStatusBadge(report.status)}</td>
                    <td>
                      <div className="report-actions">
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => downloadReport(report)}
                          title="Descargar"
                        >
                          ⬇️
                        </button>
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => {/* Vista previa */}}
                          title="Vista previa"
                        >
                          👁️
                        </button>
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => scheduleReport(report)}
                          title="Volver a programar"
                        >
                          ⏰
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => deleteReport(report.id)}
                          title="Eliminar"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Estadísticas de reportes */}
        <div className="reports-stats">
          <div className="stats-card">
            <h4>📊 Estadísticas de Reportes</h4>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-label">Total generados:</span>
                <span className="stat-value">{generatedReports.length}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Espacio usado:</span>
                <span className="stat-value">
                  {generatedReports.reduce((acc, r) => acc + parseFloat(r.size), 0).toFixed(1)} MB
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Más popular:</span>
                <span className="stat-value">Préstamos (45%)</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Programados:</span>
                <span className="stat-value">3 reportes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;