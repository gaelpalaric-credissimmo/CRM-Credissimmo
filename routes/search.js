const express = require('express');
const Client = require('../models/Client');
const Prospect = require('../models/Prospect');
const Opportunite = require('../models/Opportunite');
const Apporteur = require('../models/Apporteur');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

router.use(authenticate);

router.get('/', async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 2) {
      return res.json({ clients: [], prospects: [], opportunites: [], apporteurs: [] });
    }

    const searchRegex = { $regex: q, $options: 'i' };
    let clientQuery = {
      $or: [
        { nom: searchRegex },
        { prenom: searchRegex },
        { email: searchRegex },
        { entreprise: searchRegex }
      ]
    };

    let prospectQuery = {
      $or: [
        { nom: searchRegex },
        { prenom: searchRegex },
        { email: searchRegex },
        { entreprise: searchRegex }
      ]
    };

    // Filtrer par commercial si pas admin/manager
    if (req.user.role !== 'admin' && req.user.role !== 'manager') {
      clientQuery.commercialId = req.user._id;
      prospectQuery.commercialId = req.user._id;
    }

    const [clients, prospects, opportunites, apporteurs] = await Promise.all([
      Client.find(clientQuery)
        .select('nom prenom email telephone entreprise')
        .limit(10),
      Prospect.find(prospectQuery)
        .select('nom prenom email telephone entreprise statut')
        .limit(10),
      Opportunite.find({
        $or: [
          { numero: searchRegex },
          { notes: searchRegex }
        ],
        ...(req.user.role !== 'admin' && req.user.role !== 'manager' 
          ? { commercialId: req.user._id } 
          : {})
      })
        .select('numero montant statut')
        .populate('clientId', 'nom prenom')
        .populate('prospectId', 'nom prenom')
        .limit(10),
      Apporteur.find({
        $or: [
          { nom: searchRegex },
          { prenom: searchRegex },
          { email: searchRegex },
          { entreprise: searchRegex }
        ]
      })
        .select('nom prenom email entreprise')
        .limit(10)
    ]);

    res.json({
      clients,
      prospects,
      opportunites,
      apporteurs
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

