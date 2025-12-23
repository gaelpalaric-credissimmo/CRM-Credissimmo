const express = require('express');
const Client = require('../models/Client');
const Prospect = require('../models/Prospect');
const Opportunite = require('../models/Opportunite');
const Rappel = require('../models/Rappel');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

router.use(authenticate);

router.get('/', async (req, res) => {
  try {
    let query = {};

    // Si pas admin/manager, filtrer par commercial
    if (req.user.role !== 'admin' && req.user.role !== 'manager') {
      query.commercialId = req.user._id;
    }

    const [
      totalClients,
      totalProspects,
      totalOpportunites,
      opportunitesParStatut,
      montantTotal,
      montantGagne,
      totalRappels,
      rappelsUrgents
    ] = await Promise.all([
      Client.countDocuments(query),
      Prospect.countDocuments(query),
      Opportunite.countDocuments(query),
      Opportunite.aggregate([
        { $match: query },
        { $group: { _id: '$statut', count: { $sum: 1 } } }
      ]),
      Opportunite.aggregate([
        { $match: query },
        { $group: { _id: null, total: { $sum: '$montant' } } }
      ]),
      Opportunite.aggregate([
        { $match: { ...query, statut: 'facturation' } },
        { $group: { _id: null, total: { $sum: '$montant' } } }
      ]),
      Rappel.countDocuments({ ...query, resolu: false }),
      Rappel.countDocuments({ ...query, resolu: false, priorite: 'urgente' })
    ]);

    // Transformer opportunitesParStatut en objet
    const statutsObj = {};
    opportunitesParStatut.forEach(item => {
      statutsObj[item._id] = item.count;
    });

    // Compter les opportunités en cours (toutes sauf facturation et annulée)
    const enCours = await Opportunite.countDocuments({
      ...query,
      statut: { $nin: ['facturation', 'annulee'] }
    });

    res.json({
      totalClients,
      totalProspects,
      totalOpportunites,
      enCours,
      opportunitesParStatut: statutsObj,
      montantTotal: montantTotal[0]?.total || 0,
      montantGagne: montantGagne[0]?.total || 0,
      totalRappels,
      rappelsUrgents
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

