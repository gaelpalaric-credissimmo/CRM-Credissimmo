# 🚀 Guide de Déploiement sur Render

Guide étape par étape pour déployer votre CRM sur Render avec votre compte existant.

## 📋 Prérequis

- ✅ Compte Render existant
- ✅ Projet sur GitHub (ou GitLab/Bitbucket)
- ✅ MongoDB Atlas configuré (déjà fait ✅)

## 🔧 Étape 1 : Préparer votre repository GitHub

### Si vous n'avez pas encore de repository :

1. **Créer un repository sur GitHub** :
   - Allez sur [github.com](https://github.com)
   - Cliquez sur "New repository"
   - Nom : `crm-credissimmo` (ou autre)
   - Visibilité : Private (recommandé) ou Public
   - Ne cochez PAS "Initialize with README" (vous avez déjà des fichiers)

2. **Pousser votre code** :
   ```bash
   git init
   git add .
   git commit -m "Initial commit - CRM avec MongoDB"
   git branch -M main
   git remote add origin https://github.com/VOTRE-USERNAME/crm-credissimmo.git
   git push -u origin main
   ```

### Si vous avez déjà un repository :

```bash
git add .
git commit -m "Préparation pour déploiement Render"
git push
```

---

## 🌐 Étape 2 : Créer le service sur Render

1. **Connectez-vous** sur [dashboard.render.com](https://dashboard.render.com)

2. **Cliquez sur "New +"** > **"Web Service"**

3. **Connectez votre repository** :
   - Si c'est la première fois, autorisez Render à accéder à GitHub
   - Sélectionnez votre repository `crm-credissimmo`

4. **Configuration du service** :
   ```
   Name: crm-credissimmo (ou le nom que vous voulez)
   Region: Frankfurt (Europe) ou celui le plus proche
   Branch: main
   Root Directory: (laissez vide)
   Runtime: Node
   Build Command: npm install && cd client && npm install && npm run build && cd ..
   Start Command: npm start
   ```

---

## ⚙️ Étape 3 : Configurer les variables d'environnement

Dans la section **"Environment"** de votre service Render, ajoutez ces variables :

### Variables obligatoires :

```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://gaelpalaric_db_user:*Leag8811*@crmcredissimmo.0e6l7w1.mongodb.net/crm?retryWrites=true&w=majority&appName=CrmCredissimmo
JWT_SECRET=votre-secret-jwt-tres-long-et-aleatoire-changez-moi
SESSION_SECRET=votre-secret-session-tres-long-et-aleatoire-changez-moi
FRONTEND_URL=https://crm-credissimmo.onrender.com
```

⚠️ **IMPORTANT** :
- Remplacez `crm-credissimmo.onrender.com` par l'URL réelle que Render vous donnera
- Pour `JWT_SECRET` et `SESSION_SECRET`, générez des chaînes aléatoires longues
- Vous pouvez utiliser ceci pour générer des secrets :
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```

### Variables optionnelles (pour plus tard) :

```
GOOGLE_CLIENT_ID=(si vous utilisez Google Sheets)
GOOGLE_CLIENT_SECRET=(si vous utilisez Google Sheets)
GOOGLE_REDIRECT_URI=https://crm-credissimmo.onrender.com/api/googlesheets/callback
```

---

## 🚀 Étape 4 : Déployer

1. **Cliquez sur "Create Web Service"**

2. **Render va** :
   - Cloner votre repository
   - Installer les dépendances
   - Builder le client React
   - Démarrer le serveur

3. **Attendez 5-10 minutes** (premier déploiement)

4. **Une fois terminé**, vous verrez :
   - ✅ Status: Live
   - 🌐 URL : `https://crm-credissimmo.onrender.com` (ou similaire)

---

## ✅ Étape 5 : Vérifier et tester

1. **Visitez votre URL** : `https://crm-credissimmo.onrender.com`

2. **Connectez-vous** avec :
   - Email : `admin@crm.com`
   - Mot de passe : `admin123`

3. **Testez** :
   - Créer un client
   - Vérifier que les données sont sauvegardées
   - Tester sur mobile

---

## 🔒 Étape 6 : Sécuriser (IMPORTANT)

### 1. Changer le mot de passe admin

Une fois connecté, créez un nouveau compte admin et supprimez l'ancien, ou changez le mot de passe via l'API.

### 2. Générer de vrais secrets

Dans Render, remplacez `JWT_SECRET` et `SESSION_SECRET` par de vraies chaînes aléatoires.

### 3. Autoriser votre IP dans MongoDB Atlas

1. Allez sur MongoDB Atlas
2. Network Access
3. Ajoutez l'IP de Render (ou autorisez 0.0.0.0/0 temporairement pour tester)

---

## 📱 Partager avec votre équipe

Une fois déployé, partagez simplement l'URL avec votre équipe :
```
https://crm-credissimmo.onrender.com
```

Tout le monde pourra y accéder depuis n'importe où !

---

## 🔄 Mises à jour futures

Quand vous modifiez le code :

1. **Poussez sur GitHub** :
   ```bash
   git add .
   git commit -m "Description des changements"
   git push
   ```

2. **Render redéploie automatiquement** (si "Auto-Deploy" est activé)

3. **Ou déclenchez manuellement** : Dashboard Render > "Manual Deploy"

---

## 🆘 Problèmes courants

### L'application ne démarre pas
- Vérifiez les logs dans Render (section "Logs")
- Vérifiez que toutes les variables d'environnement sont correctes
- Vérifiez que MongoDB Atlas autorise les connexions

### Erreur 503 ou timeout
- Le premier démarrage peut prendre 5-10 minutes
- Vérifiez que le build s'est bien terminé

### Erreur de connexion MongoDB
- Vérifiez que votre IP est autorisée dans MongoDB Atlas
- Vérifiez que `MONGODB_URI` est correct dans Render

### Page blanche
- Vérifiez les logs du serveur
- Vérifiez que `FRONTEND_URL` correspond à votre URL Render

---

## 💡 Astuce : Nom personnalisé

Si vous voulez une URL plus simple, vous pouvez :
1. Aller dans "Settings" de votre service Render
2. Cliquer sur "Custom Domain"
3. Ajouter votre propre domaine (ex: `crm.credissimmo.com`)

---

## ✅ C'est prêt !

Une fois déployé, votre CRM sera accessible 24/7 avec une URL simple à partager avec votre équipe.

