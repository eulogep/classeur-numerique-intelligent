import React, { useState } from 'react';
import './FolderTree.css';

const FolderTree = ({ folders, onFolderSelect, selectedFolder, onFoldersChange }) => {
  const [hoveredFolder, setHoveredFolder] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingFolder, setEditingFolder] = useState(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [parentFolder, setParentFolder] = useState('');
  const [error, setError] = useState('');

  // Fonction pour compter les documents dans un dossier
  const getDocumentCount = (folderPath) => {
    const documents = JSON.parse(localStorage.getItem('classeurDocuments') || '[]');
    return documents.filter(doc => doc.path === folderPath).length;
  };

  // Fonction pour obtenir la taille totale des documents dans un dossier
  const getFolderSize = (folderPath) => {
    const documents = JSON.parse(localStorage.getItem('classeurDocuments') || '[]');
    const folderDocs = documents.filter(doc => doc.path === folderPath);
    const totalSize = folderDocs.reduce((sum, doc) => sum + (doc.size || 0), 0);
    return formatFileSize(totalSize);
  };

  // Fonction pour formater la taille des fichiers
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Fonction pour compter le total des documents
  const getTotalDocumentCount = () => {
    const documents = JSON.parse(localStorage.getItem('classeurDocuments') || '[]');
    return documents.length;
  };

  const handleAddFolder = () => {
    if (!newFolderName.trim()) {
      setError('Le nom du dossier ne peut pas être vide');
      return;
    }

    if (newFolderName.trim().length < 2) {
      setError('Le nom du dossier doit contenir au moins 2 caractères');
      return;
    }

    const updatedFolders = { ...folders };

    if (parentFolder) {
      // Ajouter un sous-dossier
      const pathParts = parentFolder.split(' > ');
      if (pathParts.length === 1) {
        // Sous-dossier d'un dossier principal
        if (updatedFolders[parentFolder]) {
          updatedFolders[parentFolder][newFolderName.trim()] = [];
        }
      } else if (pathParts.length === 2) {
        // Sous-dossier d'un sous-dossier
        const parent = updatedFolders[pathParts[0]];
        if (parent && parent[pathParts[1]]) {
          parent[pathParts[1]][newFolderName.trim()] = [];
        }
      }
    } else {
      // Ajouter un dossier principal
      updatedFolders[newFolderName.trim()] = {};
    }

    onFoldersChange(updatedFolders);
    setNewFolderName('');
    setParentFolder('');
    setShowAddModal(false);
    setError('');
  };

  const handleEditFolder = () => {
    if (!newFolderName.trim()) {
      setError('Le nom du dossier ne peut pas être vide');
      return;
    }

    if (newFolderName.trim().length < 2) {
      setError('Le nom du dossier doit contenir au moins 2 caractères');
      return;
    }

    const updatedFolders = { ...folders };
    const oldPath = editingFolder.path;
    const newPath = oldPath.replace(editingFolder.name, newFolderName.trim());

    // Mettre à jour le chemin de tous les documents dans ce dossier
    const updatedDocuments = JSON.parse(localStorage.getItem('classeurDocuments') || '[]');
    updatedDocuments.forEach(doc => {
      if (doc.path === oldPath) {
        doc.path = newPath;
      }
    });
    localStorage.setItem('classeurDocuments', JSON.stringify(updatedDocuments));

    // Mettre à jour la structure des dossiers
    const pathParts = oldPath.split(' > ');
    if (pathParts.length === 1) {
      // Renommer un dossier principal
      updatedFolders[newFolderName.trim()] = updatedFolders[editingFolder.name];
      delete updatedFolders[editingFolder.name];
    } else if (pathParts.length === 2) {
      // Renommer un sous-dossier
      const parent = updatedFolders[pathParts[0]];
      if (parent) {
        parent[newFolderName.trim()] = parent[editingFolder.name];
        delete parent[editingFolder.name];
      }
    } else if (pathParts.length === 3) {
      // Renommer un sous-sous-dossier
      const parent = updatedFolders[pathParts[0]];
      if (parent && parent[pathParts[1]]) {
        parent[pathParts[1]][newFolderName.trim()] = parent[pathParts[1]][editingFolder.name];
        delete parent[pathParts[1]][editingFolder.name];
      }
    }

    onFoldersChange(updatedFolders);
    setNewFolderName('');
    setEditingFolder(null);
    setShowEditModal(false);
    setError('');
  };

  const handleDeleteFolder = (folderPath) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le dossier "${folderPath}" et tous ses documents ?`)) {
      const updatedFolders = { ...folders };
      const updatedDocuments = JSON.parse(localStorage.getItem('classeurDocuments') || '[]');
      
      // Supprimer tous les documents du dossier
      const filteredDocuments = updatedDocuments.filter(doc => !doc.path.startsWith(folderPath));
      localStorage.setItem('classeurDocuments', JSON.stringify(filteredDocuments));

      // Supprimer le dossier de la structure
      const pathParts = folderPath.split(' > ');
      if (pathParts.length === 1) {
        // Dossier principal
        delete updatedFolders[pathParts[0]];
      } else if (pathParts.length === 2) {
        // Sous-dossier
        const parent = updatedFolders[pathParts[0]];
        if (parent) {
          delete parent[pathParts[1]];
        }
      } else if (pathParts.length === 3) {
        // Sous-sous-dossier
        const parent = updatedFolders[pathParts[0]];
        if (parent && parent[pathParts[1]]) {
          delete parent[pathParts[1]][pathParts[2]];
        }
      }

      onFoldersChange(updatedFolders);
    }
  };

  const openAddModal = (parentPath = '') => {
    setParentFolder(parentPath);
    setShowAddModal(true);
    setError('');
  };

  const openEditModal = (folderPath) => {
    const pathParts = folderPath.split(' > ');
    const folderName = pathParts[pathParts.length - 1];
    
    setEditingFolder({
      name: folderName,
      path: folderPath
    });
    setNewFolderName(folderName);
    setShowEditModal(true);
    setError('');
  };

  const getFolderOptions = () => {
    const options = [{ value: '', label: 'Dossier principal' }];
    
    // Ajouter les dossiers principaux
    Object.keys(folders).forEach(folder => {
      options.push({ value: folder, label: folder });
    });

    // Ajouter les sous-dossiers
    Object.entries(folders).forEach(([parentName, subFolders]) => {
      Object.keys(subFolders).forEach(subFolder => {
        const fullPath = `${parentName} > ${subFolder}`;
        options.push({ value: fullPath, label: fullPath });
      });
    });

    return options;
  };

  const renderFolder = (folderName, subFolders, parentPath = '') => {
    const currentPath = parentPath ? `${parentPath} > ${folderName}` : folderName;
    const isSelected = selectedFolder === currentPath;
    const isHovered = hoveredFolder === currentPath;
    const documentCount = getDocumentCount(currentPath);
    const folderSize = getFolderSize(currentPath);
    const subFolderCount = Object.keys(subFolders).length;
    
    return (
      <div key={folderName} className="folder-item">
        <div 
          className={`folder-header ${isSelected ? 'selected' : ''}`}
          onClick={() => onFolderSelect(currentPath)}
          onMouseEnter={() => setHoveredFolder(currentPath)}
          onMouseLeave={() => setHoveredFolder(null)}
        >
          <span className="folder-icon">📁</span>
          <div className="folder-info">
            <span className="folder-name">{folderName}</span>
            <div className="folder-stats">
              <span className="document-count">{documentCount} document{documentCount !== 1 ? 's' : ''}</span>
              {documentCount > 0 && <span className="folder-size">{folderSize}</span>}
              {subFolderCount > 0 && <span className="subfolder-count">{subFolderCount} sous-dossier{subFolderCount !== 1 ? 's' : ''}</span>}
            </div>
          </div>
          
          {isHovered && (
            <div className="folder-actions">
              <button 
                className="folder-action-btn add-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  openAddModal(currentPath);
                }}
                title="Ajouter un sous-dossier"
              >
                ➕
              </button>
              <button 
                className="folder-action-btn edit-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  openEditModal(currentPath);
                }}
                title="Renommer"
              >
                ✏️
              </button>
              <button 
                className="folder-action-btn delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteFolder(currentPath);
                }}
                title="Supprimer"
              >
                🗑️
              </button>
            </div>
          )}
        </div>
        
        {Object.keys(subFolders).length > 0 && (
          <div className="subfolders">
            {Object.entries(subFolders).map(([subFolderName, subSubFolders]) => 
              renderFolder(subFolderName, subSubFolders, currentPath)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="folder-tree">
      <div className="tree-header">
        <div className="header-content">
          <h3>📚 Mes Dossiers</h3>
          <div className="header-stats">
            <span className="total-folders">{Object.keys(folders).length} dossier{Object.keys(folders).length !== 1 ? 's' : ''}</span>
            <span className="total-documents">{getTotalDocumentCount()} document{getTotalDocumentCount() !== 1 ? 's' : ''}</span>
          </div>
        </div>
        <button 
          className="add-root-folder-btn"
          onClick={() => openAddModal()}
          title="Ajouter un dossier principal"
        >
          ➕
        </button>
      </div>
      
      <div className="tree-content">
        {Object.entries(folders).map(([folderName, subFolders]) => 
          renderFolder(folderName, subFolders)
        )}
      </div>
      
      {Object.keys(folders).length === 0 && (
        <div className="empty-folders">
          <p>🎯 Commencez votre organisation</p>
          <p>Créez votre premier dossier pour organiser vos documents</p>
          <button 
            className="create-first-folder-btn"
            onClick={() => openAddModal()}
          >
            ➕ Créer mon premier dossier
          </button>
        </div>
      )}

      {/* Modal d'ajout */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>➕ Nouveau dossier</h3>
            <div className="modal-content">
              <div className="form-group">
                <label>Nom du dossier :</label>
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Nom du dossier"
                  className="folder-input"
                />
              </div>
              
              <div className="form-group">
                <label>Dossier parent :</label>
                <select
                  value={parentFolder}
                  onChange={(e) => setParentFolder(e.target.value)}
                  className="folder-select"
                >
                  {getFolderOptions().map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {error && <div className="error-message">{error}</div>}

              <div className="modal-actions">
                <button 
                  className="cancel-btn"
                  onClick={() => {
                    setShowAddModal(false);
                    setNewFolderName('');
                    setParentFolder('');
                    setError('');
                  }}
                >
                  Annuler
                </button>
                <button 
                  className="confirm-btn"
                  onClick={handleAddFolder}
                >
                  Créer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'édition */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>✏️ Renommer le dossier</h3>
            <div className="modal-content">
              <div className="form-group">
                <label>Nouveau nom :</label>
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Nouveau nom du dossier"
                  className="folder-input"
                />
              </div>

              {error && <div className="error-message">{error}</div>}

              <div className="modal-actions">
                <button 
                  className="cancel-btn"
                  onClick={() => {
                    setShowEditModal(false);
                    setNewFolderName('');
                    setEditingFolder(null);
                    setError('');
                  }}
                >
                  Annuler
                </button>
                <button 
                  className="confirm-btn"
                  onClick={handleEditFolder}
                >
                  Renommer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FolderTree;
