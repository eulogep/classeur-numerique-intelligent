import React, { useState, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Slider,
  FormControlLabel,
  Switch,
  Tooltip,
  Alert,
  Divider
} from '@mui/material';
import {
  AutoAwesome as AutoAwesomeIcon,
  Edit as EditIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
  School as SchoolIcon,
  Business as BusinessIcon,
  Description as DescriptionIcon,
  Person as PersonIcon,
  Category as CategoryIcon,
  FileCopy as FileIcon,
  Image as ImageIcon,
  VideoFile as VideoIcon,
  AudioFile as AudioIcon,
  Archive as ArchiveIcon,
  Code as CodeIcon,
  CalendarToday as CalendarIcon,
  Tag as TagIcon,
  Star as StarIcon,
  TrendingUp as TrendingIcon
} from '@mui/icons-material';

const AutoNamingAssistant = ({ documents = [], onNameAccepted, onClose }) => {
  const [originalName, setOriginalName] = useState('');
  const [suggestedNames, setSuggestedNames] = useState([]);
  const [selectedName, setSelectedName] = useState('');
  const [customName, setCustomName] = useState('');
  const [namingRules, setNamingRules] = useState({
    includeCategory: true,
    includeDate: true,
    includeType: false,
    includeTags: false,
    separator: '_',
    dateFormat: 'YYYY',
    categoryPosition: 'prefix'
  });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);

  // Analyser les documents existants pour générer des suggestions
  const documentPatterns = useMemo(() => {
    const patterns = {
      categories: {},
      datePatterns: {},
      typePatterns: {},
      commonWords: {},
      namingConventions: []
    };

    documents.forEach(doc => {
      const name = doc.name.toLowerCase();
      const category = doc.category || 'autre';
      
      // Analyser les catégories
      if (!patterns.categories[category]) {
        patterns.categories[category] = 0;
      }
      patterns.categories[category]++;

      // Analyser les patterns de dates
      const dateMatch = name.match(/(\d{4})/);
      if (dateMatch) {
        const year = dateMatch[1];
        if (!patterns.datePatterns[year]) {
          patterns.datePatterns[year] = 0;
        }
        patterns.datePatterns[year]++;
      }

      // Analyser les types de fichiers
      const extension = name.split('.').pop();
      if (extension) {
        if (!patterns.typePatterns[extension]) {
          patterns.typePatterns[extension] = 0;
        }
        patterns.typePatterns[extension]++;
      }

      // Analyser les mots communs
      const words = name.replace(/[^\w\s]/g, ' ').split(/\s+/);
      words.forEach(word => {
        if (word.length > 2) {
          if (!patterns.commonWords[word]) {
            patterns.commonWords[word] = 0;
          }
          patterns.commonWords[word]++;
        }
      });

      // Analyser les conventions de nommage
      const parts = name.split(/[_\-\s]/);
      if (parts.length > 1) {
        patterns.namingConventions.push({
          pattern: parts,
          category: category,
          frequency: 1
        });
      }
    });

    return patterns;
  }, [documents]);

  // Générer des suggestions de noms
  const generateSuggestions = (baseName, category, tags = []) => {
    const suggestions = [];
    const currentYear = new Date().getFullYear();
    const extension = baseName.split('.').pop() || '';
    const nameWithoutExt = baseName.replace(/\.[^/.]+$/, '');
    
    // Suggestion 1: Catégorie_Année_Nom
    if (namingRules.includeCategory && category) {
      suggestions.push({
        name: `${category}_${currentYear}_${nameWithoutExt}.${extension}`,
        score: 90,
        description: 'Format standard avec catégorie et année'
      });
    }

    // Suggestion 2: Nom_Catégorie_Année
    if (namingRules.includeCategory && category) {
      suggestions.push({
        name: `${nameWithoutExt}_${category}_${currentYear}.${extension}`,
        score: 85,
        description: 'Nom en premier, puis catégorie et année'
      });
    }

    // Suggestion 3: Basé sur les patterns existants
    const similarDocs = documents.filter(doc => 
      doc.category === category && doc.name.includes(nameWithoutExt.split(' ')[0])
    );
    
    if (similarDocs.length > 0) {
      const mostCommonPattern = similarDocs[0].name;
      const patternParts = mostCommonPattern.split(/[_\-\s]/);
      const newName = patternParts.map(part => {
        if (part.match(/^\d{4}$/)) return currentYear;
        if (part === similarDocs[0].category) return category;
        return part;
      }).join(namingRules.separator);
      
      suggestions.push({
        name: `${newName}.${extension}`,
        score: 80,
        description: 'Basé sur les conventions existantes'
      });
    }

    // Suggestion 4: Avec tags
    if (namingRules.includeTags && tags.length > 0) {
      suggestions.push({
        name: `${nameWithoutExt}_${tags.join('_')}.${extension}`,
        score: 75,
        description: 'Inclut les tags associés'
      });
    }

    // Suggestion 5: Format simple
    suggestions.push({
      name: `${nameWithoutExt}_${currentYear}.${extension}`,
      score: 70,
      description: 'Format simple avec année'
    });

    // Suggestion 6: Basé sur le type de fichier
    if (namingRules.includeType) {
      const fileType = getFileType(extension);
      suggestions.push({
        name: `${fileType}_${nameWithoutExt}.${extension}`,
        score: 65,
        description: 'Inclut le type de fichier'
      });
    }

    // Suggestion 7: Format académique
    if (category === 'scolaire') {
      suggestions.push({
        name: `Cours_${nameWithoutExt}_${currentYear}.${extension}`,
        score: 95,
        description: 'Format académique standard'
      });
    }

    // Suggestion 8: Format administratif
    if (category === 'administratif') {
      suggestions.push({
        name: `Doc_${nameWithoutExt}_${currentYear}.${extension}`,
        score: 90,
        description: 'Format administratif'
      });
    }

    return suggestions
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  };

  const getFileType = (extension) => {
    const typeMap = {
      'pdf': 'PDF',
      'doc': 'Document',
      'docx': 'Document',
      'txt': 'Texte',
      'jpg': 'Image',
      'png': 'Image',
      'mp4': 'Video',
      'mp3': 'Audio',
      'zip': 'Archive',
      'js': 'Code',
      'py': 'Code',
      'html': 'Code'
    };
    return typeMap[extension.toLowerCase()] || 'Fichier';
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

  const handleGenerateSuggestions = () => {
    if (!originalName.trim()) return;
    
    const suggestions = generateSuggestions(originalName, selectedCategory, selectedTags);
    setSuggestedNames(suggestions);
    if (suggestions.length > 0) {
      setSelectedName(suggestions[0].name);
    }
  };

  const handleAcceptName = () => {
    const finalName = customName || selectedName;
    if (finalName && onNameAccepted) {
      onNameAccepted(finalName);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSelectedName(suggestion.name);
    setCustomName(suggestion.name);
  };

  const availableCategories = Object.keys(documentPatterns.categories);
  const availableTags = Array.from(new Set(
    documents.flatMap(doc => doc.tags || [])
  )).filter(tag => tag);

  return (
    <Dialog
      open={true}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}
      >
        <AutoAwesomeIcon />
        <Typography variant="h6">
          Assistant de Nommage Automatique
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Configuration */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Configuration
            </Typography>
            
            <TextField
              fullWidth
              label="Nom original du fichier"
              value={originalName}
              onChange={(e) => setOriginalName(e.target.value)}
              placeholder="ex: cours_java_s6.pdf"
              sx={{ mb: 2 }}
            />

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Catégorie</InputLabel>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                label="Catégorie"
              >
                {availableCategories.map(cat => (
                  <MenuItem key={cat} value={cat}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getCategoryIcon(cat)}
                      {cat}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Autocomplete
              multiple
              options={availableTags}
              value={selectedTags}
              onChange={(e, newValue) => setSelectedTags(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Tags"
                  placeholder="Sélectionner des tags"
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option}
                    label={option}
                    size="small"
                  />
                ))
              }
              sx={{ mb: 2 }}
            />

            <Button
              variant="contained"
              startIcon={<AutoAwesomeIcon />}
              onClick={handleGenerateSuggestions}
              disabled={!originalName.trim()}
              fullWidth
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
                }
              }}
            >
              Générer les suggestions
            </Button>
          </Grid>

          {/* Règles de nommage */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Règles de Nommage
            </Typography>
            
            <FormControlLabel
              control={
                <Switch
                  checked={namingRules.includeCategory}
                  onChange={(e) => setNamingRules(prev => ({
                    ...prev,
                    includeCategory: e.target.checked
                  }))}
                />
              }
              label="Inclure la catégorie"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={namingRules.includeDate}
                  onChange={(e) => setNamingRules(prev => ({
                    ...prev,
                    includeDate: e.target.checked
                  }))}
                />
              }
              label="Inclure la date"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={namingRules.includeType}
                  onChange={(e) => setNamingRules(prev => ({
                    ...prev,
                    includeType: e.target.checked
                  }))}
                />
              }
              label="Inclure le type de fichier"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={namingRules.includeTags}
                  onChange={(e) => setNamingRules(prev => ({
                    ...prev,
                    includeTags: e.target.checked
                  }))}
                />
              }
              label="Inclure les tags"
            />

            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Séparateur</InputLabel>
              <Select
                value={namingRules.separator}
                onChange={(e) => setNamingRules(prev => ({
                  ...prev,
                  separator: e.target.value
                }))}
                label="Séparateur"
              >
                <MenuItem value="_">Tiret bas (_)</MenuItem>
                <MenuItem value="-">Tiret (-)</MenuItem>
                <MenuItem value=" ">Espace ( )</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Suggestions */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Suggestions ({suggestedNames.length})
            </Typography>
            
            {suggestedNames.length === 0 ? (
              <Alert severity="info">
                Entrez un nom de fichier et cliquez sur "Générer les suggestions"
              </Alert>
            ) : (
              <List>
                {suggestedNames.map((suggestion, index) => (
                  <ListItem
                    key={index}
                    button
                    selected={selectedName === suggestion.name}
                    onClick={() => handleSuggestionClick(suggestion)}
                    sx={{
                      borderRadius: 1,
                      mb: 1,
                      border: selectedName === suggestion.name ? 2 : 1,
                      borderColor: selectedName === suggestion.name ? 'primary.main' : 'divider'
                    }}
                  >
                    <ListItemIcon>
                      <StarIcon color={suggestion.score >= 90 ? 'warning' : 'disabled'} />
                    </ListItemIcon>
                    <ListItemText
                      primary={suggestion.name}
                      secondary={suggestion.description}
                    />
                    <ListItemSecondaryAction>
                      <Chip
                        label={`${suggestion.score}%`}
                        size="small"
                        color={suggestion.score >= 90 ? 'success' : 'default'}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            )}
          </Grid>

          {/* Nom personnalisé */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Nom Final
            </Typography>
            
            <TextField
              fullWidth
              label="Nom personnalisé"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="Entrez le nom final ou sélectionnez une suggestion"
              sx={{ mb: 2 }}
            />

            {customName && (
              <Alert severity="success" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  Le fichier sera renommé en : <strong>{customName}</strong>
                </Typography>
              </Alert>
            )}
          </Grid>

          {/* Statistiques */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Statistiques de Nommage
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={6} md={3}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      {Object.keys(documentPatterns.categories).length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Catégories utilisées
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={6} md={3}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="secondary">
                      {Object.keys(documentPatterns.datePatterns).length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Années référencées
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={6} md={3}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="success.main">
                      {documentPatterns.namingConventions.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Conventions détectées
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={6} md={3}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="warning.main">
                      {Object.keys(documentPatterns.commonWords).length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Mots communs
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} startIcon={<CloseIcon />}>
          Annuler
        </Button>
        <Button
          variant="contained"
          onClick={handleAcceptName}
          disabled={!customName.trim()}
          startIcon={<CheckIcon />}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
            }
          }}
        >
          Accepter le nom
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AutoNamingAssistant; 