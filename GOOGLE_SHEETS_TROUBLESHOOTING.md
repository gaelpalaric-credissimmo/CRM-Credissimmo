# Dépannage Google Sheets - Erreur 400 invalid_request

## 🔴 Erreur : "400 : invalid_request - flowName=GeneralOAuthFlow"

Cette erreur indique généralement un problème de configuration OAuth dans Google Cloud Console.

## ✅ Solutions

### 1. Vérifier l'URI de redirection

L'URI de redirection dans votre code **DOIT** correspondre **EXACTEMENT** à celle configurée dans Google Cloud Console.

**Étapes :**

1. **Dans Google Cloud Console** :
   - Allez dans "APIs et services" > "Identifiants"
   - Cliquez sur votre ID client OAuth
   - Vérifiez les "URI de redirection autorisés"

2. **Vérifiez votre fichier `.env`** :
   ```env
   GOOGLE_REDIRECT_URI=http://localhost:5000/api/googlesheets/callback
   ```

3. **Pour la production** :
   ```env
   GOOGLE_REDIRECT_URI=https://votre-domaine.com/api/googlesheets/callback
   ```

**Important :**
- L'URI doit être **identique** dans les deux endroits
- Pas d'espace en fin d'URL
- Pas de `/` en fin d'URL (sauf si configuré ainsi)
- `http://` vs `https://` doit correspondre

### 2. Vérifier les identifiants

Assurez-vous que vos identifiants sont corrects dans le fichier `.env` :

```env
GOOGLE_CLIENT_ID=votre_client_id_ici
GOOGLE_CLIENT_SECRET=votre_client_secret_ici
```

**Vérifications :**
- Pas d'espaces avant/après les valeurs
- Pas de guillemets autour des valeurs
- Les valeurs sont complètes (pas tronquées)

### 3. Vérifier le type d'application

Dans Google Cloud Console :
- Le type d'application doit être **"Application Web"**
- Pas "Application de bureau" ou autre

### 4. Vérifier que les APIs sont activées

Assurez-vous que ces APIs sont activées :
- ✅ Google Sheets API
- ✅ Google Drive API

### 5. Réinitialiser les identifiants OAuth

Si le problème persiste :

1. Dans Google Cloud Console, supprimez l'ancien ID client OAuth
2. Créez un nouveau ID client OAuth
3. Configurez l'URI de redirection :
   - **Développement** : `http://localhost:5000/api/googlesheets/callback`
   - **Production** : `https://votre-domaine.com/api/googlesheets/callback`
4. Mettez à jour votre fichier `.env` avec les nouveaux identifiants

### 6. Vérifier l'environnement

**En développement local :**
```env
GOOGLE_REDIRECT_URI=http://localhost:5000/api/googlesheets/callback
FRONTEND_URL=http://localhost:3000
```

**En production (Render, etc.) :**
```env
GOOGLE_REDIRECT_URI=https://votre-app.onrender.com/api/googlesheets/callback
FRONTEND_URL=https://votre-app.onrender.com
```

### 7. Vérifier les logs serveur

Regardez les logs de votre serveur pour voir l'URI de redirection utilisée :
```
URI de redirection configurée: http://localhost:5000/api/googlesheets/callback
```

Cette URI doit correspondre exactement à celle dans Google Cloud Console.

## 🔍 Checklist de vérification

- [ ] Les variables `GOOGLE_CLIENT_ID` et `GOOGLE_CLIENT_SECRET` sont définies dans `.env`
- [ ] L'URI de redirection dans `.env` correspond exactement à celle dans Google Cloud Console
- [ ] Le type d'application est "Application Web"
- [ ] Les APIs Google Sheets et Google Drive sont activées
- [ ] Pas d'espaces ou de caractères supplémentaires dans les URLs
- [ ] En production, les URLs utilisent `https://` et le bon domaine

## 📝 Exemple de configuration correcte

**Fichier `.env` :**
```env
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnopqrstuvwxyz
GOOGLE_REDIRECT_URI=http://localhost:5000/api/googlesheets/callback
FRONTEND_URL=http://localhost:3000
```

**Dans Google Cloud Console :**
- Type : Application Web
- URI de redirection autorisés : `http://localhost:5000/api/googlesheets/callback`

## 🆘 Si le problème persiste

1. Vérifiez les logs du serveur pour voir les erreurs exactes
2. Vérifiez la console du navigateur (F12) pour les erreurs JavaScript
3. Assurez-vous que le serveur redémarre après modification du `.env`
4. En production, vérifiez que les variables d'environnement sont bien configurées sur Render/Heroku/etc.

## 🔗 Ressources

- [Documentation OAuth 2.0 Google](https://developers.google.com/identity/protocols/oauth2)
- [Guide de configuration OAuth](https://developers.google.com/identity/protocols/oauth2/web-server)

