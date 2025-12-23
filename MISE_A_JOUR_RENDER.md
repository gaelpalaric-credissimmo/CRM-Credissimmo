# 🔄 Mise à jour du service Render existant

Guide pour remplacer votre ancien projet "crm credissimmo" par le nouveau.

## 📋 Étapes pour écraser l'ancien projet

### Option A : Mettre à jour le repository connecté (si même repo)

1. **Sur Render Dashboard** :
   - Allez sur votre service "crm credissimmo" existant
   - Cliquez sur "Settings"

2. **Connecter le nouveau code** :
   - Si vous utilisez le même repository GitHub :
     - Poussez simplement votre nouveau code :
       ```bash
       git add .
       git commit -m "Mise à jour vers nouvelle version avec MongoDB"
       git push
       ```
     - Render redéploiera automatiquement
   
   - Si vous utilisez un nouveau repository :
     - Dans "Settings" > "Repository"
     - Cliquez sur "Disconnect"
     - Puis "Connect" et sélectionnez votre nouveau repository

### Option B : Recréer le service (recommandé pour éviter les conflits)

1. **Sur Render Dashboard** :
   - Allez sur votre ancien service "crm credissimmo"
   - Notez les variables d'environnement importantes (MONGODB_URI, etc.)
   - Optionnel : Supprimez l'ancien service (ou gardez-le en backup)

2. **Créer un nouveau service** :
   - "New +" > "Web Service"
   - Connectez votre repository avec le nouveau code
   - Nom : `crm-credissimmo` (ou le même nom si vous avez supprimé l'ancien)

3. **Configuration** :
   ```
   Name: crm-credissimmo
   Region: (même région que l'ancien)
   Branch: main
   Build Command: npm install && cd client && npm install && npm run build && cd ..
   Start Command: npm start
   ```

4. **Variables d'environnement** :
   Utilisez les mêmes que l'ancien service, ou configurez avec :
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=mongodb+srv://gaelpalaric_db_user:*Leag8811*@crmcredissimmo.0e6l7w1.mongodb.net/crm?retryWrites=true&w=majority&appName=CrmCredissimmo
   JWT_SECRET=2224e704dae7de005da352bdb62acabf0283cfe104f37a12b9c083e00b43e63c
   SESSION_SECRET=924b118e6be048b9fded05fe949a3692c25be4b82cdbc63fb4d8e6ac111063bb
   FRONTEND_URL=https://crm-credissimmo.onrender.com
   ```

---

## ✅ Méthode recommandée : Mise à jour directe

Si vous voulez garder la même URL et juste mettre à jour le code :

### 1. Préparer votre code sur GitHub

```bash
# Vérifiez que vous êtes dans le bon dossier
cd c:\Users\gaelp\crm-project

# Vérifiez le statut Git
git status

# Si pas encore initialisé ou pas connecté à GitHub
git init
git add .
git commit -m "Nouvelle version CRM avec MongoDB et authentification"
```

### 2. Connecter au repository Render

**Option 1 : Même repository**
- Si Render est déjà connecté à un repo GitHub
- Poussez simplement votre nouveau code :
  ```bash
  git remote add origin https://github.com/VOTRE-USERNAME/crm-credissimmo.git
  # ou si déjà connecté :
  git push origin main
  ```

**Option 2 : Nouveau repository**
- Créez un nouveau repo sur GitHub
- Connectez-le dans Render Settings > Repository

### 3. Mettre à jour les variables d'environnement

Dans Render Dashboard > Votre service > Environment :

1. **Vérifiez/Mettez à jour** :
   - `MONGODB_URI` (doit pointer vers votre base MongoDB)
   - `JWT_SECRET` et `SESSION_SECRET` (utilisez les nouveaux secrets générés)
   - `FRONTEND_URL` (doit correspondre à votre URL Render)

2. **Ajoutez si manquant** :
   - `NODE_ENV=production`
   - `PORT=10000`

### 4. Déclencher le redéploiement

**Automatique** :
- Si "Auto-Deploy" est activé, Render redéploiera automatiquement après `git push`

**Manuel** :
- Dans Render Dashboard > Votre service
- Cliquez sur "Manual Deploy" > "Deploy latest commit"

### 5. Vérifier

Une fois déployé :
- Visitez votre URL Render
- Connectez-vous avec `admin@crm.com` / `admin123`
- Testez la création d'un client
- Vérifiez que les données sont sauvegardées dans MongoDB

---

## ⚠️ Points importants

1. **Même base MongoDB** : Vos données existantes seront conservées
2. **Même URL** : Si vous gardez le même service, l'URL reste identique
3. **Downtime** : Il y aura un court arrêt pendant le redéploiement (2-5 minutes)
4. **Backup** : Si vous avez des données importantes, faites un backup avant

---

## 🆘 En cas de problème

Si le déploiement échoue :
1. Vérifiez les logs dans Render (section "Logs")
2. Vérifiez que toutes les variables d'environnement sont correctes
3. Vérifiez que MongoDB Atlas autorise les connexions depuis Render

---

## ✅ C'est tout !

Une fois mis à jour, votre nouveau CRM sera en ligne avec toutes les nouvelles fonctionnalités !

