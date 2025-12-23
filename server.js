const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// Connexion à MongoDB
const connectDB = require('./config/database');
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL || true
    : 'http://localhost:3000',
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 jours
  }
}));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/clients', require('./routes/clients'));
app.use('/api/prospects', require('./routes/prospects'));
app.use('/api/opportunites', require('./routes/opportunites'));
app.use('/api/apporteurs', require('./routes/apporteurs'));
app.use('/api/rappels', require('./routes/rappels'));
app.use('/api/stats', require('./routes/stats'));
app.use('/api/search', require('./routes/search'));
app.use('/api/email-templates', require('./routes/emailTemplates'));

// Routes d'intégration existantes
app.use('/api/googlesheets', require('./routes/googlesheets'));
app.use('/api/outlook', require('./routes/outlook'));
app.use('/api/imap', require('./routes/imap'));
app.use('/api/import', require('./routes/import'));

// Route de santé
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Servir les fichiers statiques en production (AVANT la gestion des erreurs)
if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  const fs = require('fs');
  const buildPath = path.join(__dirname, 'client/build');
  
  // Vérifier que le dossier build existe
  if (!fs.existsSync(buildPath)) {
    console.error('❌ ERREUR: Le dossier client/build n\'existe pas!');
    console.error('   Assurez-vous que le build a été fait: cd client && npm run build');
  } else {
    console.log('✅ Dossier build trouvé:', buildPath);
    // Lister les fichiers pour debug
    try {
      const files = fs.readdirSync(buildPath);
      console.log('📁 Fichiers dans build:', files.slice(0, 10).join(', '), '...');
    } catch (e) {
      console.error('Erreur lecture dossier build:', e.message);
    }
  }
  
  // Servir les fichiers statiques (JS, CSS, images, etc.)
  // IMPORTANT: Cette ligne doit être AVANT app.get('*')
  // Les fichiers React sont dans client/build/static/js/ et client/build/static/css/
  app.use(express.static(buildPath, {
    maxAge: '1y',
    etag: false,
    index: false // Ne pas servir index.html automatiquement
  }));
  
  // Toutes les routes non-API servent index.html (pour React Router)
  // MAIS seulement si le fichier n'existe pas déjà (les fichiers statiques sont servis en premier)
  app.get('*', (req, res, next) => {
    // Ne pas intercepter les routes API
    if (req.path.startsWith('/api/')) {
      return next();
    }
    
    // Servir index.html pour toutes les routes non-API (React Router gère le routing)
    const indexPath = path.join(buildPath, 'index.html');
    
    // Vérifier que le fichier existe
    if (!fs.existsSync(indexPath)) {
      console.error('❌ index.html non trouvé dans:', indexPath);
      return res.status(500).send('Erreur: Fichier index.html non trouvé. Le build a-t-il été fait?');
    }
    
    res.sendFile(indexPath, (err) => {
      if (err) {
        console.error('❌ Erreur lors de l\'envoi de index.html:', err);
        res.status(500).send('Erreur serveur');
      }
    });
  });
}

// Gestion des erreurs (APRÈS les routes statiques)
app.use((err, req, res, next) => {
  console.error('Erreur:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Erreur serveur',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur CRM démarré sur le port ${PORT}`);
  console.log(`📊 Environnement: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API disponible sur: http://localhost:${PORT}/api`);
});
