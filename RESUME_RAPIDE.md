# ⚡ Résumé Rapide - Déploiement CRM

Guide ultra-condensé pour les personnes pressées. Pour plus de détails, voir [GUIDE_DEBUTANT.md](./GUIDE_DEBUTANT.md).

## 🎯 En 5 étapes

### 1️⃣ Installer Git
- Télécharger : https://git-scm.com/download/win
- Installer avec les options par défaut
- Redémarrer l'ordinateur

### 2️⃣ Créer un compte GitHub
- Aller sur : https://github.com
- Créer un compte
- Créer un nouveau repository (Public) : `crm-project`

### 3️⃣ Mettre le code sur GitHub

Ouvrir PowerShell dans `C:\Users\gaelp\crm-project` et exécuter :

```powershell
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/VOTRE_USERNAME/crm-project.git
git push -u origin main
```

⚠️ Remplacer `VOTRE_USERNAME` par votre nom d'utilisateur GitHub !

### 4️⃣ Créer un compte Render
- Aller sur : https://render.com
- S'inscrire avec GitHub
- Créer un nouveau "Web Service"
- Connecter le repository `crm-project`

### 5️⃣ Configurer Render

**Build Command :**
```
npm install && cd client && npm install && npm run build && cd ..
```

**Start Command :**
```
npm start
```

**Variables d'environnement :**
- `NODE_ENV` = `production`
- `PORT` = `10000`

**Plan :** Free (gratuit)

Cliquer sur "Create Web Service" et attendre 5-10 minutes.

---

## ✅ Résultat

Votre CRM sera accessible sur : `https://crm-project.onrender.com` (ou le nom que vous avez choisi)

---

## 🔄 Mettre à jour

Après chaque modification locale :

```powershell
cd C:\Users\gaelp\crm-project
git add .
git commit -m "Description"
git push
```

Render redéploiera automatiquement.

---

**Besoin d'aide ?** Consultez [GUIDE_DEBUTANT.md](./GUIDE_DEBUTANT.md) pour un guide détaillé.
