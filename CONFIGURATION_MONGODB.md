# 🗄️ Configuration MongoDB Atlas

Ce guide vous explique comment configurer MongoDB Atlas (gratuit) pour votre CRM.

## 📋 Étape 1 : Créer un compte MongoDB Atlas

1. Allez sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Cliquez sur "Try Free" ou "Sign Up"
3. Créez votre compte (gratuit)

## 🔧 Étape 2 : Créer un cluster

1. Une fois connecté, cliquez sur "Build a Database"
2. Choisissez le plan **FREE (M0)** - c'est gratuit et suffisant pour commencer
3. Choisissez votre région (Europe de l'Ouest recommandé pour la France)
4. Donnez un nom à votre cluster (ex: "CRM-Cluster")
5. Cliquez sur "Create"

## 🔐 Étape 3 : Créer un utilisateur de base de données

1. Dans la section "Database Access", cliquez sur "Add New Database User"
2. Choisissez "Password" comme méthode d'authentification
3. Créez un nom d'utilisateur et un mot de passe **forts** (notez-les !)
4. Donnez les permissions "Atlas admin" ou "Read and write to any database"
5. Cliquez sur "Add User"

## 🌐 Étape 4 : Autoriser l'accès réseau

1. Dans la section "Network Access", cliquez sur "Add IP Address"
2. Pour le développement, cliquez sur "Allow Access from Anywhere" (0.0.0.0/0)
   - ⚠️ En production, ajoutez uniquement les IPs de vos serveurs
3. Cliquez sur "Confirm"

## 🔗 Étape 5 : Obtenir la chaîne de connexion

1. Dans la section "Database", cliquez sur "Connect" sur votre cluster
2. Choisissez "Connect your application"
3. Sélectionnez "Node.js" comme driver
4. Copiez la chaîne de connexion qui ressemble à :
   ```
   mongodb+srv://<username>:<password>@cluster.mongodb.net/?retryWrites=true&w=majority
   ```

## ⚙️ Étape 6 : Configurer votre application

1. Créez un fichier `.env` à la racine du projet (copiez `.env.example`)
2. Remplacez `<username>` et `<password>` dans la chaîne de connexion par vos identifiants
3. Ajoutez le nom de la base de données à la fin :
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/crm?retryWrites=true&w=majority
   ```

## ✅ Étape 7 : Tester la connexion

1. Installez les dépendances :
   ```bash
   npm install
   ```

2. Démarrez le serveur :
   ```bash
   npm run dev
   ```

3. Vous devriez voir dans la console :
   ```
   ✅ MongoDB connecté : cluster0.xxxxx.mongodb.net
   👤 Utilisateur admin créé : admin@crm.com / admin123
   ```

## 🎯 Compte admin par défaut

Lors du premier démarrage, un compte administrateur est créé automatiquement :
- **Email** : `admin@crm.com`
- **Mot de passe** : `admin123`

⚠️ **IMPORTANT** : Changez ce mot de passe immédiatement en production !

## 📊 Gérer vos données

Vous pouvez visualiser et gérer vos données directement dans MongoDB Atlas :
1. Allez dans "Database" > "Browse Collections"
2. Vous verrez toutes vos collections (clients, prospects, opportunités, etc.)

## 🔒 Sécurité en production

- Utilisez des mots de passe forts
- Limitez les IPs autorisées
- Activez l'authentification à deux facteurs sur votre compte Atlas
- Changez le JWT_SECRET et SESSION_SECRET dans `.env`
- Utilisez des variables d'environnement sécurisées sur votre plateforme d'hébergement

## 💰 Coûts

Le plan **FREE (M0)** de MongoDB Atlas est gratuit et inclut :
- 512 MB de stockage
- Partage de ressources (RAM et CPU)
- Jusqu'à 500 connexions simultanées

C'est largement suffisant pour une équipe de 10+ commerciaux !

## 🆘 Dépannage

**Erreur de connexion** :
- Vérifiez que votre IP est autorisée
- Vérifiez vos identifiants dans la chaîne de connexion
- Vérifiez que le cluster est démarré (il peut être en pause après 7 jours d'inactivité)

**Cluster en pause** :
- MongoDB Atlas met en pause les clusters gratuits après 7 jours d'inactivité
- Cliquez sur "Resume" pour le redémarrer

