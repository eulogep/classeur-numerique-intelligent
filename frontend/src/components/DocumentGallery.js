import React from 'react';
import './DocumentGallery.css';

const DocumentGallery = ({ documents, onDelete }) => {
  const getFileIcon = (fileType) => {
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('word') || fileType.includes('document')) return '📝';
    if (fileType.includes('image')) return '🖼️';
    if (fileType.includes('video')) return '🎥';
    if (fileType.includes('audio')) return '🎵';
    if (fileType.includes('zip') || fileType.includes('rar')) return '📦';
    return '📄';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  if (documents.length === 0) {
    return (
      <div className="document-gallery empty">
        <div className="empty-state">
          <div className="empty-icon">📁</div>
          <h3>Aucun document trouvé</h3>
          <p>Essayez de modifier vos filtres ou de rechercher autre chose.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="document-gallery">
      <div className="gallery-header">
        <h3>Documents ({documents.length})</h3>
      </div>
      
      <div className="documents-grid">
        {documents.map((doc) => (
          <div key={doc.id} className="document-card">
            <div className="document-icon">
              {getFileIcon(doc.type)}
            </div>
            
            <div className="document-info">
              <h4 className="document-name" title={doc.name}>
                {doc.name.length > 30 ? doc.name.substring(0, 30) + '...' : doc.name}
              </h4>
              
              <div className="document-meta">
                <span className="file-size">{formatFileSize(doc.size)}</span>
                <span className="file-date">{formatDate(doc.lastModified)}</span>
              </div>
              
              <div className="document-type">
                {getFileType(doc.type)}
              </div>
            </div>
            
            <div className="document-actions">
              <button 
                className="delete-btn"
                onClick={() => onDelete(doc.id)}
                title="Supprimer"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentGallery;
