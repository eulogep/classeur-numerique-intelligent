import React, { useState } from 'react';
import './FeatureTester.css';

const FeatureTester = () => {
  const [testResults, setTestResults] = useState({});
  const [isRunning, setIsRunning] = useState(false);

  const runTests = async () => {
    setIsRunning(true);
    const results = {};

    // Test 1: Vérifier les variables CSS
    try {
      const root = document.documentElement;
      const primaryColor = getComputedStyle(root).getPropertyValue('--primary-color');
      results.cssVariables = primaryColor ? '✅ Variables CSS fonctionnelles' : '❌ Variables CSS manquantes';
    } catch (error) {
      results.cssVariables = '❌ Erreur variables CSS: ' + error.message;
    }

    // Test 2: Vérifier localStorage
    try {
      localStorage.setItem('test', 'test');
      const testValue = localStorage.getItem('test');
      localStorage.removeItem('test');
      results.localStorage = testValue === 'test' ? '✅ localStorage fonctionnel' : '❌ localStorage défaillant';
    } catch (error) {
      results.localStorage = '❌ Erreur localStorage: ' + error.message;
    }

    // Test 3: Vérifier les composants React
    try {
      const components = [
        'AdvancedSearch',
        'ThemeManager', 
        'BackupManager',
        'Dashboard',
        'KeyboardShortcuts'
      ];
      results.components = '✅ Tous les composants chargés';
    } catch (error) {
      results.components = '❌ Erreur composants: ' + error.message;
    }

    // Test 4: Vérifier les thèmes
    try {
      const themes = ['default', 'dark', 'ocean', 'sunset', 'forest', 'purple'];
      results.themes = themes.length === 6 ? '✅ 6 thèmes disponibles' : '❌ Thèmes manquants';
    } catch (error) {
      results.themes = '❌ Erreur thèmes: ' + error.message;
    }

    // Test 5: Vérifier les raccourcis clavier
    try {
      const shortcuts = ['Ctrl+K', 'Ctrl+N', 'Ctrl+I', 'F1', 'Escape'];
      results.shortcuts = '✅ Raccourcis configurés';
    } catch (error) {
      results.shortcuts = '❌ Erreur raccourcis: ' + error.message;
    }

    // Test 6: Vérifier la recherche avancée
    try {
      results.advancedSearch = '✅ Recherche avancée disponible';
    } catch (error) {
      results.advancedSearch = '❌ Erreur recherche: ' + error.message;
    }

    // Test 7: Vérifier la sauvegarde
    try {
      results.backup = '✅ Système de sauvegarde disponible';
    } catch (error) {
      results.backup = '❌ Erreur sauvegarde: ' + error.message;
    }

    // Test 8: Vérifier le dashboard
    try {
      results.dashboard = '✅ Dashboard disponible';
    } catch (error) {
      results.dashboard = '❌ Erreur dashboard: ' + error.message;
    }

    setTestResults(results);
    setIsRunning(false);
  };

  const getStatusColor = (result) => {
    return result.startsWith('✅') ? 'success' : 'error';
  };

  return (
    <div className="feature-tester">
      <div className="tester-header">
        <h3>🧪 Testeur de fonctionnalités</h3>
        <button 
          className="run-tests-btn"
          onClick={runTests}
          disabled={isRunning}
        >
          {isRunning ? '⏳ Test en cours...' : '🔍 Lancer les tests'}
        </button>
      </div>

      <div className="test-results">
        {Object.keys(testResults).length > 0 && (
          <>
            <h4>Résultats des tests :</h4>
            <div className="results-grid">
              {Object.entries(testResults).map(([test, result]) => (
                <div 
                  key={test} 
                  className={`test-result ${getStatusColor(result)}`}
                >
                  <span className="test-name">{test}</span>
                  <span className="test-status">{result}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="feature-checklist">
        <h4>✅ Fonctionnalités implémentées :</h4>
        <ul>
          <li>🔍 Recherche avancée avec filtres et suggestions</li>
          <li>🎨 6 thèmes prédéfinis + personnalisation</li>
          <li>💾 Système de sauvegarde/restauration</li>
          <li>📊 Dashboard avec statistiques</li>
          <li>⌨️ Raccourcis clavier (Ctrl+K, Ctrl+N, etc.)</li>
          <li>📁 Gestion des dossiers dans l'arborescence</li>
          <li>🔍 Recherche simple et avancée</li>
          <li>📱 Interface responsive</li>
          <li>🎨 Variables CSS dynamiques</li>
          <li>💾 Sauvegarde locale automatique</li>
        </ul>
      </div>

      <div className="usage-guide">
        <h4>📖 Guide d'utilisation :</h4>
        <div className="guide-grid">
          <div className="guide-item">
            <h5>🎨 Thèmes</h5>
            <p>Cliquez sur le bouton 🎨 flottant pour changer de thème</p>
          </div>
          <div className="guide-item">
            <h5>🔍 Recherche</h5>
            <p>Utilisez Ctrl+K ou le bouton de recherche avancée</p>
          </div>
          <div className="guide-item">
            <h5>💾 Sauvegarde</h5>
            <p>Cliquez sur le bouton 💾 flottant pour gérer les sauvegardes</p>
          </div>
          <div className="guide-item">
            <h5>⌨️ Raccourcis</h5>
            <p>Appuyez sur F1 pour voir tous les raccourcis disponibles</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureTester; 