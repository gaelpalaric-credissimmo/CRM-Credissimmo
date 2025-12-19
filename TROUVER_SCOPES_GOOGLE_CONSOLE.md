# 🔍 Comment Trouver les Scopes dans Google Cloud Console

Si vous ne trouvez pas "Scopes" dans Google Cloud Console, voici comment les localiser.

## 📍 Méthode 1 : Via l'Écran de Consentement OAuth

### Étape 1 : Accéder à l'Écran de Consentement

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. **Sélectionnez votre projet**
3. Dans le menu de gauche, cliquez sur **"APIs et services"**
4. Cliquez sur **"Écran de consentement OAuth"**

### Étape 2 : Modifier l'Écran de Consentement

1. Si l'écran n'est pas encore configuré :
   - Cliquez sur **"CONFIGURER L'ÉCRAN DE CONSENTEMENT"**
   - Sélectionnez **"Externe"** comme type d'utilisateur
   - Cliquez sur **"CRÉER"**

2. Si l'écran est déjà configuré :
   - Cliquez sur **"MODIFIER L'APPLICATION"** (bouton en haut à droite)
   - OU cliquez sur **"Modifier"** à côté du nom de l'application

### Étape 3 : Trouver les Scopes (Portées)

Les scopes peuvent être appelés différemment selon la langue :

**En français :**
- **"Portées"** (c'est le terme français pour "Scopes")
- Cherchez un onglet ou une section appelée **"Portées"**

**En anglais :**
- **"Scopes"**
- Cherchez un onglet ou une section appelée **"Scopes"**

### Étape 4 : Navigation dans l'Écran de Consentement

L'écran de consentement a plusieurs étapes. Les scopes sont généralement dans :

1. **Étape 1** : Informations sur l'application
2. **Étape 2** : **Scopes** ou **Portées** ← **C'EST ICI !**
3. **Étape 3** : Utilisateurs de test
4. **Étape 4** : Résumé

### Si vous êtes dans l'Étape 1 :

1. Remplissez les informations de base :
   - Nom de l'application
   - Email de support
   - Domaine d'accueil : `https://crm-credissimmo.onrender.com`
2. Cliquez sur **"ENREGISTRER ET CONTINUER"** en bas
3. Vous arriverez à l'**Étape 2** qui contient les **Scopes/Portées**

### Dans l'Étape 2 (Scopes/Portées) :

1. Vous verrez un bouton : **"AJOUTER OU SUPPRIMER DES SCOPES"** ou **"AJOUTER OU SUPPRIMER DES PORTÉES"**
2. Cliquez dessus
3. Une fenêtre s'ouvre avec une liste de scopes
4. Dans la barre de recherche, tapez : `spreadsheets`
5. Cochez : **`https://www.googleapis.com/auth/spreadsheets`**
6. Dans la barre de recherche, tapez : `drive.readonly`
7. Cochez : **`https://www.googleapis.com/auth/drive.readonly`**
8. Cliquez sur **"Mettre à jour"** ou **"Update"** en bas
9. Cliquez sur **"ENREGISTRER ET CONTINUER"**

## 📍 Méthode 2 : Vérifier les Scopes Actuels

Si vous voulez juste voir quels scopes sont déjà configurés :

1. **APIs et services** > **Écran de consentement OAuth**
2. Regardez la section **"Portées"** ou **"Scopes"** (souvent affichée directement sur la page)
3. Vous devriez voir une liste des scopes configurés

## 📍 Méthode 3 : Si l'Écran de Consentement n'Existe Pas

Si vous ne voyez pas d'écran de consentement du tout :

1. **APIs et services** > **Écran de consentement OAuth**
2. Cliquez sur **"CONFIGURER L'ÉCRAN DE CONSENTEMENT"**
3. Sélectionnez **"Externe"**
4. Cliquez sur **"CRÉER"**
5. Suivez les étapes :
   - Étape 1 : Informations
   - **Étape 2 : Scopes/Portées** ← Ajoutez les scopes ici
   - Étape 3 : Utilisateurs de test
   - Étape 4 : Résumé

## 🔍 Recherche Visuelle

Dans l'interface Google Cloud Console, cherchez :

- Un onglet ou un bouton avec le texte : **"Scopes"**, **"Portées"**, **"OAuth scopes"**, ou **"Portées OAuth"**
- Un bouton : **"AJOUTER OU SUPPRIMER DES SCOPES"** ou **"AJOUTER OU SUPPRIMER DES PORTÉES"**
- Une section qui liste les permissions demandées par l'application

## 📋 Checklist : Où Chercher

- [ ] **APIs et services** > **Écran de consentement OAuth** > **Modifier l'application** > **Étape 2**
- [ ] Cherchez un onglet appelé **"Scopes"** ou **"Portées"**
- [ ] Cherchez un bouton **"AJOUTER OU SUPPRIMER DES SCOPES"**
- [ ] Si vous voyez plusieurs étapes, allez à l'**Étape 2**

## 🆘 Si Vous Ne Trouvez Toujours Pas

### Option A : Créer un Nouvel Écran de Consentement

1. **APIs et services** > **Écran de consentement OAuth**
2. Si un écran existe déjà, notez ses informations
3. Supprimez-le (si possible) ou créez-en un nouveau
4. Suivez le processus de création étape par étape
5. À l'**Étape 2**, vous verrez forcément les scopes

### Option B : Vérifier la Langue

1. En haut à droite de Google Cloud Console, vérifiez la langue
2. Si c'est en français, cherchez **"Portées"**
3. Si c'est en anglais, cherchez **"Scopes"**

### Option C : Utiliser la Recherche

1. Dans Google Cloud Console, utilisez la barre de recherche en haut
2. Tapez : **"scopes"** ou **"portées"**
3. Les résultats devraient vous montrer où se trouvent les scopes

## 📸 Indicateurs Visuels

Quand vous êtes au bon endroit, vous devriez voir :

- Une liste de permissions/scopes avec des cases à cocher
- Des scopes comme :
  - `.../auth/userinfo.email`
  - `.../auth/userinfo.profile`
  - `.../auth/spreadsheets` ← **Celui que vous cherchez**
  - `.../auth/drive.readonly` ← **Celui que vous cherchez**
- Un bouton "Mettre à jour" ou "Update" en bas

## ✅ Une Fois les Scopes Trouvés

1. Cochez : `https://www.googleapis.com/auth/spreadsheets`
2. Cochez : `https://www.googleapis.com/auth/drive.readonly`
3. Cliquez sur **"Mettre à jour"**
4. Continuez jusqu'à la fin de la configuration
5. Attendez 2-3 minutes
6. Réessayez la connexion

