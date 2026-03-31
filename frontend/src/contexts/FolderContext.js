import React, { createContext, useContext } from 'react';
import { useFolderManager } from '../hooks/useFolderManager';

/**
 * Contexte centralisé pour la gestion des dossiers et documents
 * Permet à tous les composants d'accéder et de modifier les données sans prop drilling
 */

const FolderContext = createContext(null);

export const FolderProvider = ({ children }) => {
  const folderManager = useFolderManager();

  return (
    <FolderContext.Provider value={folderManager}>
      {children}
    </FolderContext.Provider>
  );
};

export const useFolders = () => {
  const context = useContext(FolderContext);
  if (!context) {
    throw new Error('useFolders doit être utilisé dans un FolderProvider');
  }
  return context;
};

export default FolderContext;
