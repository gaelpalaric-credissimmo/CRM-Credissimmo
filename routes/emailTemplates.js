const express = require('express');
const EmailTemplate = require('../models/EmailTemplate');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

router.use(authenticate);

// Liste des templates
router.get('/', async (req, res) => {
  try {
    const templates = await EmailTemplate.find({ actif: true }).sort({ dateModification: -1 });
    res.json(templates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtenir un template
router.get('/:id', async (req, res) => {
  try {
    const template = await EmailTemplate.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ message: 'Template non trouvé' });
    }
    res.json(template);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Créer un template
router.post('/', async (req, res) => {
  try {
    const template = new EmailTemplate(req.body);
    await template.save();
    res.status(201).json(template);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Mettre à jour un template
router.put('/:id', async (req, res) => {
  try {
    const template = await EmailTemplate.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!template) {
      return res.status(404).json({ message: 'Template non trouvé' });
    }

    res.json(template);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Supprimer un template
router.delete('/:id', async (req, res) => {
  try {
    const template = await EmailTemplate.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ message: 'Template non trouvé' });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Seuls les administrateurs peuvent supprimer des templates' });
    }

    await template.deleteOne();
    res.json({ message: 'Template supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Envoyer un email depuis un template
router.post('/:id/send', async (req, res) => {
  try {
    const template = await EmailTemplate.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ message: 'Template non trouvé' });
    }

    const { to, variables } = req.body;

    // Remplacer les variables dans le template
    let sujet = template.sujet;
    let corps = template.corps;

    if (variables) {
      Object.keys(variables).forEach(key => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        sujet = sujet.replace(regex, variables[key]);
        corps = corps.replace(regex, variables[key]);
      });
    }

    // Ici, vous intégreriez votre service d'envoi d'email (SendGrid, Nodemailer, etc.)
    // Pour l'instant, on retourne juste les données formatées
    res.json({
      message: 'Email préparé avec succès',
      to,
      sujet,
      corps
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

