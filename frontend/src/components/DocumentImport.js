import React, { useRef } from 'react';
import './DocumentImport.css';

const DocumentImport = ({ onImport, folderPath }) => {
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      onImport(folderPath, files);
      // Réinitialiser l'input
      event.target.value = '';
    }
  };

  const handleFolderSelect = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      onImport(folderPath, files);
      // Réinitialiser l'input
      event.target.value = '';
    }
  };

  return (
    <div className="document-import">
      <div className="import-buttons">
        <button 
          className="import-btn files-btn"
          onClick={() => fileInputRef.current?.click()}
        >
          📄 Importer des fichiers
        </button>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          style={{ display: 'none' }}
          accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.mp4,.mp3,.zip,.rar"
        />
        
        <button 
          className="import-btn folder-btn"
          onClick={() => {
            // Pour les dossiers, on utilise aussi l'input file avec webkitdirectory
            const input = document.createElement('input');
            input.type = 'file';
            input.webkitdirectory = true;
            input.multiple = true;
            input.onchange = handleFolderSelect;
            input.click();
          }}
        >
          📁 Importer un dossier
        </button>
      </div>
      
      <div className="import-info">
        <p>Formats supportés : PDF, DOC, DOCX, TXT, Images, Vidéos, Audio, Archives</p>
      </div>
    </div>
  );
};

export default DocumentImport;
