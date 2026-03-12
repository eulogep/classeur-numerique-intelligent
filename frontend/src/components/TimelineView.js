import React, { useState, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  IconButton,
  Chip,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  LinearProgress,
  Tooltip,
  Zoom,
  Fade
} from '@mui/material';
import {
  Timeline as TimelineIcon,
  CalendarToday as CalendarIcon,
  School as SchoolIcon,
  Business as BusinessIcon,
  Description as DescriptionIcon,
  Person as PersonIcon,
  Category as CategoryIcon,
  FileCopy as FileCopyIcon,
  Image as ImageIcon,
  VideoFile as VideoIcon,
  AudioFile as AudioIcon,
  Archive as ArchiveIcon,
  Code as CodeIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  FilterList as FilterIcon,
  ViewTimeline as ViewTimelineIcon,
  ViewModule as ViewModuleIcon
} from '@mui/icons-material';

const TimelineView = ({ documents = [], folders = [] }) => {
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [viewMode, setViewMode] = useState('timeline'); // 'timeline' ou 'grid'
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    categories: [],
    types: [],
    search: ''
  });

  // Organiser les documents par année et mois
  const timelineData = useMemo(() => {
    const timeline = {};
    
    [...documents, ...folders].forEach(item => {
      const date = new Date(item.lastModified || item.created_at || Date.now());
      const year = date.getFullYear();
      const month = date.getMonth();
      
      if (!timeline[year]) {
        timeline[year] = {};
      }
      if (!timeline[year][month]) {
        timeline[year][month] = [];
      }
      
      timeline[year][month].push({
        ...item,
        date: date,
        monthName: date.toLocaleDateString('fr-FR', { month: 'long' })
      });
    });

    // Trier par année décroissante et par mois
    return Object.keys(timeline)
      .sort((a, b) => parseInt(b) - parseInt(a))
      .reduce((acc, year) => {
        acc[year] = Object.keys(timeline[year])
          .sort((a, b) => parseInt(a) - parseInt(b))
          .reduce((monthAcc, month) => {
            monthAcc[month] = timeline[year][month].sort((a, b) => b.date - a.date);
            return monthAcc;
          }, {});
        return acc;
      }, {});
  }, [documents, folders]);

  // Filtrer les données
  const filteredTimelineData = useMemo(() => {
    if (!filters.categories.length && !filters.types.length && !filters.search) {
      return timelineData;
    }

    const filtered = {};
    Object.keys(timelineData).forEach(year => {
      filtered[year] = {};
      Object.keys(timelineData[year]).forEach(month => {
        const filteredItems = timelineData[year][month].filter(item => {
          // Filtre par catégorie
          if (filters.categories.length && !filters.categories.includes(item.category)) {
            return false;
          }
          
          // Filtre par type
          if (filters.types.length) {
            const itemType = item.type?.split('/')[0] || 'document';
            if (!filters.types.includes(itemType)) {
              return false;
          }
          }
          
          // Filtre par recherche
          if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            return item.name.toLowerCase().includes(searchLower) ||
                   item.path.toLowerCase().includes(searchLower) ||
                   (item.category && item.category.toLowerCase().includes(searchLower));
          }
          
          return true;
        });
        
        if (filteredItems.length > 0) {
          filtered[year][month] = filteredItems;
        }
      });
    });
    
    return filtered;
  }, [timelineData, filters]);

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
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const renderTimelineView = () => (
    <Box sx={{ position: 'relative' }}>
      {/* Ligne de temps centrale */}
      <Box
        sx={{
          position: 'absolute',
          left: '50%',
          top: 0,
          bottom: 0,
          width: '4px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          transform: 'translateX(-50%)',
          borderRadius: '2px',
          zIndex: 1
        }}
      />
      
      {Object.keys(filteredTimelineData).map((year, yearIndex) => (
        <Box key={year} sx={{ mb: 4 }}>
          {/* En-tête de l'année */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 3,
              position: 'relative',
              zIndex: 2
            }}
          >
            <Card
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                borderRadius: '25px',
                px: 3,
                py: 1,
                boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                animation: 'float 3s ease-in-out infinite',
                animationDelay: `${yearIndex * 0.2}s`
              }}
              className="animate-float"
            >
              <Typography variant="h5" fontWeight="bold">
                {year}
              </Typography>
            </Card>
          </Box>

          {Object.keys(filteredTimelineData[year]).map((month, monthIndex) => {
            const monthData = filteredTimelineData[year][month];
            const isEven = monthIndex % 2 === 0;
            
            return (
              <Box
                key={`${year}-${month}`}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: 3,
                  position: 'relative',
                  zIndex: 2
                }}
              >
                {/* Contenu du mois */}
                <Box
                  sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: isEven ? 'row' : 'row-reverse',
                    alignItems: 'center',
                    gap: 3
                  }}
                >
                  {/* Nom du mois */}
                  <Card
                    sx={{
                      minWidth: 120,
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                      borderRadius: '16px',
                      textAlign: 'center',
                      py: 1
                    }}
                    className="animate-scale-in"
                  >
                    <Typography variant="h6" fontWeight="600" color="primary">
                      {months[parseInt(month)]}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {monthData.length} élément{monthData.length > 1 ? 's' : ''}
                    </Typography>
                  </Card>

                  {/* Liste des documents */}
                  <Box sx={{ flex: 1 }}>
                    <Grid container spacing={2}>
                      {monthData.slice(0, 6).map((item, itemIndex) => (
                        <Grid item xs={12} sm={6} md={4} key={item.id}>
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
                            onClick={() => setSelectedDocument(item)}
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
                                    whiteSpace: 'nowrap'
                                  }}
                                >
                                  {item.name}
                                </Typography>
                              </Box>
                              
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <Chip
                                  size="small"
                                  icon={getCategoryIcon(item.category)}
                                  label={item.category}
                                  color={getCategoryColor(item.category)}
                                />
                                {item.size && (
                                  <Typography variant="caption" color="text.secondary">
                                    {formatFileSize(item.size)}
                                  </Typography>
                                )}
                              </Box>
                              
                              <Typography variant="caption" color="text.secondary">
                                {item.date.toLocaleDateString('fr-FR')}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                      
                      {monthData.length > 6 && (
                        <Grid item xs={12}>
                          <Button
                            variant="outlined"
                            size="small"
                            sx={{ mt: 1 }}
                            onClick={() => {
                              setSelectedYear(year);
                              setSelectedMonth(month);
                            }}
                          >
                            Voir {monthData.length - 6} autre{monthData.length - 6 > 1 ? 's' : ''}...
                          </Button>
                        </Grid>
                      )}
                    </Grid>
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>
      ))}
    </Box>
  );

  const renderGridView = () => (
    <Grid container spacing={3}>
      {Object.keys(filteredTimelineData).map(year => 
        Object.keys(filteredTimelineData[year]).map(month => 
          filteredTimelineData[year][month].map(item => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
              <Card
                sx={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-8px) scale(1.05)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)'
                  }
                }}
                className="hover-lift"
                onClick={() => setSelectedDocument(item)}
              >
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        mr: 2
                      }}
                    >
                      {getFileIcon(item.type)}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" fontWeight="600" noWrap>
                        {item.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.date.toLocaleDateString('fr-FR')}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Chip
                      size="small"
                      icon={getCategoryIcon(item.category)}
                      label={item.category}
                      color={getCategoryColor(item.category)}
                    />
                  </Box>
                  
                  {item.size && (
                    <Typography variant="caption" color="text.secondary">
                      {formatFileSize(item.size)}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))
        )
      )}
    </Grid>
  );

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
              <TimelineIcon />
            </Box>
            <Box>
              <Typography variant="h5" component="h2" fontWeight="bold">
                Chronologie Interactive
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Explorez vos documents dans le temps
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant={viewMode === 'timeline' ? 'contained' : 'outlined'}
              startIcon={<ViewTimelineIcon />}
              onClick={() => setViewMode('timeline')}
              size="small"
            >
              Timeline
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'contained' : 'outlined'}
              startIcon={<ViewModuleIcon />}
              onClick={() => setViewMode('grid')}
              size="small"
            >
              Grille
            </Button>
            <Button
              variant="outlined"
              startIcon={<FilterIcon />}
              onClick={() => setShowFilters(!showFilters)}
              size="small"
            >
              Filtres
            </Button>
          </Box>
        </Box>

        {/* Filtres */}
        {showFilters && (
          <Box sx={{ mb: 3, p: 2, background: 'rgba(102, 126, 234, 0.05)', borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Filtres
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography variant="body2" gutterBottom>
                  Catégories
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {['scolaire', 'administratif', 'travail', 'personnel', 'autre'].map(cat => (
                    <Chip
                      key={cat}
                      label={cat}
                      size="small"
                      variant={filters.categories.includes(cat) ? 'filled' : 'outlined'}
                      onClick={() => {
                        setFilters(prev => ({
                          ...prev,
                          categories: prev.categories.includes(cat)
                            ? prev.categories.filter(c => c !== cat)
                            : [...prev.categories, cat]
                        }));
                      }}
                    />
                  ))}
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="body2" gutterBottom>
                  Types de fichiers
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {['image', 'video', 'audio', 'document', 'archive'].map(type => (
                    <Chip
                      key={type}
                      label={type}
                      size="small"
                      variant={filters.types.includes(type) ? 'filled' : 'outlined'}
                      onClick={() => {
                        setFilters(prev => ({
                          ...prev,
                          types: prev.types.includes(type)
                            ? prev.types.filter(t => t !== type)
                            : [...prev.types, type]
                        }));
                      }}
                    />
                  ))}
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Contenu */}
        <Box sx={{ minHeight: 400 }}>
          {viewMode === 'timeline' ? renderTimelineView() : renderGridView()}
        </Box>
      </Paper>

      {/* Dialog de détail du document */}
      <Dialog
        open={!!selectedDocument}
        onClose={() => setSelectedDocument(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedDocument && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {getFileIcon(selectedDocument.type)}
                <Typography variant="h6">
                  {selectedDocument.name}
                </Typography>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Informations
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText
                        primary="Nom"
                        secondary={selectedDocument.name}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Chemin"
                        secondary={selectedDocument.path}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Date de modification"
                        secondary={selectedDocument.date.toLocaleDateString('fr-FR')}
                      />
                    </ListItem>
                    {selectedDocument.size && (
                      <ListItem>
                        <ListItemText
                          primary="Taille"
                          secondary={formatFileSize(selectedDocument.size)}
                        />
                      </ListItem>
                    )}
                  </List>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Classification
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Chip
                      icon={getCategoryIcon(selectedDocument.category)}
                      label={selectedDocument.category}
                      color={getCategoryColor(selectedDocument.category)}
                    />
                  </Box>
                  
                  {selectedDocument.tags && (
                    <>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Tags
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {selectedDocument.tags.map(tag => (
                          <Chip key={tag} label={tag} size="small" variant="outlined" />
                        ))}
                      </Box>
                    </>
                  )}
                </Grid>
              </Grid>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default TimelineView; 