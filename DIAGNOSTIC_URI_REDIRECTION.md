# 🔍 Diagnostic URI de Redirection - Erreur redirect_uri_mismatch

Si vous avez l'erreur **"redirect_uri_mismatch"**, suivez ce guide pour identifier et corriger le problème.

## 📋 Étape 1 : Identifier l'URI Exacte Utilisée

### Dans votre CRM :

1. Allez sur `https://crm-credissimmo.onrender.com/googlesheets`
2. Ouvrez la console du navigateur (F12 > Console)
3. Rechargez la page
4. Cherchez les messages qui commencent par `📊 Configuration Google Sheets` ou `🔗 URI de redirection utilisée`
5. **COPIEZ EXACTEMENT** l'URI affichée (elle devrait être quelque chose comme : `https://crm-credissimmo.onrender.com/api/googlesheets/callback`)

### Sur Render (Logs) :

1. Allez sur [Render Dashboard](https://dashboard.render.com/)
2. Sélectionnez votre service backend
3. Cliquez sur **"Logs"**
4. Cherchez les lignes avec `🔍 Diagnostic Google OAuth` ou `🔗 URL d'authentification générée`
5. **COPIEZ EXACTEMENT** l'URI dans `redirectUri` ou `REDIRECT_URI_UTILISEE`

## 📋 Étape 2 : Vérifier dans Google Cloud Console

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. **APIs et services** > **Identifiants**
3. Trouvez votre ID client OAuth (celui avec le Client ID : `940073400054-hinmu63i12lk1448ro26ajmr7nj2uhqa`)
4. Cliquez dessus pour l'éditer
5. Dans **"URI de redirection autorisés"**, regardez toutes les URIs listées

## 📋 Étape 3 : Comparer Caractère par Caractère

Les deux URIs doivent être **IDENTIQUES**. Vérifiez :

### ✅ Points de Vérification :

1. **Protocole** : `https://` (pas `http://`)
2. **Domaine** : `crm-credissimmo.onrender.com` (exactement, pas de variante)
3. **Chemin** : `/api/googlesheets/callback` (exactement)
4. **Pas de trailing slash** : Pas de `/` à la fin
5. **Pas de port** : Pas de `:443` ou `:80`
6. **Pas d'espaces** : Avant ou après
7. **Pas de caractères invisibles**

### ❌ Exemples d'Erreurs Courantes :

```
❌ http://crm-credissimmo.onrender.com/api/googlesheets/callback
   (http au lieu de https)

❌ https://crm-credissimmo.onrender.com/api/googlesheets/callback/
   (trailing slash)

❌ https://crm-credissimmo.onrender.com:443/api/googlesheets/callback
   (port explicite)

❌ https://crm-credissimmo.onrender.com /api/googlesheets/callback
   (espace avant /api)

❌ https://CRM-CREDISSIMMO.onrender.com/api/googlesheets/callback
   (majuscules - normalement OK mais éviter)
```

## 🔧 Solution : Corriger l'URI dans Google Cloud Console

### Option A : Modifier l'URI Existante

1. Dans Google Cloud Console > Identifiants > Votre ID client OAuth
2. Dans "URI de redirection autorisés", **SUPPRIMEZ** l'ancienne URI
3. Cliquez sur **"Ajouter un URI"**
4. **COLLEZ EXACTEMENT** l'URI que vous avez copiée depuis votre CRM ou les logs Render
5. Cliquez sur **"Enregistrer"**

### Option B : Ajouter l'URI (si elle n'existe pas)

1. Cliquez sur **"Ajouter un URI"**
2. **TAYPEZ EXACTEMENT** : `https://crm-credissimmo.onrender.com/api/googlesheets/callback`
3. Vérifiez qu'il n'y a pas d'espaces
4. Cliquez sur **"Enregistrer"**

## 🔧 Solution : Forcer l'URI via Variables d'Environnement

Pour éviter que l'URI change, forcez-la via les variables d'environnement :

1. Sur Render > Votre service backend > **Environment**
2. Ajoutez ou modifiez :
   ```
   GOOGLE_REDIRECT_URI=https://crm-credissimmo.onrender.com/api/googlesheets/callback
   ```
3. **IMPORTANT** : 
   - Pas d'espaces avant ou après
   - Pas de `/` à la fin
   - Exactement `https://` (pas `http://`)
4. Attendez le redéploiement (2-3 minutes)

## 🔍 Vérification : Plusieurs ID Clients OAuth

Si vous avez créé plusieurs ID clients OAuth :

1. Dans Google Cloud Console > Identifiants
2. Vérifiez **TOUS** vos ID clients OAuth
3. Assurez-vous que l'URI est dans **LE BON** ID client (celui avec le Client ID : `940073400054-hinmu63i12lk1448ro26ajmr7nj2uhqa`)
4. Si vous avez plusieurs ID clients, vous pouvez supprimer les anciens pour éviter la confusion

## 🐛 Problème : L'URI Change à Chaque Requête

Si l'URI change, c'est que `GOOGLE_REDIRECT_URI` n'est pas défini sur Render.

**Solution :** Ajoutez `GOOGLE_REDIRECT_URI` sur Render avec la valeur exacte.

## 📝 Checklist de Vérification

Avant de réessayer, vérifiez :

- [ ] J'ai copié l'URI exacte depuis les logs Render ou la console du navigateur
- [ ] L'URI dans Google Cloud Console correspond EXACTEMENT (caractère par caractère)
- [ ] L'URI commence par `https://` (pas `http://`)
- [ ] L'URI ne se termine PAS par `/`
- [ ] L'URI n'a pas de port (`:443` ou `:80`)
- [ ] Il n'y a pas d'espaces dans l'URI
- [ ] J'utilise le BON ID client OAuth (celui avec le bon Client ID)
- [ ] J'ai ajouté `GOOGLE_REDIRECT_URI` sur Render pour forcer l'URI
- [ ] J'ai attendu 1-2 minutes après avoir modifié l'URI dans Google Cloud Console
- [ ] J'ai attendu le redéploiement sur Render (2-3 minutes)

## 🆘 Si Rien Ne Fonctionne

1. **Recréez complètement l'ID client OAuth** :
   - Supprimez l'ancien dans Google Cloud Console
   - Créez-en un nouveau (Type : "Application Web")
   - Ajoutez l'URI : `https://crm-credissimmo.onrender.com/api/googlesheets/callback`
   - Mettez à jour `GOOGLE_CLIENT_ID` et `GOOGLE_CLIENT_SECRET` sur Render

2. **Vérifiez les logs Render** pour voir l'URI exacte utilisée à chaque requête

3. **Contactez le support** si le problème persiste après avoir tout vérifié


