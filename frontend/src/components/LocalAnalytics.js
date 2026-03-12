import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Analytics as AnalyticsIcon,
  Storage as StorageIcon,
  Folder as FolderIcon,
  Description as DescriptionIcon,
  Image as ImageIcon,
  VideoFile as VideoIcon,
  AudioFile as AudioIcon,
  Archive as ArchiveIcon,
  Code as CodeIcon,
  TrendingUp as TrendingUpIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  ExpandMore as ExpandMoreIcon,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  Timeline as TimelineIcon,
  School as SchoolIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Category as CategoryIcon,
  Star as StarIcon,
  Bookmark as BookmarkIcon,
  Download as DownloadIcon,
  Upload as UploadIcon
} from '@mui/icons-material';

const LocalAnalytics = ({ documents, folders }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState(null);

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

  // Calculs des statistiques
  const stats = {
    totalFiles: documents.length,
    totalFolders: folders.length,
    totalSize: documents.reduce((acc, doc) => acc + (doc.size || 0), 0),
    uniqueTypes: new Set(documents.map(doc => doc.type)).size,
    favorites: documents.filter(doc => doc.favorite).length,
    bookmarks: documents.filter(doc => doc.bookmarked).length,
    recentFiles: documents.filter(doc => {
      const fileDate = new Date(doc.lastModified || 0);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return fileDate > weekAgo;
    }).length
  };

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

  // Statistiques par type de fichier
  const typeStats = documents.reduce((acc, doc) => {
    const type = doc.type || 'unknown';
    if (!acc[type]) {
      acc[type] = { count: 0, size: 0 };
    }
    acc[type].count++;
    acc[type].size += doc.size || 0;
    return acc;
  }, {});

  // Top 10 des plus gros fichiers
  const largestFiles = [...documents]
    .sort((a, b) => (b.size || 0) - (a.size || 0))
    .slice(0, 10);

  // Top 10 des fichiers récents
  const recentFiles = [...documents]
    .sort((a, b) => new Date(b.lastModified || 0) - new Date(a.lastModified || 0))
    .slice(0, 10);

  // Statistiques temporelles
  const timeStats = documents.reduce((acc, doc) => {
    if (doc.lastModified) {
      const date = new Date(doc.lastModified);
      const month = date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' });
      if (!acc[month]) {
        acc[month] = { count: 0, size: 0 };
      }
      acc[month].count++;
      acc[month].size += doc.size || 0;
    }
    return acc;
  }, {});

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
    if (type.includes('zip') || type.includes('rar') || type.includes('tar')) return <ArchiveIcon />;
    if (type.includes('text') || type.includes('code')) return <CodeIcon />;
    return <DescriptionIcon />;
  };

  return (
    <Box>
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <AnalyticsIcon sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
          <Typography variant="h5" component="h2" fontWeight="bold">
            Analytics Locales
          </Typography>
        </Box>

        {/* Statistiques générales */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={1}>
              <CardContent sx={{ textAlign: 'center' }}>
                <StorageIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="h4" color="primary" gutterBottom>
                  {stats.totalFiles}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Fichiers totaux
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={1}>
              <CardContent sx={{ textAlign: 'center' }}>
                <FolderIcon sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
                <Typography variant="h4" color="secondary" gutterBottom>
                  {stats.totalFolders}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Dossiers
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={1}>
              <CardContent sx={{ textAlign: 'center' }}>
                <TrendingUpIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                <Typography variant="h4" color="success.main" gutterBottom>
                  {formatFileSize(stats.totalSize)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Taille totale
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={1}>
              <CardContent sx={{ textAlign: 'center' }}>
                <CategoryIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                <Typography variant="h4" color="warning.main" gutterBottom>
                  {stats.uniqueTypes}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Types de fichiers
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Statistiques détaillées */}
        <Grid container spacing={3}>
          {/* Statistiques par catégorie */}
          <Grid item xs={12} md={6}>
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PieChartIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Par Catégorie</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  {Object.entries(categoryStats).map(([category, data]) => (
                    <React.Fragment key={category}>
                      <ListItem>
                        <ListItemIcon>
                          {getCategoryIcon(category)}
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                                {category}
                              </Typography>
                              <Chip
                                label={`${data.count} fichiers`}
                                size="small"
                                color={getCategoryColor(category)}
                              />
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                {formatFileSize(data.size)} • {((data.count / stats.totalFiles) * 100).toFixed(1)}%
                              </Typography>
                              <LinearProgress
                                variant="determinate"
                                value={(data.count / stats.totalFiles) * 100}
                                sx={{ mt: 1, height: 4, borderRadius: 2 }}
                                color={getCategoryColor(category)}
                              />
                            </Box>
                          }
                        />
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          </Grid>

          {/* Statistiques par type */}
          <Grid item xs={12} md={6}>
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <BarChartIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Par Type de Fichier</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  {Object.entries(typeStats)
                    .sort((a, b) => b[1].count - a[1].count)
                    .slice(0, 10)
                    .map(([type, data]) => (
                      <React.Fragment key={type}>
                        <ListItem>
                          <ListItemIcon>
                            {getFileIcon(type)}
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                  {type}
                                </Typography>
                                <Chip
                                  label={`${data.count} fichiers`}
                                  size="small"
                                  variant="outlined"
                                />
                              </Box>
                            }
                            secondary={
                              <Box>
                                <Typography variant="body2" color="text.secondary">
                                  {formatFileSize(data.size)} • {((data.count / stats.totalFiles) * 100).toFixed(1)}%
                                </Typography>
                                <LinearProgress
                                  variant="determinate"
                                  value={(data.count / stats.totalFiles) * 100}
                                  sx={{ mt: 1, height: 4, borderRadius: 2 }}
                                />
                              </Box>
                            }
                          />
                        </ListItem>
                        <Divider />
                      </React.Fragment>
                    ))}
                </List>
              </AccordionDetails>
            </Accordion>
          </Grid>

          {/* Plus gros fichiers */}
          <Grid item xs={12} md={6}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <DownloadIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Plus Gros Fichiers</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Fichier</TableCell>
                        <TableCell align="right">Taille</TableCell>
                        <TableCell align="right">Type</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {largestFiles.map((file, index) => (
                        <TableRow key={file.id} hover>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              {getFileIcon(file.type)}
                              <Typography variant="body2" sx={{ ml: 1, maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {file.name}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight="bold">
                              {formatFileSize(file.size || 0)}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Chip
                              size="small"
                              label={file.type}
                              variant="outlined"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </AccordionDetails>
            </Accordion>
          </Grid>

          {/* Fichiers récents */}
          <Grid item xs={12} md={6}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TimeIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Fichiers Récents</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Fichier</TableCell>
                        <TableCell align="right">Date</TableCell>
                        <TableCell align="right">Taille</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recentFiles.map((file) => (
                        <TableRow key={file.id} hover>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              {getFileIcon(file.type)}
                              <Typography variant="body2" sx={{ ml: 1, maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {file.name}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2">
                              {formatDate(file.lastModified)}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2">
                              {formatFileSize(file.size || 0)}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </AccordionDetails>
            </Accordion>
          </Grid>

          {/* Statistiques temporelles */}
          <Grid item xs={12}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TimelineIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Évolution Temporelle</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  {Object.entries(timeStats)
                    .sort((a, b) => new Date(b[0]) - new Date(a[0]))
                    .slice(0, 12)
                    .map(([month, data]) => (
                      <Grid item xs={12} sm={6} md={4} lg={3} key={month}>
                        <Card elevation={1}>
                          <CardContent>
                            <Typography variant="h6" gutterBottom>
                              {month}
                            </Typography>
                            <Typography variant="h4" color="primary" gutterBottom>
                              {data.count}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {formatFileSize(data.size)}
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={(data.count / stats.totalFiles) * 100}
                              sx={{ mt: 1, height: 4, borderRadius: 2 }}
                            />
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>

        {/* Actions rapides */}
        <Box sx={{ mt: 4, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Actions Rapides
          </Typography>
          <Grid container spacing={2}>
            <Grid item>
              <Button
                variant="outlined"
                startIcon={<StarIcon />}
                onClick={() => setSelectedMetric('favorites')}
              >
                {stats.favorites} Favoris
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                startIcon={<BookmarkIcon />}
                onClick={() => setSelectedMetric('bookmarks')}
              >
                {stats.bookmarks} Marqués
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                startIcon={<CalendarIcon />}
                onClick={() => setSelectedMetric('recent')}
              >
                {stats.recentFiles} Récents (7j)
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Dialog pour les détails */}
      <Dialog
        open={!!selectedMetric}
        onClose={() => setSelectedMetric(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedMetric && (
          <>
            <DialogTitle>
              <Typography variant="h6">
                {selectedMetric === 'favorites' && 'Fichiers Favoris'}
                {selectedMetric === 'bookmarks' && 'Fichiers Marqués'}
                {selectedMetric === 'recent' && 'Fichiers Récents'}
              </Typography>
            </DialogTitle>
            <DialogContent>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Fichier</TableCell>
                      <TableCell>Catégorie</TableCell>
                      <TableCell align="right">Taille</TableCell>
                      <TableCell align="right">Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {documents
                      .filter(doc => {
                        if (selectedMetric === 'favorites') return doc.favorite;
                        if (selectedMetric === 'bookmarks') return doc.bookmarked;
                        if (selectedMetric === 'recent') {
                          const fileDate = new Date(doc.lastModified || 0);
                          const weekAgo = new Date();
                          weekAgo.setDate(weekAgo.getDate() - 7);
                          return fileDate > weekAgo;
                        }
                        return false;
                      })
                      .map((doc) => (
                        <TableRow key={doc.id} hover>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              {getFileIcon(doc.type)}
                              <Typography variant="body2" sx={{ ml: 1 }}>
                                {doc.name}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              size="small"
                              icon={getCategoryIcon(doc.category)}
                              label={doc.category}
                              color={getCategoryColor(doc.category)}
                            />
                          </TableCell>
                          <TableCell align="right">
                            {formatFileSize(doc.size || 0)}
                          </TableCell>
                          <TableCell align="right">
                            {formatDate(doc.lastModified)}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedMetric(null)}>
                Fermer
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default LocalAnalytics; 