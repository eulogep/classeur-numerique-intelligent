# 🎨 Guide des Améliorations UX et Système UI

## 📋 Vue d'ensemble

Ce guide explique comment intégrer les améliorations UX (Drag & Drop, interface cohérente) et utiliser le nouveau système de composants UI unifié.

---

## 🎯 Améliorations UX implémentées

### 1. Drag & Drop (`DragDropManager.js`)

#### Hook `useDragDrop`

Gère l'état et la logique du Drag & Drop.

```javascript
import { useDragDrop } from '../components/DragDropManager';

function MyComponent() {
  const {
    draggedItem,
    dragOverFolderId,
    startDrag,
    endDrag,
    handleDragOver,
    handleDrop
  } = useDragDrop();

  return (
    // ...
  );
}
```

#### Composants Drag & Drop

**DraggableItem** : Rend un élément draggable

```javascript
import { DraggableItem } from '../components/DragDropManager';

<DraggableItem
  itemType="document"
  itemId={doc.id}
  onDragStart={startDrag}
  onDragEnd={endDrag}
>
  <div className="document-item">
    {doc.name}
  </div>
</DraggableItem>
```

**DragDropZone** : Zone de dépôt

```javascript
import { DragDropZone } from '../components/DragDropManager';

<DragDropZone
  folderId={folder.id}
  isDragOver={dragOverFolderId === folder.id}
  onDragOver={handleDragOver}
  onDrop={handleDrop}
>
  <div className="folder-content">
    {/* Contenu du dossier */}
  </div>
</DragDropZone>
```

#### Exemple complet : Déplacer des documents

```javascript
import React from 'react';
import { useDragDrop, DraggableItem, DragDropZone } from '../components/DragDropManager';
import { useFolders } from '../contexts/FolderContext';

function DocumentManager() {
  const { documents, getDocumentsByFolder } = useFolders();
  const {
    draggedItem,
    dragOverFolderId,
    startDrag,
    endDrag,
    handleDragOver,
    handleDrop
  } = useDragDrop();

  const docs = getDocumentsByFolder(folderId);

  return (
    <DragDropZone
      folderId={folderId}
      isDragOver={dragOverFolderId === folderId}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="documents-list">
        {docs.map(doc => (
          <DraggableItem
            key={doc.id}
            itemType="document"
            itemId={doc.id}
            onDragStart={startDrag}
            onDragEnd={endDrag}
          >
            <div className="document-item">
              {doc.name}
            </div>
          </DraggableItem>
        ))}
      </div>
    </DragDropZone>
  );
}
```

### 2. Système UI unifié (`UISystem.js`)

Fournit des composants cohérents pour toute l'application.

#### Boutons

```javascript
import { Button } from '../components/ui/UISystem';

// Variantes
<Button variant="primary">Créer</Button>
<Button variant="secondary">Annuler</Button>
<Button variant="danger">Supprimer</Button>
<Button variant="success">Valider</Button>

// Tailles
<Button size="sm">Petit</Button>
<Button size="md">Moyen</Button>
<Button size="lg">Grand</Button>

// Avec icône et état de chargement
<Button icon="📁" loading={isLoading}>
  Importer
</Button>
```

#### Cartes

```javascript
import { Card } from '../components/ui/UISystem';

<Card
  title="Mes documents"
  subtitle="5 documents"
>
  <p>Contenu de la carte</p>
</Card>
```

#### Modales

```javascript
import { Modal } from '../components/ui/UISystem';

<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Créer un dossier"
  size="md"
>
  <p>Contenu de la modale</p>
</Modal>
```

#### Formulaires

```javascript
import { FormGroup, Input, Select, Button } from '../components/ui/UISystem';

<FormGroup label="Nom du dossier" required error={errors.name}>
  <Input
    type="text"
    value={name}
    onChange={(e) => setName(e.target.value)}
    placeholder="Entrez le nom"
  />
</FormGroup>

<FormGroup label="Type">
  <Select
    value={type}
    onChange={(e) => setType(e.target.value)}
    options={[
      { value: 'document', label: 'Document' },
      { value: 'image', label: 'Image' }
    ]}
  />
</FormGroup>

<Button variant="primary" type="submit">
  Créer
</Button>
```

#### Alertes

```javascript
import { Alert } from '../components/ui/UISystem';

<Alert
  type="success"
  title="Succès"
  message="Le dossier a été créé"
  onClose={handleClose}
/>

<Alert
  type="error"
  title="Erreur"
  message="Une erreur s'est produite"
/>
```

#### Listes

```javascript
import { List } from '../components/ui/UISystem';

<List
  items={documents}
  renderItem={(doc) => (
    <div>
      <h4>{doc.name}</h4>
      <p>{doc.size} bytes</p>
    </div>
  )}
/>
```

#### Grilles

```javascript
import { Grid } from '../components/ui/UISystem';

<Grid columns={3} gap="lg">
  {items.map(item => (
    <Card key={item.id}>{item.name}</Card>
  ))}
</Grid>
```

#### Badges

```javascript
import { Badge } from '../components/ui/UISystem';

<Badge variant="primary">Nouveau</Badge>
<Badge variant="success">Actif</Badge>
<Badge variant="error">Erreur</Badge>
```

#### Spinners

```javascript
import { Spinner } from '../components/ui/UISystem';

<Spinner size="sm" />
<Spinner size="md" />
<Spinner size="lg" />
```

#### Barre de progression

```javascript
import { ProgressBar } from '../components/ui/UISystem';

<ProgressBar value={65} max={100} showLabel />
```

#### Tabs

```javascript
import { Tabs } from '../components/ui/UISystem';

const tabs = [
  {
    id: 'documents',
    label: 'Documents',
    icon: '📄',
    content: <DocumentList />
  },
  {
    id: 'folders',
    label: 'Dossiers',
    icon: '📁',
    content: <FolderList />
  }
];

<Tabs
  tabs={tabs}
  activeTab={activeTab}
  onTabChange={setActiveTab}
/>
```

#### Tooltips

```javascript
import { Tooltip } from '../components/ui/UISystem';

<Tooltip content="Cliquez pour importer" position="top">
  <button>Importer</button>
</Tooltip>
```

#### Skeleton Loaders

```javascript
import { Skeleton, SkeletonCard } from '../components/ui/UISystem';

// Skeleton simple
<Skeleton width="100%" height="20px" />

// Grille de cartes en chargement
<SkeletonCard count={3} />
```

---

## 🔄 Migration des composants existants

### Avant : Utiliser des styles inline et des boutons HTML

```javascript
function OldComponent() {
  return (
    <div style={{ background: '#16151C', padding: '16px' }}>
      <button style={{ background: '#7C5CFC', color: 'white' }}>
        Créer
      </button>
    </div>
  );
}
```

### Après : Utiliser le système UI

```javascript
import { Card, Button } from '../components/ui/UISystem';

function NewComponent() {
  return (
    <Card>
      <Button variant="primary">Créer</Button>
    </Card>
  );
}
```

---

## 📋 Checklist d'intégration

### Étape 1 : Importer les composants UI

```javascript
// Dans votre composant
import {
  Button,
  Card,
  Modal,
  FormGroup,
  Input,
  Alert,
  // ... autres composants
} from '../components/ui/UISystem';
```

### Étape 2 : Remplacer les boutons

```javascript
// Avant
<button className="btn btn-primary">Créer</button>

// Après
<Button variant="primary">Créer</Button>
```

### Étape 3 : Remplacer les cartes

```javascript
// Avant
<div className="card">
  <h3>Titre</h3>
  <p>Contenu</p>
</div>

// Après
<Card title="Titre">
  <p>Contenu</p>
</Card>
```

### Étape 4 : Ajouter le Drag & Drop

```javascript
import { useDragDrop, DraggableItem, DragDropZone } from '../components/DragDropManager';

// Utiliser le hook et les composants
```

### Étape 5 : Tester et valider

- Vérifier que tous les éléments s'affichent correctement
- Tester les interactions (clic, drag, etc.)
- Vérifier la cohérence visuelle
- Tester la responsivité

---

## 🎨 Personnalisation

### Modifier les couleurs

Éditer les variables CSS dans `UISystem.css` :

```css
:root {
  --color-primary: #7C5CFC;
  --color-secondary: #5C9EFC;
  --color-accent: #FC5C9B;
  /* ... */
}
```

### Ajouter de nouvelles variantes

```css
.ui-button-custom {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}
```

### Étendre les composants

```javascript
// Créer un composant personnalisé basé sur Button
export const CustomButton = (props) => (
  <Button variant="primary" className="custom-btn" {...props} />
);
```

---

## 📚 Exemples complets

### Exemple 1 : Formulaire de création de dossier

```javascript
import React, { useState } from 'react';
import { Modal, FormGroup, Input, Button, Alert } from '../components/ui/UISystem';
import { useFolders } from '../contexts/FolderContext';

function CreateFolderModal({ isOpen, onClose }) {
  const { addFolder } = useFolders();
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = () => {
    if (!name.trim()) {
      setError('Le nom ne peut pas être vide');
      return;
    }

    addFolder(name);
    setSuccess(true);
    setName('');

    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Créer un dossier">
      {success && (
        <Alert
          type="success"
          title="Succès"
          message="Dossier créé avec succès"
        />
      )}

      <FormGroup label="Nom du dossier" required error={error}>
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Entrez le nom du dossier"
        />
      </FormGroup>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
        <Button variant="secondary" onClick={onClose}>
          Annuler
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Créer
        </Button>
      </div>
    </Modal>
  );
}
```

### Exemple 2 : Liste de documents avec Drag & Drop

```javascript
import React from 'react';
import { useFolders } from '../contexts/FolderContext';
import { useDragDrop, DraggableItem, DragDropZone } from '../components/DragDropManager';
import { List } from '../components/ui/UISystem';

function DocumentList({ folderId }) {
  const { getDocumentsByFolder } = useFolders();
  const {
    dragOverFolderId,
    startDrag,
    endDrag,
    handleDragOver,
    handleDrop
  } = useDragDrop();

  const documents = getDocumentsByFolder(folderId);

  return (
    <DragDropZone
      folderId={folderId}
      isDragOver={dragOverFolderId === folderId}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <List
        items={documents}
        renderItem={(doc) => (
          <DraggableItem
            itemType="document"
            itemId={doc.id}
            onDragStart={startDrag}
            onDragEnd={endDrag}
          >
            <div>
              <h4>{doc.name}</h4>
              <p>{doc.size} bytes</p>
            </div>
          </DraggableItem>
        )}
      />
    </DragDropZone>
  );
}
```

---

## 🆘 Dépannage

### Problème : Les styles ne s'appliquent pas

**Solution :**
```javascript
// Vérifier que le CSS est importé
import '../components/ui/UISystem.css';

// Vérifier que les variables CSS sont définies
console.log(getComputedStyle(document.documentElement).getPropertyValue('--color-primary'));
```

### Problème : Le Drag & Drop ne fonctionne pas

**Solution :**
```javascript
// Vérifier que le hook est utilisé correctement
const { draggedItem } = useDragDrop();
console.log('Dragged item:', draggedItem);

// Vérifier que les événements sont attachés
// Utiliser les DevTools pour inspecter les événements
```

### Problème : Les composants ne sont pas cohérents

**Solution :**
- Utiliser uniquement les composants du système UI
- Ne pas mélanger les styles personnalisés
- Vérifier que les variables CSS sont cohérentes

---

## 📚 Ressources

- [Système UI - UISystem.js](./frontend/src/components/ui/UISystem.js)
- [Drag & Drop Manager](./frontend/src/components/DragDropManager.js)
- [Architecture v2.0](./ARCHITECTURE_V2.md)

---

**Version :** 1.0  
**Date :** 2024-03-25  
**Auteur :** Refactorisation automatisée
