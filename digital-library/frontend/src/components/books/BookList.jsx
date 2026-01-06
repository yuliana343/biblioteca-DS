import React, { useState, useEffect } from 'react';
import BookCard from './BookCard';
import Pagination from '../common/Pagination';
import LoadingSpinner, { BookSkeleton } from '../common/LoadingSpinner';
import './Books.css';

const BookList = ({
  books = [],
  loading = false,
  onPageChange,
  totalPages = 1,
  currentPage = 1,
  showFilters = true
}) => {
  const [filteredBooks, setFilteredBooks] = useState(books);
  
  useEffect(() => {
    setFilteredBooks(books);
  }, [books]);
  
  if (loading) {
    return (
      <div className="book-list">
        <h2>Libros Disponibles</h2>
        <div className="row">
          {[...Array(6)].map((_, i) => (
            <div className="col-md-4 mb-4" key={i}>
              <BookSkeleton />
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="book-list">
      <h2>Libros Disponibles ({filteredBooks.length})</h2>
      
      {filteredBooks.length === 0 ? (
        <div className="alert alert-info">
          No se encontraron libros con los filtros actuales.
        </div>
      ) : (
        <>
          <div className="row">
            {filteredBooks.map((book) => (
              <div className="col-md-4 mb-4" key={book.id}>
                <BookCard book={book} showActions={true} />
              </div>
            ))}
          </div>
          
          {totalPages > 1 && (
            <div className="mt-4">
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BookList;
