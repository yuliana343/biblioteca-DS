import React from 'react';
import './Pagination.css';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  pageSize, 
  totalItems,
  onPageChange,
  onPageSizeChange 
}) => {
  const pageNumbers = [];
  const maxPagesToShow = 5;
  
  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
  
  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="pagination">
      <div className="pagination-info">
        Mostrando {(currentPage - 1) * pageSize + 1}-
        {Math.min(currentPage * pageSize, totalItems)} de {totalItems} elementos
      </div>
      
      <div className="pagination-controls">
        <button
          className={`pagination-btn ${currentPage === 1 ? 'disabled' : ''}`}
          onClick={handlePrevious}
          disabled={currentPage === 1}
        >
          ← Anterior
        </button>

        <div className="page-numbers">
          {startPage > 1 && (
            <>
              <button
                className={`pagination-btn ${currentPage === 1 ? 'active' : ''}`}
                onClick={() => onPageChange(1)}
              >
                1
              </button>
              {startPage > 2 && <span className="page-dots">...</span>}
            </>
          )}

          {pageNumbers.map(page => (
            <button
              key={page}
              className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className="page-dots">...</span>}
              <button
                className={`pagination-btn ${currentPage === totalPages ? 'active' : ''}`}
                onClick={() => onPageChange(totalPages)}
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        <button
          className={`pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`}
          onClick={handleNext}
          disabled={currentPage === totalPages}
        >
          Siguiente →
        </button>
      </div>

      <div className="page-size-selector">
        <span>Mostrar:</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="page-size-select"
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
        <span>por página</span>
      </div>
    </div>
  );
};

export default Pagination;