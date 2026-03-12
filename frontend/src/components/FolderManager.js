import React, { useState } from 'react';
import './FolderManager.css';

const FolderManager = ({ folders, onFoldersChange, selectedFolder }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingFolder, setEditingFolder] = useState(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [parentFolder, setParentFolder] = useState('');
  const [error, setError] = useState('');

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
      if (updatedFolders[parentFolder]) {
        updatedFolders[parentFolder][newFolderName.trim()] = [];
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
    if (editingFolder.parent) {
      // Renommer un sous-dossier
      const parent = updatedFolders[editingFolder.parent];
      if (parent) {
        parent[newFolderName.trim()] = parent[editingFolder.name];
        delete parent[editingFolder.name];
      }
    } else {
      // Renommer un dossier principal
      updatedFolders[newFolderName.trim()] = updatedFolders[editingFolder.name];
      delete updatedFolders[editingFolder.name];
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
      }

      onFoldersChange(updatedFolders);
    }
  };

  const openEditModal = (folderPath) => {
    const pathParts = folderPath.split(' > ');
    const folderName = pathParts[pathParts.length - 1];
    const parent = pathParts.length > 1 ? pathParts[pathParts.length - 2] : null;
    
    setEditingFolder({
      name: folderName,
      parent: parent,
      path: folderPath
    });
    setNewFolderName(folderName);
    setShowEditModal(true);
    setError('');
  };

  const getFolderOptions = () => {
    const options = [{ value: '', label: 'Dossier principal' }];
    Object.keys(folders).forEach(folder => {
      options.push({ value: folder, label: folder });
    });
    return options;
  };

  return (
    <div className="folder-manager">
      <div className="folder-manager-header">
        <h3>📁 Gestion des dossiers</h3>
        <button 
          className="add-folder-btn"
          onClick={() => {
            setShowAddModal(true);
            setError('');
          }}
        >
          ➕ Nouveau dossier
        </button>
      </div>

      {selectedFolder && (
        <div className="selected-folder-actions">
          <h4>Actions pour : {selectedFolder}</h4>
          <div className="folder-actions">
            <button 
              className="edit-folder-btn"
              onClick={() => openEditModal(selectedFolder)}
            >
              ✏️ Renommer
            </button>
            <button 
              className="delete-folder-btn"
              onClick={() => handleDeleteFolder(selectedFolder)}
            >
              🗑️ Supprimer
            </button>
          </div>
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

export default FolderManager; 