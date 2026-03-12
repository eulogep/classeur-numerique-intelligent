import React, { useState, useEffect } from 'react';
import './KeyboardShortcuts.css';

const KeyboardShortcuts = ({ onShortcut }) => {
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + K pour la recherche
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        onShortcut('search');
      }
      
      // Ctrl/Cmd + N pour nouveau dossier
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        onShortcut('newFolder');
      }
      
      // Ctrl/Cmd + I pour importer
      if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
        e.preventDefault();
        onShortcut('import');
      }
      
      // Échap pour fermer les modales
      if (e.key === 'Escape') {
        onShortcut('escape');
      }
      
      // F1 pour l'aide
      if (e.key === 'F1') {
        e.preventDefault();
        setShowHelp(!showHelp);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onShortcut, showHelp]);

  const shortcuts = [
    { key: 'Ctrl/Cmd + K', action: 'Rechercher', description: 'Ouvrir la recherche' },
    { key: 'Ctrl/Cmd + N', action: 'Nouveau dossier', description: 'Créer un nouveau dossier' },
    { key: 'Ctrl/Cmd + I', action: 'Importer', description: 'Importer des fichiers' },
    { key: 'F1', action: 'Aide', description: 'Afficher cette aide' },
    { key: 'Échap', action: 'Fermer', description: 'Fermer les modales' },
    { key: 'Entrée', action: 'Sélectionner', description: 'Sélectionner un élément' },
    { key: 'Suppr', action: 'Supprimer', description: 'Supprimer l\'élément sélectionné' }
  ];

  return (
    <>
      {/* Bouton d'aide flottant */}
      <button 
        className="help-button"
        onClick={() => setShowHelp(!showHelp)}
        title="Aide (F1)"
      >
        ❓
      </button>

      {/* Modal d'aide */}
      {showHelp && (
        <div className="shortcuts-overlay" onClick={() => setShowHelp(false)}>
          <div className="shortcuts-modal" onClick={(e) => e.stopPropagation()}>
            <div className="shortcuts-header">
              <h3>⌨️ Raccourcis clavier</h3>
              <button 
                className="close-btn"
                onClick={() => setShowHelp(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="shortcuts-content">
              <div className="shortcuts-grid">
                {shortcuts.map((shortcut, index) => (
                  <div key={index} className="shortcut-item">
                    <div className="shortcut-key">
                      <kbd>{shortcut.key}</kbd>
                    </div>
                    <div className="shortcut-info">
                      <div className="shortcut-action">{shortcut.action}</div>
                      <div className="shortcut-description">{shortcut.description}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="shortcuts-tip">
                <p>💡 <strong>Astuce :</strong> Appuyez sur F1 à tout moment pour afficher cette aide</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default KeyboardShortcuts; 