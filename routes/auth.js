const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

// Inscription (seulement pour les admins)
router.post('/register', authenticate, async (req, res) => {
  try {
    // Seuls les admins peuvent créer des utilisateurs
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Seuls les administrateurs peuvent créer des utilisateurs.' });
    }

    const { nom, prenom, email, password, role, telephone, equipe } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
    }

    const user = new User({
      nom,
      prenom,
      email,
      password,
      role: role || 'commercial',
      telephone,
      equipe
    });

    await user.save();

    // Retourner l'utilisateur sans le mot de passe
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      user: userResponse
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Connexion
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis.' });
    }

    // Trouver l'utilisateur
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
    }

    // Vérifier si l'utilisateur est actif
    if (!user.actif) {
      return res.status(401).json({ message: 'Votre compte a été désactivé.' });
    }

    // Vérifier le mot de passe
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
    }

    // Générer le token JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      { expiresIn: '7d' }
    );

    // Stocker le token dans la session
    req.session.token = token;
    req.session.userId = user._id;

    // Retourner l'utilisateur sans le mot de passe
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      message: 'Connexion réussie',
      token,
      user: userResponse
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Déconnexion
router.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ message: 'Déconnexion réussie' });
});

// Obtenir l'utilisateur actuel
router.get('/me', authenticate, async (req, res) => {
  try {
    const userResponse = req.user.toObject();
    delete userResponse.password;
    res.json(userResponse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Liste des utilisateurs (admin seulement)
router.get('/users', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé.' });
    }

    const users = await User.find().select('-password').sort({ dateCreation: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

