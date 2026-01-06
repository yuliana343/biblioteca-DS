import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./SearchBar.css";

const SearchBar = ({ placeholder = "Buscar libros por título, autor, ISBN..." }) => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      const params = new URLSearchParams(location.search);
      params.set("q", query);
      navigate(`/catalog?${params.toString()}`);
    }
  };

  return (
    <form className="search-bar" onSubmit={handleSearch}>
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="btn btn-primary" type="submit">
          <i className="bi bi-search"></i> Buscar
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
