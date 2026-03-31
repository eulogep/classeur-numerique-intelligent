import React, { useState, useRef, useCallback } from 'react';
import { useFolders } from '../contexts/FolderContext';
import './DocumentImport.css';

/**
 * Composant d'import de documents refactorisé
 * Utilise la nouvelle architecture avec IDs de dossiers
 */

const DocumentImportV2 = ({ folderId }) => {
  const { addDocuments } = useFolders();
  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedCount, setUploadedCount] = useState(0);

  // Lire le contenu du fichier
  const readFileContent = useCallback((file) => {
    return new Promise((resolve) => {
      // Pour les images, PDF et texte, lire le contenu
      if (file.type.includes('image')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({
            content: e.target.result,
            type: file.type
          });
        };
        reader.readAsDataURL(file);
      } else if (file.type.includes('pdf')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({
            content: e.target.result,
            type: file.type
          });
        };
        reader.readAsDataURL(file);
      } else if (file.type.includes('text')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({
            content: e.target.result,
            type: file.type
          });
        };
        reader.readAsText(file);
      } else {
        // Pour les autres types, ne pas charger le contenu
        resolve({
          content: null,
          type: file.type
        });
      }
    });
  }, []);

  // Traiter les fichiers
  const processFiles = useCallback(async (files) => {
    if (!files || files.length === 0) return;

    setIsProcessing(true);
    setProgress(0);
    setUploadedCount(0);

    const newDocuments = [];
    const totalFiles = files.length;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      try {
        const { content, type } = await readFileContent(file);

        const doc = {
          name: file.name,
          type: type,
          size: file.size,
          lastModified: file.lastModified,
          content: content
        };

        newDocuments.push(doc);
        setUploadedCount(i + 1);
        setProgress(Math.round(((i + 1) / totalFiles) * 100));
      } catch (error) {
        console.error(`Erreur lors de la lecture de ${file.name}:`, error);
      }
    }

    // Ajouter les documents via le hook
    if (newDocuments.length > 0) {
      addDocuments(newDocuments, folderId);
    }

    setIsProcessing(false);
    setProgress(0);
    setUploadedCount(0);

    // Afficher une notification de succès
    if (window.showToast) {
      window.showToast('success', 'Import réussi', `${newDocuments.length} document(s) importé(s)`);
    }
  }, [readFileContent, addDocuments, folderId]);

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files || []);
    processFiles(files);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFolderSelect = (event) => {
    const files = Array.from(event.target.files || []);
    processFiles(files);
    if (folderInputRef.current) {
      folderInputRef.current.value = '';
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('drag-over');

    const files = Array.from(e.dataTransfer.files || []);
    processFiles(files);
  };

  if (!folderId) {
    return (
      <div className="document-import disabled">
        <p>Sélectionnez un dossier pour importer des documents</p>
      </div>
    );
  }

  return (
    <div className="document-import">
      {/* Zone de dépôt */}
      <div
        className="drop-zone"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="drop-icon">📁</div>
        <h3>Glissez-déposez vos fichiers ici</h3>
        <p>ou utilisez les boutons ci-dessous</p>
      </div>

      {/* Boutons d'import */}
      <div className="import-buttons">
        <button
          className="import-btn files-btn"
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
        >
          📄 Importer des fichiers
        </button>
        <button
          className="import-btn folder-btn"
          onClick={() => folderInputRef.current?.click()}
          disabled={isProcessing}
        >
          📂 Importer un dossier
        </button>
      </div>

      {/* Inputs cachés */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
      <input
        ref={folderInputRef}
        type="file"
        webkitdirectory="true"
        directory="true"
        onChange={handleFolderSelect}
        style={{ display: 'none' }}
      />

      {/* Barre de progression */}
      {isProcessing && (
        <div className="progress-container">
          <div className="progress-info">
            <span>Importation en cours...</span>
            <span className="progress-count">{uploadedCount} fichier(s)</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="progress-percentage">{progress}%</div>
        </div>
      )}

      {/* Formats supportés */}
      <div className="supported-formats">
        <h4>📋 Formats supportés</h4>
        <div className="formats-grid">
          <div className="format-group">
            <strong>Documents</strong>
            <p>PDF, DOC, DOCX, TXT, RTF</p>
          </div>
          <div className="format-group">
            <strong>Images</strong>
            <p>JPG, JPEG, PNG, GIF, BMP, TIFF</p>
          </div>
          <div className="format-group">
            <strong>Vidéos</strong>
            <p>MP4, AVI, MOV, WMV</p>
          </div>
          <div className="format-group">
            <strong>Audio</strong>
            <p>MP3, WAV, FLAC, AAC</p>
          </div>
          <div className="format-group">
            <strong>Archives</strong>
            <p>ZIP, RAR, 7Z, TAR</p>
          </div>
          <div className="format-group">
            <strong>Présentations</strong>
            <p>PPT, PPTX, KEY</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentImportV2;
