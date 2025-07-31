import React, { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  Typography,
  Chip,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  FormControlLabel,
  Switch,
  Tooltip,
  Fade,
  Zoom
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  FilterList as FilterIcon,
  Tune as TuneIcon,
  History as HistoryIcon,
  TrendingUp as TrendingIcon,
  Star as StarIcon,
  AccessTime as TimeIcon,
  Category as CategoryIcon,
  FileCopy as FileIcon,
  Image as ImageIcon,
  VideoFile as VideoIcon,
  AudioFile as AudioIcon,
  Archive as ArchiveIcon,
  Code as CodeIcon,
  School as SchoolIcon,
  Business as BusinessIcon,
  Description as DescriptionIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Storage as StorageIcon,
  Sort as SortIcon
} from '@mui/icons-material';

const SmartSearch = ({ documents = [], folders = [], onDocumentSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [advancedFilters, setAdvancedFilters] = useState({
    categories: [],
    types: [],
    dateRange: [null, null],
    sizeRange: [0, 100],
    favorites: false,
    bookmarks: false,
    tags: []
  });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [sortBy, setSortBy] = useState('relevance');
  const [sortOrder, setSortOrder] = useState('desc');

  // Historique des recherches
  useEffect(() => {
    const saved = localStorage.getItem('searchHistory');
    if (saved) {
      setSearchHistory(JSON.parse(saved));
    }
  }, []);

  const saveToHistory = (query) => {
    if (!query.trim()) return;
    
    const newHistory = [
      query,
      ...searchHistory.filter(item => item !== query)
    ].slice(0, 10);
    
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
  };

  // Générer les suggestions
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const allItems = [...documents, ...folders];
    
    const suggestions = [];
    
    // Suggestions de noms de fichiers
    allItems.forEach(item => {
      if (item.name.toLowerCase().includes(query)) {
        suggestions.push({
          type: 'file',
          text: item.name,
          item: item
        });
      }
    });

    // Suggestions de catégories
    const categories = [...new Set(allItems.map(item => item.category))];
    categories.forEach(cat => {
      if (cat && cat.toLowerCase().includes(query)) {
        suggestions.push({
          type: 'category',
          text: `catégorie: ${cat}`,
          filter: { categories: [cat] }
        });
      }
    });

    // Suggestions de types
    const types = [...new Set(allItems.map(item => item.type?.split('/')[0]))];
    types.forEach(type => {
      if (type && type.toLowerCase().includes(query)) {
        suggestions.push({
          type: 'type',
          text: `type: ${type}`,
          filter: { types: [type] }
        });
      }
    });

    // Suggestions de tags
    allItems.forEach(item => {
      if (item.tags) {
        item.tags.forEach(tag => {
          if (tag.toLowerCase().includes(query)) {
            suggestions.push({
              type: 'tag',
              text: `tag: ${tag}`,
              filter: { tags: [tag] }
            });
          }
        });
      }
    });

    setSuggestions(suggestions.slice(0, 8));
  }, [searchQuery, documents, folders]);

  // Parser les requêtes avancées
  const parseAdvancedQuery = (query) => {
    const filters = {};
    const terms = [];
    
    // Patterns pour les requêtes avancées
    const patterns = [
      { regex: /type:(\w+)/g, key: 'types' },
      { regex: /date:(\d{4})/g, key: 'year' },
      { regex: /catégorie:(\w+)/g, key: 'categories' },
      { regex: /tag:(\w+)/g, key: 'tags' },
      { regex: /taille:(\d+)/g, key: 'size' },
      { regex: /favori:(\w+)/g, key: 'favorites' },
      { regex: /bookmark:(\w+)/g, key: 'bookmarks' }
    ];

    patterns.forEach(pattern => {
      const matches = query.match(pattern.regex);
      if (matches) {
        matches.forEach(match => {
          const value = match.split(':')[1];
          if (!filters[pattern.key]) {
            filters[pattern.key] = [];
          }
          filters[pattern.key].push(value);
        });
        // Supprimer les patterns de la requête
        query = query.replace(pattern.regex, '');
      }
    });

    // Le reste devient les termes de recherche
    terms.push(...query.trim().split(/\s+/).filter(term => term.length > 0));

    return { filters, terms };
  };

  // Recherche intelligente
  const searchResults = useMemo(() => {
    if (!searchQuery.trim() && Object.keys(advancedFilters).every(key => 
      !advancedFilters[key] || 
      (Array.isArray(advancedFilters[key]) && advancedFilters[key].length === 0) ||
      advancedFilters[key] === false
    )) {
      return [];
    }

    const { filters: queryFilters, terms } = parseAdvancedQuery(searchQuery);
    const allFilters = { ...advancedFilters, ...queryFilters };
    
    const allItems = [...documents, ...folders];
    
    return allItems.filter(item => {
      // Filtre par termes de recherche
      if (terms.length > 0) {
        const itemText = `${item.name} ${item.path} ${item.category || ''} ${item.tags?.join(' ') || ''}`.toLowerCase();
        const matchesTerms = terms.every(term => itemText.includes(term.toLowerCase()));
        if (!matchesTerms) return false;
      }

      // Filtre par catégories
      if (allFilters.categories && allFilters.categories.length > 0) {
        if (!allFilters.categories.includes(item.category)) return false;
      }

      // Filtre par types
      if (allFilters.types && allFilters.types.length > 0) {
        const itemType = item.type?.split('/')[0] || 'document';
        if (!allFilters.types.includes(itemType)) return false;
      }

      // Filtre par année
      if (allFilters.year && allFilters.year.length > 0) {
        const itemYear = new Date(item.lastModified || item.created_at || Date.now()).getFullYear().toString();
        if (!allFilters.year.includes(itemYear)) return false;
      }

      // Filtre par tags
      if (allFilters.tags && allFilters.tags.length > 0) {
        if (!item.tags || !allFilters.tags.some(tag => item.tags.includes(tag))) return false;
      }

      // Filtre par taille
      if (allFilters.size && allFilters.size.length > 0) {
        const sizeMB = (item.size || 0) / (1024 * 1024);
        const maxSize = Math.max(...allFilters.size.map(s => parseInt(s)));
        if (sizeMB > maxSize) return false;
      }

      // Filtre par favoris
      if (allFilters.favorites && allFilters.favorites.includes('true')) {
        if (!item.favorite) return false;
      }

      // Filtre par bookmarks
      if (allFilters.bookmarks && allFilters.bookmarks.includes('true')) {
        if (!item.bookmark) return false;
      }

      return true;
    });
  }, [searchQuery, advancedFilters, documents, folders]);

  // Trier les résultats
  const sortedResults = useMemo(() => {
    const sorted = [...searchResults];
    
    switch (sortBy) {
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'date':
        sorted.sort((a, b) => new Date(b.lastModified || b.created_at) - new Date(a.lastModified || a.created_at));
        break;
      case 'size':
        sorted.sort((a, b) => (b.size || 0) - (a.size || 0));
        break;
      case 'type':
        sorted.sort((a, b) => (a.type || '').localeCompare(b.type || ''));
        break;
      case 'relevance':
      default:
        // Tri par pertinence (nombre de correspondances)
        sorted.sort((a, b) => {
          const aScore = calculateRelevanceScore(a);
          const bScore = calculateRelevanceScore(b);
          return bScore - aScore;
        });
        break;
    }

    if (sortOrder === 'asc') {
      sorted.reverse();
    }

    return sorted;
  }, [searchResults, sortBy, sortOrder]);

  const calculateRelevanceScore = (item) => {
    const query = searchQuery.toLowerCase();
    let score = 0;
    
    if (item.name.toLowerCase().includes(query)) score += 10;
    if (item.path.toLowerCase().includes(query)) score += 5;
    if (item.category && item.category.toLowerCase().includes(query)) score += 3;
    if (item.tags && item.tags.some(tag => tag.toLowerCase().includes(query))) score += 2;
    
    return score;
  };

  const handleSearch = () => {
    saveToHistory(searchQuery);
    // La recherche se fait automatiquement via useMemo
  };

  const handleSuggestionClick = (suggestion) => {
    if (suggestion.type === 'file') {
      onDocumentSelect?.(suggestion.item);
    } else if (suggestion.filter) {
      setAdvancedFilters(prev => ({
        ...prev,
        ...suggestion.filter
      }));
    }
  };

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return <ImageIcon />;
    if (type.startsWith('video/')) return <VideoIcon />;
    if (type.startsWith('audio/')) return <AudioIcon />;
    if (type.includes('zip') || type.includes('rar') || type.includes('tar')) return <ArchiveIcon />;
    if (type.includes('text') || type.includes('code')) return <CodeIcon />;
    return <FileIcon />;
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

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR');
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
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
            <SearchIcon />
          </Box>
          <Box>
            <Typography variant="h5" component="h2" fontWeight="bold">
              Recherche Intelligente
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Recherche avancée avec requêtes complexes
            </Typography>
          </Box>
        </Box>

        {/* Barre de recherche */}
        <Box sx={{ position: 'relative', mb: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Rechercher... (ex: type:pdf date:2023 catégorie:scolaire)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="primary" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  {searchQuery && (
                    <IconButton onClick={() => setSearchQuery('')}>
                      <ClearIcon />
                    </IconButton>
                  )}
                  <IconButton onClick={() => setShowAdvanced(!showAdvanced)}>
                    <TuneIcon />
                  </IconButton>
                </InputAdornment>
              ),
              sx: {
                borderRadius: '25px',
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.9)'
                }
              }
            }}
          />

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <Paper
              sx={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                zIndex: 1000,
                mt: 1,
                maxHeight: 300,
                overflow: 'auto',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
              }}
            >
              <List>
                {suggestions.map((suggestion, index) => (
                  <ListItem
                    key={index}
                    button
                    onClick={() => handleSuggestionClick(suggestion)}
                    sx={{
                      '&:hover': {
                        background: 'rgba(102, 126, 234, 0.1)'
                      }
                    }}
                  >
                    <ListItemIcon>
                      {suggestion.type === 'file' ? getFileIcon(suggestion.item.type) : <SearchIcon />}
                    </ListItemIcon>
                    <ListItemText
                      primary={suggestion.text}
                      secondary={suggestion.type === 'file' ? suggestion.item.path : `Filtre ${suggestion.type}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
        </Box>

        {/* Historique des recherches */}
        {searchHistory.length > 0 && !searchQuery && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <HistoryIcon fontSize="small" />
              Recherches récentes
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {searchHistory.slice(0, 5).map((query, index) => (
                <Chip
                  key={index}
                  label={query}
                  size="small"
                  onClick={() => setSearchQuery(query)}
                  sx={{ cursor: 'pointer' }}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Filtres avancés */}
        {showAdvanced && (
          <Box sx={{ mb: 3, p: 2, background: 'rgba(102, 126, 234, 0.05)', borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Filtres Avancés
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Catégories</InputLabel>
                  <Select
                    multiple
                    value={advancedFilters.categories}
                    onChange={(e) => setAdvancedFilters(prev => ({
                      ...prev,
                      categories: e.target.value
                    }))}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} size="small" />
                        ))}
                      </Box>
                    )}
                  >
                    {['scolaire', 'administratif', 'travail', 'personnel', 'autre'].map((cat) => (
                      <MenuItem key={cat} value={cat}>
                        {cat}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Types</InputLabel>
                  <Select
                    multiple
                    value={advancedFilters.types}
                    onChange={(e) => setAdvancedFilters(prev => ({
                      ...prev,
                      types: e.target.value
                    }))}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} size="small" />
                        ))}
                      </Box>
                    )}
                  >
                    {['image', 'video', 'audio', 'document', 'archive'].map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="body2" gutterBottom>
                  Taille maximale (MB)
                </Typography>
                <Slider
                  value={advancedFilters.sizeRange}
                  onChange={(e, newValue) => setAdvancedFilters(prev => ({
                    ...prev,
                    sizeRange: newValue
                  }))}
                  valueLabelDisplay="auto"
                  min={0}
                  max={100}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={advancedFilters.favorites}
                        onChange={(e) => setAdvancedFilters(prev => ({
                          ...prev,
                          favorites: e.target.checked
                        }))}
                      />
                    }
                    label="Favoris uniquement"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={advancedFilters.bookmarks}
                        onChange={(e) => setAdvancedFilters(prev => ({
                          ...prev,
                          bookmarks: e.target.checked
                        }))}
                      />
                    }
                    label="Bookmarks uniquement"
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Options de tri */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Typography variant="body2">Trier par:</Typography>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="relevance">Pertinence</MenuItem>
              <MenuItem value="name">Nom</MenuItem>
              <MenuItem value="date">Date</MenuItem>
              <MenuItem value="size">Taille</MenuItem>
              <MenuItem value="type">Type</MenuItem>
            </Select>
          </FormControl>
          
          <IconButton
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            size="small"
          >
            <SortIcon sx={{ transform: sortOrder === 'asc' ? 'rotate(180deg)' : 'none' }} />
          </IconButton>
        </Box>

        {/* Résultats */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Résultats ({sortedResults.length})
          </Typography>
          
          {sortedResults.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <SearchIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Aucun résultat trouvé
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Essayez de modifier vos critères de recherche
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {sortedResults.map((item) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                  <Card
                    sx={{
                      background: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        transform: 'translateY(-4px) scale(1.02)',
                        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)'
                      }
                    }}
                    className="hover-lift"
                    onClick={() => onDocumentSelect?.(item)}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        {getFileIcon(item.type)}
                        <Typography
                          variant="body2"
                          sx={{
                            ml: 1,
                            fontWeight: 500,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            flex: 1
                          }}
                        >
                          {item.name}
                        </Typography>
                        {item.favorite && <StarIcon sx={{ fontSize: 16, color: 'warning.main' }} />}
                      </Box>
                      
                      <Typography variant="caption" color="text.secondary" display="block">
                        {item.path}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                        <Chip
                          size="small"
                          icon={getCategoryIcon(item.category)}
                          label={item.category}
                          variant="outlined"
                        />
                        {item.size && (
                          <Typography variant="caption" color="text.secondary">
                            {formatFileSize(item.size)}
                          </Typography>
                        )}
                      </Box>
                      
                      <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                        {formatDate(item.lastModified || item.created_at)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default SmartSearch; 