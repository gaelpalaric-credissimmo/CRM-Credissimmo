# 📘 Guide Débutant : Mettre votre CRM en ligne

Ce guide vous accompagne étape par étape pour mettre votre CRM en ligne, même si vous n'avez jamais fait de déploiement avant.

## 🎯 Objectif

À la fin de ce guide, votre CRM sera accessible sur Internet avec une URL comme : `https://votre-crm.onrender.com`

---

## 📋 Étape 0 : Vérifier ce dont vous avez besoin

Avant de commencer, vous devez avoir :

- ✅ Un ordinateur avec Windows
- ✅ Une connexion Internet
- ✅ Un compte email (pour créer les comptes nécessaires)
- ⚠️ **Node.js installé** (si ce n'est pas le cas, voir l'annexe en bas)

---

## 📦 Étape 1 : Créer un compte GitHub

GitHub est un service gratuit qui stocke votre code en ligne. C'est nécessaire pour déployer votre CRM.

### 1.1 Aller sur GitHub

1. Ouvrez votre navigateur (Chrome, Edge, Firefox, etc.)
2. Allez sur : **https://github.com**
3. Cliquez sur le bouton **"Sign up"** (S'inscrire) en haut à droite

### 1.2 Créer votre compte

1. Entrez votre **adresse email**
2. Choisissez un **mot de passe** (notez-le quelque part)
3. Choisissez un **nom d'utilisateur** (par exemple : `votre-nom-crm`)
4. Résolvez le puzzle de vérification
5. Cliquez sur **"Create account"** (Créer un compte)
6. Vérifiez votre email et confirmez votre compte

✅ **Vérification** : Vous devez pouvoir vous connecter sur GitHub.com

---

## 📁 Étape 2 : Mettre votre code sur GitHub

Maintenant, nous allons copier votre projet CRM sur GitHub.

### 2.1 Installer Git (si nécessaire)

Git est un outil qui permet de mettre votre code en ligne.

1. Allez sur : **https://git-scm.com/download/win**
2. Téléchargez Git pour Windows
3. Installez-le en cliquant sur "Next" partout (les options par défaut sont bonnes)
4. **Redémarrez votre ordinateur** après l'installation

### 2.2 Vérifier que Git est installé

1. Appuyez sur **Windows + R**
2. Tapez : `powershell` et appuyez sur Entrée
3. Dans la fenêtre qui s'ouvre, tapez : `git --version`
4. Si vous voyez un numéro de version (comme `git version 2.xx.x`), c'est bon ✅
5. Si vous voyez une erreur, réinstallez Git

### 2.3 Créer un nouveau repository sur GitHub

1. Connectez-vous sur **GitHub.com**
2. Cliquez sur le **"+"** en haut à droite
3. Cliquez sur **"New repository"** (Nouveau dépôt)
4. Remplissez :
   - **Repository name** : `crm-project` (ou un autre nom)
   - **Description** : "Mon CRM" (optionnel)
   - **Public** ou **Private** : Choisissez Public (gratuit)
   - **NE COCHEZ PAS** "Add a README file"
   - **NE COCHEZ PAS** "Add .gitignore"
   - **NE COCHEZ PAS** "Choose a license"
5. Cliquez sur **"Create repository"** (Créer le dépôt)

### 2.4 Copier votre code sur GitHub

1. Ouvrez l'**Explorateur de fichiers** Windows
2. Allez dans : `C:\Users\gaelp\crm-project`
3. Cliquez dans la barre d'adresse en haut et copiez le chemin
4. Appuyez sur **Windows + R**
5. Tapez : `powershell` et appuyez sur Entrée
6. Dans PowerShell, tapez ces commandes **une par une** (appuyez sur Entrée après chaque ligne) :

```powershell
cd C:\Users\gaelp\crm-project
```

```powershell
git init
```

```powershell
git add .
```

```powershell
git commit -m "Premier commit - Mon CRM"
```

```powershell
git branch -M main
```

```powershell
git remote add origin https://github.com/VOTRE_NOM_UTILISATEUR/crm-project.git
```
⚠️ **IMPORTANT** : Remplacez `VOTRE_NOM_UTILISATEUR` par votre nom d'utilisateur GitHub !

```powershell
git push -u origin main
```

7. GitHub vous demandera de vous connecter :
   - Entrez votre **nom d'utilisateur GitHub**
   - Entrez votre **mot de passe GitHub** (ou un token si demandé)
   - Si ça ne fonctionne pas, voir la section "Problème d'authentification" en bas

✅ **Vérification** : Allez sur votre page GitHub (https://github.com/VOTRE_NOM_UTILISATEUR/crm-project) et vous devriez voir tous vos fichiers !

---

## 🚀 Étape 3 : Déployer sur Render (GRATUIT)

Render est un service gratuit qui héberge votre application.

### 3.1 Créer un compte Render

1. Allez sur : **https://render.com**
2. Cliquez sur **"Get Started for Free"** (Commencer gratuitement)
3. Cliquez sur **"Sign up with GitHub"** (S'inscrire avec GitHub)
4. Autorisez Render à accéder à votre compte GitHub
5. Remplissez le formulaire :
   - **Email** : Votre email
   - **Password** : Choisissez un mot de passe
6. Cliquez sur **"Sign Up"** (S'inscrire)

✅ **Vérification** : Vous devez être connecté sur Render.com

### 3.2 Créer un nouveau service web

1. Sur la page d'accueil de Render, cliquez sur **"New +"** (Nouveau +)
2. Cliquez sur **"Web Service"** (Service Web)
3. Vous verrez une liste de vos repositories GitHub
4. Cliquez sur **"Connect"** à côté de `crm-project` (ou le nom que vous avez choisi)
5. Si vous ne voyez pas votre repository :
   - Cliquez sur **"Configure account"** (Configurer le compte)
   - Autorisez Render à accéder à vos repositories
   - Revenez à l'étape précédente

### 3.3 Configurer le service

Remplissez le formulaire avec ces informations :

#### Informations de base :
- **Name** : `crm-project` (ou le nom que vous voulez)
- **Region** : Choisissez le plus proche de vous (ex: `Frankfurt` pour l'Europe)
- **Branch** : `main` (devrait être déjà sélectionné)
- **Root Directory** : Laissez vide
- **Runtime** : `Node` (devrait être déjà sélectionné)

#### Commandes de build :
- **Build Command** : Copiez-collez exactement ceci :
  ```
  npm install && cd client && npm install && npm run build && cd ..
  ```

- **Start Command** : Copiez-collez exactement ceci :
  ```
  npm start
  ```

#### Plan :
- Cliquez sur **"Free"** (Gratuit) - c'est le plan gratuit

### 3.4 Ajouter les variables d'environnement

1. Cliquez sur **"Advanced"** (Avancé) en bas
2. Dans la section **"Environment Variables"** (Variables d'environnement), cliquez sur **"Add Environment Variable"** (Ajouter une variable)
3. Ajoutez ces deux variables **une par une** :

   **Variable 1 :**
   - **Key** : `NODE_ENV`
   - **Value** : `production`
   - Cliquez sur **"Add"**

   **Variable 2 :**
   - **Key** : `PORT`
   - **Value** : `10000`
   - Cliquez sur **"Add"**

### 3.5 Lancer le déploiement

1. Vérifiez que toutes les informations sont correctes
2. Cliquez sur **"Create Web Service"** (Créer le service web) en bas
3. Render va maintenant :
   - Télécharger votre code
   - Installer les dépendances
   - Construire votre application
   - La mettre en ligne

⏳ **Cela prend 5 à 10 minutes** - Vous verrez les logs en temps réel

✅ **Vérification** : Quand vous voyez "Your service is live" (Votre service est en ligne), c'est prêt !

### 3.6 Trouver l'URL de votre CRM

1. Une fois le déploiement terminé, vous verrez une section **"Service Details"**
2. Cherchez **"URL"** ou **"Service URL"**
3. Vous verrez quelque chose comme : `https://crm-project.onrender.com`
4. **Copiez cette URL** - c'est l'adresse de votre CRM en ligne !

---

## 🎉 Étape 4 : Tester votre CRM en ligne

1. Ouvrez un nouveau onglet dans votre navigateur
2. Collez l'URL que vous avez copiée (ex: `https://crm-project.onrender.com`)
3. Appuyez sur Entrée
4. Vous devriez voir l'interface de votre CRM ! 🎊

### Test rapide :

1. Cliquez sur **"Clients"** dans le menu
2. Cliquez sur **"Ajouter un client"**
3. Remplissez le formulaire avec des informations de test
4. Cliquez sur **"Créer"**
5. Vérifiez que le client apparaît dans la liste

✅ Si tout fonctionne, **félicitations ! Votre CRM est en ligne !**

---

## 🔄 Mettre à jour votre CRM

Quand vous modifiez votre code localement et voulez le mettre à jour en ligne :

1. Dans PowerShell, allez dans votre dossier :
   ```powershell
   cd C:\Users\gaelp\crm-project
   ```

2. Ajoutez vos modifications :
   ```powershell
   git add .
   ```

3. Créez un commit :
   ```powershell
   git commit -m "Description de vos modifications"
   ```

4. Envoyez sur GitHub :
   ```powershell
   git push
   ```

5. Render détectera automatiquement les changements et redéploiera votre application (cela prend 5-10 minutes)

---

## 🆘 Problèmes courants et solutions

### Problème : "git n'est pas reconnu"

**Solution** :
1. Réinstallez Git depuis https://git-scm.com/download/win
2. Redémarrez votre ordinateur
3. Réessayez

### Problème : Erreur lors de "git push" - Authentification

**Solution** :
1. Sur GitHub, allez dans **Settings** > **Developer settings** > **Personal access tokens** > **Tokens (classic)**
2. Cliquez sur **"Generate new token"**
3. Donnez-lui un nom (ex: "CRM")
4. Cochez **"repo"**
5. Cliquez sur **"Generate token"**
6. **COPIEZ LE TOKEN** (vous ne le reverrez plus !)
7. Quand Git vous demande un mot de passe, utilisez ce token au lieu de votre mot de passe

### Problème : Render ne trouve pas mon repository

**Solution** :
1. Vérifiez que votre repository est bien **Public** sur GitHub
2. Dans Render, allez dans **Account Settings** > **GitHub**
3. Cliquez sur **"Reconnect"** ou **"Configure"**
4. Autorisez l'accès à tous les repositories

### Problème : Le déploiement échoue sur Render

**Solution** :
1. Cliquez sur **"Logs"** dans Render pour voir l'erreur
2. Vérifiez que :
   - Le **Build Command** est exactement : `npm install && cd client && npm install && npm run build && cd ..`
   - Le **Start Command** est exactement : `npm start`
   - Les variables `NODE_ENV` et `PORT` sont bien définies
3. Si l'erreur persiste, copiez le message d'erreur et cherchez-le sur Google

### Problème : L'application ne démarre pas

**Solution** :
1. Vérifiez les logs sur Render
2. Assurez-vous que `NODE_ENV=production` est défini
3. Vérifiez que `PORT=10000` est défini

### Problème : Erreur 404 sur les pages

**Solution** :
1. Attendez que le build soit complètement terminé (5-10 minutes)
2. Vérifiez que le dossier `client/build` existe dans votre code
3. Si nécessaire, construisez localement : `cd client && npm run build`

---

## 📝 Checklist de vérification

Avant de déployer, vérifiez que vous avez :

- [ ] Un compte GitHub créé et vérifié
- [ ] Votre code poussé sur GitHub (visible sur github.com)
- [ ] Un compte Render créé
- [ ] Le service web créé sur Render
- [ ] Les variables d'environnement configurées (`NODE_ENV` et `PORT`)
- [ ] Le déploiement terminé avec succès
- [ ] L'URL de votre CRM fonctionne dans le navigateur

---

## 🎓 Annexe : Installer Node.js (si nécessaire)

Si vous n'avez pas Node.js installé :

1. Allez sur : **https://nodejs.org/**
2. Téléchargez la version **LTS** (Long Term Support) - c'est la version recommandée
3. Exécutez le fichier téléchargé (ex: `node-v20.x.x-x64.msi`)
4. Cliquez sur **"Next"** partout (les options par défaut sont bonnes)
5. Cochez **"Automatically install the necessary tools"** si proposé
6. Cliquez sur **"Install"**
7. Attendez la fin de l'installation
8. **Redémarrez votre ordinateur**
9. Vérifiez l'installation :
   - Ouvrez PowerShell
   - Tapez : `node --version`
   - Vous devriez voir un numéro de version (ex: `v20.x.x`)

---

## 💡 Conseils pour débutants

1. **Ne paniquez pas** si quelque chose ne fonctionne pas - c'est normal !
2. **Lisez les messages d'erreur** - ils indiquent souvent le problème
3. **Copiez-collez exactement** les commandes - une faute de frappe peut tout casser
4. **Sauvegardez vos URLs** - notez l'URL de votre CRM quelque part
5. **Testez régulièrement** - après chaque modification importante

---

## 📞 Besoin d'aide ?

Si vous êtes bloqué :

1. **Lisez les logs** sur Render - ils indiquent souvent le problème
2. **Cherchez l'erreur sur Google** - quelqu'un a probablement eu le même problème
3. **Vérifiez la documentation** :
   - [Documentation Render](https://render.com/docs)
   - [Documentation GitHub](https://docs.github.com)

---

## 🎉 Félicitations !

Si vous êtes arrivé jusqu'ici et que votre CRM fonctionne en ligne, vous avez réussi ! 

Vous pouvez maintenant :
- ✅ Partager l'URL avec d'autres personnes
- ✅ Utiliser votre CRM depuis n'importe où
- ✅ Continuer à le développer et le mettre à jour

**Bon courage ! 🚀**
