# 🚀 Guide de Démarrage Rapide

Guide pour démarrer rapidement votre CRM professionnel.

## 📋 Prérequis

- Node.js 14+ installé
- Un compte MongoDB Atlas (gratuit) - voir [CONFIGURATION_MONGODB.md](./CONFIGURATION_MONGODB.md)

## ⚡ Installation rapide

### 1. Installer les dépendances

```bash
# À la racine du projet
npm install

# Dans le dossier client
cd client
npm install
cd ..
```

### 2. Configurer MongoDB

1. Créez un compte sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (gratuit)
2. Créez un cluster gratuit (M0)
3. Obtenez votre URI de connexion
4. Créez un fichier `.env` à la racine :

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/crm?retryWrites=true&w=majority
JWT_SECRET=votre-secret-jwt-tres-long-et-aleatoire
SESSION_SECRET=votre-secret-session-tres-long-et-aleatoire
```

### 3. Démarrer l'application

**Terminal 1 - Serveur** :
```bash
npm run dev
```

**Terminal 2 - Client** :
```bash
npm run client
```

### 4. Se connecter

Ouvrez votre navigateur sur `http://localhost:3000`

**Compte par défaut** :
- Email : `admin@crm.com`
- Mot de passe : `admin123`

⚠️ Changez ce mot de passe immédiatement !

## 🎯 Premiers pas

1. **Créer des utilisateurs** (admin seulement)
   - Allez dans le menu "Intégrations" > "Gestion utilisateurs" (à venir)
   - Ou utilisez l'API : `POST /api/auth/register`

2. **Ajouter des clients**
   - Menu "Clients" > "Nouveau client"

3. **Créer des opportunités**
   - Menu "Opportunités" > "Nouvelle opportunité"

4. **Configurer les rappels**
   - Menu "Rappels" > "Générer les rappels"

## 📱 Utilisation mobile

L'application est installable sur mobile :
- **Android** : Ouvrez dans Chrome > Menu > "Ajouter à l'écran d'accueil"
- **iOS** : Ouvrez dans Safari > Partager > "Sur l'écran d'accueil"

## 🌐 Déploiement en production

Voir [DEPLOYMENT.md](./DEPLOYMENT.md) pour les options de déploiement.

### Option rapide : Render.com

1. Créez un compte sur [Render.com](https://render.com)
2. Connectez votre repository GitHub
3. Créez un nouveau "Web Service"
4. Configurez :
   - **Build Command** : `npm install && cd client && npm install && npm run build && cd ..`
   - **Start Command** : `npm start`
   - **Environment Variables** : Ajoutez toutes les variables de `.env`

## 🔧 Fonctionnalités

✅ **Gestion des utilisateurs** avec rôles (admin, manager, commercial)
✅ **Base de données MongoDB** cloud (gratuit)
✅ **Interface responsive** (mobile, tablette, desktop)
✅ **Application installable** (PWA)
✅ **Authentification sécurisée** (JWT)
✅ **Gestion des clients, prospects, opportunités**
✅ **Système de rappels automatiques**
✅ **Recherche globale** (Ctrl+K)
✅ **Intégrations** (Google Sheets, Outlook)

## 🆘 Problèmes courants

**Erreur de connexion MongoDB** :
- Vérifiez votre URI dans `.env`
- Vérifiez que votre IP est autorisée dans MongoDB Atlas

**Port déjà utilisé** :
- Changez `PORT` dans `.env`

**Erreur 401 (Non autorisé)** :
- Vérifiez que vous êtes connecté
- Vérifiez que votre token n'est pas expiré

## 📞 Support

Pour toute question, consultez :
- [CONFIGURATION_MONGODB.md](./CONFIGURATION_MONGODB.md) - Configuration MongoDB
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Déploiement
- [README.md](./README.md) - Documentation complète

