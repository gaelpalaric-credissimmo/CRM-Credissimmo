const express = require('express');
const Client = require('../models/Client');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

// Tous les routes nécessitent une authentification
router.use(authenticate);

// Liste des clients
router.get('/', async (req, res) => {
  try {
    const { commercialId, apporteurId, search } = req.query;
    let query = {};

    // Filtrer par commercial (si pas admin, voir seulement ses clients)
    if (req.user.role !== 'admin' && req.user.role !== 'manager') {
      query.commercialId = req.user._id;
    } else if (commercialId) {
      query.commercialId = commercialId;
    }

    if (apporteurId) {
      query.apporteurId = apporteurId;
    }

    // Recherche textuelle
    if (search) {
      query.$or = [
        { nom: { $regex: search, $options: 'i' } },
        { prenom: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { entreprise: { $regex: search, $options: 'i' } }
      ];
    }

    const clients = await Client.find(query)
      .populate('commercialId', 'nom prenom email')
      .populate('apporteurId', 'nom prenom')
      .sort({ dateModification: -1 });

    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtenir un client
router.get('/:id', async (req, res) => {
  try {
    const client = await Client.findById(req.params.id)
      .populate('commercialId', 'nom prenom email')
      .populate('apporteurId', 'nom prenom');

    if (!client) {
      return res.status(404).json({ message: 'Client non trouvé' });
    }

    // Vérifier les permissions
    if (req.user.role !== 'admin' && req.user.role !== 'manager' && 
        client.commercialId?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    res.json(client);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Créer un client
router.post('/', async (req, res) => {
  try {
    const clientData = {
      ...req.body,
      commercialId: req.body.commercialId || (req.user.role !== 'admin' ? req.user._id : null)
    };

    const client = new Client(clientData);
    await client.save();

    const populatedClient = await Client.findById(client._id)
      .populate('commercialId', 'nom prenom email')
      .populate('apporteurId', 'nom prenom');

    res.status(201).json(populatedClient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Mettre à jour un client
router.put('/:id', async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({ message: 'Client non trouvé' });
    }

    // Vérifier les permissions
    if (req.user.role !== 'admin' && req.user.role !== 'manager' && 
        client.commercialId?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    Object.assign(client, req.body);
    await client.save();

    const populatedClient = await Client.findById(client._id)
      .populate('commercialId', 'nom prenom email')
      .populate('apporteurId', 'nom prenom');

    res.json(populatedClient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Supprimer un client
router.delete('/:id', async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({ message: 'Client non trouvé' });
    }

    // Seuls les admins peuvent supprimer
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Seuls les administrateurs peuvent supprimer des clients' });
    }

    await client.deleteOne();
    res.json({ message: 'Client supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

