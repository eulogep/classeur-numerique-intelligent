import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const Dashboard = ({ folders, documents }) => {
  const [stats, setStats] = useState({
    totalFolders: 0,
    totalDocuments: 0,
    totalSize: 0,
    recentActivity: [],
    typeDistribution: {},
    folderDistribution: {},
    growthData: []
  });

  useEffect(() => {
    calculateStats();
  }, [folders, documents]);

  const calculateStats = () => {
    // Calculer le nombre total de dossiers
    const countFolders = (folderObj) => {
      let count = 0;
      Object.keys(folderObj).forEach(key => {
        count++;
        if (typeof folderObj[key] === 'object' && folderObj[key] !== null) {
          count += countFolders(folderObj[key]);
        }
      });
      return count;
    };

    const totalFolders = countFolders(folders);
    const totalDocuments = documents.length;
    const totalSize = documents.reduce((sum, doc) => sum + doc.size, 0);

    // Distribution par type
    const typeDistribution = documents.reduce((acc, doc) => {
      const type = getFileType(doc.type);
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    // Distribution par dossier
    const folderDistribution = documents.reduce((acc, doc) => {
      acc[doc.path] = (acc[doc.path] || 0) + 1;
      return acc;
    }, {});

    // Activité récente (7 derniers jours)
    const recentActivity = documents
      .sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified))
      .slice(0, 5);

    // Données de croissance (simulation)
    const growthData = generateGrowthData(documents);

    setStats({
      totalFolders,
      totalDocuments,
      totalSize,
      recentActivity,
      typeDistribution,
      folderDistribution,
      growthData
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

  const generateGrowthData = (docs) => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayDocs = docs.filter(doc => {
        const docDate = new Date(doc.lastModified);
        return docDate.toDateString() === date.toDateString();
      });
      last7Days.push({
        date: date.toLocaleDateString('fr-FR', { weekday: 'short' }),
        count: dayDocs.length
      });
    }
    return last7Days;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getTopFolders = () => {
    return Object.entries(stats.folderDistribution)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
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
            <div className="stat-value">{stats.recentActivity.length}</div>
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
        <div className="dashboard-section">
          <h3>🔥 Dossiers les plus actifs</h3>
          <div className="top-folders">
            {getTopFolders().map(([folder, count], index) => (
              <div key={folder} className="folder-item">
                <div className="folder-rank">#{index + 1}</div>
                <div className="folder-info">
                  <div className="folder-name">{folder}</div>
                  <div className="folder-count">{count} documents</div>
                </div>
                <div className="folder-percentage">
                  {((count / stats.totalDocuments) * 100).toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activité récente */}
        <div className="dashboard-section">
          <h3>🕒 Activité récente</h3>
          <div className="recent-activity">
            {stats.recentActivity.map((doc, index) => (
              <div key={doc.id} className="activity-item">
                <div className="activity-icon">{getFileIcon(doc.type)}</div>
                <div className="activity-content">
                  <div className="activity-title">{doc.name}</div>
                  <div className="activity-meta">
                    {doc.path} • {formatFileSize(doc.size)} • {new Date(doc.lastModified).toLocaleDateString('fr-FR')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Graphique de croissance */}
        <div className="dashboard-section">
          <h3>📈 Croissance (7 derniers jours)</h3>
          <div className="growth-chart">
            {stats.growthData.map((day, index) => (
              <div key={index} className="growth-bar">
                <div className="growth-label">{day.date}</div>
                <div className="growth-bar-container">
                  <div 
                    className="growth-fill"
                    style={{ 
                      height: `${Math.max((day.count / Math.max(...stats.growthData.map(d => d.count))) * 100, 5)}%`
                    }}
                  ></div>
                </div>
                <div className="growth-value">{day.count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const getFileIcon = (mimeType) => {
  if (mimeType.includes('pdf')) return '📄';
  if (mimeType.includes('word') || mimeType.includes('document')) return '📝';
  if (mimeType.includes('image')) return '🖼️';
  if (mimeType.includes('video')) return '🎥';
  if (mimeType.includes('audio')) return '🎵';
  if (mimeType.includes('zip') || mimeType.includes('rar')) return '📦';
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
    'Autre': '#F8BBD9'
  };
  return colors[type] || '#F8BBD9';
};

export default Dashboard; 