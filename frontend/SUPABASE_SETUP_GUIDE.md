# Guide de Configuration Supabase - Classeur Numérique

## 🚨 Problème détecté : Erreur 400 sur l'upload de fichiers

L'erreur `Failed to load resource: the server responded with a status of 400` indique que le bucket de stockage Supabase n'est pas configuré correctement.

## ✅ Solution : Configuration du Bucket de Stockage

### 1. Accéder au Dashboard Supabase
1. Allez sur [supabase.com](https://supabase.com)
2. Connectez-vous à votre compte
3. Sélectionnez votre projet

### 2. Créer le Bucket "documents"
1. Dans le menu de gauche, cliquez sur **"Storage"**
2. Cliquez sur **"New bucket"**
3. Configurez le bucket :
   - **Name** : `documents`
   - **Public bucket** : ✅ **Cochez cette case** (pour permettre l'accès public aux fichiers)
   - **File size limit** : `50MB` (ou selon vos besoins)
   - **Allowed MIME types** : Laissez vide pour accepter tous les types

### 3. Configurer les Permissions RLS (Row Level Security)
1. Dans le bucket `documents`, allez dans l'onglet **"Policies"**
2. Cliquez sur **"New Policy"**
3. Créez une politique pour permettre l'upload :

```sql
-- Politique pour permettre l'upload aux utilisateurs authentifiés
CREATE POLICY "Users can upload documents" ON storage.objects
FOR INSERT WITH CHECK (auth.uid()::text = (storage.foldername(name))[1]);

-- Politique pour permettre la lecture des documents
CREATE POLICY "Users can view documents" ON storage.objects
FOR SELECT USING (auth.uid()::text = (storage.foldername(name))[1]);

-- Politique pour permettre la suppression des documents
CREATE POLICY "Users can delete documents" ON storage.objects
FOR DELETE USING (auth.uid()::text = (storage.foldername(name))[1]);
```

### 4. Alternative : Politique Simple (pour les tests)
Si vous voulez une solution rapide pour tester, créez une politique simple :

```sql
-- ATTENTION : Cette politique permet l'accès à tous les utilisateurs
-- À utiliser uniquement pour les tests
CREATE POLICY "Allow all" ON storage.objects FOR ALL USING (true);
```

## 🔧 Vérification de la Configuration

### 1. Tester l'Upload
Après avoir configuré le bucket, testez l'upload d'un fichier dans l'application.

### 2. Vérifier les Logs
Si l'erreur persiste, vérifiez les logs dans :
- **Console du navigateur** (F12)
- **Dashboard Supabase > Logs**

### 3. Vérifier les Permissions
Assurez-vous que :
- ✅ Le bucket `documents` existe
- ✅ Le bucket est public ou les politiques RLS sont correctes
- ✅ L'utilisateur est authentifié

## 🛠️ Dépannage

### Erreur "Bucket not found"
- Vérifiez que le bucket `documents` existe dans Supabase Storage
- Vérifiez l'orthographe du nom du bucket

### Erreur "Permission denied"
- Vérifiez les politiques RLS du bucket
- Assurez-vous que l'utilisateur est authentifié

### Erreur "File too large"
- Augmentez la limite de taille du bucket
- Ou réduisez la taille du fichier

## 📋 Checklist de Configuration

- [ ] Bucket `documents` créé dans Supabase Storage
- [ ] Bucket configuré comme public ou politiques RLS définies
- [ ] Utilisateur authentifié dans l'application
- [ ] Test d'upload réussi
- [ ] Fichiers visibles dans le dashboard Supabase

## 🎯 Résultat Attendu

Après cette configuration, l'upload de fichiers devrait fonctionner sans erreur 400, et vous devriez voir :
- ✅ Upload réussi dans l'application
- ✅ Fichiers visibles dans Supabase Storage
- ✅ Pas d'erreurs dans la console du navigateur 