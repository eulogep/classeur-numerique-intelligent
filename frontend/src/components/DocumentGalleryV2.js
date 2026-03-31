import React, { useState, useCallback } from 'react';
import { useFolders } from '../contexts/FolderContext';
import './DocumentGallery.css';

/**
 * Composant DocumentGallery refactorisé
 * Utilise la nouvelle architecture avec IDs
 */

const DocumentGalleryV2 = ({ folderId, searchQuery = '', filterType = 'all', sortBy = 'name' }) => {
  const { getDocumentsByFolder, deleteDocument, updateDocument } = useFolders();
  const [previewDoc, setPreviewDoc] = useState(null);

  // Obtenir les documents du dossier
  let documents = getDocumentsByFolder(folderId);

  // Appliquer la recherche
  if (searchQuery) {
    const lowerQuery = searchQuery.toLowerCase();
    documents = documents.filter(doc =>
      doc.name.toLowerCase().includes(lowerQuery)
    );
  }

  // Appliquer le filtre de type
  if (filterType !== 'all') {
    documents = documents.filter(doc => {
      const docType = getFileType(doc.type);
      return docType.toLowerCase() === filterType.toLowerCase();
    });
  }

  // Appliquer le tri
  documents = [...documents].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'date':
        return new Date(b.addedAt) - new Date(a.addedAt);
      case 'size':
        return (b.size || 0) - (a.size || 0);
      default:
        return 0;
    }
  });

  const getFileType = (mimeType) => {
    if (!mimeType) return 'Autre';
    if (mimeType.includes('pdf')) return 'PDF';
    if (mimeType.includes('word') || mimeType.includes('document')) return 'Document';
    if (mimeType.includes('image')) return 'Image';
    if (mimeType.includes('video')) return 'Vidéo';
    if (mimeType.includes('audio')) return 'Audio';
    if (mimeType.includes('zip') || mimeType.includes('rar')) return 'Archive';
    if (mimeType.includes('text')) return 'Texte';
    return 'Autre';
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

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDownload = (doc) => {
    if (doc.content) {
      const element = document.createElement('a');
      element.setAttribute('href', doc.content);
      element.setAttribute('download', doc.name);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  const handleDelete = (docId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
      deleteDocument(docId);
    }
  };

  const handleToggleFavorite = (docId) => {
    const doc = documents.find(d => d.id === docId);
    if (doc) {
      updateDocument(docId, { favorite: !doc.favorite });
    }
  };

  if (!folderId) {
    return (
      <div className="document-gallery empty">
        <div className="empty-message">
          <p>Sélectionnez un dossier pour voir les documents</p>
        </div>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="document-gallery empty">
        <div className="empty-message">
          <p>📭 Aucun document dans ce dossier</p>
        </div>
      </div>
    );
  }

  return (
    <div className="document-gallery">
      <div className="gallery-header">
        <h3>{documents.length} document{documents.length !== 1 ? 's' : ''}</h3>
      </div>

      <div className="gallery-grid">
        {documents.map(doc => (
          <div key={doc.id} className="document-card">
            <div className="card-header">
              <span className="file-icon">{getFileIcon(doc.type)}</span>
              <button
                className={`favorite-btn ${doc.favorite ? 'active' : ''}`}
                onClick={() => handleToggleFavorite(doc.id)}
                title="Ajouter aux favoris"
              >
                ⭐
              </button>
            </div>

            <div className="card-content">
              <h4 className="document-name" title={doc.name}>
                {doc.name}
              </h4>
              <p className="document-type">{getFileType(doc.type)}</p>
              <p className="document-size">{formatFileSize(doc.size)}</p>
              <p className="document-date">{formatDate(doc.addedAt)}</p>
            </div>

            <div className="card-actions">
              <button
                className="action-btn preview-btn"
                onClick={() => setPreviewDoc(doc)}
                title="Prévisualiser"
              >
                👁️
              </button>
              {doc.content && (
                <button
                  className="action-btn download-btn"
                  onClick={() => handleDownload(doc)}
                  title="Télécharger"
                >
                  ⬇️
                </button>
              )}
              <button
                className="action-btn delete-btn"
                onClick={() => handleDelete(doc.id)}
                title="Supprimer"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de prévisualisation */}
      {previewDoc && (
        <div className="preview-modal-overlay" onClick={() => setPreviewDoc(null)}>
          <div className="preview-modal" onClick={(e) => e.stopPropagation()}>
            <div className="preview-header">
              <h3>{previewDoc.name}</h3>
              <button
                className="close-btn"
                onClick={() => setPreviewDoc(null)}
              >
                ✕
              </button>
            </div>

            <div className="preview-content">
              {previewDoc.type.includes('image') && previewDoc.content ? (
                <img src={previewDoc.content} alt={previewDoc.name} />
              ) : previewDoc.type.includes('pdf') && previewDoc.content ? (
                <iframe src={previewDoc.content} title={previewDoc.name} />
              ) : previewDoc.type.includes('text') && previewDoc.content ? (
                <pre>{previewDoc.content}</pre>
              ) : (
                <div className="preview-unavailable">
                  <p>Prévisualisation non disponible pour ce type de fichier</p>
                  <p className="file-info">
                    {getFileType(previewDoc.type)} • {formatFileSize(previewDoc.size)}
                  </p>
                </div>
              )}
            </div>

            <div className="preview-footer">
              <p className="preview-info">
                Ajouté le {formatDate(previewDoc.addedAt)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentGalleryV2;
