# 🔄 Guide de Migration v1.0 → v2.0

## 📌 Vue d'ensemble

Ce guide explique comment migrer votre projet du système ancien (v1.0) vers la nouvelle architecture (v2.0) avec profondeur illimitée et gestion centralisée.

## ✅ Checklist de migration

- [ ] Installer les nouvelles dépendances (si nécessaire)
- [ ] Créer les fichiers de la nouvelle architecture
- [ ] Envelopper l'app avec `FolderProvider`
- [ ] Remplacer les composants anciens par les nouveaux
- [ ] Tester la migration des données
- [ ] Valider le fonctionnement complet
- [ ] Nettoyer les anciens fichiers

## 🚀 Étapes de migration

### Étape 1 : Préparation

```bash
# Vérifier que vous avez les fichiers créés
ls -la frontend/src/hooks/useFolderManager.js
ls -la frontend/src/contexts/FolderContext.js
ls -la frontend/src/components/FolderTreeV2.js
ls -la frontend/src/components/DocumentGalleryV2.js
```

### Étape 2 : Envelopper l'application avec FolderProvider

**Fichier :** `frontend/src/index.js`

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { FolderProvider } from './contexts/FolderContext';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <FolderProvider>
      <App />
    </FolderProvider>
  </React.StrictMode>
);
```

### Étape 3 : Mettre à jour App.js

**Avant :**
```javascript
import FolderTree from './components/FolderTree';
import DocumentGallery from './components/DocumentGallery';

function App() {
  const [folders, setFolders] = useState({});
  const [documents, setDocuments] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  
  useEffect(() => {
    const savedFolders = localStorage.getItem('classeurFolders');
    const savedDocuments = localStorage.getItem('classeurDocuments');
    if (savedFolders) setFolders(JSON.parse(savedFolders));
    if (savedDocuments) setDocuments(JSON.parse(savedDocuments));
  }, []);
  
  // ... logique complexe ...
}
```

**Après :**
```javascript
import FolderTreeV2 from './components/FolderTreeV2';
import DocumentGalleryV2 from './components/DocumentGalleryV2';
import { useFolders } from './contexts/FolderContext';

function App() {
  const { isLoading, migrateFromOldFormat } = useFolders();
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  
  // Migration automatique au premier chargement
  useEffect(() => {
    if (!isLoading) {
      migrateFromOldFormat();
    }
  }, [isLoading, migrateFromOldFormat]);
  
  // ... logique simplifiée ...
}
```

### Étape 4 : Remplacer les composants

**Avant :**
```javascript
<FolderTree
  folders={folders}
  onFolderSelect={handleFolderSelect}
  selectedFolder={selectedFolder}
  onFoldersChange={handleFoldersChange}
  documents={documents}
/>

<DocumentGallery
  documents={filteredDocuments}
  onDelete={(docId) => {
    setDocuments(prev => prev.filter(doc => doc.id !== docId));
  }}
/>
```

**Après :**
```javascript
<FolderTreeV2
  selectedFolderId={selectedFolderId}
  onFolderSelect={setSelectedFolderId}
/>

<DocumentGalleryV2
  folderId={selectedFolderId}
  searchQuery={searchTerm}
  filterType={currentFilter}
  sortBy={currentSort}
/>
```

### Étape 5 : Mettre à jour les autres composants

Pour chaque composant utilisant les données :

**Avant :**
```javascript
function MyComponent({ folders, documents }) {
  // Accès direct aux props
}
```

**Après :**
```javascript
import { useFolders } from '../contexts/FolderContext';

function MyComponent() {
  const { folders, documents, getFoldersByParent, getDocumentsByFolder } = useFolders();
  // Accès via le hook
}
```

### Étape 6 : Exemples de refactorisation

#### Exemple 1 : Dashboard

**Avant :**
```javascript
function Dashboard({ folders, documents }) {
  const totalFolders = Object.keys(folders).length;
  const totalDocuments = documents.length;
  // ...
}
```

**Après :**
```javascript
function Dashboard() {
  const { getStatistics } = useFolders();
  const stats = getStatistics();
  // stats.totalFolders, stats.totalDocuments, etc.
}
```

#### Exemple 2 : Recherche

**Avant :**
```javascript
function SearchBar({ documents, folders }) {
  const [results, setResults] = useState([]);
  
  const search = (query) => {
    const filtered = documents.filter(doc =>
      doc.name.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered);
  };
}
```

**Après :**
```javascript
function SearchBar() {
  const { searchDocuments } = useFolders();
  
  const search = (query) => {
    const results = searchDocuments(query);
  };
}
```

#### Exemple 3 : Import de documents

**Avant :**
```javascript
function DocumentImport({ onAddDocuments, folderPath }) {
  const handleImport = (files) => {
    const newDocs = files.map(file => ({
      id: generateId(),
      name: file.name,
      path: folderPath, // Chemin texte
      type: file.type,
      size: file.size
    }));
    onAddDocuments(newDocs);
  };
}
```

**Après :**
```javascript
function DocumentImport({ folderId }) {
  const { addDocuments } = useFolders();
  
  const handleImport = (files) => {
    const newDocs = files.map(file => ({
      name: file.name,
      folderId: folderId, // ID du dossier
      type: file.type,
      size: file.size
    }));
    addDocuments(newDocs, folderId);
  };
}
```

## 🔍 Vérification de la migration

### Test 1 : Vérifier le chargement des données

```javascript
// Dans la console du navigateur
const { folders, documents } = useFolders();
console.log('Dossiers:', folders);
console.log('Documents:', documents);
```

### Test 2 : Vérifier la structure des données

```javascript
// Les dossiers doivent avoir des IDs
folders.forEach(f => {
  console.assert(f.id, 'Dossier sans ID');
  console.assert(f.name, 'Dossier sans nom');
  console.assert(f.parentId !== undefined, 'Dossier sans parentId');
});

// Les documents doivent avoir des IDs et des folderIds
documents.forEach(d => {
  console.assert(d.id, 'Document sans ID');
  console.assert(d.name, 'Document sans nom');
  console.assert(d.folderId !== undefined, 'Document sans folderId');
});
```

### Test 3 : Vérifier les opérations CRUD

```javascript
// Créer un dossier
const { addFolder, folders } = useFolders();
const newFolder = addFolder('Test Folder');
console.log('Nouveau dossier:', newFolder);

// Vérifier qu'il est dans la liste
console.assert(folders.find(f => f.id === newFolder.id), 'Dossier non trouvé');
```

## ⚠️ Points d'attention

### Changements de structure

| Ancien | Nouveau |
|--------|---------|
| `path: "A > B > C"` | `folderId: "folder_123"` |
| `folders: { A: { B: {} } }` | `folders: [{ id, name, parentId }]` |
| Pas d'IDs | IDs uniques pour chaque dossier |
| Profondeur max 3 | Profondeur illimitée |

### localStorage

Les anciennes données sont conservées dans :
- `classeurFolders` (ancien format)
- `classeurDocuments` (ancien format)

Les nouvelles données sont stockées dans :
- `classeurFolders_v2` (nouveau format)
- `classeurDocuments_v2` (nouveau format)

Pour nettoyer après migration réussie :
```javascript
localStorage.removeItem('classeurFolders');
localStorage.removeItem('classeurDocuments');
```

### Performance

La nouvelle architecture est plus performante car :
- Les recherches par ID sont O(1) au lieu de O(n)
- Les renommages n'affectent que le dossier, pas tous les documents
- Les requêtes sont plus simples et optimisables

## 🆘 Dépannage

### Problème : Les données ne se chargent pas

**Solution :**
```javascript
// Vérifier que FolderProvider enveloppe l'app
// Vérifier que useFolders() est appelé dans un composant enfant
// Vérifier la console pour les erreurs
```

### Problème : Les données anciennes ne sont pas migrées

**Solution :**
```javascript
// Appeler manuellement la migration
const { migrateFromOldFormat } = useFolders();
useEffect(() => {
  migrateFromOldFormat();
}, []);

// Vérifier les données migrées
console.log(localStorage.getItem('classeurFolders_v2'));
```

### Problème : Les documents ne s'affichent pas

**Solution :**
```javascript
// Vérifier que le folderId est correct
const { getDocumentsByFolder } = useFolders();
console.log(getDocumentsByFolder(selectedFolderId));

// Vérifier que les documents ont un folderId
documents.forEach(d => {
  console.log(d.id, d.folderId);
});
```

## 📚 Ressources

- [Architecture v2.0](./ARCHITECTURE_V2.md)
- [Hook useFolderManager](./frontend/src/hooks/useFolderManager.js)
- [Context FolderContext](./frontend/src/contexts/FolderContext.js)

## 🎉 Après la migration

Une fois la migration terminée :

1. **Testez complètement** l'application
2. **Sauvegardez les données** en JSON (export)
3. **Nettoyez les anciens fichiers** (FolderTree.js ancien, etc.)
4. **Documentez les changements** dans le README
5. **Mettez à jour les tests** si vous en avez

---

**Version :** 1.0  
**Date :** 2024-03-25  
**Auteur :** Refactorisation automatisée
