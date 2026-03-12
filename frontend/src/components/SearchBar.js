import React, { useState, useEffect, useRef, useCallback } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch, onClear, documents = [], folders = {} }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
  const [searchHistory, setSearchHistory] = useState([]);
  const searchInputRef = useRef(null);

  // Charger l'historique de recherche depuis localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Sauvegarder l'historique de recherche
  useEffect(() => {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  }, [searchHistory]);

  const generateSuggestions = useCallback((term) => {
    const suggestions = [];
    const lowerTerm = term.toLowerCase();

    // Suggestions de documents
    documents.forEach(doc => {
      if (doc.name.toLowerCase().includes(lowerTerm)) {
        suggestions.push({
          type: 'document',
          id: doc.id,
          name: doc.name,
          path: doc.path,
          icon: getFileTypeIcon(doc.type),
          preview: `Document dans ${doc.path}`
        });
      }
    });

    // Suggestions de dossiers
    Object.entries(folders).forEach(([folderName, subFolders]) => {
      if (folderName.toLowerCase().includes(lowerTerm)) {
        suggestions.push({
          type: 'folder',
          id: `folder-${folderName}`,
          name: folderName,
          path: folderName,
          icon: '📁',
          preview: 'Dossier principal'
        });
      }

      Object.entries(subFolders).forEach(([subFolderName, subSubFolders]) => {
        if (subFolderName.toLowerCase().includes(lowerTerm)) {
          suggestions.push({
            type: 'folder',
            id: `subfolder-${folderName}-${subFolderName}`,
            name: subFolderName,
            path: `${folderName} > ${subFolderName}`,
            icon: '📂',
            preview: `Sous-dossier de ${folderName}`
          });
        }
      });
    });

    // Suggestions de l'historique
    searchHistory.forEach(historyItem => {
      if (historyItem.toLowerCase().includes(lowerTerm) && 
          !suggestions.some(s => s.name.toLowerCase() === historyItem.toLowerCase())) {
        suggestions.push({
          type: 'history',
          id: `history-${historyItem}`,
          name: historyItem,
          path: '',
          icon: '🕒',
          preview: 'Recherche récente'
        });
      }
    });

    return suggestions.slice(0, 8); // Limiter à 8 suggestions
  }, [documents, folders, searchHistory]);

  // Gérer les suggestions de recherche
  useEffect(() => {
    if (searchTerm.length > 0) {
      const newSuggestions = generateSuggestions(searchTerm);
      setSuggestions(newSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm, generateSuggestions]);

  // Gérer les raccourcis clavier
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        setIsExpanded(true);
      }
      
      if (e.key === 'Escape') {
        setIsExpanded(false);
        setShowSuggestions(false);
        searchInputRef.current?.blur();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const getFileTypeIcon = (mimeType) => {
    if (mimeType.includes('pdf')) return '📄';
    if (mimeType.includes('word') || mimeType.includes('document')) return '📝';
    if (mimeType.includes('image')) return '🖼️';
    if (mimeType.includes('video')) return '🎥';
    if (mimeType.includes('audio')) return '🎵';
    if (mimeType.includes('zip') || mimeType.includes('rar')) return '📦';
    return '📄';
  };

  const handleSearch = (term = searchTerm) => {
    if (term.trim()) {
      onSearch(term);
      
      // Ajouter à l'historique
      const newHistory = [term, ...searchHistory.filter(item => item !== term)].slice(0, 10);
      setSearchHistory(newHistory);
      
      // Notification toast
      if (window.showToast) {
        window.showToast('info', 'Recherche effectuée', `Résultats pour "${term}"`);
      }
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    setShowSuggestions(false);
    setSelectedSuggestion(-1);
    onClear();
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.name);
    setShowSuggestions(false);
    handleSearch(suggestion.name);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedSuggestion >= 0 && suggestions[selectedSuggestion]) {
        handleSuggestionClick(suggestions[selectedSuggestion]);
      } else {
        handleSearch();
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedSuggestion(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedSuggestion(prev => prev > 0 ? prev - 1 : -1);
    }
  };

  const handleFocus = () => {
    setIsExpanded(true);
    if (searchTerm.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleBlur = () => {
    // Délai pour permettre le clic sur les suggestions
    setTimeout(() => {
      setShowSuggestions(false);
      setSelectedSuggestion(-1);
    }, 200);
  };

  return (
    <div className={`search-bar-container ${isExpanded ? 'expanded' : ''}`}>
      <div className="search-bar">
        <div className="search-icon">🔍</div>
        <input
          ref={searchInputRef}
          type="text"
          className="search-input"
          placeholder="Rechercher des documents, dossiers... (Ctrl+K)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {searchTerm && (
          <button className="search-clear" onClick={handleClear}>
            ✕
          </button>
        )}
        <div className="search-shortcut">Ctrl+K</div>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="search-suggestions">
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion.id}
              className={`suggestion-item ${index === selectedSuggestion ? 'selected' : ''}`}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <div className="suggestion-icon">{suggestion.icon}</div>
              <div className="suggestion-content">
                <div className="suggestion-name">{suggestion.name}</div>
                <div className="suggestion-preview">{suggestion.preview}</div>
              </div>
              <div className="suggestion-type">{suggestion.type}</div>
            </div>
          ))}
        </div>
      )}

      {showSuggestions && searchTerm.length > 0 && suggestions.length === 0 && (
        <div className="search-suggestions">
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <div className="no-results-text">
              Aucun résultat pour "{searchTerm}"
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar; 