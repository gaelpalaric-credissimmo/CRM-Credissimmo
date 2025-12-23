const express = require('express');
const Rappel = require('../models/Rappel');
const Opportunite = require('../models/Opportunite');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

router.use(authenticate);

// Liste des rappels
router.get('/', async (req, res) => {
  try {
    const { resolu, commercialId, priorite } = req.query;
    let query = {};

    if (req.user.role !== 'admin' && req.user.role !== 'manager') {
      query.commercialId = req.user._id;
    } else if (commercialId) {
      query.commercialId = commercialId;
    }

    if (resolu !== undefined) {
      query.resolu = resolu === 'true';
    }

    if (priorite) {
      query.priorite = priorite;
    }

    const rappels = await Rappel.find(query)
      .populate('commercialId', 'nom prenom email')
      .populate('clientId', 'nom prenom')
      .populate('prospectId', 'nom prenom')
      .populate('opportuniteId', 'numero montant')
      .sort({ dateRappel: 1 });

    res.json(rappels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtenir un rappel
router.get('/:id', async (req, res) => {
  try {
    const rappel = await Rappel.findById(req.params.id)
      .populate('commercialId', 'nom prenom email')
      .populate('clientId', 'nom prenom')
      .populate('prospectId', 'nom prenom')
      .populate('opportuniteId', 'numero montant');

    if (!rappel) {
      return res.status(404).json({ message: 'Rappel non trouvé' });
    }

    if (req.user.role !== 'admin' && req.user.role !== 'manager' && 
        rappel.commercialId?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    res.json(rappel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Créer un rappel
router.post('/', async (req, res) => {
  try {
    const rappelData = {
      ...req.body,
      commercialId: req.body.commercialId || req.user._id
    };

    const rappel = new Rappel(rappelData);
    await rappel.save();

    const populatedRappel = await Rappel.findById(rappel._id)
      .populate('commercialId', 'nom prenom email')
      .populate('clientId', 'nom prenom')
      .populate('prospectId', 'nom prenom')
      .populate('opportuniteId', 'numero montant');

    res.status(201).json(populatedRappel);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Générer des rappels automatiques
router.post('/generer', async (req, res) => {
  try {
    const maintenant = new Date();
    const rappelsCrees = [];

    // Trouver les opportunités à relancer
    const opportunites = await Opportunite.find({
      statut: { $nin: ['facturation', 'annulee'] },
      $or: [
        { dateDerniereRelance: null },
        { dateDerniereRelance: { $lt: new Date(maintenant.getTime() - 7 * 24 * 60 * 60 * 1000) } }
      ]
    }).populate('commercialId');

    for (const opp of opportunites) {
      const joursDepuisRelance = opp.dateDerniereRelance
        ? Math.floor((maintenant - new Date(opp.dateDerniereRelance)) / (1000 * 60 * 60 * 24))
        : Math.floor((maintenant - new Date(opp.dateCreation)) / (1000 * 60 * 60 * 24));

      if (joursDepuisRelance >= 7) {
        // Vérifier si un rappel existe déjà
        const rappelExistant = await Rappel.findOne({
          opportuniteId: opp._id,
          resolu: false,
          type: 'relance'
        });

        if (!rappelExistant) {
          const rappel = new Rappel({
            titre: `Relance dossier ${opp.numero}`,
            description: `Dernière relance il y a ${joursDepuisRelance} jours`,
            type: 'relance',
            priorite: joursDepuisRelance >= 14 ? 'urgente' : joursDepuisRelance >= 10 ? 'haute' : 'normale',
            dateRappel: maintenant,
            opportuniteId: opp._id,
            commercialId: opp.commercialId._id
          });

          await rappel.save();
          rappelsCrees.push(rappel);
        }
      }
    }

    res.json({
      message: `${rappelsCrees.length} rappel(s) généré(s)`,
      rappels: rappelsCrees
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Résoudre un rappel
router.put('/:id/resoudre', async (req, res) => {
  try {
    const rappel = await Rappel.findById(req.params.id);

    if (!rappel) {
      return res.status(404).json({ message: 'Rappel non trouvé' });
    }

    if (req.user.role !== 'admin' && req.user.role !== 'manager' && 
        rappel.commercialId?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    rappel.resolu = true;
    rappel.dateResolution = new Date();

    // Mettre à jour la date de dernière relance de l'opportunité si c'est une relance
    if (rappel.type === 'relance' && rappel.opportuniteId) {
      await Opportunite.findByIdAndUpdate(rappel.opportuniteId, {
        dateDerniereRelance: new Date()
      });
    }

    await rappel.save();

    const populatedRappel = await Rappel.findById(rappel._id)
      .populate('commercialId', 'nom prenom email')
      .populate('clientId', 'nom prenom')
      .populate('prospectId', 'nom prenom')
      .populate('opportuniteId', 'numero montant');

    res.json(populatedRappel);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Supprimer un rappel
router.delete('/:id', async (req, res) => {
  try {
    const rappel = await Rappel.findById(req.params.id);

    if (!rappel) {
      return res.status(404).json({ message: 'Rappel non trouvé' });
    }

    if (req.user.role !== 'admin' && rappel.commercialId?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    await rappel.deleteOne();
    res.json({ message: 'Rappel supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

