import React, { useState, useEffect } from 'react';
import './DynamicCards.css';

const DynamicCards = ({ folders, documents, onFolderSelect, onDocumentSelect }) => {
  const [expandedCard, setExpandedCard] = useState(null);
  const [showFolders, setShowFolders] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler un chargement pour l'effet d'apparition
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleCardClick = (cardId) => {
    if (expandedCard === cardId) {
      setExpandedCard(null);
    } else {
      setExpandedCard(cardId);
    }
  };

  const getFolderIcon = (folderName) => {
    const icons = {
      'Prépa': '🎓',
      'Première': '📚',
      'Terminale': '🎯',
      'ESIEA': '💻',
      'SIA': '🔬',
      'Administratif': '📋',
      'Data Science': '📊',
      'Machine Learning': '🤖',
      'Statistiques': '📈',
      'Programmation': '💻',
      'Bases de données': '🗄️',
      'Mathématiques': '🔢',
      'Physique': '⚛️',
      'Chimie': '🧪',
      'Informatique': '💻'
    };
    return icons[folderName] || '📁';
  };

  const getFolderColor = (folderName) => {
    const colors = {
      'Prépa': 'linear-gradient(135deg, #667eea, #764ba2)',
      'Première': 'linear-gradient(135deg, #f093fb, #f5576c)',
      'Terminale': 'linear-gradient(135deg, #4facfe, #00f2fe)',
      'ESIEA': 'linear-gradient(135deg, #43e97b, #38f9d7)',
      'SIA': 'linear-gradient(135deg, #fa709a, #fee140)',
      'Administratif': 'linear-gradient(135deg, #a8edea, #fed6e3)',
      'Data Science': 'linear-gradient(135deg, #667eea, #764ba2)',
      'Machine Learning': 'linear-gradient(135deg, #f093fb, #f5576c)',
      'Statistiques': 'linear-gradient(135deg, #4facfe, #00f2fe)',
      'Programmation': 'linear-gradient(135deg, #43e97b, #38f9d7)',
      'Bases de données': 'linear-gradient(135deg, #fa709a, #fee140)',
      'Mathématiques': 'linear-gradient(135deg, #667eea, #764ba2)',
      'Physique': 'linear-gradient(135deg, #f093fb, #f5576c)',
      'Chimie': 'linear-gradient(135deg, #4facfe, #00f2fe)',
      'Informatique': 'linear-gradient(135deg, #43e97b, #38f9d7)'
    };
    return colors[folderName] || 'linear-gradient(135deg, #667eea, #764ba2)';
  };

  const getDocumentsInFolder = (folderPath) => {
    return documents.filter(doc => doc.path === folderPath);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileTypeIcon = (mimeType) => {
    if (mimeType.includes('pdf')) return '📄';
    if (mimeType.includes('word') || mimeType.includes('document')) return '📝';
    if (mimeType.includes('image')) return '🖼️';
    if (mimeType.includes('video')) return '🎥';
    if (mimeType.includes('audio')) return '🎵';
    if (mimeType.includes('zip') || mimeType.includes('rar')) return '📦';
    return '📄';
  };

  const renderFolderCards = () => {
    const cards = [];
    
    Object.entries(folders).forEach(([folderName, subFolders]) => {
      // Carte principale du dossier
      cards.push(
        <div
          key={`folder-${folderName}`}
          className={`dynamic-card ${expandedCard === `folder-${folderName}` ? 'expanded' : ''}`}
          onClick={() => handleCardClick(`folder-${folderName}`)}
          style={{ animationDelay: `${cards.length * 0.1}s` }}
        >
          <div className="card-content">
            <div className="card-header">
              <div 
                className="card-icon"
                style={{ background: getFolderColor(folderName) }}
              >
                {getFolderIcon(folderName)}
              </div>
              <div>
                <div className="card-title">{folderName}</div>
                <div className="card-subtitle">Dossier principal</div>
              </div>
            </div>
            <div className="card-description">
              {Object.keys(subFolders).length} sous-dossier{Object.keys(subFolders).length !== 1 ? 's' : ''}
            </div>
            <div className="card-actions">
              <button 
                className="card-action-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onFolderSelect(folderName);
                }}
              >
                📂 Ouvrir
              </button>
              <button className="card-action-btn">
                📊 Statistiques
              </button>
            </div>
          </div>
        </div>
      );

      // Cartes des sous-dossiers
      Object.entries(subFolders).forEach(([subFolderName, subSubFolders]) => {
        const folderPath = `${folderName} > ${subFolderName}`;
        const docsInFolder = getDocumentsInFolder(folderPath);
        const totalSize = docsInFolder.reduce((sum, doc) => sum + doc.size, 0);

        cards.push(
          <div
            key={`subfolder-${folderPath}`}
            className={`dynamic-card ${expandedCard === `subfolder-${folderPath}` ? 'expanded' : ''}`}
            onClick={() => handleCardClick(`subfolder-${folderPath}`)}
            style={{ animationDelay: `${cards.length * 0.1}s` }}
          >
            <div className="card-content">
              <div className="card-header">
                <div 
                  className="card-icon"
                  style={{ background: getFolderColor(subFolderName) }}
                >
                  {getFolderIcon(subFolderName)}
                </div>
                <div>
                  <div className="card-title">{subFolderName}</div>
                  <div className="card-subtitle">{folderName}</div>
                </div>
              </div>
              <div className="card-description">
                {docsInFolder.length} document{docsInFolder.length !== 1 ? 's' : ''} • {formatFileSize(totalSize)}
              </div>
              <div className="card-actions">
                <button 
                  className="card-action-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onFolderSelect(folderPath);
                  }}
                >
                  📂 Ouvrir
                </button>
                <button className="card-action-btn">
                  📊 Détails
                </button>
              </div>
            </div>
          </div>
        );

        // Cartes des sous-sous-dossiers
        if (typeof subSubFolders === 'object' && subSubFolders !== null) {
          Object.entries(subSubFolders).forEach(([subSubFolderName, _]) => {
            const subFolderPath = `${folderName} > ${subFolderName} > ${subSubFolderName}`;
            const docsInSubFolder = getDocumentsInFolder(subFolderPath);
            const subTotalSize = docsInSubFolder.reduce((sum, doc) => sum + doc.size, 0);

            cards.push(
              <div
                key={`subsubfolder-${subFolderPath}`}
                className={`dynamic-card ${expandedCard === `subsubfolder-${subFolderPath}` ? 'expanded' : ''}`}
                onClick={() => handleCardClick(`subsubfolder-${subFolderPath}`)}
                style={{ animationDelay: `${cards.length * 0.1}s` }}
              >
                <div className="card-content">
                  <div className="card-header">
                    <div 
                      className="card-icon"
                      style={{ background: getFolderColor(subSubFolderName) }}
                    >
                      {getFolderIcon(subSubFolderName)}
                    </div>
                    <div>
                      <div className="card-title">{subSubFolderName}</div>
                      <div className="card-subtitle">{subFolderName}</div>
                    </div>
                  </div>
                  <div className="card-description">
                    {docsInSubFolder.length} document{docsInSubFolder.length !== 1 ? 's' : ''} • {formatFileSize(subTotalSize)}
                  </div>
                  <div className="card-actions">
                    <button 
                      className="card-action-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onFolderSelect(subFolderPath);
                      }}
                    >
                      📂 Ouvrir
                    </button>
                    <button className="card-action-btn">
                      📊 Détails
                    </button>
                  </div>
                </div>
              </div>
            );
          });
        }
      });
    });

    return cards;
  };

  const renderDocumentCards = () => {
    return documents.slice(0, 12).map((doc, index) => (
      <div
        key={`doc-${doc.id}`}
        className={`dynamic-card ${expandedCard === `doc-${doc.id}` ? 'expanded' : ''}`}
        onClick={() => handleCardClick(`doc-${doc.id}`)}
        style={{ animationDelay: `${index * 0.05}s` }}
      >
        <div className="card-content">
          <div className="card-header">
            <div className="card-icon">
              {getFileTypeIcon(doc.type)}
            </div>
            <div>
              <div className="card-title">{doc.name}</div>
              <div className="card-subtitle">{doc.path}</div>
            </div>
          </div>
          <div className="card-description">
            {formatFileSize(doc.size)} • {new Date(doc.lastModified).toLocaleDateString()}
          </div>
          <div className="card-actions">
            <button 
              className="card-action-btn"
              onClick={(e) => {
                e.stopPropagation();
                onDocumentSelect(doc);
              }}
            >
              👁️ Voir
            </button>
            <button className="card-action-btn">
              📥 Télécharger
            </button>
          </div>
        </div>
      </div>
    ));
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-logo">📚</div>
        <div className="loading-text">Système initialisé...</div>
        <div className="loading-progress"></div>
      </div>
    );
  }

  return (
    <div className="dynamic-cards-wrapper">
      {/* Bouton flottant pour afficher/masquer les dossiers */}
      <button 
        className={`floating-button folders-button ${showFolders ? 'active' : ''}`}
        onClick={() => setShowFolders(!showFolders)}
      >
        📁
      </button>

      {/* Container des cartes */}
      <div className="dynamic-cards-container">
        {showFolders ? renderFolderCards() : renderDocumentCards()}
      </div>

      {/* Message si aucune carte */}
      {(!showFolders && documents.length === 0) && (
        <div className="empty-state">
          <div className="empty-icon">📚</div>
          <h3>Aucun document trouvé</h3>
          <p>Commencez par importer vos premiers documents</p>
        </div>
      )}

      {showFolders && Object.keys(folders).length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📁</div>
          <h3>Aucun dossier créé</h3>
          <p>Créez votre premier dossier pour commencer</p>
        </div>
      )}
    </div>
  );
};

export default DynamicCards; 