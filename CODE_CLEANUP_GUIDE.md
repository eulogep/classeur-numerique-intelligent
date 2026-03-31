# 🧹 Guide de Nettoyage et Refactorisation du Code

## 📋 Vue d'ensemble

Ce guide explique comment nettoyer et refactoriser le code existant pour utiliser les nouvelles améliorations.

---

## 🎯 Objectifs de nettoyage

### 1. Supprimer les doublons
- ❌ Fusionner `SearchBar.js`, `AdvancedSearch.js`, `GlobalSearch.js` → ✅ `SearchV2.js`
- ❌ Fusionner les systèmes de notifications → ✅ `NotificationSystem.js` unifié
- ❌ Éliminer les helpers dupliqués → ✅ Centralisés dans `helpers.js`

### 2. Centraliser la logique
- ❌ Logique CRUD dispersée → ✅ Centralisée dans `useFolderManager`
- ❌ Helpers de formatage dupliqués → ✅ Centralisés dans `utils/helpers.js`
- ❌ Icônes hardcodées → ✅ Fonction `getFileIcon()`

### 3. Unifier l'interface
- ❌ Styles CSS incohérents → ✅ Système UI unifié
- ❌ Composants différents pour les modales → ✅ Composant `Modal` unifié
- ❌ Boutons avec styles inline → ✅ Composant `Button` réutilisable

### 4. Améliorer la qualité
- ❌ Pas de PropTypes → ✅ Ajouter PropTypes/TypeScript
- ❌ Pas de tests → ✅ Ajouter tests unitaires
- ❌ Documentation insuffisante → ✅ Documenter les composants

---

## 📝 Checklist de refactorisation

### Phase 1 : Préparation
- [ ] Créer une branche `refactor/cleanup-v2`
- [ ] Sauvegarder les anciens fichiers dans un dossier `_deprecated`
- [ ] Mettre à jour le `.gitignore` si nécessaire

### Phase 2 : Centralisation
- [ ] Importer `useFolders` dans tous les composants
- [ ] Remplacer les appels directs au localStorage
- [ ] Utiliser `helpers.js` pour le formatage
- [ ] Utiliser `getFileIcon()` au lieu de hardcoder

### Phase 3 : Unification UI
- [ ] Remplacer les boutons HTML par `Button`
- [ ] Remplacer les modales par `Modal`
- [ ] Remplacer les cartes par `Card`
- [ ] Remplacer les alertes par `Alert`

### Phase 4 : Suppression
- [ ] Supprimer les fichiers dupliqués
- [ ] Supprimer les styles CSS inutilisés
- [ ] Supprimer les imports non utilisés
- [ ] Nettoyer les commentaires obsolètes

### Phase 5 : Tests et validation
- [ ] Tester chaque composant refactorisé
- [ ] Vérifier la cohérence visuelle
- [ ] Vérifier la performance
- [ ] Tester sur mobile

---

## 🔄 Exemples de refactorisation

### Exemple 1 : Remplacer les appels localStorage

#### Avant
```javascript
// Dans un composant
useEffect(() => {
  const folders = JSON.parse(localStorage.getItem('folders') || '[]');
  setFolders(folders);
}, []);

const handleAddFolder = (name) => {
  const newFolder = { id: Date.now(), name };
  const folders = JSON.parse(localStorage.getItem('folders') || '[]');
  folders.push(newFolder);
  localStorage.setItem('folders', JSON.stringify(folders));
};
```

#### Après
```javascript
import { useFolders } from '../contexts/FolderContext';

function MyComponent() {
  const { folders, addFolder } = useFolders();

  const handleAddFolder = (name) => {
    addFolder(name);
  };

  return (
    // ...
  );
}
```

### Exemple 2 : Utiliser les helpers centralisés

#### Avant
```javascript
// Formatage de taille répété partout
const formatSize = (bytes) => {
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Icônes hardcodées
const getIcon = (type) => {
  if (type.includes('pdf')) return '📄';
  if (type.includes('image')) return '🖼️';
  // ...
};
```

#### Après
```javascript
import { formatFileSize, getFileIcon } from '../utils/helpers';

// Utiliser directement
const size = formatFileSize(1024000);
const icon = getFileIcon('application/pdf');
```

### Exemple 3 : Remplacer les boutons HTML

#### Avant
```javascript
<button
  style={{
    background: '#7C5CFC',
    color: 'white',
    padding: '12px 24px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer'
  }}
  onClick={handleClick}
>
  Créer
</button>
```

#### Après
```javascript
import { Button } from '../components/ui/UISystem';

<Button variant="primary" onClick={handleClick}>
  Créer
</Button>
```

### Exemple 4 : Remplacer les modales

#### Avant
```javascript
{showModal && (
  <div style={{
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }}>
    <div style={{
      background: '#16151C',
      padding: '24px',
      borderRadius: '12px'
    }}>
      <h2>Créer un dossier</h2>
      {/* Contenu */}
    </div>
  </div>
)}
```

#### Après
```javascript
import { Modal } from '../components/ui/UISystem';

<Modal
  isOpen={showModal}
  onClose={handleClose}
  title="Créer un dossier"
>
  {/* Contenu */}
</Modal>
```

### Exemple 5 : Remplacer les alertes

#### Avant
```javascript
{error && (
  <div style={{
    background: 'rgba(239, 68, 68, 0.1)',
    color: '#EF4444',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '16px'
  }}>
    {error}
  </div>
)}
```

#### Après
```javascript
import { Alert } from '../components/ui/UISystem';

{error && (
  <Alert
    type="error"
    title="Erreur"
    message={error}
    onClose={() => setError('')}
  />
)}
```

### Exemple 6 : Utiliser SearchV2

#### Avant
```javascript
// 3 composants différents à importer
import SearchBar from './SearchBar';
import AdvancedSearch from './AdvancedSearch';
import GlobalSearch from './GlobalSearch';

// Logique dupliquée partout
const [results, setResults] = useState([]);
const handleSearch = (term) => {
  // Logique de recherche...
};
```

#### Après
```javascript
import SearchV2 from './SearchV2';

<SearchV2
  onResultsChange={setResults}
  onClose={handleClose}
/>
```

---

## 📊 Fichiers à supprimer/fusionner

| Fichier | Action | Remplacé par |
|---------|--------|-------------|
| `SearchBar.js` | ❌ Supprimer | `SearchV2.js` |
| `AdvancedSearch.js` | ❌ Supprimer | `SearchV2.js` |
| `GlobalSearch.js` | ❌ Supprimer | `SearchV2.js` |
| `Dashboard.js` | ⚠️ Fusionner | `DashboardV2.js` |
| `DocumentGallery.js` | ⚠️ Fusionner | `DocumentGalleryV2.js` |
| `FolderTree.js` | ⚠️ Fusionner | `FolderTreeV2.js` |
| `DocumentImport.js` | ⚠️ Fusionner | `DocumentImportV2.js` |

---

## 🔍 Audit du code

### Script d'audit (à exécuter)

```bash
# Chercher les appels directs à localStorage
grep -r "localStorage" frontend/src --include="*.js" --exclude-dir=node_modules

# Chercher les styles inline
grep -r "style={{" frontend/src --include="*.js" --exclude-dir=node_modules

# Chercher les imports dupliqués
grep -r "import.*Button" frontend/src --include="*.js" --exclude-dir=node_modules

# Chercher les fonctions dupliquées
grep -r "formatFileSize\|getFileIcon" frontend/src --include="*.js" --exclude-dir=node_modules
```

### Points de contrôle

- [ ] Aucun appel direct à `localStorage` en dehors de `useFolderManager`
- [ ] Aucun style inline (utiliser les classes CSS)
- [ ] Tous les boutons utilisent le composant `Button`
- [ ] Toutes les modales utilisent le composant `Modal`
- [ ] Tous les formatages utilisent les helpers
- [ ] Aucun fichier dupliqué

---

## 📚 Ressources créées

### Fichiers de refactorisation
- `src/hooks/useFolderManager.js` - Logique centralisée
- `src/contexts/FolderContext.js` - Contexte React
- `src/utils/helpers.js` - Helpers centralisés
- `src/components/ui/UISystem.js` - Composants UI
- `src/components/DragDropManager.js` - Drag & Drop

### Fichiers refactorisés (V2)
- `src/components/DashboardV2.js`
- `src/components/SearchV2.js`
- `src/components/DocumentImportV2.js`
- `src/components/FolderTreeV2.js`
- `src/components/DocumentGalleryV2.js`

### Guides
- `ARCHITECTURE_V2.md` - Architecture nouvelle
- `MIGRATION_GUIDE.md` - Guide de migration
- `UX_IMPROVEMENTS_GUIDE.md` - Améliorations UX
- `CODE_CLEANUP_GUIDE.md` - Ce fichier

---

## ✅ Validation finale

Avant de considérer le nettoyage comme terminé :

1. **Tests fonctionnels**
   - [ ] Créer/modifier/supprimer des dossiers
   - [ ] Importer des documents
   - [ ] Rechercher des documents
   - [ ] Afficher le dashboard
   - [ ] Utiliser le drag & drop

2. **Tests visuels**
   - [ ] Interface cohérente
   - [ ] Pas de styles cassés
   - [ ] Responsive sur mobile
   - [ ] Animations fluides

3. **Tests de performance**
   - [ ] Pas de fuites mémoire
   - [ ] Temps de chargement acceptable
   - [ ] Pas de re-rendus inutiles

4. **Tests d'accessibilité**
   - [ ] Navigation au clavier
   - [ ] Lecteur d'écran compatible
   - [ ] Contraste suffisant
   - [ ] ARIA labels présents

---

## 🚀 Déploiement

Après validation :

```bash
# 1. Créer une PR avec les changements
git checkout -b refactor/cleanup-v2
git add .
git commit -m "refactor: cleanup and consolidate components v2"
git push origin refactor/cleanup-v2

# 2. Merger après review
git checkout main
git merge refactor/cleanup-v2

# 3. Tagger la version
git tag -a v2.0 -m "Major refactoring: structure, UI, UX improvements"
git push origin v2.0
```

---

## 📞 Support

Pour toute question lors du nettoyage :
1. Consulter les guides (ARCHITECTURE_V2.md, MIGRATION_GUIDE.md)
2. Vérifier les exemples dans ce fichier
3. Consulter les commentaires dans le code
4. Tester avec les données de migration

---

**Version :** 1.0  
**Date :** 2024-03-25  
**Statut :** Prêt pour implémentation
