import React, { useState, useEffect } from 'react';
import { getContacts, getClients, createContact, updateContact, deleteContact } from '../api/api';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';

function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    poste: '',
    clientId: '',
    notes: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [contactsRes, clientsRes] = await Promise.all([
        getContacts(),
        getClients(),
      ]);
      setContacts(contactsRes.data);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingContact) {
        await updateContact(editingContact.id, formData);
      } else {
        await createContact(formData);
      }
      loadData();
      handleCloseModal();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde du contact');
    }
  };

  const handleEdit = (contact) => {
    setEditingContact(contact);
    setFormData({
      nom: contact.nom || '',
      prenom: contact.prenom || '',
      email: contact.email || '',
      telephone: contact.telephone || '',
      poste: contact.poste || '',
      clientId: contact.clientId || '',
      notes: contact.notes || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce contact ?')) {
      try {
        await deleteContact(id);
        loadData();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression du contact');
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingContact(null);
    setFormData({
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      poste: '',
      clientId: '',
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
          <h2 className="card-title">Contacts</h2>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <FiPlus /> Ajouter un contact
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
                <th>Poste</th>
                <th>Client</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                    Aucun contact trouvé
                  </td>
                </tr>
              ) : (
                contacts.map((contact) => (
                  <tr key={contact.id}>
                    <td>{contact.nom}</td>
                    <td>{contact.prenom}</td>
                    <td>{contact.email}</td>
                    <td>{contact.telephone}</td>
                    <td>{contact.poste}</td>
                    <td>{getClientName(contact.clientId)}</td>
                    <td>
                      <div className="actions">
                        <button
                          className="btn-icon"
                          onClick={() => handleEdit(contact)}
                          title="Modifier"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          className="btn-icon"
                          onClick={() => handleDelete(contact.id)}
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
                {editingContact ? 'Modifier le contact' : 'Nouveau contact'}
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
                <label>Prénom</label>
                <input
                  type="text"
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
                <label>Poste</label>
                <input
                  type="text"
                  value={formData.poste}
                  onChange={(e) => setFormData({ ...formData, poste: e.target.value })}
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
                  {editingContact ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Contacts;
