import React, { useState, useCallback } from 'react';
import { useFolders } from '../contexts/FolderContext';

/**
 * Hook et composant pour gérer le Drag & Drop
 * Permet de déplacer les fichiers et dossiers entre les dossiers
 */

export const useDragDrop = () => {
  const { moveDocument, moveFolder, folders, documents } = useFolders();
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverFolderId, setDragOverFolderId] = useState(null);

  const startDrag = useCallback((itemType, itemId) => {
    setDraggedItem({ type: itemType, id: itemId });
  }, []);

  const endDrag = useCallback(() => {
    setDraggedItem(null);
    setDragOverFolderId(null);
  }, []);

  const handleDragOver = useCallback((folderId) => {
    setDragOverFolderId(folderId);
  }, []);

  const handleDrop = useCallback((targetFolderId) => {
    if (!draggedItem) return false;

    try {
      if (draggedItem.type === 'document') {
        // Vérifier que le document n'est pas déjà dans ce dossier
        const doc = documents.find(d => d.id === draggedItem.id);
        if (doc && doc.folderId === targetFolderId) {
          return false;
        }
        moveDocument(draggedItem.id, targetFolderId);
        return true;
      } else if (draggedItem.type === 'folder') {
        // Vérifier qu'on ne déplace pas un dossier dans l'un de ses enfants
        const targetFolder = folders.find(f => f.id === targetFolderId);
        if (targetFolder && targetFolder.parentId === draggedItem.id) {
          console.error('Impossible de déplacer un dossier dans l\'un de ses enfants');
          return false;
        }
        moveFolder(draggedItem.id, targetFolderId);
        return true;
      }
    } catch (error) {
      console.error('Erreur lors du drop:', error);
      return false;
    } finally {
      endDrag();
    }
  }, [draggedItem, documents, folders, moveDocument, moveFolder, endDrag]);

  return {
    draggedItem,
    dragOverFolderId,
    startDrag,
    endDrag,
    handleDragOver,
    handleDrop
  };
};

/**
 * Composant wrapper pour ajouter le support du Drag & Drop
 */
export const DragDropZone = ({ folderId, isDragOver, onDragOver, onDrop, children }) => {
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDragOver(folderId);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDrop(folderId);
  };

  return (
    <div
      className={`drag-drop-zone ${isDragOver ? 'drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {children}
    </div>
  );
};

/**
 * Composant pour les éléments draggables
 */
export const DraggableItem = ({ itemType, itemId, children, onDragStart, onDragEnd }) => {
  const handleDragStart = (e) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('itemType', itemType);
    e.dataTransfer.setData('itemId', itemId);
    onDragStart(itemType, itemId);
  };

  const handleDragEnd = (e) => {
    e.preventDefault();
    onDragEnd();
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className="draggable-item"
    >
      {children}
    </div>
  );
};

export default useDragDrop;
