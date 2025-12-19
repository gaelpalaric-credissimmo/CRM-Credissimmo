import React, { useState, useEffect } from 'react';
import { getStats, syncAllFromSheets, getGoogleSheetsStatus } from '../api/api';
import { FiUsers, FiUser, FiBriefcase, FiDollarSign, FiRefreshCw } from 'react-icons/fi';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    // Synchroniser depuis Google Sheets au chargement, puis charger les stats
    syncAndLoadStats();
  }, []);

  const syncAndLoadStats = async () => {
    try {
      // Vérifier si Google Sheets est connecté
      const statusResponse = await getGoogleSheetsStatus();
      if (statusResponse.data.connected && statusResponse.data.spreadsheetId) {
        // Synchroniser depuis Google Sheets
        setSyncing(true);
        try {
          await syncAllFromSheets();
          console.log('✅ Synchronisation depuis Google Sheets réussie');
        } catch (error) {
          console.error('Erreur lors de la synchronisation (non bloquante):', error);
          // Continuer même si la synchronisation échoue
        } finally {
          setSyncing(false);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du statut Google Sheets:', error);
      // Continuer même si la vérification échoue
    }

    // Charger les statistiques après la synchronisation
    await loadStats();
  };

  const loadStats = async () => {
    try {
      const response = await getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {syncing && <FiRefreshCw style={{ animation: 'spin 1s linear infinite' }} />}
          <span>{syncing ? 'Synchronisation depuis Google Sheets...' : 'Chargement...'}</span>
        </div>
      </div>
    );
  }

  if (!stats) {
    return <div className="card">Erreur lors du chargement des données</div>;
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  return (
    <div>
      <div className="card">
        <h2 className="card-title">Tableau de bord</h2>
      </div>

      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-label">Total Clients</div>
          <div className="stat-value">
            <FiUsers style={{ marginRight: '0.5rem' }} />
            {stats.totalClients}
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-label">Total Prospects</div>
          <div className="stat-value">
            <FiUser style={{ marginRight: '0.5rem' }} />
            {stats.totalProspects}
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-label">Total Opportunités</div>
          <div className="stat-value">
            <FiBriefcase style={{ marginRight: '0.5rem' }} />
            {stats.totalOpportunites}
          </div>
        </div>

        <div className="stat-card danger">
          <div className="stat-label">Montant Total</div>
          <div className="stat-value">
            <FiDollarSign style={{ marginRight: '0.5rem' }} />
            {formatCurrency(stats.montantTotal)}
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">Opportunités par statut</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div>
            <div className="stat-label">Nouvelles</div>
            <div className="stat-value">{stats.opportunitesParStatut.nouvelle}</div>
          </div>
          <div>
            <div className="stat-label">En cours</div>
            <div className="stat-value">{stats.opportunitesParStatut.enCours}</div>
          </div>
          <div>
            <div className="stat-label">Gagnées</div>
            <div className="stat-value">{stats.opportunitesParStatut.gagnee}</div>
          </div>
          <div>
            <div className="stat-label">Perdues</div>
            <div className="stat-value">{stats.opportunitesParStatut.perdue}</div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">Montant gagné</h3>
        <div className="stat-value" style={{ color: '#28a745' }}>
          {formatCurrency(stats.montantGagne)}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
