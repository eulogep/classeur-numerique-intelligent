import React, { useState, useCallback, useEffect } from 'react';
import { useFolders } from '../contexts/FolderContext';
import './SearchBar.css';

/**
 * Composant de recherche refactorisé
 * Remplace SearchBar, AdvancedSearch et GlobalSearch par une solution unifiée
 */

const SearchV2 = ({ onResultsChange, onClose }) => {
  const { searchDocuments, folders, documents, getFolderPath } = useFolders();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filters, setFilters] = useState({
    type: 'all',
    dateFrom: '',
    dateTo: '',
    sizeMin: '',
    sizeMax: ''
  });

  // Charger l'historique de recherche
  useEffect(() => {
    const saved = localStorage.getItem('searchHistory_v2');
    if (saved) {
      setSearchHistory(JSON.parse(saved));
    }
  }, []);

  // Sauvegarder l'historique de recherche
  const saveToHistory = useCallback((term) => {
    if (!term.trim()) return;

    const newHistory = [
      term,
      ...searchHistory.filter(h => h !== term)
    ].slice(0, 10);

    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory_v2', JSON.stringify(newHistory));
  }, [searchHistory]);

  // Effectuer la recherche
  const performSearch = useCallback((term) => {
    if (!term.trim()) {
      setResults([]);
      onResultsChange([]);
      return;
    }

    let searchResults = searchDocuments(term);

    // Appliquer les filtres avancés
    if (showAdvanced) {
      // Filtre par type
      if (filters.type !== 'all') {
        searchResults = searchResults.filter(doc => {
          const docType = doc.type?.split('/')[0] || 'document';
          return docType === filters.type;
        });
      }

      // Filtre par date
      if (filters.dateFrom) {
        const dateFrom = new Date(filters.dateFrom);
        searchResults = searchResults.filter(doc =>
          new Date(doc.addedAt) >= dateFrom
        );
      }

      if (filters.dateTo) {
        const dateTo = new Date(filters.dateTo);
        dateTo.setHours(23, 59, 59, 999);
        searchResults = searchResults.filter(doc =>
          new Date(doc.addedAt) <= dateTo
        );
      }

      // Filtre par taille
      if (filters.sizeMin) {
        const minSize = parseInt(filters.sizeMin) * 1024; // Convertir en bytes
        searchResults = searchResults.filter(doc =>
          (doc.size || 0) >= minSize
        );
      }

      if (filters.sizeMax) {
        const maxSize = parseInt(filters.sizeMax) * 1024; // Convertir en bytes
        searchResults = searchResults.filter(doc =>
          (doc.size || 0) <= maxSize
        );
      }
    }

    setResults(searchResults);
    onResultsChange(searchResults);
  }, [searchDocuments, showAdvanced, filters, onResultsChange]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    performSearch(term);
    setShowHistory(false);
  };

  const handleSearchSubmit = () => {
    if (searchTerm.trim()) {\n      saveToHistory(searchTerm);
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    setResults([]);
    setShowHistory(false);
    onResultsChange([]);
  };

  const handleFilterChange = (filterName, value) => {
    const newFilters = { ...filters, [filterName]: value };
    setFilters(newFilters);

    // Re-effectuer la recherche avec les nouveaux filtres
    if (searchTerm.trim()) {
      performSearch(searchTerm);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType) => {
    if (mimeType.includes('pdf')) return '📄';
    if (mimeType.includes('word') || mimeType.includes('document')) return '📝';
    if (mimeType.includes('image')) return '🖼️';
    if (mimeType.includes('video')) return '🎥';
    if (mimeType.includes('audio')) return '🎵';
    if (mimeType.includes('zip') || mimeType.includes('rar')) return '📦';
    if (mimeType.includes('text')) return '📋';
    return '📄';
  };

  return (
    <div className="search-v2">
      {/* Barre de recherche */}
      <div className="search-input-container">
        <input
          type="text"
          className="search-input"
          placeholder="Rechercher des documents..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setShowHistory(true)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit()}
          autoFocus
        />
        {searchTerm && (
          <button className="clear-btn" onClick={handleClear}>
            ✕
          </button>
        )}
        <button
          className={`advanced-btn ${showAdvanced ? 'active' : ''}`}
          onClick={() => setShowAdvanced(!showAdvanced)}
          title="Filtres avancés"
        >
          ⚙️
        </button>
      </div>

      {/* Filtres avancés */}
      {showAdvanced && (
        <div className="advanced-filters">
          <div className="filter-group">
            <label>Type de fichier</label>
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
            >
              <option value="all">Tous les types</option>
              <option value="image">Images</option>
              <option value="video">Vidéos</option>
              <option value="audio">Audio</option>
              <option value="application">Documents</option>
              <option value="text">Texte</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Date de</label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Date à</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Taille min (KB)</label>
            <input
              type="number"
              min="0"
              value={filters.sizeMin}
              onChange={(e) => handleFilterChange('sizeMin', e.target.value)}
              placeholder="0"
            />
          </div>

          <div className="filter-group">
            <label>Taille max (KB)</label>
            <input
              type="number"
              min="0"
              value={filters.sizeMax}
              onChange={(e) => handleFilterChange('sizeMax', e.target.value)}
              placeholder="∞"
            />
          </div>
        </div>
      )}

      {/* Résultats ou historique */}
      <div className="search-results">
        {searchTerm ? (
          <>
            <div className="results-header">
              {results.length} résultat{results.length !== 1 ? 's' : ''}
            </div>
            {results.length === 0 ? (
              <div className="empty-results">
                <p>Aucun document trouvé</p>
              </div>
            ) : (
              <div className="results-list">
                {results.map(doc => (
                  <div key={doc.id} className="result-item">
                    <span className="result-icon">{getFileIcon(doc.type)}</span>
                    <div className="result-info">
                      <div className="result-name">{doc.name}</div>
                      <div className="result-meta">
                        {formatFileSize(doc.size)} • {new Date(doc.addedAt).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : showHistory && searchHistory.length > 0 ? (
          <>
            <div className="history-header">Historique de recherche</div>
            <div className="history-list">
              {searchHistory.map((term, index) => (
                <button
                  key={index}
                  className="history-item"
                  onClick={() => handleSearch(term)}
                >
                  🕐 {term}
                </button>
              ))}
            </div>
          </>
        ) : null}
      </div>

      {/* Bouton de fermeture */}
      {onClose && (
        <button className="close-search-btn" onClick={onClose}>
          ✕ Fermer
        </button>
      )}
    </div>
  );
};

export default SearchV2;
