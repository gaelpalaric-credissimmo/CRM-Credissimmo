import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchGlobal } from '../api/api';
import { FiSearch, FiX, FiUser, FiUsers, FiBriefcase, FiMail, FiPhone } from 'react-icons/fi';

function SearchGlobal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
      } else if (e.key === 'Enter' && selectedIndex >= 0) {
        handleSelectResult(results[selectedIndex]);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex]);

  const handleSearch = async (searchQuery) => {
    if (searchQuery.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await searchGlobal(searchQuery);
      setResults(response.data);
      setSelectedIndex(-1);
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      handleSearch(query);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleSelectResult = (result) => {
    let path = '';
    switch (result.type) {
      case 'client':
        path = `/clients`;
        break;
      case 'prospect':
        path = `/prospects`;
        break;
      case 'opportunite':
        path = `/opportunites`;
        break;
      default:
        return;
    }
    
    onClose();
    setQuery('');
    setResults([]);
    navigate(path);
    
    // Scroll vers l'élément après navigation (nécessite un ID dans les résultats)
    setTimeout(() => {
      if (result.id) {
        const element = document.getElementById(`item-${result.id}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.style.backgroundColor = '#fff3cd';
          setTimeout(() => {
            element.style.backgroundColor = '';
          }, 2000);
        }
      }
    }, 100);
  };

  const getIcon = (type) => {
    switch (type) {
      case 'client':
        return <FiUsers />;
      case 'prospect':
        return <FiUser />;
      case 'opportunite':
        return <FiBriefcase />;
      default:
        return <FiSearch />;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'client':
        return 'Client';
      case 'prospect':
        return 'Prospect';
      case 'opportunite':
        return 'Opportunité';
      default:
        return type;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="search-modal" onClick={(e) => e.stopPropagation()}>
        <div className="search-header">
          <div className="search-input-container">
            <FiSearch className="search-icon" />
            <input
              ref={inputRef}
              type="text"
              className="search-input"
              placeholder="Rechercher un client, prospect, opportunité..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button
                className="search-clear"
                onClick={() => {
                  setQuery('');
                  setResults([]);
                }}
              >
                <FiX />
              </button>
            )}
          </div>
          <button className="search-close" onClick={onClose}>
            <FiX />
          </button>
        </div>

        {loading && (
          <div className="search-loading">
            <div className="spinner"></div>
            <span>Recherche en cours...</span>
          </div>
        )}

        {!loading && query.length >= 2 && results.length === 0 && (
          <div className="search-empty">
            <FiSearch />
            <p>Aucun résultat trouvé pour "{query}"</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="search-results">
            {results.map((result, index) => (
              <div
                key={`${result.type}-${result.id}`}
                className={`search-result-item ${selectedIndex === index ? 'selected' : ''}`}
                onClick={() => handleSelectResult(result)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className="search-result-icon">
                  {getIcon(result.type)}
                </div>
                <div className="search-result-content">
                  <div className="search-result-title">
                    {result.title}
                    <span className="search-result-type">{getTypeLabel(result.type)}</span>
                  </div>
                  {result.subtitle && (
                    <div className="search-result-subtitle">{result.subtitle}</div>
                  )}
                  {result.details && (
                    <div className="search-result-details">
                      {result.details.map((detail, i) => (
                        <span key={i} className="search-result-detail">
                          {detail.icon && <span className="detail-icon">{detail.icon}</span>}
                          {detail.text}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {query.length < 2 && (
          <div className="search-hint">
            <p>Commencez à taper pour rechercher...</p>
            <div className="search-shortcuts">
              <kbd>↑</kbd><kbd>↓</kbd> Naviguer
              <kbd>Enter</kbd> Sélectionner
              <kbd>Esc</kbd> Fermer
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchGlobal;




