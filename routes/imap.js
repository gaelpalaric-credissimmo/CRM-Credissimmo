const express = require('express');
const Imap = require('imap');
const { simpleParser } = require('mailparser');
const router = express.Router();

// Stockage des connexions IMAP (en production, utiliser une base de données)
let imapConnections = {};

// Route pour se connecter via IMAP
router.post('/connect', (req, res) => {
  const { email, password, host, port, tls } = req.body;

  if (!email || !password || !host) {
    return res.status(400).json({ 
      error: 'Email, mot de passe et serveur IMAP sont requis' 
    });
  }

  // Configuration par défaut pour les serveurs courants
  const defaultConfig = {
    'outlook.com': { host: 'imap-mail.outlook.com', port: 993, tls: true },
    'hotmail.com': { host: 'imap-mail.outlook.com', port: 993, tls: true },
    'live.com': { host: 'imap-mail.outlook.com', port: 993, tls: true },
    'gmail.com': { host: 'imap.gmail.com', port: 993, tls: true },
    'yahoo.com': { host: 'imap.mail.yahoo.com', port: 993, tls: true }
  };

  const emailDomain = email.split('@')[1]?.toLowerCase();
  const config = defaultConfig[emailDomain] || { 
    host: host || 'imap-mail.outlook.com', 
    port: port || 993, 
    tls: tls !== false 
  };

  const imap = new Imap({
    user: email,
    password: password,
    host: config.host,
    port: config.port,
    tls: config.tls,
    tlsOptions: { rejectUnauthorized: false }
  });

  imap.once('ready', () => {
    // Stocker la connexion
    imapConnections[email] = {
      imap: imap,
      email: email,
      connected: true,
      connectedAt: new Date()
    };

    res.json({ 
      success: true, 
      message: 'Connexion IMAP réussie',
      email: email
    });
  });

  imap.once('error', (err) => {
    console.error('Erreur IMAP:', err);
    res.status(500).json({ 
      error: 'Erreur de connexion IMAP', 
      details: err.message 
    });
  });

  imap.once('end', () => {
    if (imapConnections[email]) {
      delete imapConnections[email];
    }
  });

  imap.connect();
});

// Vérifier le statut de connexion IMAP
router.get('/status', (req, res) => {
  const { email } = req.query;
  
  if (!email) {
    return res.status(400).json({ error: 'Email requis' });
  }

  const connection = imapConnections[email];
  
  if (connection && connection.connected) {
    res.json({ 
      connected: true, 
      email: email,
      connectedAt: connection.connectedAt
    });
  } else {
    res.json({ connected: false });
  }
});

// Obtenir les emails via IMAP
router.get('/emails', (req, res) => {
  const { email, limit = 10 } = req.query;

  if (!email) {
    return res.status(400).json({ error: 'Email requis' });
  }

  const connection = imapConnections[email];
  
  if (!connection || !connection.connected) {
    return res.status(401).json({ error: 'Non connecté via IMAP' });
  }

  const imap = connection.imap;

  imap.openBox('INBOX', false, (err, box) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Rechercher les emails récents (30 derniers jours)
    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - 30);
    
    imap.search(['SINCE', sinceDate], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (!results || results.length === 0) {
        return res.json({ emails: [], total: 0 });
      }

      // Limiter le nombre d'emails et prendre les plus récents
      const emailIds = results.slice(-parseInt(limit));
      const fetch = imap.fetch(emailIds, {
        bodies: '',
        struct: true
      });

      const emails = [];
      let processed = 0;

      fetch.on('message', (msg, seqno) => {
        const emailData = {
          id: seqno,
          subject: '',
          from: '',
          fromName: '',
          receivedDateTime: '',
          bodyPreview: '',
          isRead: false
        };

        msg.on('body', (stream, info) => {
          simpleParser(stream, (err, parsed) => {
            if (!err && parsed) {
              emailData.subject = parsed.subject || '';
              emailData.from = parsed.from?.value?.[0]?.address || '';
              emailData.fromName = parsed.from?.value?.[0]?.name || '';
              emailData.receivedDateTime = parsed.date?.toISOString() || new Date().toISOString();
              emailData.bodyPreview = (parsed.text || parsed.html || '').substring(0, 200);
            }
          });
        });

        msg.once('attributes', (attrs) => {
          const flags = attrs.flags;
          emailData.isRead = flags.has('\\Seen');
        });

        msg.once('end', () => {
          emails.push(emailData);
          processed++;
          if (processed === emailIds.length) {
            res.json({ 
              emails: emails.sort((a, b) => 
                new Date(b.receivedDateTime) - new Date(a.receivedDateTime)
              ), 
              total: emails.length 
            });
          }
        });
      });

      fetch.once('error', (err) => {
        res.status(500).json({ error: err.message });
      });
    });
  });
});

// Déconnexion IMAP
router.post('/disconnect', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email requis' });
  }

  const connection = imapConnections[email];
  
  if (connection && connection.imap) {
    connection.imap.end();
    delete imapConnections[email];
    res.json({ message: 'Déconnecté avec succès' });
  } else {
    res.json({ message: 'Aucune connexion trouvée' });
  }
});

module.exports = router;

