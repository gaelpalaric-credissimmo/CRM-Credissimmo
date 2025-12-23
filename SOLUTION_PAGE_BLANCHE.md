# 🔧 Solution : Page Blanche

## 🚨 Diagnostic rapide

### Étape 1 : Ouvrir la console
1. Appuyez sur **F12** dans votre navigateur
2. Allez dans l'onglet **"Console"**
3. **Copiez l'erreur exacte** que vous voyez

### Étape 2 : Vérifier l'URL
- ✅ Utilisez : `http://localhost:3000`
- ❌ Pas : `https://localhost:3000`

### Étape 3 : Recharger
- Appuyez sur **Ctrl+Shift+R** (rechargement forcé)

## 🔍 Erreurs courantes et solutions

### Erreur : "Cannot find module"
**Solution** : Redémarrer le client React
```bash
# Arrêter (Ctrl+C)
# Puis redémarrer
cd client
npm start
```

### Erreur : "Failed to fetch" ou "Network Error"
**Solution** : Vérifier que le serveur backend tourne
```bash
# Dans un autre terminal
npm run dev
```

### Erreur : "Unexpected token" ou erreur de syntaxe
**Solution** : Vérifier les logs de compilation dans le terminal où tourne `npm run client`

### Page complètement blanche (aucune erreur)
**Solution** : 
1. Vérifier que vous êtes sur `/login` si non connecté
2. Vérifier que le serveur backend répond : `http://localhost:5000/api/health`

## 🛠️ Solution complète

### 1. Arrêter tous les processus
```bash
# PowerShell
Get-Process -Name node | Stop-Process -Force
```

### 2. Nettoyer et réinstaller (si nécessaire)
```bash
# À la racine
npm install

# Dans client
cd client
npm install
cd ..
```

### 3. Redémarrer proprement
```bash
# Terminal 1 - Serveur
npm run dev

# Terminal 2 - Client
npm run client
```

### 4. Ouvrir le navigateur
- Allez sur `http://localhost:3000`
- Appuyez sur **F12** pour voir les erreurs
- Appuyez sur **Ctrl+Shift+R** pour recharger

## 📞 Informations à me donner

Pour que je puisse vous aider, j'ai besoin de :
1. **L'erreur exacte** de la console (F12 > Console)
2. **L'URL** sur laquelle vous êtes
3. **Les logs** du terminal où tourne `npm run client`

## ✅ Vérifications rapides

- [ ] Console ouverte (F12)
- [ ] URL correcte (`http://localhost:3000`)
- [ ] Serveur backend démarré (`npm run dev`)
- [ ] Client React démarré (`npm run client`)
- [ ] Cache vidé (Ctrl+Shift+R)
- [ ] Pas d'erreur rouge dans la console

