# 📊 Guide : Import Excel pour synchroniser vos données

Ce guide vous explique comment utiliser la fonctionnalité d'import Excel pour synchroniser vos clients, apporteurs et courtiers.

## 🎯 Fonctionnalités

L'import Excel permet de :
- ✅ **Importer des clients** depuis Excel
- ✅ **Créer automatiquement les apporteurs** s'ils n'existent pas
- ✅ **Lier les courtiers** aux clients
- ✅ **Mettre à jour les clients existants** ou en créer de nouveaux
- ✅ **Gérer les villes/localisations**

## 📋 Format du fichier Excel

### Colonnes requises

| Colonne | Description | Obligatoire |
|---------|------------|-------------|
| **Client** | Nom complet du client (ex: "Dupont Jean") | ✅ Oui |
| **Ville** ou **Localisation** | Ville du client | ❌ Non |
| **Apporteur** | Nom de l'apporteur d'affaires | ❌ Non |
| **Courtier** | Nom du courtier en charge | ❌ Non |

### Colonnes optionnelles

| Colonne | Description |
|---------|------------|
| **Email** | Email du client |
| **Téléphone** | Téléphone du client |
| **Étape** | Étape du dossier |
| **Décision** | Décision |
| **Notes** | Commentaires |

### Exemple de fichier Excel

```
| Client          | Ville  | Apporteur      | Courtier    | Email              | Téléphone   |
|-----------------|--------|----------------|-------------|--------------------|-------------|
| Dupont Jean     | Paris  | Martin Pierre  | Nom Courtier| jean@example.com   | 0123456789  |
| Durand Marie    | Lyon   | Martin Pierre  | Autre Court | marie@example.com  | 0987654321  |
```

## 🚀 Comment utiliser

### Étape 1 : Accéder à l'import

1. Connectez-vous à votre CRM
2. Allez dans le menu **"Intégrations"**
3. Cliquez sur **"Import Excel"**

### Étape 2 : Télécharger le template (optionnel)

1. Cliquez sur **"Télécharger le template Excel"**
2. Un fichier `template-import-crm.xlsx` sera téléchargé
3. Ouvrez-le dans Excel
4. Remplissez avec vos données

### Étape 3 : Préparer votre fichier Excel

1. **Ouvrez Excel** (ou Google Sheets, puis exportez en .xlsx)
2. **Créez un en-tête** avec les colonnes (voir format ci-dessus)
3. **Remplissez les données** :
   - Au minimum, la colonne **Client** est obligatoire
   - Les autres colonnes sont optionnelles
4. **Sauvegardez** en format `.xlsx`, `.xls` ou `.xlsm`

### Étape 4 : Importer

1. Cliquez sur **"Choisir un fichier Excel"**
2. Sélectionnez votre fichier
3. Cliquez sur **"Importer le fichier"**
4. Attendez le traitement (quelques secondes)

### Étape 5 : Vérifier les résultats

Vous verrez un résumé :
- ✅ Nombre de clients créés
- 🔄 Nombre de clients mis à jour
- 👥 Nombre d'apporteurs créés
- ❌ Liste des erreurs (si applicable)

## 🔄 Logique de synchronisation

### Clients

- **Si le client existe** (même nom + prénom) : **Mise à jour**
- **Si le client n'existe pas** : **Création**

### Apporteurs

- **Si l'apporteur existe** : Utilisation de l'existant
- **Si l'apporteur n'existe pas** : **Création automatique**

### Courtiers

- **Si le courtier existe** (dans les utilisateurs) : Liaison automatique
- **Si le courtier n'existe pas** : Le champ "courtier" est sauvegardé comme texte

## 📝 Notes importantes

### Noms de colonnes flexibles

Les noms de colonnes sont **insensibles à la casse** et acceptent plusieurs variantes :

- **Client** = `Client`, `client`, `CLIENT`, `Nom`, `nom`
- **Ville** = `Ville`, `ville`, `Localisation`, `localisation`, `Adresse`, `adresse`
- **Apporteur** = `Apporteur`, `apporteur`
- **Courtier** = `Courtier`, `courtier`, `Courtier en charge`, `courtier en charge`
- **Email** = `Email`, `email`
- **Téléphone** = `Téléphone`, `telephone`, `Tel`, `tel`
- **Étape** = `Étape`, `etape`, `Statut`, `statut`
- **Décision** = `Décision`, `decision`
- **Notes** = `Notes`, `notes`, `Commentaire`, `commentaire`

### Format des noms

- **Client** : Peut être "Prénom Nom" ou "Nom Prénom" (le système détecte automatiquement)
- **Apporteur** : Même logique
- **Courtier** : Doit correspondre exactement au nom d'un utilisateur existant

### Limites

- **Taille maximale** : 10 MB
- **Formats acceptés** : `.xlsx`, `.xls`, `.xlsm`
- **Pas de limite** sur le nombre de lignes (mais plus c'est long, plus ça prend du temps)

## 🆘 Résolution de problèmes

### Erreur : "Format de fichier non supporté"
- ✅ Utilisez `.xlsx`, `.xls` ou `.xlsm`
- ❌ Évitez `.csv` (convertissez-le d'abord en Excel)

### Erreur : "Le fichier est trop volumineux"
- ✅ Réduisez la taille du fichier (max 10 MB)
- ✅ Divisez en plusieurs fichiers si nécessaire

### Erreur : "Nom client manquant"
- ✅ Vérifiez que la colonne "Client" contient des données
- ✅ Vérifiez que l'en-tête est bien "Client" (ou variante)

### Les courtiers ne sont pas liés
- ✅ Vérifiez que le nom du courtier correspond exactement à un utilisateur existant
- ✅ Créez d'abord les utilisateurs dans le CRM si nécessaire

### Les apporteurs ne sont pas créés
- ✅ Vérifiez que la colonne "Apporteur" contient des données
- ✅ Les apporteurs sont créés automatiquement s'ils n'existent pas

## 💡 Astuces

1. **Testez d'abord avec quelques lignes** avant d'importer un gros fichier
2. **Utilisez le template** pour être sûr du format
3. **Vérifiez les noms de colonnes** (même si flexibles, utilisez les noms standards)
4. **Sauvegardez votre fichier Excel** avant l'import (au cas où)
5. **Vérifiez les résultats** après l'import pour détecter les erreurs

## ✅ Exemple complet

### Fichier Excel

```
Client          | Ville  | Apporteur      | Courtier    | Email              | Téléphone   | Étape        | Notes
----------------|--------|----------------|-------------|--------------------|-------------|--------------|------------------
Dupont Jean     | Paris  | Martin Pierre  | Nom Courtier| jean@example.com   | 0123456789  | En cours     | Client intéressé
Durand Marie    | Lyon   | Martin Pierre  | Autre Court | marie@example.com  | 0987654321  | Qualification| À relancer
```

### Résultat attendu

- ✅ 2 clients créés/mis à jour
- ✅ 1 apporteur créé (Martin Pierre)
- ✅ 2 courtiers liés (si les utilisateurs existent)

---

## 🎉 C'est tout !

Vous pouvez maintenant synchroniser facilement vos données depuis Excel vers votre CRM.

