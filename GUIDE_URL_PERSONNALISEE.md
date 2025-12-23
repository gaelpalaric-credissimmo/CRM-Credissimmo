# 🌐 Guide : Changer l'URL pour votre équipe

Plusieurs options pour rendre votre CRM accessible avec une URL simple.

## 🚀 Option 1 : Déployer en ligne (RECOMMANDÉ)

### Pourquoi c'est la meilleure option :
- ✅ Accessible depuis n'importe où (bureau, mobile, domicile)
- ✅ URL simple et professionnelle
- ✅ Pas de configuration réseau compliquée
- ✅ Gratuit avec Render ou Railway

### Déploiement rapide sur Render (GRATUIT)

1. **Créer un compte** sur [Render.com](https://render.com)

2. **Connecter votre repository GitHub**
   - Si vous n'avez pas de repo, créez-en un sur GitHub
   - Connectez-le à Render

3. **Créer un nouveau "Web Service"**
   - Cliquez sur "New" > "Web Service"
   - Sélectionnez votre repository

4. **Configuration** :
   ```
   Name: crm-credissimmo (ou le nom que vous voulez)
   Environment: Node
   Build Command: npm install && cd client && npm install && npm run build && cd ..
   Start Command: npm start
   ```

5. **Variables d'environnement** (dans "Environment") :
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=mongodb+srv://gaelpalaric_db_user:*Leag8811*@crmcredissimmo.0e6l7w1.mongodb.net/crm?retryWrites=true&w=majority&appName=CrmCredissimmo
   JWT_SECRET=votre-secret-jwt-long-et-aleatoire
   SESSION_SECRET=votre-secret-session-long-et-aleatoire
   FRONTEND_URL=https://votre-nom.onrender.com
   ```

6. **Déployer** !
   - Render créera une URL comme : `https://crm-credissimmo.onrender.com`
   - Partagez cette URL avec votre équipe

### Déploiement sur Railway (Alternative)

1. Allez sur [Railway.app](https://railway.app)
2. Connectez GitHub
3. "New Project" > "Deploy from GitHub repo"
4. Railway détecte automatiquement la configuration
5. Ajoutez les variables d'environnement (même que Render)
6. URL générée : `https://votre-projet.up.railway.app`

---

## 🔗 Option 2 : Utiliser ngrok (URL publique temporaire)

Pour tester rapidement sans déployer :

1. **Installer ngrok** : [ngrok.com/download](https://ngrok.com/download)

2. **Démarrer votre serveur local** :
   ```bash
   npm run dev
   ```

3. **Dans un autre terminal, lancer ngrok** :
   ```bash
   ngrok http 3000
   ```

4. **Vous obtiendrez une URL** comme :
   ```
   https://abc123.ngrok.io
   ```
   - Partagez cette URL avec votre équipe
   - ⚠️ L'URL change à chaque redémarrage de ngrok (gratuit)
   - Pour une URL fixe, utilisez un compte payant

---

## 🏠 Option 3 : Utiliser l'IP locale (Réseau local uniquement)

Si toute votre équipe est sur le même réseau (même bureau) :

1. **Trouver votre IP locale** :
   ```bash
   # Windows
   ipconfig
   # Cherchez "IPv4 Address" (ex: 192.168.1.100)
   ```

2. **Modifier le fichier `.env`** :
   ```env
   FRONTEND_URL=http://192.168.1.100:3000
   ```

3. **Démarrer le serveur** :
   ```bash
   npm run dev
   ```

4. **Votre équipe accède via** :
   ```
   http://192.168.1.100:3000
   ```

⚠️ **Limitations** :
- Fonctionne uniquement sur le même réseau WiFi/réseau
- L'IP peut changer si vous vous reconnectez au WiFi

---

## 📝 Option 4 : Nom de domaine personnalisé (Avancé)

Si vous avez un nom de domaine (ex: `crm.credissimmo.com`) :

1. **Déployez sur Render/Railway** (Option 1)

2. **Dans Render** :
   - Allez dans "Settings" > "Custom Domain"
   - Ajoutez votre domaine
   - Suivez les instructions DNS

3. **Votre équipe accède via** :
   ```
   https://crm.credissimmo.com
   ```

---

## ✅ Recommandation

**Pour une équipe de 10+ commerciaux**, je recommande fortement l'**Option 1 (Déploiement en ligne)** :

- ✅ Accessible partout (bureau, terrain, domicile)
- ✅ URL simple à retenir
- ✅ Pas de maintenance réseau
- ✅ Gratuit avec Render
- ✅ Professionnel

---

## 🆘 Besoin d'aide ?

Si vous voulez que je vous guide étape par étape pour déployer sur Render, dites-moi !

