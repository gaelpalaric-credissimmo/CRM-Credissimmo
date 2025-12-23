const express = require('express');
const Opportunite = require('../models/Opportunite');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

router.use(authenticate);

// Liste des opportunités
router.get('/', async (req, res) => {
  try {
    const { commercialId, statut, priorite, search } = req.query;
    let query = {};

    if (req.user.role !== 'admin' && req.user.role !== 'manager') {
      query.commercialId = req.user._id;
    } else if (commercialId) {
      query.commercialId = commercialId;
    }

    if (statut) {
      query.statut = statut;
    }

    if (priorite) {
      query.priorite = priorite;
    }

    const opportunites = await Opportunite.find(query)
      .populate('commercialId', 'nom prenom email')
      .populate('clientId', 'nom prenom entreprise')
      .populate('prospectId', 'nom prenom entreprise')
      .populate('apporteurId', 'nom prenom')
      .sort({ dateModification: -1 });

    res.json(opportunites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtenir une opportunité
router.get('/:id', async (req, res) => {
  try {
    const opportunite = await Opportunite.findById(req.params.id)
      .populate('commercialId', 'nom prenom email')
      .populate('clientId', 'nom prenom entreprise')
      .populate('prospectId', 'nom prenom entreprise')
      .populate('apporteurId', 'nom prenom');

    if (!opportunite) {
      return res.status(404).json({ message: 'Opportunité non trouvée' });
    }

    if (req.user.role !== 'admin' && req.user.role !== 'manager' && 
        opportunite.commercialId?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    res.json(opportunite);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Créer une opportunité
router.post('/', async (req, res) => {
  try {
    const opportuniteData = {
      ...req.body,
      commercialId: req.body.commercialId || req.user._id
    };

    const opportunite = new Opportunite(opportuniteData);
    await opportunite.save();

    const populatedOpportunite = await Opportunite.findById(opportunite._id)
      .populate('commercialId', 'nom prenom email')
      .populate('clientId', 'nom prenom entreprise')
      .populate('prospectId', 'nom prenom entreprise')
      .populate('apporteurId', 'nom prenom');

    res.status(201).json(populatedOpportunite);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Mettre à jour une opportunité
router.put('/:id', async (req, res) => {
  try {
    const opportunite = await Opportunite.findById(req.params.id);

    if (!opportunite) {
      return res.status(404).json({ message: 'Opportunité non trouvée' });
    }

    if (req.user.role !== 'admin' && req.user.role !== 'manager' && 
        opportunite.commercialId?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    Object.assign(opportunite, req.body);
    await opportunite.save();

    const populatedOpportunite = await Opportunite.findById(opportunite._id)
      .populate('commercialId', 'nom prenom email')
      .populate('clientId', 'nom prenom entreprise')
      .populate('prospectId', 'nom prenom entreprise')
      .populate('apporteurId', 'nom prenom');

    res.json(populatedOpportunite);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Supprimer une opportunité
router.delete('/:id', async (req, res) => {
  try {
    const opportunite = await Opportunite.findById(req.params.id);

    if (!opportunite) {
      return res.status(404).json({ message: 'Opportunité non trouvée' });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Seuls les administrateurs peuvent supprimer des opportunités' });
    }

    await opportunite.deleteOne();
    res.json({ message: 'Opportunité supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

