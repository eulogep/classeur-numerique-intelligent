import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Paper,
  Alert,
  Skeleton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Badge,
  Tooltip
} from '@mui/material';
import {
  Search as SearchIcon,
  Folder as FolderIcon,
  Description as DescriptionIcon,
  Image as ImageIcon,
  VideoFile as VideoIcon,
  AudioFile as AudioIcon,
  Archive as ArchiveIcon,
  Code as CodeIcon,
  OpenInNew as OpenIcon,
  School as SchoolIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Category as CategoryIcon,
  Storage as StorageIcon,
  Refresh as RefreshIcon,
  Label as LabelIcon,
  Sort as SortIcon,
  FilterList as FilterIcon,
  ExpandMore as ExpandMoreIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon
} from '@mui/icons-material';

const LocalDocumentGallery = () => {
  const [documents, setDocuments] = useState([]);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showDocumentDialog, setShowDocumentDialog] = useState(false);
  const [error, setError] = useState('');
  
  // Nouvelles fonctionnalités
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showFavorites, setShowFavorites] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [editingDocument, setEditingDocument] = useState(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [sizeRange, setSizeRange] = useState({ min: '', max: '' });

  useEffect(() => {
    loadLocalData();
  }, []);

  const loadLocalData = () => {
    try {
      setLoading(true);
      const saved = localStorage.getItem('localFolderData');
      
      if (saved) {
        const data = JSON.parse(saved);
        setFolders(data.folders || []);
        setDocuments(data.documents || []);
      } else {
        setError('Aucune donnée locale trouvée. Importez d\'abord un dossier.');
      }
    } catch (error) {
      setError('Erreur lors du chargement des données locales: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const saveLocalData = (updatedDocuments) => {
    try {
      const saved = localStorage.getItem('localFolderData');
      if (saved) {
        const data = JSON.parse(saved);
        data.documents = updatedDocuments;
        localStorage.setItem('localFolderData', JSON.stringify(data));
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleSearch = () => {
    // La recherche se fait automatiquement via le filtrage
  };

  const handleOpenDocument = async (document) => {
    try {
      console.log('Ouverture du fichier:', document.path);
      alert(`Ouverture de ${document.name} - Fonctionnalité en développement`);
    } catch (error) {
      setError('Erreur lors de l\'ouverture du fichier: ' + error.message);
    }
  };

  const toggleFavorite = (documentId) => {
    const updatedDocs = documents.map(doc => 
      doc.id === documentId 
        ? { ...doc, favorite: !doc.favorite }
        : doc
    );
    setDocuments(updatedDocs);
    saveLocalData(updatedDocs);
  };

  const toggleBookmark = (documentId) => {
    const updatedDocs = documents.map(doc => 
      doc.id === documentId 
        ? { ...doc, bookmarked: !doc.bookmarked }
        : doc
    );
    setDocuments(updatedDocs);
    saveLocalData(updatedDocs);
  };

  const updateDocumentTags = (documentId, newTags) => {
    const updatedDocs = documents.map(doc => 
      doc.id === documentId 
        ? { ...doc, tags: newTags }
        : doc
    );
    setDocuments(updatedDocs);
    saveLocalData(updatedDocs);
  };

  const updateDocumentNotes = (documentId, notes) => {
    const updatedDocs = documents.map(doc => 
      doc.id === documentId 
        ? { ...doc, notes }
        : doc
    );
    setDocuments(updatedDocs);
    saveLocalData(updatedDocs);
  };

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return <ImageIcon />;
    if (type.startsWith('video/')) return <VideoIcon />;
    if (type.startsWith('audio/')) return <AudioIcon />;
    if (type.includes('zip') || type.includes('rar') || type.includes('tar')) return <ArchiveIcon />;
    if (type.includes('text') || type.includes('code')) return <CodeIcon />;
    return <DescriptionIcon />;
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const sortDocuments = (docs) => {
    return [...docs].sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'size':
          aValue = a.size || 0;
          bValue = b.size || 0;
          break;
        case 'date':
          aValue = new Date(a.lastModified || 0);
          bValue = new Date(b.lastModified || 0);
          break;
        case 'type':
          aValue = a.type.toLowerCase();
          bValue = b.type.toLowerCase();
          break;
        case 'category':
          aValue = a.category.toLowerCase();
          bValue = b.category.toLowerCase();
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  };

  const filteredDocuments = sortDocuments(documents.filter(doc => {
    const matchSearch = searchQuery === '' || 
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.tags && doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))) ||
      (doc.notes && doc.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    
    const matchFavorites = !showFavorites || doc.favorite;
    const matchBookmarks = !showBookmarks || doc.bookmarked;
    
    const matchTags = selectedTags.length === 0 || 
      (doc.tags && selectedTags.every(tag => doc.tags.includes(tag)));
    
    const matchDateRange = !dateRange.start && !dateRange.end || 
      (doc.lastModified && 
       (!dateRange.start || new Date(doc.lastModified) >= new Date(dateRange.start)) &&
       (!dateRange.end || new Date(doc.lastModified) <= new Date(dateRange.end)));
    
    const matchSizeRange = !sizeRange.min && !sizeRange.max ||
      (doc.size &&
       (!sizeRange.min || doc.size >= parseInt(sizeRange.min)) &&
       (!sizeRange.max || doc.size <= parseInt(sizeRange.max)));
    
    return matchSearch && matchCategory && matchFavorites && matchBookmarks && 
           matchTags && matchDateRange && matchSizeRange;
  }));

  const categories = [
    { value: 'all', label: 'Tous', icon: <FolderIcon /> },
    { value: 'scolaire', label: 'Scolaire', icon: <SchoolIcon /> },
    { value: 'administratif', label: 'Administratif', icon: <DescriptionIcon /> },
    { value: 'travail', label: 'Travail', icon: <BusinessIcon /> },
    { value: 'personnel', label: 'Personnel', icon: <PersonIcon /> },
    { value: 'autre', label: 'Autre', icon: <CategoryIcon /> }
  ];

  const sortOptions = [
    { value: 'name', label: 'Nom' },
    { value: 'size', label: 'Taille' },
    { value: 'date', label: 'Date' },
    { value: 'type', label: 'Type' },
    { value: 'category', label: 'Catégorie' }
  ];

  const allTags = Array.from(new Set(documents.flatMap(doc => doc.tags || [])));

  if (loading) {
    return (
      <Box>
        <Grid container spacing={2}>
          {[...Array(8)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Skeleton variant="rectangular" height={200} />
              <Skeleton variant="text" sx={{ mt: 1 }} />
              <Skeleton variant="text" width="60%" />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  if (documents.length === 0) {
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
                bgcolor: 'info.main',
                color: 'white',
                mb: 2
              }}
            >
              <StorageIcon sx={{ fontSize: 32 }} />
            </Box>
            <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">
              Aucun Document Local
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Importez d'abord un dossier pour voir vos documents ici.
            </Typography>
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2">
                <strong>Pour commencer :</strong>
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                1. Utilisez la section "Import de Dossier Local"
              </Typography>
              <Typography variant="body2">
                2. Sélectionnez un dossier sur votre ordinateur
              </Typography>
              <Typography variant="body2">
                3. Laissez l'application analyser et classer vos fichiers
              </Typography>
            </Alert>
          </Box>
        </Paper>
      </Box>
    );
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Header avec statistiques */}
      <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight="bold">
            Documents Locaux ({filteredDocuments.length} sur {documents.length})
          </Typography>
          <Button
            startIcon={<RefreshIcon />}
            onClick={loadLocalData}
            size="small"
          >
            Actualiser
          </Button>
        </Box>
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {documents.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Documents
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color="secondary">
                {folders.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Dossiers
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">
                {formatFileSize(documents.reduce((acc, doc) => acc + (doc.size || 0), 0))}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Taille totale
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main">
                {new Set(documents.map(doc => doc.type)).size}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Types de fichiers
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Paper>

      {/* Barre de recherche et filtres */}
      <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Rechercher des fichiers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Trier par</InputLabel>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                label="Trier par"
              >
                {sortOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Ordre</InputLabel>
              <Select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                label="Ordre"
              >
                <MenuItem value="asc">Croissant</MenuItem>
                <MenuItem value="desc">Décroissant</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={2}>
            <Button
              variant="outlined"
              startIcon={<FilterIcon />}
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              fullWidth
            >
              Filtres
            </Button>
          </Grid>
        </Grid>

        {/* Filtres avancés */}
        {showAdvancedFilters && (
          <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(0,0,0,0.12)' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={showFavorites}
                      onChange={(e) => setShowFavorites(e.target.checked)}
                    />
                  }
                  label="Favoris seulement"
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={showBookmarks}
                      onChange={(e) => setShowBookmarks(e.target.checked)}
                    />
                  }
                  label="Marqués seulement"
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  type="date"
                  label="Date début"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  type="date"
                  label="Date fin"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  multiple
                  options={allTags}
                  value={selectedTags}
                  onChange={(e, newValue) => setSelectedTags(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Filtrer par tags"
                      size="small"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  label="Taille min (MB)"
                  value={sizeRange.min}
                  onChange={(e) => setSizeRange(prev => ({ ...prev, min: e.target.value }))}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  label="Taille max (MB)"
                  value={sizeRange.max}
                  onChange={(e) => setSizeRange(prev => ({ ...prev, max: e.target.value }))}
                />
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>

      {/* Filtres par catégorie */}
      <Paper elevation={1} sx={{ mb: 3 }}>
        <Tabs
          value={selectedCategory}
          onChange={(e, newValue) => setSelectedCategory(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          {categories.map((category) => (
            <Tab
              key={category.value}
              value={category.value}
              label={category.label}
              icon={category.icon}
              iconPosition="start"
            />
          ))}
        </Tabs>
      </Paper>

      {/* Galerie de documents */}
      <Grid container spacing={2}>
        {filteredDocuments.map((document, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={document.id || index}>
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
                setSelectedDocument(document);
                setShowDocumentDialog(true);
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  {getFileIcon(document.type)}
                  <Typography variant="body2" fontWeight="bold" sx={{ ml: 1 }}>
                    {document.name}
                  </Typography>
                </Box>
                
                <Typography variant="caption" color="text.secondary" display="block">
                  {formatFileSize(document.size || 0)}
                </Typography>
                
                <Typography variant="caption" color="text.secondary" display="block">
                  {document.type}
                </Typography>
                
                <Box sx={{ mt: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                  <Chip
                    size="small"
                    icon={getCategoryIcon(document.category)}
                    label={document.category}
                    color={getCategoryColor(document.category)}
                  />
                  {document.favorite && (
                    <Chip
                      size="small"
                      icon={<StarIcon />}
                      label="Favori"
                      color="warning"
                    />
                  )}
                  {document.bookmarked && (
                    <Chip
                      size="small"
                      icon={<BookmarkIcon />}
                      label="Marqué"
                      color="info"
                    />
                  )}
                </Box>
                
                {document.tags && document.tags.length > 0 && (
                  <Box sx={{ mt: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {document.tags.slice(0, 2).map((tag, tagIndex) => (
                      <Chip
                        key={tagIndex}
                        size="small"
                        label={tag}
                        variant="outlined"
                      />
                    ))}
                    {document.tags.length > 2 && (
                      <Chip
                        size="small"
                        label={`+${document.tags.length - 2}`}
                        variant="outlined"
                      />
                    )}
                  </Box>
                )}
                
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                  {document.path}
                </Typography>
                
                {document.lastModified && (
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                    Modifié le {formatDate(document.lastModified)}
                  </Typography>
                )}
              </CardContent>
              
              <CardActions>
                <Tooltip title="Favori">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(document.id);
                    }}
                  >
                    {document.favorite ? <StarIcon color="warning" /> : <StarBorderIcon />}
                  </IconButton>
                </Tooltip>
                <Tooltip title="Marquer">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleBookmark(document.id);
                    }}
                  >
                    {document.bookmarked ? <BookmarkIcon color="info" /> : <BookmarkBorderIcon />}
                  </IconButton>
                </Tooltip>
                <Tooltip title="Éditer">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingDocument(document);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Ouvrir">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenDocument(document);
                    }}
                  >
                    <OpenIcon />
                  </IconButton>
                </Tooltip>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredDocuments.length === 0 && !loading && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            Aucun document trouvé
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchQuery ? 'Essayez de modifier votre recherche' : 'Importez un dossier pour commencer'}
          </Typography>
        </Box>
      )}

      {/* Dialog de détails du document */}
      <Dialog
        open={showDocumentDialog}
        onClose={() => setShowDocumentDialog(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedDocument && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {getFileIcon(selectedDocument.type)}
                {selectedDocument.name}
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Taille
                  </Typography>
                  <Typography variant="body1">
                    {formatFileSize(selectedDocument.size || 0)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Type
                  </Typography>
                  <Typography variant="body1">
                    {selectedDocument.type}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Catégorie
                  </Typography>
                  <Chip
                    size="small"
                    icon={getCategoryIcon(selectedDocument.category)}
                    label={selectedDocument.category}
                    color={getCategoryColor(selectedDocument.category)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Chemin
                  </Typography>
                  <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>
                    {selectedDocument.path}
                  </Typography>
                </Grid>
                {selectedDocument.lastModified && (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Dernière modification
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(selectedDocument.lastModified)}
                    </Typography>
                  </Grid>
                )}
                {selectedDocument.tags && selectedDocument.tags.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Tags
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      {selectedDocument.tags.map((tag, index) => (
                        <Chip
                          key={index}
                          size="small"
                          label={tag}
                          sx={{ mr: 0.5, mb: 0.5 }}
                        />
                      ))}
                    </Box>
                  </Grid>
                )}
                {selectedDocument.notes && (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Notes
                    </Typography>
                    <Typography variant="body1">
                      {selectedDocument.notes}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowDocumentDialog(false)}>
                Fermer
              </Button>
              <Button
                variant="contained"
                startIcon={<OpenIcon />}
                onClick={() => {
                  handleOpenDocument(selectedDocument);
                  setShowDocumentDialog(false);
                }}
              >
                Ouvrir
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Dialog d'édition */}
      <Dialog
        open={!!editingDocument}
        onClose={() => setEditingDocument(null)}
        maxWidth="sm"
        fullWidth
      >
        {editingDocument && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EditIcon />
                Éditer {editingDocument.name}
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <Autocomplete
                    multiple
                    freeSolo
                    options={allTags}
                    value={editingDocument.tags || []}
                    onChange={(e, newValue) => {
                      setEditingDocument(prev => ({ ...prev, tags: newValue }));
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Tags"
                        placeholder="Ajouter un tag..."
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Notes"
                    value={editingDocument.notes || ''}
                    onChange={(e) => {
                      setEditingDocument(prev => ({ ...prev, notes: e.target.value }));
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={editingDocument.favorite || false}
                        onChange={(e) => {
                          setEditingDocument(prev => ({ ...prev, favorite: e.target.checked }));
                        }}
                      />
                    }
                    label="Favori"
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={editingDocument.bookmarked || false}
                        onChange={(e) => {
                          setEditingDocument(prev => ({ ...prev, bookmarked: e.target.checked }));
                        }}
                      />
                    }
                    label="Marqué"
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setEditingDocument(null)}>
                Annuler
              </Button>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={() => {
                  updateDocumentTags(editingDocument.id, editingDocument.tags || []);
                  updateDocumentNotes(editingDocument.id, editingDocument.notes || '');
                  if (editingDocument.favorite !== (documents.find(d => d.id === editingDocument.id)?.favorite || false)) {
                    toggleFavorite(editingDocument.id);
                  }
                  if (editingDocument.bookmarked !== (documents.find(d => d.id === editingDocument.id)?.bookmarked || false)) {
                    toggleBookmark(editingDocument.id);
                  }
                  setEditingDocument(null);
                }}
              >
                Sauvegarder
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default LocalDocumentGallery; 