# 🔍 Guide de Vérification - URI de Redirection OAuth

Si vous rencontrez l'erreur : **"Vous ne pouvez pas vous connecter à cette appli, car elle ne respecte pas le règlement OAuth 2.0 de Google"**, suivez ce guide étape par étape.

## ✅ Checklist de Vérification

### Étape 1 : Vérifier l'URI utilisée par votre application

1. Allez sur votre CRM déployé : `https://crm-credissimmo.onrender.com`
2. Connectez-vous et allez dans **"Intégrations" > "Google Sheets"**
3. **AVANT** de cliquer sur "Se connecter à Google", regardez l'interface
4. Vous devriez voir une boîte bleue avec **"URI de redirection utilisée"**
5. **Copiez exactement cette URI** (elle devrait être : `https://crm-credissimmo.onrender.com/api/googlesheets/callback`)

### Étape 2 : Vérifier dans Google Cloud Console

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Sélectionnez votre projet
3. **APIs et services** > **Identifiants**
4. Cliquez sur votre **ID client OAuth 2.0** (ou l'icône crayon pour modifier)
5. Dans la section **"URI de redirection autorisés"**, vérifiez que vous avez EXACTEMENT :
   ```
   https://crm-credissimmo.onrender.com/api/googlesheets/callback
   ```

### Étape 3 : Comparer les deux URIs

Les deux URIs doivent être **IDENTIQUES**, caractère par caractère :

✅ **Correct :**
- Dans l'app : `https://crm-credissimmo.onrender.com/api/googlesheets/callback`
- Dans Google Cloud : `https://crm-credissimmo.onrender.com/api/googlesheets/callback`

❌ **Incorrect (exemples d'erreurs courantes) :**
- Différence de protocole : `http://` vs `https://`
- Trailing slash : `...callback` vs `...callback/`
- Espaces avant/après
- Différence de casse (même si les URLs sont normalement insensibles à la casse)
- Port supplémentaire : `...onrender.com:443/...`

### Étape 4 : Vérifier les variables d'environnement sur Render

1. Allez sur [Render Dashboard](https://dashboard.render.com/)
2. Sélectionnez votre service backend (`crm-credissimmo`)
3. Cliquez sur **"Environment"**
4. Vérifiez que vous avez :
   - `GOOGLE_CLIENT_ID` = votre Client ID
   - `GOOGLE_CLIENT_SECRET` = votre Client Secret
   - `GOOGLE_REDIRECT_URI` = `https://crm-credissimmo.onrender.com/api/googlesheets/callback` (optionnel mais recommandé)

### Étape 5 : Si l'URI ne correspond pas

#### Option A : Modifier dans Google Cloud Console (RECOMMANDÉ)

1. Dans Google Cloud Console > Identifiants > Votre ID client OAuth
2. Dans "URI de redirection autorisés", **modifiez ou ajoutez** l'URI exacte affichée dans votre CRM
3. Cliquez sur **"Enregistrer"**
4. Attendez 1-2 minutes
5. Réessayez la connexion

#### Option B : Modifier la variable d'environnement sur Render

1. Sur Render > Environment
2. Ajoutez ou modifiez `GOOGLE_REDIRECT_URI` avec l'URI exacte
3. Attendez le redéploiement (2-3 minutes)
4. Vérifiez que l'URI affichée dans le CRM correspond maintenant

### Étape 6 : Vérifier les logs

Si le problème persiste, vérifiez les logs sur Render :

1. Sur Render, allez dans votre service backend
2. Cliquez sur **"Logs"**
3. Recherchez les lignes avec `🔍 Diagnostic Google OAuth` ou `🔗 URI de redirection utilisée`
4. Vérifiez que l'URI dans les logs correspond à celle dans Google Cloud Console

## 🐛 Problèmes Courants

### Problème 1 : L'URI change à chaque requête

**Cause :** La variable `GOOGLE_REDIRECT_URI` n'est pas définie sur Render, donc le code construit l'URI automatiquement.

**Solution :** Ajoutez `GOOGLE_REDIRECT_URI` sur Render avec la valeur exacte : `https://crm-credissimmo.onrender.com/api/googlesheets/callback`

### Problème 2 : L'URI contient `http://` au lieu de `https://`

**Cause :** Render utilise HTTPS mais le code détecte HTTP.

**Solution :** Forcez l'URI en ajoutant `GOOGLE_REDIRECT_URI` sur Render avec `https://`

### Problème 3 : L'URI a un port (ex: `:443`)

**Cause :** Le host inclut le port.

**Solution :** Assurez-vous que l'URI dans Google Cloud Console n'a pas de port : `https://crm-credissimmo.onrender.com/api/googlesheets/callback`

## 📝 Exemple de Configuration Complète

### Sur Render (Environment Variables) :
```
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnopqrstuvwxyz
GOOGLE_REDIRECT_URI=https://crm-credissimmo.onrender.com/api/googlesheets/callback
FRONTEND_URL=https://crm-credissimmo.onrender.com
```

### Dans Google Cloud Console (URI de redirection autorisés) :
```
https://crm-credissimmo.onrender.com/api/googlesheets/callback
```

## ✅ Test Final

1. Rechargez la page Google Sheets dans votre CRM
2. Vérifiez que l'URI affichée correspond à celle dans Google Cloud Console
3. Cliquez sur "Se connecter à Google"
4. Si tout est correct, vous devriez être redirigé vers Google pour autoriser l'application

## 🆘 Si ça ne fonctionne toujours pas

1. Vérifiez les logs Render pour voir l'URI exacte utilisée
2. Vérifiez la console du navigateur (F12) pour voir les messages de diagnostic
3. Assurez-vous que vous avez attendu 1-2 minutes après avoir modifié l'URI dans Google Cloud Console
4. Essayez de supprimer et recréer l'URI dans Google Cloud Console

