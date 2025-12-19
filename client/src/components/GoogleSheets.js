import React, { useState, useEffect } from 'react';
import { 
  connectGoogleSheets, 
  getGoogleSheetsStatus, 
  configGoogleSheets,
  syncClientsToSheets,
  syncProspectsToSheets,
  syncAllFromSheets,
  disconnectGoogleSheets
} from '../api/api';
import { getClients } from '../api/api';
import { getProspects } from '../api/api';
import { FiLink, FiLogOut, FiRefreshCw, FiCheckCircle, FiXCircle, FiUpload, FiDownload, FiSettings } from 'react-icons/fi';

function GoogleSheets() {
  const [status, setStatus] = useState({ connected: false, loading: true });
  const [spreadsheetId, setSpreadsheetId] = useState('');
  const [tempSpreadsheetId, setTempSpreadsheetId] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState(null);
  const [configStatus, setConfigStatus] = useState(null);
  const [redirectUriUsed, setRedirectUriUsed] = useState(null);

  useEffect(() => {
    checkStatus();
    
    // Vérifier si on revient de l'authentification
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const error = urlParams.get('error');
    const refreshToken = urlParams.get('refresh_token');

    if (success === 'true') {
      checkStatus();
      if (refreshToken === 'present') {
        // Afficher un message pour ajouter le refresh token aux variables d'environnement
        setTimeout(() => {
          alert('✅ Connexion réussie !\n\n⚠️ IMPORTANT pour la reconnexion automatique:\n\nAjoutez le refresh token aux variables d\'environnement sur Render:\n1. Allez sur Render Dashboard > Votre service > Environment\n2. Ajoutez: GOOGLE_REFRESH_TOKEN\n3. La valeur se trouve dans les logs du serveur\n\nCela permettra la reconnexion automatique même après un redéploiement.');
        }, 1000);
      }
      window.history.replaceState({}, document.title, '/googlesheets');
    } else if (error) {
      alert(`Erreur d'authentification: ${error}`);
      window.history.replaceState({}, document.title, '/googlesheets');
    }
  }, []);

  const checkStatus = async () => {
    try {
      const response = await getGoogleSheetsStatus();
      setStatus({ connected: response.data.connected, loading: false });
      if (response.data.spreadsheetId) {
        setSpreadsheetId(response.data.spreadsheetId);
        setTempSpreadsheetId(response.data.spreadsheetId);
      }
      
      // Afficher les informations de configuration pour debug
      if (response.data.config) {
        setConfigStatus(response.data.config);
        setRedirectUriUsed(response.data.config.redirectUri);
        console.log('📊 Configuration Google Sheets:', response.data.config);
        console.log('📊 État des variables:', {
          GOOGLE_CLIENT_ID: response.data.config.hasClientId ? '✅ Configuré' : '❌ MANQUANT',
          GOOGLE_CLIENT_SECRET: response.data.config.hasClientSecret ? '✅ Configuré' : '❌ MANQUANT',
          GOOGLE_REDIRECT_URI: response.data.config.redirectUri || 'Non configuré',
          NODE_ENV: response.data.config.nodeEnv || 'Non défini'
        });
        console.log('🔗 URI de redirection qui sera utilisée:', response.data.config.redirectUri);
        console.log('⚠️ Cette URI doit correspondre EXACTEMENT à celle dans Google Cloud Console');
        
        if (!response.data.config.hasClientId || !response.data.config.hasClientSecret) {
          console.warn('⚠️ ATTENTION: Variables d\'environnement manquantes sur Render!');
          console.warn('Veuillez configurer GOOGLE_CLIENT_ID et GOOGLE_CLIENT_SECRET dans les variables d\'environnement de votre service Render.');
        }
      } else {
        // Si pas de config, créer un statut par défaut
        setConfigStatus({
          hasClientId: false,
          hasClientSecret: false,
          redirectUri: 'Non configuré'
        });
      }
    } catch (error) {
      console.error('❌ Erreur lors de la vérification du statut:', error);
      console.error('Détails:', error.response?.data || error.message);
      setStatus({ connected: false, loading: false });
      // En cas d'erreur, supposer que la config est manquante
      setConfigStatus({
        hasClientId: false,
        hasClientSecret: false,
        redirectUri: 'Erreur de connexion au serveur'
      });
    }
  };

  const handleConnect = async () => {
    try {
      const response = await connectGoogleSheets();
      if (response.data.authUrl) {
        // Afficher l'URI de redirection pour debug
        if (response.data.redirectUri) {
          console.log('🔗 URI de redirection utilisée par le backend:', response.data.redirectUri);
          console.log('⚠️ IMPORTANT: Cette URI doit correspondre EXACTEMENT à celle dans Google Cloud Console');
          console.log('📋 URI à vérifier dans Google Cloud Console:', response.data.redirectUri);
        }
        window.location.href = response.data.authUrl;
      } else {
        alert('Erreur : URL d\'authentification non reçue');
      }
    } catch (error) {
      console.error('Erreur complète lors de la connexion:', error);
      console.error('Réponse du serveur:', error.response?.data);
      console.error('Status HTTP:', error.response?.status);
      
      const errorData = error.response?.data;
      let errorMsg = 'Erreur lors de la connexion à Google Sheets';
      let details = '';
      
      if (errorData?.error) {
        errorMsg = errorData.error;
        if (errorData.details) {
          details = `\n\nDétails de la configuration:\n- GOOGLE_CLIENT_ID: ${errorData.details.GOOGLE_CLIENT_ID}\n- GOOGLE_CLIENT_SECRET: ${errorData.details.GOOGLE_CLIENT_SECRET}`;
        }
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      // Afficher un message d'erreur plus détaillé
      const fullErrorMsg = `❌ ${errorMsg}${details}\n\n📋 Actions à effectuer:\n1. Allez sur Render Dashboard\n2. Sélectionnez votre service backend\n3. Allez dans "Environment"\n4. Ajoutez les variables:\n   - GOOGLE_CLIENT_ID\n   - GOOGLE_CLIENT_SECRET\n   - GOOGLE_REDIRECT_URI (optionnel)\n5. Attendez le redéploiement\n6. Rechargez cette page`;
      
      alert(fullErrorMsg);
      
      // Mettre à jour le statut de configuration pour afficher l'alerte dans l'UI
      if (!configStatus) {
        setConfigStatus({
          hasClientId: false,
          hasClientSecret: false,
          redirectUri: 'Non configuré'
        });
      }
    }
  };

  const handleConfig = async () => {
    if (!tempSpreadsheetId.trim()) {
      alert('Veuillez entrer un Spreadsheet ID');
      return;
    }

    try {
      await configGoogleSheets(tempSpreadsheetId);
      setSpreadsheetId(tempSpreadsheetId);
      alert('Configuration sauvegardée avec succès');
    } catch (error) {
      console.error('Erreur lors de la configuration:', error);
      alert('Erreur lors de la sauvegarde de la configuration');
    }
  };

  const handleSyncToSheets = async () => {
    setSyncing(true);
    setSyncResult(null);
    try {
      // Récupérer les données du CRM
      const [clientsResponse, prospectsResponse] = await Promise.all([
        getClients(),
        getProspects()
      ]);

      // Synchroniser vers Google Sheets
      await Promise.all([
        syncClientsToSheets(clientsResponse.data),
        syncProspectsToSheets(prospectsResponse.data)
      ]);

      setSyncResult({
        success: true,
        message: `Synchronisation réussie : ${clientsResponse.data.length} clients et ${prospectsResponse.data.length} prospects exportés vers Google Sheets`
      });
    } catch (error) {
      console.error('Erreur lors de la synchronisation:', error);
      setSyncResult({
        success: false,
        message: 'Erreur lors de la synchronisation vers Google Sheets: ' + (error.response?.data?.error || error.message)
      });
    } finally {
      setSyncing(false);
    }
  };

  const handleSyncFromSheets = async () => {
    setSyncing(true);
    setSyncResult(null);
    try {
      const response = await syncAllFromSheets();
      setSyncResult({
        success: true,
        message: `Synchronisation réussie : ${response.data.clients.length} clients et ${response.data.prospects.length} prospects importés depuis Google Sheets`
      });
      
      // Recharger la page pour voir les nouvelles données
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('Erreur lors de la synchronisation:', error);
      setSyncResult({
        success: false,
        message: 'Erreur lors de la synchronisation depuis Google Sheets: ' + (error.response?.data?.error || error.message)
      });
    } finally {
      setSyncing(false);
    }
  };

  const handleDisconnect = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter de Google Sheets ?')) {
      try {
        await disconnectGoogleSheets();
        setStatus({ connected: false, loading: false });
        setSpreadsheetId('');
        setTempSpreadsheetId('');
      } catch (error) {
        console.error('Erreur lors de la déconnexion:', error);
        alert('Erreur lors de la déconnexion');
      }
    }
  };

  if (status.loading) {
    return <div className="card">Chargement...</div>;
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Synchronisation Google Sheets</h2>
          {status.connected && (
            <button className="btn btn-danger" onClick={handleDisconnect}>
              <FiLogOut /> Déconnecter
            </button>
          )}
        </div>

        {!status.connected ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <FiSettings style={{ fontSize: '3rem', color: '#DC6B2F', marginBottom: '1rem' }} />
            <p style={{ marginBottom: '1.5rem' }}>
              Connectez-vous à Google Sheets pour synchroniser vos données CRM.
            </p>
            
            {/* Affichage de l'URI de redirection utilisée */}
            {redirectUriUsed && (
              <div style={{ 
                marginBottom: '1.5rem', 
                padding: '1rem', 
                background: '#e7f3ff', 
                borderRadius: '8px', 
                border: '1px solid #b3d9ff'
              }}>
                <strong style={{ display: 'block', marginBottom: '0.5rem', color: '#004085' }}>
                  🔗 URI de redirection utilisée :
                </strong>
                <code style={{ 
                  display: 'block', 
                  padding: '0.5rem', 
                  background: 'white', 
                  borderRadius: '4px',
                  fontFamily: 'monospace',
                  fontSize: '0.9rem',
                  wordBreak: 'break-all',
                  color: '#004085'
                }}>
                  {redirectUriUsed}
                </code>
                <p style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: '#004085', marginBottom: 0 }}>
                  ⚠️ <strong>Important :</strong> Cette URI doit correspondre <strong>EXACTEMENT</strong> à celle dans Google Cloud Console (APIs et services > Identifiants > Votre ID client OAuth > URI de redirection autorisés)
                </p>
              </div>
            )}

            {/* Affichage de l'état de la configuration */}
            {configStatus && (!configStatus.hasClientId || !configStatus.hasClientSecret) && (
              <div style={{ 
                marginBottom: '2rem', 
                padding: '1.5rem', 
                background: '#fff3cd', 
                borderRadius: '8px', 
                textAlign: 'left',
                border: '2px solid #ffc107'
              }}>
                <h4 style={{ marginTop: '0', marginBottom: '1rem', color: '#856404', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>⚠️</span>
                  Configuration Google OAuth incomplète
                </h4>
                <p style={{ marginBottom: '1rem', color: '#856404', fontWeight: 'bold' }}>
                  Les variables d'environnement suivantes ne sont pas configurées sur Render :
                </p>
                <div style={{ 
                  background: 'white', 
                  padding: '1rem', 
                  borderRadius: '4px', 
                  marginBottom: '1rem',
                  fontFamily: 'monospace',
                  fontSize: '0.9rem'
                }}>
                  <div style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.2rem' }}>{configStatus.hasClientId ? '✅' : '❌'}</span>
                    <strong>GOOGLE_CLIENT_ID</strong>: 
                    <span style={{ color: configStatus.hasClientId ? '#28a745' : '#dc3545', marginLeft: '0.5rem' }}>
                      {configStatus.hasClientId ? 'Configuré' : 'MANQUANT'}
                    </span>
                  </div>
                  <div style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.2rem' }}>{configStatus.hasClientSecret ? '✅' : '❌'}</span>
                    <strong>GOOGLE_CLIENT_SECRET</strong>: 
                    <span style={{ color: configStatus.hasClientSecret ? '#28a745' : '#dc3545', marginLeft: '0.5rem' }}>
                      {configStatus.hasClientSecret ? 'Configuré' : 'MANQUANT'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.2rem' }}>ℹ️</span>
                    <strong>GOOGLE_REDIRECT_URI</strong>: 
                    <code style={{ marginLeft: '0.5rem', color: '#666' }}>
                      {configStatus.redirectUri || 'Non configuré (sera généré automatiquement)'}
                    </code>
                  </div>
                </div>
                <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '4px', marginTop: '1rem', border: '1px solid #dee2e6' }}>
                  <strong style={{ color: '#856404', display: 'block', marginBottom: '0.75rem' }}>
                    📋 Instructions pour corriger :
                  </strong>
                  <ol style={{ marginTop: '0.5rem', paddingLeft: '1.5rem', color: '#856404', fontSize: '0.9rem', lineHeight: '1.8' }}>
                    <li>Connectez-vous à <a href="https://dashboard.render.com" target="_blank" rel="noopener noreferrer" style={{ color: '#007bff' }}>Render Dashboard</a></li>
                    <li>Sélectionnez votre service backend (celui qui héberge votre API)</li>
                    <li>Cliquez sur l'onglet <strong>"Environment"</strong> dans le menu de gauche</li>
                    <li>Ajoutez les variables suivantes :
                      <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                        <li><code>GOOGLE_CLIENT_ID</code> : Votre Client ID depuis Google Cloud Console</li>
                        <li><code>GOOGLE_CLIENT_SECRET</code> : Votre Client Secret depuis Google Cloud Console</li>
                        <li><code>GOOGLE_REDIRECT_URI</code> : <code>https://votre-app.onrender.com/api/googlesheets/callback</code> (remplacez par votre URL Render)</li>
                      </ul>
                    </li>
                    <li>Cliquez sur <strong>"Save Changes"</strong> - Render redéploiera automatiquement</li>
                    <li>Attendez la fin du déploiement (2-3 minutes)</li>
                    <li>Rechargez cette page</li>
                  </ol>
                  <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#e7f3ff', borderRadius: '4px', fontSize: '0.85rem' }}>
                    <strong>💡 Astuce :</strong> Si vous n'avez pas encore créé les identifiants Google OAuth, consultez le guide <code>GOOGLE_SHEETS_SETUP.md</code> dans votre projet.
                  </div>
                </div>
              </div>
            )}
            
            <button 
              className="btn btn-primary" 
              onClick={handleConnect}
              disabled={configStatus && (!configStatus.hasClientId || !configStatus.hasClientSecret)}
            >
              <FiLink /> Se connecter à Google
            </button>
            
            {configStatus && configStatus.hasClientId && configStatus.hasClientSecret && (
              <div style={{ marginTop: '2rem', padding: '1rem', background: '#d4edda', borderRadius: '8px', fontSize: '0.9rem', color: '#155724' }}>
                ✓ Configuration détectée. Vous pouvez vous connecter.
              </div>
            )}
          </div>
        ) : (
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
              <strong>Connecté à Google Sheets</strong>
            </div>

            {/* Configuration du Spreadsheet ID */}
            <div style={{ marginBottom: '2rem', padding: '1.5rem', background: '#f8f9fa', borderRadius: '8px' }}>
              <h3 style={{ marginBottom: '1rem' }}>Configuration</h3>
              <div className="form-group">
                <label>Spreadsheet ID</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    value={tempSpreadsheetId}
                    onChange={(e) => setTempSpreadsheetId(e.target.value)}
                    placeholder="Ex: 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                    style={{ flex: 1 }}
                  />
                  <button className="btn btn-primary" onClick={handleConfig}>
                    <FiSettings /> Sauvegarder
                  </button>
                </div>
                <small style={{ color: '#666', fontSize: '0.85rem', display: 'block', marginTop: '0.5rem' }}>
                  Trouvez le Spreadsheet ID dans l'URL de votre Google Sheet : 
                  https://docs.google.com/spreadsheets/d/<strong>SPREADSHEET_ID</strong>/edit
                </small>
              </div>
              {spreadsheetId && (
                <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'white', borderRadius: '4px' }}>
                  <strong>Spreadsheet configuré :</strong> {spreadsheetId}
                </div>
              )}
            </div>

            {/* Actions de synchronisation */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>Synchronisation</h3>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button 
                  className="btn btn-primary" 
                  onClick={handleSyncToSheets}
                  disabled={syncing || !spreadsheetId}
                >
                  <FiUpload /> Exporter vers Google Sheets
                </button>
                <button 
                  className="btn btn-primary" 
                  onClick={handleSyncFromSheets}
                  disabled={syncing || !spreadsheetId}
                >
                  <FiDownload /> Importer depuis Google Sheets
                </button>
              </div>
              {syncing && (
                <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FiRefreshCw style={{ animation: 'spin 1s linear infinite' }} />
                  <span>Synchronisation en cours...</span>
                </div>
              )}
            </div>

            {/* Résultat de la synchronisation */}
            {syncResult && (
              <div style={{
                padding: '1rem',
                background: syncResult.success ? '#d4edda' : '#f8d7da',
                borderRadius: '8px',
                color: syncResult.success ? '#155724' : '#721c24',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                {syncResult.success ? <FiCheckCircle /> : <FiXCircle />}
                {syncResult.message}
              </div>
            )}

            {/* Instructions */}
            <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#e7f3ff', borderRadius: '8px' }}>
              <h4 style={{ marginBottom: '1rem' }}>Instructions</h4>
              <ol style={{ paddingLeft: '1.5rem', lineHeight: '1.8' }}>
                <li>Créez un Google Sheet ou utilisez un existant</li>
                <li>Copiez le Spreadsheet ID depuis l'URL et collez-le ci-dessus</li>
                <li>Cliquez sur "Sauvegarder" pour configurer le spreadsheet</li>
                <li>Utilisez "Exporter vers Google Sheets" pour synchroniser vos données CRM vers Google Sheets</li>
                <li>Utilisez "Importer depuis Google Sheets" pour charger les données depuis Google Sheets vers le CRM</li>
              </ol>
              <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>
                Note : Le Google Sheet doit avoir deux feuilles nommées "Clients" et "Prospects" avec les en-têtes appropriés.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GoogleSheets;

