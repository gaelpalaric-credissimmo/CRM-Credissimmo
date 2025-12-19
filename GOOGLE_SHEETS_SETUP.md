# Configuration Google Sheets pour le CRM

Ce guide vous explique comment configurer la synchronisation Google Sheets pour remplacer le stockage en mémoire du CRM.

## 📋 Prérequis

1. Un compte Google
2. Un Google Sheet (créé ou existant)

## 🔧 Configuration Google Cloud Console

### Étape 1 : Créer un projet Google Cloud

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Cliquez sur "Sélectionner un projet" > "Nouveau projet"
3. Donnez un nom à votre projet (ex: "CRM-Sync")
4. Cliquez sur "Créer"

### Étape 2 : Activer l'API Google Sheets

1. Dans le menu, allez dans "APIs et services" > "Bibliothèque"
2. Recherchez "Google Sheets API"
3. Cliquez sur "Google Sheets API" puis sur "Activer"
4. Recherchez également "Google Drive API" et activez-la

### Étape 3 : Créer des identifiants OAuth 2.0

1. Allez dans "APIs et services" > "Identifiants"
2. Cliquez sur "Créer des identifiants" > "ID client OAuth"
3. Sélectionnez "Application Web"
4. Donnez un nom (ex: "CRM Web Client")
5. Dans "URI de redirection autorisés", ajoutez :
   - Pour le développement : `http://localhost:5000/api/googlesheets/callback`
   - Pour la production : `https://votre-domaine.com/api/googlesheets/callback`
6. Cliquez sur "Créer"
7. **Copiez le Client ID et le Client Secret** (vous en aurez besoin)

### Étape 4 : Configurer les variables d'environnement

Ajoutez ces variables dans votre fichier `.env` :

```env
GOOGLE_CLIENT_ID=votre_client_id_ici
GOOGLE_CLIENT_SECRET=votre_client_secret_ici
GOOGLE_REDIRECT_URI=http://localhost:5000/api/googlesheets/callback
FRONTEND_URL=http://localhost:3000
```

**Pour la production**, remplacez les URLs par vos URLs de production.

## 📊 Préparer votre Google Sheet

### Structure requise

Votre Google Sheet doit avoir **deux feuilles** nommées exactement :
- **Clients**
- **Prospects**

### Feuille "Clients"

Les colonnes doivent être dans cet ordre :
1. ID
2. Nom
3. Email
4. Téléphone
5. Entreprise
6. Adresse
7. Notes
8. Apporteur ID
9. Date Création
10. Date Modification

### Feuille "Prospects"

Les colonnes doivent être dans cet ordre :
1. ID
2. Nom
3. Prénom
4. Email
5. Téléphone
6. Poste
7. Client ID
8. Notes
9. Date Création
10. Date Modification

### Créer le Google Sheet

1. Créez un nouveau Google Sheet
2. Renommez la première feuille en "Clients"
3. Ajoutez les en-têtes dans la première ligne
4. Créez une nouvelle feuille nommée "Prospects"
5. Ajoutez les en-têtes dans la première ligne

**Note** : Vous pouvez laisser les lignes vides, le système les remplira automatiquement.

## 🔗 Obtenir le Spreadsheet ID

1. Ouvrez votre Google Sheet
2. Regardez l'URL dans votre navigateur
3. L'URL ressemble à : `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
4. Copiez le **SPREADSHEET_ID** (la partie entre `/d/` et `/edit`)

Exemple :
```
https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
```
Le Spreadsheet ID est : `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`

## 🚀 Utilisation dans le CRM

1. **Connectez-vous** :
   - Allez dans "Google Sheets" dans le menu du CRM
   - Cliquez sur "Se connecter à Google"
   - Autorisez l'application à accéder à vos Google Sheets

2. **Configurez le Spreadsheet** :
   - Collez le Spreadsheet ID que vous avez copié
   - Cliquez sur "Sauvegarder"

3. **Synchronisez** :
   - **Exporter vers Google Sheets** : Envoie les données du CRM vers Google Sheets
   - **Importer depuis Google Sheets** : Charge les données depuis Google Sheets vers le CRM

## 🔄 Synchronisation

### Export (CRM → Google Sheets)
- Toutes les données du CRM sont écrites dans Google Sheets
- Les anciennes données sont remplacées
- Les feuilles "Clients" et "Prospects" sont mises à jour

### Import (Google Sheets → CRM)
- Les données depuis Google Sheets sont chargées dans le CRM
- Les données existantes en mémoire sont remplacées
- La page se recharge automatiquement après l'import

## ⚠️ Notes importantes

1. **Permissions** : Assurez-vous que le compte Google utilisé a les permissions d'écriture sur le Google Sheet
2. **Format des données** : Respectez le format des colonnes pour éviter les erreurs
3. **Sauvegarde** : Faites une sauvegarde de votre Google Sheet avant les grandes synchronisations
4. **Production** : Mettez à jour les URLs de redirection dans Google Cloud Console pour la production

## 🐛 Dépannage

### Erreur "Spreadsheet ID non configuré"
- Assurez-vous d'avoir configuré le Spreadsheet ID dans l'interface

### Erreur "Non authentifié avec Google"
- Reconnectez-vous via le bouton "Se connecter à Google"

### Erreur "Permission denied"
- Vérifiez que le compte Google a bien accès au Google Sheet
- Partagez le Google Sheet avec le compte Google utilisé

### Les données ne s'affichent pas
- Vérifiez que les noms des feuilles sont exactement "Clients" et "Prospects"
- Vérifiez que les en-têtes sont dans le bon ordre
- Vérifiez que le Spreadsheet ID est correct

## 📚 Ressources

- [Documentation Google Sheets API](https://developers.google.com/sheets/api)
- [Guide OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)

