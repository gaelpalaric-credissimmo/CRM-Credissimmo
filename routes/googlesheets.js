const express = require('express');
const { google } = require('googleapis');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

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
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.status(500).json({ 
      error: 'Configuration Google OAuth manquante. Veuillez configurer GOOGLE_CLIENT_ID et GOOGLE_CLIENT_SECRET dans les variables d\'environnement.' 
    });
  }

  const scopes = [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive.readonly'
  ];

  // Construire l'URL de redirection correcte
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || 
    (process.env.NODE_ENV === 'production' 
      ? `${req.protocol}://${req.get('host')}/api/googlesheets/callback`
      : 'http://localhost:5000/api/googlesheets/callback');

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
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || 
      (process.env.NODE_ENV === 'production' 
        ? `${req.protocol}://${req.get('host')}/api/googlesheets/callback`
        : 'http://localhost:5000/api/googlesheets/callback');

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
  res.json({
    connected: !!googleTokens.access_token,
    spreadsheetId: spreadsheetId
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

// Lire les clients depuis Google Sheets
router.get('/clients', async (req, res) => {
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

// Écrire les clients vers Google Sheets
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

    const values = clients.map(client => [
      client.id || '',
      client.nom || '',
      client.email || '',
      client.telephone || '',
      client.entreprise || '',
      client.adresse || '',
      client.notes || '',
      client.apporteurId || '',
      client.dateCreation || new Date().toISOString(),
      client.dateModification || new Date().toISOString()
    ]);

    const header = [['ID', 'Nom', 'Email', 'Téléphone', 'Entreprise', 'Adresse', 'Notes', 'Apporteur ID', 'Date Création', 'Date Modification']];

    try {
      await sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range: 'Clients!A1',
      });
    } catch (error) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: spreadsheetId,
        range: 'Clients!A1:J1',
        valueInputOption: 'RAW',
        resource: { values: header }
      });
    }

    await sheets.spreadsheets.values.clear({
      spreadsheetId: spreadsheetId,
      range: 'Clients!A2:Z1000',
    });

    if (values.length > 0) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: spreadsheetId,
        range: 'Clients!A2',
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

    // Lire clients et prospects
    const [clientsResponse, prospectsResponse] = await Promise.all([
      sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range: 'Clients!A2:Z',
      }).catch(() => ({ data: { values: [] } })),
      sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range: 'Prospects!A2:Z',
      }).catch(() => ({ data: { values: [] } }))
    ]);

    const clients = (clientsResponse.data.values || []).map((row) => ({
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

    const prospects = (prospectsResponse.data.values || []).map((row) => ({
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
    })).filter(prospect => prospect.nom || prospect.email);

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

