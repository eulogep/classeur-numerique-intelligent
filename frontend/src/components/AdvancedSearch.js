import React, { useState, useEffect, useRef } from 'react';
import './AdvancedSearch.css';

const AdvancedSearch = ({ documents, onSearch, onClear }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filters, setFilters] = useState({
    type: 'all',
    dateFrom: '',
    dateTo: '',
    sizeMin: '',
    sizeMax: '',
    folder: 'all'
  });
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  // Charger l'historique depuis localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Sauvegarder l'historique
  useEffect(() => {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  }, [searchHistory]);

  // Générer les suggestions basées sur les documents
  useEffect(() => {
    if (searchTerm.length > 1) {
      const docSuggestions = documents
        .filter(doc => 
          doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doc.path.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .slice(0, 5)
        .map(doc => ({
          type: 'document',
          text: doc.name,
          path: doc.path,
          icon: getFileIcon(doc.type)
        }));

      const folderSuggestions = [...new Set(documents.map(doc => doc.path))]
        .filter(path => path.toLowerCase().includes(searchTerm.toLowerCase()))
        .slice(0, 3)
        .map(path => ({
          type: 'folder',
          text: path,
          icon: '📁'
        }));

      setSuggestions([...docSuggestions, ...folderSuggestions]);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm, documents]);

  const getFileIcon = (mimeType) => {
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
      // Ajouter à l'historique
      const newHistory = [term, ...searchHistory.filter(h => h !== term)].slice(0, 10);
      setSearchHistory(newHistory);
      
      // Effectuer la recherche avec les filtres
      const searchResults = performAdvancedSearch(term);
      onSearch(searchResults);
    } else {
      onClear();
    }
  };

  const performAdvancedSearch = (term) => {
    let results = documents.filter(doc => {
      const matchesTerm = 
        doc.name.toLowerCase().includes(term.toLowerCase()) ||
        doc.path.toLowerCase().includes(term.toLowerCase());
      
      if (!matchesTerm) return false;

      // Filtres avancés
      if (filters.type !== 'all') {
        const docType = getFileType(doc.type);
        if (docType.toLowerCase() !== filters.type) return false;
      }

      if (filters.dateFrom) {
        const docDate = new Date(doc.lastModified);
        const fromDate = new Date(filters.dateFrom);
        if (docDate < fromDate) return false;
      }

      if (filters.dateTo) {
        const docDate = new Date(doc.lastModified);
        const toDate = new Date(filters.dateTo);
        if (docDate > toDate) return false;
      }

      if (filters.sizeMin) {
        const minSize = parseInt(filters.sizeMin) * 1024 * 1024; // MB to bytes
        if (doc.size < minSize) return false;
      }

      if (filters.sizeMax) {
        const maxSize = parseInt(filters.sizeMax) * 1024 * 1024; // MB to bytes
        if (doc.size > maxSize) return false;
      }

      if (filters.folder !== 'all') {
        if (doc.path !== filters.folder) return false;
      }

      return true;
    });

    return results;
  };

  const getFileType = (mimeType) => {
    if (mimeType.includes('pdf')) return 'PDF';
    if (mimeType.includes('word') || mimeType.includes('document')) return 'Document';
    if (mimeType.includes('image')) return 'Image';
    if (mimeType.includes('video')) return 'Vidéo';
    if (mimeType.includes('audio')) return 'Audio';
    if (mimeType.includes('zip') || mimeType.includes('rar')) return 'Archive';
    return 'Autre';
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.text);
    handleSearch(suggestion.text);
    setShowSuggestions(false);
  };

  const handleHistoryClick = (term) => {
    setSearchTerm(term);
    handleSearch(term);
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
      setShowSuggestions(false);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const getUniqueFolders = () => {
    return [...new Set(documents.map(doc => doc.path))];
  };

  return (
    <div className="advanced-search" ref={searchRef}>
      <div className="search-container">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Recherche avancée..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
            className="search-input"
          />
          <button 
            className="advanced-toggle"
            onClick={() => setShowAdvanced(!showAdvanced)}
            title="Filtres avancés"
          >
            ⚙️
          </button>
          {searchTerm && (
            <button onClick={() => {
              setSearchTerm('');
              onClear();
            }} className="clear-btn">
              ✕
            </button>
          )}
        </div>

        {/* Suggestions */}
        {showSuggestions && (searchTerm.length > 1 || searchHistory.length > 0) && (
          <div className="suggestions-panel">
            {suggestions.length > 0 && (
              <div className="suggestions-section">
                <h4>💡 Suggestions</h4>
                {suggestions.map((suggestion, index) => (
                  <div 
                    key={index}
                    className="suggestion-item"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <span className="suggestion-icon">{suggestion.icon}</span>
                    <div className="suggestion-content">
                      <div className="suggestion-text">{suggestion.text}</div>
                      {suggestion.path && (
                        <div className="suggestion-path">{suggestion.path}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {searchHistory.length > 0 && (
              <div className="history-section">
                <div className="history-header">
                  <h4>🕒 Historique</h4>
                  <button onClick={clearHistory} className="clear-history-btn">
                    Effacer
                  </button>
                </div>
                {searchHistory.slice(0, 5).map((term, index) => (
                  <div 
                    key={index}
                    className="history-item"
                    onClick={() => handleHistoryClick(term)}
                  >
                    <span className="history-icon">🔍</span>
                    <span className="history-text">{term}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Filtres avancés */}
      {showAdvanced && (
        <div className="advanced-filters">
          <div className="filters-grid">
            <div className="filter-group">
              <label>Type de fichier</label>
              <select 
                value={filters.type}
                onChange={(e) => setFilters({...filters, type: e.target.value})}
              >
                <option value="all">Tous les types</option>
                <option value="pdf">PDF</option>
                <option value="document">Documents</option>
                <option value="image">Images</option>
                <option value="vidéo">Vidéos</option>
                <option value="audio">Audio</option>
                <option value="archive">Archives</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Dossier</label>
              <select 
                value={filters.folder}
                onChange={(e) => setFilters({...filters, folder: e.target.value})}
              >
                <option value="all">Tous les dossiers</option>
                {getUniqueFolders().map(folder => (
                  <option key={folder} value={folder}>{folder}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Date de début</label>
              <input 
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
              />
            </div>

            <div className="filter-group">
              <label>Date de fin</label>
              <input 
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
              />
            </div>

            <div className="filter-group">
              <label>Taille min (MB)</label>
              <input 
                type="number"
                placeholder="0"
                value={filters.sizeMin}
                onChange={(e) => setFilters({...filters, sizeMin: e.target.value})}
              />
            </div>

            <div className="filter-group">
              <label>Taille max (MB)</label>
              <input 
                type="number"
                placeholder="1000"
                value={filters.sizeMax}
                onChange={(e) => setFilters({...filters, sizeMax: e.target.value})}
              />
            </div>
          </div>

          <div className="filter-actions">
            <button 
              className="apply-filters-btn"
              onClick={() => handleSearch()}
            >
              🔍 Appliquer les filtres
            </button>
            <button 
              className="reset-filters-btn"
              onClick={() => {
                setFilters({
                  type: 'all',
                  dateFrom: '',
                  dateTo: '',
                  sizeMin: '',
                  sizeMax: '',
                  folder: 'all'
                });
              }}
            >
              🔄 Réinitialiser
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch; 