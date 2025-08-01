# 📁 Classeur Numérique Intelligent

Une application moderne de gestion de documents avec interface utilisateur intuitive et authentification sécurisée.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/React-18.0+-61dafb)
![Supabase](https://img.shields.io/badge/Supabase-Latest-3ecf8e)
![License](https://img.shields.io/badge/license-MIT-green)

## 🚀 Fonctionnalités

### ✨ Interface Moderne
- **Design Glassmorphism** : Interface élégante avec effets de transparence
- **Responsive Design** : Optimisé pour tous les appareils
- **Animations fluides** : Transitions et micro-interactions
- **Thème adaptatif** : Support des modes clair/sombre

### 📂 Gestion de Documents
- **Arborescence hiérarchique** : Organisation en dossiers et sous-dossiers
- **Navigation intuitive** : Parcours facile de la structure
- **Actions rapides** : Création, modification, suppression
- **Recherche globale** : Trouvez rapidement vos documents

### 🔐 Sécurité
- **Authentification Supabase** : Connexion sécurisée
- **Gestion des sessions** : Connexion persistante
- **Protection des données** : Accès contrôlé aux documents

### 📊 Statistiques
- **Vue d'ensemble** : Statistiques en temps réel
- **Métriques détaillées** : Nombre de dossiers, documents, taille
- **Graphiques interactifs** : Visualisation des données

## 🛠️ Technologies Utilisées

### Frontend
- **React 18** : Framework JavaScript moderne
- **CSS3** : Styles personnalisés avec variables CSS
- **Glassmorphism** : Effets de transparence et flou
- **Responsive Design** : Mobile-first approach

### Backend & Base de Données
- **Supabase** : Backend-as-a-Service
- **PostgreSQL** : Base de données relationnelle
- **Row Level Security** : Sécurité au niveau des données

### Outils de Développement
- **npm** : Gestionnaire de paquets
- **Git** : Contrôle de version
- **ESLint** : Linting du code

## 📋 Prérequis

- **Node.js** (version 16 ou supérieure)
- **npm** ou **yarn**
- **Compte Supabase** (gratuit)

## 🚀 Installation

### 1. Cloner le Repository

```bash
git clone https://github.com/votre-username/classeur-numerique-intelligent.git
cd classeur-numerique-intelligent
```

### 2. Installer les Dépendances

```bash
# Installation des dépendances principales
npm install

# Installation des dépendances frontend
cd frontend
npm install
```

### 3. Configuration Supabase

1. **Créer un projet Supabase** :
   - Allez sur [supabase.com](https://supabase.com)
   - Créez un nouveau projet
   - Notez votre URL et clé API

2. **Configurer les variables d'environnement** :
   ```bash
   # Dans le dossier frontend, créez un fichier .env
   REACT_APP_SUPABASE_URL=votre_url_supabase
   REACT_APP_SUPABASE_ANON_KEY=votre_cle_anonyme
   ```

3. **Exécuter le script SQL** :
   - Ouvrez le fichier `SUPABASE_SETUP.sql`
   - Exécutez le script dans l'éditeur SQL de Supabase

### 4. Lancer l'Application

```bash
# Depuis le dossier frontend
npm start
```

L'application sera accessible à l'adresse : `http://localhost:3000`

## 📁 Structure du Projet

```
classeur-numerique-intelligent/
├── frontend/                 # Application React
│   ├── public/              # Fichiers publics
│   ├── src/                 # Code source
│   │   ├── components/      # Composants React
│   │   ├── contexts/        # Contextes React
│   │   ├── hooks/           # Hooks personnalisés
│   │   ├── utils/           # Utilitaires
│   │   └── App.js           # Composant principal
│   ├── package.json         # Dépendances frontend
│   └── README.md           # Documentation frontend
├── SUPABASE_SETUP.sql      # Script de configuration BDD
├── ARCHITECTURE.md         # Documentation architecture
├── WIREFRAMES.md           # Maquettes et wireframes
├── package.json            # Dépendances principales
└── README.md              # Ce fichier
```

## 🎯 Utilisation

### 🔐 Connexion
1. Ouvrez l'application dans votre navigateur
2. Cliquez sur "Se connecter" dans le header
3. Entrez vos identifiants Supabase
4. Vous êtes maintenant connecté !

### 📂 Gestion des Dossiers
1. **Créer un dossier** :
   - Cliquez sur le bouton "+" dans la sidebar
   - Entrez le nom du dossier
   - Choisissez le dossier parent (optionnel)

2. **Naviguer** :
   - Cliquez sur un dossier pour l'ouvrir
   - Utilisez la hiérarchie pour naviguer
   - Les sous-dossiers s'affichent automatiquement

3. **Modifier/Supprimer** :
   - Survolez un dossier pour voir les actions
   - Cliquez sur l'icône d'édition ou de suppression
   - Confirmez l'action

### 🔍 Recherche
- Utilisez la barre de recherche globale
- Filtrez par nom, type ou date
- Résultats en temps réel

## 🎨 Personnalisation

### Couleurs et Thème
Les couleurs sont définies dans `frontend/src/App.css` :

```css
:root {
  --primary-color: #A78BFA;    /* Violet pastel */
  --secondary-color: #93C5FD;  /* Bleu clair pastel */
  --accent-color: #F472B6;     /* Rose pastel */
  /* ... autres variables */
}
```

### Styles Responsifs
L'application s'adapte automatiquement aux différentes tailles d'écran :
- **Desktop** : Interface complète avec sidebar
- **Tablet** : Layout adaptatif
- **Mobile** : Interface optimisée tactile

## 🔧 Développement

### Scripts Disponibles

```bash
# Démarrer en mode développement
npm start

# Construire pour la production
npm run build

# Tester l'application
npm test

# Linter le code
npm run lint
```

### Architecture

L'application suit une architecture modulaire :

- **Components** : Composants réutilisables
- **Contexts** : Gestion d'état globale
- **Hooks** : Logique métier réutilisable
- **Utils** : Fonctions utilitaires

### Ajout de Fonctionnalités

1. **Nouveau composant** :
   ```bash
   # Créez un fichier dans src/components/
   touch src/components/MonComposant.js
   ```

2. **Nouveau contexte** :
   ```bash
   # Créez un fichier dans src/contexts/
   touch src/contexts/MonContexte.js
   ```

## 🐛 Dépannage

### Problèmes Courants

**L'application ne démarre pas** :
```bash
# Vérifiez les dépendances
npm install

# Vérifiez les variables d'environnement
cat .env
```

**Erreur de connexion Supabase** :
- Vérifiez vos clés API dans `.env`
- Assurez-vous que le projet Supabase est actif
- Vérifiez les règles RLS dans Supabase

**Problèmes de style** :
- Videz le cache du navigateur
- Redémarrez le serveur de développement

### Logs et Debug

```bash
# Activer les logs détaillés
DEBUG=* npm start

# Vérifier les erreurs de build
npm run build
```

## 📈 Performance

### Optimisations Implémentées
- **Lazy Loading** : Chargement à la demande
- **Memoization** : Cache des composants
- **Code Splitting** : Division du bundle
- **Image Optimization** : Compression automatique

### Métriques
- **First Contentful Paint** : < 1.5s
- **Largest Contentful Paint** : < 2.5s
- **Cumulative Layout Shift** : < 0.1

## 🤝 Contribution

### Comment Contribuer

1. **Fork** le projet
2. **Créez** une branche feature (`git checkout -b feature/AmazingFeature`)
3. **Commitez** vos changements (`git commit -m 'Add AmazingFeature'`)
4. **Push** vers la branche (`git push origin feature/AmazingFeature`)
5. **Ouvrez** une Pull Request

### Standards de Code

- **ESLint** : Respectez les règles de linting
- **Prettier** : Formatage automatique
- **Conventions** : Suivez les conventions React
- **Tests** : Ajoutez des tests pour les nouvelles fonctionnalités

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👥 Équipe

- **Développeur Principal** : [Votre Nom]
- **Design** : Interface moderne et intuitive
- **Architecture** : Scalable et maintenable

## 📞 Support

- **Issues** : [GitHub Issues](https://github.com/votre-username/classeur-numerique-intelligent/issues)
- **Documentation** : Ce README et les fichiers dans `/docs`
- **Email** : [votre-email@example.com]

## 🗺️ Roadmap

### Version 1.1
- [ ] Upload de fichiers
- [ ] Prévisualisation de documents
- [ ] Partage de dossiers

### Version 1.2
- [ ] Synchronisation cloud
- [ ] Versioning des documents
- [ ] API REST complète

### Version 2.0
- [ ] Intelligence artificielle
- [ ] Reconnaissance de texte
- [ ] Suggestions automatiques

---

**⭐ N'oubliez pas de donner une étoile au projet si vous l'aimez !**

*Développé avec ❤️ pour une gestion de documents moderne et intuitive.* 