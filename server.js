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
let contacts = [];
let opportunites = [];

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

app.post('/api/clients', (req, res) => {
  const { nom, email, telephone, entreprise, adresse, notes } = req.body;
  const nouveauClient = {
    id: uuidv4(),
    nom,
    email,
    telephone,
    entreprise,
    adresse,
    notes,
    dateCreation: new Date().toISOString(),
    dateModification: new Date().toISOString()
  };
  clients.push(nouveauClient);
  res.status(201).json(nouveauClient);
});

app.put('/api/clients/:id', (req, res) => {
  const index = clients.findIndex(c => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Client non trouvé' });
  }
  clients[index] = {
    ...clients[index],
    ...req.body,
    dateModification: new Date().toISOString()
  };
  res.json(clients[index]);
});

app.delete('/api/clients/:id', (req, res) => {
  const index = clients.findIndex(c => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Client non trouvé' });
  }
  clients.splice(index, 1);
  res.json({ message: 'Client supprimé avec succès' });
});

// Routes pour les contacts
app.get('/api/contacts', (req, res) => {
  res.json(contacts);
});

app.get('/api/contacts/:id', (req, res) => {
  const contact = contacts.find(c => c.id === req.params.id);
  if (!contact) {
    return res.status(404).json({ message: 'Contact non trouvé' });
  }
  res.json(contact);
});

app.post('/api/contacts', (req, res) => {
  const { nom, prenom, email, telephone, poste, clientId, notes } = req.body;
  const nouveauContact = {
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
  contacts.push(nouveauContact);
  res.status(201).json(nouveauContact);
});

app.put('/api/contacts/:id', (req, res) => {
  const index = contacts.findIndex(c => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Contact non trouvé' });
  }
  contacts[index] = {
    ...contacts[index],
    ...req.body,
    dateModification: new Date().toISOString()
  };
  res.json(contacts[index]);
});

app.delete('/api/contacts/:id', (req, res) => {
  const index = contacts.findIndex(c => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Contact non trouvé' });
  }
  contacts.splice(index, 1);
  res.json({ message: 'Contact supprimé avec succès' });
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
    statut: statut || 'nouvelle',
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
    totalContacts: contacts.length,
    totalOpportunites: opportunites.length,
    opportunitesParStatut: {
      nouvelle: opportunites.filter(o => o.statut === 'nouvelle').length,
      enCours: opportunites.filter(o => o.statut === 'en_cours').length,
      gagnee: opportunites.filter(o => o.statut === 'gagnee').length,
      perdue: opportunites.filter(o => o.statut === 'perdue').length
    },
    montantTotal: opportunites.reduce((sum, o) => sum + (o.montant || 0), 0),
    montantGagne: opportunites
      .filter(o => o.statut === 'gagnee')
      .reduce((sum, o) => sum + (o.montant || 0), 0)
  };
  res.json(stats);
});

// Routes Outlook (OAuth/Microsoft Graph)
const outlookRoutes = require('./routes/outlook');
app.use('/api/outlook', outlookRoutes);

// Routes IMAP (pour comptes IMAP génériques)
const imapRoutes = require('./routes/imap');
app.use('/api/imap', imapRoutes);

// Servir les fichiers statiques en production
if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  app.use(express.static(path.join(__dirname, 'client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Serveur CRM démarré sur le port ${PORT}`);
});
