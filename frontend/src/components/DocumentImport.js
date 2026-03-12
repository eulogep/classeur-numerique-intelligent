import React, { useRef, useState, useCallback } from 'react';
import './DocumentImport.css';

const DocumentImport = ({ onAddDocuments, onImportFolder, folderPath }) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const readFileContent = (file) => {
    return new Promise((resolve) => {
      const isImage = file.type.startsWith('image/');
      const isPDF = file.type === 'application/pdf';
      const isText = file.type.startsWith('text/');
      if (isImage || isPDF || isText) {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = () => resolve(null);
        if (isText) {
          reader.readAsText(file);
        } else {
          reader.readAsDataURL(file);
        }
      } else {
        resolve(null);
      }
    });
  };

  const processFiles = useCallback(async (files) => {
    if (!files.length) return;
    setIsProcessing(true);
    const newDocuments = await Promise.all(
      files.map(async (file) => {
        const content = await readFileContent(file);
        return {
          id: Date.now() + Math.random(),
          name: file.name,
          type: file.type || 'application/octet-stream',
          size: file.size,
          lastModified: file.lastModified,
          path: folderPath,
          content,
        };
      })
    );
    if (onAddDocuments) onAddDocuments(newDocuments);
    setIsProcessing(false);
  }, [folderPath, onAddDocuments]);

  const handleFileSelect = async (event) => {
    const files = Array.from(event.target.files);
    await processFiles(files);
    event.target.value = '';
  };

  const handleFolderSelect = async (event) => {
    const files = Array.from(event.target.files);
    await processFiles(files);
    event.target.value = '';
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) await processFiles(files);
  };

  return (
    <div className="document-import">
      <div
        className={`drop-zone ${isDragging ? 'dragging' : ''} ${isProcessing ? 'processing' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isProcessing && fileInputRef.current?.click()}
      >
        {isProcessing ? (
          <div className="drop-zone-content">
            <div className="processing-spinner">⏳</div>
            <p>Traitement en cours...</p>
          </div>
        ) : (
          <div className="drop-zone-content">
            <div className="drop-icon">{isDragging ? '📂' : '📄'}</div>
            <p className="drop-title">{isDragging ? 'Déposez vos fichiers ici' : 'Glissez-déposez vos fichiers'}</p>
            <p className="drop-subtitle">ou cliquez pour sélectionner</p>
          </div>
        )}
      </div>
      <div className="import-buttons">
        <button className="import-btn files-btn" onClick={() => fileInputRef.current?.click()} disabled={isProcessing}>
          📄 Fichiers
        </button>
        <button className="import-btn folder-btn" onClick={() => {
          const input = document.createElement('input');
          input.type = 'file'; input.webkitdirectory = true; input.multiple = true;
          input.onchange = handleFolderSelect; input.click();
        }} disabled={isProcessing}>
          📁 Dossier
        </button>
      </div>
      <input ref={fileInputRef} type="file" multiple onChange={handleFileSelect} style={{ display: 'none' }}
        accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.mp4,.mp3,.zip,.rar" />
      <div className="import-info"><p>PDF, DOC, DOCX, TXT, Images, Vidéos, Audio, Archives</p></div>
    </div>
  );
};

export default DocumentImport;
