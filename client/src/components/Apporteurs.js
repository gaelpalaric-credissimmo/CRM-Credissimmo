import React, { useState, useEffect } from 'react';
import { getApporteurs, createApporteur, updateApporteur, deleteApporteur } from '../api/api';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiDollarSign } from 'react-icons/fi';

function Apporteurs() {
  const [apporteurs, setApporteurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingApporteur, setEditingApporteur] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    entreprise: '',
    commission: '',
    notes: '',
  });

  useEffect(() => {
    loadApporteurs();
  }, []);

  const loadApporteurs = async () => {
    try {
      const response = await getApporteurs();
      setApporteurs(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des apporteurs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingApporteur) {
        await updateApporteur(editingApporteur.id, formData);
      } else {
        await createApporteur(formData);
      }
      loadApporteurs();
      handleCloseModal();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde de l\'apporteur d\'affaires');
    }
  };

  const handleEdit = (apporteur) => {
    setEditingApporteur(apporteur);
    setFormData({
      nom: apporteur.nom || '',
      prenom: apporteur.prenom || '',
      email: apporteur.email || '',
      telephone: apporteur.telephone || '',
      entreprise: apporteur.entreprise || '',
      commission: apporteur.commission || '',
      notes: apporteur.notes || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet apporteur d\'affaires ?')) {
      try {
        await deleteApporteur(id);
        loadApporteurs();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression de l\'apporteur d\'affaires');
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingApporteur(null);
    setFormData({
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      entreprise: '',
      commission: '',
      notes: '',
    });
  };

  if (loading) {
    return <div className="card">Chargement...</div>;
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Apporteurs d'affaires</h2>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <FiPlus /> Ajouter un apporteur
          </button>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th>Entreprise</th>
                <th>Commission</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {apporteurs.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                    Aucun apporteur d'affaires trouvé
                  </td>
                </tr>
              ) : (
                apporteurs.map((apporteur) => (
                  <tr key={apporteur.id}>
                    <td>{apporteur.nom}</td>
                    <td>{apporteur.prenom}</td>
                    <td>{apporteur.email}</td>
                    <td>{apporteur.telephone}</td>
                    <td>{apporteur.entreprise}</td>
                    <td>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <FiDollarSign />
                        {apporteur.commission ? `${apporteur.commission}%` : '-'}
                      </span>
                    </td>
                    <td>
                      <div className="actions">
                        <button
                          className="btn-icon"
                          onClick={() => handleEdit(apporteur)}
                          title="Modifier"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          className="btn-icon"
                          onClick={() => handleDelete(apporteur.id)}
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
                {editingApporteur ? 'Modifier l\'apporteur' : 'Nouvel apporteur d\'affaires'}
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
                <label>Prénom *</label>
                <input
                  type="text"
                  required
                  value={formData.prenom}
                  onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
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
                <label>Commission (%)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={formData.commission}
                  onChange={(e) => setFormData({ ...formData, commission: e.target.value })}
                  placeholder="0.00"
                />
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
                  {editingApporteur ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Apporteurs;

