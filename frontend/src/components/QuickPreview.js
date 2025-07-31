import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Tooltip,
  Slide
} from '@mui/material';
import {
  Close as CloseIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  RotateLeft as RotateLeftIcon,
  RotateRight as RotateRightIcon,
  Download as DownloadIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
  NavigateNext as NextIcon,
  NavigateBefore as PrevIcon,
  PictureAsPdf as PdfIcon,
  Description as DocIcon,
  Image as ImageIcon,
  VideoFile as VideoIcon,
  AudioFile as AudioIcon,
  TextFields as TextIcon,
  Code as CodeIcon,
  Archive as ArchiveIcon,
  Error as ErrorIcon
} from '@mui/icons-material';

const QuickPreview = ({ document, open, onClose, onNext, onPrevious, documents = [] }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const iframeRef = useRef(null);

  const loadPreview = useCallback(async () => {
    if (!document) return;

    setLoading(true);
    setError(null);
    setPreviewData(null);
    setZoom(1);
    setRotation(0);
    setCurrentPage(1);

    try {
      const fileType = getFileType(document.type || document.name);
      
      switch (fileType) {
        case 'pdf':
          await loadPdfPreview();
          break;
        case 'image':
          await loadImagePreview();
          break;
        case 'video':
          await loadVideoPreview();
          break;
        case 'audio':
          await loadAudioPreview();
          break;
        case 'text':
          await loadTextPreview();
          break;
        case 'code':
          await loadCodePreview();
          break;
        default:
          await loadGenericPreview();
      }
    } catch (err) {
      setError(`Impossible de charger l'aperçu: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [document]);

  useEffect(() => {
    if (open && document) {
      loadPreview();
    }
  }, [open, document, loadPreview]);

  const getFileType = (type) => {
    if (!type || typeof type !== 'string') return 'generic';
    if (type.startsWith('image/')) return 'image';
    if (type.startsWith('video/')) return 'video';
    if (type.startsWith('audio/')) return 'audio';
    if (type.includes('pdf')) return 'pdf';
    if (type.includes('text') || type.includes('plain')) return 'text';
    if (type.includes('code') || type.includes('javascript') || type.includes('python')) return 'code';
    if (type.includes('zip') || type.includes('rar')) return 'archive';
    return 'generic';
  };

  const loadPdfPreview = async () => {
    // Simulation de chargement PDF
    setPreviewData({
      type: 'pdf',
      url: document.url || `data:application/pdf;base64,${btoa('PDF Preview')}`,
      pages: 5
    });
    setTotalPages(5);
  };

  const loadImagePreview = async () => {
    setPreviewData({
      type: 'image',
      url: document.url || `data:image/png;base64,${btoa('Image Preview')}`,
      dimensions: { width: 800, height: 600 }
    });
    setTotalPages(1);
  };

  const loadVideoPreview = async () => {
    setPreviewData({
      type: 'video',
      url: document.url || '#',
      duration: '3:45'
    });
    setTotalPages(1);
  };

  const loadAudioPreview = async () => {
    setPreviewData({
      type: 'audio',
      url: document.url || '#',
      duration: '2:30'
    });
    setTotalPages(1);
  };

  const loadTextPreview = async () => {
    // Simulation de contenu texte
    const textContent = `Contenu du fichier ${document.name}

Ceci est un aperçu du contenu du fichier texte.
Vous pouvez voir les premières lignes du document ici.

Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.

Le fichier contient ${Math.floor(Math.random() * 1000)} lignes de texte.`;

    setPreviewData({
      type: 'text',
      content: textContent,
      lines: textContent.split('\n').length
    });
    setTotalPages(1);
  };

  const loadCodePreview = async () => {
    const codeContent = `// ${document.name}
// Aperçu du code

function example() {
  console.log("Hello World");
  
  const data = {
    name: "Document",
    type: "${document.type}",
    size: "${formatFileSize(document.size)}"
  };
  
  return data;
}

// Commentaires et documentation
// Ce fichier contient du code ${document.type?.split('/')[1] || 'programming'}`;

    setPreviewData({
      type: 'code',
      content: codeContent,
      language: document.type?.split('/')[1] || 'javascript'
    });
    setTotalPages(1);
  };

  const loadGenericPreview = async () => {
    setPreviewData({
      type: 'generic',
      info: {
        name: document.name,
        size: document.size,
        type: document.type,
        lastModified: document.lastModified || document.created_at,
        path: document.path
      }
    });
    setTotalPages(1);
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.25));
  const handleRotateLeft = () => setRotation(prev => prev - 90);
  const handleRotateRight = () => setRotation(prev => prev + 90);
  const handleFullscreen = () => setFullscreen(!fullscreen);

  const handleNext = () => {
    if (onNext) {
      onNext();
    }
  };

  const handlePrevious = () => {
    if (onPrevious) {
      onPrevious();
    }
  };

  const getFileIcon = (type) => {
    if (!type) return <DocIcon />;
    const fileType = getFileType(type);
    switch (fileType) {
      case 'pdf': return <PdfIcon />;
      case 'image': return <ImageIcon />;
      case 'video': return <VideoIcon />;
      case 'audio': return <AudioIcon />;
      case 'text': return <TextIcon />;
      case 'code': return <CodeIcon />;
      case 'archive': return <ArchiveIcon />;
      default: return <DocIcon />;
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

  const renderPreviewContent = () => {
    if (loading) {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <LinearProgress sx={{ mb: 2 }} />
          <Typography>Chargement de l'aperçu...</Typography>
        </Box>
      );
    }

    if (error) {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <ErrorIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
          <Typography color="error" gutterBottom>
            Erreur de chargement
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {error}
          </Typography>
        </Box>
      );
    }

    if (!previewData) return null;

    switch (previewData.type) {
      case 'pdf':
        return (
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ flex: 1, position: 'relative' }}>
              <iframe
                ref={iframeRef}
                src={previewData.url}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  borderRadius: '8px'
                }}
                title="PDF Preview"
              />
            </Box>
            <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
              <Typography variant="body2" color="text.secondary">
                Page {currentPage} sur {totalPages}
              </Typography>
            </Box>
          </Box>
        );

      case 'image':
        return (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <img
              src={previewData.url}
              alt={document.name}
              style={{
                maxWidth: '100%',
                maxHeight: '70vh',
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
                transition: 'transform 0.3s ease'
              }}
            />
          </Box>
        );

      case 'video':
        return (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <video
              controls
              style={{
                maxWidth: '100%',
                maxHeight: '70vh',
                borderRadius: '8px'
              }}
            >
              <source src={previewData.url} type={document.type} />
              Votre navigateur ne supporte pas la lecture vidéo.
            </video>
          </Box>
        );

      case 'audio':
        return (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <AudioIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
            <audio controls style={{ width: '100%', maxWidth: 400 }}>
              <source src={previewData.url} type={document.type} />
              Votre navigateur ne supporte pas la lecture audio.
            </audio>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Durée: {previewData.duration}
            </Typography>
          </Box>
        );

      case 'text':
        return (
          <Box sx={{ p: 2, maxHeight: '70vh', overflow: 'auto' }}>
            <Paper sx={{ p: 3, background: '#f8f9fa' }}>
              <pre style={{
                fontFamily: 'monospace',
                fontSize: '14px',
                lineHeight: 1.5,
                margin: 0,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}>
                {previewData.content}
              </pre>
            </Paper>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {previewData.lines} lignes
            </Typography>
          </Box>
        );

      case 'code':
        return (
          <Box sx={{ p: 2, maxHeight: '70vh', overflow: 'auto' }}>
            <Paper sx={{ p: 3, background: '#1e1e1e' }}>
              <pre style={{
                fontFamily: 'Consolas, Monaco, monospace',
                fontSize: '14px',
                lineHeight: 1.5,
                margin: 0,
                color: '#d4d4d4',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}>
                {previewData.content}
              </pre>
            </Paper>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Langage: {previewData.language}
            </Typography>
          </Box>
        );

      case 'generic':
        return (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                mb: 2
              }}
            >
              {getFileIcon(document.type)}
            </Box>
            <Typography variant="h6" gutterBottom>
              {previewData.info.name}
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText
                  primary="Taille"
                  secondary={formatFileSize(previewData.info.size)}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Type"
                  secondary={previewData.info.type || 'Inconnu'}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Modifié le"
                  secondary={formatDate(previewData.info.lastModified)}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Chemin"
                  secondary={previewData.info.path}
                />
              </ListItem>
            </List>
          </Box>
        );

      default:
        return null;
    }
  };

  const currentIndex = documents.findIndex(doc => doc.id === document?.id);
  const hasNext = currentIndex < documents.length - 1;
  const hasPrevious = currentIndex > 0;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      fullScreen={fullscreen}
      TransitionComponent={Slide}
      transitionDuration={300}
    >
      <DialogTitle
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {getFileIcon(document?.type)}
          <Box>
            <Typography variant="h6">
              {document?.name}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              {formatFileSize(document?.size)} • {formatDate(document?.lastModified || document?.created_at)}
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          {/* Navigation */}
          <Tooltip title="Précédent">
            <IconButton
              onClick={handlePrevious}
              disabled={!hasPrevious}
              sx={{ color: 'white' }}
            >
              <PrevIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Suivant">
            <IconButton
              onClick={handleNext}
              disabled={!hasNext}
              sx={{ color: 'white' }}
            >
              <NextIcon />
            </IconButton>
          </Tooltip>

          {/* Contrôles d'aperçu */}
          {previewData?.type === 'image' && (
            <>
              <Tooltip title="Zoom +">
                <IconButton onClick={handleZoomIn} sx={{ color: 'white' }}>
                  <ZoomInIcon />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Zoom -">
                <IconButton onClick={handleZoomOut} sx={{ color: 'white' }}>
                  <ZoomOutIcon />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Rotation gauche">
                <IconButton onClick={handleRotateLeft} sx={{ color: 'white' }}>
                  <RotateLeftIcon />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Rotation droite">
                <IconButton onClick={handleRotateRight} sx={{ color: 'white' }}>
                  <RotateRightIcon />
                </IconButton>
              </Tooltip>
            </>
          )}

          <Tooltip title={fullscreen ? "Quitter plein écran" : "Plein écran"}>
            <IconButton onClick={handleFullscreen} sx={{ color: 'white' }}>
              {fullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
            </IconButton>
          </Tooltip>

          <Tooltip title="Fermer">
            <IconButton onClick={onClose} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0, minHeight: 400 }}>
        {renderPreviewContent()}
      </DialogContent>

      <DialogActions sx={{ p: 2, background: 'rgba(0, 0, 0, 0.02)' }}>
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={() => {
            // Logique de téléchargement
            console.log('Télécharger:', document);
          }}
        >
          Télécharger
        </Button>
        <Button onClick={onClose}>
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuickPreview; 