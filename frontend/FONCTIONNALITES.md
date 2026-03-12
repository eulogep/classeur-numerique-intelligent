# 📚 Classeur Numérique Intelligent - Fonctionnalités

## 🎯 **Vue d'ensemble**
Application de gestion de documents pour étudiants en data science, permettant d'organiser les cours par année et matière avec une interface moderne et intuitive.

## ✨ **Fonctionnalités principales**

### 📁 **Gestion des dossiers**
- **Structure hiérarchique** : Prépa > Première > Terminale > ESIEA > SIA > Administratif
- **Gestion in-tree** : Créer, renommer, supprimer des dossiers directement dans l'arborescence
- **Sous-dossiers** : Support jusqu'à 3 niveaux de profondeur
- **Import de dossiers** : Import complet avec préservation de la structure

### 🔍 **Recherche avancée**
- **Recherche simple** : Recherche instantanée dans les noms de documents
- **Recherche avancée** : 
  - Filtres par type de fichier (PDF, Document, Image, Vidéo, Audio, Archive)
  - Filtres par date (de/à)
  - Filtres par taille (min/max)
  - Filtres par dossier
- **Suggestions intelligentes** : Suggestions basées sur les documents existants
- **Historique de recherche** : Sauvegarde des 10 dernières recherches
- **Raccourcis clavier** : Ctrl+K pour accéder rapidement à la recherche

### 🎨 **Système de thèmes**
- **6 thèmes prédéfinis** :
  - 🌈 Défaut (bleu-violet)
  - 🌙 Sombre (gris foncé)
  - 🌊 Océan (vert-bleu)
  - 🌅 Coucher de soleil (rouge-orange)
  - 🌲 Forêt (vert)
  - 💜 Violet (violet)
- **Personnalisation** : Choix des couleurs principales, secondaires, d'accent et de texte
- **Application dynamique** : Changement instantané des couleurs via variables CSS
- **Sauvegarde** : Préférences sauvegardées dans le localStorage

### 💾 **Système de sauvegarde**
- **Sauvegarde locale** : Création de sauvegardes complètes des données
- **Import/Export** : Import et export de sauvegardes en format JSON
- **Gestion des sauvegardes** : 
  - Liste des 10 dernières sauvegardes
  - Restauration en un clic
  - Suppression individuelle ou globale
  - Statistiques d'utilisation
- **Sauvegarde automatique** : Données sauvegardées automatiquement

### 📊 **Dashboard analytique**
- **Vue d'ensemble** : Statistiques globales de la collection
- **Répartition par type** : Graphique des types de fichiers
- **Dossiers les plus actifs** : Top des dossiers avec le plus de documents
- **Activité récente** : Derniers documents ajoutés
- **Croissance** : Graphique d'évolution de la collection
- **Métriques** : Nombre total de documents, taille totale, etc.

### ⌨️ **Raccourcis clavier**
- **Ctrl+K** : Focus sur la barre de recherche
- **Ctrl+N** : Créer un nouveau dossier
- **Ctrl+I** : Ouvrir l'import de documents
- **F1** : Afficher l'aide des raccourcis
- **Escape** : Fermer les modales

### 📱 **Interface responsive**
- **Design adaptatif** : Interface optimisée pour tous les écrans
- **Mobile-first** : Expérience optimisée sur mobile
- **Animations fluides** : Transitions et animations CSS
- **Accessibilité** : Support des lecteurs d'écran

### 🔧 **Fonctionnalités techniques**
- **Variables CSS dynamiques** : Thèmes appliqués via CSS custom properties
- **localStorage** : Persistance des données côté client
- **Composants React** : Architecture modulaire et réutilisable
- **Gestion d'état** : State management avec hooks React
- **Performance** : Optimisations avec useCallback et useMemo

## 🚀 **Utilisation**

### **Première utilisation**
1. Ouvrir l'application dans le navigateur
2. Utiliser le testeur de fonctionnalités pour vérifier que tout fonctionne
3. Commencer par créer des dossiers dans l'arborescence
4. Importer des documents dans les dossiers appropriés

### **Organisation recommandée**
```
📁 Prépa
  📁 Mathématiques
  📁 Physique
  📁 Chimie
  📁 Informatique

📁 Première
  📁 Mathématiques
  📁 Physique
  📁 Chimie
  📁 Informatique

📁 Terminale
  📁 Mathématiques
  📁 Physique
  📁 Chimie
  📁 Informatique

📁 ESIEA
  📁 Data Science
  📁 Machine Learning
  📁 Statistiques
  📁 Programmation
  📁 Bases de données

📁 SIA
  📁 Année 1
  📁 Année 2
  📁 Année 3

📁 Administratif
  📁 Documents officiels
  📁 Certificats
  📁 Notes
```

### **Conseils d'utilisation**
- **Sauvegardez régulièrement** : Utilisez le bouton 💾 pour créer des sauvegardes
- **Utilisez les raccourcis** : Appuyez sur F1 pour voir tous les raccourcis
- **Personnalisez l'interface** : Cliquez sur 🎨 pour changer de thème
- **Recherchez efficacement** : Utilisez la recherche avancée avec les filtres
- **Organisez logiquement** : Créez une structure cohérente pour vos dossiers

## 🛠️ **Technologies utilisées**
- **Frontend** : React.js 18
- **Styling** : CSS3 avec variables dynamiques
- **Stockage** : localStorage
- **Build** : Create React App
- **Déploiement** : Serveur de développement intégré

## 📋 **Statut des fonctionnalités**
- ✅ **Implémenté et testé**
- ✅ **Interface utilisateur complète**
- ✅ **Système de thèmes fonctionnel**
- ✅ **Recherche avancée opérationnelle**
- ✅ **Sauvegarde/restauration active**
- ✅ **Dashboard analytique**
- ✅ **Raccourcis clavier**
- ✅ **Interface responsive**

## 🎉 **Résumé**
Le Classeur Numérique Intelligent est une application complète et moderne pour la gestion de documents académiques, spécialement conçue pour les étudiants en data science. Elle combine simplicité d'utilisation et fonctionnalités avancées pour offrir une expérience optimale d'organisation de documents. 