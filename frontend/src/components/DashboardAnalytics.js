import React, { useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Divider,
  Button,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar,
  Badge
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Storage as StorageIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  CalendarToday as CalendarIcon,
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
  Star as StarIcon,
  Bookmark as BookmarkIcon,
  AccessTime as TimeIcon,
  ExpandMore as ExpandMoreIcon,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  Timeline as TimelineIcon,
  DonutLarge as DonutLargeIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Print as PrintIcon
} from '@mui/icons-material';

const DashboardAnalytics = ({ documents = [], folders = [] }) => {
  // Calculer les statistiques
  const stats = useMemo(() => {
    const totalFiles = documents.length;
    const totalFolders = folders.length;
    const totalSize = documents.reduce((sum, doc) => sum + (doc.size || 0), 0);
    
    // Statistiques par catégorie
    const categoryStats = documents.reduce((acc, doc) => {
      const category = doc.category || 'autre';
      if (!acc[category]) {
        acc[category] = { count: 0, size: 0, files: [] };
      }
      acc[category].count++;
      acc[category].size += doc.size || 0;
      acc[category].files.push(doc);
      return acc;
    }, {});

    // Statistiques par type
    const typeStats = documents.reduce((acc, doc) => {
      const type = doc.type?.split('/')[0] || 'document';
      if (!acc[type]) {
        acc[type] = { count: 0, size: 0 };
      }
      acc[type].count++;
      acc[type].size += doc.size || 0;
      return acc;
    }, {});

    // Statistiques temporelles
    const monthlyStats = documents.reduce((acc, doc) => {
      const date = new Date(doc.lastModified || doc.created_at || Date.now());
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!acc[monthKey]) {
        acc[monthKey] = { count: 0, size: 0 };
      }
      acc[monthKey].count++;
      acc[monthKey].size += doc.size || 0;
      return acc;
    }, {});

    // Favoris et bookmarks
    const favorites = documents.filter(doc => doc.favorite);
    const bookmarks = documents.filter(doc => doc.bookmark);

    // Fichiers récents (7 derniers jours)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentFiles = documents.filter(doc => 
      new Date(doc.lastModified || doc.created_at) > sevenDaysAgo
    );

    // Plus gros fichiers
    const largestFiles = [...documents]
      .sort((a, b) => (b.size || 0) - (a.size || 0))
      .slice(0, 5);

    // Statistiques d'utilisation de l'espace
    const spaceUsage = {
      total: totalSize,
      used: totalSize,
      available: 1024 * 1024 * 1024 * 100, // 100 GB simulé
      percentage: (totalSize / (1024 * 1024 * 1024 * 100)) * 100
    };

    return {
      totalFiles,
      totalFolders,
      totalSize,
      categoryStats,
      typeStats,
      monthlyStats,
      favorites,
      bookmarks,
      recentFiles,
      largestFiles,
      spaceUsage
    };
  }, [documents, folders]);

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

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return <ImageIcon />;
    if (type.startsWith('video/')) return <VideoIcon />;
    if (type.startsWith('audio/')) return <AudioIcon />;
    if (type.includes('zip') || type.includes('rar')) return <ArchiveIcon />;
    if (type.includes('text') || type.includes('code')) return <CodeIcon />;
    return <FileIcon />;
  };

  const getFileTypeColor = (type) => {
    switch (type) {
      case 'image': return 'success';
      case 'video': return 'warning';
      case 'audio': return 'info';
      case 'application': return 'primary';
      case 'text': return 'secondary';
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
              <DashboardIcon />
            </Box>
            <Box>
              <Typography variant="h5" component="h2" fontWeight="bold">
                Tableau de Bord Analytique
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Vue d'ensemble de votre classeur numérique
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Actualiser">
              <IconButton>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Exporter">
              <IconButton>
                <DownloadIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Imprimer">
              <IconButton>
                <PrintIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Statistiques principales */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                borderRadius: 2
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {stats.totalFiles}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      Fichiers totaux
                    </Typography>
                  </Box>
                  <FileIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: 'white',
                borderRadius: 2
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {formatFileSize(stats.totalSize)}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      Espace utilisé
                    </Typography>
                  </Box>
                  <StorageIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                color: 'white',
                borderRadius: 2
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {stats.favorites.length}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      Favoris
                    </Typography>
                  </Box>
                  <StarIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                color: 'white',
                borderRadius: 2
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {stats.recentFiles.length}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      Nouveaux (7j)
                    </Typography>
                  </Box>
                  <TrendingUpIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Utilisation de l'espace */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Utilisation de l'Espace
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">
                      {formatFileSize(stats.spaceUsage.used)} utilisés
                    </Typography>
                    <Typography variant="body2">
                      {formatFileSize(stats.spaceUsage.available)} disponibles
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(stats.spaceUsage.percentage, 100)}
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
                <Typography variant="body2" color="text.secondary">
                  {stats.spaceUsage.percentage.toFixed(1)}% de l'espace utilisé
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Répartition par Type
                </Typography>
                <List dense>
                  {Object.entries(stats.typeStats)
                    .sort(([,a], [,b]) => b.count - a.count)
                    .slice(0, 5)
                    .map(([type, data]) => (
                      <ListItem key={type}>
                        <ListItemIcon>
                          {getFileIcon(type)}
                        </ListItemIcon>
                        <ListItemText
                          primary={type}
                          secondary={`${data.count} fichiers • ${formatFileSize(data.size)}`}
                        />
                        <ListItemSecondaryAction>
                          <Chip
                            label={`${((data.count / stats.totalFiles) * 100).toFixed(1)}%`}
                            size="small"
                            color={getFileTypeColor(type)}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Statistiques détaillées */}
        <Grid container spacing={3}>
          {/* Par catégorie */}
          <Grid item xs={12} md={6}>
            <Accordion defaultExpanded sx={{ borderRadius: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CategoryIcon color="primary" />
                  <Typography variant="h6">
                    Répartition par Catégorie
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  {Object.entries(stats.categoryStats)
                    .sort(([,a], [,b]) => b.count - a.count)
                    .map(([category, data]) => (
                      <ListItem key={category}>
                        <ListItemIcon>
                          <Avatar sx={{ bgcolor: `${getCategoryColor(category)}.main` }}>
                            {getCategoryIcon(category)}
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={category}
                          secondary={`${data.count} fichiers • ${formatFileSize(data.size)}`}
                        />
                        <ListItemSecondaryAction>
                          <Chip
                            label={`${((data.count / stats.totalFiles) * 100).toFixed(1)}%`}
                            color={getCategoryColor(category)}
                            size="small"
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                </List>
              </AccordionDetails>
            </Accordion>
          </Grid>

          {/* Fichiers récents */}
          <Grid item xs={12} md={6}>
            <Accordion defaultExpanded sx={{ borderRadius: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <TimeIcon color="primary" />
                  <Typography variant="h6">
                    Fichiers Récents
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  {stats.recentFiles
                    .sort((a, b) => new Date(b.lastModified || b.created_at) - new Date(a.lastModified || a.created_at))
                    .slice(0, 5)
                    .map((doc) => (
                      <ListItem key={doc.id}>
                        <ListItemIcon>
                          {getFileIcon(doc.type)}
                        </ListItemIcon>
                        <ListItemText
                          primary={doc.name}
                          secondary={`${formatFileSize(doc.size)} • ${formatDate(doc.lastModified || doc.created_at)}`}
                        />
                        <ListItemSecondaryAction>
                          <Chip
                            label={doc.category}
                            size="small"
                            color={getCategoryColor(doc.category)}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                </List>
              </AccordionDetails>
            </Accordion>
          </Grid>

          {/* Plus gros fichiers */}
          <Grid item xs={12}>
            <Accordion sx={{ borderRadius: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <StorageIcon color="primary" />
                  <Typography variant="h6">
                    Plus Gros Fichiers
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Fichier</TableCell>
                        <TableCell>Catégorie</TableCell>
                        <TableCell>Taille</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {stats.largestFiles.map((doc) => (
                        <TableRow key={doc.id}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {getFileIcon(doc.type)}
                              <Typography variant="body2">
                                {doc.name}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={doc.category}
                              size="small"
                              color={getCategoryColor(doc.category)}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight="bold">
                              {formatFileSize(doc.size)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {formatDate(doc.lastModified || doc.created_at)}
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              {doc.favorite && <StarIcon color="warning" fontSize="small" />}
                              {doc.bookmark && <BookmarkIcon color="primary" fontSize="small" />}
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default DashboardAnalytics; 