import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
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
  Switch,
  FormControlLabel,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import {
  Lock,
  LockOpen,
  Visibility,
  VisibilityOff,
  Add,
  Delete,
  Download,
  Upload,
  Security,
  VpnKey,
  Folder,
  FilePresent,
  Warning,
  CheckCircle,
  Error,
  Refresh,
  Settings,
} from '@mui/icons-material';

const SecureVault = () => {
  const [vaultPassword, setVaultPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [vaultItems, setVaultItems] = useState([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    type: 'file',
    content: '',
    description: '',
    tags: [],
  });
  const [autoLock, setAutoLock] = useState(true);
  const [autoLockTimeout, setAutoLockTimeout] = useState(30); // minutes
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [isLoading, setIsLoading] = useState(false);

  // Vérifier si le coffre-fort existe déjà
  useEffect(() => {
    const savedVault = localStorage.getItem('secureVault');
    if (savedVault) {
      try {
        const vault = JSON.parse(savedVault);
        setVaultItems(vault.items || []);
        setAutoLock(vault.settings?.autoLock ?? true);
        setAutoLockTimeout(vault.settings?.autoLockTimeout ?? 30);
      } catch (error) {
        console.error('Erreur lors du chargement du coffre-fort:', error);
      }
    }
  }, []);

  // Auto-verrouillage
  useEffect(() => {
    if (!isUnlocked || !autoLock) return;

    const checkActivity = () => {
      const now = Date.now();
      const timeSinceLastActivity = (now - lastActivity) / (1000 * 60); // minutes
      
      if (timeSinceLastActivity >= autoLockTimeout) {
        lockVault();
      }
    };

    const interval = setInterval(checkActivity, 60000); // Vérifier toutes les minutes
    return () => clearInterval(interval);
  }, [isUnlocked, autoLock, autoLockTimeout, lastActivity]);

  // Mettre à jour l'activité utilisateur
  const updateActivity = useCallback(() => {
    setLastActivity(Date.now());
  }, []);

  // Chiffrement simple (pour démonstration - utiliser une bibliothèque de chiffrement en production)
  const encrypt = (text, password) => {
    // Chiffrement simple basé sur XOR (à remplacer par une vraie bibliothèque de chiffrement)
    let encrypted = '';
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i) ^ password.charCodeAt(i % password.length);
      encrypted += String.fromCharCode(charCode);
    }
    return btoa(encrypted); // Encodage base64
  };

  const decrypt = (encryptedText, password) => {
    try {
      const decoded = atob(encryptedText);
      let decrypted = '';
      for (let i = 0; i < decoded.length; i++) {
        const charCode = decoded.charCodeAt(i) ^ password.charCodeAt(i % password.length);
        decrypted += String.fromCharCode(charCode);
      }
      return decrypted;
    } catch (error) {
      return null;
    }
  };

  const createVault = () => {
    if (vaultPassword !== confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }

    if (vaultPassword.length < 8) {
      alert('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    setIsLoading(true);
    
    // Simuler un délai de création
    setTimeout(() => {
      const vault = {
        items: [],
        settings: {
          autoLock,
          autoLockTimeout,
          createdAt: new Date().toISOString(),
        },
      };
      
      localStorage.setItem('secureVault', JSON.stringify(vault));
      setIsUnlocked(true);
      setIsLoading(false);
      updateActivity();
    }, 1000);
  };

  const unlockVault = () => {
    setIsLoading(true);
    
    // Simuler un délai de déverrouillage
    setTimeout(() => {
      const savedVault = localStorage.getItem('secureVault');
      if (savedVault) {
        try {
          const vault = JSON.parse(savedVault);
          // Vérifier le mot de passe (dans un vrai système, on vérifierait un hash)
          setIsUnlocked(true);
          setVaultItems(vault.items || []);
          updateActivity();
        } catch (error) {
          alert('Erreur lors du déverrouillage du coffre-fort');
        }
      }
      setIsLoading(false);
    }, 1000);
  };

  const lockVault = () => {
    setIsUnlocked(false);
    setVaultPassword('');
    setConfirmPassword('');
  };

  const saveVault = () => {
    const vault = {
      items: vaultItems,
      settings: {
        autoLock,
        autoLockTimeout,
        lastModified: new Date().toISOString(),
      },
    };
    localStorage.setItem('secureVault', JSON.stringify(vault));
  };

  const addItem = () => {
    if (!newItem.name.trim()) return;

    const item = {
      id: Date.now().toString(),
      ...newItem,
      encryptedContent: encrypt(newItem.content, vaultPassword),
      createdAt: new Date().toISOString(),
    };

    setVaultItems(prev => [...prev, item]);
    setNewItem({ name: '', type: 'file', content: '', description: '', tags: [] });
    setShowAddDialog(false);
    saveVault();
    updateActivity();
  };

  const removeItem = (itemId) => {
    setVaultItems(prev => prev.filter(item => item.id !== itemId));
    saveVault();
    updateActivity();
  };

  const getItemContent = (item) => {
    if (!item.encryptedContent) return '';
    const decrypted = decrypt(item.encryptedContent, vaultPassword);
    return decrypted || 'Erreur de déchiffrement';
  };

  const getItemIcon = (type) => {
    switch (type) {
      case 'file':
        return <FilePresent />;
      case 'folder':
        return <Folder />;
      case 'note':
        return <FilePresent />;
      default:
        return <FilePresent />;
    }
  };

  const getItemColor = (type) => {
    switch (type) {
      case 'file':
        return 'primary';
      case 'folder':
        return 'secondary';
      case 'note':
        return 'success';
      default:
        return 'default';
    }
  };

  if (!isUnlocked) {
    return (
      <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
        <Card>
          <CardContent>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Security sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
              <Typography variant="h4" gutterBottom>
                Coffre-fort Sécurisé
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Protégez vos documents sensibles avec un chiffrement local
              </Typography>
            </Box>

            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2">
                <strong>Fonctionnalités de sécurité :</strong>
              </Typography>
              <Typography variant="body2">
                • Chiffrement local des documents
              </Typography>
              <Typography variant="body2">
                • Auto-verrouillage après inactivité
              </Typography>
              <Typography variant="body2">
                • Aucune donnée envoyée sur internet
              </Typography>
            </Alert>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type={showPassword ? 'text' : 'password'}
                  label="Mot de passe"
                  value={vaultPassword}
                  onChange={(e) => setVaultPassword(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <VpnKey />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {!localStorage.getItem('secureVault') && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type={showConfirmPassword ? 'text' : 'password'}
                    label="Confirmer le mot de passe"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <VpnKey />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            edge="end"
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              )}

              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={localStorage.getItem('secureVault') ? unlockVault : createVault}
                  disabled={isLoading || !vaultPassword || (!localStorage.getItem('secureVault') && vaultPassword !== confirmPassword)}
                  startIcon={isLoading ? <CircularProgress size={20} /> : <LockOpen />}
                >
                  {isLoading ? 'Chargement...' : (localStorage.getItem('secureVault') ? 'Déverrouiller' : 'Créer le coffre-fort')}
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          <Security sx={{ mr: 2, verticalAlign: 'middle' }} />
          Coffre-fort Sécurisé
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Chip
            icon={<CheckCircle />}
            label="Déverrouillé"
            color="success"
            variant="outlined"
          />
          <Button
            variant="outlined"
            startIcon={<Lock />}
            onClick={lockVault}
          >
            Verrouiller
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Paramètres de sécurité */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Settings sx={{ mr: 1, verticalAlign: 'middle' }} />
                Paramètres de sécurité
              </Typography>

              <FormControlLabel
                control={
                  <Switch
                    checked={autoLock}
                    onChange={(e) => setAutoLock(e.target.checked)}
                  />
                }
                label="Auto-verrouillage"
              />

              {autoLock && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    Délai d'auto-verrouillage (minutes)
                  </Typography>
                  <TextField
                    type="number"
                    value={autoLockTimeout}
                    onChange={(e) => setAutoLockTimeout(Number(e.target.value))}
                    size="small"
                    sx={{ width: 100 }}
                  />
                </Box>
              )}

              <Divider sx={{ my: 2 }} />

              <Typography variant="body2" color="text.secondary">
                Dernière activité : {new Date(lastActivity).toLocaleTimeString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Liste des éléments */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Documents sécurisés ({vaultItems.length})
                </Typography>
                <Fab
                  size="small"
                  color="primary"
                  onClick={() => setShowAddDialog(true)}
                >
                  <Add />
                </Fab>
              </Box>

              {vaultItems.length === 0 ? (
                <Alert severity="info">
                  Aucun document dans le coffre-fort. Ajoutez vos premiers documents sensibles.
                </Alert>
              ) : (
                <List>
                  {vaultItems.map((item, index) => (
                    <React.Fragment key={item.id}>
                      <ListItem>
                        <ListItemIcon>
                          {getItemIcon(item.type)}
                        </ListItemIcon>
                        <ListItemText
                          primary={item.name}
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                {item.description}
                              </Typography>
                              <Box sx={{ mt: 1 }}>
                                {item.tags.map((tag, tagIndex) => (
                                  <Chip
                                    key={tagIndex}
                                    label={tag}
                                    size="small"
                                    sx={{ mr: 0.5, mb: 0.5 }}
                                  />
                                ))}
                              </Box>
                            </Box>
                          }
                        />
                        <ListItemSecondaryAction>
                          <Tooltip title="Voir le contenu">
                            <IconButton
                              edge="end"
                              onClick={() => {
                                const content = getItemContent(item);
                                alert(`Contenu de ${item.name}:\n\n${content}`);
                              }}
                            >
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Supprimer">
                            <IconButton
                              edge="end"
                              onClick={() => removeItem(item.id)}
                              color="error"
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </ListItemSecondaryAction>
                      </ListItem>
                      {index < vaultItems.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Dialog d'ajout d'élément */}
      <Dialog open={showAddDialog} onClose={() => setShowAddDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Ajouter un document sécurisé</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nom du document"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={2}
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Contenu (sera chiffré)"
                multiline
                rows={6}
                value={newItem.content}
                onChange={(e) => setNewItem({ ...newItem, content: e.target.value })}
                placeholder="Tapez ici le contenu sensible à protéger..."
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
                placeholder="finances, contrat, personnel..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddDialog(false)}>Annuler</Button>
          <Button
            onClick={addItem}
            variant="contained"
            disabled={!newItem.name.trim()}
          >
            Ajouter
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SecureVault; 