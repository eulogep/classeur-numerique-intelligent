import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './ThemeManager.css';

const ThemeManager = ({ onThemeChange }) => {
  const [currentTheme, setCurrentTheme] = useState('default');
  const [showThemePanel, setShowThemePanel] = useState(false);
  const [customColors, setCustomColors] = useState({
    primary: '#667eea',
    secondary: '#764ba2',
    accent: '#4ECDC4',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    surface: 'rgba(255, 255, 255, 0.95)',
    text: '#333333'
  });

  const themes = useMemo(() => ({
    default: {
      name: 'Professionnel',
      primary: '#2563eb',
      secondary: '#7c3aed',
      accent: '#06b6d4',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      surface: 'rgba(255, 255, 255, 0.95)',
      text: '#1e293b'
    },
    dark: {
      name: 'Sombre',
      primary: '#3b82f6',
      secondary: '#8b5cf6',
      accent: '#06b6d4',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      surface: 'rgba(30, 41, 59, 0.95)',
      text: '#f1f5f9'
    },
    ocean: {
      name: 'Océan',
      primary: '#0891b2',
      secondary: '#0e7490',
      accent: '#06b6d4',
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
      surface: 'rgba(255, 255, 255, 0.95)',
      text: '#0c4a6e'
    },
    forest: {
      name: 'Forêt',
      primary: '#059669',
      secondary: '#047857',
      accent: '#10b981',
      background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
      surface: 'rgba(255, 255, 255, 0.95)',
      text: '#064e3b'
    },
    sunset: {
      name: 'Coucher de soleil',
      primary: '#ea580c',
      secondary: '#dc2626',
      accent: '#f59e0b',
      background: 'linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%)',
      surface: 'rgba(255, 255, 255, 0.95)',
      text: '#7c2d12'
    },
    purple: {
      name: 'Violet',
      primary: '#7c3aed',
      secondary: '#6d28d9',
      accent: '#a855f7',
      background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
      surface: 'rgba(255, 255, 255, 0.95)',
      text: '#581c87'
    }
  }), []);

  const applyTheme = useCallback((theme) => {
    const root = document.documentElement;
    
    // Appliquer les variables CSS
    root.style.setProperty('--primary-color', theme.primary);
    root.style.setProperty('--secondary-color', theme.secondary);
    root.style.setProperty('--accent-color', theme.accent);
    root.style.setProperty('--background-gradient', theme.background);
    root.style.setProperty('--surface-color', theme.surface);
    root.style.setProperty('--text-color', theme.text);
    
    // Appliquer le thème au body
    document.body.style.background = theme.background;
    document.body.style.color = theme.text;
    
    // Notifier le composant parent
    onThemeChange(theme);
  }, [onThemeChange]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('selectedTheme');
    const savedCustomColors = localStorage.getItem('customColors');
    
    if (savedTheme) {
      setCurrentTheme(savedTheme);
    }
    
    if (savedCustomColors) {
      setCustomColors(JSON.parse(savedCustomColors));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('selectedTheme', currentTheme);
    localStorage.setItem('customColors', JSON.stringify(customColors));
    
    const theme = currentTheme === 'custom' ? customColors : themes[currentTheme];
    applyTheme(theme);
  }, [currentTheme, customColors, themes, applyTheme]);

  const handleThemeSelect = (themeKey) => {
    setCurrentTheme(themeKey);
    setShowThemePanel(false);
  };

  const handleCustomColorChange = (colorKey, value) => {
    setCustomColors(prev => ({
      ...prev,
      [colorKey]: value
    }));
    setCurrentTheme('custom');
  };

  const resetToDefault = () => {
    setCurrentTheme('default');
    setCustomColors(themes.default);
  };

  return (
    <>
      {/* Bouton de thème flottant */}
      <button 
        className="theme-button"
        onClick={() => setShowThemePanel(!showThemePanel)}
        title="Personnaliser le thème"
      >
        🎨
      </button>

      {/* Panel de thèmes */}
      {showThemePanel && (
        <div className="theme-overlay" onClick={() => setShowThemePanel(false)}>
          <div className="theme-panel" onClick={(e) => e.stopPropagation()}>
            <div className="theme-header">
              <h3>🎨 Personnalisation du thème</h3>
              <button 
                className="close-theme-btn"
                onClick={() => setShowThemePanel(false)}
              >
                ✕
              </button>
            </div>

            <div className="theme-content">
              {/* Thèmes prédéfinis */}
              <div className="theme-section">
                <h4>Thèmes prédéfinis</h4>
                <div className="theme-grid">
                  {Object.entries(themes).map(([key, theme]) => (
                    <div 
                      key={key}
                      className={`theme-option ${currentTheme === key ? 'active' : ''}`}
                      onClick={() => handleThemeSelect(key)}
                    >
                      <div 
                        className="theme-preview"
                        style={{ background: theme.background }}
                      >
                        <div 
                          className="theme-accent"
                          style={{ backgroundColor: theme.accent }}
                        ></div>
                      </div>
                      <span className="theme-name">{theme.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Couleurs personnalisées */}
              <div className="theme-section">
                <h4>Couleurs personnalisées</h4>
                <div className="custom-colors">
                  <div className="color-group">
                    <label>Couleur principale</label>
                    <input 
                      type="color"
                      value={customColors.primary}
                      onChange={(e) => handleCustomColorChange('primary', e.target.value)}
                    />
                  </div>
                  
                  <div className="color-group">
                    <label>Couleur secondaire</label>
                    <input 
                      type="color"
                      value={customColors.secondary}
                      onChange={(e) => handleCustomColorChange('secondary', e.target.value)}
                    />
                  </div>
                  
                  <div className="color-group">
                    <label>Couleur d'accent</label>
                    <input 
                      type="color"
                      value={customColors.accent}
                      onChange={(e) => handleCustomColorChange('accent', e.target.value)}
                    />
                  </div>
                  
                  <div className="color-group">
                    <label>Couleur de texte</label>
                    <input 
                      type="color"
                      value={customColors.text}
                      onChange={(e) => handleCustomColorChange('text', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="theme-actions">
                <button 
                  className="reset-theme-btn"
                  onClick={resetToDefault}
                >
                  🔄 Réinitialiser
                </button>
                <button 
                  className="apply-theme-btn"
                  onClick={() => setShowThemePanel(false)}
                >
                  ✅ Appliquer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ThemeManager; 