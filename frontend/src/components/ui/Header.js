import React from 'react';
import { cn } from '../../lib/utils';
import Icon from './Icon';
import { Button } from './Button';

const Header = ({ 
  activeMode, 
  onModeChange, 
  className = '' 
}) => {
  return (
    <header className={cn("main-header-modern", className)}>
      <div className="header-content-modern">
        {/* Logo */}
        <div className="logo-modern">
          <div className="logo-icon-container">
            <Icon name="sparkle" size={32} variant="primary" animated={true} />
          </div>
          <div className="logo-text-container">
            <h1 className="logo-title">Classeur Numérique</h1>
            <p className="logo-subtitle">Intelligent & Moderne</p>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="header-actions">
          <div className="mode-toggle-modern">
            <Button
              variant={activeMode === 'cloud' ? 'gradient' : 'glass'}
              size="sm"
              onClick={() => onModeChange('cloud')}
              className={cn("mode-btn-modern", activeMode === 'cloud' && "active")}
              icon="star"
            >
              Cloud
            </Button>
            <Button
              variant={activeMode === 'local' ? 'gradient' : 'glass'}
              size="sm"
              onClick={() => onModeChange('local')}
              className={cn("mode-btn-modern", activeMode === 'local' && "active")}
              icon="folder"
            >
              Local
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="header-quick-actions">
            <Button
              variant="neon"
              size="icon"
              className="header-action-btn"
              icon="search"
            />
            <Button
              variant="neon"
              size="icon"
              className="header-action-btn"
              icon="settings"
            />
            <Button
              variant="neon"
              size="icon"
              className="header-action-btn"
              icon="star"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 