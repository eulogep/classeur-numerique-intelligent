import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Tabs,
  Tab,
  CircularProgress,
  Container,
  Paper
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EmailIcon from '@mui/icons-material/Email';

const Auth = () => {
  const [tab, setTab] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const { signIn, signUp, resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      if (tab === 0) {
        // Connexion
        const { error } = await signIn(email, password);
        if (error) throw error;
      } else if (tab === 1) {
        // Inscription
        const { error } = await signUp(email, password);
        if (error) throw error;
        setMessage('Vérifiez votre email pour confirmer votre compte !');
      } else {
        // Reset password
        const { error } = await resetPassword(email);
        if (error) throw error;
        setMessage('Email de réinitialisation envoyé !');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getTabIcon = () => {
    switch (tab) {
      case 0: return <LockOutlinedIcon />;
      case 1: return <PersonAddIcon />;
      case 2: return <EmailIcon />;
      default: return <LockOutlinedIcon />;
    }
  };

  const getTabTitle = () => {
    switch (tab) {
      case 0: return 'Connexion';
      case 1: return 'Inscription';
      case 2: return 'Mot de passe oublié';
      default: return 'Connexion';
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          py: 4
        }}
      >
        <Paper
          elevation={8}
          sx={{
            p: 4,
            width: '100%',
            borderRadius: 3,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 64,
                height: 64,
                borderRadius: '50%',
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                mb: 2
              }}
            >
              {getTabIcon()}
            </Box>
            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
              Classeur Numérique
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              {getTabTitle()}
            </Typography>
          </Box>

          <Tabs 
            value={tab} 
            onChange={(e, newValue) => setTab(newValue)}
            variant="fullWidth"
            sx={{
              mb: 3,
              '& .MuiTab-root': {
                color: 'rgba(255, 255, 255, 0.7)',
                '&.Mui-selected': {
                  color: 'white'
                }
              },
              '& .MuiTabs-indicator': {
                backgroundColor: 'white'
              }
            }}
          >
            <Tab label="Connexion" />
            <Tab label="Inscription" />
            <Tab label="Mot de passe oublié" />
          </Tabs>

          <Box component="form" onSubmit={handleSubmit}>
            {tab !== 2 && (
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                required
                disabled={loading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 1)'
                    }
                  }
                }}
              />
            )}
            
            {tab === 0 && (
              <TextField
                fullWidth
                label="Mot de passe"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                required
                disabled={loading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 1)'
                    }
                  }
                }}
              />
            )}

            {tab === 1 && (
              <TextField
                fullWidth
                label="Mot de passe"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                required
                disabled={loading}
                helperText="Minimum 6 caractères"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 1)'
                    }
                  }
                }}
              />
            )}

            {error && (
              <Alert severity="error" sx={{ mt: 2, bgcolor: 'rgba(255, 255, 255, 0.9)' }}>
                {error}
              </Alert>
            )}

            {message && (
              <Alert severity="success" sx={{ mt: 2, bgcolor: 'rgba(255, 255, 255, 0.9)' }}>
                {message}
              </Alert>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ 
                mt: 3, 
                mb: 2,
                py: 1.5,
                bgcolor: 'white',
                color: '#667eea',
                fontWeight: 'bold',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.9)'
                }
              }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : tab === 0 ? (
                'Se connecter'
              ) : tab === 1 ? (
                'S\'inscrire'
              ) : (
                'Envoyer le lien'
              )}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Auth; 