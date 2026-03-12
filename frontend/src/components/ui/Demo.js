import React from 'react';
import { Button } from './Button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './Card';
import Icon from './Icon';

const Demo = () => {
  const showNotification = (type) => {
    const messages = {
      success: 'Opération réussie !',
      error: 'Une erreur est survenue.',
      warning: 'Attention, action requise.',
      info: 'Information importante.'
    };
    
    window.showToast?.(messages[type], type, 4000);
  };

  return (
    <div className="demo-container">
      <h2 className="demo-title">Démonstration des Composants UI Modernes</h2>
      
      {/* Section Boutons */}
      <section className="demo-section">
        <h3>Boutons</h3>
        <div className="demo-grid">
          <Button variant="default" icon="add">Bouton Principal</Button>
          <Button variant="secondary" icon="edit">Bouton Secondaire</Button>
          <Button variant="outline" icon="download">Bouton Contour</Button>
          <Button variant="ghost" icon="eye">Bouton Fantôme</Button>
          <Button variant="gradient" icon="sparkle">Bouton Gradient</Button>
          <Button variant="neon" icon="lightning">Bouton Neon</Button>
          <Button variant="glass" icon="star">Bouton Glass</Button>
        </div>
      </section>

      {/* Section Cartes */}
      <section className="demo-section">
        <h3>Cartes</h3>
        <div className="demo-grid">
          <Card variant="default" hover={true}>
            <CardHeader>
              <CardTitle>Carte Standard</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Une carte avec effet de survol et design moderne.</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm">Action</Button>
            </CardFooter>
          </Card>

          <Card variant="glass" hover={true}>
            <CardHeader>
              <CardTitle>Carte Glass</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Effet glassmorphism avec transparence et flou.</p>
            </CardContent>
            <CardFooter>
              <Button variant="glass" size="sm">Action</Button>
            </CardFooter>
          </Card>

          <Card variant="neon" hover={true}>
            <CardHeader>
              <CardTitle>Carte Neon</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Bordure lumineuse avec effet néon.</p>
            </CardContent>
            <CardFooter>
              <Button variant="neon" size="sm">Action</Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Section Icônes */}
      <section className="demo-section">
        <h3>Icônes</h3>
        <div className="demo-grid">
          <div className="icon-demo">
            <Icon name="home" size={32} variant="primary" />
            <span>Home</span>
          </div>
          <div className="icon-demo">
            <Icon name="search" size={32} variant="secondary" />
            <span>Search</span>
          </div>
          <div className="icon-demo">
            <Icon name="settings" size={32} variant="accent" />
            <span>Settings</span>
          </div>
          <div className="icon-demo">
            <Icon name="star" size={32} variant="success" />
            <span>Star</span>
          </div>
          <div className="icon-demo">
            <Icon name="sparkle" size={32} variant="warning" animated={true} />
            <span>Sparkle</span>
          </div>
          <div className="icon-demo">
            <Icon name="lightning" size={32} variant="error" animated={true} />
            <span>Lightning</span>
          </div>
        </div>
      </section>

      {/* Section Notifications */}
      <section className="demo-section">
        <h3>Notifications</h3>
        <div className="demo-grid">
          <Button 
            variant="success" 
            onClick={() => showNotification('success')}
            icon="check"
          >
            Succès
          </Button>
          <Button 
            variant="error" 
            onClick={() => showNotification('error')}
            icon="close"
          >
            Erreur
          </Button>
          <Button 
            variant="warning" 
            onClick={() => showNotification('warning')}
            icon="star"
          >
            Avertissement
          </Button>
          <Button 
            variant="info" 
            onClick={() => showNotification('info')}
            icon="eye"
          >
            Information
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Demo; 