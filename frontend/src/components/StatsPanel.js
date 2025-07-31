import React from 'react';
import './StatsPanel.css';

const StatsPanel = ({ documents, selectedFolder }) => {
  const calculateStats = () => {
    const totalDocs = documents.length;
    const totalSize = documents.reduce((sum, doc) => sum + doc.size, 0);
    
    const typeStats = documents.reduce((acc, doc) => {
      const type = getFileType(doc.type);
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    const recentDocs = documents.filter(doc => {
      const docDate = new Date(doc.lastModified);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return docDate > weekAgo;
    }).length;

    return {
      totalDocs,
      totalSize,
      typeStats,
      recentDocs
    };
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

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const stats = calculateStats();

  return (
    <div className="stats-panel">
      <h3>📊 Statistiques</h3>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📁</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalDocs}</div>
            <div className="stat-label">Documents</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💾</div>
          <div className="stat-content">
            <div className="stat-value">{formatFileSize(stats.totalSize)}</div>
            <div className="stat-label">Taille totale</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🆕</div>
          <div className="stat-content">
            <div className="stat-value">{stats.recentDocs}</div>
            <div className="stat-label">Cette semaine</div>
          </div>
        </div>
      </div>

      {stats.totalDocs > 0 && (
        <div className="type-breakdown">
          <h4>Types de fichiers</h4>
          <div className="type-list">
            {Object.entries(stats.typeStats).map(([type, count]) => (
              <div key={type} className="type-item">
                <span className="type-name">{type}</span>
                <span className="type-count">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedFolder && (
        <div className="folder-info">
          <h4>📂 Dossier actuel</h4>
          <p className="folder-path">{selectedFolder}</p>
        </div>
      )}
    </div>
  );
};

export default StatsPanel; 