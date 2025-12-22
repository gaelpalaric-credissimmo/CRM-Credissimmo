# 🔧 Guide de Dépannage Détaillé - Erreur OAuth 2.0 Google

Si vous avez vérifié que les URLs correspondent mais que l'erreur persiste, suivez ce guide étape par étape.

## ✅ Vérifications Essentielles

### 1. Type d'Application dans Google Cloud Console

**CRITIQUE** : Le type d'application doit être **"Application Web"**

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. **APIs et services** > **Identifiants**
3. Cliquez sur votre ID client OAuth 2.0
4. Vérifiez que le **Type d'application** est bien **"Application Web"**
5. Si ce n'est pas le cas :
   - **SUPPRIMEZ** cet ID client
   - **CRÉEZ-EN UN NOUVEAU** en sélectionnant **"Application Web"**

### 2. Vérification Exacte de l'URI

L'URI doit être **EXACTEMENT** identique, caractère par caractère :

#### Dans Google Cloud Console :
1. **APIs et services** > **Identifiants** > Votre ID client OAuth
2. Dans **"URI de redirection autorisés"**, vous devriez voir :
   ```
   https://crm-credissimmo.onrender.com/api/googlesheets/callback
   ```

#### Vérifications à faire :
- ✅ Commence par `https://` (pas `http://`)
- ✅ Pas de `/` à la fin
- ✅ Pas d'espaces avant ou après
- ✅ Pas de caractères invisibles
- ✅ Pas de port (`:443` ou `:80`)
- ✅ Tout en minuscules (même si normalement insensible à la casse)

#### Astuce : Copier-Coller
1. Dans votre CRM, copiez l'URI affichée
2. Dans Google Cloud Console, **SUPPRIMEZ** l'ancienne URI
3. **COLLEZ** la nouvelle URI exactement comme copiée
4. **Enregistrez**

### 3. Écran de Consentement OAuth

1. Dans Google Cloud Console, allez dans **"APIs et services"** > **"Écran de consentement OAuth"**
2. Vérifiez que l'écran de consentement est configuré :
   - **Type d'utilisateur** : Externe ou Interne
   - **Nom de l'application** : Rempli
   - **Email de support** : Rempli
   - **Domaines autorisés** : Peut être vide pour commencer
3. Si l'écran de consentement n'est pas configuré, Google peut bloquer la connexion

### 4. APIs Activées

Vérifiez que ces APIs sont activées dans votre projet :

1. **APIs et services** > **Bibliothèque**
2. Recherchez et activez :
   - ✅ **Google Sheets API**
   - ✅ **Google Drive API**

### 5. Vérification du Client ID

Dans les détails de l'erreur, vous avez :
```
client_id=940073400054-hinmu63i12lk1448ro26ajmr7nj2uhqa.apps.googleusercontent.com
```

Vérifiez que ce Client ID correspond exactement à celui dans :
- Google Cloud Console > Identifiants > Votre ID client OAuth
- Render > Environment > `GOOGLE_CLIENT_ID`

### 6. Vérification du Client Secret

1. Sur Render > Environment
2. Vérifiez que `GOOGLE_CLIENT_SECRET` correspond au secret dans Google Cloud Console
3. **Important** : Si vous avez régénéré le secret dans Google Cloud Console, vous devez mettre à jour celui sur Render

## 🔄 Solution : Recréer l'ID Client OAuth

Si rien ne fonctionne, recréez complètement l'ID client :

### Étape 1 : Supprimer l'ancien ID client

1. Google Cloud Console > **APIs et services** > **Identifiants**
2. Cliquez sur votre ID client OAuth
3. Cliquez sur **"Supprimer"** (en haut à droite)
4. Confirmez la suppression

### Étape 2 : Créer un nouveau ID client

1. Cliquez sur **"Créer des identifiants"** > **"ID client OAuth"**
2. **Type d'application** : Sélectionnez **"Application Web"**
3. **Nom** : Donnez un nom (ex: "CRM Credissimmo")
4. **URI de redirection autorisés** : Cliquez sur **"Ajouter un URI"**
5. Ajoutez **EXACTEMENT** :
   ```
   https://crm-credissimmo.onrender.com/api/googlesheets/callback
   ```
6. Cliquez sur **"Créer"**
7. **COPIEZ** le Client ID et le Client Secret

### Étape 3 : Mettre à jour Render

1. Render Dashboard > Votre service backend > **Environment**
2. Mettez à jour :
   - `GOOGLE_CLIENT_ID` = Nouveau Client ID
   - `GOOGLE_CLIENT_SECRET` = Nouveau Client Secret
   - `GOOGLE_REDIRECT_URI` = `https://crm-credissimmo.onrender.com/api/googlesheets/callback`
3. Attendez le redéploiement (2-3 minutes)

### Étape 4 : Tester

1. Rechargez la page Google Sheets dans votre CRM
2. Cliquez sur "Se connecter à Google"
3. Ça devrait fonctionner maintenant

## 🐛 Problèmes Spécifiques

### Problème : "redirect_uri_mismatch" même avec URI identique

**Causes possibles :**
1. L'URI dans Google Cloud Console a des espaces invisibles
2. Le type d'application n'est pas "Application Web"
3. L'écran de consentement OAuth n'est pas configuré

**Solution :**
- Recréez l'ID client OAuth (voir ci-dessus)

### Problème : L'erreur persiste après avoir tout vérifié

**Vérifications supplémentaires :**
1. Videz le cache de votre navigateur
2. Essayez en navigation privée
3. Vérifiez les logs Render pour voir l'URI exacte utilisée
4. Attendez 5-10 minutes après avoir modifié l'URI dans Google Cloud Console (propagation)

### Problème : L'URI change à chaque requête

**Cause :** La variable `GOOGLE_REDIRECT_URI` n'est pas définie sur Render

**Solution :** Ajoutez `GOOGLE_REDIRECT_URI` sur Render avec la valeur exacte

## 📋 Checklist Complète

Avant de réessayer, vérifiez que :

- [ ] Le type d'application est **"Application Web"** dans Google Cloud Console
- [ ] L'URI dans Google Cloud Console est **EXACTEMENT** : `https://crm-credissimmo.onrender.com/api/googlesheets/callback`
- [ ] L'URI affichée dans votre CRM correspond exactement
- [ ] L'écran de consentement OAuth est configuré
- [ ] Google Sheets API est activée
- [ ] Google Drive API est activée
- [ ] Le Client ID sur Render correspond à celui dans Google Cloud Console
- [ ] Le Client Secret sur Render correspond à celui dans Google Cloud Console
- [ ] Vous avez attendu 2-3 minutes après les modifications

## 🆘 Si Rien Ne Fonctionne

1. **Recréez complètement l'ID client OAuth** (voir section ci-dessus)
2. Vérifiez que vous utilisez le bon projet Google Cloud
3. Contactez le support Google Cloud si le problème persiste


