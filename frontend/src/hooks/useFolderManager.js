import { useState, useCallback, useEffect } from 'react';

/**
 * Hook personnalisé pour la gestion centralisée des dossiers et documents
 * Structure améliorée : support de profondeur illimitée avec IDs uniques
 */

const STORAGE_KEYS = {
  FOLDERS: 'classeurFolders_v2',
  DOCUMENTS: 'classeurDocuments_v2',
  FOLDER_TREE: 'classeurFolderTree_v2'
};

// Structure améliorée pour les dossiers
const createFolder = (name, parentId = null) => ({
  id: `folder_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  name,
  parentId,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  color: null,
  icon: '📁'
});

// Obtenir le chemin complet d'un dossier (pour affichage)
const getFolderPath = (folderId, folders) => {
  if (!folderId) return 'Racine';
  
  const path = [];
  let currentId = folderId;
  
  while (currentId) {
    const folder = folders.find(f => f.id === currentId);
    if (!folder) break;
    path.unshift(folder.name);
    currentId = folder.parentId;
  }
  
  return path.join(' > ');
};

// Obtenir tous les enfants d'un dossier (récursif)
const getChildrenIds = (folderId, folders) => {
  const children = [];
  const stack = [folderId];
  
  while (stack.length > 0) {
    const current = stack.pop();
    const directChildren = folders.filter(f => f.parentId === current);
    
    directChildren.forEach(child => {
      children.push(child.id);
      stack.push(child.id);
    });
  }
  
  return children;
};

export const useFolderManager = () => {
  const [folders, setFolders] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Charger les données depuis le localStorage
  useEffect(() => {
    const loadData = () => {
      try {
        const savedFolders = localStorage.getItem(STORAGE_KEYS.FOLDERS);
        const savedDocuments = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
        
        if (savedFolders) {
          setFolders(JSON.parse(savedFolders));
        } else {
          // Initialiser avec un dossier racine par défaut
          setFolders([]);
        }
        
        if (savedDocuments) {
          setDocuments(JSON.parse(savedDocuments));
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        setFolders([]);
        setDocuments([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Sauvegarder les dossiers dans le localStorage
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEYS.FOLDERS, JSON.stringify(folders));
    }
  }, [folders, isLoading]);

  // Sauvegarder les documents dans le localStorage
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(documents));
      } catch (e) {
        console.warn('Quota de stockage dépassé, documents non sauvegardés');
      }
    }
  }, [documents, isLoading]);

  // ─── OPÉRATIONS SUR LES DOSSIERS ───

  const addFolder = useCallback((name, parentId = null) => {
    const newFolder = createFolder(name, parentId);
    setFolders(prev => [...prev, newFolder]);
    return newFolder;
  }, []);

  const renameFolder = useCallback((folderId, newName) => {
    setFolders(prev =>
      prev.map(folder =>
        folder.id === folderId
          ? { ...folder, name: newName, updatedAt: new Date().toISOString() }
          : folder
      )
    );
  }, []);

  const deleteFolder = useCallback((folderId) => {
    // Obtenir tous les enfants du dossier
    const childrenToDelete = getChildrenIds(folderId, folders);
    const allToDelete = [folderId, ...childrenToDelete];

    // Supprimer les dossiers
    setFolders(prev => prev.filter(f => !allToDelete.includes(f.id)));

    // Supprimer les documents dans ces dossiers
    setDocuments(prev =>
      prev.filter(doc => !allToDelete.includes(doc.folderId))
    );
  }, [folders]);

  const moveFolder = useCallback((folderId, newParentId) => {
    // Vérifier qu'on ne déplace pas un dossier dans l'un de ses enfants
    const childrenIds = getChildrenIds(folderId, folders);
    if (childrenIds.includes(newParentId)) {
      console.error('Impossible de déplacer un dossier dans l\'un de ses enfants');
      return false;
    }

    setFolders(prev =>
      prev.map(folder =>
        folder.id === folderId
          ? { ...folder, parentId: newParentId, updatedAt: new Date().toISOString() }
          : folder
      )
    );
    return true;
  }, [folders]);

  const setFolderColor = useCallback((folderId, color) => {
    setFolders(prev =>
      prev.map(folder =>
        folder.id === folderId
          ? { ...folder, color }
          : folder
      )
    );
  }, []);

  // ─── OPÉRATIONS SUR LES DOCUMENTS ───

  const addDocuments = useCallback((newDocuments, folderId = null) => {
    const docsWithFolder = newDocuments.map(doc => ({
      ...doc,
      id: doc.id || `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      folderId: folderId || doc.folderId || null,
      addedAt: new Date().toISOString()
    }));

    setDocuments(prev => [...prev, ...docsWithFolder]);
    return docsWithFolder;
  }, []);

  const deleteDocument = useCallback((documentId) => {
    setDocuments(prev => prev.filter(doc => doc.id !== documentId));
  }, []);

  const moveDocument = useCallback((documentId, newFolderId) => {
    setDocuments(prev =>
      prev.map(doc =>
        doc.id === documentId
          ? { ...doc, folderId: newFolderId }
          : doc
      )
    );
  }, []);

  const updateDocument = useCallback((documentId, updates) => {
    setDocuments(prev =>
      prev.map(doc =>
        doc.id === documentId
          ? { ...doc, ...updates, updatedAt: new Date().toISOString() }
          : doc
      )
    );
  }, []);

  // ─── REQUÊTES / LECTURES ───

  const getFolderById = useCallback((folderId) => {
    return folders.find(f => f.id === folderId) || null;
  }, [folders]);

  const getFoldersByParent = useCallback((parentId = null) => {
    return folders.filter(f => f.parentId === parentId);
  }, [folders]);

  const getDocumentsByFolder = useCallback((folderId = null) => {
    return documents.filter(doc => doc.folderId === folderId);
  }, [documents]);

  const getDocumentById = useCallback((documentId) => {
    return documents.find(doc => doc.id === documentId) || null;
  }, [documents]);

  const getFolderHierarchy = useCallback((parentId = null) => {
    const children = getFoldersByParent(parentId);
    return children.map(folder => ({
      ...folder,
      children: getFolderHierarchy(folder.id),
      documentCount: getDocumentsByFolder(folder.id).length
    }));
  }, [getFoldersByParent, getDocumentsByFolder]);

  const searchDocuments = useCallback((query) => {
    const lowerQuery = query.toLowerCase();
    return documents.filter(doc =>
      doc.name.toLowerCase().includes(lowerQuery) ||
      (doc.path && doc.path.toLowerCase().includes(lowerQuery))
    );
  }, [documents]);

  const getStatistics = useCallback(() => {
    const totalFolders = folders.length;
    const totalDocuments = documents.length;
    const totalSize = documents.reduce((sum, doc) => sum + (doc.size || 0), 0);

    const typeDistribution = documents.reduce((acc, doc) => {
      const type = doc.type?.split('/')[0] || 'document';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    const folderDistribution = documents.reduce((acc, doc) => {
      const folderPath = doc.folderId ? getFolderPath(doc.folderId, folders) : 'Racine';
      acc[folderPath] = (acc[folderPath] || 0) + 1;
      return acc;
    }, {});

    return {
      totalFolders,
      totalDocuments,
      totalSize,
      typeDistribution,
      folderDistribution
    };
  }, [folders, documents]);

  // ─── MIGRATION DES DONNÉES ANCIENNES ───

  const migrateFromOldFormat = useCallback(() => {
    try {
      const oldFolders = localStorage.getItem('classeurFolders');
      const oldDocuments = localStorage.getItem('classeurDocuments');

      if (!oldFolders || !oldDocuments) return;

      // Convertir l'ancien format en nouveau format
      const oldFoldersObj = JSON.parse(oldFolders);
      const oldDocumentsArray = JSON.parse(oldDocuments);

      const newFolders = [];
      const newDocuments = [];

      // Fonction récursive pour convertir les dossiers
      const convertFolders = (obj, parentId = null) => {
        Object.entries(obj).forEach(([name, subFolders]) => {
          const newFolder = createFolder(name, parentId);
          newFolders.push(newFolder);

          if (typeof subFolders === 'object' && subFolders !== null) {
            convertFolders(subFolders, newFolder.id);
          }
        });
      };

      convertFolders(oldFoldersObj);

      // Convertir les documents
      oldDocumentsArray.forEach(doc => {
        const folderPath = doc.path;
        let folderId = null;

        if (folderPath) {
          const pathParts = folderPath.split(' > ');
          let currentFolder = null;

          for (const part of pathParts) {
            currentFolder = newFolders.find(
              f => f.name === part && f.parentId === (currentFolder?.id || null)
            );
            if (!currentFolder) break;
          }

          folderId = currentFolder?.id || null;
        }

        newDocuments.push({
          ...doc,
          id: doc.id || `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          folderId
        });
      });

      setFolders(newFolders);
      setDocuments(newDocuments);

      console.log('Migration réussie:', { newFolders, newDocuments });
    } catch (error) {
      console.error('Erreur lors de la migration:', error);
    }
  }, []);

  return {
    // État
    folders,
    documents,
    isLoading,

    // Opérations sur les dossiers
    addFolder,
    renameFolder,
    deleteFolder,
    moveFolder,
    setFolderColor,

    // Opérations sur les documents
    addDocuments,
    deleteDocument,
    moveDocument,
    updateDocument,

    // Requêtes
    getFolderById,
    getFoldersByParent,
    getDocumentsByFolder,
    getDocumentById,
    getFolderHierarchy,
    getFolderPath,
    searchDocuments,
    getStatistics,

    // Utilitaires
    migrateFromOldFormat
  };
};

export default useFolderManager;
