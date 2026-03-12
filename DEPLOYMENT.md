# 🚀 Guide de Déploiement GitHub Pages

Ce guide explique comment déployer le **Classeur Numérique Intelligent** sur GitHub Pages.

## 📋 Prérequis

- Un compte GitHub
- Le projet cloné sur votre machine locale
- Node.js et npm installés

## 🔧 Configuration

### 1. Préparer le repository GitHub

1. Créez un nouveau repository sur GitHub nommé `classeur-numerique-intelligent`
2. Poussez votre code vers ce repository :
   ```bash
   git remote add origin https://github.com/euloge-mabiala/classeur-numerique-intelligent.git
   git branch -M main
   git push -u origin main
   ```

### 2. Installer les dépendances

```bash
# Installation complète
npm run install:all

# Ou installation manuelle
npm install
cd frontend
npm install
npm install gh-pages --save-dev
```

## 🚀 Déploiement

### Méthode 1 : Déploiement automatique (Recommandé)

Le projet est configuré avec GitHub Actions pour un déploiement automatique.

1. **Activez GitHub Pages** dans les paramètres de votre repository :
   - Allez dans Settings > Pages
   - Source : "Deploy from a branch"
   - Branch : `gh-pages` / `/(root)`
   - Cliquez "Save"

2. **Le déploiement se fait automatiquement** à chaque push sur la branche `main`

### Méthode 2 : Déploiement manuel

```bash
# Depuis la racine du projet
npm run deploy

# Ou depuis le dossier frontend
cd frontend
npm run deploy
```

## 🌐 URL de l'application

Une fois déployée, votre application sera accessible à :
- **URL principale** : `https://euloge-mabiala.github.io/classeur-numerique-intelligent`
- **URL alternative** : `https://euloge-mabiala.github.io`

## ⚙️ Configuration avancée

### Variables d'environnement

Si vous utilisez des variables d'environnement, créez un fichier `.env` dans le dossier `frontend/` :

```env
REACT_APP_API_URL=your_api_url
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_key
```

### Domaine personnalisé

Pour utiliser un domaine personnalisé :

1. Ajoutez votre domaine dans le fichier `frontend/public/CNAME`
2. Configurez les DNS de votre domaine pour pointer vers `euloge-mabiala.github.io`
3. Activez HTTPS dans les paramètres GitHub Pages

## 🔍 Vérification du déploiement

1. **Vérifiez les Actions GitHub** :
   - Allez dans l'onglet "Actions" de votre repository
   - Vérifiez que le workflow "Deploy to GitHub Pages" s'est exécuté avec succès

2. **Vérifiez la branche gh-pages** :
   - Cette branche est créée automatiquement
   - Elle contient les fichiers de build de production

3. **Testez l'application** :
   - Ouvrez l'URL de votre application
   - Vérifiez que toutes les fonctionnalités marchent correctement

## 🛠️ Dépannage

### Problèmes courants

1. **Erreur 404** :
   - Vérifiez que le fichier `404.html` est présent dans `frontend/public/`
   - Assurez-vous que le script de redirection est dans `index.html`

2. **Assets non trouvés** :
   - Vérifiez que `homepage` est correctement configuré dans `package.json`
   - Assurez-vous que le build s'est bien passé

3. **Problèmes de routage** :
   - Vérifiez que les scripts de redirection SPA sont présents
   - Testez la navigation dans l'application

### Logs de déploiement

Pour voir les logs de déploiement :
```bash
# Logs de build
npm run build

# Logs de déploiement
npm run deploy
```

## 📝 Notes importantes

- **Stockage local** : L'application utilise localStorage, donc les données restent dans le navigateur
- **Pas de backend** : Cette version fonctionne entièrement côté client
- **Performance** : L'application est optimisée pour le déploiement statique

## 🔄 Mise à jour

Pour mettre à jour l'application :

1. Faites vos modifications
2. Committez et poussez vers GitHub :
   ```bash
   git add .
   git commit -m "Mise à jour de l'application"
   git push origin main
   ```
3. Le déploiement se fait automatiquement

---

**Développé avec ❤️ par EULOGE JUNIOR MABIALA** 