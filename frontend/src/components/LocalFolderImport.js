import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  LinearProgress,
  Alert,
  Chip,
  Grid,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  FolderOpen as FolderOpenIcon,
  CloudUpload as CloudUploadIcon,
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
  School as SchoolIcon,
  Business as BusinessIcon,
  Description as DescriptionIcon,
  Person as PersonIcon,
  Storage as StorageIcon,
  Category as CategoryIcon,
  FileCopy as FileCopyIcon,
  Image as ImageIcon,
  VideoFile as VideoIcon,
  AudioFile as AudioIcon,
  Archive as ArchiveIcon,
  Code as CodeIcon
} from '@mui/icons-material';

const LocalFolderImport = ({ onFolderAnalyzed }) => {
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showResults, setShowResults] = useState(false);

  // Vérifier si l'API File System Access est supportée
  const isFileSystemSupported = 'showDirectoryPicker' in window;

  const handleSelectFolder = async () => {
    if (!isFileSystemSupported) {
      setError('Votre navigateur ne supporte pas l\'accès aux fichiers locaux. Utilisez Chrome, Edge ou Firefox récent.');
      return;
    }

    try {
      setError('');
      const dirHandle = await window.showDirectoryPicker();
      setSelectedFolder(dirHandle);
    } catch (error) {
      if (error.name === 'AbortError') {
        // Utilisateur a annulé
        return;
      }
      setError('Erreur lors de la sélection du dossier: ' + error.message);
    }
  };

  const classifyFile = (fileName, filePath) => {
    const name = fileName.toLowerCase();
    const path = filePath.toLowerCase();
    
    // Classification par nom de fichier
    if (name.includes('facture') || name.includes('invoice') || name.includes('bill') || 
        name.includes('reçu') || name.includes('receipt') || path.includes('factures')) {
      return 'administratif';
    }
    
    if (name.includes('cours') || name.includes('course') || name.includes('td') || 
        name.includes('tp') || name.includes('exam') || name.includes('devoir') ||
        path.includes('scolaire') || path.includes('école') || path.includes('université')) {
      return 'scolaire';
    }
    
    if (name.includes('cv') || name.includes('resume') || name.includes('lettre') ||
        name.includes('contrat') || name.includes('travail') || name.includes('work') ||
        path.includes('travail') || path.includes('professionnel')) {
      return 'travail';
    }
    
    if (name.includes('photo') || name.includes('image') || name.includes('vidéo') ||
        name.includes('musique') || name.includes('personnel') || name.includes('famille')) {
      return 'personnel';
    }
    
    return 'autre';
  };

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return <ImageIcon />;
    if (type.startsWith('video/')) return <VideoIcon />;
    if (type.startsWith('audio/')) return <AudioIcon />;
    if (type.includes('zip') || type.includes('rar') || type.includes('tar')) return <ArchiveIcon />;
    if (type.includes('text') || type.includes('code')) return <CodeIcon />;
    return <FileCopyIcon />;
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'scolaire': return <SchoolIcon />;
      case 'administratif': return <DescriptionIcon />;
      case 'travail': return <BusinessIcon />;
      case 'personnel': return <PersonIcon />;
      default: return <CategoryIcon />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'scolaire': return 'primary';
      case 'administratif': return 'secondary';
      case 'travail': return 'success';
      case 'personnel': return 'warning';
      default: return 'default';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const analyzeFolderRecursively = async (dirHandle, path = '') => {
    const files = [];
    const folders = [];
    
    for await (const entry of dirHandle.values()) {
      const entryPath = path ? `${path}/${entry.name}` : entry.name;
      
      if (entry.kind === 'file') {
        try {
          const file = await entry.getFile();
          const category = classifyFile(entry.name, entryPath);
          
          files.push({
            id: `${entryPath}-${file.size}-${file.lastModified}`,
            name: entry.name,
            path: entryPath,
            size: file.size,
            type: file.type || 'application/octet-stream',
            lastModified: new Date(file.lastModified).toISOString(),
            category: category,
            tags: [category, file.type?.split('/')[0] || 'fichier']
          });
        } catch (error) {
          console.warn(`Impossible de lire le fichier ${entryPath}:`, error);
        }
      } else if (entry.kind === 'directory') {
        const category = classifyFile(entry.name, entryPath);
        folders.push({
          id: entryPath,
          name: entry.name,
          path: entryPath,
          category: category,
          children: []
        });
        
        // Analyser récursivement le sous-dossier
        const subResult = await analyzeFolderRecursively(entry, entryPath);
        files.push(...subResult.files);
        folders.push(...subResult.folders);
      }
    }
    
    return { files, folders };
  };

  const handleAnalyzeFolder = async () => {
    if (!selectedFolder) return;

    try {
      setAnalyzing(true);
      setProgress(0);
      setError('');

      // Simuler le progrès
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const result = await analyzeFolderRecursively(selectedFolder);
      
      clearInterval(progressInterval);
      setProgress(100);

      // Sauvegarder en localStorage
      const dataToSave = {
        folders: result.folders,
        documents: result.files,
        analyzedAt: new Date().toISOString(),
        folderName: selectedFolder.name
      };
      
      localStorage.setItem('localFolderData', JSON.stringify(dataToSave));
      
      setAnalysisResult(dataToSave);
      setShowResults(true);
      
      if (onFolderAnalyzed) {
        onFolderAnalyzed(dataToSave);
      }
    } catch (error) {
      setError('Erreur lors de l\'analyse: ' + error.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const loadPreviousAnalysis = () => {
    const saved = localStorage.getItem('localFolderData');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setAnalysisResult(data);
        setShowResults(true);
        if (onFolderAnalyzed) {
          onFolderAnalyzed(data);
        }
      } catch (error) {
        setError('Erreur lors du chargement des données précédentes');
      }
    }
  };

  // Si l'API n'est pas supportée
  if (!isFileSystemSupported) {
    return (
      <Box>
        <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 64,
                height: 64,
                borderRadius: '50%',
                bgcolor: 'warning.main',
                color: 'white',
                mb: 2
              }}
            >
              <StorageIcon sx={{ fontSize: 32 }} />
            </Box>
            <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">
              Navigateur Non Supporté
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Votre navigateur ne supporte pas l'accès aux fichiers locaux.
            </Typography>
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2">
                <strong>Pour utiliser cette fonctionnalité :</strong>
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                • Utilisez Chrome 86+, Edge 86+, ou Firefox 111+
              </Typography>
              <Typography variant="body2">
                • Activez les permissions de fichiers
              </Typography>
            </Alert>
          </Box>
        </Paper>
      </Box>
    );
  }

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
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              mb: 2,
              boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
              animation: 'float 3s ease-in-out infinite'
            }}
            className="animate-float"
          >
            <CloudUploadIcon sx={{ fontSize: 32 }} />
          </Box>
          <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">
            Import de Dossier Local
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Sélectionnez un dossier sur votre ordinateur pour l'analyser et l'organiser automatiquement
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mb: 3 }}>
          <Button
            variant="outlined"
            size="large"
            startIcon={<FolderOpenIcon />}
            onClick={handleSelectFolder}
            disabled={analyzing}
            sx={{ 
              mb: 2,
              borderRadius: '25px',
              border: '2px solid',
              borderColor: 'primary.main',
              background: 'rgba(102, 126, 234, 0.05)',
              backdropFilter: 'blur(10px)',
              '&:hover': {
                background: 'rgba(102, 126, 234, 0.1)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)'
              },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            className="hover-lift"
            fullWidth
          >
            {selectedFolder ? 'Changer de dossier' : 'Sélectionner un dossier'}
          </Button>

          {selectedFolder && (
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong>Dossier sélectionné :</strong> {selectedFolder.name}
              </Typography>
            </Alert>
          )}

          {selectedFolder && (
            <Button
              variant="contained"
              size="large"
              startIcon={<SearchIcon />}
              onClick={handleAnalyzeFolder}
              disabled={analyzing}
              sx={{
                borderRadius: '25px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 35px rgba(102, 126, 234, 0.4)'
                },
                '&:disabled': {
                  background: 'rgba(102, 126, 234, 0.3)',
                  transform: 'none'
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              className="hover-lift"
              fullWidth
            >
              {analyzing ? 'Analyse en cours...' : 'Analyser le dossier'}
            </Button>
          )}

          {/* Bouton pour charger l'analyse précédente */}
          <Button
            variant="text"
            size="small"
            onClick={loadPreviousAnalysis}
            sx={{ mt: 1 }}
            fullWidth
          >
            Charger l'analyse précédente
          </Button>
        </Box>

        {analyzing && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" gutterBottom>
              Analyse en cours... {progress}%
            </Typography>
            <LinearProgress variant="determinate" value={progress} />
          </Box>
        )}

        {analysisResult && (
          <Alert severity="success" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>Analyse terminée !</strong> {analysisResult.folders.length} dossiers et {analysisResult.documents.length} documents trouvés.
            </Typography>
            <Button
              size="small"
              onClick={() => setShowResults(true)}
              sx={{ mt: 1 }}
            >
              Voir les détails
            </Button>
          </Alert>
        )}
      </Paper>

      {/* Dialog des résultats */}
      <Dialog
        open={showResults}
        onClose={() => setShowResults(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircleIcon color="success" />
            Résultats de l'analyse
          </Box>
        </DialogTitle>
        <DialogContent>
          {analysisResult && (
            <Box>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="primary">
                        {analysisResult.folders.length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Dossiers analysés
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="secondary">
                        {analysisResult.documents.length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Documents trouvés
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Typography variant="h6" gutterBottom>
                Classification par catégorie
              </Typography>
              
              {Object.entries(
                analysisResult.documents.reduce((acc, doc) => {
                  acc[doc.category] = (acc[doc.category] || 0) + 1;
                  return acc;
                }, {})
              ).map(([category, count]) => (
                <Chip
                  key={category}
                  icon={getCategoryIcon(category)}
                  label={`${category} (${count})`}
                  color={getCategoryColor(category)}
                  sx={{ m: 0.5 }}
                />
              ))}

              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Documents récents
              </Typography>
              
              <List>
                {analysisResult.documents.slice(0, 10).map((doc, index) => (
                  <React.Fragment key={doc.id}>
                    <ListItem>
                      <ListItemIcon>
                        {getFileIcon(doc.type)}
                      </ListItemIcon>
                      <ListItemText
                        primary={doc.name}
                        secondary={`${formatFileSize(doc.size)} • ${doc.category} • ${doc.path}`}
                      />
                      <Chip
                        size="small"
                        icon={getCategoryIcon(doc.category)}
                        label={doc.category}
                        color={getCategoryColor(doc.category)}
                      />
                    </ListItem>
                    {index < 9 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowResults(false)}>
            Fermer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LocalFolderImport; 