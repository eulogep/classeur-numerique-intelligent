import React from 'react';
import { cn } from '../../lib/utils';
import Icon from './Icon';
import { Button } from './Button';

const Navigation = ({ 
  activeView, 
  onViewChange, 
  activeMode, 
  onModeChange,
  className = '' 
}) => {
  const views = [
    { id: 'gallery', label: 'Galerie', icon: 'folder' },
    { id: 'timeline', label: 'Chronologie', icon: 'arrowRight' },
    { id: 'search', label: 'Recherche', icon: 'search' },
    { id: 'dashboard', label: 'Tableau de bord', icon: 'home' },
    { id: 'todo', label: 'To-Do List', icon: 'check' },
    { id: 'import', label: 'Import Rapide', icon: 'upload' },
    { id: 'mindmap', label: 'Mindmap', icon: 'sparkle' },
    { id: 'customization', label: 'Personnalisation', icon: 'settings' },
    { id: 'vault', label: 'Coffre-fort', icon: 'star' },
    { id: 'curriculum', label: 'Cursus Scolaire', icon: 'file' },
    { id: 'media', label: 'Média Visuel', icon: 'image' },
  ];

  return (
    <nav className={cn("navigation-modern", className)}>
      {/* Mode Toggle */}
      <div className="mode-toggle-container">
        <Button
          variant={activeMode === 'cloud' ? 'gradient' : 'glass'}
          size="sm"
          onClick={() => onModeChange('cloud')}
          className={cn("mode-btn", activeMode === 'cloud' && "active")}
        >
          <Icon name="star" size={16} />
          Mode Cloud
        </Button>
        <Button
          variant={activeMode === 'local' ? 'gradient' : 'glass'}
          size="sm"
          onClick={() => onModeChange('local')}
          className={cn("mode-btn", activeMode === 'local' && "active")}
        >
          <Icon name="folder" size={16} />
          Mode Local
        </Button>
      </div>

      {/* Navigation Tabs */}
      <div className="nav-tabs-container">
        {views.map((view) => (
          <Button
            key={view.id}
            variant={activeView === view.id ? 'gradient' : 'glass'}
            size="sm"
            onClick={() => onViewChange(view.id)}
            className={cn("nav-tab", activeView === view.id && "active")}
            icon={view.icon}
            iconPosition="left"
          >
            {view.label}
          </Button>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <Button
          variant="neon"
          size="icon"
          className="action-btn"
          icon="add"
        />
        <Button
          variant="neon"
          size="icon"
          className="action-btn"
          icon="search"
        />
        <Button
          variant="neon"
          size="icon"
          className="action-btn"
          icon="settings"
        />
      </div>
    </nav>
  );
};

export default Navigation; 