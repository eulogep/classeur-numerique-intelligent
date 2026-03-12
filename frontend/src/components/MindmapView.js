import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Tooltip,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  ZoomIn,
  ZoomOut,
  CenterFocusStrong,
  Fullscreen,
  FullscreenExit,
  Folder,
  Storage,
  Category,
  School,
  Work,
  Home,
  Description,
  Image,
  VideoFile,
  Audiotrack,
  Code,
  Archive
} from '@mui/icons-material';

const MindmapView = ({ documents, folders, onSelectDocument, onSelectFolder }) => {
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [layout, setLayout] = useState('radial'); // radial, hierarchical, force
  const [showConnections, setShowConnections] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [autoLayout, setAutoLayout] = useState(true);
  const [nodeSize, setNodeSize] = useState(50);
  const [connectionStrength] = useState(2);
  const [showStats, setShowStats] = useState(false);
  const [highlightedPath, setHighlightedPath] = useState([]);

  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  // Calculer les statistiques
  const stats = useMemo(() => {
    const totalFiles = documents.length;
    const totalFolders = folders.length;
    const categories = {};
    const types = {};
    const sizes = {};

    documents.forEach(doc => {
      categories[doc.category] = (categories[doc.category] || 0) + 1;
      types[doc.type] = (types[doc.type] || 0) + 1;
      const size = doc.size || 0;
      if (size < 1024 * 1024) sizes.small = (sizes.small || 0) + 1;
      else if (size < 10 * 1024 * 1024) sizes.medium = (sizes.medium || 0) + 1;
      else sizes.large = (sizes.large || 0) + 1;
    });

    return {
      totalFiles,
      totalFolders,
      categories,
      types,
      sizes,
      totalSize: documents.reduce((sum, doc) => sum + (doc.size || 0), 0)
    };
  }, [documents, folders]);

  // Construire la structure de données pour le mindmap
  const mindmapData = useMemo(() => {
    const nodes = [];
    const connections = [];
    const nodeMap = new Map();

    // Ajouter les dossiers comme nœuds
    folders.forEach((folder, index) => {
      const node = {
        id: folder.id,
        name: folder.name,
        type: 'folder',
        category: folder.category || 'general',
        x: 0,
        y: 0,
        size: nodeSize,
        color: getCategoryColor(folder.category || 'general'),
        icon: getCategoryIcon(folder.category || 'general'),
        children: [],
        documents: documents.filter(doc => doc.folder_id === folder.id),
        level: getFolderLevel(folder, folders),
        parent_id: folder.parent_id
      };
      nodes.push(node);
      nodeMap.set(folder.id, node);
    });

    // Ajouter les documents orphelins comme nœuds
    const orphanDocs = documents.filter(doc => !doc.folder_id);
    if (orphanDocs.length > 0) {
      const orphanNode = {
        id: 'orphan-docs',
        name: 'Documents orphelins',
        type: 'folder',
        category: 'general',
        x: 0,
        y: 0,
        size: nodeSize,
        color: '#9e9e9e',
        icon: <Description />,
        children: [],
        documents: orphanDocs,
        level: 0,
        parent_id: null
      };
      nodes.push(orphanNode);
      nodeMap.set('orphan-docs', orphanNode);
    }

    // Créer les connexions parent-enfant
    nodes.forEach(node => {
      if (node.parent_id && nodeMap.has(node.parent_id)) {
        connections.push({
          from: node.parent_id,
          to: node.id,
          strength: connectionStrength,
          color: '#667eea'
        });
      }
    });

    return { nodes, connections };
  }, [documents, folders, nodeSize, connectionStrength]);

  // Fonctions utilitaires
  function getCategoryColor(category) {
    const colors = {
      'scolaire': '#4caf50',
      'administratif': '#2196f3',
      'personnel': '#ff9800',
      'travail': '#9c27b0',
      'finance': '#f44336',
      'sante': '#00bcd4',
      'general': '#9e9e9e'
    };
    return colors[category] || colors.general;
  }

  function getCategoryIcon(category) {
    const icons = {
      'scolaire': <School />,
      'administratif': <Work />,
      'personnel': <Home />,
      'travail': <Work />,
      'finance': <Description />,
      'sante': <Description />,
      'general': <Folder />
    };
    return icons[category] || icons.general;
  }

  function getFolderLevel(folder, allFolders) {
    let level = 0;
    let current = folder;
    while (current.parent_id) {
      current = allFolders.find(f => f.id === current.parent_id);
      if (!current) break;
      level++;
    }
    return level;
  }

  function getFileIcon(type) {
    const icons = {
      'pdf': <Description />,
      'image': <Image />,
      'video': <VideoFile />,
      'audio': <Audiotrack />,
      'code': <Code />,
      'archive': <Archive />,
      'document': <Description />
    };
    return icons[type] || icons.document;
  }

  // Fonctions de navigation et interaction
  const handleZoomIn = () => setZoom(prev => Math.min(prev * 1.2, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev / 1.2, 0.1));
  const handleCenter = () => {
    setCenter({ x: 0, y: 0 });
    setZoom(1);
  };

  const handleNodeClick = (node) => {
    setSelectedNode(node);
    setShowDetails(true);
    if (node.type === 'folder') {
      onSelectFolder?.(node);
    }
  };

  const handleDocumentClick = (document) => {
    onSelectDocument?.(document);
  };



  // Rendu du canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const drawMindmap = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(canvas.width / 2 + center.x, canvas.height / 2 + center.y);
      ctx.scale(zoom, zoom);

      // Dessiner les connexions
      if (showConnections) {
        mindmapData.connections.forEach(connection => {
          const fromNode = mindmapData.nodes.find(n => n.id === connection.from);
          const toNode = mindmapData.nodes.find(n => n.id === connection.to);
          
          if (fromNode && toNode) {
            ctx.beginPath();
            ctx.moveTo(fromNode.x, fromNode.y);
            ctx.lineTo(toNode.x, toNode.y);
            ctx.strokeStyle = connection.color;
            ctx.lineWidth = connection.strength;
            ctx.stroke();
          }
        });
      }

      // Dessiner les nœuds
      mindmapData.nodes.forEach(node => {
        const isHighlighted = highlightedPath.includes(node.id);
        const isSelected = selectedNode?.id === node.id;

        // Cercle du nœud
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size, 0, 2 * Math.PI);
        ctx.fillStyle = isHighlighted ? '#ffeb3b' : node.color;
        ctx.fill();
        
        if (isSelected) {
          ctx.strokeStyle = '#667eea';
          ctx.lineWidth = 3;
          ctx.stroke();
        }

        // Bordure
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Texte du nœud
        if (showLabels) {
          ctx.fillStyle = '#ffffff';
          ctx.font = '12px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(node.name, node.x, node.y + node.size + 20);
        }

        // Indicateur de contenu
        if (node.documents.length > 0) {
          ctx.beginPath();
          ctx.arc(node.x + node.size - 5, node.y - node.size + 5, 8, 0, 2 * Math.PI);
          ctx.fillStyle = '#ff5722';
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.font = '10px Arial';
          ctx.fillText(node.documents.length, node.x + node.size - 5, node.y - node.size + 8);
        }
      });

      ctx.restore();
    };

    drawMindmap();
    animationRef.current = requestAnimationFrame(drawMindmap);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mindmapData, zoom, center, showConnections, showLabels, highlightedPath, selectedNode]);

  // Gestion des événements de souris
  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - canvas.width / 2) / zoom - center.x;
    const y = (e.clientY - rect.top - canvas.height / 2) / zoom - center.y;

    // Vérifier si on clique sur un nœud
    const clickedNode = mindmapData.nodes.find(node => {
      const distance = Math.sqrt((node.x - x) ** 2 + (node.y - y) ** 2);
      return distance <= node.size;
    });

    if (clickedNode) {
      handleNodeClick(clickedNode);
    }
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.max(0.1, Math.min(3, prev * delta)));
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Barre d'outils */}
      <Paper 
        elevation={3} 
        sx={{ 
          p: 2, 
          mb: 2, 
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Tooltip title="Zoom +">
                <IconButton onClick={handleZoomIn} sx={{ color: '#667eea' }}>
                  <ZoomIn />
                </IconButton>
              </Tooltip>
              <Tooltip title="Zoom -">
                <IconButton onClick={handleZoomOut} sx={{ color: '#667eea' }}>
                  <ZoomOut />
                </IconButton>
              </Tooltip>
              <Tooltip title="Centrer">
                <IconButton onClick={handleCenter} sx={{ color: '#667eea' }}>
                  <CenterFocusStrong />
                </IconButton>
              </Tooltip>
              <Tooltip title={fullscreen ? "Quitter plein écran" : "Plein écran"}>
                <IconButton 
                  onClick={() => setFullscreen(!fullscreen)} 
                  sx={{ color: '#667eea' }}
                >
                  {fullscreen ? <FullscreenExit /> : <Fullscreen />}
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Disposition</InputLabel>
                <Select
                  value={layout}
                  onChange={(e) => setLayout(e.target.value)}
                  label="Disposition"
                >
                  <MenuItem value="radial">Radiale</MenuItem>
                  <MenuItem value="hierarchical">Hiérarchique</MenuItem>
                  <MenuItem value="force">Force</MenuItem>
                </Select>
              </FormControl>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={autoLayout}
                    onChange={(e) => setAutoLayout(e.target.checked)}
                  />
                }
                label="Auto-layout"
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Zone principale */}
      <Box sx={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {/* Canvas du mindmap */}
        <canvas
          ref={canvasRef}
          style={{
            width: '100%',
            height: '100%',
            cursor: 'pointer',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }}
          onMouseDown={handleMouseDown}
          onWheel={handleWheel}
        />

        {/* Panneau de contrôle flottant */}
        <Paper
          elevation={8}
          sx={{
            position: 'absolute',
            top: 20,
            right: 20,
            p: 2,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: 2,
            minWidth: 250
          }}
        >
          <Typography variant="h6" gutterBottom>
            Contrôles
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" gutterBottom>
              Zoom: {Math.round(zoom * 100)}%
            </Typography>
            <Slider
              value={zoom}
              onChange={(e, value) => setZoom(value)}
              min={0.1}
              max={3}
              step={0.1}
              sx={{ color: '#667eea' }}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" gutterBottom>
              Taille des nœuds
            </Typography>
            <Slider
              value={nodeSize}
              onChange={(e, value) => setNodeSize(value)}
              min={20}
              max={100}
              step={5}
              sx={{ color: '#667eea' }}
            />
          </Box>

          <FormControlLabel
            control={
              <Switch
                checked={showConnections}
                onChange={(e) => setShowConnections(e.target.checked)}
              />
            }
            label="Connexions"
          />

          <FormControlLabel
            control={
              <Switch
                checked={showLabels}
                onChange={(e) => setShowLabels(e.target.checked)}
              />
            }
            label="Labels"
          />
        </Paper>

        {/* Statistiques flottantes */}
        {showStats && (
          <Paper
            elevation={8}
            sx={{
              position: 'absolute',
              bottom: 20,
              left: 20,
              p: 2,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: 2,
              minWidth: 200
            }}
          >
            <Typography variant="h6" gutterBottom>
              Statistiques
            </Typography>
            <Typography variant="body2">
              Fichiers: {stats.totalFiles}
            </Typography>
            <Typography variant="body2">
              Dossiers: {stats.totalFolders}
            </Typography>
            <Typography variant="body2">
              Taille: {(stats.totalSize / (1024 * 1024)).toFixed(1)} MB
            </Typography>
          </Paper>
        )}
      </Box>

      {/* Dialog de détails */}
      <Dialog
        open={showDetails}
        onClose={() => setShowDetails(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {selectedNode?.icon}
            <Typography variant="h6">
              {selectedNode?.name}
            </Typography>
            <Chip 
              label={selectedNode?.category} 
              size="small" 
              sx={{ ml: 'auto' }}
            />
          </Box>
        </DialogTitle>
        
        <DialogContent>
          {selectedNode && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Informations
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <Category />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Catégorie" 
                      secondary={selectedNode.category}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Description />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Documents" 
                      secondary={`${selectedNode.documents.length} fichiers`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Storage />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Taille totale" 
                      secondary={`${(selectedNode.documents.reduce((sum, doc) => sum + (doc.size || 0), 0) / (1024 * 1024)).toFixed(1)} MB`}
                    />
                  </ListItem>
                </List>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Documents ({selectedNode.documents.length})
                </Typography>
                <List dense sx={{ maxHeight: 300, overflow: 'auto' }}>
                  {selectedNode.documents.map((doc, index) => (
                    <ListItem 
                      key={doc.id || index}
                      button
                      onClick={() => handleDocumentClick(doc)}
                      sx={{
                        borderRadius: 1,
                        mb: 0.5,
                        '&:hover': {
                          bgcolor: 'rgba(102, 126, 234, 0.08)'
                        }
                      }}
                    >
                      <ListItemIcon>
                        {getFileIcon(doc.type)}
                      </ListItemIcon>
                      <ListItemText 
                        primary={doc.name}
                        secondary={`${doc.type} • ${((doc.size || 0) / 1024).toFixed(1)} KB`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setShowDetails(false)}>
            Fermer
          </Button>
          {selectedNode && (
            <Button 
              variant="contained" 
              onClick={() => {
                onSelectFolder?.(selectedNode);
                setShowDetails(false);
              }}
              sx={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
                }
              }}
            >
              Ouvrir le dossier
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MindmapView; 