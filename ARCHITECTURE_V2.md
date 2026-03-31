# 🏗️ Architecture Refactorisée v2.0

## 📋 Vue d'ensemble

Cette documentation décrit la nouvelle architecture du **Classeur Numérique Intelligent**, conçue pour supporter une profondeur de dossiers illimitée, une meilleure performance et une maintenabilité accrue.

## 🔄 Changements majeurs

### Avant (v1.0)
```javascript
// Structure imbriquée limitée à 3 niveaux
{
  "Dossier1": {
    "Sous-dossier1": {
      "Sous-sous-dossier1": {}
    }
  }
}

// Documents avec chemins texte fragiles
{
  id: "doc1",
  path: "Dossier1 > Sous-dossier1 > Sous-sous-dossier1"
}
```

**Limitations :**
- ❌ Profondeur maximale de 3 niveaux
- ❌ Chemins texte fragiles (renommage = mise à jour de tous les documents)
- ❌ Pas d'IDs uniques pour les dossiers
- ❌ Pas de métadonnées (couleur, icône, etc.)
- ❌ Opérations CRUD dispersées dans les composants

### Après (v2.0)
```javascript
// Structure plate avec IDs et références parentales
[
  {
    id: "folder_1234567890_abc123",
    name: "Dossier1",
    parentId: null,
    createdAt: "2024-03-25T10:00:00Z",
    updatedAt: "2024-03-25T10:00:00Z",
    color: "#7C5CFC",
    icon: "📁"
  },
  {
    id: "folder_1234567891_def456",
    name: "Sous-dossier1",
    parentId: "folder_1234567890_abc123",
    createdAt: "2024-03-25T10:05:00Z",
    updatedAt: "2024-03-25T10:05:00Z",
    color: null,
    icon: "📁"
  }
]

// Documents avec références par ID
{
  id: "doc_1234567892_ghi789",
  name: "Document.pdf",
  folderId: "folder_1234567891_def456",
  type: "application/pdf",
  size: 1024000,
  addedAt: "2024-03-25T10:10:00Z",
  updatedAt: "2024-03-25T10:10:00Z"
}
```

**Avantages :**
- ✅ Profondeur illimitée
- ✅ IDs uniques et stables
- ✅ Renommage sans impact en cascade
- ✅ Métadonnées extensibles
- ✅ Opérations CRUD centralisées
- ✅ Meilleure performance
- ✅ Requêtes plus simples et prévisibles

## 🎯 Architecture en couches

```
┌─────────────────────────────────────────┐
│         Composants React                │
│  (FolderTree, DocumentGallery, etc.)    │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│      FolderContext (Contexte)           │
│  (Centralise l'accès aux données)       │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│    useFolderManager (Hook)              │
│  (Logique métier + localStorage)        │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│      localStorage / IndexedDB            │
│  (Persistance des données)              │
└─────────────────────────────────────────┘
```

## 📦 Modules clés

### 1. `useFolderManager` Hook

**Fichier :** `src/hooks/useFolderManager.js`

Gère toute la logique métier des dossiers et documents.

**État :**
```javascript
{
  folders: Folder[],        // Tous les dossiers
  documents: Document[],    // Tous les documents
  isLoading: boolean        // État de chargement
}
```

**Opérations sur les dossiers :**
```javascript
addFolder(name, parentId)           // Créer un dossier
renameFolder(folderId, newName)     // Renommer
deleteFolder(folderId)              // Supprimer (récursif)
moveFolder(folderId, newParentId)   // Déplacer
setFolderColor(folderId, color)     // Changer la couleur
```

**Opérations sur les documents :**
```javascript
addDocuments(docs, folderId)        // Ajouter des documents
deleteDocument(documentId)          // Supprimer
moveDocument(documentId, folderId)  // Déplacer
updateDocument(documentId, updates) // Mettre à jour
```

**Requêtes :**
```javascript
getFolderById(folderId)             // Obtenir un dossier
getFoldersByParent(parentId)        // Enfants directs
getDocumentsByFolder(folderId)      // Documents d'un dossier
getDocumentById(documentId)         // Obtenir un document
getFolderHierarchy(parentId)        // Arborescence complète
getFolderPath(folderId)             // Chemin d'affichage
searchDocuments(query)              // Recherche
getStatistics()                     // Statistiques
```

### 2. `FolderContext` Contexte

**Fichier :** `src/contexts/FolderContext.js`

Fournit l'accès centralisé à `useFolderManager` via le contexte React.

**Utilisation :**
```javascript
// Dans un composant
import { useFolders } from '../contexts/FolderContext';

function MyComponent() {
  const { folders, documents, addFolder } = useFolders();
  // ...
}
```

### 3. Structures de données

#### Dossier (Folder)
```typescript
interface Folder {
  id: string;              // Identifiant unique
  name: string;            // Nom du dossier
  parentId: string | null; // ID du dossier parent (null = racine)
  createdAt: string;       // ISO 8601 timestamp
  updatedAt: string;       // ISO 8601 timestamp
  color?: string;          // Couleur personnalisée (hex)
  icon?: string;           // Emoji ou icône
}
```

#### Document
```typescript
interface Document {
  id: string;              // Identifiant unique
  name: string;            // Nom du fichier
  folderId: string | null; // ID du dossier parent
  type: string;            // MIME type
  size: number;            // Taille en bytes
  content?: string;        // Contenu (base64 ou texte)
  addedAt: string;         // ISO 8601 timestamp
  updatedAt: string;       // ISO 8601 timestamp
  lastModified?: string;   // Dernière modification
}
```

## 🔄 Migration depuis v1.0

### Automatique
Le hook `useFolderManager` inclut une fonction `migrateFromOldFormat()` qui :
1. Lit les données anciennes (`classeurFolders`, `classeurDocuments`)
2. Convertit la structure imbriquée en structure plate
3. Crée des IDs uniques pour tous les dossiers
4. Mappe les chemins texte aux IDs
5. Sauvegarde les nouvelles données

**Utilisation :**
```javascript
const { migrateFromOldFormat } = useFolders();

// Dans un useEffect ou au démarrage
useEffect(() => {
  migrateFromOldFormat();
}, []);
```

### Manuel (si nécessaire)
```javascript
// Exporter les anciennes données
const oldFolders = localStorage.getItem('classeurFolders');
const oldDocuments = localStorage.getItem('classeurDocuments');

// Importer les nouvelles données
localStorage.setItem('classeurFolders_v2', JSON.stringify(newFolders));
localStorage.setItem('classeurDocuments_v2', JSON.stringify(newDocuments));
```

## 🚀 Utilisation dans les composants

### Exemple 1 : Afficher l'arborescence des dossiers

```javascript
import { useFolders } from '../contexts/FolderContext';

function FolderTreeComponent() {
  const { getFolderHierarchy, getDocumentsByFolder } = useFolders();
  
  const hierarchy = getFolderHierarchy(); // Racine
  
  return (
    <div>
      {hierarchy.map(folder => (
        <FolderItem
          key={folder.id}
          folder={folder}
          documentCount={getDocumentsByFolder(folder.id).length}
        />
      ))}
    </div>
  );
}
```

### Exemple 2 : Créer un dossier

```javascript
function CreateFolderForm() {
  const { addFolder } = useFolders();
  const [name, setName] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const newFolder = addFolder(name, selectedParentId);
    setName('');
    // Afficher une notification de succès
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nom du dossier"
      />
      <button type="submit">Créer</button>
    </form>
  );
}
```

### Exemple 3 : Afficher les documents d'un dossier

```javascript
function DocumentListComponent({ folderId }) {
  const { getDocumentsByFolder, deleteDocument } = useFolders();
  
  const documents = getDocumentsByFolder(folderId);
  
  return (
    <div>
      {documents.map(doc => (
        <DocumentItem
          key={doc.id}
          document={doc}
          onDelete={() => deleteDocument(doc.id)}
        />
      ))}
    </div>
  );
}
```

## 📊 Avantages de la nouvelle architecture

| Aspect | v1.0 | v2.0 |
|--------|------|------|
| **Profondeur** | Max 3 niveaux | Illimitée |
| **Performance** | O(n) pour les chemins | O(1) pour les IDs |
| **Renommage** | Mise à jour en cascade | Pas d'impact |
| **Métadonnées** | Limitées | Extensibles |
| **Requêtes** | Complexes | Simples |
| **Maintenabilité** | Difficile | Facile |
| **Testabilité** | Limitée | Excellente |

## 🔧 Prochaines étapes

1. **Refactoriser les composants** pour utiliser `useFolders()` au lieu d'accès directs au localStorage
2. **Ajouter des validations** (noms dupliqués, cycles, etc.)
3. **Implémenter le Drag & Drop** avec la nouvelle structure
4. **Ajouter des graphiques réels** avec Chart.js
5. **Optimiser les performances** avec la mémoïsation et le lazy loading

## 📚 Références

- React Hooks : https://react.dev/reference/react/hooks
- Context API : https://react.dev/reference/react/useContext
- localStorage API : https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage

---

**Version :** 2.0  
**Date :** 2024-03-25  
**Auteur :** Refactorisation automatisée
