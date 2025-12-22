const express = require('express');
const axios = require('axios');
const router = express.Router();

const CLIENT_ID = process.env.MICROSOFT_CLIENT_ID;
const CLIENT_SECRET = process.env.MICROSOFT_CLIENT_SECRET;
const TENANT_ID = process.env.MICROSOFT_TENANT_ID || 'common';
const REDIRECT_URI = process.env.REDIRECT_URI || 'http://localhost:5000/api/outlook/callback';
const SCOPES = 'https://graph.microsoft.com/.default offline_access';

// Stockage des tokens (en production, utiliser une base de données)
let outlookTokens = {};

// Route pour initier la connexion Outlook
router.get('/auth', (req, res) => {
  const authUrl = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/authorize?` +
    `client_id=${CLIENT_ID}&` +
    `response_type=code&` +
    `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
    `response_mode=query&` +
    `scope=${encodeURIComponent('https://graph.microsoft.com/User.Read https://graph.microsoft.com/Contacts.Read https://graph.microsoft.com/Calendars.Read https://graph.microsoft.com/Mail.Read https://graph.microsoft.com/Mail.Send')}&` +
    `state=12345`;
  
  res.json({ authUrl });
});

// Callback après authentification
router.get('/callback', async (req, res) => {
  const { code, error } = req.query;

  if (error) {
    return res.redirect(`http://localhost:3000/outlook?error=${encodeURIComponent(error)}`);
  }

  try {
    // Échanger le code contre un token
    const tokenResponse = await axios.post(
      `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`,
      new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: code,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
        scope: 'https://graph.microsoft.com/User.Read https://graph.microsoft.com/Contacts.Read https://graph.microsoft.com/Calendars.Read https://graph.microsoft.com/Mail.Read https://graph.microsoft.com/Mail.Send'
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    const { access_token, refresh_token } = tokenResponse.data;
    outlookTokens.access_token = access_token;
    outlookTokens.refresh_token = refresh_token;
    outlookTokens.expires_at = Date.now() + (tokenResponse.data.expires_in * 1000);

    // Rediriger vers le frontend avec succès
    res.redirect(`http://localhost:3000/outlook?success=true`);
  } catch (error) {
    console.error('Erreur lors de l\'obtention du token:', error.response?.data || error.message);
    res.redirect(`http://localhost:3000/outlook?error=${encodeURIComponent('Erreur d\'authentification')}`);
  }
});

// Obtenir un token valide (rafraîchir si nécessaire)
async function getValidToken() {
  if (!outlookTokens.access_token) {
    throw new Error('Non authentifié avec Outlook');
  }

  // Vérifier si le token est expiré
  if (Date.now() >= outlookTokens.expires_at) {
    if (!outlookTokens.refresh_token) {
      throw new Error('Token expiré et aucun refresh token disponible');
    }

    try {
      const tokenResponse = await axios.post(
        `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`,
        new URLSearchParams({
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          refresh_token: outlookTokens.refresh_token,
          grant_type: 'refresh_token',
          scope: 'https://graph.microsoft.com/User.Read https://graph.microsoft.com/Contacts.Read https://graph.microsoft.com/Calendars.Read https://graph.microsoft.com/Mail.Read https://graph.microsoft.com/Mail.Send'
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      outlookTokens.access_token = tokenResponse.data.access_token;
      if (tokenResponse.data.refresh_token) {
        outlookTokens.refresh_token = tokenResponse.data.refresh_token;
      }
      outlookTokens.expires_at = Date.now() + (tokenResponse.data.expires_in * 1000);
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du token:', error.response?.data || error.message);
      throw new Error('Impossible de rafraîchir le token');
    }
  }

  return outlookTokens.access_token;
}

// Vérifier le statut de connexion
router.get('/status', async (req, res) => {
  try {
    const token = await getValidToken();
    res.json({ connected: true, token: token ? 'present' : 'missing' });
  } catch (error) {
    res.json({ connected: false, error: error.message });
  }
});

// Obtenir les informations de l'utilisateur
router.get('/me', async (req, res) => {
  try {
    const token = await getValidToken();
    const response = await axios.get('https://graph.microsoft.com/v1.0/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Synchroniser les contacts Outlook
router.get('/contacts/sync', async (req, res) => {
  try {
    const token = await getValidToken();
    const response = await axios.get('https://graph.microsoft.com/v1.0/me/contacts', {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        $top: 100
      }
    });

    const outlookContacts = response.data.value.map(contact => ({
      nom: contact.surname || contact.givenName || contact.displayName,
      prenom: contact.givenName || '',
      email: contact.emailAddresses?.[0]?.address || '',
      telephone: contact.businessPhones?.[0] || contact.mobilePhone || '',
      poste: contact.jobTitle || '',
      entreprise: contact.companyName || '',
      notes: contact.notes || '',
      source: 'outlook',
      outlookId: contact.id
    }));

    res.json({ contacts: outlookContacts, total: outlookContacts.length });
  } catch (error) {
    console.error('Erreur lors de la synchronisation des contacts:', error.response?.data || error.message);
    res.status(500).json({ error: error.message });
  }
});

// Obtenir les emails récents
router.get('/emails', async (req, res) => {
  try {
    const token = await getValidToken();
    const { clientEmail } = req.query;
    
    let url = 'https://graph.microsoft.com/v1.0/me/messages';
    if (clientEmail) {
      url += `?$filter=from/emailAddress/address eq '${clientEmail}'`;
    }
    url += (clientEmail ? '&' : '?') + '$top=10&$orderby=receivedDateTime desc';

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const emails = response.data.value.map(email => ({
      id: email.id,
      subject: email.subject,
      from: email.from?.emailAddress?.address || '',
      fromName: email.from?.emailAddress?.name || '',
      receivedDateTime: email.receivedDateTime,
      bodyPreview: email.bodyPreview,
      isRead: email.isRead,
      importance: email.importance
    }));

    res.json({ emails, total: emails.length });
  } catch (error) {
    console.error('Erreur lors de la récupération des emails:', error.response?.data || error.message);
    res.status(500).json({ error: error.message });
  }
});

// Obtenir les événements du calendrier
router.get('/calendar/events', async (req, res) => {
  try {
    const token = await getValidToken();
    const { startDate, endDate } = req.query;
    
    let url = 'https://graph.microsoft.com/v1.0/me/calendar/events';
    const params = {
      $top: 50,
      $orderby: 'start/dateTime'
    };

    if (startDate && endDate) {
      params.$filter = `start/dateTime ge '${startDate}' and end/dateTime le '${endDate}'`;
    }

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params
    });

    const events = response.data.value.map(event => ({
      id: event.id,
      subject: event.subject,
      start: event.start?.dateTime,
      end: event.end?.dateTime,
      location: event.location?.displayName || '',
      attendees: event.attendees?.map(a => ({
        email: a.emailAddress?.address,
        name: a.emailAddress?.name
      })) || [],
      bodyPreview: event.bodyPreview
    }));

    res.json({ events, total: events.length });
  } catch (error) {
    console.error('Erreur lors de la récupération des événements:', error.response?.data || error.message);
    res.status(500).json({ error: error.message });
  }
});

// Envoyer un email avec pièce jointe
router.post('/send-email', async (req, res) => {
  try {
    const token = await getValidToken();
    const { to, subject, body, attachmentBase64, attachmentName, attachmentContentType } = req.body;

    if (!to || !subject || !body) {
      return res.status(400).json({ error: 'Destinataire, sujet et corps du message sont requis' });
    }

    // Construire le message avec pièce jointe
    const message = {
      message: {
        subject: subject,
        body: {
          contentType: 'HTML',
          content: body
        },
        toRecipients: Array.isArray(to) 
          ? to.map(email => ({ emailAddress: { address: email } }))
          : [{ emailAddress: { address: to } }]
      }
    };

    // Si une pièce jointe est fournie
    if (attachmentBase64 && attachmentName) {
      message.message.attachments = [{
        '@odata.type': '#microsoft.graph.fileAttachment',
        name: attachmentName,
        contentType: attachmentContentType || 'application/pdf',
        contentBytes: attachmentBase64
      }];
    }

    const response = await axios.post(
      'https://graph.microsoft.com/v1.0/me/sendMail',
      message,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json({ success: true, message: 'Email envoyé avec succès' });
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Erreur lors de l\'envoi de l\'email', 
      details: error.response?.data || error.message 
    });
  }
});

// Déconnexion
router.post('/disconnect', (req, res) => {
  outlookTokens = {};
  res.json({ message: 'Déconnecté avec succès' });
});

module.exports = router;
