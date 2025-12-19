# 🔐 Configuration de l'Écran de Consentement OAuth

L'erreur **403 : access_denied** signifie que l'URI de redirection est correcte, mais il y a un problème avec l'écran de consentement OAuth ou les permissions.

## ✅ Solution : Configurer l'Écran de Consentement OAuth

### Étape 1 : Accéder à l'Écran de Consentement

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Sélectionnez votre projet
3. **APIs et services** > **Écran de consentement OAuth**

### Étape 2 : Configurer l'Écran de Consentement

#### Si vous n'avez pas encore configuré l'écran :

1. Cliquez sur **"CONFIGURER L'ÉCRAN DE CONSENTEMENT"**
2. **Type d'utilisateur** : 
   - Si vous êtes seul à utiliser l'application : **"Interne"** (nécessite Google Workspace)
   - Sinon : **"Externe"** (recommandé pour la plupart des cas)
3. Cliquez sur **"CRÉER"**

#### Configuration de l'Écran :

1. **Informations sur l'application** :
   - **Nom de l'application** : `CRM Credissimmo` (ou un nom de votre choix)
   - **Email de support utilisateur** : Votre email
   - **Logo de l'application** : Optionnel
   - **Domaine d'accueil de l'application** : `https://crm-credissimmo.onrender.com`
   - **Politique de confidentialité** : Optionnel (peut être vide pour commencer)
   - **Conditions d'utilisation** : Optionnel (peut être vide pour commencer)
   - **Domaines autorisés** : `crm-credissimmo.onrender.com`

2. **Scopes** :
   - Cliquez sur **"AJOUTER OU SUPPRIMER DES SCOPES"**
   - Recherchez et ajoutez :
     - ✅ `https://www.googleapis.com/auth/spreadsheets`
     - ✅ `https://www.googleapis.com/auth/drive.readonly`
   - Cliquez sur **"Mettre à jour"**

3. **Utilisateurs de test** (si l'application est en mode "Test") :
   - Si votre application est en mode "Test", vous devez ajouter les utilisateurs autorisés
   - Cliquez sur **"AJOUTER DES UTILISATEURS"**
   - Ajoutez votre email Google
   - Cliquez sur **"Ajouter"**

4. Cliquez sur **"ENREGISTRER ET CONTINUER"** jusqu'à la fin

### Étape 3 : Publier l'Application (si nécessaire)

Si votre application est en mode "Test" :

1. Dans l'écran de consentement, vous verrez **"PUBLIER L'APPLICATION"**
2. Cliquez dessus
3. Confirmez la publication

**Note** : Pour une application en production, vous devrez peut-être passer par un processus de vérification Google, mais pour un usage personnel, le mode "Test" avec votre email ajouté devrait suffire.

## 🔍 Vérifications

### Vérifier que tout est configuré :

1. **Écran de consentement** :
   - ✅ Type d'utilisateur défini
   - ✅ Nom de l'application rempli
   - ✅ Email de support rempli
   - ✅ Scopes ajoutés (spreadsheets et drive.readonly)

2. **Utilisateurs de test** (si en mode Test) :
   - ✅ Votre email Google est dans la liste

3. **APIs activées** :
   - ✅ Google Sheets API activée
   - ✅ Google Drive API activée

## 🐛 Si l'erreur persiste

### Vérification 1 : Mode de l'application

1. Dans l'écran de consentement, vérifiez le statut :
   - **"En test"** : Vous devez ajouter votre email dans "Utilisateurs de test"
   - **"En production"** : L'application est publique (peut nécessiter une vérification)

### Vérification 2 : Email utilisé

Assurez-vous que vous vous connectez avec le même email Google que celui :
- Ajouté dans "Utilisateurs de test" (si en mode Test)
- Utilisé pour créer le projet Google Cloud

### Vérification 3 : Scopes

Vérifiez que les scopes suivants sont bien ajoutés dans l'écran de consentement :
- `https://www.googleapis.com/auth/spreadsheets`
- `https://www.googleapis.com/auth/drive.readonly`

## 📋 Checklist Complète

Avant de réessayer, vérifiez :

- [ ] L'écran de consentement OAuth est configuré
- [ ] Le nom de l'application est rempli
- [ ] L'email de support est rempli
- [ ] Les scopes `spreadsheets` et `drive.readonly` sont ajoutés
- [ ] Si en mode "Test", votre email est dans "Utilisateurs de test"
- [ ] Google Sheets API est activée
- [ ] Google Drive API est activée
- [ ] Vous vous connectez avec le bon compte Google

## 🚀 Après Configuration

1. Attendez 1-2 minutes pour que les changements soient pris en compte
2. Rechargez la page Google Sheets dans votre CRM
3. Cliquez sur "Se connecter à Google"
4. Vous devriez voir l'écran de consentement Google
5. Acceptez les permissions
6. La connexion devrait fonctionner !

## ⚠️ Note Importante

Si votre application est en mode "Test" et que vous voulez que d'autres utilisateurs puissent se connecter :
- Ajoutez leurs emails dans "Utilisateurs de test"
- OU publiez l'application (peut nécessiter une vérification Google)

Pour un usage personnel, le mode "Test" avec votre email est suffisant.

