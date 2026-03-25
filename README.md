# 📚 Classeur Numérique Intelligent

Un système complet de gestion documentaire intelligent qui combine organisation locale et cloud pour une expérience utilisateur optimale.

## 🎯 Vue d'ensemble

Le **Classeur Numérique Intelligent** est une application moderne qui permet d'organiser, classifier et gérer vos documents de manière intelligente. Le projet supporte à la fois une utilisation locale (via Electron) et cloud (via Supabase), offrant une flexibilité maximale selon vos besoins.

## 🚀 Fonctionnalités principales

### 📁 Gestion documentaire
- **Import intelligent** : Import de fichiers individuels ou de dossiers entiers
- **Classification automatique** : OCR et classification basée sur le contenu
- **Organisation hiérarchique** : Structure de dossiers personnalisable
- **Recherche avancée** : Recherche par contenu, métadonnées et tags

### 🎨 Interface moderne
- **Design responsive** : Interface adaptée à tous les écrans
- **Thèmes personnalisables** : Plusieurs thèmes visuels disponibles
- **Navigation intuitive** : Arborescence de dossiers et galerie de documents
- **Prévisualisation** : Aperçu des documents sans téléchargement

### 🔐 Sécurité et stockage
- **Authentification** : Système de connexion sécurisé
- **Stockage hybride** : Local (Electron) et cloud (Supabase)
- **Chiffrement** : Protection des données sensibles
- **Sauvegarde** : Système de sauvegarde automatique

### 📊 Fonctionnalités avancées
- **Analytics** : Statistiques d'utilisation et d'organisation
- **To-do list intégrée** : Gestion des tâches liées aux documents
- **Raccourcis clavier** : Navigation rapide et efficace
- **Notifications** : Système de notifications en temps réel

## 🏗️ Architecture

Le projet suit une architecture modulaire avec :

- **Frontend** : React.js avec interface moderne
- **Backend** : Node.js + Express.js (pour la version cloud)
- **OCR** : Tesseract.js pour l'extraction de texte
- **Stockage** : Supabase (cloud) + système de fichiers local (Electron)
- **Base de données** : PostgreSQL via Supabase

## 📦 Installation

### Prérequis
- Node.js (version 16 ou supérieure)
- npm ou yarn
- Git

### Installation complète
```bash
# Cloner le repository
git clone [URL_DU_REPO]
cd classeur-numerique-intelligent

# Installer toutes les dépendances
npm run install:all

# Démarrer l'application
npm start
```

### Installation rapide (frontend uniquement)
```bash
cd frontend
npm install
npm start
```

## 🔧 Configuration

### Configuration Supabase (optionnel)
1. Créez un projet Supabase
2. Exécutez le script SQL dans `SUPABASE_SETUP.sql`
3. Configurez les variables d'environnement dans `frontend/.env`

### Configuration Electron (optionnel)
```bash
# Pour créer l'application desktop
cd frontend
npm run electron
```

## 📁 Structure du projet

```
classeur-numerique-intelligent/
├── 📁 frontend/                 # Application React principale
│   ├── 📁 src/
│   │   ├── 📁 components/      # Composants React
│   │   ├── 📁 contexts/        # Contextes React
│   │   ├── 📁 utils/           # Utilitaires
│   │   └── 📁 lib/             # Bibliothèques
│   ├── 📁 public/              # Assets statiques
│   └── package.json
├── 📁 dist/                     # Build de production
├── 📁 node_modules/             # Dépendances racine
├── package.json                 # Configuration racine
├── ARCHITECTURE.md              # Documentation technique
├── SUPABASE_SETUP.sql           # Script de configuration DB
└── WIREFRAMES.md                # Maquettes UI
```

## 🎓 Cas d'usage

### Pour les étudiants
- **Organisation par année** : Prépa, Première, Terminale, ESIEA, SIA
- **Spécialisation Data** : Dossiers dédiés à la data science
- **Documents administratifs** : Gestion des certificats et notes

### Pour les professionnels
- **Gestion de projet** : Organisation par client/projet
- **Archivage intelligent** : Classification automatique des documents
- **Collaboration** : Partage et synchronisation cloud

## 🛠️ Technologies utilisées

### Frontend
- **React 18** : Interface utilisateur
- **CSS moderne** : Styling et animations
- **Material UI / shadcn/ui** : Composants UI
- **Electron** : Application desktop

### Backend
- **Node.js** : Runtime JavaScript
- **Express.js** : Framework web
- **Supabase** : Backend-as-a-Service
- **PostgreSQL** : Base de données

### Outils
- **Tesseract.js** : OCR (Reconnaissance optique de caractères)
- **JWT** : Authentification
- **WebRTC** : Communication temps réel

## 📝 Formats supportés

- **Documents** : PDF, DOC, DOCX, TXT, RTF
- **Images** : JPG, JPEG, PNG, GIF, BMP, TIFF
- **Vidéos** : MP4, AVI, MOV, WMV
- **Audio** : MP3, WAV, FLAC, AAC
- **Archives** : ZIP, RAR, 7Z, TAR
- **Présentations** : PPT, PPTX, KEY

## 🚀 Déploiement

### GitHub Pages (Recommandé)

L'application est configurée pour un déploiement automatique sur GitHub Pages.

**🌐 Application en ligne** : [https://euloge-mabiala.github.io/classeur-numerique-intelligent](https://euloge-mabiala.github.io/classeur-numerique-intelligent)

**🌐 Application en ligne (glm5)** : https://classeur-intelligent.space.z.ai
#### Déploiement automatique
```bash
# Le déploiement se fait automatiquement à chaque push
git push origin main
```

#### Déploiement manuel
```bash
# Depuis la racine du projet
npm run deploy

# Ou depuis le dossier frontend
cd frontend && npm run deploy
```

#### Configuration requise
1. Activez GitHub Pages dans les paramètres du repository
2. Source : "Deploy from a branch"
3. Branch : `gh-pages`

### Autres méthodes de déploiement

#### Production locale
```bash
npm run build
```

#### Electron (Desktop)
```bash
cd frontend
npm run electron
```

## 🤝 Contribution

1. Fork le projet
2. Créez une branche pour votre fonctionnalité
3. Committez vos changements
4. Poussez vers la branche
5. Ouvrez une Pull Request

## 👨‍💻 Auteur

**EULOGE JUNIOR MABIALA**

Développeur passionné par l'organisation documentaire et les technologies modernes. Ce projet est le fruit de nombreuses heures de développement et de réflexion sur l'optimisation de la gestion documentaire.

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

- **Documentation** : Consultez les fichiers `.md` dans le projet
- **Issues** : Utilisez les issues GitHub pour signaler des bugs
- **Discussions** : Forum GitHub pour les questions générales

## 🔄 Roadmap

- [ ] Intégration IA pour classification avancée
- [ ] Synchronisation multi-appareils
- [ ] API publique pour intégrations
- [ ] Mode hors-ligne amélioré
- [ ] Support de plus de formats de fichiers

---

**Développé avec ❤️ par EULOGE JUNIOR MABIALA pour une organisation documentaire intelligente** 
