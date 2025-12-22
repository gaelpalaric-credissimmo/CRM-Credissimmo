# Configuration des variables d'environnement sur Render

## 🔧 Variables Google Sheets à configurer

Pour que la synchronisation Google Sheets fonctionne, vous devez ajouter ces variables dans votre service Render :

### Dans Render Dashboard :

1. Allez sur votre service web sur Render
2. Cliquez sur **"Environment"** dans le menu de gauche
3. Ajoutez ces variables d'environnement :

```
GOOGLE_CLIENT_ID=votre_client_id_google
GOOGLE_CLIENT_SECRET=votre_client_secret_google
GOOGLE_REDIRECT_URI=https://votre-app.onrender.com/api/googlesheets/callback
FRONTEND_URL=https://votre-app.onrender.com
```

**Important :** Remplacez `votre-app.onrender.com` par l'URL réelle de votre application Render.

### Comment obtenir les identifiants Google :

1. **Google Cloud Console** : https://console.cloud.google.com/
2. Créez un projet ou sélectionnez-en un
3. Activez les APIs :
   - Google Sheets API
   - Google Drive API
4. Créez des identifiants OAuth 2.0 :
   - Type : Application Web
   - URI de redirection : `https://votre-app.onrender.com/api/googlesheets/callback`
5. Copiez le **Client ID** et le **Client Secret**

### Variables déjà configurées :

Ces variables sont probablement déjà configurées :
- `NODE_ENV=production`
- `PORT=10000` (ou le port configuré dans render.yaml)

### Après avoir ajouté les variables :

1. Render redéploiera automatiquement votre application
2. Attendez la fin du déploiement
3. Testez la connexion Google Sheets dans votre CRM

## ⚠️ Important

- L'URI de redirection dans Google Cloud Console **DOIT** correspondre exactement à celle dans `GOOGLE_REDIRECT_URI`
- Utilisez `https://` (pas `http://`) pour la production
- Pas d'espace avant/après les valeurs dans Render


