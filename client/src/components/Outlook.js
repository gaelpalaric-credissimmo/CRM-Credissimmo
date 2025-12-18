import React, { useState, useEffect } from 'react';
import { getOutlookStatus, connectOutlook, syncOutlookContacts, getOutlookEmails, getOutlookEvents, disconnectOutlook } from '../api/api';
import { FiMail, FiCalendar, FiUsers, FiLink, FiLogOut, FiRefreshCw, FiCheckCircle, FiXCircle } from 'react-icons/fi';

function Outlook() {
  const [status, setStatus] = useState({ connected: false, loading: true });
  const [userInfo, setUserInfo] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState(null);
  const [emails, setEmails] = useState([]);
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    checkStatus();
  }, []);

  useEffect(() => {
    if (status.connected) {
      loadUserInfo();
      loadEmails();
      loadEvents();
    }
  }, [status.connected]);

  const checkStatus = async () => {
    try {
      const response = await getOutlookStatus();
      setStatus({ connected: response.data.connected, loading: false });
    } catch (error) {
      console.error('Erreur lors de la vérification du statut:', error);
      setStatus({ connected: false, loading: false });
    }
  };

  const loadUserInfo = async () => {
    try {
      const response = await getOutlookStatus();
      if (response.data.connected) {
        // Note: L'endpoint /me nécessite une authentification complète
        // Pour l'instant, on affiche juste le statut
      }
    } catch (error) {
      console.error('Erreur lors du chargement des infos utilisateur:', error);
    }
  };

  const handleConnect = async () => {
    try {
      const response = await connectOutlook();
      if (response.data.authUrl) {
        window.location.href = response.data.authUrl;
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      alert('Erreur lors de la connexion à Outlook');
    }
  };

  const handleDisconnect = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter d\'Outlook ?')) {
      try {
        await disconnectOutlook();
        setStatus({ connected: false, loading: false });
        setUserInfo(null);
        setEmails([]);
        setEvents([]);
        setSyncResult(null);
      } catch (error) {
        console.error('Erreur lors de la déconnexion:', error);
        alert('Erreur lors de la déconnexion');
      }
    }
  };

  const handleSyncContacts = async () => {
    setSyncing(true);
    setSyncResult(null);
    try {
      const response = await syncOutlookContacts();
      setSyncResult({
        success: true,
        message: `${response.data.total} contacts synchronisés depuis Outlook`,
        contacts: response.data.contacts
      });
    } catch (error) {
      console.error('Erreur lors de la synchronisation:', error);
      setSyncResult({
        success: false,
        message: 'Erreur lors de la synchronisation des contacts'
      });
    } finally {
      setSyncing(false);
    }
  };

  const loadEmails = async () => {
    try {
      const response = await getOutlookEmails();
      setEmails(response.data.emails || []);
    } catch (error) {
      console.error('Erreur lors du chargement des emails:', error);
    }
  };

  const loadEvents = async () => {
    try {
      const response = await getOutlookEvents();
      setEvents(response.data.events || []);
    } catch (error) {
      console.error('Erreur lors du chargement des événements:', error);
    }
  };

  // Vérifier si on revient de l'authentification
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const error = urlParams.get('error');

    if (success === 'true') {
      checkStatus();
      // Nettoyer l'URL
      window.history.replaceState({}, document.title, '/outlook');
    } else if (error) {
      alert(`Erreur d'authentification: ${error}`);
      window.history.replaceState({}, document.title, '/outlook');
    }
  }, []);

  if (status.loading) {
    return <div className="card">Chargement...</div>;
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Intégration Outlook</h2>
          {status.connected ? (
            <button className="btn btn-danger" onClick={handleDisconnect}>
              <FiLogOut /> Déconnecter
            </button>
          ) : (
            <button className="btn btn-primary" onClick={handleConnect}>
              <FiLink /> Se connecter à Outlook
            </button>
          )}
        </div>

        {status.connected ? (
          <div>
            <div style={{ 
              padding: '1rem', 
              background: '#d4edda', 
              borderRadius: '8px', 
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <FiCheckCircle style={{ color: '#28a745' }} />
              <strong>Connecté à Outlook</strong>
            </div>

            {/* Tabs */}
            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              marginBottom: '1.5rem',
              borderBottom: '2px solid #eee'
            }}>
              <button
                className={`btn ${activeTab === 'overview' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setActiveTab('overview')}
                style={{ borderRadius: '8px 8px 0 0', marginBottom: '-2px' }}
              >
                Vue d'ensemble
              </button>
              <button
                className={`btn ${activeTab === 'contacts' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setActiveTab('contacts')}
                style={{ borderRadius: '8px 8px 0 0', marginBottom: '-2px' }}
              >
                Contacts
              </button>
              <button
                className={`btn ${activeTab === 'emails' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setActiveTab('emails')}
                style={{ borderRadius: '8px 8px 0 0', marginBottom: '-2px' }}
              >
                Emails
              </button>
              <button
                className={`btn ${activeTab === 'calendar' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setActiveTab('calendar')}
                style={{ borderRadius: '8px 8px 0 0', marginBottom: '-2px' }}
              >
                Calendrier
              </button>
            </div>

            {/* Contenu des tabs */}
            {activeTab === 'overview' && (
              <div>
                <h3 style={{ marginBottom: '1rem' }}>Actions rapides</h3>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <button 
                    className="btn btn-primary" 
                    onClick={handleSyncContacts}
                    disabled={syncing}
                  >
                    <FiRefreshCw style={{ animation: syncing ? 'spin 1s linear infinite' : 'none' }} />
                    {syncing ? ' Synchronisation...' : ' Synchroniser les contacts'}
                  </button>
                  <button className="btn btn-secondary" onClick={loadEmails}>
                    <FiMail /> Actualiser les emails
                  </button>
                  <button className="btn btn-secondary" onClick={loadEvents}>
                    <FiCalendar /> Actualiser le calendrier
                  </button>
                </div>

                {syncResult && (
                  <div style={{
                    marginTop: '1.5rem',
                    padding: '1rem',
                    background: syncResult.success ? '#d4edda' : '#f8d7da',
                    borderRadius: '8px',
                    color: syncResult.success ? '#155724' : '#721c24'
                  }}>
                    {syncResult.success ? <FiCheckCircle /> : <FiXCircle />}
                    {' '}
                    {syncResult.message}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'contacts' && (
              <div>
                <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3>Contacts Outlook</h3>
                  <button className="btn btn-primary" onClick={handleSyncContacts} disabled={syncing}>
                    <FiRefreshCw /> Synchroniser
                  </button>
                </div>
                {syncResult && syncResult.contacts && (
                  <div className="table-container">
                    <table>
                      <thead>
                        <tr>
                          <th>Nom</th>
                          <th>Prénom</th>
                          <th>Email</th>
                          <th>Téléphone</th>
                          <th>Poste</th>
                          <th>Entreprise</th>
                        </tr>
                      </thead>
                      <tbody>
                        {syncResult.contacts.map((contact, index) => (
                          <tr key={index}>
                            <td>{contact.nom}</td>
                            <td>{contact.prenom}</td>
                            <td>{contact.email}</td>
                            <td>{contact.telephone}</td>
                            <td>{contact.poste}</td>
                            <td>{contact.entreprise}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {(!syncResult || !syncResult.contacts) && (
                  <p>Cliquez sur "Synchroniser" pour charger les contacts depuis Outlook.</p>
                )}
              </div>
            )}

            {activeTab === 'emails' && (
              <div>
                <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3>Emails récents</h3>
                  <button className="btn btn-secondary" onClick={loadEmails}>
                    <FiRefreshCw /> Actualiser
                  </button>
                </div>
                {emails.length > 0 ? (
                  <div className="table-container">
                    <table>
                      <thead>
                        <tr>
                          <th>De</th>
                          <th>Sujet</th>
                          <th>Date</th>
                          <th>Statut</th>
                        </tr>
                      </thead>
                      <tbody>
                        {emails.map((email) => (
                          <tr key={email.id}>
                            <td>{email.fromName || email.from}</td>
                            <td>{email.subject}</td>
                            <td>{new Date(email.receivedDateTime).toLocaleDateString('fr-FR')}</td>
                            <td>
                              <span className={`badge ${email.isRead ? 'badge-info' : 'badge-warning'}`}>
                                {email.isRead ? 'Lu' : 'Non lu'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p>Aucun email trouvé.</p>
                )}
              </div>
            )}

            {activeTab === 'calendar' && (
              <div>
                <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3>Événements du calendrier</h3>
                  <button className="btn btn-secondary" onClick={loadEvents}>
                    <FiRefreshCw /> Actualiser
                  </button>
                </div>
                {events.length > 0 ? (
                  <div className="table-container">
                    <table>
                      <thead>
                        <tr>
                          <th>Sujet</th>
                          <th>Début</th>
                          <th>Fin</th>
                          <th>Lieu</th>
                        </tr>
                      </thead>
                      <tbody>
                        {events.map((event) => (
                          <tr key={event.id}>
                            <td>{event.subject}</td>
                            <td>{new Date(event.start).toLocaleString('fr-FR')}</td>
                            <td>{new Date(event.end).toLocaleString('fr-FR')}</td>
                            <td>{event.location}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p>Aucun événement trouvé.</p>
                )}
              </div>
            )}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <FiMail style={{ fontSize: '3rem', color: '#DC6B2F', marginBottom: '1rem' }} />
            <p style={{ marginBottom: '1.5rem' }}>
              Connectez-vous à Outlook pour synchroniser vos contacts, emails et événements du calendrier.
            </p>
            <button className="btn btn-primary" onClick={handleConnect}>
              <FiLink /> Se connecter à Outlook
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Outlook;
