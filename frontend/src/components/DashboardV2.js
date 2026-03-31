import React, { useMemo, useEffect, useRef } from 'react';
import { useFolders } from '../contexts/FolderContext';
import './Dashboard.css';

/**
 * Dashboard refactorisé avec données réelles
 * Remplace les simulations par des calculs réels
 */

const DashboardV2 = () => {
  const { folders, documents, getStatistics, getDocumentsByFolder } = useFolders();

  // Calculer les statistiques réelles
  const stats = useMemo(() => {
    const baseStats = getStatistics();

    // Données de croissance réelles (7 derniers jours)
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);

      const dayDocs = documents.filter(doc => {
        const docDate = new Date(doc.addedAt);
        return docDate >= dayStart && docDate < dayEnd;
      });

      last7Days.push({
        date: date.toLocaleDateString('fr-FR', { weekday: 'short' }),
        count: dayDocs.length,
        size: dayDocs.reduce((sum, d) => sum + (d.size || 0), 0)
      });
    }

    // Documents récents (7 derniers jours)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentDocuments = documents
      .filter(doc => new Date(doc.addedAt) > sevenDaysAgo)
      .sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt))
      .slice(0, 5);

    // Top 5 plus gros fichiers
    const largestFiles = [...documents]
      .sort((a, b) => (b.size || 0) - (a.size || 0))
      .slice(0, 5);

    // Top 5 dossiers les plus actifs
    const topFolders = folders
      .map(folder => ({
        ...folder,
        documentCount: getDocumentsByFolder(folder.id).length,
        size: getDocumentsByFolder(folder.id).reduce((sum, d) => sum + (d.size || 0), 0)
      }))
      .filter(f => f.documentCount > 0)
      .sort((a, b) => b.documentCount - a.documentCount)
      .slice(0, 5);

    return {
      ...baseStats,
      growthData: last7Days,
      recentDocuments,
      largestFiles,
      topFolders
    };
  }, [folders, documents, getStatistics, getDocumentsByFolder]);

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

  const getTypeColor = (type) => {
    const colors = {
      'PDF': '#FF6B6B',
      'Document': '#4ECDC4',
      'Image': '#45B7D1',
      'Vidéo': '#96CEB4',
      'Audio': '#FFEAA7',
      'Archive': '#DDA0DD',
      'Texte': '#B0E0E6',
      'Autre': '#F8BBD9'
    };
    return colors[type] || '#F8BBD9';
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>📊 Tableau de bord</h2>
        <p>Vue d'ensemble de votre classeur numérique</p>
      </div>

      {/* Statistiques principales */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">📁</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalFolders}</div>
            <div className="stat-label">Dossiers</div>
          </div>
        </div>

        <div className="stat-card primary">
          <div className="stat-icon">📄</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalDocuments}</div>
            <div className="stat-label">Documents</div>
          </div>
        </div>

        <div className="stat-card primary">
          <div className="stat-icon">💾</div>
          <div className="stat-content">
            <div className="stat-value">{formatFileSize(stats.totalSize)}</div>
            <div className="stat-label">Espace utilisé</div>
          </div>
        </div>

        <div className="stat-card primary">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <div className="stat-value">{stats.recentDocuments.length}</div>
            <div className="stat-label">Ajouts récents</div>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Distribution par type */}
        <div className="dashboard-section">
          <h3>📊 Répartition par type</h3>
          <div className="type-chart">
            {Object.entries(stats.typeDistribution).map(([type, count]) => (
              <div key={type} className="type-bar">
                <div className="type-info">
                  <span className="type-name">{type}</span>
                  <span className="type-count">{count}</span>
                </div>
                <div className="type-progress">
                  <div
                    className="type-fill"
                    style={{
                      width: `${(count / stats.totalDocuments) * 100}%`,
                      backgroundColor: getTypeColor(type)
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dossiers les plus actifs */}
        {stats.topFolders.length > 0 && (
          <div className="dashboard-section">
            <h3>🔥 Dossiers les plus actifs</h3>
            <div className="top-folders">
              {stats.topFolders.map((folder, index) => (
                <div key={folder.id} className="folder-item">
                  <div className="folder-rank">#{index + 1}</div>
                  <div className="folder-info">
                    <div className="folder-name">{folder.name}</div>
                    <div className="folder-count">
                      {folder.documentCount} document{folder.documentCount !== 1 ? 's' : ''} • {formatFileSize(folder.size)}
                    </div>
                  </div>
                  <div className="folder-percentage">
                    {((folder.documentCount / stats.totalDocuments) * 100).toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Activité récente */}
        {stats.recentDocuments.length > 0 && (
          <div className="dashboard-section">
            <h3>🕒 Activité récente (7 jours)</h3>
            <div className="recent-activity">
              {stats.recentDocuments.map((doc) => (
                <div key={doc.id} className="activity-item">
                  <div className="activity-icon">{getFileIcon(doc.type)}</div>
                  <div className="activity-content">
                    <div className="activity-title">{doc.name}</div>
                    <div className="activity-meta">
                      {formatFileSize(doc.size)} • {formatDate(doc.addedAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Graphique de croissance */}
        <div className="dashboard-section">
          <h3>📈 Croissance (7 derniers jours)</h3>
          <div className="growth-chart">
            {stats.growthData.map((day, index) => {
              const maxCount = Math.max(...stats.growthData.map(d => d.count), 1);
              return (
                <div key={index} className="growth-bar">
                  <div className="growth-label">{day.date}</div>
                  <div className="growth-bar-container">
                    <div
                      className="growth-fill"
                      style={{
                        height: `${Math.max((day.count / maxCount) * 100, 5)}%`
                      }}
                    ></div>
                  </div>
                  <div className="growth-value">{day.count}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top 5 plus gros fichiers */}
        {stats.largestFiles.length > 0 && (
          <div className="dashboard-section">
            <h3>📦 Plus gros fichiers</h3>
            <div className="largest-files">
              {stats.largestFiles.map((file, index) => (
                <div key={file.id} className="file-item">
                  <div className="file-rank">#{index + 1}</div>
                  <div className="file-info">
                    <div className="file-name" title={file.name}>
                      {file.name}
                    </div>
                    <div className="file-meta">
                      {formatFileSize(file.size)}
                    </div>
                  </div>
                  <div className="file-icon">{getFileIcon(file.type)}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardV2;
