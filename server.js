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
let rappels = [];

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

// ============================================
// SYSTÈME DE RAPPELS AUTOMATIQUES
// ============================================

// Types de rappels disponibles
const TYPES_RAPPELS = {
  ECHEANCE_APPROCHANT: 'echeance_approchant',
  ECHEANCE_AUJOURDHUI: 'echeance_aujourdhui',
  STATUT_BLOQUE: 'statut_bloque',
  RELANCE_PROPOSITION: 'relance_proposition',
  RELANCE_INSTRUCTION: 'relance_instruction',
  PAS_DE_CONTACT: 'pas_de_contact',
  SIGNATURE_APPROCHANT: 'signature_approchant',
  DEBLOCAGE_APPROCHANT: 'deblocage_approchant',
  FACTURATION_A_FAIRE: 'facturation_a_faire',
  DOCUMENTS_MANQUANTS: 'documents_manquants',
};

// Configuration des délais (en jours)
const CONFIG_RAPPELS = {
  ECHEANCE_AVANT: 7, // Rappel 7 jours avant l'échéance
  ECHEANCE_URGENT: 3, // Rappel urgent 3 jours avant
  STATUT_BLOQUE_JOURS: 5, // Rappel si statut inchangé depuis 5 jours
  RELANCE_PROPOSITION_JOURS: 3, // Relance après 3 jours sans réponse
  RELANCE_INSTRUCTION_JOURS: 7, // Relance instruction après 7 jours
  PAS_DE_CONTACT_JOURS: 14, // Rappel si pas de contact depuis 14 jours
  SIGNATURE_AVANT: 3, // Rappel 3 jours avant signature
  DEBLOCAGE_AVANT: 3, // Rappel 3 jours avant déblocage
  DOCUMENTS_DELAI: 5, // Rappel documents après 5 jours en constitution
};

// Fonction pour générer automatiquement les rappels
function genererRappelsAutomatiques() {
  const nouveauxRappels = [];
  const maintenant = new Date();
  
  // Parcourir toutes les opportunités
  opportunites.forEach(opportunite => {
    if (opportunite.statut === 'annulee') return;
    
    const client = clients.find(c => c.id === opportunite.clientId);
    if (!client) return;
    
    // 1. Rappel date d'échéance approchant
    if (opportunite.dateEcheance) {
      const dateEcheance = new Date(opportunite.dateEcheance);
      const joursRestants = Math.ceil((dateEcheance - maintenant) / (1000 * 60 * 60 * 24));
      
      if (joursRestants === 0) {
        // Échéance aujourd'hui
        if (!rappels.find(r => r.opportuniteId === opportunite.id && r.type === TYPES_RAPPELS.ECHEANCE_AUJOURDHUI && !r.resolu)) {
          nouveauxRappels.push({
            id: uuidv4(),
            type: TYPES_RAPPELS.ECHEANCE_AUJOURDHUI,
            titre: `Échéance aujourd'hui - ${opportunite.titre}`,
            description: `L'échéance de l'opportunité "${opportunite.titre}" est aujourd'hui.`,
            priorite: 'urgente',
            opportuniteId: opportunite.id,
            clientId: opportunite.clientId,
            dateCreation: maintenant.toISOString(),
            resolu: false
          });
        }
      } else if (joursRestants > 0 && joursRestants <= CONFIG_RAPPELS.ECHEANCE_URGENT) {
        // Échéance dans 3 jours ou moins
        if (!rappels.find(r => r.opportuniteId === opportunite.id && r.type === TYPES_RAPPELS.ECHEANCE_APPROCHANT && !r.resolu)) {
          nouveauxRappels.push({
            id: uuidv4(),
            type: TYPES_RAPPELS.ECHEANCE_APPROCHANT,
            titre: `Échéance dans ${joursRestants} jour(s) - ${opportunite.titre}`,
            description: `L'échéance de l'opportunité "${opportunite.titre}" approche (${joursRestants} jour(s)).`,
            priorite: 'haute',
            opportuniteId: opportunite.id,
            clientId: opportunite.clientId,
            dateCreation: maintenant.toISOString(),
            resolu: false
          });
        }
      } else if (joursRestants > CONFIG_RAPPELS.ECHEANCE_URGENT && joursRestants <= CONFIG_RAPPELS.ECHEANCE_AVANT) {
        // Échéance dans 7 jours
        if (!rappels.find(r => r.opportuniteId === opportunite.id && r.type === TYPES_RAPPELS.ECHEANCE_APPROCHANT && !r.resolu)) {
          nouveauxRappels.push({
            id: uuidv4(),
            type: TYPES_RAPPELS.ECHEANCE_APPROCHANT,
            titre: `Échéance dans ${joursRestants} jour(s) - ${opportunite.titre}`,
            description: `L'échéance de l'opportunité "${opportunite.titre}" approche (${joursRestants} jour(s)).`,
            priorite: 'moyenne',
            opportuniteId: opportunite.id,
            clientId: opportunite.clientId,
            dateCreation: maintenant.toISOString(),
            resolu: false
          });
        }
      }
    }
    
    // 2. Rappel statut bloqué (pas de changement depuis X jours)
    if (opportunite.dateModification) {
      const dateModif = new Date(opportunite.dateModification);
      const joursSansModif = Math.floor((maintenant - dateModif) / (1000 * 60 * 60 * 24));
      
      if (joursSansModif >= CONFIG_RAPPELS.STATUT_BLOQUE_JOURS) {
        const statutInfo = getStatutInfo(opportunite.statut);
        if (!rappels.find(r => r.opportuniteId === opportunite.id && r.type === TYPES_RAPPELS.STATUT_BLOQUE && !r.resolu)) {
          nouveauxRappels.push({
            id: uuidv4(),
            type: TYPES_RAPPELS.STATUT_BLOQUE,
            titre: `Statut bloqué - ${opportunite.titre}`,
            description: `L'opportunité "${opportunite.titre}" est restée au statut "${statutInfo.label}" depuis ${joursSansModif} jours.`,
            priorite: 'moyenne',
            opportuniteId: opportunite.id,
            clientId: opportunite.clientId,
            dateCreation: maintenant.toISOString(),
            resolu: false
          });
        }
      }
    }
    
    // 3. Relance proposition envoyée
    if (opportunite.statut === 'proposition_envoyee' && opportunite.dateModification) {
      const dateModif = new Date(opportunite.dateModification);
      const joursDepuisEnvoi = Math.floor((maintenant - dateModif) / (1000 * 60 * 60 * 24));
      
      if (joursDepuisEnvoi >= CONFIG_RAPPELS.RELANCE_PROPOSITION_JOURS) {
        if (!rappels.find(r => r.opportuniteId === opportunite.id && r.type === TYPES_RAPPELS.RELANCE_PROPOSITION && !r.resolu)) {
          nouveauxRappels.push({
            id: uuidv4(),
            type: TYPES_RAPPELS.RELANCE_PROPOSITION,
            titre: `Relance proposition - ${opportunite.titre}`,
            description: `La proposition pour "${opportunite.titre}" a été envoyée il y a ${joursDepuisEnvoi} jours. Pensez à relancer le client.`,
            priorite: 'haute',
            opportuniteId: opportunite.id,
            clientId: opportunite.clientId,
            dateCreation: maintenant.toISOString(),
            resolu: false
          });
        }
      }
    }
    
    // 4. Relance instruction bancaire
    if (opportunite.statut === 'instruction_bancaire' && opportunite.dateModification) {
      const dateModif = new Date(opportunite.dateModification);
      const joursDepuisEnvoi = Math.floor((maintenant - dateModif) / (1000 * 60 * 60 * 24));
      
      if (joursDepuisEnvoi >= CONFIG_RAPPELS.RELANCE_INSTRUCTION_JOURS) {
        if (!rappels.find(r => r.opportuniteId === opportunite.id && r.type === TYPES_RAPPELS.RELANCE_INSTRUCTION && !r.resolu)) {
          nouveauxRappels.push({
            id: uuidv4(),
            type: TYPES_RAPPELS.RELANCE_INSTRUCTION,
            titre: `Relance instruction bancaire - ${opportunite.titre}`,
            description: `L'instruction bancaire pour "${opportunite.titre}" est en cours depuis ${joursDepuisEnvoi} jours. Pensez à relancer la banque.`,
            priorite: 'haute',
            opportuniteId: opportunite.id,
            clientId: opportunite.clientId,
            dateCreation: maintenant.toISOString(),
            resolu: false
          });
        }
      }
    }
    
    // 5. Documents manquants (constitution dossier depuis trop longtemps)
    if (opportunite.statut === 'constitution_dossier' && opportunite.dateModification) {
      const dateModif = new Date(opportunite.dateModification);
      const joursDepuisDebut = Math.floor((maintenant - dateModif) / (1000 * 60 * 60 * 24));
      
      if (joursDepuisDebut >= CONFIG_RAPPELS.DOCUMENTS_DELAI) {
        if (!rappels.find(r => r.opportuniteId === opportunite.id && r.type === TYPES_RAPPELS.DOCUMENTS_MANQUANTS && !r.resolu)) {
          nouveauxRappels.push({
            id: uuidv4(),
            type: TYPES_RAPPELS.DOCUMENTS_MANQUANTS,
            titre: `Documents manquants - ${opportunite.titre}`,
            description: `La constitution du dossier pour "${opportunite.titre}" dure depuis ${joursDepuisDebut} jours. Vérifiez les documents manquants.`,
            priorite: 'haute',
            opportuniteId: opportunite.id,
            clientId: opportunite.clientId,
            dateCreation: maintenant.toISOString(),
            resolu: false
          });
        }
      }
    }
    
    // 6. Facturation à faire (après déblocage)
    if (opportunite.statut === 'deblocage_fonds') {
      if (!rappels.find(r => r.opportuniteId === opportunite.id && r.type === TYPES_RAPPELS.FACTURATION_A_FAIRE && !r.resolu)) {
        nouveauxRappels.push({
          id: uuidv4(),
          type: TYPES_RAPPELS.FACTURATION_A_FAIRE,
          titre: `Facturation à faire - ${opportunite.titre}`,
          description: `Les fonds ont été débloqués pour "${opportunite.titre}". Pensez à facturer.`,
          priorite: 'haute',
          opportuniteId: opportunite.id,
          clientId: opportunite.clientId,
          dateCreation: maintenant.toISOString(),
          resolu: false
        });
      }
    }
  });
  
  // 7. Pas de contact depuis X jours (pour tous les clients actifs)
  clients.forEach(client => {
    if (client.dateModification) {
      const dateModif = new Date(client.dateModification);
      const joursSansContact = Math.floor((maintenant - dateModif) / (1000 * 60 * 60 * 24));
      
      // Vérifier si le client a des opportunités actives
      const opportunitesActives = opportunites.filter(o => 
        o.clientId === client.id && o.statut !== 'annulee' && o.statut !== 'facturation'
      );
      
      if (opportunitesActives.length > 0 && joursSansContact >= CONFIG_RAPPELS.PAS_DE_CONTACT_JOURS) {
        if (!rappels.find(r => r.clientId === client.id && r.type === TYPES_RAPPELS.PAS_DE_CONTACT && !r.resolu)) {
          nouveauxRappels.push({
            id: uuidv4(),
            type: TYPES_RAPPELS.PAS_DE_CONTACT,
            titre: `Pas de contact depuis ${joursSansContact} jours - ${client.nom}`,
            description: `Aucun contact avec ${client.nom} depuis ${joursSansContact} jours. ${opportunitesActives.length} opportunité(s) active(s).`,
            priorite: 'moyenne',
            clientId: client.id,
            dateCreation: maintenant.toISOString(),
            resolu: false
          });
        }
      }
    }
  });
  
  // Ajouter les nouveaux rappels
  nouveauxRappels.forEach(rappel => {
    if (!rappels.find(r => r.id === rappel.id)) {
      rappels.push(rappel);
    }
  });
  
  return nouveauxRappels;
}

// Fonction helper pour obtenir les infos d'un statut
function getStatutInfo(statut) {
  const statuts = {
    'prise_contact': { label: 'Prise de contact', order: 1 },
    'qualification': { label: 'Qualification / Analyse', order: 2 },
    'recherche_financement': { label: 'Recherche de financement', order: 3 },
    'proposition_envoyee': { label: 'Proposition envoyée', order: 4 },
    'proposition_acceptee': { label: 'Proposition acceptée', order: 5 },
    'constitution_dossier': { label: 'Constitution du dossier', order: 6 },
    'dossier_envoye_banque': { label: 'Dossier envoyé à la banque', order: 7 },
    'instruction_bancaire': { label: 'Instruction bancaire', order: 8 },
    'accord_principe': { label: 'Accord de principe obtenu', order: 9 },
    'offre_pret_recue': { label: 'Offre de prêt reçue', order: 10 },
    'offre_acceptee': { label: 'Offre acceptée par le client', order: 11 },
    'signature': { label: 'Signature', order: 12 },
    'deblocage_fonds': { label: 'Déblocage des fonds', order: 13 },
    'facturation': { label: 'Facturation', order: 14 },
    'annulee': { label: 'Annulée', order: 99 }
  };
  return statuts[statut] || { label: statut, order: 0 };
}

// Routes pour les rappels
app.get('/api/rappels', (req, res) => {
  const { resolu } = req.query;
  let rappelsFiltres = [...rappels];
  
  if (resolu === 'false') {
    rappelsFiltres = rappelsFiltres.filter(r => !r.resolu);
  } else if (resolu === 'true') {
    rappelsFiltres = rappelsFiltres.filter(r => r.resolu);
  }
  
  // Trier par priorité et date
  rappelsFiltres.sort((a, b) => {
    const prioriteOrder = { 'urgente': 0, 'haute': 1, 'moyenne': 2, 'basse': 3 };
    if (prioriteOrder[a.priorite] !== prioriteOrder[b.priorite]) {
      return prioriteOrder[a.priorite] - prioriteOrder[b.priorite];
    }
    return new Date(b.dateCreation) - new Date(a.dateCreation);
  });
  
  res.json(rappelsFiltres);
});

app.post('/api/rappels/generer', (req, res) => {
  const nouveauxRappels = genererRappelsAutomatiques();
  res.json({ 
    message: `${nouveauxRappels.length} nouveau(x) rappel(s) généré(s)`,
    rappels: nouveauxRappels 
  });
});

app.put('/api/rappels/:id/resoudre', (req, res) => {
  const index = rappels.findIndex(r => r.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Rappel non trouvé' });
  }
  rappels[index].resolu = true;
  rappels[index].dateResolution = new Date().toISOString();
  res.json(rappels[index]);
});

app.delete('/api/rappels/:id', (req, res) => {
  const index = rappels.findIndex(r => r.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Rappel non trouvé' });
  }
  rappels.splice(index, 1);
  res.json({ message: 'Rappel supprimé avec succès' });
});

// Générer les rappels automatiquement toutes les heures
setInterval(() => {
  genererRappelsAutomatiques();
}, 60 * 60 * 1000); // Toutes les heures

// Générer les rappels au démarrage
setTimeout(() => {
  genererRappelsAutomatiques();
}, 5000); // Après 5 secondes

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
