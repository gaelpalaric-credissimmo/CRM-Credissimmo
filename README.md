# CRM - Système de Gestion de la Relation Client

Un système CRM moderne et complet développé avec React et Node.js/Express.

## 🚀 Fonctionnalités

- **Gestion des Clients** : Création, modification, suppression et consultation des clients
- **Gestion des Contacts** : Gestion des contacts associés aux clients
- **Gestion des Opportunités** : Suivi des opportunités commerciales avec statuts et montants
- **Tableau de bord** : Vue d'ensemble avec statistiques et indicateurs clés
- **Interface moderne** : Design responsive et intuitif

## 📋 Prérequis

- Node.js (version 14 ou supérieure)
- npm ou yarn

## 🛠️ Installation

1. **Installer les dépendances du serveur** :
```bash
npm install
```

2. **Installer les dépendances du client** :
```bash
cd client
npm install
cd ..
```

## 🎯 Démarrage

### Mode développement

Pour démarrer le serveur et le client en mode développement :

**Terminal 1 - Serveur** :
```bash
npm run dev
```

**Terminal 2 - Client** :
```bash
npm run client
```

Le serveur sera accessible sur `http://localhost:5000`
Le client sera accessible sur `http://localhost:3000`

### Mode production

1. **Construire le client** :
```bash
npm run build
```

2. **Démarrer le serveur** :
```bash
npm start
```

## 📁 Structure du projet

```
crm-project/
├── client/                 # Application React
│   ├── public/
│   ├── src/
│   │   ├── components/     # Composants React
│   │   ├── api/            # Configuration API
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── server.js               # Serveur Express
├── package.json
└── README.md
```

## 🔌 API Endpoints

### Clients
- `GET /api/clients` - Liste tous les clients
- `GET /api/clients/:id` - Récupère un client
- `POST /api/clients` - Crée un nouveau client
- `PUT /api/clients/:id` - Met à jour un client
- `DELETE /api/clients/:id` - Supprime un client

### Contacts
- `GET /api/contacts` - Liste tous les contacts
- `GET /api/contacts/:id` - Récupère un contact
- `POST /api/contacts` - Crée un nouveau contact
- `PUT /api/contacts/:id` - Met à jour un contact
- `DELETE /api/contacts/:id` - Supprime un contact

### Opportunités
- `GET /api/opportunites` - Liste toutes les opportunités
- `GET /api/opportunites/:id` - Récupère une opportunité
- `POST /api/opportunites` - Crée une nouvelle opportunité
- `PUT /api/opportunites/:id` - Met à jour une opportunité
- `DELETE /api/opportunites/:id` - Supprime une opportunité

### Statistiques
- `GET /api/stats` - Récupère les statistiques du tableau de bord

## 🗄️ Base de données

Actuellement, le projet utilise un stockage en mémoire. Pour la production, il est recommandé d'intégrer une base de données (MongoDB, PostgreSQL, MySQL, etc.).

## 🔧 Configuration

Créez un fichier `.env` à la racine du projet :

```
PORT=5000
NODE_ENV=development
```

## 🌐 Déploiement en ligne

Le CRM peut être déployé en ligne facilement.

### 📘 Pour les débutants

**Consultez le guide complet pour débutants : [GUIDE_DEBUTANT.md](./GUIDE_DEBUTANT.md)**

Ce guide vous accompagne étape par étape avec toutes les explications nécessaires.

### ⚡ Pour les personnes pressées

**Consultez le résumé rapide : [RESUME_RAPIDE.md](./RESUME_RAPIDE.md)**

### 📚 Guide technique complet

**Consultez : [DEPLOYMENT.md](./DEPLOYMENT.md)** pour toutes les options de déploiement.

### Option rapide : Render (Recommandé)

1. Créez un compte sur [Render.com](https://render.com)
2. Connectez votre repository GitHub
3. Créez un nouveau "Web Service"
4. Configurez :
   - **Build Command** : `npm install && cd client && npm install && npm run build && cd ..`
   - **Start Command** : `npm start`
   - **Environment** : Node
5. Déployez !

Votre CRM sera accessible sur une URL comme `https://votre-projet.onrender.com`

Pour plus d'options (Vercel, Railway, Docker, etc.), voir [DEPLOYMENT.md](./DEPLOYMENT.md).

## 📝 Notes

- Les données sont stockées en mémoire et seront perdues au redémarrage du serveur
- Pour la production, intégrez une vraie base de données
- Ajoutez l'authentification et l'autorisation selon vos besoins
- Configurez CORS selon votre environnement

## 🎨 Technologies utilisées

- **Frontend** : React, React Router, Axios, React Icons
- **Backend** : Node.js, Express, CORS, Body-parser
- **Styling** : CSS3 avec design moderne et responsive

## 📄 Licence

MIT
