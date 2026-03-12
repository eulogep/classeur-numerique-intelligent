import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Alert,
  Grid,
  Paper,
  Divider,
  Tooltip,
  Fab,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  Tabs,
  Tab,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Modal,
  Zoom,
  Fade,
  CircularProgress,
  Badge,
  Avatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Photo,
  VideoLibrary,
  Screenshot,
  Draw,
  Add,
  Edit,
  Delete,
  ExpandMore,
  Search,
  FilterList,
  ViewModule,
  ViewList,
  Fullscreen,
  FullscreenExit,
  ZoomIn,
  ZoomOut,
  RotateLeft,
  RotateRight,
  Download,
  Share,
  Favorite,
  FavoriteBorder,
  Star,
  StarBorder,
  Tag,
  Category,
  CalendarToday,
  AccessTime,
  LocationOn,
  School,
  Work,
  Home,
  Public,
  Private,
  CloudUpload,
  CloudDownload,
  Sync,
  Refresh,
  Settings,
  Slideshow,
  PlayArrow,
  Pause,
  Stop,
  SkipNext,
  SkipPrevious,
  VolumeUp,
  VolumeOff,
  Subtitles,
  HighQuality,
  LowQuality,
  Crop,
  Adjust,
  Brightness6,
  Contrast,
  Palette,
  AutoAwesome,
  AutoFixHigh,
  AutoFixNormal,
  AutoFixOff,
  BlurOn,
  BlurOff,
  CenterFocusStrong,
  CenterFocusWeak,
  ControlCamera,
  CropFree,
  CropLandscape,
  CropPortrait,
  CropSquare,
  Crop169,
  Crop32,
  Crop54,
  Crop75,
  CropDin,
  CropOriginal,
  Filter,
  Filter1,
  Filter2,
  Filter3,
  Filter4,
  Filter5,
  Filter6,
  Filter7,
  Filter8,
  Filter9,
  Filter9Plus,
  FilterBAndW,
  FilterCenterFocus,
  FilterDrama,
  FilterFrames,
  FilterHdr,
  FilterNone,
  FilterTiltShift,
  FilterVintage,
  Grain,
  GridOff,
  GridOn,
  HdrOff,
  HdrOn,
  HdrStrong,
  HdrWeak,
  Healing,
  Image,
  ImageAspectRatio,
  ImageNotSupported,
  ImageSearch,
  Iso,
  Landscape,
  LeakAdd,
  LeakRemove,
  Lens,
  LinkedCamera,
  Looks,
  Looks3,
  Looks4,
  Looks5,
  Looks6,
  LooksOne,
  LooksTwo,
  Loupe,
  MonochromePhotos,
  MovieCreation,
  MovieFilter,
  MusicNote,
  Nature,
  NaturePeople,
  NavigateBefore,
  NavigateNext,
  Palette as PaletteIcon,
  Panorama,
  PanoramaFishEye,
  PanoramaHorizontal,
  PanoramaVertical,
  PanoramaWideAngle,
  PhotoAlbum,
  PhotoCamera,
  PhotoFilter,
  PhotoLibrary,
  PhotoSizeSelectActual,
  PhotoSizeSelectLarge,
  PhotoSizeSelectSmall,
  PictureAsPdf,
  Portrait,
  ReceiptLong,
  RemoveRedEye,
  Rotate90DegreesCcw,
  RotateLeft as RotateLeftIcon,
  RotateRight as RotateRightIcon,
  ShutterSpeed,
  Slideshow as SlideshowIcon,
  Straighten,
  Style,
  SwitchCamera,
  SwitchVideo,
  Texture,
  Timelapse,
  Timer,
  Timer10,
  Timer3,
  TimerOff,
  Tonality,
  Transform,
  Tune,
  ViewComfy,
  ViewCompact,
  Vignette,
  WbAuto,
  WbCloudy,
  WbIncandescent,
  WbIridescent,
  WbSunny,
} from '@mui/icons-material';

const VisualMediaGallery = () => {
  const [mediaItems, setMediaItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showViewer, setShowViewer] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [viewMode, setViewMode] = useState('grid'); // grid, list, masonry
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [slideshowActive, setSlideshowActive] = useState(false);
  const [slideshowIndex, setSlideshowIndex] = useState(0);
  const [newItem, setNewItem] = useState({
    name: '',
    type: 'photo', // photo, video, screenshot, diagram
    category: '',
    description: '',
    tags: [],
    location: '',
    date: '',
    school: '',
    subject: '',
    favorite: false,
    starred: false,
    private: false,
    url: '',
    thumbnail: '',
    metadata: {},
  });

  // Charger les données depuis localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('visualMediaGallery');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        setMediaItems(data.items || []);
      } catch (error) {
        console.error('Erreur lors du chargement de la galerie:', error);
      }
    }
  }, []);

  // Sauvegarder les données
  const saveData = () => {
    const data = { items: mediaItems, lastModified: new Date().toISOString() };
    localStorage.setItem('visualMediaGallery', JSON.stringify(data));
  };

  // Types de médias
  const mediaTypes = [
    { value: 'photo', label: 'Photo', icon: <Photo />, color: '#2196f3' },
    { value: 'video', label: 'Vidéo', icon: <VideoLibrary />, color: '#f44336' },
    { value: 'screenshot', label: 'Capture d\'écran', icon: <Screenshot />, color: '#4caf50' },
    { value: 'diagram', label: 'Schéma', icon: <Draw />, color: '#ff9800' },
  ];

  // Catégories
  const categories = [
    { value: 'school', label: 'Scolaire', icon: <School /> },
    { value: 'work', label: 'Travail', icon: <Work /> },
    { value: 'personal', label: 'Personnel', icon: <Home /> },
    { value: 'public', label: 'Public', icon: <Public /> },
    { value: 'private', label: 'Privé', icon: <Private /> },
  ];

  // Options de tri
  const sortOptions = [
    { value: 'date', label: 'Date' },
    { value: 'name', label: 'Nom' },
    { value: 'type', label: 'Type' },
    { value: 'category', label: 'Catégorie' },
    { value: 'size', label: 'Taille' },
  ];

  // Filtrer et trier les éléments
  const filteredAndSortedItems = useMemo(() => {
    let items = mediaItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesType = selectedType === 'all' || item.type === selectedType;
      const matchesFavorites = !favoritesOnly || item.favorite;

      return matchesSearch && matchesCategory && matchesType && matchesFavorites;
    });

    // Trier
    items.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.date || a.createdAt);
          bValue = new Date(b.date || b.createdAt);
          break;
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'type':
          aValue = a.type;
          bValue = b.type;
          break;
        case 'category':
          aValue = a.category;
          bValue = b.category;
          break;
        case 'size':
          aValue = a.metadata?.size || 0;
          bValue = b.metadata?.size || 0;
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

    return items;
  }, [mediaItems, searchTerm, selectedCategory, selectedType, favoritesOnly, sortBy, sortOrder]);

  // Ajouter un nouvel élément
  const addItem = () => {
    if (!newItem.name.trim() || !newItem.url) return;

    const item = {
      id: Date.now().toString(),
      ...newItem,
      createdAt: new Date().toISOString(),
      metadata: {
        ...newItem.metadata,
        addedAt: new Date().toISOString(),
      },
    };

    setMediaItems(prev => [...prev, item]);
    setNewItem({
      name: '',
      type: 'photo',
      category: '',
      description: '',
      tags: [],
      location: '',
      date: '',
      school: '',
      subject: '',
      favorite: false,
      starred: false,
      private: false,
      url: '',
      thumbnail: '',
      metadata: {},
    });
    setShowAddDialog(false);
    saveData();
  };

  // Supprimer un élément
  const removeItem = (itemId) => {
    setMediaItems(prev => prev.filter(item => item.id !== itemId));
    saveData();
  };

  // Basculer le statut favori
  const toggleFavorite = (itemId) => {
    setMediaItems(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, favorite: !item.favorite } : item
      )
    );
    saveData();
  };

  // Basculer le statut étoilé
  const toggleStarred = (itemId) => {
    setMediaItems(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, starred: !item.starred } : item
      )
    );
    saveData();
  };

  // Obtenir l'icône d'un type de média
  const getMediaTypeIcon = (type) => {
    const mediaType = mediaTypes.find(t => t.value === type);
    return mediaType ? mediaType.icon : <Photo />;
  };

  // Obtenir la couleur d'un type de média
  const getMediaTypeColor = (type) => {
    const mediaType = mediaTypes.find(t => t.value === type);
    return mediaType ? mediaType.color : '#666666';
  };

  // Obtenir l'icône d'une catégorie
  const getCategoryIcon = (category) => {
    const cat = categories.find(c => c.value === category);
    return cat ? cat.icon : <Category />;
  };

  // Slideshow
  useEffect(() => {
    if (!slideshowActive || filteredAndSortedItems.length === 0) return;

    const interval = setInterval(() => {
      setSlideshowIndex(prev => (prev + 1) % filteredAndSortedItems.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [slideshowActive, filteredAndSortedItems]);

  // Statistiques
  const statistics = useMemo(() => {
    const totalItems = mediaItems.length;
    const photos = mediaItems.filter(item => item.type === 'photo').length;
    const videos = mediaItems.filter(item => item.type === 'video').length;
    const screenshots = mediaItems.filter(item => item.type === 'screenshot').length;
    const diagrams = mediaItems.filter(item => item.type === 'diagram').length;
    const favorites = mediaItems.filter(item => item.favorite).length;
    const starred = mediaItems.filter(item => item.starred).length;

    return {
      totalItems,
      photos,
      videos,
      screenshots,
      diagrams,
      favorites,
      starred,
    };
  }, [mediaItems]);

  return (
    <Box sx={{ p: 3, maxWidth: 1400, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        <PhotoLibrary sx={{ mr: 2, verticalAlign: 'middle' }} />
        Galerie Visuelle
      </Typography>

      {/* Statistiques */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={2}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary">
                {statistics.totalItems}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={2}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary">
                {statistics.photos}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Photos
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={2}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="error">
                {statistics.videos}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Vidéos
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={2}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="success.main">
                {statistics.screenshots}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Captures
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={2}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="warning.main">
                {statistics.favorites}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Favoris
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={2}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="secondary">
                {statistics.starred}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Étoilés
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filtres et contrôles */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              size="small"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Type</InputLabel>
              <Select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                label="Type"
              >
                <MenuItem value="all">Tous les types</MenuItem>
                {mediaTypes.map(type => (
                  <MenuItem key={type.value} value={type.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {type.icon}
                      <Typography sx={{ ml: 1 }}>{type.label}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Catégorie</InputLabel>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                label="Catégorie"
              >
                <MenuItem value="all">Toutes les catégories</MenuItem>
                {categories.map(category => (
                  <MenuItem key={category.value} value={category.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {category.icon}
                      <Typography sx={{ ml: 1 }}>{category.label}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
          <Grid item xs={12} md={1}>
            <Button
              fullWidth
              variant={sortOrder === 'asc' ? 'contained' : 'outlined'}
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </Button>
          </Grid>
          <Grid item xs={12} md={1}>
            <FormControlLabel
              control={
                <Switch
                  checked={favoritesOnly}
                  onChange={(e) => setFavoritesOnly(e.target.checked)}
                />
              }
              label="Favoris"
            />
          </Grid>
          <Grid item xs={12} md={1}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<Add />}
              onClick={() => setShowAddDialog(true)}
            >
              Ajouter
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Onglets */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Galerie" />
          <Tab label="Slideshow" />
          <Tab label="Favoris" />
        </Tabs>
      </Paper>

      {/* Contenu des onglets */}
      {activeTab === 0 && (
        <>
          {/* Contrôles de vue */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {filteredAndSortedItems.length} éléments trouvés
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant={viewMode === 'grid' ? 'contained' : 'outlined'}
                size="small"
                onClick={() => setViewMode('grid')}
                startIcon={<ViewModule />}
              >
                Grille
              </Button>
              <Button
                variant={viewMode === 'list' ? 'contained' : 'outlined'}
                size="small"
                onClick={() => setViewMode('list')}
                startIcon={<ViewList />}
              >
                Liste
              </Button>
            </Box>
          </Box>

          {/* Grille des médias */}
          {filteredAndSortedItems.length === 0 ? (
            <Alert severity="info">
              Aucun média trouvé. Ajoutez votre premier média pour commencer.
            </Alert>
          ) : viewMode === 'grid' ? (
            <ImageList cols={4} gap={16}>
              {filteredAndSortedItems.map(item => (
                <ImageListItem key={item.id} sx={{ cursor: 'pointer' }}>
                  <img
                    src={item.thumbnail || item.url}
                    alt={item.name}
                    loading="lazy"
                    onClick={() => {
                      setSelectedItem(item);
                      setShowViewer(true);
                    }}
                    style={{ 
                      height: 200, 
                      objectFit: 'cover',
                      borderRadius: 8,
                    }}
                  />
                  <ImageListItemBar
                    title={item.name}
                    subtitle={item.description}
                    actionIcon={
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(item.id);
                          }}
                          sx={{ color: 'white' }}
                        >
                          {item.favorite ? <Favorite /> : <FavoriteBorder />}
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleStarred(item.id);
                          }}
                          sx={{ color: 'white' }}
                        >
                          {item.starred ? <Star /> : <StarBorder />}
                        </IconButton>
                      </Box>
                    }
                  />
                </ImageListItem>
              ))}
            </ImageList>
          ) : (
            <List>
              {filteredAndSortedItems.map(item => (
                <ListItem key={item.id} divider>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: getMediaTypeColor(item.type) }}>
                      {getMediaTypeIcon(item.type)}
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={item.name}
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {item.description}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                          <Chip
                            label={mediaTypes.find(t => t.value === item.type)?.label}
                            size="small"
                            icon={getMediaTypeIcon(item.type)}
                          />
                          {item.category && (
                            <Chip
                              label={categories.find(c => c.value === item.category)?.label}
                              size="small"
                              variant="outlined"
                            />
                          )}
                          {item.favorite && <Chip label="Favori" size="small" color="warning" />}
                          {item.starred && <Chip label="Étoilé" size="small" color="secondary" />}
                        </Box>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        onClick={() => toggleFavorite(item.id)}
                        color={item.favorite ? 'warning' : 'default'}
                      >
                        {item.favorite ? <Favorite /> : <FavoriteBorder />}
                      </IconButton>
                      <IconButton
                        onClick={() => toggleStarred(item.id)}
                        color={item.starred ? 'secondary' : 'default'}
                      >
                        {item.starred ? <Star /> : <StarBorder />}
                      </IconButton>
                      <IconButton
                        onClick={() => {
                          setSelectedItem(item);
                          setShowViewer(true);
                        }}
                      >
                        <Fullscreen />
                      </IconButton>
                      <IconButton
                        onClick={() => removeItem(item.id)}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </>
      )}

      {activeTab === 1 && (
        <Box sx={{ textAlign: 'center' }}>
          {filteredAndSortedItems.length === 0 ? (
            <Alert severity="info">
              Aucun média disponible pour le slideshow.
            </Alert>
          ) : (
            <>
              <Card sx={{ maxWidth: 800, mx: 'auto', mb: 3 }}>
                <CardMedia
                  component="img"
                  height="400"
                  image={filteredAndSortedItems[slideshowIndex]?.url}
                  alt={filteredAndSortedItems[slideshowIndex]?.name}
                  sx={{ objectFit: 'contain' }}
                />
                <CardContent>
                  <Typography variant="h6">
                    {filteredAndSortedItems[slideshowIndex]?.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {filteredAndSortedItems[slideshowIndex]?.description}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {slideshowIndex + 1} / {filteredAndSortedItems.length}
                  </Typography>
                </CardContent>
              </Card>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={slideshowActive ? <Pause /> : <PlayArrow />}
                  onClick={() => setSlideshowActive(!slideshowActive)}
                >
                  {slideshowActive ? 'Pause' : 'Démarrer'}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<SkipPrevious />}
                  onClick={() => setSlideshowIndex(prev => 
                    prev === 0 ? filteredAndSortedItems.length - 1 : prev - 1
                  )}
                >
                  Précédent
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<SkipNext />}
                  onClick={() => setSlideshowIndex(prev => 
                    (prev + 1) % filteredAndSortedItems.length
                  )}
                >
                  Suivant
                </Button>
              </Box>
            </>
          )}
        </Box>
      )}

      {activeTab === 2 && (
        <Grid container spacing={3}>
          {mediaItems.filter(item => item.favorite || item.starred).length === 0 ? (
            <Grid item xs={12}>
              <Alert severity="info">
                Aucun favori ou élément étoilé. Marquez des éléments comme favoris pour les voir ici.
              </Alert>
            </Grid>
          ) : (
            mediaItems
              .filter(item => item.favorite || item.starred)
              .map(item => (
                <Grid item xs={12} md={6} lg={4} key={item.id}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="200"
                      image={item.thumbnail || item.url}
                      alt={item.name}
                      sx={{ cursor: 'pointer' }}
                      onClick={() => {
                        setSelectedItem(item);
                        setShowViewer(true);
                      }}
                    />
                    <CardContent>
                      <Typography variant="h6" noWrap>
                        {item.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {item.description}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {item.favorite && <Chip label="Favori" size="small" color="warning" />}
                        {item.starred && <Chip label="Étoilé" size="small" color="secondary" />}
                        <Chip
                          label={mediaTypes.find(t => t.value === item.type)?.label}
                          size="small"
                          icon={getMediaTypeIcon(item.type)}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))
          )}
        </Grid>
      )}

      {/* Dialog d'ajout */}
      <Dialog open={showAddDialog} onClose={() => setShowAddDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Ajouter un média</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nom du média"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={newItem.type}
                  onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
                  label="Type"
                >
                  {mediaTypes.map(type => (
                    <MenuItem key={type.value} value={type.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {type.icon}
                        <Typography sx={{ ml: 1 }}>{type.label}</Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Catégorie</InputLabel>
                <Select
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  label="Catégorie"
                >
                  {categories.map(category => (
                    <MenuItem key={category.value} value={category.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {category.icon}
                        <Typography sx={{ ml: 1 }}>{category.label}</Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="URL du média"
                value={newItem.url}
                onChange={(e) => setNewItem({ ...newItem, url: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="URL de la miniature (optionnel)"
                value={newItem.thumbnail}
                onChange={(e) => setNewItem({ ...newItem, thumbnail: e.target.value })}
                placeholder="https://example.com/thumbnail.jpg"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="École"
                value={newItem.school}
                onChange={(e) => setNewItem({ ...newItem, school: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Matière"
                value={newItem.subject}
                onChange={(e) => setNewItem({ ...newItem, subject: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Localisation"
                value={newItem.location}
                onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                label="Date"
                value={newItem.date}
                onChange={(e) => setNewItem({ ...newItem, date: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tags (séparés par des virgules)"
                value={newItem.tags.join(', ')}
                onChange={(e) => setNewItem({ 
                  ...newItem, 
                  tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                })}
                placeholder="important, projet, examen..."
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={newItem.favorite}
                      onChange={(e) => setNewItem({ ...newItem, favorite: e.target.checked })}
                    />
                  }
                  label="Favori"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={newItem.starred}
                      onChange={(e) => setNewItem({ ...newItem, starred: e.target.checked })}
                    />
                  }
                  label="Étoilé"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={newItem.private}
                      onChange={(e) => setNewItem({ ...newItem, private: e.target.checked })}
                    />
                  }
                  label="Privé"
                />
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddDialog(false)}>Annuler</Button>
          <Button
            onClick={addItem}
            variant="contained"
            disabled={!newItem.name.trim() || !newItem.url}
          >
            Ajouter
          </Button>
        </DialogActions>
      </Dialog>

      {/* Visionneuse de média */}
      <Modal
        open={showViewer}
        onClose={() => setShowViewer(false)}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Box sx={{ 
          maxWidth: '90vw', 
          maxHeight: '90vh', 
          bgcolor: 'background.paper', 
          borderRadius: 2,
          p: 2,
          position: 'relative'
        }}>
          {selectedItem && (
            <>
              <img
                src={selectedItem.url}
                alt={selectedItem.name}
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '70vh', 
                  objectFit: 'contain',
                  borderRadius: 8,
                }}
              />
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6">{selectedItem.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedItem.description}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                  <Chip
                    label={mediaTypes.find(t => t.value === selectedItem.type)?.label}
                    size="small"
                    icon={getMediaTypeIcon(selectedItem.type)}
                  />
                  {selectedItem.category && (
                    <Chip
                      label={categories.find(c => c.value === selectedItem.category)?.label}
                      size="small"
                      variant="outlined"
                    />
                  )}
                  {selectedItem.favorite && <Chip label="Favori" size="small" color="warning" />}
                  {selectedItem.starred && <Chip label="Étoilé" size="small" color="secondary" />}
                </Box>
              </Box>
              <IconButton
                sx={{ position: 'absolute', top: 8, right: 8 }}
                onClick={() => setShowViewer(false)}
              >
                <FullscreenExit />
              </IconButton>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default VisualMediaGallery; 