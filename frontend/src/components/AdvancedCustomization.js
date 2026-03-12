import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  Button,
  TextField,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Alert,
  Tooltip,
  Fab,
} from '@mui/material';
import {
  Brightness4,
  Brightness7,
  Palette,
  Settings,
  Add,
  Delete,
  Edit,
  ExpandMore,
  ColorLens,
  Category,
  AutoAwesome,
  DarkMode,
  LightMode,
  Schedule,
} from '@mui/icons-material';
import { useTheme } from '../contexts/ThemeContext';

const AdvancedCustomization = () => {
  const {
    mode,
    setMode,
    accentColor,
    setAccentColor,
    customCategories,
    addCustomCategory,
    removeCustomCategory,
    updateCustomCategory,
    toggleMode,
    getCurrentMode,
  } = useTheme();

  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({
    name: '',
    icon: '📁',
    color: '#667eea',
    description: '',
  });

  const predefinedColors = [
    '#667eea', '#f093fb', '#f5576c', '#4facfe', '#00f2fe',
    '#43e97b', '#38f9d7', '#fa709a', '#fee140', '#a8edea',
    '#ff9a9e', '#fecfef', '#fecfef', '#ffecd2', '#fcb69f',
  ];

  const handleAddCategory = () => {
    if (newCategory.name.trim()) {
      const category = {
        id: Date.now().toString(),
        ...newCategory,
        createdAt: new Date().toISOString(),
      };
      addCustomCategory(category);
      setNewCategory({ name: '', icon: '📁', color: '#667eea', description: '' });
      setShowCategoryDialog(false);
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setNewCategory({
      name: category.name,
      icon: category.icon,
      color: category.color,
      description: category.description,
    });
    setShowCategoryDialog(true);
  };

  const handleUpdateCategory = () => {
    if (editingCategory && newCategory.name.trim()) {
      updateCustomCategory(editingCategory.id, {
        ...newCategory,
        updatedAt: new Date().toISOString(),
      });
      setEditingCategory(null);
      setNewCategory({ name: '', icon: '📁', color: '#667eea', description: '' });
      setShowCategoryDialog(false);
    }
  };

  const getModeIcon = () => {
    switch (mode) {
      case 'light':
        return <LightMode />;
      case 'dark':
        return <DarkMode />;
      case 'auto':
        return <Schedule />;
      case 'system':
        return <AutoAwesome />;
      default:
        return <Brightness4 />;
    }
  };

  const getModeLabel = () => {
    switch (mode) {
      case 'light':
        return 'Clair';
      case 'dark':
        return 'Sombre';
      case 'auto':
        return 'Automatique (heure)';
      case 'system':
        return 'Système';
      default:
        return 'Automatique';
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        <Settings sx={{ mr: 2, verticalAlign: 'middle' }} />
        Personnalisation Avancée
      </Typography>

      <Grid container spacing={3}>
        {/* Thème et Couleurs */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Palette sx={{ mr: 1, verticalAlign: 'middle' }} />
                Thème et Couleurs
              </Typography>

              {/* Mode de thème */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Mode d'affichage
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={getModeIcon()}
                    onClick={toggleMode}
                    sx={{ minWidth: 200 }}
                  >
                    {getModeLabel()}
                  </Button>
                  <Chip
                    label={getCurrentMode() === 'dark' ? 'Sombre' : 'Clair'}
                    color={getCurrentMode() === 'dark' ? 'primary' : 'default'}
                    icon={getCurrentMode() === 'dark' ? <Brightness4 /> : <Brightness7 />}
                  />
                </Box>
                <Alert severity="info" sx={{ mb: 2 }}>
                  Mode automatique : basé sur l'heure de la journée (6h-18h = clair)
                </Alert>
              </Box>

              {/* Couleur d'accentuation */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Couleur d'accentuation
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      backgroundColor: accentColor,
                      border: '2px solid',
                      borderColor: 'divider',
                      cursor: 'pointer',
                    }}
                    onClick={() => setShowColorPicker(true)}
                  />
                  <TextField
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    placeholder="#667eea"
                    size="small"
                    sx={{ width: 120 }}
                  />
                  <Button
                    variant="outlined"
                    onClick={() => setShowColorPicker(true)}
                    startIcon={<ColorLens />}
                  >
                    Palette
                  </Button>
                </Box>

                {/* Couleurs prédéfinies */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {predefinedColors.map((color) => (
                    <Tooltip key={color} title={color}>
                      <Box
                        sx={{
                          width: 30,
                          height: 30,
                          borderRadius: '50%',
                          backgroundColor: color,
                          cursor: 'pointer',
                          border: '2px solid',
                          borderColor: accentColor === color ? 'primary.main' : 'transparent',
                          '&:hover': {
                            transform: 'scale(1.1)',
                          },
                        }}
                        onClick={() => setAccentColor(color)}
                      />
                    </Tooltip>
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Catégories personnalisées */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  <Category sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Catégories personnalisées
                </Typography>
                <Fab
                  size="small"
                  color="primary"
                  onClick={() => {
                    setEditingCategory(null);
                    setNewCategory({ name: '', icon: '📁', color: '#667eea', description: '' });
                    setShowCategoryDialog(true);
                  }}
                >
                  <Add />
                </Fab>
              </Box>

              {customCategories.length === 0 ? (
                <Alert severity="info">
                  Aucune catégorie personnalisée. Créez-en une pour organiser vos documents.
                </Alert>
              ) : (
                <List>
                  {customCategories.map((category, index) => (
                    <React.Fragment key={category.id}>
                      <ListItem>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 2 }}>
                          <span style={{ fontSize: '1.5rem' }}>{category.icon}</span>
                          <Box
                            sx={{
                              width: 16,
                              height: 16,
                              borderRadius: '50%',
                              backgroundColor: category.color,
                            }}
                          />
                        </Box>
                        <ListItemText
                          primary={category.name}
                          secondary={category.description}
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            onClick={() => handleEditCategory(category)}
                            sx={{ mr: 1 }}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            edge="end"
                            onClick={() => removeCustomCategory(category.id)}
                            color="error"
                          >
                            <Delete />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                      {index < customCategories.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Paramètres avancés */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Settings sx={{ mr: 1, verticalAlign: 'middle' }} />
                Paramètres avancés
              </Typography>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography>Animations et effets</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <FormControlLabel
                        control={<Switch defaultChecked />}
                        label="Animations de survol"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControlLabel
                        control={<Switch defaultChecked />}
                        label="Effets de transition"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControlLabel
                        control={<Switch />}
                        label="Mode sombre automatique"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControlLabel
                        control={<Switch defaultChecked />}
                        label="Notifications visuelles"
                      />
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography>Interface utilisateur</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography gutterBottom>Opacité des cartes</Typography>
                      <Slider
                        defaultValue={100}
                        min={50}
                        max={100}
                        valueLabelDisplay="auto"
                        valueLabelFormat={(value) => `${value}%`}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography gutterBottom>Rayon de bordure</Typography>
                      <Slider
                        defaultValue={12}
                        min={0}
                        max={24}
                        valueLabelDisplay="auto"
                        valueLabelFormat={(value) => `${value}px`}
                      />
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Dialog de sélection de couleur */}
      <Dialog open={showColorPicker} onClose={() => setShowColorPicker(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Sélectionner une couleur</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center', py: 2 }}>
            {predefinedColors.map((color) => (
              <Tooltip key={color} title={color}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    backgroundColor: color,
                    cursor: 'pointer',
                    border: '3px solid',
                    borderColor: accentColor === color ? 'primary.main' : 'transparent',
                    '&:hover': {
                      transform: 'scale(1.1)',
                    },
                  }}
                  onClick={() => {
                    setAccentColor(color);
                    setShowColorPicker(false);
                  }}
                />
              </Tooltip>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowColorPicker(false)}>Fermer</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog d'ajout/édition de catégorie */}
      <Dialog open={showCategoryDialog} onClose={() => setShowCategoryDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nom de la catégorie"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={2}
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Icône (emoji)"
                value={newCategory.icon}
                onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
                helperText="Ex: 📁, 📚, 🗂️"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Couleur"
                value={newCategory.color}
                onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                type="color"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCategoryDialog(false)}>Annuler</Button>
          <Button
            onClick={editingCategory ? handleUpdateCategory : handleAddCategory}
            variant="contained"
            disabled={!newCategory.name.trim()}
          >
            {editingCategory ? 'Modifier' : 'Ajouter'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdvancedCustomization; 