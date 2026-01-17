import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../services/auth/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';
import { BookCard, BookList, BookDetails, BookForm, FiltersSidebar } from './components/books';
import './Books.css';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('details');
  const [isReserving, setIsReserving] = useState(false);
  const [isLoaning, setIsLoaning] = useState(false);
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchBookDetails();
    fetchRelatedBooks();
    fetchReviews();
  }, [id]);

  const fetchBookDetails = async () => {
    try {
      setLoading(true);
      const mockBook = {
        id: parseInt(id),
        title: 'Cien años de soledad',
        isbn: '9788437604947',
        description: 'Novela del realismo mágico que narra la historia de la familia Buendía en el pueblo ficticio de Macondo. Considerada una obra maestra de la literatura hispanoamericana.',
        publicationYear: 1967,
        publisher: 'Editorial Sudamericana',
        edition: 'Primera edición',
        language: 'Español',
        pages: 471,
        coverImageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop',
        totalCopies: 5,
        availableCopies: 3,
        location: 'Estantería A-12',
        createdAt: '2023-01-15',
        updatedAt: '2023-10-20',
        authors: [
          { id: 1, name: 'Gabriel García Márquez', nationality: 'Colombiano' }
        ],
        categories: [
          { id: 1, name: 'Ficción', description: 'Novelas de ficción' },
          { id: 2, name: 'Literatura Latinoamericana', description: 'Obras de autores latinoamericanos' }
        ],
        loanCount: 245,
        reservationCount: 12,
        viewCount: 1567,
        rating: 4.8,
        isPopular: true,
        isNew: false,
        tags: ['Realismo mágico', 'Literatura clásica', 'Premio Nobel']
      };
      
      setTimeout(() => {
        setBook(mockBook);
        setLoading(false);
      }, 500);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchRelatedBooks = async () => {
    const mockRelated = [
      {
        id: 2,
        title: 'El amor en los tiempos del cólera',
        author: 'Gabriel García Márquez',
        coverImageUrl: null,
        availableCopies: 2
      },
      {
        id: 3,
        title: 'La casa de los espíritus',
        author: 'Isabel Allende',
        coverImageUrl: null,
        availableCopies: 4
      },
      {
        id: 4,
        title: 'Rayuela',
        author: 'Julio Cortázar',
        coverImageUrl: null,
        availableCopies: 1
      }
    ];
    setRelatedBooks(mockRelated);
  };

  const fetchReviews = async () => {
    const mockReviews = [
      {
        id: 1,
        user: 'Ana Martínez',
        rating: 5,
        comment: 'Una obra maestra que todo el mundo debería leer. La prosa de García Márquez es simplemente magistral.',
        date: '2023-11-15'
      },
      {
        id: 2,
        user: 'Carlos Rodríguez',
        rating: 4,
        comment: 'Excelente libro, aunque la cantidad de personajes puede resultar confusa al principio.',
        date: '2023-10-28'
      }
    ];
    setReviews(mockReviews);
  };

  const handleReserve = async () => {
    if (!user) {
      alert('Debes iniciar sesión para reservar este libro');
      navigate('/login');
      return;
    }

    setIsReserving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Libro reservado exitosamente. Te notificaremos cuando esté disponible.');
    } catch (err) {
      alert('Error al reservar el libro: ' + err.message);
    } finally {
      setIsReserving(false);
    }
  };

  const handleLoan = async () => {
    if (!user) {
      alert('Debes iniciar sesión para solicitar un préstamo');
      navigate('/login');
      return;
    }

    setIsLoaning(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Préstamo solicitado exitosamente. Puedes recoger el libro en la biblioteca.');
    } catch (err) {
      alert('Error al solicitar préstamo: ' + err.message);
    } finally {
      setIsLoaning(false);
    }
  };

  const handleAddReview = () => {
    if (!user) {
      alert('Debes iniciar sesión para dejar una reseña');
      return;
    }
    // Lógica para abrir formulario de reseña
  };

  if (loading) {
    return (
      <div className="book-details-loading">
        <LoadingSpinner message="Cargando detalles del libro..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="book-details-error">
        <h2>Error al cargar el libro</h2>
        <p>{error}</p>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/catalog')}
        >
          Volver al catálogo
        </button>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="book-not-found">
        <h2>Libro no encontrado</h2>
        <p>El libro que buscas no existe o ha sido eliminado.</p>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/catalog')}
        >
          Explorar catálogo
        </button>
      </div>
    );
  }

  return (
    <div className="book-details">
      {/* Navegación */}
      <div className="book-nav">
        <button 
          className="btn btn-outline btn-sm"
          onClick={() => navigate('/catalog')}
        >
          ← Volver al catálogo
        </button>
        <div className="breadcrumb">
          <span onClick={() => navigate('/')}>Inicio</span>
          <span> / </span>
          <span onClick={() => navigate('/catalog')}>Catálogo</span>
          <span> / </span>
          <span className="current">{book.title}</span>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="book-details-main">
        {/* Columna izquierda - Portada e información básica */}
        <div className="book-cover-section">
          <div className="book-cover-large">
            {book.coverImageUrl ? (
              <img 
                src={book.coverImageUrl} 
                alt={book.title}
                className="book-cover-img-large"
              />
            ) : (
              <div className="book-cover-placeholder-large">
                <span className="cover-icon-large">📖</span>
                <span className="cover-text-large">Sin portada</span>
              </div>
            )}
            
            {/* Etiquetas */}
            <div className="cover-badges">
              {book.availableCopies === 0 && (
                <span className="badge badge-error">Agotado</span>
              )}
              {book.isPopular && (
                <span className="badge badge-info">Popular</span>
              )}
              {book.rating >= 4.5 && (
                <span className="badge badge-success">Excelente</span>
              )}
            </div>
          </div>

          {/* Acciones rápidas */}
          <div className="quick-actions">
            <button
              className={`btn ${book.availableCopies > 0 ? 'btn-primary' : 'btn-warning'} btn-block`}
              onClick={handleLoan}
              disabled={isLoaning || book.availableCopies === 0}
            >
              {isLoaning ? (
                <LoadingSpinner size="small" color="light" />
              ) : book.availableCopies > 0 ? (
                <>
                  <span className="action-icon">📖</span>
                  Solicitar préstamo
                </>
              ) : (
                <>
                  <span className="action-icon">🔔</span>
                  Notificar disponibilidad
                </>
              )}
            </button>

            <button
              className="btn btn-secondary btn-block"
              onClick={handleReserve}
              disabled={isReserving}
            >
              {isReserving ? (
                <LoadingSpinner size="small" color="light" />
              ) : (
                <>
                  <span className="action-icon">📅</span>
                  Reservar
                </>
              )}
            </button>

            <button className="btn btn-outline btn-block">
              <span className="action-icon">⭐</span>
              Añadir a favoritos
            </button>

            <button className="btn btn-outline btn-block">
              <span className="action-icon">📝</span>
              Dejar reseña
            </button>
          </div>

          {/* Información de disponibilidad */}
          <div className="availability-details">
            <h4>Disponibilidad</h4>
            <div className="availability-grid">
              <div className="availability-item">
                <span className="item-label">Copias totales:</span>
                <span className="item-value">{book.totalCopies}</span>
              </div>
              <div className="availability-item">
                <span className="item-label">Disponibles:</span>
                <span className={`item-value ${book.availableCopies > 0 ? 'available' : 'unavailable'}`}>
                  {book.availableCopies}
                </span>
              </div>
              <div className="availability-item">
                <span className="item-label">En préstamo:</span>
                <span className="item-value">{book.totalCopies - book.availableCopies}</span>
              </div>
              <div className="availability-item">
                <span className="item-label">Reservas:</span>
                <span className="item-value">{book.reservationCount || 0}</span>
              </div>
            </div>
            <div className="location-info">
              <span className="location-icon">📍</span>
              <span className="location-text">{book.location || 'Ubicación no especificada'}</span>
            </div>
          </div>
        </div>

        {/* Columna derecha - Detalles */}
        <div className="book-info-section">
          <div className="book-header">
            <h1 className="book-title-large">{book.title}</h1>
            <div className="book-subtitle">
              <span className="rating">
                <span className="stars">★★★★★</span>
                <span className="rating-value">{book.rating}/5</span>
                <span className="rating-count">({book.loanCount || 0} préstamos)</span>
              </span>
              <span className="views">
                <span className="eye-icon">👁️</span>
                {book.viewCount || 0} vistas
              </span>
            </div>
          </div>

          {/* Tabs de navegación */}
          <div className="book-tabs">
            <button
              className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}
              onClick={() => setActiveTab('details')}
            >
              Detalles
            </button>
            <button
              className={`tab-btn ${activeTab === 'authors' ? 'active' : ''}`}
              onClick={() => setActiveTab('authors')}
            >
              Autores
            </button>
            <button
              className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reseñas ({reviews.length})
            </button>
            <button
              className={`tab-btn ${activeTab === 'metadata' ? 'active' : ''}`}
              onClick={() => setActiveTab('metadata')}
            >
              Metadatos
            </button>
          </div>

          {/* Contenido de las tabs */}
          <div className="tab-content">
            {activeTab === 'details' && (
              <div className="details-content">
                <div className="description">
                  <h3>Descripción</h3>
                  <p>{book.description}</p>
                </div>

                <div className="specifications">
                  <h3>Especificaciones</h3>
                  <div className="specs-grid">
                    <div className="spec-item">
                      <span className="spec-label">ISBN:</span>
                      <span className="spec-value">{book.isbn}</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Editorial:</span>
                      <span className="spec-value">{book.publisher}</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Año:</span>
                      <span className="spec-value">{book.publicationYear}</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Idioma:</span>
                      <span className="spec-value">{book.language}</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Páginas:</span>
                      <span className="spec-value">{book.pages}</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Edición:</span>
                      <span className="spec-value">{book.edition}</span>
                    </div>
                  </div>
                </div>

                <div className="categories">
                  <h3>Categorías</h3>
                  <div className="category-tags">
                    {book.categories?.map(cat => (
                      <span key={cat.id} className="category-tag">
                        {cat.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="tags">
                  <h3>Etiquetas</h3>
                  <div className="tag-cloud">
                    {book.tags?.map(tag => (
                      <span key={tag} className="tag">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'authors' && (
              <div className="authors-content">
                {book.authors?.map(author => (
                  <div key={author.id} className="author-card">
                    <div className="author-header">
                      <h3>{author.name}</h3>
                      <span className="author-nationality">{author.nationality}</span>
                    </div>
                    {author.biography && (
                      <p className="author-bio">{author.biography}</p>
                    )}
                    <div className="author-stats">
                      <button className="btn btn-outline btn-sm">
                        Ver otros libros
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="reviews-content">
                <div className="reviews-header">
                  <h3>Reseñas de lectores</h3>
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={handleAddReview}
                  >
                    Escribir reseña
                  </button>
                </div>
                
                <div className="reviews-list">
                  {reviews.length > 0 ? (
                    reviews.map(review => (
                      <div key={review.id} className="review-card">
                        <div className="review-header">
                          <div className="reviewer">{review.user}</div>
                          <div className="review-date">{review.date}</div>
                        </div>
                        <div className="review-rating">
                          {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                        </div>
                        <p className="review-comment">{review.comment}</p>
                      </div>
                    ))
                  ) : (
                    <p className="no-reviews">No hay reseñas aún. ¡Sé el primero en opinar!</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'metadata' && (
              <div className="metadata-content">
                <div className="metadata-grid">
                  <div className="metadata-item">
                    <span className="metadata-label">Fecha de creación:</span>
                    <span className="metadata-value">{book.createdAt}</span>
                  </div>
                  <div className="metadata-item">
                    <span className="metadata-label">Última actualización:</span>
                    <span className="metadata-value">{book.updatedAt}</span>
                  </div>
                  <div className="metadata-item">
                    <span className="metadata-label">Total de préstamos:</span>
                    <span className="metadata-value">{book.loanCount}</span>
                  </div>
                  <div className="metadata-item">
                    <span className="metadata-label">Total de reservas:</span>
                    <span className="metadata-value">{book.reservationCount}</span>
                  </div>
                  <div className="metadata-item">
                    <span className="metadata-label">Total de vistas:</span>
                    <span className="metadata-value">{book.viewCount}</span>
                  </div>
                  <div className="metadata-item">
                    <span className="metadata-label">ID del libro:</span>
                    <span className="metadata-value">{book.id}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Libros relacionados */}
      {relatedBooks.length > 0 && (
        <div className="related-books">
          <h3>Libros relacionados</h3>
          <div className="related-books-grid">
            {relatedBooks.map(relatedBook => (
              <div 
                key={relatedBook.id} 
                className="related-book-card"
                onClick={() => navigate(`/book/${relatedBook.id}`)}
              >
                <div className="related-book-cover">
                  {relatedBook.coverImageUrl ? (
                    <img src={relatedBook.coverImageUrl} alt={relatedBook.title} />
                  ) : (
                    <div className="related-cover-placeholder">📖</div>
                  )}
                </div>
                <div className="related-book-info">
                  <h4>{relatedBook.title}</h4>
                  <p>{relatedBook.author}</p>
                  <div className="related-availability">
                    {relatedBook.availableCopies > 0 ? '✅ Disponible' : '⏳ Agotado'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Acciones de administración (solo para admin/bibliotecario) */}
      {user?.role === 'ADMIN' || user?.role === 'LIBRARIAN' ? (
        <div className="admin-actions">
          <h3>Acciones de administración</h3>
          <div className="admin-buttons">
            <button className="btn btn-outline">
              <span className="btn-icon">✏️</span>
              Editar libro
            </button>
            <button className="btn btn-outline">
              <span className="btn-icon">📊</span>
              Ver estadísticas
            </button>
            <button className="btn btn-outline">
              <span className="btn-icon">🔄</span>
              Actualizar inventario
            </button>
            <button className="btn btn-danger">
              <span className="btn-icon">🗑️</span>
              Eliminar libro
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default BookDetails;
