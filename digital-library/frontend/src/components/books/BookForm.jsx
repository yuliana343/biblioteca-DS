import React, { useState, useEffect } from 'react';
import { BookCard, BookList, BookDetails, BookForm, FiltersSidebar } from './components/books';
import './Books.css';

const BookForm = ({ 
  initialData = null, 
  onSubmit, 
  onCancel,
  isEditing = false 
}) => {
  const [formData, setFormData] = useState({
    title: '',
    isbn: '',
    description: '',
    publicationYear: new Date().getFullYear(),
    publisher: '',
    edition: '',
    language: 'Español',
    pages: '',
    coverImageUrl: '',
    totalCopies: 1,
    location: '',
    authors: [],
    categories: [],
    tags: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [availableAuthors, setAvailableAuthors] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [selectedAuthors, setSelectedAuthors] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [authorSearch, setAuthorSearch] = useState('');
  const [categorySearch, setCategorySearch] = useState('');

  
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        isbn: initialData.isbn || '',
        description: initialData.description || '',
        publicationYear: initialData.publicationYear || new Date().getFullYear(),
        publisher: initialData.publisher || '',
        edition: initialData.edition || '',
        language: initialData.language || 'Español',
        pages: initialData.pages || '',
        coverImageUrl: initialData.coverImageUrl || '',
        totalCopies: initialData.totalCopies || 1,
        location: initialData.location || '',
        authors: initialData.authors || [],
        categories: initialData.categories || [],
        tags: initialData.tags?.join(', ') || ''
      });
      setSelectedAuthors(initialData.authors || []);
      setSelectedCategories(initialData.categories || []);
    }
  }, [initialData]);

  useEffect(() => {
    fetchAuthorsAndCategories();
  }, []);

  const fetchAuthorsAndCategories = async () => {
    const mockAuthors = [
      { id: 1, name: 'Gabriel García Márquez' },
      { id: 2, name: 'Isabel Allende' },
      { id: 3, name: 'Mario Vargas Llosa' },
      { id: 4, name: 'Stephen King' },
      { id: 5, name: 'J.K. Rowling' }
    ];

    const mockCategories = [
      { id: 1, name: 'Ficción' },
      { id: 2, name: 'No Ficción' },
      { id: 3, name: 'Ciencia' },
      { id: 4, name: 'Historia' },
      { id: 5, name: 'Arte' },
      { id: 6, name: 'Tecnología' },
      { id: 7, name: 'Negocios' }
    ];

    setAvailableAuthors(mockAuthors);
    setAvailableCategories(mockCategories);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido';
    }

    if (!formData.isbn.trim()) {
      newErrors.isbn = 'El ISBN es requerido';
    } else if (!/^(?:\d{10}|\d{13})$/.test(formData.isbn.replace(/[-\s]/g, ''))) {
      newErrors.isbn = 'ISBN inválido (debe tener 10 o 13 dígitos)';
    }

    if (!formData.publicationYear) {
      newErrors.publicationYear = 'El año de publicación es requerido';
    } else if (formData.publicationYear > new Date().getFullYear()) {
      newErrors.publicationYear = 'El año no puede ser futuro';
    }

    if (!formData.totalCopies || formData.totalCopies < 1) {
      newErrors.totalCopies = 'Debe haber al menos 1 copia';
    }

    if (selectedAuthors.length === 0) {
      newErrors.authors = 'Selecciona al menos un autor';
    }

    if (selectedCategories.length === 0) {
      newErrors.categories = 'Selecciona al menos una categoría';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleAuthorSelect = (author) => {
    if (!selectedAuthors.find(a => a.id === author.id)) {
      setSelectedAuthors(prev => [...prev, author]);
    }
    setAuthorSearch('');
  };

  const handleCategorySelect = (category) => {
    if (!selectedCategories.find(c => c.id === category.id)) {
      setSelectedCategories(prev => [...prev, category]);
    }
    setCategorySearch('');
  };

  const removeAuthor = (authorId) => {
    setSelectedAuthors(prev => prev.filter(a => a.id !== authorId));
  };

  const removeCategory = (categoryId) => {
    setSelectedCategories(prev => prev.filter(c => c.id !== categoryId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const bookData = {
        ...formData,
        authors: selectedAuthors.map(a => ({ id: a.id })),
        categories: selectedCategories.map(c => ({ id: c.id })),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        availableCopies: isEditing ? formData.availableCopies : formData.totalCopies
      };

      await onSubmit(bookData);
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAuthors = availableAuthors.filter(author =>
    author.name.toLowerCase().includes(authorSearch.toLowerCase()) &&
    !selectedAuthors.find(selected => selected.id === author.id)
  );

  const filteredCategories = availableCategories.filter(category =>
    category.name.toLowerCase().includes(categorySearch.toLowerCase()) &&
    !selectedCategories.find(selected => selected.id === category.id)
  );

  return (
    <div className="book-form-container">
      <div className="form-header">
        <h2>{isEditing ? 'Editar Libro' : 'Agregar Nuevo Libro'}</h2>
        <p className="form-subtitle">
          {isEditing 
            ? 'Actualiza la información del libro existente' 
            : 'Completa todos los campos para agregar un nuevo libro al catálogo'}
        </p>
      </div>

      {errors.submit && (
        <div className="alert alert-error">
          <span className="alert-icon">⚠️</span>
          <span>{errors.submit}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="book-form">
        {/* Sección 1: Información básica */}
        <div className="form-section">
          <h3 className="section-title">
            <span className="section-icon">📖</span>
            Información Básica
          </h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title" className="form-label required">
                Título del libro
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`form-input ${errors.title ? 'error' : ''}`}
                placeholder="Ingresa el título completo"
              />
              {errors.title && (
                <span className="error-message">{errors.title}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="isbn" className="form-label required">
                ISBN
              </label>
              <input
                type="text"
                id="isbn"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                className={`form-input ${errors.isbn ? 'error' : ''}`}
                placeholder="Ej: 978-3-16-148410-0"
              />
              {errors.isbn && (
                <span className="error-message">{errors.isbn}</span>
              )}
              <small className="form-hint">Formato: 10 o 13 dígitos</small>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-textarea"
              rows="4"
              placeholder="Describe el contenido del libro..."
            />
          </div>
        </div>

        {/* Sección 2: Detalles de publicación */}
        <div className="form-section">
          <h3 className="section-title">
            <span className="section-icon">📅</span>
            Detalles de Publicación
          </h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="publicationYear" className="form-label required">
                Año de publicación
              </label>
              <input
                type="number"
                id="publicationYear"
                name="publicationYear"
                value={formData.publicationYear}
                onChange={handleChange}
                className={`form-input ${errors.publicationYear ? 'error' : ''}`}
                min="1000"
                max={new Date().getFullYear()}
                step="1"
              />
              {errors.publicationYear && (
                <span className="error-message">{errors.publicationYear}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="publisher" className="form-label">
                Editorial
              </label>
              <input
                type="text"
                id="publisher"
                name="publisher"
                value={formData.publisher}
                onChange={handleChange}
                className="form-input"
                placeholder="Nombre de la editorial"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="edition" className="form-label">
                Edición
              </label>
              <input
                type="text"
                id="edition"
                name="edition"
                value={formData.edition}
                onChange={handleChange}
                className="form-input"
                placeholder="Ej: 1ra edición, 2da edición revisada"
              />
            </div>

            <div className="form-group">
              <label htmlFor="language" className="form-label">
                Idioma
              </label>
              <select
                id="language"
                name="language"
                value={formData.language}
                onChange={handleChange}
                className="form-select"
              >
                <option value="Español">Español</option>
                <option value="English">English</option>
                <option value="Français">Français</option>
                <option value="Deutsch">Deutsch</option>
                <option value="Italiano">Italiano</option>
                <option value="Português">Português</option>
                <option value="其他">其他</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="pages" className="form-label">
                Número de páginas
              </label>
              <input
                type="number"
                id="pages"
                name="pages"
                value={formData.pages}
                onChange={handleChange}
                className="form-input"
                min="1"
                placeholder="Ej: 320"
              />
            </div>
          </div>
        </div>

        {/* Sección 3: Inventario y ubicación */}
        <div className="form-section">
          <h3 className="section-title">
            <span className="section-icon">📚</span>
            Inventario y Ubicación
          </h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="totalCopies" className="form-label required">
                Copias totales
              </label>
              <input
                type="number"
                id="totalCopies"
                name="totalCopies"
                value={formData.totalCopies}
                onChange={handleChange}
                className={`form-input ${errors.totalCopies ? 'error' : ''}`}
                min="1"
                step="1"
              />
              {errors.totalCopies && (
                <span className="error-message">{errors.totalCopies}</span>
              )}
              <small className="form-hint">
                Número total de copias físicas disponibles
              </small>
            </div>

            {isEditing && (
              <div className="form-group">
                <label htmlFor="availableCopies" className="form-label">
                  Copias disponibles
                </label>
                <input
                  type="number"
                  id="availableCopies"
                  name="availableCopies"
                  value={formData.availableCopies || formData.totalCopies}
                  onChange={handleChange}
                  className="form-input"
                  min="0"
                  max={formData.totalCopies}
                  step="1"
                />
                <small className="form-hint">
                  Copias actualmente disponibles para préstamo
                </small>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="location" className="form-label">
                Ubicación en biblioteca
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="form-input"
                placeholder="Ej: Estantería A-12, Pasillo 3"
              />
            </div>
          </div>
        </div>

        {/* Sección 4: Autores */}
        <div className="form-section">
          <h3 className="section-title">
            <span className="section-icon">✍️</span>
            Autores
            <span className={`required-indicator ${errors.authors ? 'error' : ''}`}>
              *
            </span>
          </h3>
          
          {errors.authors && (
            <span className="error-message block">{errors.authors}</span>
          )}

          <div className="selected-items">
            {selectedAuthors.map(author => (
              <div key={author.id} className="selected-item">
                <span className="item-text">{author.name}</span>
                <button
                  type="button"
                  className="remove-item-btn"
                  onClick={() => removeAuthor(author.id)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <div className="search-container">
            <input
              type="text"
              value={authorSearch}
              onChange={(e) => setAuthorSearch(e.target.value)}
              className="search-input"
              placeholder="Buscar autores..."
            />
            <span className="search-icon">🔍</span>
            
            {authorSearch && filteredAuthors.length > 0 && (
              <div className="dropdown-menu">
                {filteredAuthors.map(author => (
                  <div
                    key={author.id}
                    className="dropdown-item"
                    onClick={() => handleAuthorSelect(author)}
                  >
                    {author.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-hint">
            Selecciona uno o más autores. Si no encuentras un autor, contacta al administrador.
          </div>
        </div>

        {/* Sección 5: Categorías */}
        <div className="form-section">
          <h3 className="section-title">
            <span className="section-icon">🏷️</span>
            Categorías
            <span className={`required-indicator ${errors.categories ? 'error' : ''}`}>
              *
            </span>
          </h3>
          
          {errors.categories && (
            <span className="error-message block">{errors.categories}</span>
          )}

          <div className="selected-items">
            {selectedCategories.map(category => (
              <div key={category.id} className="selected-item">
                <span className="item-text">{category.name}</span>
                <button
                  type="button"
                  className="remove-item-btn"
                  onClick={() => removeCategory(category.id)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <div className="search-container">
            <input
              type="text"
              value={categorySearch}
              onChange={(e) => setCategorySearch(e.target.value)}
              className="search-input"
              placeholder="Buscar categorías..."
            />
            <span className="search-icon">🔍</span>
            
            {categorySearch && filteredCategories.length > 0 && (
              <div className="dropdown-menu">
                {filteredCategories.map(category => (
                  <div
                    key={category.id}
                    className="dropdown-item"
                    onClick={() => handleCategorySelect(category)}
                  >
                    {category.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sección 6: Imagen y etiquetas */}
        <div className="form-section">
          <h3 className="section-title">
            <span className="section-icon">🖼️</span>
            Imagen y Etiquetas
          </h3>
          
          <div className="form-group">
            <label htmlFor="coverImageUrl" className="form-label">
              URL de la portada
            </label>
            <input
              type="url"
              id="coverImageUrl"
              name="coverImageUrl"
              value={formData.coverImageUrl}
              onChange={handleChange}
              className="form-input"
              placeholder="https://ejemplo.com/imagen.jpg"
            />
            <small className="form-hint">
              Enlace a una imagen de alta calidad de la portada
            </small>
            
            {formData.coverImageUrl && (
              <div className="image-preview">
                <img 
                  src={formData.coverImageUrl} 
                  alt="Vista previa" 
                  className="preview-img"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'block';
                  }}
                />
                <div className="preview-placeholder" style={{ display: 'none' }}>
                  No se puede cargar la imagen
                </div>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="tags" className="form-label">
              Etiquetas
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="form-input"
              placeholder="Ej: literatura, novela, clásico (separadas por comas)"
            />
            <small className="form-hint">
              Palabras clave para facilitar la búsqueda
            </small>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancelar
          </button>
          
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                {isEditing ? 'Actualizando...' : 'Creando...'}
              </>
            ) : (
              isEditing ? 'Actualizar Libro' : 'Agregar Libro'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookForm;
