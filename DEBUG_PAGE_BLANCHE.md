# 🐛 Debug : Page Blanche

Si vous voyez une page blanche, voici comment diagnostiquer et résoudre le problème.

## 🔍 Diagnostic

### 1. Ouvrir la console du navigateur

**Chrome/Edge** :
- Appuyez sur `F12` ou `Ctrl+Shift+I`
- Allez dans l'onglet "Console"

**Firefox** :
- Appuyez sur `F12` ou `Ctrl+Shift+K`

### 2. Vérifier les erreurs

Cherchez les erreurs en rouge dans la console. Les erreurs courantes :

- `Cannot find module` : Module manquant
- `Unexpected token` : Erreur de syntaxe
- `Failed to fetch` : Problème de connexion au serveur
- `404 Not Found` : Fichier manquant

### 3. Vérifier l'onglet Network

Dans les outils de développement :
- Allez dans l'onglet "Network" (Réseau)
- Rechargez la page (`F5`)
- Vérifiez s'il y a des fichiers en rouge (404)

## 🔧 Solutions courantes

### Solution 1 : Vider le cache

1. Appuyez sur `Ctrl+Shift+R` (rechargement forcé)
2. Ou vider le cache du navigateur :
   - Chrome : `Ctrl+Shift+Delete` > Cocher "Images et fichiers en cache" > Effacer

### Solution 2 : Vérifier que le serveur tourne

**Serveur backend** :
```bash
# Vérifier que le serveur est démarré
curl http://localhost:5000/api/health
```

**Client React** :
- Vérifiez que `npm run client` est lancé
- L'URL devrait être `http://localhost:3000`

### Solution 3 : Vérifier les erreurs de build

Si vous êtes en production (Render) :
1. Allez dans Render Dashboard
2. Section "Logs"
3. Cherchez les erreurs de build

### Solution 4 : Désactiver le Service Worker

Le service worker peut causer des problèmes. Pour le désactiver temporairement :

1. Ouvrez la console (`F12`)
2. Allez dans l'onglet "Application" (Chrome) ou "Stockage" (Firefox)
3. Cliquez sur "Service Workers"
4. Cliquez sur "Unregister" (Désinscrire)

### Solution 5 : Vérifier les imports

Si vous voyez une erreur `Cannot find module`, vérifiez que :
- Tous les fichiers sont bien présents
- Les chemins d'import sont corrects
- Les dépendances sont installées (`npm install`)

## 🆘 Erreurs spécifiques

### Erreur : "Cannot find module './ImportExcel'"

**Solution** :
1. Vérifiez que le fichier `client/src/components/ImportExcel.js` existe
2. Vérifiez qu'il exporte bien : `export default ImportExcel;`

### Erreur : "downloadTemplate is not a function"

**Solution** :
1. Vérifiez que `downloadTemplate` est bien exporté dans `client/src/api/api.js`
2. Redémarrez le serveur de développement

### Erreur : "Failed to fetch"

**Solution** :
1. Vérifiez que le serveur backend est démarré (`npm run dev`)
2. Vérifiez l'URL dans `client/src/api/api.js`
3. Vérifiez CORS dans `server.js`

## 📋 Checklist de vérification

- [ ] Console du navigateur ouverte (`F12`)
- [ ] Aucune erreur rouge dans la console
- [ ] Serveur backend démarré (`npm run dev`)
- [ ] Client React démarré (`npm run client`)
- [ ] Cache du navigateur vidé (`Ctrl+Shift+R`)
- [ ] Service Worker désactivé (si problème persiste)
- [ ] Toutes les dépendances installées (`npm install`)

## 🔄 Redémarrer proprement

Si rien ne fonctionne, redémarrez tout :

1. **Arrêter tous les processus Node** :
   ```bash
   # Windows PowerShell
   Get-Process -Name node | Stop-Process -Force
   ```

2. **Nettoyer et réinstaller** :
   ```bash
   # À la racine
   rm -rf node_modules
   npm install
   
   # Dans client
   cd client
   rm -rf node_modules
   npm install
   cd ..
   ```

3. **Redémarrer** :
   ```bash
   # Terminal 1
   npm run dev
   
   # Terminal 2
   npm run client
   ```

## 💡 En cas de problème persistant

1. **Copiez l'erreur exacte** de la console
2. **Vérifiez les logs** du serveur
3. **Vérifiez les logs** du client React
4. Partagez ces informations pour diagnostic

