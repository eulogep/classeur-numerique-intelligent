import React, { useState } from 'react';
import ModernModal from './ModernModal';
import ModernForm from './ModernForm';

const FolderCreationModal = ({ isOpen, onClose, onCreate, folders = {} }) => {
  const [formData, setFormData] = useState({
    name: '',
    parentFolder: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Effacer l'erreur quand l'utilisateur commence à taper
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom du dossier est requis';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Le nom doit contenir au moins 2 caractères';
    } else if (formData.name.length > 50) {
      newErrors.name = 'Le nom ne peut pas dépasser 50 caractères';
    }

    // Vérifier si le dossier existe déjà
    if (formData.parentFolder) {
      const parentFolders = folders[formData.parentFolder] || {};
      if (parentFolders[formData.name]) {
        newErrors.name = 'Un dossier avec ce nom existe déjà dans le dossier parent';
      }
    } else {
      if (folders[formData.name]) {
        newErrors.name = 'Un dossier avec ce nom existe déjà';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Simuler un délai d'API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await onCreate(formData);
      
      // Notification de succès
      if (window.showToast) {
        window.showToast('success', 'Dossier créé', `Le dossier "${formData.name}" a été créé avec succès`);
      }
      
      // Réinitialiser le formulaire
      setFormData({ name: '', parentFolder: '' });
      setErrors({});
      onClose();
      
    } catch (error) {
      if (window.showToast) {
        window.showToast('error', 'Erreur', 'Impossible de créer le dossier');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({ name: '', parentFolder: '' });
      setErrors({});
      onClose();
    }
  };

  // Préparer les options pour le select
  const folderOptions = [
    { value: '', label: 'Racine (aucun dossier parent)' },
    ...Object.keys(folders).map(folderName => ({
      value: folderName,
      label: folderName
    }))
  ];

  return (
    <ModernModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Créer un nouveau dossier"
      size="medium"
    >
      <ModernForm onSubmit={handleSubmit}>
        <ModernForm.Field
          label="Nom du dossier"
          required
          error={errors.name}
        >
          <ModernForm.Input
            type="text"
            placeholder="Entrez le nom du dossier..."
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            maxLength={50}
            autoFocus
          />
        </ModernForm.Field>

        <ModernForm.Field
          label="Dossier parent"
          error={errors.parentFolder}
        >
          <ModernForm.Select
            options={folderOptions}
            value={formData.parentFolder}
            onChange={(e) => handleInputChange('parentFolder', e.target.value)}
            placeholder="Sélectionner un dossier parent..."
          />
        </ModernForm.Field>

        <ModernForm.Group>
          <ModernForm.Button
            type="submit"
            variant="primary"
            loading={loading}
            disabled={!formData.name.trim()}
          >
            {loading ? 'Création...' : 'Créer le dossier'}
          </ModernForm.Button>
          
          <ModernForm.Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={loading}
          >
            Annuler
          </ModernForm.Button>
        </ModernForm.Group>
      </ModernForm>
    </ModernModal>
  );
};

export default FolderCreationModal; 