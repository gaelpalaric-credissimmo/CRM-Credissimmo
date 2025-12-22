# 🔄 Connexion Automatique Google Sheets

## ⚠️ Problème sur Render

Sur Render, le système de fichiers est **éphémère**, ce qui signifie que les fichiers sont perdus à chaque redéploiement. C'est pourquoi la connexion automatique ne fonctionne pas avec un simple fichier.

## ✅ Solution : Utiliser les Variables d'Environnement

Pour que la connexion soit vraiment automatique et persistante, vous devez ajouter le **refresh token** dans les variables d'environnement sur Render.

## 📋 Étapes pour Activer la Connexion Automatique

### Étape 1 : Se Connecter une Première Fois

1. Allez sur votre CRM : `https://crm-credissimmo.onrender.com/googlesheets`
2. Cliquez sur **"Se connecter à Google"**
3. Autorisez l'application
4. Après la connexion réussie, vous verrez un message avec des instructions

### Étape 2 : Récupérer le Refresh Token

Après la connexion, le refresh token est affiché dans les **logs du serveur Render** :

1. Allez sur [Render Dashboard](https://dashboard.render.com/)
2. Sélectionnez votre service backend
3. Cliquez sur **"Logs"**
4. Cherchez une ligne qui commence par : `🔑 IMPORTANT: Ajoutez ce refresh token...`
5. Vous verrez quelque chose comme :
   ```
   GOOGLE_REFRESH_TOKEN=1//0gxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
6. **COPIEZ** cette valeur complète (tout ce qui suit `GOOGLE_REFRESH_TOKEN=`)

### Étape 3 : Ajouter le Refresh Token sur Render

1. Sur Render Dashboard, allez dans votre service backend
2. Cliquez sur **"Environment"**
3. Cliquez sur **"Add Environment Variable"**
4. Ajoutez :
   - **Key** : `GOOGLE_REFRESH_TOKEN`
   - **Value** : Collez le refresh token que vous avez copié
5. Cliquez sur **"Save Changes"**
6. Render va redéployer automatiquement (2-3 minutes)

### Étape 4 : Ajouter le Spreadsheet ID (Optionnel mais Recommandé)

Pour que le Spreadsheet ID soit aussi persistant :

1. Dans **"Environment"**, ajoutez aussi :
   - **Key** : `GOOGLE_SPREADSHEET_ID`
   - **Value** : Votre Spreadsheet ID (celui que vous avez configuré dans l'interface)
2. Cliquez sur **"Save Changes"**

## ✅ Résultat

Après le redéploiement :

1. Le serveur va **automatiquement** charger le refresh token depuis les variables d'environnement
2. Il va **automatiquement** obtenir un nouvel access token
3. La connexion sera **automatique** à chaque démarrage
4. Plus besoin de cliquer sur "Se connecter à Google" !

## 🔍 Vérification

Pour vérifier que ça fonctionne :

1. Attendez la fin du redéploiement (2-3 minutes)
2. Rechargez la page Google Sheets dans votre CRM
3. Vous devriez voir **"Connecté à Google Sheets"** automatiquement
4. Plus besoin de cliquer sur "Se connecter à Google"

## 📝 Variables d'Environnement Requises

Sur Render, vous devriez avoir :

```
GOOGLE_CLIENT_ID=votre_client_id
GOOGLE_CLIENT_SECRET=votre_client_secret
GOOGLE_REDIRECT_URI=https://crm-credissimmo.onrender.com/api/googlesheets/callback
GOOGLE_REFRESH_TOKEN=votre_refresh_token  ← À ajouter après la première connexion
GOOGLE_SPREADSHEET_ID=votre_spreadsheet_id  ← Optionnel mais recommandé
FRONTEND_URL=https://crm-credissimmo.onrender.com
```

## 🐛 Si ça ne Fonctionne Pas

1. **Vérifiez les logs Render** pour voir si le refresh token est chargé
2. **Vérifiez** que `GOOGLE_REFRESH_TOKEN` est bien dans les variables d'environnement
3. **Vérifiez** que la valeur du refresh token est correcte (pas d'espaces avant/après)
4. **Attendez** le redéploiement complet (2-3 minutes)

## 💡 Note

- Le **refresh token** ne change pas (sauf si vous révoquez l'accès)
- Une fois ajouté aux variables d'environnement, la connexion sera automatique à chaque démarrage
- Le **access token** est rafraîchi automatiquement quand il expire


