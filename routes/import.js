const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const Client = require('../models/Client');
const Apporteur = require('../models/Apporteur');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

router.use(authenticate);

// Configuration multer pour l'upload de fichiers
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10 MB max
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'application/vnd.ms-excel.sheet.macroEnabled.12' // .xlsm
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Format de fichier non supporté. Utilisez .xlsx, .xls ou .xlsm'));
    }
  }
});

// Fonction helper pour trouver ou créer un apporteur
async function findOrCreateApporteur(nomComplet, req) {
  if (!nomComplet || nomComplet.trim() === '') return null;

  const [prenom, ...nomParts] = nomComplet.trim().split(' ');
  const nom = nomParts.join(' ') || prenom;

  // Chercher par nom complet ou nom seul
  let apporteur = await Apporteur.findOne({
    $or: [
      { nom: nom, prenom: prenom || '' },
      { nom: nomComplet },
      { $expr: { $eq: [{ $concat: ['$prenom', ' ', '$nom'] }, nomComplet] } }
    ]
  });

  if (!apporteur) {
    // Créer un nouvel apporteur
    apporteur = new Apporteur({
      nom: nom,
      prenom: prenom || '',
      dateCreation: new Date()
    });
    await apporteur.save();
  }

  return apporteur._id;
}

// Fonction helper pour trouver un courtier (User)
async function findCourtier(nomComplet) {
  if (!nomComplet || nomComplet.trim() === '') return null;

  const [prenom, ...nomParts] = nomComplet.trim().split(' ');
  const nom = nomParts.join(' ') || prenom;

  // Chercher par nom complet
  const courtier = await User.findOne({
    $or: [
      { nom: nom, prenom: prenom || '' },
      { nom: nomComplet },
      { $expr: { $eq: [{ $concat: ['$prenom', ' ', '$nom'] }, nomComplet] } }
    ],
    role: { $in: ['commercial', 'manager', 'admin'] }
  });

  return courtier ? courtier._id : null;
}

// Route d'import Excel
router.post('/excel', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier fourni' });
    }

    // Parser le fichier Excel
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0]; // Première feuille
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet, { 
      defval: '', // Valeur par défaut pour les cellules vides
      raw: false // Convertir les dates en strings
    });

    if (data.length === 0) {
      return res.status(400).json({ error: 'Le fichier Excel est vide' });
    }

    const results = {
      clients: { created: 0, updated: 0, errors: [] },
      apporteurs: { created: 0, errors: [] },
      totalRows: data.length
    };

    // Traiter chaque ligne
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const rowNum = i + 2; // +2 car ligne 1 = en-tête, i commence à 0

      try {
        // Mapper les colonnes Excel vers les champs du modèle
        // Format attendu (colonnes flexibles) :
        // - Client (nom complet ou séparé)
        // - Apporteur
        // - Ville / Localisation / Adresse
        // - Courtier
        // - Email, Téléphone, etc. (optionnels)

        const nomComplet = (row['Client'] || row['client'] || row['Nom'] || row['nom'] || '').toString().trim();
        if (!nomComplet) {
          results.clients.errors.push(`Ligne ${rowNum}: Nom client manquant`);
          continue;
        }

        // Séparer nom et prénom
        const [prenom, ...nomParts] = nomComplet.split(' ');
        const nom = nomParts.join(' ') || prenom;

        // Récupérer les autres champs
        const ville = (row['Ville'] || row['ville'] || row['Localisation'] || row['localisation'] || row['Adresse'] || row['adresse'] || '').toString().trim();
        const apporteurNom = (row['Apporteur'] || row['apporteur'] || '').toString().trim();
        const courtierNom = (row['Courtier'] || row['courtier'] || row['Courtier en charge'] || row['courtier en charge'] || '').toString().trim();
        const email = (row['Email'] || row['email'] || '').toString().trim();
        const telephone = (row['Téléphone'] || row['telephone'] || row['Tel'] || row['tel'] || '').toString().trim();
        const etape = (row['Étape'] || row['etape'] || row['Statut'] || row['statut'] || '').toString().trim();
        const decision = (row['Décision'] || row['decision'] || '').toString().trim();
        const notes = (row['Notes'] || row['notes'] || row['Commentaire'] || row['commentaire'] || '').toString().trim();

        // Trouver ou créer l'apporteur
        let apporteurId = null;
        if (apporteurNom) {
          apporteurId = await findOrCreateApporteur(apporteurNom, req);
          if (apporteurId) {
            results.apporteurs.created++;
          }
        }

        // Trouver le courtier
        let commercialId = null;
        if (courtierNom) {
          commercialId = await findCourtier(courtierNom);
          if (!commercialId && req.user.role === 'admin') {
            // Si admin, on peut créer le courtier automatiquement
            // Sinon, on laisse null
          }
        }

        // Si pas de courtier trouvé, utiliser l'utilisateur connecté (sauf admin)
        if (!commercialId && req.user.role !== 'admin') {
          commercialId = req.user._id;
        }

        // Chercher si le client existe déjà (par nom et prénom)
        let client = await Client.findOne({
          nom: nom,
          prenom: prenom || ''
        });

        const clientData = {
          nom,
          prenom: prenom || '',
          email: email || undefined,
          telephone: telephone || undefined,
          adresse: ville || undefined,
          apporteurId: apporteurId || undefined,
          apporteurNom: apporteurNom || undefined,
          commercialId: commercialId || undefined,
          courtier: courtierNom || undefined,
          etape: etape || undefined,
          decision: decision || undefined,
          notes: notes || undefined,
          dateModification: new Date()
        };

        if (client) {
          // Mettre à jour le client existant
          Object.assign(client, clientData);
          await client.save();
          results.clients.updated++;
        } else {
          // Créer un nouveau client
          client = new Client({
            ...clientData,
            dateCreation: new Date()
          });
          await client.save();
          results.clients.created++;
        }

      } catch (error) {
        results.clients.errors.push(`Ligne ${rowNum}: ${error.message}`);
        console.error(`Erreur ligne ${rowNum}:`, error);
      }
    }

    res.json({
      success: true,
      message: `Import terminé : ${results.clients.created} clients créés, ${results.clients.updated} clients mis à jour, ${results.apporteurs.created} apporteurs créés`,
      results
    });

  } catch (error) {
    console.error('Erreur lors de l\'import Excel:', error);
    res.status(500).json({ 
      error: 'Erreur lors de l\'import Excel',
      details: error.message 
    });
  }
});

// Route pour obtenir un template Excel
router.get('/template', authenticate, (req, res) => {
  try {
    // Créer un workbook avec un template
    const templateData = [
      {
        'Client': 'Dupont Jean',
        'Ville': 'Paris',
        'Apporteur': 'Martin Pierre',
        'Courtier': 'Nom Courtier',
        'Email': 'jean.dupont@example.com',
        'Téléphone': '0123456789',
        'Étape': 'En cours',
        'Décision': 'En attente',
        'Notes': 'Commentaires...'
      }
    ];

    const worksheet = xlsx.utils.json_to_sheet(templateData);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Clients');

    // Générer le buffer
    const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=template-import-crm.xlsx');
    res.send(buffer);

  } catch (error) {
    console.error('Erreur lors de la génération du template:', error);
    res.status(500).json({ error: 'Erreur lors de la génération du template' });
  }
});

module.exports = router;

