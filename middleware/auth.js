const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware d'authentification
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || 
                  req.session?.token ||
                  req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: 'Accès non autorisé. Token manquant.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production');
    const user = await User.findById(decoded.userId).select('-password');

    if (!user || !user.actif) {
      return res.status(401).json({ message: 'Utilisateur non trouvé ou inactif.' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token invalide.' });
  }
};

// Middleware de vérification des rôles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Non authentifié.' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Accès refusé. Permissions insuffisantes.' });
    }

    next();
  };
};

module.exports = { authenticate, authorize };

