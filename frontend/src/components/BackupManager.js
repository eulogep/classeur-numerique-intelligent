import React, { useState, useEffect } from 'react';
import './BackupManager.css';

const BackupManager = ({ folders, documents, onRestore }) => {
  const [backups, setBackups] = useState([]);
  const [showBackupPanel, setShowBackupPanel] = useState(false);
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);

  useEffect(() => {
    loadBackups();
  }, []);

  const loadBackups = () => {
    const savedBackups = localStorage.getItem('backups');
    if (savedBackups) {
      setBackups(JSON.parse(savedBackups));
    }
  };

  const createBackup = async () => {
    setIsCreatingBackup(true);
    setBackupProgress(0);

    // Simuler le processus de sauvegarde
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setBackupProgress(i);
    }

    const backup = {
      id: Date.now(),
      name: `Sauvegarde ${new Date().toLocaleString('fr-FR')}`,
      date: new Date().toISOString(),
      folders: JSON.parse(JSON.stringify(folders)),
      documents: JSON.parse(JSON.stringify(documents)),
      size: calculateBackupSize(folders, documents)
    };

    const updatedBackups = [backup, ...backups.slice(0, 9)]; // Garder max 10 sauvegardes
    setBackups(updatedBackups);
    localStorage.setItem('backups', JSON.stringify(updatedBackups));

    setIsCreatingBackup(false);
    setBackupProgress(0);
  };

  const calculateBackupSize = (folders, documents) => {
    const data = JSON.stringify({ folders, documents });
    return new Blob([data]).size;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const restoreBackup = (backup) => {
    if (window.confirm(`Êtes-vous sûr de vouloir restaurer la sauvegarde "${backup.name}" ? Cela remplacera vos données actuelles.`)) {
      onRestore(backup.folders, backup.documents);
      setShowBackupPanel(false);
    }
  };

  const deleteBackup = (backupId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette sauvegarde ?')) {
      const updatedBackups = backups.filter(b => b.id !== backupId);
      setBackups(updatedBackups);
      localStorage.setItem('backups', JSON.stringify(updatedBackups));
    }
  };

  const exportBackup = (backup) => {
    const dataStr = JSON.stringify(backup, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup-${backup.id}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importBackup = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const backup = JSON.parse(e.target.result);
          if (backup.folders && backup.documents) {
            const newBackup = {
              ...backup,
              id: Date.now(),
              name: `Importé - ${new Date().toLocaleString('fr-FR')}`,
              date: new Date().toISOString()
            };
            const updatedBackups = [newBackup, ...backups];
            setBackups(updatedBackups);
            localStorage.setItem('backups', JSON.stringify(updatedBackups));
            alert('Sauvegarde importée avec succès !');
          } else {
            alert('Fichier de sauvegarde invalide');
          }
        } catch (error) {
          alert('Erreur lors de l\'import du fichier');
        }
      };
      reader.readAsText(file);
    }
  };

  const clearAllBackups = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer toutes les sauvegardes ?')) {
      setBackups([]);
      localStorage.removeItem('backups');
    }
  };

  return (
    <>
      {/* Bouton de sauvegarde flottant */}
      <button 
        className="backup-button"
        onClick={() => setShowBackupPanel(!showBackupPanel)}
        title="Gérer les sauvegardes"
      >
        💾
      </button>

      {/* Panel de sauvegarde */}
      {showBackupPanel && (
        <div className="backup-overlay" onClick={() => setShowBackupPanel(false)}>
          <div className="backup-panel" onClick={(e) => e.stopPropagation()}>
            <div className="backup-header">
              <h3>💾 Gestionnaire de sauvegardes</h3>
              <button 
                className="close-backup-btn"
                onClick={() => setShowBackupPanel(false)}
              >
                ✕
              </button>
            </div>

            <div className="backup-content">
              {/* Créer une sauvegarde */}
              <div className="backup-section">
                <h4>📦 Créer une sauvegarde</h4>
                <div className="backup-actions">
                  <button 
                    className="create-backup-btn"
                    onClick={createBackup}
                    disabled={isCreatingBackup}
                  >
                    {isCreatingBackup ? '⏳ Création...' : '💾 Créer une sauvegarde'}
                  </button>
                  
                  {isCreatingBackup && (
                    <div className="backup-progress">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ width: `${backupProgress}%` }}
                        ></div>
                      </div>
                      <span>{backupProgress}%</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Importer une sauvegarde */}
              <div className="backup-section">
                <h4>📥 Importer une sauvegarde</h4>
                <div className="import-section">
                  <input
                    type="file"
                    accept=".json"
                    onChange={importBackup}
                    id="import-backup"
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="import-backup" className="import-btn">
                    📁 Choisir un fichier
                  </label>
                  <p className="import-hint">Sélectionnez un fichier .json de sauvegarde</p>
                </div>
              </div>

              {/* Liste des sauvegardes */}
              <div className="backup-section">
                <div className="backup-list-header">
                  <h4>📋 Sauvegardes disponibles</h4>
                  {backups.length > 0 && (
                    <button 
                      className="clear-all-btn"
                      onClick={clearAllBackups}
                    >
                      🗑️ Tout supprimer
                    </button>
                  )}
                </div>

                {backups.length === 0 ? (
                  <div className="no-backups">
                    <p>📭 Aucune sauvegarde disponible</p>
                    <p>Créez votre première sauvegarde pour commencer</p>
                  </div>
                ) : (
                  <div className="backup-list">
                    {backups.map((backup) => (
                      <div key={backup.id} className="backup-item">
                        <div className="backup-info">
                          <div className="backup-name">{backup.name}</div>
                          <div className="backup-meta">
                            <span>📅 {new Date(backup.date).toLocaleString('fr-FR')}</span>
                            <span>📊 {formatFileSize(backup.size)}</span>
                            <span>📁 {Object.keys(backup.folders).length} dossiers</span>
                            <span>📄 {backup.documents.length} documents</span>
                          </div>
                        </div>
                        
                        <div className="backup-actions">
                          <button 
                            className="restore-btn"
                            onClick={() => restoreBackup(backup)}
                            title="Restaurer"
                          >
                            🔄
                          </button>
                          <button 
                            className="export-btn"
                            onClick={() => exportBackup(backup)}
                            title="Exporter"
                          >
                            📤
                          </button>
                          <button 
                            className="delete-btn"
                            onClick={() => deleteBackup(backup.id)}
                            title="Supprimer"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Statistiques */}
              <div className="backup-stats">
                <div className="stat-item">
                  <span className="stat-label">Sauvegardes</span>
                  <span className="stat-value">{backups.length}/10</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Espace total</span>
                  <span className="stat-value">
                    {formatFileSize(backups.reduce((sum, b) => sum + b.size, 0))}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Plus récente</span>
                  <span className="stat-value">
                    {backups.length > 0 ? 
                      new Date(backups[0].date).toLocaleDateString('fr-FR') : 
                      'Aucune'
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BackupManager; 