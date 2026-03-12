import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

import FolderTree from './components/FolderTree';
import DocumentGallery from './components/DocumentGallery';
import DocumentImport from './components/DocumentImport';
import SearchBar from './components/SearchBar';
import FilterBar from './components/FilterBar';
import Dashboard from './components/Dashboard';
import KeyboardShortcuts from './components/KeyboardShortcuts';
import AdvancedSearch from './components/AdvancedSearch';
import ThemeManager from './components/ThemeManager';
import BackupManager from './components/BackupManager';
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

  useEffect(() => {
    const savedFolders = localStorage.getItem('classeurFolders');
    const savedDocuments = localStorage.getItem('classeurDocuments');
    if (savedFolders) setFolders(JSON.parse(savedFolders));
    if (savedDocuments) setDocuments(JSON.parse(savedDocuments));
  }, []);

  useEffect(() => {
    localStorage.setItem('classeurFolders', JSON.stringify(folders));
  }, [folders]);

  useEffect(() => {
    const docsToSave = documents.map(doc => ({
      ...doc,
      content: doc.type && (doc.type.includes('image') || doc.type.includes('text') || doc.type.includes('pdf'))
        ? doc.content : null,
    }));
    try {
      localStorage.setItem('classeurDocuments', JSON.stringify(docsToSave));
    } catch (e) {
      const slim = documents.map(d => ({ ...d, content: null }));
      localStorage.setItem('classeurDocuments', JSON.stringify(slim));
      if (window.showToast) window.showToast('warning', 'Stockage', 'Quota dépassé, aperçus non conservés.');
    }
  }, [documents]);

  const getFileType = useCallback((mimeType) => {
    if (!mimeType) return 'Autre';
    if (mimeType.includes('pdf')) return 'PDF';
    if (mimeType.includes('word') || mimeType.includes('document')) return 'Document';
    if (mimeType.includes('image')) return 'Image';
    if (mimeType.includes('video')) return 'Vidéo';
    if (mimeType.includes('audio')) return 'Audio';
    if (mimeType.includes('zip') || mimeType.includes('rar')) return 'Archive';
    if (mimeType.includes('text')) return 'Texte';
    return 'Autre';
  }, []);

  const getDocumentsInFolder = useCallback((folderPath) => {
    return documents.filter(doc => doc.path === folderPath);
  }, [documents]);

  useEffect(() => {
    let filtered = getDocumentsInFolder(selectedFolder);
    if (searchTerm) {
      filtered = filtered.filter(doc => doc.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (currentFilter !== 'all') {
      filtered = filtered.filter(doc => getFileType(doc.type).toLowerCase() === currentFilter);
    }
    filtered = [...filtered].sort((a, b) => {
      if (currentSort === 'name') return a.name.localeCompare(b.name);
      if (currentSort === 'date') return new Date(b.lastModified) - new Date(a.lastModified);
      if (currentSort === 'size') return b.size - a.size;
      return 0;
    });
    setFilteredDocuments(filtered);
  }, [selectedFolder, documents, searchTerm, currentFilter, currentSort, getDocumentsInFolder, getFileType]);

  const toast = (type, title, message) => {
    if (window.showToast) window.showToast(type, title, message);
  };

  const handleFolderSelect = (folderPath) => {
    setSelectedFolder(folderPath);
    setSearchTerm('');
    setCurrentFilter('all');
    setShowDashboard(false);
    setShowDynamicCards(false);
  };

  const handleAddDocuments = (newDocuments) => {
    setDocuments(prev => [...prev, ...newDocuments]);
    toast('success', 'Import réussi', `${newDocuments.length} document(s) importé(s)`);
  };

  const handleSearch = (term) => setSearchTerm(term);
  const handleSearchClear = () => setSearchTerm('');

  const handleAdvancedSearch = (searchResults) => {
    setFilteredDocuments(searchResults);
    toast('info', 'Recherche', `${searchResults.length} résultat(s)`);
  };

  const handleFilterChange = (filter) => setCurrentFilter(filter);
  const handleSortChange = (sort) => setCurrentSort(sort);

  const folderExists = (foldersObj, path) => {
    const parts = path.split(' > ');
    if (parts.length === 1) return foldersObj.hasOwnProperty(parts[0]);
    if (parts.length === 2) return foldersObj[parts[0]] && foldersObj[parts[0]].hasOwnProperty(parts[1]);
    if (parts.length === 3) return foldersObj[parts[0]] && foldersObj[parts[0]][parts[1]] && foldersObj[parts[0]][parts[1]].hasOwnProperty(parts[2]);
    return false;
  };

  const handleFoldersChange = (newFolders) => {
    setFolders(newFolders);
    if (selectedFolder && !folderExists(newFolders, selectedFolder)) setSelectedFolder(null);
    toast('success', 'Structure mise à jour', 'Organisation des dossiers modifiée');
  };

  const handleShortcut = (shortcut) => {
    switch (shortcut) {
      case 'search': document.querySelector('.search-input')?.focus(); break;
      case 'newFolder': document.querySelector('.add-root-folder-btn')?.click(); break;
      case 'import': document.querySelector('.files-btn')?.click(); break;
      case 'escape': document.querySelectorAll('.modal-overlay').forEach(m => { m.style.display = 'none'; }); break;
      default: break;
    }
  };

  const handleThemeChange = (theme) => {
    toast('info', 'Thème', `Thème "${theme.name}" appliqué`);
  };

  const handleBackupRestore = (restoredFolders, restoredDocuments) => {
    setFolders(restoredFolders);
    setDocuments(restoredDocuments);
    setSelectedFolder(null);
    toast('success', 'Restauré', 'Données restaurées avec succès');
  };

  const handleGlobalSearchSelect = (result) => {
    if (result.type === 'document') {
      const doc = documents.find(d => d.id === result.id);
      if (doc) { setSelectedFolder(doc.path); setShowDashboard(false); setShowDynamicCards(false); }
    } else if (result.type === 'folder') {
      setSelectedFolder(result.path); setShowDashboard(false); setShowDynamicCards(false);
    }
  };

  const totalDocuments = documents.length;
  const totalFolders = Object.keys(folders).length;
  const totalSize = documents.reduce((sum, doc) => sum + doc.size, 0);
  const recentDocuments = [...documents].sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified)).slice(0, 5);

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="header-brand">
            <div className="brand-logo">📚</div>
            <div className="brand-text">
              <div className="brand-title">Classeur Numérique</div>
              <div className="brand-subtitle">Organisation intelligente</div>
            </div>
          </div>

          <div className="header-actions">
            <button className={`action-button ${showDashboard ? 'active' : ''}`}
              onClick={() => { setShowDashboard(!showDashboard); setShowDynamicCards(false); }}>
              📊 Dashboard
            </button>
            <button className={`action-button ${showDynamicCards ? 'active' : ''}`}
              onClick={() => { setShowDynamicCards(!showDynamicCards); setShowDashboard(false); }}>
              🎴 Cartes
            </button>
            <button className={`action-button ${useAdvancedSearch ? 'active' : ''}`}
              onClick={() => setUseAdvancedSearch(!useAdvancedSearch)}>
              🔍 Recherche avancée
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="header-search"
              onClick={() => document.dispatchEvent(new CustomEvent('openGlobalSearch'))}
              title="Recherche globale (Ctrl+K)">
              🔍 Rechercher…
              <span className="header-search-kbd">⌘K</span>
            </div>
            <div style={{
              width: 30, height: 30, borderRadius: 8,
              background: 'linear-gradient(135deg, #7C5CFC, #FC5C9B)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 700, color: 'white', flexShrink: 0,
              cursor: 'pointer', userSelect: 'none'
            }}>EJ</div>
          </div>
        </div>
      </header>

      <main className="app-main">
        <aside className="sidebar">
          <div className="sidebar-section">
            <div className="sidebar-title">Navigation</div>
            <FolderTree
              folders={folders}
              onFolderSelect={handleFolderSelect}
              selectedFolder={selectedFolder}
              onFoldersChange={handleFoldersChange}
              documents={documents}
            />
          </div>
        </aside>

        <section className="content">
          {showDashboard ? (
            <>
              <div className="content-header">
                <div className="content-title">Dashboard</div>
                <div className="content-subtitle">Vue d'ensemble de votre classeur</div>
              </div>
              <div className="content-body">
                <div className="stats-grid">
                  <div className="stat-card"><div className="stat-value">{totalDocuments}</div><div className="stat-label">Documents</div></div>
                  <div className="stat-card"><div className="stat-value">{totalFolders}</div><div className="stat-label">Dossiers</div></div>
                  <div className="stat-card"><div className="stat-value">{(totalSize / (1024 * 1024)).toFixed(1)}</div><div className="stat-label">MB Total</div></div>
                  <div className="stat-card"><div className="stat-value">{recentDocuments.length}</div><div className="stat-label">Récents</div></div>
                </div>
                <Dashboard folders={folders} documents={documents} />
              </div>
            </>
          ) : showDynamicCards ? (
            <>
              <div className="content-header">
                <div className="content-title">Cartes Dynamiques</div>
                <div className="content-subtitle">Vue interactive de votre organisation</div>
              </div>
              <div className="content-body">
                <DynamicCards folders={folders} documents={documents}
                  onFolderSelect={handleFolderSelect}
                  onDocumentSelect={(doc) => toast('info', 'Document', doc.name)} />
              </div>
            </>
          ) : selectedFolder ? (
            <>
              <div className="content-header">
                <div className="content-title">{selectedFolder}</div>
                <div className="content-subtitle">
                  {filteredDocuments.length} document{filteredDocuments.length !== 1 ? 's' : ''}
                </div>
              </div>
              <div className="content-body">
                <DocumentImport onAddDocuments={handleAddDocuments} folderPath={selectedFolder} />
                {useAdvancedSearch ? (
                  <AdvancedSearch documents={documents} onSearch={handleAdvancedSearch}
                    onClear={() => setFilteredDocuments(getDocumentsInFolder(selectedFolder))} />
                ) : (
                  <SearchBar onSearch={handleSearch} onClear={handleSearchClear} documents={documents} folders={folders} />
                )}
                {!useAdvancedSearch && (
                  <FilterBar onFilterChange={handleFilterChange} onSortChange={handleSortChange} documentCount={filteredDocuments.length} />
                )}
                <DocumentGallery
                  documents={filteredDocuments}
                  onDelete={(docId) => {
                    setDocuments(prev => prev.filter(doc => doc.id !== docId));
                    toast('warning', 'Supprimé', 'Document supprimé');
                  }}
                />
              </div>
            </>
          ) : (
            <>
              <div className="content-header">
                <div className="content-title">Bienvenue 👋</div>
                <div className="content-subtitle">Sélectionnez un dossier pour commencer</div>
              </div>
              <div className="content-body">
                <div className="welcome">
                  <div className="welcome-hero">
                    <div className="welcome-icon">📚</div>
                    <div>
                      <h2>Classeur Numérique Intelligent</h2>
                      <p>Organisez, recherchez et gérez tous vos documents académiques depuis un seul endroit. Import par glisser-déposer, prévisualisation et recherche avancée.</p>
                      <button className="welcome-cta" onClick={() => document.querySelector('.add-root-folder-btn')?.click()}>
                        ＋ Créer mon premier dossier
                      </button>
                    </div>
                  </div>
                  <div className="features">
                    {[
                      { icon: '📂', title: 'Import de fichiers', desc: 'Glissez-déposez ou importez des dossiers entiers' },
                      { icon: '👁️', title: 'Prévisualisation', desc: "Images, PDF et texte directement dans l'app" },
                      { icon: '🔍', title: 'Recherche avancée', desc: 'Filtres par type, taille, date' },
                      { icon: '📊', title: 'Dashboard', desc: 'Statistiques de ta collection documentaire' },
                      { icon: '🎨', title: 'Thèmes', desc: '6 thèmes + personnalisation complète' },
                      { icon: '💾', title: 'Sauvegarde', desc: 'Export/restauration en format JSON' },
                    ].map((f, i) => (
                      <div className="feature" key={i}>
                        <div className="feature-icon">{f.icon}</div>
                        <h3>{f.title}</h3>
                        <p>{f.desc}</p>
                      </div>
                    ))}
                  </div>
                  <div className="shortcuts-hint">
                    <span>💡</span>
                    <span><kbd>⌘K</kbd> Rechercher</span>
                    <span style={{color: 'var(--text-faint)'}}>·</span>
                    <span><kbd>⌘N</kbd> Nouveau dossier</span>
                    <span style={{color: 'var(--text-faint)'}}>·</span>
                    <span><kbd>F1</kbd> Aide</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </section>
      </main>

      <KeyboardShortcuts onShortcut={handleShortcut} />
      <ThemeManager onThemeChange={handleThemeChange} />
      <BackupManager folders={folders} documents={documents} onRestore={handleBackupRestore} />
      <ToastNotifications />
      <ParticleEffects />
      <GlobalSearch documents={documents} folders={folders} onItemSelect={handleGlobalSearchSelect} />
    </div>
  );
}

export default App;
