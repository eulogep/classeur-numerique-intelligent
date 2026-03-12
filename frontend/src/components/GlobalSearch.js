import React, { useState, useEffect, useRef } from 'react';
import './GlobalSearch.css';

const GlobalSearch = ({ documents = [], folders = {}, onItemSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(-1);
  const [searchHistory, setSearchHistory] = useState([]);
  const modalRef = useRef(null);
  const inputRef = useRef(null);

  // Charger l'historique de recherche
  useEffect(() => {
    const savedHistory = localStorage.getItem('globalSearchHistory');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Sauvegarder l'historique
  useEffect(() => {
    localStorage.setItem('globalSearchHistory', JSON.stringify(searchHistory));
  }, [searchHistory]);

  // Gérer les raccourcis clavier globaux et événements personnalisés
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        openModal();
      }
      
      if (e.key === 'Escape' && isOpen) {
        closeModal();
      }
    };

    const handleOpenGlobalSearch = () => {
      openModal();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('openGlobalSearch', handleOpenGlobalSearch);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('openGlobalSearch', handleOpenGlobalSearch);
    };
  }, [isOpen]);

  // Fermer le modal en cliquant à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const openModal = () => {
    setIsOpen(true);
    setSearchTerm('');
    setResults([]);
    setSelectedResult(-1);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSearchTerm('');
    setResults([]);
    setSelectedResult(-1);
  };

  // Effectuer la recherche
  useEffect(() => {
    if (searchTerm.trim()) {
      const searchResults = performSearch(searchTerm);
      setResults(searchResults);
    } else {
      setResults([]);
    }
  }, [searchTerm, documents, folders]);

  const performSearch = (term) => {
    const lowerTerm = term.toLowerCase();
    const results = [];

    // Recherche dans les documents
    documents.forEach(doc => {
      const nameMatch = doc.name.toLowerCase().includes(lowerTerm);
      const pathMatch = doc.path.toLowerCase().includes(lowerTerm);
      
      if (nameMatch || pathMatch) {
        results.push({
          type: 'document',
          id: doc.id,
          name: doc.name,
          path: doc.path,
          icon: getFileTypeIcon(doc.type),
          preview: `Document dans ${doc.path}`,
          relevance: nameMatch ? 2 : 1
        });
      }
    });

    // Recherche dans les dossiers
    Object.entries(folders).forEach(([folderName, subFolders]) => {
      if (folderName.toLowerCase().includes(lowerTerm)) {
        results.push({
          type: 'folder',
          id: `folder-${folderName}`,
          name: folderName,
          path: folderName,
          icon: '📁',
          preview: 'Dossier principal',
          relevance: 2
        });
      }

      Object.entries(subFolders).forEach(([subFolderName, subSubFolders]) => {
        if (subFolderName.toLowerCase().includes(lowerTerm)) {
          results.push({
            type: 'folder',
            id: `subfolder-${folderName}-${subFolderName}`,
            name: subFolderName,
            path: `${folderName} > ${subFolderName}`,
            icon: '📂',
            preview: `Sous-dossier de ${folderName}`,
            relevance: 1
          });
        }
      });
    });

    // Recherche dans l'historique
    searchHistory.forEach(historyItem => {
      if (historyItem.toLowerCase().includes(lowerTerm) && 
          !results.some(r => r.name.toLowerCase() === historyItem.toLowerCase())) {
        results.push({
          type: 'history',
          id: `history-${historyItem}`,
          name: historyItem,
          path: '',
          icon: '🕒',
          preview: 'Recherche récente',
          relevance: 0
        });
      }
    });

    // Trier par pertinence
    return results.sort((a, b) => b.relevance - a.relevance).slice(0, 10);
  };

  const getFileTypeIcon = (mimeType) => {
    if (mimeType.includes('pdf')) return '📄';
    if (mimeType.includes('word') || mimeType.includes('document')) return '📝';
    if (mimeType.includes('image')) return '🖼️';
    if (mimeType.includes('video')) return '🎥';
    if (mimeType.includes('audio')) return '🎵';
    if (mimeType.includes('zip') || mimeType.includes('rar')) return '📦';
    return '📄';
  };

  const handleResultSelect = (result) => {
    // Ajouter à l'historique
    const newHistory = [result.name, ...searchHistory.filter(item => item !== result.name)].slice(0, 10);
    setSearchHistory(newHistory);

    // Notifier le parent
    if (onItemSelect) {
      onItemSelect(result);
    }

    // Notification toast
    if (window.showToast) {
      window.showToast('info', 'Élément sélectionné', `Ouverture de "${result.name}"`);
    }

    closeModal();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedResult >= 0 && results[selectedResult]) {
        handleResultSelect(results[selectedResult]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedResult(prev => 
        prev < results.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedResult(prev => prev > 0 ? prev - 1 : -1);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="global-search-overlay">
      <div className="global-search-modal" ref={modalRef}>
        <div className="global-search-header">
          <div className="global-search-icon">🔍</div>
          <input
            ref={inputRef}
            type="text"
            className="global-search-input"
            placeholder="Recherche globale... (Ctrl+K)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className="global-search-close" onClick={closeModal}>
            ✕
          </button>
        </div>

        <div className="global-search-content">
          {searchTerm && results.length > 0 ? (
            <div className="global-search-results">
              {results.map((result, index) => (
                <div
                  key={result.id}
                  className={`global-search-result ${index === selectedResult ? 'selected' : ''}`}
                  onClick={() => handleResultSelect(result)}
                >
                  <div className="result-icon">{result.icon}</div>
                  <div className="result-content">
                    <div className="result-name">{result.name}</div>
                    <div className="result-preview">{result.preview}</div>
                  </div>
                  <div className="result-type">{result.type}</div>
                </div>
              ))}
            </div>
          ) : searchTerm && results.length === 0 ? (
            <div className="global-search-no-results">
              <div className="no-results-icon">🔍</div>
              <div className="no-results-text">
                Aucun résultat pour "{searchTerm}"
              </div>
            </div>
          ) : (
            <div className="global-search-empty">
              <div className="empty-icon">🚀</div>
              <div className="empty-title">Recherche globale</div>
              <div className="empty-subtitle">
                Recherchez dans tous vos documents et dossiers
              </div>
              <div className="empty-tips">
                <div className="tip">💡 Utilisez Ctrl+K pour ouvrir rapidement</div>
                <div className="tip">💡 Recherchez par nom de fichier ou dossier</div>
                <div className="tip">💡 Naviguez avec les flèches ↑↓</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GlobalSearch; 