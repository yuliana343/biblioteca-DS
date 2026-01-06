import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BookCard from '../components/books/BookCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { bookService } from '../services/api/bookService';
import './HomePage.css';

const HomePage = () => {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [recentBooks, setRecentBooks] = useState([]);
  const [popularBooks, setPopularBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    setLoading(true);
    try {
      // Simulación de datos
      const mockFeatured = Array.from({ length: 6 }, (_, i) => ({
        id: i + 1,
        title: `Libro Destacado ${i + 1}`,
        author: `Autor ${i + 1}`,
        cover: 'https://via.placeholder.com/150x200',
        category: ['Ficción', 'Ciencia', 'Historia'][i % 3],
        rating: 4.5 - (i * 0.1),
        available: i % 3 !== 0
      }));

      const mockRecent = Array.from({ length: 8 }, (_, i) => ({
        id: i + 101,
        title: `Nuevo Libro ${i + 1}`,
        author: `Autor Nuevo ${i + 1}`,
        cover: 'https://via.placeholder.com/120x160',
        addedDate: new Date(2023, 10, i + 1).toISOString()
      }));

      const mockPopular = Array.from({ length: 6 }, (_, i) => ({
        id: i + 201,
        title: `Libro Popular ${i + 1}`,
        author: `Autor Popular ${i + 1}`,
        cover: 'https://via.placeholder.com/150x200',
        loans: 150 - (i * 20),
        rating: 4.8 - (i * 0.1)
      }));

      const mockStats = {
        totalBooks: 12345,
        availableBooks: 9876,
        activeLoans: 456,
        totalUsers: 2345
      };

      setTimeout(() => {
        setFeaturedBooks(mockFeatured);
        setRecentBooks(mockRecent);
        setPopularBooks(mockPopular);
        setStats(mockStats);
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error loading home data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="homepage">
        <div className="homepage-loading">
          <LoadingSpinner message="Cargando catálogo..." />
        </div>
      </div>
    );
  }

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Biblioteca Digital Universitaria</h1>
          <p className="hero-subtitle">
            Accede a miles de libros, revistas y recursos académicos desde cualquier lugar
          </p>
          <div className="hero-search">
            <input
              type="text"
              placeholder="Buscar libros, autores, categorías..."
              className="search-input-large"
            />
            <button className="search-btn-large">
              <span className="search-icon">🔍</span> Buscar
            </button>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">{stats.totalBooks.toLocaleString()}</span>
              <span className="stat-label">Libros</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{stats.availableBooks.toLocaleString()}</span>
              <span className="stat-label">Disponibles</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{stats.activeLoans}</span>
              <span className="stat-label">Préstamos Activos</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{stats.totalUsers.toLocaleString()}</span>
              <span className="stat-label">Usuarios</span>
            </div>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-book-stack">
            <div className="book book-1">📚</div>
            <div className="book book-2">📖</div>
            <div className="book book-3">📕</div>
          </div>
        </div>
      </section>

      {/* Featured Books */}
      <section className="featured-section">
        <div className="section-header">
          <h2>📚 Libros Destacados</h2>
          <Link to="/catalog" className="view-all-link">
            Ver todos →
          </Link>
        </div>
        <div className="books-grid">
          {featuredBooks.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="quick-actions-section">
        <h2>🚀 Acceso Rápido</h2>
        <div className="quick-actions-grid">
          <Link to="/catalog" className="quick-action-card">
            <div className="action-icon">🔍</div>
            <div className="action-content">
              <h3>Buscar Libros</h3>
              <p>Explora nuestro catálogo completo</p>
            </div>
          </Link>
          <Link to="/my-loans" className="quick-action-card">
            <div className="action-icon">📖</div>
            <div className="action-content">
              <h3>Mis Préstamos</h3>
              <p>Gestiona tus préstamos activos</p>
            </div>
          </Link>
          <Link to="/profile" className="quick-action-card">
            <div className="action-icon">👤</div>
            <div className="action-content">
              <h3>Mi Perfil</h3>
              <p>Actualiza tu información personal</p>
            </div>
          </Link>
          <Link to="/catalog?new=true" className="quick-action-card">
            <div className="action-icon">🆕</div>
            <div className="action-content">
              <h3>Novedades</h3>
              <p>Libros recién agregados</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Recent Additions & Popular Books */}
      <div className="two-column-section">
        <section className="recent-section">
          <div className="section-header">
            <h2>🆕 Recientemente Agregados</h2>
          </div>
          <div className="recent-books-list">
            {recentBooks.map(book => (
              <div key={book.id} className="recent-book-item">
                <div className="recent-book-cover">
                  <img src={book.cover} alt={book.title} />
                </div>
                <div className="recent-book-info">
                  <h4>{book.title}</h4>
                  <p className="author">{book.author}</p>
                  <p className="date">
                    Agregado: {new Date(book.addedDate).toLocaleDateString()}
                  </p>
                </div>
                <Link to={`/book/${book.id}`} className="view-btn">
                  Ver
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="popular-section">
          <div className="section-header">
            <h2>⭐ Más Populares</h2>
          </div>
          <div className="popular-books-list">
            {popularBooks.map((book, index) => (
              <div key={book.id} className="popular-book-item">
                <div className="rank-number">{index + 1}</div>
                <div className="popular-book-cover">
                  <img src={book.cover} alt={book.title} />
                </div>
                <div className="popular-book-info">
                  <h4>{book.title}</h4>
                  <p className="author">{book.author}</p>
                  <div className="popular-stats">
                    <span className="loans">📖 {book.loans} préstamos</span>
                    <span className="rating">⭐ {book.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Categories */}
      <section className="categories-section">
        <div className="section-header">
          <h2>🏷️ Categorías</h2>
          <Link to="/catalog" className="view-all-link">
            Explorar todas →
          </Link>
        </div>
        <div className="categories-grid">
          {[
            { name: 'Ficción', icon: '📚', count: 2345 },
            { name: 'Ciencia', icon: '🔬', count: 1567 },
            { name: 'Historia', icon: '🏛️', count: 987 },
            { name: 'Arte', icon: '🎨', count: 654 },
            { name: 'Tecnología', icon: '💻', count: 1987 },
            { name: 'Negocios', icon: '💼', count: 876 },
            { name: 'Filosofía', icon: '🤔', count: 543 },
            { name: 'Poesía', icon: '✍️', count: 321 }
          ].map(category => (
            <Link 
              key={category.name} 
              to={`/catalog?category=${category.name}`}
              className="category-card"
            >
              <div className="category-icon">{category.icon}</div>
              <div className="category-info">
                <h3>{category.name}</h3>
                <p>{category.count.toLocaleString()} libros</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>¿Listo para explorar?</h2>
          <p>
            Únete a miles de estudiantes y profesores que ya usan nuestra biblioteca digital.
            Accede a recursos académicos 24/7 desde cualquier dispositivo.
          </p>
          <div className="cta-buttons">
            <Link to="/login" className="btn btn-primary btn-large">
              Iniciar Sesión
            </Link>
            <Link to="/register" className="btn btn-outline btn-large">
              Registrarse
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;