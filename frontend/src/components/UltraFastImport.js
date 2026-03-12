import React, { useState, useRef, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Autocomplete,
  Alert,
  Divider,
  Tooltip,
  Badge,
  Avatar,
  FormControlLabel,
  Switch
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  DragIndicator as DragIcon,
  Folder as FolderIcon,
  InsertDriveFile as FileIcon,
  Image as ImageIcon,
  VideoFile as VideoIcon,
  AudioFile as AudioIcon,
  Archive as ArchiveIcon,
  Code as CodeIcon,
  Description as DocumentIcon,
  School as SchoolIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Category as CategoryIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  AutoAwesome as AutoAwesomeIcon,
  Speed as SpeedIcon,
  Storage as StorageIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  FolderOpen as FolderOpenIcon
} from '@mui/icons-material';

const UltraFastImport = ({ onImportComplete, documents = [] }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [importingFiles, setImportingFiles] = useState([]);
  const [importProgress, setImportProgress] = useState({});
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [importSettings, setImportSettings] = useState({
    autoClassify: true,
    defaultCategory: 'autre',
    createSubfolders: true,
    preserveStructure: true,
    duplicateCheck: true
  });
  const [importStats, setImportStats] = useState({
    total: 0,
    processed: 0,
    success: 0,
    failed: 0,
    duplicates: 0
  });

  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);

  // Gestion du glisser-déposer
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFilesSelected(files);
  }, []);

  // Gestion de la sélection de fichiers
  const handleFilesSelected = (files) => {
    const validFiles = files.filter(file => {
      // Vérifier la taille (max 100MB par fichier)
      if (file.size > 100 * 1024 * 1024) {
        console.warn(`Fichier trop volumineux: ${file.name}`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setSelectedFiles(validFiles);
    setShowImportDialog(true);
  };

  // Classification automatique intelligente
  const classifyFile = (file) => {
    const name = file.name.toLowerCase();
    const path = file.webkitRelativePath || '';
    
    // Classification par nom de fichier
    if (name.includes('cours') || name.includes('td') || name.includes('tp') || 
        name.includes('examen') || name.includes('devoir') || name.includes('projet') ||
        path.includes('scolaire') || path.includes('école') || path.includes('université')) {
      return 'scolaire';
    }
    
    if (name.includes('facture') || name.includes('reçu') || name.includes('contrat') ||
        name.includes('administratif') || name.includes('papier') || name.includes('officiel')) {
      return 'administratif';
    }
    
    if (name.includes('travail') || name.includes('projet') || name.includes('client') ||
        name.includes('entreprise') || name.includes('business')) {
      return 'travail';
    }
    
    if (name.includes('personnel') || name.includes('privé') || name.includes('famille')) {
      return 'personnel';
    }
    
    // Classification par type de fichier
    const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'];
    const videoTypes = ['mp4', 'avi', 'mov', 'wmv', 'flv'];
    const audioTypes = ['mp3', 'wav', 'flac', 'aac'];
    const archiveTypes = ['zip', 'rar', '7z', 'tar', 'gz'];
    const codeTypes = ['js', 'py', 'java', 'cpp', 'html', 'css', 'php'];
    
    const extension = name.split('.').pop();
    
    if (imageTypes.includes(extension)) return 'médias';
    if (videoTypes.includes(extension)) return 'médias';
    if (audioTypes.includes(extension)) return 'médias';
    if (archiveTypes.includes(extension)) return 'archives';
    if (codeTypes.includes(extension)) return 'développement';
    
    return 'autre';
  };

  // Vérification des doublons
  const checkDuplicates = (file) => {
    return documents.some(doc => 
      doc.name === file.name && doc.size === file.size
    );
  };

  // Simulation d'import
  const simulateImport = async (files) => {
    setImportStats({
      total: files.length,
      processed: 0,
      success: 0,
      failed: 0,
      duplicates: 0
    });

    const results = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const progress = ((i + 1) / files.length) * 100;
      
      setImportProgress(prev => ({
        ...prev,
        [file.name]: progress
      }));

      // Simuler le traitement
      await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));

      const isDuplicate = importSettings.duplicateCheck && checkDuplicates(file);
      const category = importSettings.autoClassify ? classifyFile(file) : importSettings.defaultCategory;

      const result = {
        id: Date.now() + i,
        name: file.name,
        size: file.size,
        type: file.type,
        category: category,
        path: file.webkitRelativePath || file.name,
        isDuplicate: isDuplicate,
        status: isDuplicate ? 'duplicate' : 'success',
        importedAt: new Date().toISOString()
      };

      results.push(result);

      setImportStats(prev => ({
        ...prev,
        processed: i + 1,
        success: prev.success + (isDuplicate ? 0 : 1),
        failed: prev.failed + (result.status === 'failed' ? 1 : 0),
        duplicates: prev.duplicates + (isDuplicate ? 1 : 0)
      }));
    }

    return results;
  };

  // Démarrage de l'import
  const startImport = async () => {
    if (selectedFiles.length === 0) return;

    setImportingFiles(selectedFiles);
    setShowImportDialog(false);

    try {
      const results = await simulateImport(selectedFiles);
      
      // Filtrer les fichiers non-dupliqués
      const successfulImports = results.filter(r => !r.isDuplicate);
      
      if (onImportComplete) {
        onImportComplete(successfulImports);
      }

      // Réinitialiser
      setTimeout(() => {
        setImportingFiles([]);
        setImportProgress({});
        setSelectedFiles([]);
        setImportStats({
          total: 0,
          processed: 0,
          success: 0,
          failed: 0,
          duplicates: 0
        });
      }, 2000);

    } catch (error) {
      console.error('Erreur lors de l\'import:', error);
    }
  };

  // Gestionnaire de clic sur la zone de drop
  const handleDropZoneClick = () => {
    fileInputRef.current?.click();
  };

  // Gestionnaire de changement de fichier input
  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files || []);
    handleFilesSelected(files);
  };

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return <ImageIcon />;
    if (type.startsWith('video/')) return <VideoIcon />;
    if (type.startsWith('audio/')) return <AudioIcon />;
    if (type.includes('zip') || type.includes('rar')) return <ArchiveIcon />;
    if (type.includes('text') || type.includes('code')) return <CodeIcon />;
    return <FileIcon />;
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'scolaire': return <SchoolIcon />;
      case 'travail': return <BusinessIcon />;
      case 'personnel': return <PersonIcon />;
      case 'administratif': return <DocumentIcon />;
      default: return <CategoryIcon />;
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'scolaire': return 'primary';
      case 'travail': return 'success';
      case 'personnel': return 'warning';
      case 'administratif': return 'secondary';
      case 'médias': return 'info';
      case 'archives': return 'default';
      case 'développement': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Paper
        elevation={2}
        sx={{
          p: 3,
          borderRadius: 2,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}
        className="animate-fade-in-up"
      >
        {/* En-tête */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)'
              }}
            >
              <SpeedIcon />
            </Box>
            <Box>
              <Typography variant="h5" component="h2" fontWeight="bold">
                Import Ultra-Rapide
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Glissez-déposez vos fichiers pour un import intelligent et rapide
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Actualiser">
              <IconButton>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Ouvrir dossier">
              <IconButton>
                <FolderOpenIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Zone de glisser-déposer */}
        <Box
          ref={dropZoneRef}
          onClick={handleDropZoneClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          sx={{
            border: 3,
            borderStyle: 'dashed',
            borderColor: isDragOver ? 'primary.main' : 'divider',
            borderRadius: 3,
            p: 6,
            textAlign: 'center',
            cursor: 'pointer',
            background: isDragOver ? 'rgba(102, 126, 234, 0.05)' : 'transparent',
            transition: 'all 0.3s ease',
            '&:hover': {
              borderColor: 'primary.main',
              background: 'rgba(102, 126, 234, 0.02)',
              transform: 'scale(1.02)'
            }
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            style={{ display: 'none' }}
            onChange={handleFileInputChange}
          />
          
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: isDragOver 
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : 'rgba(102, 126, 234, 0.1)',
                color: isDragOver ? 'white' : 'primary.main',
                transition: 'all 0.3s ease'
              }}
            >
              {isDragOver ? <UploadIcon sx={{ fontSize: 40 }} /> : <DragIcon sx={{ fontSize: 40 }} />}
            </Box>
            
            <Box>
              <Typography variant="h6" gutterBottom>
                {isDragOver ? 'Déposez vos fichiers ici' : 'Glissez-déposez vos fichiers'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ou cliquez pour sélectionner des fichiers
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Chip label="PDF, DOC, Images" size="small" />
              <Chip label="Vidéos, Audio" size="small" />
              <Chip label="Archives, Code" size="small" />
              <Chip label="Max 100MB par fichier" size="small" />
            </Box>
          </Box>
        </Box>

        {/* Statistiques d'import */}
        {importingFiles.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Import en cours...
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6} sm={3}>
                <Card sx={{ textAlign: 'center', borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="h4" color="primary">
                      {importStats.total}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card sx={{ textAlign: 'center', borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="h4" color="success.main">
                      {importStats.success}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Importés
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card sx={{ textAlign: 'center', borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="h4" color="warning.main">
                      {importStats.duplicates}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Doublons
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card sx={{ textAlign: 'center', borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="h4" color="error">
                      {importStats.failed}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Échecs
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Progression globale */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">
                  Progression globale
                </Typography>
                <Typography variant="body2">
                  {importStats.total > 0 ? Math.round((importStats.processed / importStats.total) * 100) : 0}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={importStats.total > 0 ? (importStats.processed / importStats.total) * 100 : 0}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  background: 'rgba(0, 0, 0, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: 4
                  }
                }}
              />
            </Box>

            {/* Liste des fichiers en cours d'import */}
            <List>
              {importingFiles.map((file, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    {getFileIcon(file.type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={file.name}
                    secondary={`${formatFileSize(file.size)} • ${classifyFile(file)}`}
                  />
                  <ListItemSecondaryAction>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={importProgress[file.name] || 0}
                        sx={{ width: 100, height: 4 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {Math.round(importProgress[file.name] || 0)}%
                      </Typography>
                    </Box>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {/* Conseils d'import */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Conseils pour un import optimal
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <AutoAwesomeIcon color="primary" />
                    <Typography variant="subtitle2">Classification automatique</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    L'IA analyse les noms et types de fichiers pour les classer automatiquement
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <StorageIcon color="primary" />
                    <Typography variant="subtitle2">Détection des doublons</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Évite les fichiers en double en comparant nom et taille
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <SpeedIcon color="primary" />
                    <Typography variant="subtitle2">Import ultra-rapide</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Traitement parallèle pour des imports en masse rapides
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <FolderIcon color="primary" />
                    <Typography variant="subtitle2">Préservation de la structure</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Maintient l'organisation des dossiers et sous-dossiers
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Dialog de configuration d'import */}
      <Dialog
        open={showImportDialog}
        onClose={() => setShowImportDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}
        >
          Configuration de l'Import
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Fichiers sélectionnés ({selectedFiles.length})
              </Typography>
              <List dense>
                {selectedFiles.slice(0, 5).map((file, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      {getFileIcon(file.type)}
                    </ListItemIcon>
                    <ListItemText
                      primary={file.name}
                      secondary={`${formatFileSize(file.size)} • ${classifyFile(file)}`}
                    />
                  </ListItem>
                ))}
                {selectedFiles.length > 5 && (
                  <ListItem>
                    <ListItemText
                      primary={`... et ${selectedFiles.length - 5} autres fichiers`}
                      color="text.secondary"
                    />
                  </ListItem>
                )}
              </List>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Options d'import
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Catégorie par défaut</InputLabel>
                <Select
                  value={importSettings.defaultCategory}
                  onChange={(e) => setImportSettings(prev => ({
                    ...prev,
                    defaultCategory: e.target.value
                  }))}
                  label="Catégorie par défaut"
                >
                  <MenuItem value="autre">Autre</MenuItem>
                  <MenuItem value="scolaire">Scolaire</MenuItem>
                  <MenuItem value="travail">Travail</MenuItem>
                  <MenuItem value="personnel">Personnel</MenuItem>
                  <MenuItem value="administratif">Administratif</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Action pour les doublons</InputLabel>
                <Select
                  value={importSettings.duplicateCheck ? 'skip' : 'import'}
                  onChange={(e) => setImportSettings(prev => ({
                    ...prev,
                    duplicateCheck: e.target.value === 'skip'
                  }))}
                  label="Action pour les doublons"
                >
                  <MenuItem value="skip">Ignorer les doublons</MenuItem>
                  <MenuItem value="import">Importer quand même</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <FormControlLabel
                  control={
                    <input
                      type="checkbox"
                      checked={importSettings.autoClassify}
                      onChange={(e) => setImportSettings(prev => ({
                        ...prev,
                        autoClassify: e.target.checked
                      }))}
                    />
                  }
                  label="Classification automatique"
                />
                <FormControlLabel
                  control={
                    <input
                      type="checkbox"
                      checked={importSettings.createSubfolders}
                      onChange={(e) => setImportSettings(prev => ({
                        ...prev,
                        createSubfolders: e.target.checked
                      }))}
                    />
                  }
                  label="Créer des sous-dossiers"
                />
                <FormControlLabel
                  control={
                    <input
                      type="checkbox"
                      checked={importSettings.preserveStructure}
                      onChange={(e) => setImportSettings(prev => ({
                        ...prev,
                        preserveStructure: e.target.checked
                      }))}
                    />
                  }
                  label="Préserver la structure"
                />
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setShowImportDialog(false)}>
            Annuler
          </Button>
          <Button
            variant="contained"
            onClick={startImport}
            startIcon={<UploadIcon />}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
              }
            }}
          >
            Démarrer l'import
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UltraFastImport; 