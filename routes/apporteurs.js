const express = require('express');
const Apporteur = require('../models/Apporteur');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

router.use(authenticate);

// Liste des apporteurs
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { nom: { $regex: search, $options: 'i' } },
        { prenom: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { entreprise: { $regex: search, $options: 'i' } }
      ];
    }

    const apporteurs = await Apporteur.find(query).sort({ dateModification: -1 });
    res.json(apporteurs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtenir un apporteur
router.get('/:id', async (req, res) => {
  try {
    const apporteur = await Apporteur.findById(req.params.id);
    if (!apporteur) {
      return res.status(404).json({ message: 'Apporteur non trouvé' });
    }
    res.json(apporteur);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Créer un apporteur
router.post('/', async (req, res) => {
  try {
    const apporteur = new Apporteur(req.body);
    await apporteur.save();
    res.status(201).json(apporteur);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Mettre à jour un apporteur
router.put('/:id', async (req, res) => {
  try {
    const apporteur = await Apporteur.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!apporteur) {
      return res.status(404).json({ message: 'Apporteur non trouvé' });
    }

    res.json(apporteur);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Supprimer un apporteur
router.delete('/:id', async (req, res) => {
  try {
    const apporteur = await Apporteur.findById(req.params.id);
    if (!apporteur) {
      return res.status(404).json({ message: 'Apporteur non trouvé' });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Seuls les administrateurs peuvent supprimer des apporteurs' });
    }

    await apporteur.deleteOne();
    res.json({ message: 'Apporteur supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

