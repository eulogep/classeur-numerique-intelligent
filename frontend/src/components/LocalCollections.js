import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Fab,
  Tooltip,
  Alert,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Collections as CollectionsIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Folder as FolderIcon,
  Description as DescriptionIcon,
  Image as ImageIcon,
  VideoFile as VideoIcon,
  AudioFile as AudioIcon,
  Archive as ArchiveIcon,
  Code as CodeIcon,
  Star as StarIcon,
  Bookmark as BookmarkIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Share as ShareIcon,
  Download as DownloadIcon,
  Upload as UploadIcon
} from '@mui/icons-material';

const LocalCollections = ({ documents }) => {
  const [collections, setCollections] = useState([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingCollection, setEditingCollection] = useState(null);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [showCollectionDetails, setShowCollectionDetails] = useState(false);
  
  // État pour la création/édition
  const [newCollection, setNewCollection] = useState({
    name: '',
    description: '',
    color: '#1976d2',
    isPublic: false,
    autoAdd: false,
    autoAddRules: {
      categories: [],
      tags: [],
      types: [],
      minSize: '',
      maxSize: '',
      dateFrom: '',
      dateTo: ''
    }
  });

  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = () => {
    try {
      const saved = localStorage.getItem('localCollections');
      if (saved) {
        setCollections(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des collections:', error);
    }
  };

  const saveCollections = (updatedCollections) => {
    try {
      localStorage.setItem('localCollections', JSON.stringify(updatedCollections));
      setCollections(updatedCollections);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des collections:', error);
    }
  };

  const handleCreateCollection = () => {
    const collection = {
      id: Date.now().toString(),
      ...newCollection,
      createdAt: new Date().toISOString(),
      documents: [],
      documentCount: 0
    };
    
    const updatedCollections = [...collections, collection];
    saveCollections(updatedCollections);
    
    // Réinitialiser le formulaire
    setNewCollection({
      name: '',
      description: '',
      color: '#1976d2',
      isPublic: false,
      autoAdd: false,
      autoAddRules: {
        categories: [],
        tags: [],
        types: [],
        minSize: '',
        maxSize: '',
        dateFrom: '',
        dateTo: ''
      }
    });
    
    setShowCreateDialog(false);
  };

  const handleEditCollection = () => {
    if (!editingCollection) return;
    
    const updatedCollections = collections.map(col => 
      col.id === editingCollection.id ? { ...col, ...editingCollection } : col
    );
    saveCollections(updatedCollections);
    
    setEditingCollection(null);
    setShowEditDialog(false);
  };

  const handleDeleteCollection = (collectionId) => {
    const updatedCollections = collections.filter(col => col.id !== collectionId);
    saveCollections(updatedCollections);
  };

  const addDocumentToCollection = (collectionId, documentId) => {
    const updatedCollections = collections.map(col => {
      if (col.id === collectionId && !col.documents.includes(documentId)) {
        return {
          ...col,
          documents: [...col.documents, documentId],
          documentCount: col.documents.length + 1
        };
      }
      return col;
    });
    saveCollections(updatedCollections);
  };

  const removeDocumentFromCollection = (collectionId, documentId) => {
    const updatedCollections = collections.map(col => {
      if (col.id === collectionId) {
        return {
          ...col,
          documents: col.documents.filter(id => id !== documentId),
          documentCount: col.documents.length - 1
        };
      }
      return col;
    });
    saveCollections(updatedCollections);
  };

  const getDocumentsInCollection = (collection) => {
    return documents.filter(doc => collection.documents.includes(doc.id));
  };

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return <ImageIcon />;
    if (type.startsWith('video/')) return <VideoIcon />;
    if (type.startsWith('audio/')) return <AudioIcon />;
    if (type.includes('zip') || type.includes('rar') || type.includes('tar')) return <ArchiveIcon />;
    if (type.includes('text') || type.includes('code')) return <CodeIcon />;
    return <DescriptionIcon />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const allCategories = Array.from(new Set(documents.map(doc => doc.category)));
  const allTags = Array.from(new Set(documents.flatMap(doc => doc.tags || [])));
  const allTypes = Array.from(new Set(documents.map(doc => doc.type)));

  return (
    <Box>
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CollectionsIcon sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
            <Typography variant="h5" component="h2" fontWeight="bold">
              Collections Personnalisées
            </Typography>
          </Box>
          <Tooltip title="Créer une nouvelle collection">
            <Fab
              color="primary"
              size="medium"
              onClick={() => setShowCreateDialog(true)}
            >
              <AddIcon />
            </Fab>
          </Tooltip>
        </Box>

        {collections.length === 0 ? (
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body1" gutterBottom>
              <strong>Aucune collection créée</strong>
            </Typography>
            <Typography variant="body2">
              Créez votre première collection pour organiser vos documents de manière personnalisée.
            </Typography>
          </Alert>
        ) : (
          <Grid container spacing={3}>
            {collections.map((collection) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={collection.id}>
                <Card 
                  elevation={2}
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    '&:hover': {
                      elevation: 4,
                      transform: 'translateY(-2px)',
                      transition: 'all 0.2s'
                    }
                  }}
                  onClick={() => {
                    setSelectedCollection(collection);
                    setShowCollectionDetails(true);
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          bgcolor: collection.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          mr: 2
                        }}
                      >
                        <CollectionsIcon />
                      </Box>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" fontWeight="bold">
                          {collection.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {collection.documentCount} documents
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {collection.description}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {collection.isPublic && (
                        <Chip
                          size="small"
                          label="Public"
                          color="success"
                          variant="outlined"
                        />
                      )}
                      {collection.autoAdd && (
                        <Chip
                          size="small"
                          label="Auto-ajout"
                          color="info"
                          variant="outlined"
                        />
                      )}
                    </Box>
                    
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 2 }}>
                      Créée le {formatDate(collection.createdAt)}
                    </Typography>
                  </CardContent>
                  
                  <CardActions>
                    <Tooltip title="Éditer">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingCollection(collection);
                          setShowEditDialog(true);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Supprimer">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCollection(collection.id);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>

      {/* Dialog de création */}
      <Dialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AddIcon sx={{ mr: 1 }} />
            Créer une nouvelle collection
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nom de la collection"
                value={newCollection.name}
                onChange={(e) => setNewCollection(prev => ({ ...prev, name: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={newCollection.description}
                onChange={(e) => setNewCollection(prev => ({ ...prev, description: e.target.value }))}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="color"
                label="Couleur"
                value={newCollection.color}
                onChange={(e) => setNewCollection(prev => ({ ...prev, color: e.target.value }))}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={newCollection.isPublic}
                    onChange={(e) => setNewCollection(prev => ({ ...prev, isPublic: e.target.checked }))}
                  />
                }
                label="Collection publique"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={newCollection.autoAdd}
                    onChange={(e) => setNewCollection(prev => ({ ...prev, autoAdd: e.target.checked }))}
                  />
                }
                label="Ajout automatique de documents"
              />
            </Grid>
            
            {newCollection.autoAdd && (
              <>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Règles d'ajout automatique
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Autocomplete
                    multiple
                    options={allCategories}
                    value={newCollection.autoAddRules.categories}
                    onChange={(e, newValue) => setNewCollection(prev => ({
                      ...prev,
                      autoAddRules: { ...prev.autoAddRules, categories: newValue }
                    }))}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Catégories"
                        placeholder="Sélectionner des catégories..."
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Autocomplete
                    multiple
                    options={allTags}
                    value={newCollection.autoAddRules.tags}
                    onChange={(e, newValue) => setNewCollection(prev => ({
                      ...prev,
                      autoAddRules: { ...prev.autoAddRules, tags: newValue }
                    }))}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Tags"
                        placeholder="Sélectionner des tags..."
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Autocomplete
                    multiple
                    options={allTypes}
                    value={newCollection.autoAddRules.types}
                    onChange={(e, newValue) => setNewCollection(prev => ({
                      ...prev,
                      autoAddRules: { ...prev.autoAddRules, types: newValue }
                    }))}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Types de fichiers"
                        placeholder="Sélectionner des types..."
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Taille min (MB)"
                    value={newCollection.autoAddRules.minSize}
                    onChange={(e) => setNewCollection(prev => ({
                      ...prev,
                      autoAddRules: { ...prev.autoAddRules, minSize: e.target.value }
                    }))}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Taille max (MB)"
                    value={newCollection.autoAddRules.maxSize}
                    onChange={(e) => setNewCollection(prev => ({
                      ...prev,
                      autoAddRules: { ...prev.autoAddRules, maxSize: e.target.value }
                    }))}
                  />
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCreateDialog(false)}>
            Annuler
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleCreateCollection}
            disabled={!newCollection.name.trim()}
          >
            Créer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog d'édition */}
      <Dialog
        open={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        maxWidth="md"
        fullWidth
      >
        {editingCollection && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <EditIcon sx={{ mr: 1 }} />
                Éditer la collection
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Nom de la collection"
                    value={editingCollection.name}
                    onChange={(e) => setEditingCollection(prev => ({ ...prev, name: e.target.value }))}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Description"
                    value={editingCollection.description}
                    onChange={(e) => setEditingCollection(prev => ({ ...prev, description: e.target.value }))}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    type="color"
                    label="Couleur"
                    value={editingCollection.color}
                    onChange={(e) => setEditingCollection(prev => ({ ...prev, color: e.target.value }))}
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={editingCollection.isPublic}
                        onChange={(e) => setEditingCollection(prev => ({ ...prev, isPublic: e.target.checked }))}
                      />
                    }
                    label="Collection publique"
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowEditDialog(false)}>
                Annuler
              </Button>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleEditCollection}
                disabled={!editingCollection.name.trim()}
              >
                Sauvegarder
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Dialog de détails de collection */}
      <Dialog
        open={showCollectionDetails}
        onClose={() => setShowCollectionDetails(false)}
        maxWidth="lg"
        fullWidth
      >
        {selectedCollection && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    bgcolor: selectedCollection.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    mr: 2
                  }}
                >
                  <CollectionsIcon />
                </Box>
                <Typography variant="h6">
                  {selectedCollection.name}
                </Typography>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {selectedCollection.description}
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Documents dans la collection ({selectedCollection.documentCount})
                </Typography>
                
                {selectedCollection.documentCount === 0 ? (
                  <Alert severity="info">
                    Aucun document dans cette collection. Ajoutez des documents pour commencer.
                  </Alert>
                ) : (
                  <List>
                    {getDocumentsInCollection(selectedCollection).map((doc, index) => (
                      <React.Fragment key={doc.id}>
                        <ListItem>
                          <ListItemIcon>
                            {getFileIcon(doc.type)}
                          </ListItemIcon>
                          <ListItemText
                            primary={doc.name}
                            secondary={`${formatFileSize(doc.size || 0)} • ${doc.type} • ${formatDate(doc.lastModified)}`}
                          />
                          <ListItemSecondaryAction>
                            <IconButton
                              edge="end"
                              onClick={() => removeDocumentFromCollection(selectedCollection.id, doc.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                        {index < selectedCollection.documentCount - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                )}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowCollectionDetails(false)}>
                Fermer
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default LocalCollections; 