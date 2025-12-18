# Configuration de l'intégration Outlook

Ce guide vous explique comment configurer l'intégration Outlook avec votre CRM.

## 📋 Prérequis

- Un compte Microsoft (Outlook, Office 365, ou Azure AD)
- Accès au portail Azure (https://portal.azure.com)

## 🔧 Configuration Azure AD

### Étape 1 : Créer une application Azure AD

1. Connectez-vous au [portail Azure](https://portal.azure.com)
2. Allez dans **Azure Active Directory** > **App registrations** > **New registration**
3. Remplissez le formulaire :
   - **Name** : CRM Outlook Integration (ou un nom de votre choix)
   - **Supported account types** : 
     - Pour un usage personnel : "Accounts in any organizational directory and personal Microsoft accounts"
     - Pour un usage professionnel : "Accounts in this organizational directory only"
   - **Redirect URI** : 
     - Type : Web
     - URI : `http://localhost:5000/api/outlook/callback`
4. Cliquez sur **Register**

### Étape 2 : Obtenir les identifiants

Après la création de l'application :

1. Notez l'**Application (client) ID** - c'est votre `MICROSOFT_CLIENT_ID`
2. Allez dans **Certificates & secrets** > **New client secret**
3. Créez un secret :
   - **Description** : CRM Secret
   - **Expires** : Choisissez une durée (24 mois recommandé)
4. **IMPORTANT** : Copiez immédiatement la **Value** du secret - c'est votre `MICROSOFT_CLIENT_SECRET` (vous ne pourrez plus la voir après)
5. Notez le **Tenant ID** (visible dans la page Overview) - c'est votre `MICROSOFT_TENANT_ID` (ou utilisez "common" pour les comptes personnels)

### Étape 3 : Configurer les permissions API

1. Allez dans **API permissions** > **Add a permission**
2. Sélectionnez **Microsoft Graph**
3. Sélectionnez **Delegated permissions**
4. Ajoutez les permissions suivantes :
   - `User.Read` - Lire le profil de l'utilisateur
   - `Contacts.Read` - Lire les contacts
   - `Calendars.Read` - Lire le calendrier
   - `Mail.Read` - Lire les emails
5. Cliquez sur **Add permissions**
6. **IMPORTANT** : Si vous utilisez un compte personnel, certaines permissions peuvent nécessiter un consentement administrateur. Pour un usage personnel, vous pouvez ignorer cette étape.

### Étape 4 : Configurer le fichier .env

Ouvrez le fichier `.env` à la racine du projet et remplissez les valeurs :

```env
MICROSOFT_CLIENT_ID=votre_client_id_ici
MICROSOFT_CLIENT_SECRET=votre_client_secret_ici
MICROSOFT_TENANT_ID=common
REDIRECT_URI=http://localhost:5000/api/outlook/callback
SESSION_SECRET=une_cle_secrete_aleatoire_pour_les_sessions
```

**Exemple :**
```env
MICROSOFT_CLIENT_ID=12345678-1234-1234-1234-123456789abc
MICROSOFT_CLIENT_SECRET=abc~DEF123ghi456JKL789mno012PQR345stu678
MICROSOFT_TENANT_ID=common
REDIRECT_URI=http://localhost:5000/api/outlook/callback
SESSION_SECRET=ma_cle_secrete_tres_longue_et_aleatoire_123456789
```

### Étape 5 : Installer les dépendances

```bash
npm install
```

### Étape 6 : Démarrer l'application

```bash
# Terminal 1 - Serveur
npm run dev

# Terminal 2 - Client
npm run client
```

## 🚀 Utilisation

1. Accédez à l'application : `http://localhost:3000`
2. Cliquez sur **Outlook** dans le menu de navigation
3. Cliquez sur **Se connecter à Outlook**
4. Connectez-vous avec votre compte Microsoft
5. Acceptez les permissions demandées
6. Vous serez redirigé vers l'application et connecté

## ✨ Fonctionnalités disponibles

Une fois connecté, vous pouvez :

- **Synchroniser les contacts** : Importez vos contacts Outlook dans le CRM
- **Voir les emails récents** : Consultez vos derniers emails
- **Voir le calendrier** : Affichez vos événements Outlook
- **Filtrer par client** : Recherchez les emails d'un client spécifique

## 🔒 Sécurité

- Ne partagez jamais votre `MICROSOFT_CLIENT_SECRET`
- Ne commitez pas le fichier `.env` dans Git (il est déjà dans `.gitignore`)
- En production, utilisez des variables d'environnement sécurisées
- Changez le `SESSION_SECRET` pour une valeur aléatoire forte

## 🐛 Dépannage

### Erreur "Invalid client"
- Vérifiez que le `MICROSOFT_CLIENT_ID` est correct
- Vérifiez que l'application Azure AD est bien créée

### Erreur "Invalid redirect URI"
- Vérifiez que l'URI de redirection dans Azure correspond exactement à celui dans `.env`
- L'URI doit être `http://localhost:5000/api/outlook/callback` (pas de slash final)

### Erreur "Insufficient privileges"
- Vérifiez que les permissions API sont bien configurées dans Azure
- Pour un compte personnel, certaines permissions peuvent ne pas être disponibles

### Le token expire
- Le système rafraîchit automatiquement les tokens
- Si cela ne fonctionne pas, déconnectez-vous et reconnectez-vous

## 📝 Notes

- Les tokens sont stockés en mémoire et seront perdus au redémarrage du serveur
- Pour la production, stockez les tokens dans une base de données sécurisée
- L'URI de redirection doit correspondre exactement à celui configuré dans Azure AD
- Pour la production, changez `REDIRECT_URI` vers votre domaine de production

## 🔗 Ressources

- [Documentation Microsoft Graph](https://docs.microsoft.com/graph/overview)
- [Portail Azure](https://portal.azure.com)
- [OAuth 2.0 avec Microsoft](https://docs.microsoft.com/azure/active-directory/develop/v2-oauth2-auth-code-flow)
