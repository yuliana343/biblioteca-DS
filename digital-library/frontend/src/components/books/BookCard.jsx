import React, { useState } from "react";
import "./Books.css";

const BookCard = ({ book }) => {
  const [isLoading, setIsLoading] = useState(false);

  if (!book) return null;

  return (
    <div className="book-card">
      <div className="book-card-inner">
        <div className="book-cover">
          {book.cover ? (
            <img src={book.cover} alt={book.title} />
          ) : (
            <div className="book-cover-placeholder">
              <span className="book-icon">📚</span>
            </div>
          )}
        </div>
        
        <div className="book-info">
          <h3 className="book-title">{book.title}</h3>
          <p className="book-author">{book.author}</p>
          
          <div className="book-meta">
            {book.category && (
              <span className="book-category">{book.category}</span>
            )}
            
            {book.rating && (
              <div className="book-rating">
                <span className="rating-stars">
                  {"⭐".repeat(Math.floor(book.rating))}
                </span>
                <span className="rating-value">{book.rating}</span>
              </div>
            )}
            
            {book.available !== undefined && (
              <div className="book-availability">
                {book.available ? (
                  <span className="available">✅ Disponible</span>
                ) : (
                  <span className="unavailable">⏳ En préstamo</span>
                )}
              </div>
            )}
          </div>
          
          <div className="book-actions">
            <button 
              className="btn-view-details"
              onClick={() => console.log("Ver detalles:", book.id)}
            >
              Ver Detalles
            </button>
            
            {book.available && (
              <button 
                className="btn-borrow"
                onClick={() => console.log("Solicitar:", book.id)}
                disabled={isLoading}
              >
                {isLoading ? "Procesando..." : "Solicitar"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;


