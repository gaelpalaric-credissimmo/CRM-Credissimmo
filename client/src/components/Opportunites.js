import React, { useState, useEffect } from 'react';
import { getOpportunites, getClients, createOpportunite, updateOpportunite, deleteOpportunite } from '../api/api';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiChevronRight, FiCheck } from 'react-icons/fi';

// Définition du workflow d'achat immobilier pour courtier en crédits
const WORKFLOW_STATUTS = [
  { value: 'prise_contact', label: 'Prise de contact', order: 1, color: 'info' },
  { value: 'qualification', label: 'Qualification / Analyse', order: 2, color: 'info' },
  { value: 'recherche_financement', label: 'Recherche de financement', order: 3, color: 'warning' },
  { value: 'proposition_envoyee', label: 'Proposition envoyée', order: 4, color: 'warning' },
  { value: 'proposition_acceptee', label: 'Proposition acceptée', order: 5, color: 'warning' },
  { value: 'constitution_dossier', label: 'Constitution du dossier', order: 6, color: 'warning' },
  { value: 'dossier_envoye_banque', label: 'Dossier envoyé à la banque', order: 7, color: 'warning' },
  { value: 'instruction_bancaire', label: 'Instruction bancaire', order: 8, color: 'warning' },
  { value: 'accord_principe', label: 'Accord de principe obtenu', order: 9, color: 'success' },
  { value: 'offre_pret_recue', label: 'Offre de prêt reçue', order: 10, color: 'success' },
  { value: 'offre_acceptee', label: 'Offre acceptée par le client', order: 11, color: 'success' },
  { value: 'signature', label: 'Signature', order: 12, color: 'success' },
  { value: 'deblocage_fonds', label: 'Déblocage des fonds', order: 13, color: 'success' },
  { value: 'facturation', label: 'Facturation', order: 14, color: 'success' },
  { value: 'annulee', label: 'Annulée', order: 99, color: 'danger' },
];

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
    statut: 'prise_contact',
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

  const getStatutInfo = (statut) => {
    return WORKFLOW_STATUTS.find(s => s.value === statut) || WORKFLOW_STATUTS[0];
  };

  const getStatutBadge = (statut) => {
    const info = getStatutInfo(statut);
    const badges = {
      info: 'badge-info',
      warning: 'badge-warning',
      success: 'badge-success',
      danger: 'badge-danger',
    };
    return badges[info.color] || 'badge-info';
  };

  const getStatutLabel = (statut) => {
    const info = getStatutInfo(statut);
    return info.label;
  };

  const getStatutSuivant = (statutActuel) => {
    const statutInfo = getStatutInfo(statutActuel);
    const index = WORKFLOW_STATUTS.findIndex(s => s.value === statutActuel);
    if (index < WORKFLOW_STATUTS.length - 1 && WORKFLOW_STATUTS[index + 1].order < 99) {
      return WORKFLOW_STATUTS[index + 1];
    }
    return null;
  };

  const getStatutPrecedent = (statutActuel) => {
    const index = WORKFLOW_STATUTS.findIndex(s => s.value === statutActuel);
    if (index > 0) {
      return WORKFLOW_STATUTS[index - 1];
    }
    return null;
  };

  const handleAvancerStatut = async (opportunite) => {
    const statutSuivant = getStatutSuivant(opportunite.statut);
    if (statutSuivant) {
      try {
        await updateOpportunite(opportunite.id, { statut: statutSuivant.value });
        loadData();
      } catch (error) {
        console.error('Erreur lors de la mise à jour:', error);
        alert('Erreur lors de la mise à jour du statut');
      }
    }
  };

  const handleReculerStatut = async (opportunite) => {
    const statutPrecedent = getStatutPrecedent(opportunite.statut);
    if (statutPrecedent) {
      try {
        await updateOpportunite(opportunite.id, { statut: statutPrecedent.value });
        loadData();
      } catch (error) {
        console.error('Erreur lors de la mise à jour:', error);
        alert('Erreur lors de la mise à jour du statut');
      }
    }
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
      statut: 'prise_contact',
      clientId: '',
      dateEcheance: '',
      probabilite: '0',
    });
  };

  if (loading) {
    return <div className="card">Chargement...</div>;
  }

  const getProgressionPourcentage = (statut) => {
    const statutInfo = getStatutInfo(statut);
    if (statutInfo.order >= 99) return 0; // Annulée
    const maxOrder = Math.max(...WORKFLOW_STATUTS.filter(s => s.order < 99).map(s => s.order));
    return Math.round((statutInfo.order / maxOrder) * 100);
  };

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Opportunités - Workflow Achat Immobilier</h2>
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
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <span className={`badge ${getStatutBadge(opportunite.statut)}`}>
                          {getStatutLabel(opportunite.statut)}
                        </span>
                        {opportunite.statut !== 'annulee' && (
                          <div style={{ 
                            width: '100px', 
                            height: '4px', 
                            backgroundColor: '#e0e0e0', 
                            borderRadius: '2px',
                            overflow: 'hidden'
                          }}>
                            <div style={{
                              width: `${getProgressionPourcentage(opportunite.statut)}%`,
                              height: '100%',
                              backgroundColor: opportunite.statut === 'facturation' ? '#28a745' : 
                                             opportunite.statut >= 'accord_principe' ? '#17a2b8' : '#ffc107',
                              transition: 'width 0.3s ease'
                            }} />
                          </div>
                        )}
                      </div>
                    </td>
                    <td>{opportunite.probabilite}%</td>
                    <td>
                      {opportunite.dateEcheance
                        ? new Date(opportunite.dateEcheance).toLocaleDateString('fr-FR')
                        : 'N/A'}
                    </td>
                    <td>
                      <div className="actions" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        {getStatutSuivant(opportunite.statut) && (
                          <button
                            className="btn-icon btn-success"
                            onClick={() => handleAvancerStatut(opportunite)}
                            title={`Passer à: ${getStatutSuivant(opportunite.statut).label}`}
                            style={{ color: '#28a745' }}
                          >
                            <FiChevronRight />
                          </button>
                        )}
                        {getStatutPrecedent(opportunite.statut) && (
                          <button
                            className="btn-icon"
                            onClick={() => handleReculerStatut(opportunite)}
                            title={`Revenir à: ${getStatutPrecedent(opportunite.statut).label}`}
                            style={{ transform: 'rotate(180deg)' }}
                          >
                            <FiChevronRight />
                          </button>
                        )}
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
                  {WORKFLOW_STATUTS.filter(s => s.order < 99).map((statut) => (
                    <option key={statut.value} value={statut.value}>
                      {statut.label}
                    </option>
                  ))}
                  <option value="annulee">Annulée</option>
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
