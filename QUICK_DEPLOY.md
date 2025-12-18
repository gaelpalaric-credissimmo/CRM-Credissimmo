# 🚀 Déploiement rapide du CRM

Guide étape par étape pour mettre votre CRM en ligne en 10 minutes.

## Option 1 : Render (Le plus simple - GRATUIT)

### Étape 1 : Préparer votre code sur GitHub

1. Créez un compte sur [GitHub](https://github.com) si vous n'en avez pas
2. Créez un nouveau repository (par exemple : `crm-project`)
3. Dans le dossier de votre projet, exécutez :

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/VOTRE_USERNAME/crm-project.git
git push -u origin main
```

### Étape 2 : Déployer sur Render

1. Allez sur [https://render.com](https://render.com)
2. Cliquez sur "Get Started for Free"
3. Connectez-vous avec votre compte GitHub
4. Cliquez sur "New" > "Web Service"
5. Sélectionnez votre repository `crm-project`
6. Configurez :
   - **Name** : `crm-project` (ou le nom que vous voulez)
   - **Environment** : `Node`
   - **Build Command** : `npm install && cd client && npm install && npm run build && cd ..`
   - **Start Command** : `npm start`
   - **Plan** : Free (gratuit)

7. Dans "Environment Variables", ajoutez :
   ```
   NODE_ENV = production
   PORT = 10000
   ```

8. Cliquez sur "Create Web Service"

9. Attendez 5-10 minutes que Render construise et déploie votre application

10. ✅ Votre CRM sera accessible sur : `https://crm-project.onrender.com` (ou le nom que vous avez choisi)

---

## Option 2 : Railway (Alternative gratuite)

1. Allez sur [https://railway.app](https://railway.app)
2. Cliquez sur "Start a New Project"
3. Connectez votre compte GitHub
4. Sélectionnez "Deploy from GitHub repo"
5. Choisissez votre repository `crm-project`
6. Railway détectera automatiquement Node.js
7. Ajoutez les variables d'environnement :
   - `NODE_ENV=production`
   - `PORT` sera automatiquement défini
8. Railway déploiera automatiquement votre application
9. ✅ Votre CRM sera accessible sur une URL Railway

---

## Option 3 : Vercel (Pour le frontend uniquement)

Si vous voulez séparer le frontend et le backend :

### Frontend sur Vercel

1. Allez sur [https://vercel.com](https://vercel.com)
2. Connectez votre compte GitHub
3. Importez votre projet
4. Configurez :
   - **Framework Preset** : Create React App
   - **Root Directory** : `client`
   - **Build Command** : `npm run build`
   - **Output Directory** : `build`
5. Ajoutez la variable d'environnement :
   - `REACT_APP_API_URL` = URL de votre backend (Render ou Railway)

### Backend sur Render ou Railway

Suivez l'Option 1 ou 2 pour déployer le backend séparément.

---

## ⚠️ Important : Base de données

Actuellement, le CRM utilise un stockage en mémoire. **Les données seront perdues à chaque redémarrage**.

Pour la production, vous devriez utiliser une vraie base de données :

### Option gratuite : MongoDB Atlas

1. Créez un compte sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Créez un cluster gratuit
3. Obtenez votre chaîne de connexion
4. Ajoutez-la comme variable d'environnement sur Render/Railway

---

## 🔧 Configuration Outlook (Optionnel)

Si vous voulez utiliser l'intégration Outlook en ligne :

1. Dans Azure AD, mettez à jour l'URI de redirection :
   - Ancien : `http://localhost:5000/api/outlook/callback`
   - Nouveau : `https://votre-url.onrender.com/api/outlook/callback`

2. Mettez à jour les variables d'environnement sur Render/Railway :
   - `REDIRECT_URI=https://votre-url.onrender.com/api/outlook/callback`

---

## ✅ Vérification

Une fois déployé :

1. Visitez l'URL fournie par Render/Railway
2. Vous devriez voir l'interface du CRM
3. Testez la création d'un client
4. Vérifiez que tout fonctionne

---

## 🆘 Problèmes courants

### L'application ne démarre pas
- Vérifiez les logs sur Render/Railway
- Assurez-vous que `NODE_ENV=production` est défini
- Vérifiez que le port est correct (10000 pour Render)

### Erreur 404 sur les routes
- Assurez-vous que `server.js` sert les fichiers statiques en production
- Vérifiez que le build du client a réussi

### Les données disparaissent
- C'est normal avec le stockage en mémoire
- Configurez une base de données pour persister les données

---

## 📚 Ressources

- [Documentation Render](https://render.com/docs)
- [Documentation Railway](https://docs.railway.app)
- [Documentation Vercel](https://vercel.com/docs)

---

**Besoin d'aide ?** Consultez le fichier [DEPLOYMENT.md](./DEPLOYMENT.md) pour plus de détails.
