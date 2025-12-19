# 🚨 Solution Définitive - Erreur 403 : access_denied

Si vous avez l'erreur **403 : access_denied** avec l'URI correcte, c'est que l'écran de consentement OAuth n'est pas correctement configuré.

## ✅ Solution Étape par Étape

### Étape 1 : Accéder à l'Écran de Consentement

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. **Sélectionnez votre projet** (celui avec le Client ID : `940073400054-hinmu63i12lk1448ro26ajmr7nj2uhqa`)
3. Dans le menu de gauche : **"APIs et services"** > **"Écran de consentement OAuth"**

### Étape 2 : Vérifier/Configurer l'Écran de Consentement

#### Si vous voyez "CONFIGURER L'ÉCRAN DE CONSENTEMENT" :

1. Cliquez sur **"CONFIGURER L'ÉCRAN DE CONSENTEMENT"**
2. **Type d'utilisateur** : Sélectionnez **"Externe"** (recommandé)
3. Cliquez sur **"CRÉER"**

#### Configuration de l'Écran (Étape 1 : Informations sur l'application) :

1. **Nom de l'application** : `CRM Credissimmo` (ou un nom de votre choix)
2. **Email de support utilisateur** : Votre email Google
3. **Logo de l'application** : Optionnel (laissez vide pour l'instant)
4. **Domaine d'accueil de l'application** : `https://crm-credissimmo.onrender.com`
5. **Politique de confidentialité** : Laissez vide pour l'instant
6. **Conditions d'utilisation** : Laissez vide pour l'instant
7. **Domaines autorisés** : Cliquez sur **"Ajouter un domaine"** et ajoutez : `crm-credissimmo.onrender.com`
8. Cliquez sur **"ENREGISTRER ET CONTINUER"**

#### Configuration de l'Écran (Étape 2 : Scopes/Portées) :

**⚠️ CRITIQUE : Cette étape est essentielle !**

**Note :** Les scopes peuvent être appelés **"Scopes"** (en anglais) ou **"Portées"** (en français).

1. Si vous ne voyez pas "Scopes" ou "Portées", vous êtes peut-être encore à l'Étape 1
   - Remplissez les informations de base (nom, email, domaine)
   - Cliquez sur **"ENREGISTRER ET CONTINUER"** pour aller à l'Étape 2

2. Dans l'Étape 2, cherchez :
   - Un onglet ou section appelé **"Scopes"** ou **"Portées"**
   - Un bouton **"AJOUTER OU SUPPRIMER DES SCOPES"** ou **"AJOUTER OU SUPPRIMER DES PORTÉES"**

3. Cliquez sur **"AJOUTER OU SUPPRIMER DES SCOPES"** (ou "Portées")

4. Dans la barre de recherche, tapez : `spreadsheets`
5. Cochez : **`https://www.googleapis.com/auth/spreadsheets`**

6. Dans la barre de recherche, tapez : `drive.readonly`
7. Cochez : **`https://www.googleapis.com/auth/drive.readonly`**

8. Cliquez sur **"Mettre à jour"** ou **"Update"** en bas

9. Cliquez sur **"ENREGISTRER ET CONTINUER"**

**Si vous ne trouvez toujours pas les scopes, consultez TROUVER_SCOPES_GOOGLE_CONSOLE.md pour un guide détaillé.**

#### Configuration de l'Écran (Étape 3 : Utilisateurs de test) :

**⚠️ IMPORTANT : Si votre application est en mode "Test"**

1. Cliquez sur **"AJOUTER DES UTILISATEURS"**
2. Entrez **votre email Google** (celui que vous utilisez pour vous connecter)
3. Cliquez sur **"Ajouter"**
4. Cliquez sur **"ENREGISTRER ET CONTINUER"**

#### Configuration de l'Écran (Étape 4 : Résumé) :

1. Vérifiez que tout est correct
2. Cliquez sur **"RETOUR AU TABLEAU DE BORD"**

### Étape 3 : Publier l'Application (si en mode Test)

1. Dans l'écran de consentement, vous verrez le statut : **"En test"** ou **"En production"**
2. Si c'est **"En test"** :
   - Vérifiez que votre email est dans "Utilisateurs de test"
   - Vous pouvez soit :
     - **Option A** : Laisser en mode "Test" et vous connecter avec votre email (recommandé pour usage personnel)
     - **Option B** : Cliquer sur **"PUBLIER L'APPLICATION"** pour la rendre publique

### Étape 4 : Vérifier les APIs Activées

1. Dans Google Cloud Console, allez dans **"APIs et services"** > **"Bibliothèque"**
2. Recherchez **"Google Sheets API"**
3. Si elle n'est pas activée, cliquez dessus puis sur **"Activer"**
4. Recherchez **"Google Drive API"**
5. Si elle n'est pas activée, cliquez dessus puis sur **"Activer"**

## ✅ Checklist de Vérification

Avant de réessayer, vérifiez que :

- [ ] L'écran de consentement OAuth est configuré (pas juste créé, mais complètement configuré)
- [ ] Le nom de l'application est rempli
- [ ] L'email de support est rempli
- [ ] Les scopes suivants sont **AJOUTÉS** dans l'écran de consentement :
  - [ ] `https://www.googleapis.com/auth/spreadsheets`
  - [ ] `https://www.googleapis.com/auth/drive.readonly`
- [ ] Si en mode "Test", votre email est dans "Utilisateurs de test"
- [ ] Google Sheets API est activée
- [ ] Google Drive API est activée
- [ ] Vous vous connectez avec le même email Google que celui ajouté dans "Utilisateurs de test"

## 🔍 Vérification Rapide

Pour vérifier que tout est bien configuré :

1. Dans Google Cloud Console > **"APIs et services"** > **"Écran de consentement OAuth"**
2. Vous devriez voir :
   - ✅ Statut : "En test" ou "En production"
   - ✅ Nom de l'application : Rempli
   - ✅ Email de support : Rempli
   - ✅ Scopes : Au moins 2 scopes (spreadsheets et drive.readonly)
   - ✅ Utilisateurs de test : Votre email (si en mode Test)

## 🚀 Après Configuration

1. **Attendez 2-3 minutes** pour que les changements soient pris en compte
2. **Videz le cache de votre navigateur** (Ctrl+Shift+Delete)
3. Rechargez la page Google Sheets dans votre CRM
4. Cliquez sur "Se connecter à Google"
5. Vous devriez voir l'écran de consentement Google avec les permissions demandées
6. Acceptez les permissions
7. La connexion devrait fonctionner !

## 🐛 Si l'Erreur Persiste

### Vérification 1 : Email Utilisé

Assurez-vous que vous vous connectez avec le **même email Google** que :
- Celui utilisé pour créer le projet Google Cloud
- Celui ajouté dans "Utilisateurs de test" (si en mode Test)

### Vérification 2 : Scopes Manquants

1. Retournez dans l'écran de consentement
2. Cliquez sur "Modifier l'application"
3. Allez dans "Scopes"
4. Vérifiez que les deux scopes sont bien cochés :
   - `https://www.googleapis.com/auth/spreadsheets`
   - `https://www.googleapis.com/auth/drive.readonly`
5. Si ce n'est pas le cas, ajoutez-les

### Vérification 3 : Mode de l'Application

Si votre application est en mode "Test" :
- Vous **DEVEZ** ajouter votre email dans "Utilisateurs de test"
- OU publier l'application (peut nécessiter une vérification Google)

### Vérification 4 : APIs Non Activées

1. **APIs et services** > **"Bibliothèque"**
2. Vérifiez que ces APIs sont **"Activées"** :
   - Google Sheets API
   - Google Drive API
3. Si elles ne sont pas activées, activez-les

## 📸 Aide Visuelle

Si vous avez besoin d'aide visuelle, Google Cloud Console affiche des indicateurs :
- ✅ Vert = Configuré
- ⚠️ Jaune = À configurer
- ❌ Rouge = Erreur

Assurez-vous que tous les éléments de l'écran de consentement sont en vert.

## 🆘 Solution de Dernier Recours

Si rien ne fonctionne après avoir tout vérifié :

1. **Supprimez complètement l'écran de consentement** (si possible)
2. **Recréez-le** en suivant exactement les étapes ci-dessus
3. **Attendez 5 minutes** après la création
4. **Réessayez**

Ou contactez le support Google Cloud si le problème persiste.

