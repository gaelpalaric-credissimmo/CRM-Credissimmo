# 🔧 Guide Détaillé : Variables d'Environnement sur Render

Guide pas à pas pour configurer les variables d'environnement dans Render.

## 📍 Étape 1 : Accéder à votre service

1. **Connectez-vous** sur [dashboard.render.com](https://dashboard.render.com)
2. **Cliquez** sur votre service "crm credissimmo" (ou le nom de votre service)
3. Dans le menu de gauche, **cliquez sur "Environment"**

Vous verrez une liste de variables d'environnement (peut être vide si c'est la première fois).

---

## 📝 Étape 2 : Ajouter/Modifier les variables

Pour chaque variable, suivez ces étapes :

### Méthode : Ajouter une variable

1. **Cliquez sur le bouton "Add Environment Variable"** (ou "+ Add" selon l'interface)
2. **Deux champs apparaissent** :
   - **Key** (nom de la variable)
   - **Value** (valeur de la variable)
3. **Remplissez les deux champs**
4. **Cliquez sur "Save Changes"** (ou "Add")

### Méthode : Modifier une variable existante

1. **Trouvez la variable** dans la liste
2. **Cliquez sur l'icône "Edit"** (crayon) à droite
3. **Modifiez la valeur**
4. **Cliquez sur "Save"**

---

## ✅ Variables à configurer (copier-coller)

Voici **exactement** ce que vous devez copier-coller :

### Variable 1 : NODE_ENV

```
Key: NODE_ENV
Value: production
```

### Variable 2 : PORT

```
Key: PORT
Value: 10000
```

### Variable 3 : MONGODB_URI

```
Key: MONGODB_URI
Value: mongodb+srv://gaelpalaric_db_user:*Leag8811*@crmcredissimmo.0e6l7w1.mongodb.net/crm?retryWrites=true&w=majority&appName=CrmCredissimmo
```

⚠️ **Important** : Copiez exactement cette valeur, avec les astérisques autour du mot de passe.

### Variable 4 : JWT_SECRET

```
Key: JWT_SECRET
Value: 2224e704dae7de005da352bdb62acabf0283cfe104f37a12b9c083e00b43e63c
```

### Variable 5 : SESSION_SECRET

```
Key: SESSION_SECRET
Value: 924b118e6be048b9fded05fe949a3692c25be4b82cdbc63fb4d8e6ac111063bb
```

### Variable 6 : FRONTEND_URL

**IMPORTANT** : Remplacez `votre-url-render` par votre vraie URL Render.

Pour trouver votre URL :
1. Dans Render, allez dans votre service
2. En haut de la page, vous verrez votre URL (ex: `https://crm-credissimmo-xxxx.onrender.com`)
3. Copiez cette URL complète

```
Key: FRONTEND_URL
Value: https://votre-url-render.onrender.com
```

**Exemple** (remplacez par la vôtre) :
```
Key: FRONTEND_URL
Value: https://crm-credissimmo-abc123.onrender.com
```

---

## 📋 Checklist complète

Cochez chaque variable après l'avoir ajoutée :

- [ ] `NODE_ENV` = `production`
- [ ] `PORT` = `10000`
- [ ] `MONGODB_URI` = `mongodb+srv://gaelpalaric_db_user:*Leag8811*@crmcredissimmo.0e6l7w1.mongodb.net/crm?retryWrites=true&w=majority&appName=CrmCredissimmo`
- [ ] `JWT_SECRET` = `2224e704dae7de005da352bdb62acabf0283cfe104f37a12b9c083e00b43e63c`
- [ ] `SESSION_SECRET` = `924b118e6be048b9fded05fe949a3692c25be4b82cdbc63fb4d8e6ac111063bb`
- [ ] `FRONTEND_URL` = `https://votre-url-render.onrender.com` (remplacez par votre URL)

---

## 🎯 Ordre recommandé

Ajoutez les variables dans cet ordre :

1. **NODE_ENV** (le plus simple pour commencer)
2. **PORT**
3. **MONGODB_URI** (la plus importante)
4. **JWT_SECRET**
5. **SESSION_SECRET**
6. **FRONTEND_URL** (à la fin, après avoir noté votre URL)

---

## ⚠️ Points d'attention

### Espaces
- ❌ **Ne mettez PAS d'espaces** avant ou après les valeurs
- ✅ Exemple correct : `production`
- ❌ Exemple incorrect : ` production ` (avec espaces)

### Guillemets
- ❌ **Ne mettez PAS de guillemets** autour des valeurs
- ✅ Exemple correct : `production`
- ❌ Exemple incorrect : `"production"`

### MONGODB_URI
- ✅ Copiez **exactement** la chaîne complète
- ✅ Gardez les astérisques `*Leag8811*` autour du mot de passe
- ✅ Gardez tous les paramètres (`?retryWrites=true&w=majority&appName=CrmCredissimmo`)

### FRONTEND_URL
- ✅ Utilisez `https://` (pas `http://`)
- ✅ Pas de slash à la fin
- ✅ Exemple correct : `https://crm-credissimmo.onrender.com`
- ❌ Exemple incorrect : `https://crm-credissimmo.onrender.com/`

---

## 💾 Sauvegarder

Après avoir ajouté/modifié toutes les variables :

1. **Vérifiez** que toutes les 6 variables sont présentes
2. **Vérifiez** qu'il n'y a pas d'erreurs (variables en rouge)
3. Render **sauvegarde automatiquement** (pas besoin de bouton "Save" global)

---

## 🔄 Après avoir configuré les variables

1. **Retournez** dans l'onglet "Events" ou "Logs"
2. Si le déploiement n'a pas démarré automatiquement :
   - Cliquez sur "Manual Deploy" > "Deploy latest commit"
3. **Attendez** 5-10 minutes pour le déploiement
4. **Surveillez les logs** pour voir la progression

---

## ✅ Vérification finale

Une fois le déploiement terminé, dans les logs vous devriez voir :

```
✅ MongoDB connecté : crmcredissimmo.0e6l7w1.mongodb.net
👤 Utilisateur admin créé : admin@crm.com / admin123
🚀 Serveur CRM démarré sur le port 10000
```

Si vous voyez ces messages, **tout est bon !** 🎉

---

## 🆘 En cas de problème

### Variable non sauvegardée
- Vérifiez qu'il n'y a pas d'espaces
- Vérifiez qu'il n'y a pas de guillemets
- Cliquez bien sur "Save" après chaque variable

### Erreur de connexion MongoDB
- Vérifiez que `MONGODB_URI` est exactement comme indiqué
- Vérifiez dans MongoDB Atlas que votre IP est autorisée (Network Access)

### Erreur au démarrage
- Vérifiez les logs dans Render
- Vérifiez que toutes les 6 variables sont présentes
- Vérifiez qu'il n'y a pas de fautes de frappe

---

## 📸 Aide visuelle

L'interface Render ressemble à ceci :

```
Environment Variables
─────────────────────
[+ Add Environment Variable]

┌─────────────────────────────────────────┐
│ Key: NODE_ENV                           │
│ Value: production              [Save]  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Key: PORT                               │
│ Value: 10000                    [Save]  │
└─────────────────────────────────────────┘

... (etc pour chaque variable)
```

---

## 🎯 Résumé rapide

1. Allez dans Render > Votre service > "Environment"
2. Ajoutez les 6 variables une par une
3. Copiez-collez exactement les valeurs ci-dessus
4. Remplacez `votre-url-render` dans `FRONTEND_URL` par votre vraie URL
5. Attendez le redéploiement automatique ou déclenchez-le manuellement

**C'est tout !** 🚀

