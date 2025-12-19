import React, { useState, useEffect } from 'react';
import { getClients, createClient, updateClient, deleteClient } from '../api/api';
import { getApporteurs } from '../api/api';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiUserCheck } from 'react-icons/fi';

function Clients() {
  const [clients, setClients] = useState([]);
  const [apporteurs, setApporteurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    entreprise: '',
    adresse: '',
    notes: '',
    apporteurId: '',
    etape: '',
    courtier: '',
    decision: '',
  });

  useEffect(() => {
    loadClients();
    loadApporteurs();
  }, []);

  const loadApporteurs = async () => {
    try {
      const response = await getApporteurs();
      setApporteurs(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des apporteurs:', error);
    }
  };

  const loadClients = async () => {
    try {
      const response = await getClients();
      setClients(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        apporteurId: formData.apporteurId || null
      };
      if (editingClient) {
        await updateClient(editingClient.id, dataToSend);
      } else {
        await createClient(dataToSend);
      }
      loadClients();
      handleCloseModal();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde du client');
    }
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setFormData({
      nom: client.nom || '',
      email: client.email || '',
      telephone: client.telephone || '',
      entreprise: client.entreprise || '',
      adresse: client.adresse || '',
      notes: client.notes || '',
      apporteurId: client.apporteurId || '',
      etape: client.etape || '',
      courtier: client.courtier || '',
      decision: client.decision || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      try {
        await deleteClient(id);
        loadClients();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression du client');
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingClient(null);
    setFormData({
      nom: '',
      email: '',
      telephone: '',
      entreprise: '',
      adresse: '',
      notes: '',
      apporteurId: '',
      etape: '',
      courtier: '',
      decision: '',
    });
  };

  const getApporteurName = (apporteurId) => {
    if (!apporteurId) return '-';
    const apporteur = apporteurs.find(a => a.id === apporteurId);
    return apporteur ? `${apporteur.prenom} ${apporteur.nom}` : '-';
  };

  if (loading) {
    return <div className="card">Chargement...</div>;
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Clients</h2>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <FiPlus /> Ajouter un client
          </button>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th>Entreprise</th>
                <th>Apporteur d'affaires</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                    Aucun client trouvé
                  </td>
                </tr>
              ) : (
                clients.map((client) => (
                  <tr key={client.id}>
                    <td>{client.nom}</td>
                    <td>{client.email}</td>
                    <td>{client.telephone}</td>
                    <td>{client.entreprise}</td>
                    <td>
                      {client.apporteurId ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <FiUserCheck />
                          {getApporteurName(client.apporteurId)}
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td>
                      <div className="actions">
                        <button
                          className="btn-icon"
                          onClick={() => handleEdit(client)}
                          title="Modifier"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          className="btn-icon"
                          onClick={() => handleDelete(client.id)}
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
                {editingClient ? 'Modifier le client' : 'Nouveau client'}
              </h3>
              <button className="modal-close" onClick={handleCloseModal}>
                <FiX />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nom *</label>
                <input
                  type="text"
                  required
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Téléphone</label>
                <input
                  type="tel"
                  value={formData.telephone}
                  onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Entreprise</label>
                <input
                  type="text"
                  value={formData.entreprise}
                  onChange={(e) => setFormData({ ...formData, entreprise: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Adresse</label>
                <textarea
                  value={formData.adresse}
                  onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Apporteur d'affaires</label>
                <select
                  value={formData.apporteurId}
                  onChange={(e) => setFormData({ ...formData, apporteurId: e.target.value })}
                >
                  <option value="">Aucun apporteur</option>
                  {apporteurs.map((apporteur) => (
                    <option key={apporteur.id} value={apporteur.id}>
                      {apporteur.prenom} {apporteur.nom} {apporteur.entreprise ? `(${apporteur.entreprise})` : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Étape</label>
                <select
                  value={formData.etape}
                  onChange={(e) => setFormData({ ...formData, etape: e.target.value })}
                >
                  <option value="">Sélectionner une étape</option>
                  <option value="Contrat Location">Contrat Location</option>
                  <option value="Contrat préliminaire">Contrat préliminaire</option>
                  <option value="Acquisition finale">Acquisition finale</option>
                </select>
              </div>
              <div className="form-group">
                <label>Courtier</label>
                <input
                  type="text"
                  value={formData.courtier}
                  onChange={(e) => setFormData({ ...formData, courtier: e.target.value })}
                  placeholder="Ex: Gaël, Cyril, Stéphanie..."
                />
              </div>
              <div className="form-group">
                <label>Décision</label>
                <select
                  value={formData.decision}
                  onChange={(e) => setFormData({ ...formData, decision: e.target.value })}
                >
                  <option value="">Sélectionner une décision</option>
                  <option value="Validé">Validé</option>
                  <option value="En cours">En cours</option>
                  <option value="Pas répondu">Pas répondu</option>
                  <option value="Annulé">Annulé</option>
                </select>
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingClient ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Clients;
