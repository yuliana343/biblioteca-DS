import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import BookList from '../components/books/BookList';
import FiltersSidebar from '../components/books/FiltersSidebar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Pagination from '../components/common/Pagination';
import { bookService } from '../services/api/bookService';
import './CatalogPage.css';

const CatalogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  
  // Estado para filtros
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || 'all',
    author: searchParams.get('author') || 'all',
    availability: searchParams.get('availability') || 'all',
    sortBy: searchParams.get('sort') || 'title',
    yearRange: {
      min: searchParams.get('minYear') || 1900,
      max: searchParams.get('maxYear') || new Date().getFullYear()
    }
  });

  useEffect(() => {
    fetchBooks();
  }, [filters, currentPage]);

  useEffect(() => {
    // Actualizar URL cuando cambian los filtros
    const params = {};
    if (filters.search) params.search = filters.search;
    if (filters.category !== 'all') params.category = filters.category;
    if (filters.author !== 'all') params.author = filters.author;
    if (filters.availability !== 'all') params.availability = filters.availability;
    if (filters.sortBy !== 'title') params.sort = filters.sortBy;
    if (filters.yearRange.min !== 1900) params.minYear = filters.yearRange.min;
    if (filters.yearRange.max !== new Date().getFullYear()) params.maxYear = filters.yearRange.max;
    
    setSearchParams(params);
  }, [filters, setSearchParams]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      // Simulación de datos
      const mockBooks = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        title: `Libro ${i + 1}: ${['El Gran Libro', 'Historia de', 'Ciencia Avanzada', 'Arte Moderno'][i % 4]}`,
        author: `Autor ${String.fromCharCode(65 + (i % 26))}. Autor`,
        isbn: `978-3-16-148410-${String(i).padStart(3, '0')}`,
        cover: 'https://via.placeholder.com/150x200',
        description: 'Descripción del libro con información relevante sobre su contenido y autoría.',
        category: ['Ficción', 'Ciencia', 'Historia', 'Arte', 'Tecnología'][i % 5],
        year: 2000 + (i % 24),
        pages: 300 + (i * 10),
        rating: 3.5 + (Math.random() * 1.5),
        availableCopies: i % 5,
        totalCopies: 5,
        publisher: ['Editorial A', 'Editorial B', 'Editorial C'][i % 3],
        language: ['Español', 'Inglés', 'Francés'][i % 3]
      }));

      // Aplicar filtros
      let filtered = [...mockBooks];
      
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filtered = filtered.filter(book => 
          book.title.toLowerCase().includes(searchTerm) ||
          book.author.toLowerCase().includes(searchTerm) ||
          book.description.toLowerCase().includes(searchTerm)
        );
      }
      
      if (filters.category !== 'all') {
        filtered = filtered.filter(book => book.category === filters.category);
      }
      
      if (filters.availability !== 'all') {
        filtered = filtered.filter(book => 
          filters.availability === 'available' ? book.availableCopies > 0 : book.availableCopies === 0
        );
      }
      
      if (filters.yearRange) {
        filtered = filtered.filter(book => 
          book.year >= filters.yearRange.min && book.year <= filters.yearRange.max
        );
      }
      
      // Aplicar ordenación
      filtered.sort((a, b) => {
        switch (filters.sortBy) {
          case 'title':
            return a.title.localeCompare(b.title);
          case 'author':
            return a.author.localeCompare(b.author);
          case 'year':
            return b.year - a.year;
          case 'rating':
            return b.rating - a.rating;
          case 'popularity':
            return b.rating * 100 + b.year - (a.rating * 100 + a.year);
          default:
            return 0;
        }
      });

      // Paginación
      const total = filtered.length;
      const totalPages = Math.ceil(total / pageSize);
      const startIndex = (currentPage - 1) * pageSize;
      const paginatedBooks = filtered.slice(startIndex, startIndex + pageSize);

      setTimeout(() => {
        setBooks(paginatedBooks);
        setFilteredBooks(filtered);
        setTotalPages(totalPages);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading books:', error);
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const handleSearch = (searchTerm) => {
    handleFilterChange({ search: searchTerm });
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      author: 'all',
      availability: 'all',
      sortBy: 'title',
      yearRange: { min: 1900, max: new Date().getFullYear() }
    });
    setCurrentPage(1);
  };

  const getFilterSummary = () => {
    const activeFilters = [];
    if (filters.search) activeFilters.push(`Buscar: "${filters.search}"`);
    if (filters.category !== 'all') activeFilters.push(`Categoría: ${filters.category}`);
    if (filters.availability !== 'all') activeFilters.push(`Disponibilidad: ${filters.availability === 'available' ? 'Disponible' : 'No disponible'}`);
    if (filters.author !== 'all') activeFilters.push(`Autor: ${filters.author}`);
    
    return activeFilters;
  };

  return (
    <div className="catalog-page">
      {/* Header */}
      <div className="catalog-header">
        <div className="header-content">
          <h1>📚 Catálogo de Libros</h1>
          <p className="subtitle">
            Explora nuestra colección de {filteredBooks.length.toLocaleString()} libros
          </p>
        </div>
        <div className="header-search">
          <div className="search-container">
            <input
              type="text"
              placeholder="Buscar libros por título, autor, ISBN..."
              value={filters.search}
              onChange={(e) => handleSearch(e.target.value)}
              className="catalog-search-input"
            />
            <button className="search-btn">
              <span className="search-icon">🔍</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Filters */}
      {getFilterSummary().length > 0 && (
        <div className="active-filters">
          <div className="filters-summary">
            <span className="filters-label">Filtros activos:</span>
            {getFilterSummary().map((filter, index) => (
              <span key={index} className="filter-badge">
                {filter}
                <button 
                  className="remove-filter"
                  onClick={() => {
                    if (filter.includes('Buscar')) handleFilterChange({ search: '' });
                    if (filter.includes('Categoría')) handleFilterChange({ category: 'all' });
                    if (filter.includes('Disponibilidad')) handleFilterChange({ availability: 'all' });
                    if (filter.includes('Autor')) handleFilterChange({ author: 'all' });
                  }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <button 
            className="btn btn-outline btn-sm"
            onClick={handleResetFilters}
          >
            Limpiar filtros
          </button>
        </div>
      )}

      <div className="catalog-content">
        {/* Sidebar de filtros */}
        <div className="catalog-sidebar">
          <FiltersSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
          />
        </div>

        {/* Contenido principal */}
        <div className="catalog-main">
          {/* Controles */}
          <div className="catalog-controls">
            <div className="results-info">
              Mostrando {((currentPage - 1) * pageSize) + 1}-
              {Math.min(currentPage * pageSize, filteredBooks.length)} de {filteredBooks.length} libros
            </div>
            <div className="sort-controls">
              <span className="sort-label">Ordenar por:</span>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
                className="sort-select"
              >
                <option value="title">Título (A-Z)</option>
                <option value="author">Autor (A-Z)</option>
                <option value="year">Año (más reciente)</option>
                <option value="rating">Rating (alto)</option>
                <option value="popularity">Popularidad</option>
              </select>
            </div>
          </div>

          {/* Lista de libros */}
          {loading ? (
            <div className="catalog-loading">
              <LoadingSpinner message="Cargando libros..." />
            </div>
          ) : books.length === 0 ? (
            <div className="no-results">
              <div className="no-results-icon">📚</div>
              <h3>No se encontraron libros</h3>
              <p>No hay libros que coincidan con los filtros aplicados</p>
              <button 
                className="btn btn-primary"
                onClick={handleResetFilters}
              >
                Mostrar todos los libros
              </button>
            </div>
          ) : (
            <>
              <BookList books={books} />
              
              {/* Paginación */}
              {totalPages > 1 && (
                <div className="catalog-pagination">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    pageSize={pageSize}
                    totalItems={filteredBooks.length}
                    onPageChange={setCurrentPage}
                    onPageSizeChange={setPageSize}
                  />
                </div>
              )}
            </>
          )}

          {/* Estadísticas */}
          {!loading && books.length > 0 && (
            <div className="catalog-stats">
              <div className="stats-card">
                <h4>📊 Estadísticas del Catálogo</h4>
                <div className="stats-grid">
                  <div className="stat-item">
                    <span className="stat-label">Total de libros:</span>
                    <span className="stat-value">{filteredBooks.length}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Disponibles:</span>
                    <span className="stat-value">
                      {filteredBooks.filter(b => b.availableCopies > 0).length}
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Categorías:</span>
                    <span className="stat-value">
                      {[...new Set(filteredBooks.map(b => b.category))].length}
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Autores:</span>
                    <span className="stat-value">
                      {[...new Set(filteredBooks.map(b => b.author))].length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CatalogPage;