import React from 'react';
import SearchBar from './SearchBar'; 
import './Pagination.css';

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  totalItems,
  onPageSizeChange,
  showPageSizeOptions = true,
  showInfo = true
}) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  };

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

  const handleFirst = () => {
    onPageChange(1);
  };

  const handleLast = () => {
    onPageChange(totalPages);
  };

  const pageNumbers = getPageNumbers();

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="pagination-container">
      {showInfo && totalItems > 0 && (
        <div className="pagination-info">
          Mostrando <strong>{startItem}-{endItem}</strong> de{' '}
          <strong>{totalItems}</strong> elementos
        </div>
      )}

      <div className="pagination-controls">
        <button
          className={`pagination-btn ${currentPage === 1 ? 'disabled' : ''}`}
          onClick={handleFirst}
          disabled={currentPage === 1}
          aria-label="Ir a la primera página"
        >
          ««
        </button>

        <button
          className={`pagination-btn ${currentPage === 1 ? 'disabled' : ''}`}
          onClick={handlePrevious}
          disabled={currentPage === 1}
          aria-label="Página anterior"
        >
          «
        </button>

        <div className="page-numbers">
          {pageNumbers.map((pageNumber, index) => (
            <React.Fragment key={index}>
              {pageNumber === '...' ? (
                <span className="page-dots">...</span>
              ) : (
                <button
                  className={`page-btn ${currentPage === pageNumber ? 'active' : ''}`}
                  onClick={() => onPageChange(pageNumber)}
                  aria-label={`Ir a la página ${pageNumber}`}
                  aria-current={currentPage === pageNumber ? 'page' : undefined}
                >
                  {pageNumber}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        <button
          className={`pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`}
          onClick={handleNext}
          disabled={currentPage === totalPages}
          aria-label="Página siguiente"
        >
          »
        </button>

        <button
          className={`pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`}
          onClick={handleLast}
          disabled={currentPage === totalPages}
          aria-label="Ir a la última página"
        >
          »»
        </button>
      </div>

      {showPageSizeOptions && (
        <div className="page-size-selector">
          <label htmlFor="pageSize">Mostrar:</label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="page-size-select"
          >
            {[10, 20, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size} por página
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="pagination-jump">
        <label htmlFor="jumpToPage">Ir a:</label>
        <input
          id="jumpToPage"
          type="number"
          min="1"
          max={totalPages}
          defaultValue={currentPage}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const page = parseInt(e.target.value);
              if (page >= 1 && page <= totalPages) {
                onPageChange(page);
                e.target.value = '';
              }
            }
          }}
          className="page-jump-input"
          placeholder="Página"
          aria-label="Ir a página específica"
        />
      </div>
    </div>
  );
};

export default Pagination;