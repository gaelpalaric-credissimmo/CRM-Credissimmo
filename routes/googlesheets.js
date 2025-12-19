const express = require('express');
const { google } = require('googleapis');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// Référence vers les apporteurs (sera injectée depuis server.js)
let getApporteursStore = () => [];

// Fonction pour injecter le store d'apporteurs
router.setApporteursStore = (getter) => {
  getApporteursStore = getter;
};

// Configuration OAuth2 Google
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5000/api/googlesheets/callback'
);

// Stockage des tokens (en production, utiliser une base de données)
let googleTokens = {};
let spreadsheetId = null;

// Route pour initier la connexion Google
router.get('/auth', (req, res) => {
  // Vérifier que les identifiants sont configurés
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const nodeEnv = process.env.NODE_ENV;
  const frontendUrl = process.env.FRONTEND_URL;
  
  // Construire l'URL de redirection correcte
  // PRIORITÉ : Utiliser GOOGLE_REDIRECT_URI si défini, sinon construire automatiquement
  let redirectUri = process.env.GOOGLE_REDIRECT_URI;
  
  if (!redirectUri) {
    // Construction automatique si non défini
    if (process.env.NODE_ENV === 'production') {
      // En production, utiliser le host de la requête
      const host = req.get('host');
      redirectUri = `https://${host}/api/googlesheets/callback`;
    } else {
      redirectUri = 'http://localhost:5000/api/googlesheets/callback';
    }
  }
  
  // Log détaillé pour le diagnostic
  console.log('🔍 Diagnostic Google OAuth:', {
    GOOGLE_CLIENT_ID: clientId ? `✅ Présent (${clientId.substring(0, 10)}...)` : '❌ MANQUANT',
    GOOGLE_CLIENT_SECRET: clientSecret ? '✅ Présent' : '❌ MANQUANT',
    GOOGLE_REDIRECT_URI_ENV: process.env.GOOGLE_REDIRECT_URI || 'Non défini',
    REDIRECT_URI_UTILISEE: redirectUri,
    NODE_ENV: nodeEnv || 'Non défini',
    FRONTEND_URL: frontendUrl || 'Non configuré',
    Host: req.get('host'),
    Protocol: req.protocol,
    '⚠️ IMPORTANT': 'L\'URI de redirection utilisée doit correspondre EXACTEMENT à celle dans Google Cloud Console'
  });
  
  if (!clientId || !clientSecret) {
    const errorDetails = {
      GOOGLE_CLIENT_ID: clientId ? '✅ Configuré' : '❌ NON CONFIGURÉ',
      GOOGLE_CLIENT_SECRET: clientSecret ? '✅ Configuré' : '❌ NON CONFIGURÉ',
      GOOGLE_REDIRECT_URI: redirectUri || 'Non configuré (optionnel)',
      NODE_ENV: nodeEnv || 'Non défini',
      Host: req.get('host'),
      Protocol: req.protocol
    };
    
    console.error('❌ ERREUR: Variables d\'environnement Google OAuth manquantes');
    console.error('Détails:', errorDetails);
    
    return res.status(500).json({ 
      error: 'Configuration Google OAuth manquante. Veuillez configurer GOOGLE_CLIENT_ID et GOOGLE_CLIENT_SECRET dans les variables d\'environnement sur Render.',
      details: errorDetails,
      instructions: [
        '1. Allez sur https://dashboard.render.com',
        '2. Sélectionnez votre service backend',
        '3. Cliquez sur "Environment" dans le menu',
        '4. Ajoutez GOOGLE_CLIENT_ID et GOOGLE_CLIENT_SECRET',
        '5. (Optionnel) Ajoutez GOOGLE_REDIRECT_URI avec votre URL Render',
        '6. Attendez le redéploiement automatique',
        '7. Rechargez la page'
      ]
    });
  }

  const scopes = [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive.readonly'
  ];

  // Recréer le client OAuth avec l'URI correcte
  const client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    redirectUri
  );

  const authUrl = client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent',
    include_granted_scopes: true
  });

  console.log('🔗 URL d\'authentification générée:', {
    redirectUri: redirectUri,
    authUrl: authUrl.substring(0, 100) + '...',
    '⚠️ Vérifiez que cette URI correspond à celle dans Google Cloud Console': redirectUri
  });

  res.json({ authUrl, redirectUri });
});

// Callback après authentification
router.get('/callback', async (req, res) => {
  const { code, error, error_description } = req.query;

  if (error) {
    const errorMsg = error_description || error;
    console.error('Erreur OAuth:', error, error_description);
    return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/googlesheets?error=${encodeURIComponent(errorMsg)}`);
  }

  if (!code) {
    return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/googlesheets?error=${encodeURIComponent('Code d\'autorisation manquant')}`);
  }

  try {
    // Reconstruire le client OAuth avec la même URI de redirection
    // IMPORTANT : Utiliser exactement la même logique que dans /auth
    let redirectUri = process.env.GOOGLE_REDIRECT_URI;
    
    if (!redirectUri) {
      if (process.env.NODE_ENV === 'production') {
        const host = req.get('host');
        redirectUri = `https://${host}/api/googlesheets/callback`;
      } else {
        redirectUri = 'http://localhost:5000/api/googlesheets/callback';
      }
    }
    
    console.log('🔄 Callback OAuth - URI de redirection utilisée:', redirectUri);

    const client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      redirectUri
    );

    const { tokens } = await client.getToken(code);
    googleTokens = tokens;
    oauth2Client.setCredentials(tokens);

    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/googlesheets?success=true`);
  } catch (error) {
    console.error('Erreur lors de l\'obtention du token:', error);
    const errorMsg = error.message || 'Erreur d\'authentification';
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/googlesheets?error=${encodeURIComponent(errorMsg)}`);
  }
});

// Obtenir un client OAuth valide
function getAuthClient() {
  if (!googleTokens.access_token) {
    throw new Error('Non authentifié avec Google');
  }
  oauth2Client.setCredentials(googleTokens);
  return oauth2Client;
}

// Vérifier le statut de connexion
router.get('/status', (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;
  const nodeEnv = process.env.NODE_ENV;
  const frontendUrl = process.env.FRONTEND_URL;
  
  // Log pour diagnostic
  console.log('📊 Statut Google Sheets demandé:', {
    connected: !!googleTokens.access_token,
    hasClientId: !!clientId,
    hasClientSecret: !!clientSecret,
    hasRedirectUri: !!redirectUri,
    nodeEnv: nodeEnv,
    host: req.get('host')
  });
  
  res.json({
    connected: !!googleTokens.access_token,
    spreadsheetId: spreadsheetId,
    config: {
      hasClientId: !!clientId,
      hasClientSecret: !!clientSecret,
      hasRedirectUri: !!redirectUri,
      redirectUri: redirectUri || (nodeEnv === 'production' 
        ? `${req.protocol}://${req.get('host')}/api/googlesheets/callback`
        : 'http://localhost:5000/api/googlesheets/callback'),
      nodeEnv: nodeEnv || 'Non défini',
      frontendUrl: frontendUrl || 'Non configuré'
    }
  });
});

// Configurer le spreadsheet ID
router.post('/config', (req, res) => {
  const { spreadsheetId: newSpreadsheetId } = req.body;
  if (!newSpreadsheetId) {
    return res.status(400).json({ error: 'Spreadsheet ID requis' });
  }
  spreadsheetId = newSpreadsheetId;
  res.json({ success: true, spreadsheetId });
});

// Lire les prospects depuis Google Sheets
router.get('/prospects', async (req, res) => {
  try {
    const auth = getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth });

    if (!spreadsheetId) {
      return res.status(400).json({ error: 'Spreadsheet ID non configuré' });
    }

    // Lire la feuille "Prospects" (ou la première feuille)
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: 'Prospects!A2:Z', // A2 pour ignorer l'en-tête
    });

    const rows = response.data.values || [];
    const prospects = rows.map((row, index) => ({
      id: row[0] || uuidv4(),
      nom: row[1] || '',
      prenom: row[2] || '',
      email: row[3] || '',
      telephone: row[4] || '',
      poste: row[5] || '',
      clientId: row[6] || '',
      notes: row[7] || '',
      dateCreation: row[8] || new Date().toISOString(),
      dateModification: row[9] || new Date().toISOString()
    })).filter(prospect => prospect.nom || prospect.email); // Filtrer les lignes vides

    res.json(prospects);
  } catch (error) {
    console.error('Erreur lors de la lecture des prospects:', error);
    res.status(500).json({ error: error.message });
  }
});

// Écrire les prospects vers Google Sheets
router.post('/prospects/sync', async (req, res) => {
  try {
    const auth = getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth });

    if (!spreadsheetId) {
      return res.status(400).json({ error: 'Spreadsheet ID non configuré' });
    }

    const { prospects } = req.body;
    if (!prospects || !Array.isArray(prospects)) {
      return res.status(400).json({ error: 'Liste de prospects requise' });
    }

    // Préparer les données pour Google Sheets
    const values = prospects.map(prospect => [
      prospect.id || '',
      prospect.nom || '',
      prospect.prenom || '',
      prospect.email || '',
      prospect.telephone || '',
      prospect.poste || '',
      prospect.clientId || '',
      prospect.notes || '',
      prospect.dateCreation || new Date().toISOString(),
      prospect.dateModification || new Date().toISOString()
    ]);

    // Ajouter l'en-tête si la feuille est vide
    const header = [['ID', 'Nom', 'Prénom', 'Email', 'Téléphone', 'Poste', 'Client ID', 'Notes', 'Date Création', 'Date Modification']];

    // Vérifier si la feuille existe
    try {
      await sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range: 'Prospects!A1',
      });
    } catch (error) {
      // Créer la feuille avec l'en-tête
      await sheets.spreadsheets.values.update({
        spreadsheetId: spreadsheetId,
        range: 'Prospects!A1:J1',
        valueInputOption: 'RAW',
        resource: { values: header }
      });
    }

    // Effacer les anciennes données (sauf l'en-tête)
    await sheets.spreadsheets.values.clear({
      spreadsheetId: spreadsheetId,
      range: 'Prospects!A2:Z1000',
    });

    // Écrire les nouvelles données
    if (values.length > 0) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: spreadsheetId,
        range: 'Prospects!A2',
        valueInputOption: 'RAW',
        resource: { values }
      });
    }

    res.json({ success: true, count: prospects.length });
  } catch (error) {
    console.error('Erreur lors de l\'écriture des prospects:', error);
    res.status(500).json({ error: error.message });
  }
});

// Lire les clients depuis Google Sheets (structure standard)
router.get('/clients/standard', async (req, res) => {
  try {
    const auth = getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth });

    if (!spreadsheetId) {
      return res.status(400).json({ error: 'Spreadsheet ID non configuré' });
    }

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: 'Clients!A2:Z',
    });

    const rows = response.data.values || [];
    const clients = rows.map((row) => ({
      id: row[0] || uuidv4(),
      nom: row[1] || '',
      email: row[2] || '',
      telephone: row[3] || '',
      entreprise: row[4] || '',
      adresse: row[5] || '',
      notes: row[6] || '',
      apporteurId: row[7] || null,
      dateCreation: row[8] || new Date().toISOString(),
      dateModification: row[9] || new Date().toISOString()
    })).filter(client => client.nom || client.email);

    res.json(clients);
  } catch (error) {
    console.error('Erreur lors de la lecture des clients:', error);
    res.status(500).json({ error: error.message });
  }
});

// Écrire les clients vers Google Sheets (structure existante)
router.post('/clients/sync', async (req, res) => {
  try {
    const auth = getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth });

    if (!spreadsheetId) {
      return res.status(400).json({ error: 'Spreadsheet ID non configuré' });
    }

    const { clients } = req.body;
    if (!clients || !Array.isArray(clients)) {
      return res.status(400).json({ error: 'Liste de clients requise' });
    }

    // Mapper vers la structure existante : Client | Étape | Localisation | Apporteur | Courtier | Décision | Commentaire
    const apporteursStore = getApporteursStore();
    const values = clients.map(client => {
      const nomComplet = client.prenom ? `${client.prenom} ${client.nom}` : client.nom;
      // Trouver le nom de l'apporteur à partir de son ID
      let apporteurNom = '';
      if (client.apporteurId && apporteursStore.length > 0) {
        const apporteur = apporteursStore.find(a => a.id === client.apporteurId);
        apporteurNom = apporteur ? `${apporteur.prenom || ''} ${apporteur.nom || ''}`.trim() : client.apporteurNom || '';
      } else if (client.apporteurNom) {
        apporteurNom = client.apporteurNom;
      }
      
      return [
        nomComplet || '', // Client
        client.etape || '', // Étape
        client.adresse || '', // Localisation
        apporteurNom, // Apporteur (nom de l'apporteur)
        client.courtier || '', // Courtier
        client.decision || '', // Décision
        client.notes || '' // Commentaire
      ];
    });

    // Vérifier si l'en-tête existe, sinon le créer
    try {
      await sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range: 'A1',
      });
    } catch (error) {
      // Créer l'en-tête si la feuille est vide
      const header = [['Client', 'Étape', 'Localisation', 'Apporteur', 'Courtier', 'Décision', 'Tt Commentaire']];
      await sheets.spreadsheets.values.update({
        spreadsheetId: spreadsheetId,
        range: 'A1:G1',
        valueInputOption: 'RAW',
        resource: { values: header }
      });
    }

    // Effacer les anciennes données (sauf l'en-tête)
    await sheets.spreadsheets.values.clear({
      spreadsheetId: spreadsheetId,
      range: 'A2:Z1000',
    });

    // Écrire les nouvelles données
    if (values.length > 0) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: spreadsheetId,
        range: 'A2',
        valueInputOption: 'RAW',
        resource: { values }
      });
    }

    res.json({ success: true, count: clients.length });
  } catch (error) {
    console.error('Erreur lors de l\'écriture des clients:', error);
    res.status(500).json({ error: error.message });
  }
});

// Synchronisation complète (lire depuis Google Sheets et mettre à jour le CRM)
router.post('/sync/all', async (req, res) => {
  try {
    const auth = getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth });

    if (!spreadsheetId) {
      return res.status(400).json({ error: 'Spreadsheet ID non configuré' });
    }

    // Lire clients depuis la structure existante (première feuille)
    const clientsResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: 'A2:Z',
    }).catch(() => ({ data: { values: [] } }));

    const rows = clientsResponse.data.values || [];
    const clients = rows.map((row) => {
      // Mapper la structure existante : Client | Étape | Localisation | Apporteur | Courtier | Décision | Commentaire
      const nomComplet = row[0] || '';
      const [prenom, ...nomParts] = nomComplet.split(' ');
      const nom = nomParts.join(' ') || prenom;
      
      return {
        id: uuidv4(),
        nom: nom || nomComplet,
        prenom: prenom || '',
        email: '',
        telephone: '',
        entreprise: '',
        adresse: row[2] || '', // Localisation
        notes: row[6] || '', // Commentaire
        apporteurId: null, // Sera mappé depuis Apporteur
        apporteurNom: row[3] || '', // Apporteur
        etape: row[1] || '', // Étape
        courtier: row[4] || '', // Courtier
        decision: row[5] || '', // Décision
        dateCreation: new Date().toISOString(),
        dateModification: new Date().toISOString()
      };
    }).filter(client => client.nom);

    // Pour les prospects, on peut créer une liste vide ou utiliser une autre logique
    const prospects = [];

    res.json({ clients, prospects, success: true });
  } catch (error) {
    console.error('Erreur lors de la synchronisation:', error);
    res.status(500).json({ error: error.message });
  }
});

// Déconnexion
router.post('/disconnect', (req, res) => {
  googleTokens = {};
  spreadsheetId = null;
  res.json({ message: 'Déconnecté avec succès' });
});

module.exports = router;

