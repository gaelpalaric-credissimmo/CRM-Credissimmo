import axios from 'axios';

// En production, utiliser une URL relative (même domaine)
// En développement, utiliser l'URL complète du serveur
const API_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api');

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Clients
export const getClients = () => api.get('/clients');
export const getClient = (id) => api.get(`/clients/${id}`);
export const createClient = (data) => api.post('/clients', data);
export const updateClient = (id, data) => api.put(`/clients/${id}`, data);
export const deleteClient = (id) => api.delete(`/clients/${id}`);

// Contacts
export const getContacts = () => api.get('/contacts');
export const getContact = (id) => api.get(`/contacts/${id}`);
export const createContact = (data) => api.post('/contacts', data);
export const updateContact = (id, data) => api.put(`/contacts/${id}`, data);
export const deleteContact = (id) => api.delete(`/contacts/${id}`);

// Opportunités
export const getOpportunites = () => api.get('/opportunites');
export const getOpportunite = (id) => api.get(`/opportunites/${id}`);
export const createOpportunite = (data) => api.post('/opportunites', data);
export const updateOpportunite = (id, data) => api.put(`/opportunites/${id}`, data);
export const deleteOpportunite = (id) => api.delete(`/opportunites/${id}`);

// Statistiques
export const getStats = () => api.get('/stats');

// Apporteurs d'affaires
export const getApporteurs = () => api.get('/apporteurs');
export const getApporteur = (id) => api.get(`/apporteurs/${id}`);
export const createApporteur = (data) => api.post('/apporteurs', data);
export const updateApporteur = (id, data) => api.put(`/apporteurs/${id}`, data);
export const deleteApporteur = (id) => api.delete(`/apporteurs/${id}`);

// Outlook (OAuth/Microsoft Graph)
export const getOutlookStatus = () => api.get('/outlook/status');
export const connectOutlook = () => api.get('/outlook/auth');
export const syncOutlookContacts = () => api.get('/outlook/contacts/sync');
export const getOutlookEmails = (clientEmail) => api.get('/outlook/emails', { params: { clientEmail } });
export const getOutlookEvents = (startDate, endDate) => api.get('/outlook/calendar/events', { params: { startDate, endDate } });
export const disconnectOutlook = () => api.post('/outlook/disconnect');

// IMAP (pour comptes IMAP génériques)
export const connectIMAP = (credentials) => api.post('/imap/connect', credentials);
export const getIMAPStatus = (email) => api.get('/imap/status', { params: { email } });
export const getIMAPEmails = (email, limit) => api.get('/imap/emails', { params: { email, limit } });
export const disconnectIMAP = (email) => api.post('/imap/disconnect', { email });

export default api;
