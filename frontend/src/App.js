/**
 * Classeur Numérique Intelligent - Application principale
 * 
 * @author EULOGE JUNIOR MABIALA
 * @version 1.0.0
 * @description Application React pour la gestion documentaire intelligente
 */

import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

// Composants simplifiés
import FolderTree from './components/FolderTree';
import DocumentGallery from './components/DocumentGallery';
import DocumentImport from './components/DocumentImport';
import SearchBar from './components/SearchBar';
import FilterBar from './components/FilterBar';
import StatsPanel from './components/StatsPanel';
import Dashboard from './components/Dashboard';
import KeyboardShortcuts from './components/KeyboardShortcuts';
import AdvancedSearch from './components/AdvancedSearch';
import ThemeManager from './components/ThemeManager';
import BackupManager from './components/BackupManager';
import FeatureTester from './components/FeatureTester';
import DynamicCards from './components/DynamicCards';
import ToastNotifications from './components/ToastNotifications';
import ParticleEffects from './components/ParticleEffects';
import GlobalSearch from './components/GlobalSearch';

function App() {
  const [folders, setFolders] = useState({});
  const [documents, setDocuments] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentFilter, setCurrentFilter] = useState('all');
  const [currentSort, setCurrentSort] = useState('name');
  const [showDashboard, setShowDashboard] = useState(false);
  const [useAdvancedSearch, setUseAdvancedSearch] = useState(false);
  const [showDynamicCards, setShowDynamicCards] = useState(false);

  // Charger les données depuis le localStorage
  useEffect(() => {
    const savedFolders = localStorage.getItem('classeurFolders');
    const savedDocuments = localStorage.getItem('classeurDocuments');
    if (savedFolders) {
      setFolders(JSON.parse(savedFolders));
    }
    if (savedDocuments) {
      setDocuments(JSON.parse(savedDocuments));
    }
  }, []);

  // Sauvegarder les données dans le localStorage
  useEffect(() => {
    localStorage.setItem('classeurFolders', JSON.stringify(folders));
    localStorage.setItem('classeurDocuments', JSON.stringify(documents));
  }, [folders, documents]);

  const getFileType = useCallback((mimeType) => {
    if (mimeType.includes('pdf')) return 'PDF';
    if (mimeType.includes('word') || mimeType.includes('document')) return 'Document';
    if (mimeType.includes('image')) return 'Image';
    if (mimeType.includes('video')) return 'Vidéo';
    if (mimeType.includes('audio')) return 'Audio';
    if (mimeType.includes('zip') || mimeType.includes('rar')) return 'Archive';
    return 'Autre';
  }, []);

  const getDocumentsInFolder = useCallback((folderPath) => {
    return documents.filter(doc => doc.path === folderPath);
  }, [documents]);

  // Filtrer et trier les documents
  useEffect(() => {
    let filtered = getDocumentsInFolder(selectedFolder);

    if (searchTerm) {
      filtered = filtered.filter(doc =>
        doc.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (currentFilter !== 'all') {
      filtered = filtered.filter(doc => getFileType(doc.type).toLowerCase() === currentFilter);
    }

    filtered.sort((a, b) => {
      if (currentSort === 'name') {
        return a.name.localeCompare(b.name);
      } else if (currentSort === 'date') {
        return new Date(b.lastModified) - new Date(a.lastModified);
      } else if (currentSort === 'size') {
        return b.size - a.size;
      }
      return 0;
    });

    setFilteredDocuments(filtered);
  }, [selectedFolder, documents, searchTerm, currentFilter, currentSort, getDocumentsInFolder, getFileType]);

  const handleFolderSelect = (folderPath) => {
    setSelectedFolder(folderPath);
    setSearchTerm('');
    setCurrentFilter('all');
    setShowDashboard(false);
    setShowDynamicCards(false);
    
    // Notification toast
    if (window.showToast) {
      window.showToast('info', 'Dossier sélectionné', `Ouverture de "${folderPath}"`);
    }
  };

  const handleAddDocuments = (newDocuments) => {
    setDocuments(prev => [...prev, ...newDocuments]);
    
    // Notification toast
    if (window.showToast) {
      window.showToast('success', 'Documents ajoutés', `${newDocuments.length} document(s) importé(s) avec succès`);
    }
  };

  const handleImportFolder = (folderPath, files) => {
    const newDocuments = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: file.lastModified,
      path: folderPath,
      content: null
    }));
    setDocuments(prev => [...prev, ...newDocuments]);
    
    // Notification toast
    if (window.showToast) {
      window.showToast('success', 'Dossier importé', `${files.length} fichier(s) importé(s) dans "${folderPath}"`);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleSearchClear = () => {
    setSearchTerm('');
  };

  const handleAdvancedSearch = (searchResults) => {
    setFilteredDocuments(searchResults);
    
    // Notification toast
    if (window.showToast) {
      window.showToast('info', 'Recherche avancée', `${searchResults.length} résultat(s) trouvé(s)`);
    }
  };

  const handleFilterChange = (filter) => {
    setCurrentFilter(filter);
  };

  const handleSortChange = (sort) => {
    setCurrentSort(sort);
  };

  const handleFoldersChange = (newFolders) => {
    setFolders(newFolders);
    if (selectedFolder && !folderExists(newFolders, selectedFolder)) {
      setSelectedFolder(null);
    }
    
    // Notification toast
    if (window.showToast) {
      window.showToast('success', 'Structure mise à jour', 'Organisation des dossiers modifiée');
    }
  };

  const folderExists = (folders, path) => {
    const pathParts = path.split(' > ');
    if (pathParts.length === 1) {
      return folders.hasOwnProperty(pathParts[0]);
    } else if (pathParts.length === 2) {
      return folders[pathParts[0]] && folders[pathParts[0]].hasOwnProperty(pathParts[1]);
    } else if (pathParts.length === 3) {
      return folders[pathParts[0]] && 
             folders[pathParts[0]][pathParts[1]] && 
             folders[pathParts[0]][pathParts[1]].hasOwnProperty(pathParts[2]);
    }
    return false;
  };

  const handleShortcut = (shortcut) => {
    switch (shortcut) {
      case 'search':
        const searchInput = document.querySelector('.search-input');
        if (searchInput) searchInput.focus();
        break;
      case 'newFolder':
        const addButton = document.querySelector('.add-root-folder-btn');
        if (addButton) addButton.click();
        break;
      case 'import':
        const importButton = document.querySelector('.import-btn');
        if (importButton) importButton.click();
        break;
      case 'escape':
        const modals = document.querySelectorAll('.modal-overlay');
        modals.forEach(modal => {
          if (modal.style.display !== 'none') {
            modal.style.display = 'none';
          }
        });
        break;
      default:
        break;
    }
  };

  const handleThemeChange = (theme) => {
    applyThemeToInterface(theme);
    
    // Notification toast
    if (window.showToast) {
      window.showToast('info', 'Thème changé', `Application du thème "${theme.name}"`);
    }
  };

  const applyThemeToInterface = (theme) => {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', theme.primary);
    root.style.setProperty('--secondary-color', theme.secondary);
    root.style.setProperty('--accent-color', theme.accent);
    root.style.setProperty('--background-gradient', theme.background);
    root.style.setProperty('--surface-color', theme.surface);
    root.style.setProperty('--text-color', theme.text);
    document.body.style.background = theme.background;
    document.body.style.color = theme.text;
  };

  const handleBackupRestore = (restoredFolders, restoredDocuments) => {
    setFolders(restoredFolders);
    setDocuments(restoredDocuments);
    setSelectedFolder(null);
    setSearchTerm('');
    setCurrentFilter('all');
    
    // Notification toast
    if (window.showToast) {
      window.showToast('success', 'Sauvegarde restaurée', 'Données restaurées avec succès');
    }
  };

  const handleDocumentSelect = (document) => {
    // Notification toast
    if (window.showToast) {
      window.showToast('info', 'Document sélectionné', `Ouverture de "${document.name}"`);
    }
  };

  const handleGlobalSearchSelect = (result) => {
    if (result.type === 'document') {
      // Trouver le document et ouvrir son dossier
      const doc = documents.find(d => d.id === result.id);
      if (doc) {
        setSelectedFolder(doc.path);
        setShowDashboard(false);
        setShowDynamicCards(false);
      }
    } else if (result.type === 'folder') {
      // Ouvrir le dossier
      setSelectedFolder(result.path);
      setShowDashboard(false);
      setShowDynamicCards(false);
    }
  };

  // Calculer les statistiques
  const totalDocuments = documents.length;
  const totalFolders = Object.keys(folders).length;
  const totalSize = documents.reduce((sum, doc) => sum + doc.size, 0);
  const recentDocuments = documents
    .sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified))
    .slice(0, 5);

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="header-brand">
            <div className="brand-logo">📚</div>
            <div className="brand-text">
              <div className="brand-title">Classeur Numérique</div>
              <div className="brand-subtitle">Système d'organisation intelligent</div>
            </div>
          </div>
          
          <div className="header-actions">
            <button 
              className={`action-button ${showDashboard ? 'active' : ''}`}
              onClick={() => {
                setShowDashboard(!showDashboard);
                setShowDynamicCards(false);
              }}
            >
              📊 {showDashboard ? 'Dossiers' : 'Dashboard'}
            </button>
            <button 
              className={`action-button ${showDynamicCards ? 'active' : ''}`}
              onClick={() => {
                setShowDynamicCards(!showDynamicCards);
                setShowDashboard(false);
              }}
            >
              🎴 {showDynamicCards ? 'Vue classique' : 'Cartes dynamiques'}
            </button>
            <button 
              className={`action-button ${useAdvancedSearch ? 'active' : ''}`}
              onClick={() => setUseAdvancedSearch(!useAdvancedSearch)}
            >
              🔍 {useAdvancedSearch ? 'Recherche simple' : 'Recherche avancée'}
            </button>
            <button 
              className="action-button global-search-btn"
              onClick={() => {
                // Déclencher la recherche globale via un événement personnalisé
                document.dispatchEvent(new CustomEvent('openGlobalSearch'));
              }}
              title="Recherche globale (Ctrl+K)"
            >
              🌐 Recherche globale
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        <aside className="sidebar">
          <div className="sidebar-section">
            <div className="sidebar-title">📁 Navigation</div>
            <FolderTree 
              folders={folders}
              onFolderSelect={handleFolderSelect}
              selectedFolder={selectedFolder}
              onFoldersChange={handleFoldersChange}
            />
          </div>
          
          {selectedFolder && !showDashboard && (
            <div className="sidebar-section">
              <div className="sidebar-title">📊 Statistiques</div>
              <StatsPanel 
                documents={getDocumentsInFolder(selectedFolder)}
                selectedFolder={selectedFolder}
              />
            </div>
          )}
        </aside>

        <section className="content">
          {showDashboard ? (
            <>
              <div className="content-header">
                <div className="content-title">Dashboard</div>
                <div className="content-subtitle">Vue d'ensemble de votre classeur numérique</div>
              </div>
              <div className="content-body">
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-value">{totalDocuments}</div>
                    <div className="stat-label">Documents</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">{totalFolders}</div>
                    <div className="stat-label">Dossiers</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">{(totalSize / (1024 * 1024)).toFixed(1)}</div>
                    <div className="stat-label">MB Total</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">{recentDocuments.length}</div>
                    <div className="stat-label">Récents</div>
                  </div>
                </div>
                <Dashboard folders={folders} documents={documents} />
              </div>
            </>
          ) : showDynamicCards ? (
            <>
              <div className="content-header">
                <div className="content-title">Cartes Dynamiques</div>
                <div className="content-subtitle">Vue interactive inspirée de Solo Leveling</div>
              </div>
              <div className="content-body">
                <DynamicCards 
                  folders={folders}
                  documents={documents}
                  onFolderSelect={handleFolderSelect}
                  onDocumentSelect={handleDocumentSelect}
                />
              </div>
            </>
          ) : selectedFolder ? (
            <>
              <div className="content-header">
                <div className="content-title">{selectedFolder}</div>
                <div className="content-subtitle">
                  {filteredDocuments.length} document{filteredDocuments.length !== 1 ? 's' : ''} dans ce dossier
                </div>
              </div>
              <div className="content-body">
                <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                  <DocumentImport 
                    onAddDocuments={handleAddDocuments}
                    onImportFolder={handleImportFolder}
                    folderPath={selectedFolder}
                  />
                </div>
                
                {useAdvancedSearch ? (
                  <AdvancedSearch 
                    documents={documents}
                    onSearch={handleAdvancedSearch}
                    onClear={() => setFilteredDocuments(getDocumentsInFolder(selectedFolder))}
                  />
                ) : (
                  <SearchBar 
                    onSearch={handleSearch}
                    onClear={handleSearchClear}
                    documents={documents}
                    folders={folders}
                  />
                )}
                
                {!useAdvancedSearch && (
                  <FilterBar 
                    onFilterChange={handleFilterChange}
                    onSortChange={handleSortChange}
                    documentCount={filteredDocuments.length}
                  />
                )}
                
                <DocumentGallery 
                  documents={filteredDocuments}
                  onDelete={(docId) => {
                    setDocuments(prev => prev.filter(doc => doc.id !== docId));
                    
                    // Notification toast
                    if (window.showToast) {
                      window.showToast('warning', 'Document supprimé', 'Document supprimé avec succès');
                    }
                  }}
                />
              </div>
            </>
          ) : (
            <>
              <div className="content-header">
                <div className="content-title">Bienvenue</div>
                <div className="content-subtitle">Commencez par sélectionner un dossier ou consulter le dashboard</div>
              </div>
              <div className="content-body">
                <div className="welcome">
                  <div className="welcome-icon">🚀</div>
                  <h2>Prêt à organiser vos documents ?</h2>
                  <p>
                    Votre classeur numérique intelligent vous permet d'organiser, rechercher et gérer 
                    tous vos documents académiques en un seul endroit. Commencez par créer des dossiers 
                    ou importez vos documents existants.
                  </p>
                </div>
                
                <FeatureTester />
                
                <div className="features">
                  <div className="feature">
                    <div className="feature-icon">📂</div>
                    <h3>Import de dossiers</h3>
                    <p>Importez des dossiers entiers en conservant votre organisation existante</p>
                  </div>
                  <div className="feature">
                    <div className="feature-icon">🎓</div>
                    <h3>Organisation par année</h3>
                    <p>Structurez vos cours par année : Prépa, Première, Terminale, ESIEA, SIA</p>
                  </div>
                  <div className="feature">
                    <div className="feature-icon">📊</div>
                    <h3>Spécialisation Data</h3>
                    <p>Dossiers dédiés à vos cours de data science et machine learning</p>
                  </div>
                  <div className="feature">
                    <div className="feature-icon">🔍</div>
                    <h3>Recherche intelligente</h3>
                    <p>Trouvez rapidement vos documents avec la recherche avancée et les filtres</p>
                  </div>
                  <div className="feature">
                    <div className="feature-icon">📁</div>
                    <h3>Gestion des dossiers</h3>
                    <p>Créez, renommez et supprimez des dossiers directement dans l'arborescence</p>
                  </div>
                  <div className="feature">
                    <div className="feature-icon">⌨️</div>
                    <h3>Raccourcis clavier</h3>
                    <p>Utilisez Ctrl+K pour rechercher, Ctrl+N pour créer un dossier</p>
                  </div>
                  <div className="feature">
                    <div className="feature-icon">🎨</div>
                    <h3>Thèmes personnalisables</h3>
                    <p>Personnalisez l'apparence avec différents thèmes et couleurs</p>
                  </div>
                  <div className="feature">
                    <div className="feature-icon">💾</div>
                    <h3>Sauvegarde automatique</h3>
                    <p>Sauvegardez et restaurez vos données en toute sécurité</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </section>
      </main>

      {/* Composants flottants */}
      <KeyboardShortcuts onShortcut={handleShortcut} />
      <ThemeManager onThemeChange={handleThemeChange} />
      <BackupManager 
        folders={folders}
        documents={documents}
        onRestore={handleBackupRestore}
      />
      <ToastNotifications />
      <ParticleEffects />
      <GlobalSearch 
        documents={documents}
        folders={folders}
        onItemSelect={handleGlobalSearchSelect}
      />
    </div>
  );
}

export default App;
