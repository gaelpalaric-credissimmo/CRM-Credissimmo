import React, { useState, useEffect } from 'react';
import { getOpportunites, getClients, createOpportunite, updateOpportunite, deleteOpportunite } from '../api/api';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';

function Opportunites() {
  const [opportunites, setOpportunites] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingOpportunite, setEditingOpportunite] = useState(null);
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    montant: '',
    statut: 'nouvelle',
    clientId: '',
    dateEcheance: '',
    probabilite: '0',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [opportunitesRes, clientsRes] = await Promise.all([
        getOpportunites(),
        getClients(),
      ]);
      setOpportunites(opportunitesRes.data);
      setClients(clientsRes.data);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const getClientName = (clientId) => {
    const client = clients.find((c) => c.id === clientId);
    return client ? client.nom : 'N/A';
  };

  const getStatutBadge = (statut) => {
    const badges = {
      nouvelle: 'badge-info',
      en_cours: 'badge-warning',
      gagnee: 'badge-success',
      perdue: 'badge-danger',
    };
    return badges[statut] || 'badge-info';
  };

  const getStatutLabel = (statut) => {
    const labels = {
      nouvelle: 'Nouvelle',
      en_cours: 'En cours',
      gagnee: 'Gagnée',
      perdue: 'Perdue',
    };
    return labels[statut] || statut;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingOpportunite) {
        await updateOpportunite(editingOpportunite.id, formData);
      } else {
        await createOpportunite(formData);
      }
      loadData();
      handleCloseModal();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde de l\'opportunité');
    }
  };

  const handleEdit = (opportunite) => {
    setEditingOpportunite(opportunite);
    setFormData({
      titre: opportunite.titre || '',
      description: opportunite.description || '',
      montant: opportunite.montant || '',
      statut: opportunite.statut || 'nouvelle',
      clientId: opportunite.clientId || '',
      dateEcheance: opportunite.dateEcheance ? opportunite.dateEcheance.split('T')[0] : '',
      probabilite: opportunite.probabilite || '0',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette opportunité ?')) {
      try {
        await deleteOpportunite(id);
        loadData();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression de l\'opportunité');
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingOpportunite(null);
    setFormData({
      titre: '',
      description: '',
      montant: '',
      statut: 'nouvelle',
      clientId: '',
      dateEcheance: '',
      probabilite: '0',
    });
  };

  if (loading) {
    return <div className="card">Chargement...</div>;
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Opportunités</h2>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <FiPlus /> Ajouter une opportunité
          </button>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Titre</th>
                <th>Client</th>
                <th>Montant</th>
                <th>Statut</th>
                <th>Probabilité</th>
                <th>Date d'échéance</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {opportunites.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                    Aucune opportunité trouvée
                  </td>
                </tr>
              ) : (
                opportunites.map((opportunite) => (
                  <tr key={opportunite.id}>
                    <td>{opportunite.titre}</td>
                    <td>{getClientName(opportunite.clientId)}</td>
                    <td>{formatCurrency(opportunite.montant)}</td>
                    <td>
                      <span className={`badge ${getStatutBadge(opportunite.statut)}`}>
                        {getStatutLabel(opportunite.statut)}
                      </span>
                    </td>
                    <td>{opportunite.probabilite}%</td>
                    <td>
                      {opportunite.dateEcheance
                        ? new Date(opportunite.dateEcheance).toLocaleDateString('fr-FR')
                        : 'N/A'}
                    </td>
                    <td>
                      <div className="actions">
                        <button
                          className="btn-icon"
                          onClick={() => handleEdit(opportunite)}
                          title="Modifier"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          className="btn-icon"
                          onClick={() => handleDelete(opportunite.id)}
                          title="Supprimer"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                {editingOpportunite ? 'Modifier l\'opportunité' : 'Nouvelle opportunité'}
              </h3>
              <button className="modal-close" onClick={handleCloseModal}>
                <FiX />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Titre *</label>
                <input
                  type="text"
                  required
                  value={formData.titre}
                  onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Client</label>
                <select
                  value={formData.clientId}
                  onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                >
                  <option value="">Sélectionner un client</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.nom}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Montant (€)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.montant}
                  onChange={(e) => setFormData({ ...formData, montant: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Statut</label>
                <select
                  value={formData.statut}
                  onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
                >
                  <option value="nouvelle">Nouvelle</option>
                  <option value="en_cours">En cours</option>
                  <option value="gagnee">Gagnée</option>
                  <option value="perdue">Perdue</option>
                </select>
              </div>
              <div className="form-group">
                <label>Probabilité (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.probabilite}
                  onChange={(e) => setFormData({ ...formData, probabilite: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Date d'échéance</label>
                <input
                  type="date"
                  value={formData.dateEcheance}
                  onChange={(e) => setFormData({ ...formData, dateEcheance: e.target.value })}
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingOpportunite ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Opportunites;
