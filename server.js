const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? true // Autoriser toutes les origines en production (même domaine)
    : 'http://localhost:3000',
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false
}));

// Stockage en mémoire (à remplacer par une vraie base de données en production)
let clients = [];
let prospects = [];
let opportunites = [];
let apporteurs = [];

// Routes pour les clients
app.get('/api/clients', (req, res) => {
  res.json(clients);
});

app.get('/api/clients/:id', (req, res) => {
  const client = clients.find(c => c.id === req.params.id);
  if (!client) {
    return res.status(404).json({ message: 'Client non trouvé' });
  }
  res.json(client);
});

app.post('/api/clients', async (req, res) => {
  const { nom, email, telephone, entreprise, adresse, notes, apporteurId, etape, courtier, decision } = req.body;
  const nouveauClient = {
    id: uuidv4(),
    nom,
    email,
    telephone,
    entreprise,
    adresse,
    notes,
    apporteurId: apporteurId || null,
    etape: etape || '',
    courtier: courtier || '',
    decision: decision || '',
    dateCreation: new Date().toISOString(),
    dateModification: new Date().toISOString()
  };
  clients.push(nouveauClient);
  
  // Synchroniser automatiquement vers Google Sheets (en arrière-plan)
  autoSyncToGoogleSheets().catch(err => console.error('Sync error:', err));
  
  res.status(201).json(nouveauClient);
});

app.put('/api/clients/:id', async (req, res) => {
  const index = clients.findIndex(c => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Client non trouvé' });
  }
  clients[index] = {
    ...clients[index],
    ...req.body,
    dateModification: new Date().toISOString()
  };
  
  // Synchroniser automatiquement vers Google Sheets (en arrière-plan)
  autoSyncToGoogleSheets().catch(err => console.error('Sync error:', err));
  
  res.json(clients[index]);
});

app.delete('/api/clients/:id', async (req, res) => {
  const index = clients.findIndex(c => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Client non trouvé' });
  }
  clients.splice(index, 1);
  
  // Synchroniser automatiquement vers Google Sheets (en arrière-plan)
  autoSyncToGoogleSheets().catch(err => console.error('Sync error:', err));
  
  res.json({ message: 'Client supprimé avec succès' });
});

// Routes pour les prospects
app.get('/api/prospects', (req, res) => {
  res.json(prospects);
});

app.get('/api/prospects/:id', (req, res) => {
  const prospect = prospects.find(p => p.id === req.params.id);
  if (!prospect) {
    return res.status(404).json({ message: 'Prospect non trouvé' });
  }
  res.json(prospect);
});

app.post('/api/prospects', async (req, res) => {
  const { nom, prenom, email, telephone, poste, clientId, notes } = req.body;
  const nouveauProspect = {
    id: uuidv4(),
    nom,
    prenom,
    email,
    telephone,
    poste,
    clientId,
    notes,
    dateCreation: new Date().toISOString(),
    dateModification: new Date().toISOString()
  };
  prospects.push(nouveauProspect);
  
  // Synchroniser automatiquement vers Google Sheets (en arrière-plan)
  autoSyncToGoogleSheets().catch(err => console.error('Sync error:', err));
  
  res.status(201).json(nouveauProspect);
});

app.put('/api/prospects/:id', async (req, res) => {
  const index = prospects.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Prospect non trouvé' });
  }
  prospects[index] = {
    ...prospects[index],
    ...req.body,
    dateModification: new Date().toISOString()
  };
  
  // Synchroniser automatiquement vers Google Sheets (en arrière-plan)
  autoSyncToGoogleSheets().catch(err => console.error('Sync error:', err));
  
  res.json(prospects[index]);
});

app.delete('/api/prospects/:id', async (req, res) => {
  const index = prospects.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Prospect non trouvé' });
  }
  prospects.splice(index, 1);
  
  // Synchroniser automatiquement vers Google Sheets (en arrière-plan)
  autoSyncToGoogleSheets().catch(err => console.error('Sync error:', err));
  
  res.json({ message: 'Prospect supprimé avec succès' });
});

// Routes pour les opportunités
app.get('/api/opportunites', (req, res) => {
  res.json(opportunites);
});

app.get('/api/opportunites/:id', (req, res) => {
  const opportunite = opportunites.find(o => o.id === req.params.id);
  if (!opportunite) {
    return res.status(404).json({ message: 'Opportunité non trouvée' });
  }
  res.json(opportunite);
});

app.post('/api/opportunites', (req, res) => {
  const { titre, description, montant, statut, clientId, dateEcheance, probabilite } = req.body;
  const nouvelleOpportunite = {
    id: uuidv4(),
    titre,
    description,
    montant: parseFloat(montant) || 0,
    statut: statut || 'prise_contact',
    clientId,
    dateEcheance,
    probabilite: parseInt(probabilite) || 0,
    dateCreation: new Date().toISOString(),
    dateModification: new Date().toISOString()
  };
  opportunites.push(nouvelleOpportunite);
  res.status(201).json(nouvelleOpportunite);
});

app.put('/api/opportunites/:id', (req, res) => {
  const index = opportunites.findIndex(o => o.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Opportunité non trouvée' });
  }
  opportunites[index] = {
    ...opportunites[index],
    ...req.body,
    dateModification: new Date().toISOString()
  };
  res.json(opportunites[index]);
});

app.delete('/api/opportunites/:id', (req, res) => {
  const index = opportunites.findIndex(o => o.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Opportunité non trouvée' });
  }
  opportunites.splice(index, 1);
  res.json({ message: 'Opportunité supprimée avec succès' });
});

// Route pour les statistiques
app.get('/api/stats', (req, res) => {
  const stats = {
    totalClients: clients.length,
    totalProspects: prospects.length,
    totalOpportunites: opportunites.length,
    opportunitesParStatut: {
      prise_contact: opportunites.filter(o => o.statut === 'prise_contact').length,
      qualification: opportunites.filter(o => o.statut === 'qualification').length,
      recherche_financement: opportunites.filter(o => o.statut === 'recherche_financement').length,
      proposition_envoyee: opportunites.filter(o => o.statut === 'proposition_envoyee').length,
      proposition_acceptee: opportunites.filter(o => o.statut === 'proposition_acceptee').length,
      constitution_dossier: opportunites.filter(o => o.statut === 'constitution_dossier').length,
      dossier_envoye_banque: opportunites.filter(o => o.statut === 'dossier_envoye_banque').length,
      instruction_bancaire: opportunites.filter(o => o.statut === 'instruction_bancaire').length,
      accord_principe: opportunites.filter(o => o.statut === 'accord_principe').length,
      offre_pret_recue: opportunites.filter(o => o.statut === 'offre_pret_recue').length,
      offre_acceptee: opportunites.filter(o => o.statut === 'offre_acceptee').length,
      signature: opportunites.filter(o => o.statut === 'signature').length,
      deblocage_fonds: opportunites.filter(o => o.statut === 'deblocage_fonds').length,
      facturation: opportunites.filter(o => o.statut === 'facturation').length,
      annulee: opportunites.filter(o => o.statut === 'annulee').length
    },
    montantTotal: opportunites.reduce((sum, o) => sum + (o.montant || 0), 0),
    montantGagne: opportunites
      .filter(o => o.statut === 'facturation')
      .reduce((sum, o) => sum + (o.montant || 0), 0),
    enCours: opportunites.filter(o => o.statut !== 'facturation' && o.statut !== 'annulee').length
  };
  res.json(stats);
});

// Routes pour les apporteurs d'affaires
app.get('/api/apporteurs', (req, res) => {
  res.json(apporteurs);
});

app.get('/api/apporteurs/:id', (req, res) => {
  const apporteur = apporteurs.find(a => a.id === req.params.id);
  if (!apporteur) {
    return res.status(404).json({ message: 'Apporteur d\'affaires non trouvé' });
  }
  res.json(apporteur);
});

app.post('/api/apporteurs', (req, res) => {
  const { nom, prenom, email, telephone, entreprise, commission, notes } = req.body;
  const nouvelApporteur = {
    id: uuidv4(),
    nom,
    prenom,
    email,
    telephone,
    entreprise,
    commission: parseFloat(commission) || 0,
    notes,
    dateCreation: new Date().toISOString(),
    dateModification: new Date().toISOString()
  };
  apporteurs.push(nouvelApporteur);
  res.status(201).json(nouvelApporteur);
});

app.put('/api/apporteurs/:id', (req, res) => {
  const index = apporteurs.findIndex(a => a.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Apporteur d\'affaires non trouvé' });
  }
  apporteurs[index] = {
    ...apporteurs[index],
    ...req.body,
    dateModification: new Date().toISOString()
  };
  res.json(apporteurs[index]);
});

app.delete('/api/apporteurs/:id', (req, res) => {
  const index = apporteurs.findIndex(a => a.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Apporteur d\'affaires non trouvé' });
  }
  // Retirer l'apporteur des clients associés
  clients.forEach(client => {
    if (client.apporteurId === req.params.id) {
      client.apporteurId = null;
    }
  });
  apporteurs.splice(index, 1);
  res.json({ message: 'Apporteur d\'affaires supprimé avec succès' });
});

// Routes Outlook (OAuth/Microsoft Graph)
const outlookRoutes = require('./routes/outlook');
app.use('/api/outlook', outlookRoutes);

// Routes IMAP (pour comptes IMAP génériques)
const imapRoutes = require('./routes/imap');
app.use('/api/imap', imapRoutes);

// Routes Google Sheets
const googleSheetsRoutes = require('./routes/googlesheets');
const syncToGoogleSheets = googleSheetsRoutes.syncToGoogleSheets;
const loadFromGoogleSheets = googleSheetsRoutes.loadFromGoogleSheets;

// Injecter le store d'apporteurs dans googlesheets pour la synchronisation
googleSheetsRoutes.setApporteursStore(() => apporteurs);

// Injecter les fonctions de mise à jour des stores pour la synchronisation
googleSheetsRoutes.setDataStores(
  (newClients) => { clients = newClients; },
  (newProspects) => { prospects = newProspects; }
);

app.use('/api/googlesheets', googleSheetsRoutes);

// Fonction helper pour synchroniser automatiquement vers Google Sheets (en arrière-plan)
async function autoSyncToGoogleSheets() {
  try {
    await syncToGoogleSheets(clients, prospects);
  } catch (error) {
    // Ignorer les erreurs de synchronisation pour ne pas bloquer les opérations
    console.error('Erreur synchronisation automatique (non bloquante):', error.message);
  }
}

// Fonction pour charger les données depuis Google Sheets au démarrage
async function loadDataFromGoogleSheets() {
  try {
    const result = await loadFromGoogleSheets();
    if (result.success && (result.clients.length > 0 || result.prospects.length > 0)) {
      clients = result.clients;
      prospects = result.prospects;
      console.log(`📥 Données chargées depuis Google Sheets : ${clients.length} clients, ${prospects.length} prospects`);
    } else if (result.reason === 'not_connected') {
      console.log('ℹ️ Google Sheets non connecté - démarrage avec données vides');
    }
  } catch (error) {
    console.error('Erreur lors du chargement des données depuis Google Sheets:', error);
  }
}

// Servir les fichiers statiques en production
if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  app.use(express.static(path.join(__dirname, 'client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

// Charger les données depuis Google Sheets au démarrage (si connecté)
loadDataFromGoogleSheets().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Serveur CRM démarré sur le port ${PORT}`);
  });
}).catch((error) => {
  console.error('Erreur lors du chargement initial:', error);
  // Démarrer quand même le serveur même si le chargement échoue
  app.listen(PORT, () => {
    console.log(`🚀 Serveur CRM démarré sur le port ${PORT} (sans chargement depuis Google Sheets)`);
  });
});
