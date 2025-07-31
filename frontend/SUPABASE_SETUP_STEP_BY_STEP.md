# 🚀 Configuration Supabase Storage - Guide Visuel

## 📋 État Actuel
- ❌ **Bucket "documents"** : N'existe pas
- ❌ **Politiques RLS** : Non configurées
- ✅ **Projet Supabase** : Connecté et fonctionnel

---

## 🎯 Étape 1 : Créer le Bucket "documents"

### 1.1 Accéder au Dashboard Supabase
1. Ouvrez votre navigateur
2. Allez sur : **https://supabase.com/dashboard/project/vmqlhrtnerijjtzhjqpd/storage**
3. Connectez-vous si nécessaire

### 1.2 Créer le Bucket
1. Cliquez sur **"New bucket"** (bouton bleu)
2. Remplissez les champs :
   ```
   Name: documents
   Public bucket: ✅ Cochez cette case
   File size limit: 50MB
   Allowed MIME types: (laissez vide)
   ```
3. Cliquez sur **"Create bucket"**

### 1.3 Vérification
- ✅ Le bucket "documents" apparaît dans la liste
- ✅ Statut : "Public"

---

## 🔐 Étape 2 : Configurer les Politiques RLS

### 2.1 Accéder aux Politiques
1. Cliquez sur le bucket **"documents"**
2. Allez dans l'onglet **"Policies"**
3. Cliquez sur **"New Policy"**

### 2.2 Politique 1 : Upload de Documents
1. **Nom** : `Users can upload documents`
2. **Type** : `INSERT`
3. **Code SQL** :
```sql
CREATE POLICY "Users can upload documents" ON storage.objects
FOR INSERT WITH CHECK (auth.uid()::text = (storage.foldername(name))[1]);
```
4. Cliquez sur **"Review"** puis **"Save policy"**

### 2.3 Politique 2 : Lecture de Documents
1. Cliquez sur **"New Policy"**
2. **Nom** : `Users can view documents`
3. **Type** : `SELECT`
4. **Code SQL** :
```sql
CREATE POLICY "Users can view documents" ON storage.objects
FOR SELECT USING (auth.uid()::text = (storage.foldername(name))[1]);
```
5. Cliquez sur **"Review"** puis **"Save policy"**

### 2.4 Politique 3 : Suppression de Documents
1. Cliquez sur **"New Policy"**
2. **Nom** : `Users can delete documents`
3. **Type** : `DELETE`
4. **Code SQL** :
```sql
CREATE POLICY "Users can delete documents" ON storage.objects
FOR DELETE USING (auth.uid()::text = (storage.foldername(name))[1]);
```
5. Cliquez sur **"Review"** puis **"Save policy"**

---

## 🧪 Étape 3 : Test de Configuration

### 3.1 Vérifier la Configuration
Exécutez le script de vérification :
```bash
node setup-supabase-storage.js
```

### 3.2 Test dans l'Application
1. Démarrez l'application : `npm start`
2. Connectez-vous avec un compte
3. Essayez d'uploader un fichier
4. Vérifiez qu'il n'y a plus d'erreur 400

---

## 🔧 Alternative : Politique Simple (Tests)

Si vous voulez une solution rapide pour tester :

### Politique Unique
1. Créez une seule politique :
```sql
CREATE POLICY "Allow all" ON storage.objects FOR ALL USING (true);
```

### ⚠️ Attention
- Cette politique permet l'accès à tous les utilisateurs
- À utiliser uniquement pour les tests
- **Ne pas utiliser en production**

---

## 📊 Checklist de Vérification

- [ ] Bucket "documents" créé
- [ ] Bucket configuré comme public
- [ ] Politique d'upload créée
- [ ] Politique de lecture créée
- [ ] Politique de suppression créée
- [ ] Test d'upload réussi
- [ ] Fichiers visibles dans le bucket
- [ ] Pas d'erreurs 400 dans la console

---

## 🎯 Résultat Attendu

Après cette configuration :
- ✅ Upload de fichiers fonctionnel
- ✅ Fichiers stockés dans Supabase
- ✅ Sécurité par utilisateur
- ✅ Interface moderne et responsive
- ✅ Application 100% fonctionnelle

---

## 🆘 Dépannage

### Erreur "Bucket not found"
- Vérifiez que le bucket "documents" existe
- Vérifiez l'orthographe

### Erreur "Permission denied"
- Vérifiez les politiques RLS
- Assurez-vous que l'utilisateur est authentifié

### Erreur "File too large"
- Augmentez la limite de taille du bucket
- Ou réduisez la taille du fichier

---

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs dans la console du navigateur (F12)
2. Vérifiez les logs dans Supabase Dashboard > Logs
3. Exécutez `node setup-supabase-storage.js` pour diagnostiquer 