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
  Checkbox,
  FormControlLabel,
  Switch,
  Tooltip,
  Alert,
  Divider,
  Badge,
  Avatar,
  LinearProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Schedule as ScheduleIcon,
  PriorityHigh as PriorityIcon,
  Star as StarIcon,
  Bookmark as BookmarkIcon,
  Description as DocumentIcon,
  Link as LinkIcon,
  Category as CategoryIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  Flag as FlagIcon,
  Assignment as AssignmentIcon,
  School as SchoolIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  Refresh as RefreshIcon,
  Archive as ArchiveIcon,
  RestoreFromTrash as RestoreIcon
} from '@mui/icons-material';

const AdvancedToDoList = ({ documents = [], onTaskCreated, onTaskUpdated, onTaskDeleted }) => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: '',
    dueDate: '',
    linkedDocuments: [],
    tags: [],
    isCompleted: false,
    isImportant: false,
    isUrgent: false
  });
  const [editingTask, setEditingTask] = useState(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [filters, setFilters] = useState({
    showCompleted: false,
    showImportant: false,
    showUrgent: false,
    category: '',
    priority: '',
    search: ''
  });
  const [sortBy, setSortBy] = useState('dueDate');
  const [sortOrder, setSortOrder] = useState('asc');

  // Calculer les statistiques
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.isCompleted).length;
    const important = tasks.filter(task => task.isImportant).length;
    const urgent = tasks.filter(task => task.isUrgent).length;
    const overdue = tasks.filter(task => {
      if (!task.dueDate || task.isCompleted) return false;
      return new Date(task.dueDate) < new Date();
    }).length;
    const today = tasks.filter(task => {
      if (!task.dueDate || task.isCompleted) return false;
      const today = new Date();
      const dueDate = new Date(task.dueDate);
      return dueDate.toDateString() === today.toDateString();
    }).length;

    return { total, completed, important, urgent, overdue, today };
  }, [tasks]);

  // Filtrer et trier les tâches
  const filteredTasks = useMemo(() => {
    let filtered = tasks.filter(task => {
      // Filtre de recherche
      if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase()) &&
          !task.description.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      
      // Filtre de catégorie
      if (filters.category && task.category !== filters.category) {
        return false;
      }
      
      // Filtre de priorité
      if (filters.priority && task.priority !== filters.priority) {
        return false;
      }
      
      // Filtre important
      if (filters.showImportant && !task.isImportant) {
        return false;
      }
      
      // Filtre urgent
      if (filters.showUrgent && !task.isUrgent) {
        return false;
      }
      
      // Filtre complétées
      if (!filters.showCompleted && task.isCompleted) {
        return false;
      }
      
      return true;
    });

    // Tri
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'dueDate':
          aValue = a.dueDate ? new Date(a.dueDate) : new Date('9999-12-31');
          bValue = b.dueDate ? new Date(b.dueDate) : new Date('9999-12-31');
          break;
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          aValue = priorityOrder[a.priority] || 0;
          bValue = priorityOrder[b.priority] || 0;
          break;
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'category':
          aValue = a.category.toLowerCase();
          bValue = b.category.toLowerCase();
          break;
        default:
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [tasks, filters, sortBy, sortOrder]);

  const handleAddTask = () => {
    if (!newTask.title.trim()) return;
    
    const task = {
      id: Date.now().toString(),
      ...newTask,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setTasks(prev => [...prev, task]);
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      category: '',
      dueDate: '',
      linkedDocuments: [],
      tags: [],
      isCompleted: false,
      isImportant: false,
      isUrgent: false
    });
    setShowAddDialog(false);
    
    if (onTaskCreated) onTaskCreated(task);
  };

  const handleUpdateTask = () => {
    if (!editingTask.title.trim()) return;
    
    const updatedTask = {
      ...editingTask,
      updatedAt: new Date().toISOString()
    };
    
    setTasks(prev => prev.map(task => 
      task.id === editingTask.id ? updatedTask : task
    ));
    setEditingTask(null);
    setShowEditDialog(false);
    
    if (onTaskUpdated) onTaskUpdated(updatedTask);
  };

  const handleDeleteTask = (taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    if (onTaskDeleted) onTaskDeleted(taskId);
  };

  const handleToggleComplete = (taskId) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, isCompleted: !task.isCompleted, updatedAt: new Date().toISOString() }
        : task
    ));
  };

  const handleToggleImportant = (taskId) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, isImportant: !task.isImportant, updatedAt: new Date().toISOString() }
        : task
    ));
  };

  const handleToggleUrgent = (taskId) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, isUrgent: !task.isUrgent, updatedAt: new Date().toISOString() }
        : task
    ));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return <PriorityIcon color="error" />;
      case 'medium': return <PriorityIcon color="warning" />;
      case 'low': return <PriorityIcon color="success" />;
      default: return <PriorityIcon />;
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'scolaire': return <SchoolIcon />;
      case 'travail': return <BusinessIcon />;
      case 'personnel': return <PersonIcon />;
      case 'administratif': return <DocumentIcon />;
      default: return <CategoryIcon />;
    }
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  const isDueToday = (dueDate) => {
    if (!dueDate) return false;
    const today = new Date();
    const due = new Date(dueDate);
    return due.toDateString() === today.toDateString();
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR');
  };

  const availableCategories = ['scolaire', 'travail', 'personnel', 'administratif'];
  const availablePriorities = ['low', 'medium', 'high'];

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
              <AssignmentIcon />
            </Box>
            <Box>
              <Typography variant="h5" component="h2" fontWeight="bold">
                To-Do List Avancée
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Gérez vos tâches et projets avec des liens vers vos documents
              </Typography>
            </Box>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setShowAddDialog(true)}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
              }
            }}
          >
            Nouvelle Tâche
          </Button>
        </Box>

        {/* Statistiques */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6} sm={4} md={2}>
            <Card sx={{ textAlign: 'center', borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h4" color="primary">
                  {stats.total}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <Card sx={{ textAlign: 'center', borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h4" color="success.main">
                  {stats.completed}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Terminées
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <Card sx={{ textAlign: 'center', borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h4" color="warning.main">
                  {stats.important}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Importantes
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <Card sx={{ textAlign: 'center', borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h4" color="error">
                  {stats.urgent}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Urgentes
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <Card sx={{ textAlign: 'center', borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h4" color="error">
                  {stats.overdue}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  En retard
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <Card sx={{ textAlign: 'center', borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h4" color="info.main">
                  {stats.today}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Aujourd'hui
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Barre de progression */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">
              Progression globale
            </Typography>
            <Typography variant="body2">
              {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}
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

        {/* Filtres et tri */}
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                size="small"
                placeholder="Rechercher..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                InputProps={{
                  startAdornment: <FilterIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            <Grid item xs={6} sm={3} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Catégorie</InputLabel>
                <Select
                  value={filters.category}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                  label="Catégorie"
                >
                  <MenuItem value="">Toutes</MenuItem>
                  {availableCategories.map(cat => (
                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} sm={3} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Priorité</InputLabel>
                <Select
                  value={filters.priority}
                  onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                  label="Priorité"
                >
                  <MenuItem value="">Toutes</MenuItem>
                  {availablePriorities.map(pri => (
                    <MenuItem key={pri} value={pri}>{pri}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={12} md={5}>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={filters.showCompleted}
                      onChange={(e) => setFilters(prev => ({ ...prev, showCompleted: e.target.checked }))}
                      size="small"
                    />
                  }
                  label="Terminées"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={filters.showImportant}
                      onChange={(e) => setFilters(prev => ({ ...prev, showImportant: e.target.checked }))}
                      size="small"
                    />
                  }
                  label="Importantes"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={filters.showUrgent}
                      onChange={(e) => setFilters(prev => ({ ...prev, showUrgent: e.target.checked }))}
                      size="small"
                    />
                  }
                  label="Urgentes"
                />
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Liste des tâches */}
        <List>
          {filteredTasks.map((task) => (
            <ListItem
              key={task.id}
              sx={{
                mb: 2,
                borderRadius: 2,
                border: 1,
                borderColor: 'divider',
                background: task.isCompleted ? 'rgba(0, 0, 0, 0.02)' : 'white',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  transform: 'translateY(-2px)',
                  transition: 'all 0.3s ease'
                }
              }}
            >
              <ListItemIcon>
                <Checkbox
                  checked={task.isCompleted}
                  onChange={() => handleToggleComplete(task.id)}
                  color="primary"
                />
              </ListItemIcon>
              
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    <Typography
                      variant="body1"
                      sx={{
                        textDecoration: task.isCompleted ? 'line-through' : 'none',
                        color: task.isCompleted ? 'text.secondary' : 'text.primary',
                        fontWeight: task.isImportant ? 'bold' : 'normal'
                      }}
                    >
                      {task.title}
                    </Typography>
                    
                    {task.isImportant && (
                      <StarIcon color="warning" fontSize="small" />
                    )}
                    
                    {task.isUrgent && (
                      <FlagIcon color="error" fontSize="small" />
                    )}
                    
                    {isOverdue(task.dueDate) && (
                      <Chip
                        label="En retard"
                        size="small"
                        color="error"
                        icon={<ScheduleIcon />}
                      />
                    )}
                    
                    {isDueToday(task.dueDate) && (
                      <Chip
                        label="Aujourd'hui"
                        size="small"
                        color="info"
                        icon={<CalendarIcon />}
                      />
                    )}
                  </Box>
                }
                secondary={
                  <Box sx={{ mt: 1 }}>
                    {task.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {task.description}
                      </Typography>
                    )}
                    
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                      {task.category && (
                        <Chip
                          label={task.category}
                          size="small"
                          icon={getCategoryIcon(task.category)}
                          variant="outlined"
                        />
                      )}
                      
                      <Chip
                        label={task.priority}
                        size="small"
                        color={getPriorityColor(task.priority)}
                        icon={getPriorityIcon(task.priority)}
                      />
                      
                      {task.dueDate && (
                        <Chip
                          label={formatDate(task.dueDate)}
                          size="small"
                          icon={<TimeIcon />}
                          variant="outlined"
                        />
                      )}
                      
                      {task.linkedDocuments.length > 0 && (
                        <Chip
                          label={`${task.linkedDocuments.length} doc(s)`}
                          size="small"
                          icon={<LinkIcon />}
                          color="primary"
                        />
                      )}
                    </Box>
                  </Box>
                }
              />
              
              <ListItemSecondaryAction>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title="Marquer comme importante">
                    <IconButton
                      onClick={() => handleToggleImportant(task.id)}
                      color={task.isImportant ? 'warning' : 'default'}
                    >
                      <StarIcon />
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="Marquer comme urgente">
                    <IconButton
                      onClick={() => handleToggleUrgent(task.id)}
                      color={task.isUrgent ? 'error' : 'default'}
                    >
                      <FlagIcon />
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="Modifier">
                    <IconButton
                      onClick={() => {
                        setEditingTask(task);
                        setShowEditDialog(true);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="Supprimer">
                    <IconButton
                      onClick={() => handleDeleteTask(task.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>

        {filteredTasks.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Aucune tâche trouvée
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Créez votre première tâche pour commencer
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Dialog d'ajout de tâche */}
      <Dialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}
        >
          Nouvelle Tâche
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Titre de la tâche"
                value={newTask.title}
                onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                placeholder="ex: Lire le PDF Java pour l'examen"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={newTask.description}
                onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Détails de la tâche..."
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Catégorie</InputLabel>
                <Select
                  value={newTask.category}
                  onChange={(e) => setNewTask(prev => ({ ...prev, category: e.target.value }))}
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
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Priorité</InputLabel>
                <Select
                  value={newTask.priority}
                  onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value }))}
                  label="Priorité"
                >
                  {availablePriorities.map(pri => (
                    <MenuItem key={pri} value={pri}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getPriorityIcon(pri)}
                        {pri}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Date d'échéance"
                value={newTask.dueDate}
                onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Autocomplete
                multiple
                options={documents.map(doc => ({ id: doc.id, name: doc.name }))}
                getOptionLabel={(option) => option.name}
                value={newTask.linkedDocuments}
                onChange={(e, newValue) => setNewTask(prev => ({ ...prev, linkedDocuments: newValue }))}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Documents liés"
                    placeholder="Sélectionner des documents"
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={option.id}
                      label={option.name}
                      size="small"
                    />
                  ))
                }
              />
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={newTask.isImportant}
                      onChange={(e) => setNewTask(prev => ({ ...prev, isImportant: e.target.checked }))}
                    />
                  }
                  label="Importante"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={newTask.isUrgent}
                      onChange={(e) => setNewTask(prev => ({ ...prev, isUrgent: e.target.checked }))}
                    />
                  }
                  label="Urgente"
                />
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setShowAddDialog(false)}>
            Annuler
          </Button>
          <Button
            variant="contained"
            onClick={handleAddTask}
            disabled={!newTask.title.trim()}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
              }
            }}
          >
            Créer la tâche
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de modification de tâche */}
      <Dialog
        open={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}
        >
          Modifier la Tâche
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {editingTask && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Titre de la tâche"
                  value={editingTask.title}
                  onChange={(e) => setEditingTask(prev => ({ ...prev, title: e.target.value }))}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Description"
                  value={editingTask.description}
                  onChange={(e) => setEditingTask(prev => ({ ...prev, description: e.target.value }))}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Catégorie</InputLabel>
                  <Select
                    value={editingTask.category}
                    onChange={(e) => setEditingTask(prev => ({ ...prev, category: e.target.value }))}
                    label="Catégorie"
                  >
                    {availableCategories.map(cat => (
                      <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Priorité</InputLabel>
                  <Select
                    value={editingTask.priority}
                    onChange={(e) => setEditingTask(prev => ({ ...prev, priority: e.target.value }))}
                    label="Priorité"
                  >
                    {availablePriorities.map(pri => (
                      <MenuItem key={pri} value={pri}>{pri}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Date d'échéance"
                  value={editingTask.dueDate}
                  onChange={(e) => setEditingTask(prev => ({ ...prev, dueDate: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  multiple
                  options={documents.map(doc => ({ id: doc.id, name: doc.name }))}
                  getOptionLabel={(option) => option.name}
                  value={editingTask.linkedDocuments}
                  onChange={(e, newValue) => setEditingTask(prev => ({ ...prev, linkedDocuments: newValue }))}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Documents liés"
                      placeholder="Sélectionner des documents"
                    />
                  )}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={editingTask.isImportant}
                        onChange={(e) => setEditingTask(prev => ({ ...prev, isImportant: e.target.checked }))}
                      />
                    }
                    label="Importante"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={editingTask.isUrgent}
                        onChange={(e) => setEditingTask(prev => ({ ...prev, isUrgent: e.target.checked }))}
                      />
                    }
                    label="Urgente"
                  />
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setShowEditDialog(false)}>
            Annuler
          </Button>
          <Button
            variant="contained"
            onClick={handleUpdateTask}
            disabled={!editingTask?.title.trim()}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
              }
            }}
          >
            Mettre à jour
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdvancedToDoList; 