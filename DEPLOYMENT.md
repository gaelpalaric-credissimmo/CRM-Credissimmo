# Guide de déploiement du CRM en ligne

Ce guide vous présente plusieurs options pour mettre votre CRM en ligne, de la plus simple à la plus avancée.

## 🚀 Option 1 : Render (Recommandé - Gratuit pour commencer)

Render est une plateforme simple qui peut héberger à la fois le backend et le frontend.

### Avantages
- ✅ Gratuit pour commencer
- ✅ Déploiement automatique depuis GitHub
- ✅ SSL/HTTPS inclus
- ✅ Facile à configurer

### Étapes

1. **Préparer le projet pour la production**

   Modifiez `server.js` pour servir les fichiers statiques du client en production :

   ```javascript
   // À ajouter dans server.js après les routes API
   if (process.env.NODE_ENV === 'production') {
     const path = require('path');
     app.use(express.static(path.join(__dirname, 'client/build')));
     app.get('*', (req, res) => {
       res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
     });
   }
   ```

2. **Créer un compte sur Render**
   - Allez sur https://render.com
   - Créez un compte gratuit

3. **Créer un nouveau Web Service**
   - Cliquez sur "New" > "Web Service"
   - Connectez votre repository GitHub
   - Configurez :
     - **Name** : crm-project
     - **Environment** : Node
     - **Build Command** : `npm install && cd client && npm install && npm run build && cd ..`
     - **Start Command** : `npm start`
     - **Environment Variables** :
       ```
       NODE_ENV=production
       PORT=10000
       ```

4. **Déployer**
   - Render déploiera automatiquement votre application
   - Votre CRM sera accessible sur une URL comme `https://crm-project.onrender.com`

---

## 🌐 Option 2 : Vercel (Frontend) + Render/Railway (Backend)

Séparer le frontend et le backend pour plus de flexibilité.

### Frontend sur Vercel

1. **Créer un compte sur Vercel**
   - Allez sur https://vercel.com
   - Connectez votre compte GitHub

2. **Créer un fichier `vercel.json`** à la racine :

   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "client/package.json",
         "use": "@vercel/static-build",
         "config": {
           "distDir": "build"
         }
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "client/build/$1"
       }
     ]
   }
   ```

3. **Modifier `client/package.json`** pour ajouter le script de build :

   ```json
   "scripts": {
     "build": "react-scripts build",
     "vercel-build": "react-scripts build"
   }
   ```

4. **Créer un fichier `.env.production`** dans `client/` :

   ```
   REACT_APP_API_URL=https://votre-backend-url.onrender.com/api
   ```

5. **Déployer sur Vercel**
   - Importez votre projet
   - Vercel détectera automatiquement React
   - Configurez la variable d'environnement `REACT_APP_API_URL`

### Backend sur Render ou Railway

Suivez les étapes de l'Option 1 pour le backend, ou utilisez Railway (https://railway.app) qui est également gratuit pour commencer.

---

## 🐳 Option 3 : Docker + Cloud Provider

Pour un déploiement plus professionnel.

### Créer un Dockerfile

Créez un fichier `Dockerfile` à la racine :

```dockerfile
# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY client/package*.json ./client/

# Install dependencies
RUN npm install
RUN cd client && npm install

# Copy source code
COPY . .

# Build client
RUN cd client && npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY --from=build /app/server.js ./
COPY --from=build /app/routes ./routes
COPY --from=build /app/client/build ./client/build

EXPOSE 5000

CMD ["node", "server.js"]
```

### Déployer sur :
- **Railway** : https://railway.app (gratuit pour commencer)
- **Fly.io** : https://fly.io (gratuit)
- **DigitalOcean App Platform** : https://www.digitalocean.com/products/app-platform

---

## 📦 Option 4 : Netlify (Frontend) + Serverless Functions

Pour une solution serverless.

### Frontend sur Netlify

1. Créez un compte sur https://netlify.com
2. Connectez votre repository
3. Configurez :
   - **Build command** : `cd client && npm install && npm run build`
   - **Publish directory** : `client/build`

### Backend avec Netlify Functions

Vous devrez adapter votre backend pour utiliser des fonctions serverless. Plus complexe mais très scalable.

---

## 🔧 Configuration nécessaire avant déploiement

### 1. Mettre à jour server.js pour la production

Ajoutez ceci à la fin de `server.js` (avant `app.listen`) :

```javascript
// Servir les fichiers statiques en production
if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  app.use(express.static(path.join(__dirname, 'client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}
```

### 2. Mettre à jour package.json

Ajoutez le script de démarrage en production :

```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js",
  "build": "cd client && npm run build"
}
```

### 3. Variables d'environnement

Créez un fichier `.env.production` avec vos variables pour la production.

### 4. Base de données

Pour la production, vous devrez utiliser une vraie base de données au lieu du stockage en mémoire. Options :
- **MongoDB Atlas** (gratuit) : https://www.mongodb.com/cloud/atlas
- **PostgreSQL sur Render** (gratuit)
- **Supabase** (gratuit) : https://supabase.com

---

## 🎯 Recommandation

Pour commencer rapidement, je recommande **Render** (Option 1) car :
- ✅ Simple à configurer
- ✅ Gratuit pour commencer
- ✅ Déploie frontend et backend ensemble
- ✅ SSL inclus
- ✅ Déploiement automatique depuis GitHub

---

## 📝 Checklist avant déploiement

- [ ] Tester l'application en local
- [ ] Créer un compte GitHub et pousser le code
- [ ] Configurer les variables d'environnement
- [ ] Mettre à jour les URLs dans le code (si nécessaire)
- [ ] Tester le déploiement
- [ ] Configurer un nom de domaine personnalisé (optionnel)

---

## 🔗 Ressources

- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Netlify Documentation](https://docs.netlify.com)
