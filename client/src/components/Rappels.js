import React, { useState, useEffect } from 'react';
import { getRappels, genererRappels, resoudreRappel, deleteRappel, getClients, getOpportunites } from '../api/api';
import { FiBell, FiCheck, FiTrash2, FiRefreshCw, FiAlertCircle, FiAlertTriangle, FiInfo, FiX } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const PRIORITE_ICONS = {
  urgente: FiAlertCircle,
  haute: FiAlertTriangle,
  moyenne: FiInfo,
  basse: FiInfo,
};

const PRIORITE_COLORS = {
  urgente: '#dc3545',
  haute: '#ff9800',
  moyenne: '#17a2b8',
  basse: '#6c757d',
};

const TYPE_LABELS = {
  echeance_approchant: 'Échéance approchant',
  echeance_aujourdhui: 'Échéance aujourd\'hui',
  statut_bloque: 'Statut bloqué',
  relance_proposition: 'Relance proposition',
  relance_instruction: 'Relance instruction',
  pas_de_contact: 'Pas de contact',
  signature_approchant: 'Signature approchant',
  deblocage_approchant: 'Déblocage approchant',
  facturation_a_faire: 'Facturation à faire',
  documents_manquants: 'Documents manquants',
};

function Rappels() {
  const [rappels, setRappels] = useState([]);
  const [clients, setClients] = useState([]);
  const [opportunites, setOpportunites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('actifs'); // 'actifs', 'resolus', 'tous'
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadData();
    // Recharger les rappels toutes les 5 minutes
    const interval = setInterval(loadRappels, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [filter]);

  const loadData = async () => {
    try {
      await Promise.all([
        loadRappels(),
        loadClients(),
        loadOpportunites(),
      ]);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRappels = async () => {
    try {
      const resolu = filter === 'actifs' ? 'false' : filter === 'resolus' ? 'true' : undefined;
      const response = await getRappels(resolu);
      setRappels(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des rappels:', error);
    }
  };

  const loadClients = async () => {
    try {
      const response = await getClients();
      setClients(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des clients:', error);
    }
  };

  const loadOpportunites = async () => {
    try {
      const response = await getOpportunites();
      setOpportunites(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des opportunités:', error);
    }
  };

  const handleGenererRappels = async () => {
    setGenerating(true);
    try {
      const response = await genererRappels();
      alert(response.data.message);
      loadRappels();
    } catch (error) {
      console.error('Erreur lors de la génération:', error);
      alert('Erreur lors de la génération des rappels');
    } finally {
      setGenerating(false);
    }
  };

  const handleResoudre = async (id) => {
    try {
      await resoudreRappel(id);
      loadRappels();
    } catch (error) {
      console.error('Erreur lors de la résolution:', error);
      alert('Erreur lors de la résolution du rappel');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce rappel ?')) {
      try {
        await deleteRappel(id);
        loadRappels();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression du rappel');
      }
    }
  };

  const getClientName = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.nom : 'N/A';
  };

  const getOpportuniteTitre = (opportuniteId) => {
    const opportunite = opportunites.find(o => o.id === opportuniteId);
    return opportunite ? opportunite.titre : 'N/A';
  };

  const rappelsFiltres = rappels.filter(r => {
    if (filter === 'actifs') return !r.resolu;
    if (filter === 'resolus') return r.resolu;
    return true;
  });

  const rappelsUrgents = rappelsFiltres.filter(r => r.priorite === 'urgente' && !r.resolu).length;
  const rappelsHauts = rappelsFiltres.filter(r => r.priorite === 'haute' && !r.resolu).length;

  if (loading) {
    return <div className="card">Chargement...</div>;
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">
              <FiBell style={{ marginRight: '0.5rem' }} />
              Rappels
            </h2>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
              {rappelsUrgents > 0 && (
                <span className="badge badge-danger">
                  {rappelsUrgents} urgent(s)
                </span>
              )}
              {rappelsHauts > 0 && (
                <span className="badge badge-warning">
                  {rappelsHauts} important(s)
                </span>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              className="btn btn-secondary"
              onClick={handleGenererRappels}
              disabled={generating}
            >
              <FiRefreshCw style={{ animation: generating ? 'spin 1s linear infinite' : 'none' }} />
              {generating ? 'Génération...' : 'Générer les rappels'}
            </button>
          </div>
        </div>

        <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
          <button
            className={`btn ${filter === 'actifs' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('actifs')}
          >
            Actifs ({rappels.filter(r => !r.resolu).length})
          </button>
          <button
            className={`btn ${filter === 'resolus' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('resolus')}
          >
            Résolus ({rappels.filter(r => r.resolu).length})
          </button>
          <button
            className={`btn ${filter === 'tous' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('tous')}
          >
            Tous ({rappels.length})
          </button>
        </div>

        {rappelsFiltres.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <FiBell style={{ fontSize: '3rem', color: '#ccc', marginBottom: '1rem' }} />
            <p>Aucun rappel {filter === 'actifs' ? 'actif' : filter === 'resolus' ? 'résolu' : ''}</p>
            {filter === 'actifs' && (
              <button className="btn btn-primary" onClick={handleGenererRappels} style={{ marginTop: '1rem' }}>
                Générer les rappels automatiques
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {rappelsFiltres.map((rappel) => {
              const PrioriteIcon = PRIORITE_ICONS[rappel.priorite] || FiInfo;
              const prioriteColor = PRIORITE_COLORS[rappel.priorite] || '#6c757d';
              
              return (
                <div
                  key={rappel.id}
                  className="card"
                  style={{
                    borderLeft: `4px solid ${prioriteColor}`,
                    opacity: rappel.resolu ? 0.6 : 1,
                    backgroundColor: rappel.resolu ? '#f8f9fa' : 'white',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <PrioriteIcon style={{ color: prioriteColor }} />
                        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{rappel.titre}</h3>
                        <span
                          className="badge"
                          style={{
                            backgroundColor: prioriteColor,
                            color: 'white',
                            fontSize: '0.75rem',
                          }}
                        >
                          {TYPE_LABELS[rappel.type] || rappel.type}
                        </span>
                        {rappel.resolu && (
                          <span className="badge badge-success">Résolu</span>
                        )}
                      </div>
                      <p style={{ margin: '0.5rem 0', color: '#666' }}>{rappel.description}</p>
                      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', color: '#999', flexWrap: 'wrap' }}>
                        {rappel.clientId && (
                          <span>
                            Client: <strong>{getClientName(rappel.clientId)}</strong>
                          </span>
                        )}
                        {rappel.opportuniteId && (
                          <span>
                            Opportunité: <strong>{getOpportuniteTitre(rappel.opportuniteId)}</strong>
                          </span>
                        )}
                        <span>
                          Créé le: {new Date(rappel.dateCreation).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        {rappel.dateResolution && (
                          <span>
                            Résolu le: {new Date(rappel.dateResolution).toLocaleDateString('fr-FR')}
                          </span>
                        )}
                      </div>
                      {rappel.opportuniteId && !rappel.resolu && (
                        <div style={{ marginTop: '0.5rem' }}>
                          <Link
                            to={`/opportunites`}
                            className="btn btn-sm btn-primary"
                            style={{ fontSize: '0.85rem' }}
                          >
                            Voir l'opportunité
                          </Link>
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
                      {!rappel.resolu && (
                        <button
                          className="btn-icon btn-success"
                          onClick={() => handleResoudre(rappel.id)}
                          title="Marquer comme résolu"
                        >
                          <FiCheck />
                        </button>
                      )}
                      <button
                        className="btn-icon"
                        onClick={() => handleDelete(rappel.id)}
                        title="Supprimer"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Rappels;




