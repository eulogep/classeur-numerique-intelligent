import React, { useState, useCallback } from 'react';
import { useFolders } from '../contexts/FolderContext';
import './FolderTree.css';

/**
 * Composant FolderTree refactorisé
 * Utilise la nouvelle architecture avec IDs et profondeur illimitée
 */

const FolderTreeV2 = ({ selectedFolderId, onFolderSelect }) => {
  const {
    folders,
    documents,
    addFolder,
    renameFolder,
    deleteFolder,
    moveFolder,
    getFoldersByParent,
    getDocumentsByFolder,
    getFolderPath
  } = useFolders();

  const [hoveredFolderId, setHoveredFolderId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingFolderId, setEditingFolderId] = useState(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [parentFolderId, setParentFolderId] = useState(null);
  const [error, setError] = useState('');

  // Valider le nom du dossier
  const validateFolderName = (name) => {
    if (!name.trim()) {
      setError('Le nom du dossier ne peut pas être vide');
      return false;
    }
    if (name.trim().length < 2) {
      setError('Le nom doit contenir au least 2 caractères');
      return false;
    }
    // Vérifier les doublons au même niveau
    const siblingsWithSameName = getFoldersByParent(parentFolderId).filter(
      f => f.name.toLowerCase() === name.trim().toLowerCase() && f.id !== editingFolderId
    );
    if (siblingsWithSameName.length > 0) {
      setError('Un dossier avec ce nom existe déjà à ce niveau');
      return false;
    }
    return true;
  };

  const handleAddFolder = () => {
    if (!validateFolderName(newFolderName)) return;

    addFolder(newFolderName.trim(), parentFolderId);
    setNewFolderName('');
    setParentFolderId(null);
    setShowAddModal(false);
    setError('');
  };

  const handleEditFolder = () => {
    if (!validateFolderName(newFolderName)) return;

    renameFolder(editingFolderId, newFolderName.trim());
    setNewFolderName('');
    setEditingFolderId(null);
    setShowEditModal(false);
    setError('');
  };

  const handleDeleteFolder = (folderId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce dossier et tout son contenu ?')) {
      deleteFolder(folderId);
      if (selectedFolderId === folderId) {
        onFolderSelect(null);
      }
    }
  };

  const openAddModal = (parentId = null) => {
    setParentFolderId(parentId);
    setShowAddModal(true);
    setError('');
  };

  const openEditModal = (folderId) => {
    const folder = folders.find(f => f.id === folderId);
    if (folder) {
      setEditingFolderId(folderId);
      setNewFolderName(folder.name);
      setShowEditModal(true);
      setError('');
    }
  };

  const renderFolder = (folderId, depth = 0) => {
    const folder = folders.find(f => f.id === folderId);
    if (!depth) return null;

    const isSelected = selectedFolderId === folderId;
    const isHovered = hoveredFolderId === folderId;
    const documentCount = getDocumentsByFolder(folderId).length;
    const childFolders = getFoldersByParent(folderId);

    return (
      <div key={folderId} className="folder-item">
        <div
          className={`folder-header ${isSelected ? 'selected' : ''}`}
          style={{ paddingLeft: `${depth * 16}px` }}
          onClick={() => onFolderSelect(folderId)}
          onMouseEnter={() => setHoveredFolderId(folderId)}
          onMouseLeave={() => setHoveredFolderId(null)}
        >
          <span className="folder-icon">{folder.icon || '📁'}</span>
          <div className="folder-info">
            <span className="folder-name">{folder.name}</span>
            <div className="folder-stats">
              <span className="document-count">
                {documentCount} document{documentCount !== 1 ? 's' : ''}
              </span>
              {childFolders.length > 0 && (
                <span className="subfolder-count">
                  {childFolders.length} sous-dossier{childFolders.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
          <span className="folder-doc-count">{documentCount}</span>

          {isHovered && (
            <div className="folder-actions">
              <button
                className="folder-action-btn add-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  openAddModal(folderId);
                }}
                title="Ajouter un sous-dossier"
              >
                ➕
              </button>
              <button
                className="folder-action-btn edit-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  openEditModal(folderId);
                }}
                title="Renommer"
              >
                ✏️
              </button>
              <button
                className="folder-action-btn delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteFolder(folderId);
                }}
                title="Supprimer"
              >
                🗑️
              </button>
            </div>
          )}
        </div>

        {childFolders.length > 0 && (
          <div className="subfolders">
            {childFolders.map(child => renderFolder(child.id, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const rootFolders = getFoldersByParent(null);
  const totalDocuments = documents.length;

  return (
    <div className="folder-tree">
      <div className="tree-header">
        <div className="header-content">
          <h3>📚 Mes Dossiers</h3>
          <div className="header-stats">
            <span className="total-folders">{folders.length} dossier{folders.length !== 1 ? 's' : ''}</span>
            <span className="total-documents">{totalDocuments} document{totalDocuments !== 1 ? 's' : ''}</span>
          </div>
        </div>
        <button
          className="add-root-folder-btn"
          onClick={() => openAddModal(null)}
          title="Ajouter un dossier principal"
        >
          ➕
        </button>
      </div>

      <div className="tree-content">
        {rootFolders.length === 0 ? (
          <div className="empty-state">
            <p>Aucun dossier. Créez-en un pour commencer ! 📁</p>
          </div>
        ) : (
          rootFolders.map(folder => renderFolder(folder.id, 1))
        )}
      </div>

      {/* Modal d'ajout */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
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
                  autoFocus
                  onKeyPress={(e) => e.key === 'Enter' && handleAddFolder()}
                />
              </div>

              {error && <div className="error-message">{error}</div>}

              <div className="modal-actions">
                <button
                  className="cancel-btn"
                  onClick={() => {
                    setShowAddModal(false);
                    setNewFolderName('');
                    setParentFolderId(null);
                    setError('');
                  }}
                >
                  Annuler
                </button>
                <button className="confirm-btn" onClick={handleAddFolder}>
                  Créer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'édition */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
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
                  autoFocus
                  onKeyPress={(e) => e.key === 'Enter' && handleEditFolder()}
                />
              </div>

              {error && <div className="error-message">{error}</div>}

              <div className="modal-actions">
                <button
                  className="cancel-btn"
                  onClick={() => {
                    setShowEditModal(false);
                    setNewFolderName('');
                    setEditingFolderId(null);
                    setError('');
                  }}
                >
                  Annuler
                </button>
                <button className="confirm-btn" onClick={handleEditFolder}>
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

export default FolderTreeV2;
