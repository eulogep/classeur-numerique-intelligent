import React, { useState } from 'react';
import './DocumentGallery.css';

const DocumentGallery = ({ documents, onDelete }) => {
  const [previewDoc, setPreviewDoc] = useState(null);

  const getFileIcon = (fileType) => {
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('word') || fileType.includes('document')) return '📝';
    if (fileType.includes('image')) return '🖼️';
    if (fileType.includes('video')) return '🎥';
    if (fileType.includes('audio')) return '🎵';
    if (fileType.includes('zip') || fileType.includes('rar')) return '📦';
    if (fileType.includes('text')) return '📃';
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
      day: '2-digit', month: '2-digit', year: 'numeric',
    });
  };

  const getFileType = (mimeType) => {
    if (mimeType.includes('pdf')) return 'PDF';
    if (mimeType.includes('word') || mimeType.includes('document')) return 'Document';
    if (mimeType.includes('image')) return 'Image';
    if (mimeType.includes('video')) return 'Vidéo';
    if (mimeType.includes('audio')) return 'Audio';
    if (mimeType.includes('zip') || mimeType.includes('rar')) return 'Archive';
    if (mimeType.includes('text')) return 'Texte';
    return 'Autre';
  };

  const canPreview = (doc) =>
    doc.content && (doc.type.includes('image') || doc.type.includes('pdf') || doc.type.includes('text'));

  const canDownload = (doc) => doc.content != null;

  const handleDownload = (doc) => {
    if (!doc.content) return;
    const a = document.createElement('a');
    a.href = doc.content;
    a.download = doc.name;
    a.click();
  };

  const typeColors = {
    'PDF': '#ef4444', 'Document': '#3b82f6', 'Image': '#10b981',
    'Vidéo': '#8b5cf6', 'Audio': '#f59e0b', 'Archive': '#6b7280',
    'Texte': '#06b6d4', 'Autre': '#94a3b8',
  };

  if (documents.length === 0) {
    return (
      <div className="document-gallery empty">
        <div className="empty-state">
          <div className="empty-icon">📁</div>
          <h3>Aucun document</h3>
          <p>Importez des fichiers ou modifiez vos filtres.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="document-gallery">
      <div className="gallery-header">
        <h3>Documents <span className="doc-count">{documents.length}</span></h3>
      </div>

      <div className="documents-grid">
        {documents.map((doc) => {
          const fileType = getFileType(doc.type);
          const color = typeColors[fileType] || '#94a3b8';
          return (
            <div key={doc.id} className="document-card">
              {doc.type.includes('image') && doc.content ? (
                <div className="doc-thumbnail" onClick={() => setPreviewDoc(doc)}>
                  <img src={doc.content} alt={doc.name} />
                </div>
              ) : (
                <div className="document-icon-wrap" style={{ background: `${color}15` }}>
                  <span className="document-icon">{getFileIcon(doc.type)}</span>
                </div>
              )}
              <div className="document-info">
                <h4 className="document-name" title={doc.name}>
                  {doc.name.length > 28 ? doc.name.substring(0, 28) + '…' : doc.name}
                </h4>
                <div className="document-meta">
                  <span className="file-size">{formatFileSize(doc.size)}</span>
                  <span className="file-date">{formatDate(doc.lastModified)}</span>
                </div>
                <span className="document-type-badge" style={{ background: `${color}20`, color }}>
                  {fileType}
                </span>
              </div>
              <div className="document-actions">
                {canPreview(doc) && (
                  <button className="action-icon-btn preview" onClick={() => setPreviewDoc(doc)} title="Prévisualiser">👁️</button>
                )}
                {canDownload(doc) && (
                  <button className="action-icon-btn download" onClick={() => handleDownload(doc)} title="Télécharger">⬇️</button>
                )}
                <button className="action-icon-btn delete" onClick={() => onDelete(doc.id)} title="Supprimer">🗑️</button>
              </div>
            </div>
          );
        })}
      </div>

      {previewDoc && (
        <div className="preview-modal" onClick={() => setPreviewDoc(null)}>
          <div className="preview-content" onClick={(e) => e.stopPropagation()}>
            <div className="preview-header">
              <h3>{previewDoc.name}</h3>
              <button className="preview-close" onClick={() => setPreviewDoc(null)}>✕</button>
            </div>
            <div className="preview-body">
              {previewDoc.type.includes('image') && <img src={previewDoc.content} alt={previewDoc.name} className="preview-image" />}
              {previewDoc.type.includes('pdf') && <iframe src={previewDoc.content} title={previewDoc.name} className="preview-pdf" />}
              {previewDoc.type.includes('text') && <pre className="preview-text">{previewDoc.content}</pre>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentGallery;
