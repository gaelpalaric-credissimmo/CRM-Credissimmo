import React, { useState, useEffect } from 'react';
import { getStats } from '../api/api';
import { FiUsers, FiUser, FiBriefcase, FiDollarSign } from 'react-icons/fi';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

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
    return <div className="card">Chargement...</div>;
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
          <div className="stat-label">Total Contacts</div>
          <div className="stat-value">
            <FiUser style={{ marginRight: '0.5rem' }} />
            {stats.totalContacts}
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
