const express = require('express');
const Prospect = require('../models/Prospect');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

router.use(authenticate);

// Liste des prospects
router.get('/', async (req, res) => {
  try {
    const { commercialId, statut, search } = req.query;
    let query = {};

    if (req.user.role !== 'admin' && req.user.role !== 'manager') {
      query.commercialId = req.user._id;
    } else if (commercialId) {
      query.commercialId = commercialId;
    }

    if (statut) {
      query.statut = statut;
    }

    if (search) {
      query.$or = [
        { nom: { $regex: search, $options: 'i' } },
        { prenom: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { entreprise: { $regex: search, $options: 'i' } }
      ];
    }

    const prospects = await Prospect.find(query)
      .populate('commercialId', 'nom prenom email')
      .populate('apporteurId', 'nom prenom')
      .sort({ dateModification: -1 });

    res.json(prospects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtenir un prospect
router.get('/:id', async (req, res) => {
  try {
    const prospect = await Prospect.findById(req.params.id)
      .populate('commercialId', 'nom prenom email')
      .populate('apporteurId', 'nom prenom');

    if (!prospect) {
      return res.status(404).json({ message: 'Prospect non trouvé' });
    }

    if (req.user.role !== 'admin' && req.user.role !== 'manager' && 
        prospect.commercialId?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    res.json(prospect);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Créer un prospect
router.post('/', async (req, res) => {
  try {
    const prospectData = {
      ...req.body,
      commercialId: req.body.commercialId || (req.user.role !== 'admin' ? req.user._id : null)
    };

    const prospect = new Prospect(prospectData);
    await prospect.save();

    const populatedProspect = await Prospect.findById(prospect._id)
      .populate('commercialId', 'nom prenom email')
      .populate('apporteurId', 'nom prenom');

    res.status(201).json(populatedProspect);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Mettre à jour un prospect
router.put('/:id', async (req, res) => {
  try {
    const prospect = await Prospect.findById(req.params.id);

    if (!prospect) {
      return res.status(404).json({ message: 'Prospect non trouvé' });
    }

    if (req.user.role !== 'admin' && req.user.role !== 'manager' && 
        prospect.commercialId?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    Object.assign(prospect, req.body);
    await prospect.save();

    const populatedProspect = await Prospect.findById(prospect._id)
      .populate('commercialId', 'nom prenom email')
      .populate('apporteurId', 'nom prenom');

    res.json(populatedProspect);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Supprimer un prospect
router.delete('/:id', async (req, res) => {
  try {
    const prospect = await Prospect.findById(req.params.id);

    if (!prospect) {
      return res.status(404).json({ message: 'Prospect non trouvé' });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Seuls les administrateurs peuvent supprimer des prospects' });
    }

    await prospect.deleteOne();
    res.json({ message: 'Prospect supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

