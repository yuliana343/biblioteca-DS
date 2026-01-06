import React from "react";
import "./Books.css";

const FiltersSidebar = ({ 
  filters = {},
  onFilterChange,
  categories = [],
  authors = [],
  languages = []
}) => {
  const handleChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };
  
  const clearFilters = () => {
    onFilterChange({});
  };
  
  return (
    <div className="filters-sidebar card">
      <div className="card-header">
        <h5 className="mb-0">Filtros</h5>
      </div>
      <div className="card-body">
        <div className="mb-3">
          <label className="form-label">Título</label>
          <input
            type="text"
            className="form-control"
            value={filters.title || ""}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="Buscar por título..."
          />
        </div>
        
        <div className="mb-3">
          <label className="form-label">Categoría</label>
          <select
            className="form-select"
            value={filters.category || ""}
            onChange={(e) => handleChange("category", e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="mb-3">
          <label className="form-label">Año de publicación</label>
          <input
            type="number"
            className="form-control"
            value={filters.publicationYear || ""}
            onChange={(e) => handleChange("publicationYear", e.target.value)}
            placeholder="Ej: 2020"
          />
        </div>
        
        <button 
          className="btn btn-outline-secondary w-100"
          onClick={clearFilters}
        >
          Limpiar filtros
        </button>
      </div>
    </div>
  );
};

export default FiltersSidebar;
