import React, { useState, useEffect } from 'react';
import { 
  getEmailTemplates, 
  createEmailTemplate, 
  updateEmailTemplate, 
  deleteEmailTemplate,
  sendEmailFromTemplate,
  getClients,
  getOpportunites
} from '../api/api';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiMail, FiSend, FiSave } from 'react-icons/fi';

function EmailTemplates() {
  const [templates, setTemplates] = useState([]);
  const [clients, setClients] = useState([]);
  const [opportunites, setOpportunites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    sujet: '',
    corps: '',
    variables: []
  });
  const [sendData, setSendData] = useState({
    clientId: '',
    opportuniteId: '',
    destinataire: '',
    variablesSupplementaires: {}
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [templatesRes, clientsRes, opportunitesRes] = await Promise.all([
        getEmailTemplates(),
        getClients(),
        getOpportunites()
      ]);
      setTemplates(templatesRes.data);
      setClients(clientsRes.data);
      setOpportunites(opportunitesRes.data);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTemplate) {
        await updateEmailTemplate(editingTemplate.id, formData);
      } else {
        await createEmailTemplate(formData);
      }
      loadData();
      handleCloseModal();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde du template');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce template ?')) {
      try {
        await deleteEmailTemplate(id);
        loadData();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression du template');
      }
    }
  };

  const handleEdit = (template) => {
    setEditingTemplate(template);
    setFormData({
      nom: template.nom || '',
      sujet: template.sujet || '',
      corps: template.corps || '',
      variables: template.variables || []
    });
    setShowModal(true);
  };

  const handleSend = (template) => {
    setSelectedTemplate(template);
    const client = clients.find(c => c.id === sendData.clientId);
    setSendData({
      ...sendData,
      destinataire: client?.email || ''
    });
    setShowSendModal(true);
  };

  const handleSendEmail = async () => {
    try {
      await sendEmailFromTemplate(selectedTemplate.id, sendData);
      alert('Email envoyé avec succès !');
      setShowSendModal(false);
      setSendData({
        clientId: '',
        opportuniteId: '',
        destinataire: '',
        variablesSupplementaires: {}
      });
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      alert('Erreur lors de l\'envoi de l\'email: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTemplate(null);
    setFormData({
      nom: '',
      sujet: '',
      corps: '',
      variables: []
    });
  };

  const getClientName = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.nom : 'N/A';
  };

  const getOpportuniteTitre = (opportuniteId) => {
    const opportunite = opportunites.find(o => o.id === opportuniteId);
    return opportunite ? opportunite.titre : 'N/A';
  };

  const previewTemplate = (template) => {
    const client = clients.find(c => c.id === sendData.clientId);
    const opportunite = sendData.opportuniteId ? opportunites.find(o => o.id === sendData.opportuniteId) : null;
    
    let preview = template.corps;
    preview = preview.replace(/{{client_nom}}/g, client?.nom || '[Nom client]');
    preview = preview.replace(/{{client_email}}/g, client?.email || '[Email client]');
    preview = preview.replace(/{{opportunite_titre}}/g, opportunite?.titre || '[Titre opportunité]');
    preview = preview.replace(/{{opportunite_montant}}/g, opportunite?.montant ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(opportunite.montant) : '[Montant]');
    
    return preview;
  };

  if (loading) {
    return <div className="card">Chargement...</div>;
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <FiMail style={{ marginRight: '0.5rem' }} />
            Templates d'emails
          </h2>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <FiPlus /> Nouveau template
          </button>
        </div>

        <div className="templates-grid">
          {templates.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', gridColumn: '1 / -1' }}>
              <FiMail style={{ fontSize: '3rem', color: '#ccc', marginBottom: '1rem' }} />
              <p>Aucun template créé</p>
              <button className="btn btn-primary" onClick={() => setShowModal(true)} style={{ marginTop: '1rem' }}>
                Créer votre premier template
              </button>
            </div>
          ) : (
            templates.map((template) => (
              <div key={template.id} className="template-card">
                <div className="template-card-header">
                  <h3>{template.nom}</h3>
                  <div className="template-actions">
                    <button
                      className="btn-icon btn-success"
                      onClick={() => handleSend(template)}
                      title="Envoyer"
                    >
                      <FiSend />
                    </button>
                    <button
                      className="btn-icon"
                      onClick={() => handleEdit(template)}
                      title="Modifier"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      className="btn-icon"
                      onClick={() => handleDelete(template.id)}
                      title="Supprimer"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
                <div className="template-preview">
                  <div className="template-subject">
                    <strong>Sujet :</strong> {template.sujet}
                  </div>
                  <div className="template-body" dangerouslySetInnerHTML={{ __html: template.corps.substring(0, 150) + '...' }} />
                </div>
                {template.variables && template.variables.length > 0 && (
                  <div className="template-variables">
                    <strong>Variables :</strong> {template.variables.join(', ')}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                {editingTemplate ? 'Modifier le template' : 'Nouveau template'}
              </h3>
              <button className="modal-close" onClick={handleCloseModal}>
                <FiX />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nom du template *</label>
                <input
                  type="text"
                  required
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  placeholder="Ex: Relance client"
                />
              </div>
              <div className="form-group">
                <label>Sujet de l'email *</label>
                <input
                  type="text"
                  required
                  value={formData.sujet}
                  onChange={(e) => setFormData({ ...formData, sujet: e.target.value })}
                  placeholder="Ex: Relance - Dossier {{client_nom}}"
                />
                <small>Utilisez {{variable}} pour les variables dynamiques</small>
              </div>
              <div className="form-group">
                <label>Corps de l'email (HTML) *</label>
                <textarea
                  required
                  rows="10"
                  value={formData.corps}
                  onChange={(e) => setFormData({ ...formData, corps: e.target.value })}
                  placeholder="<p>Bonjour {{client_nom}},</p>..."
                />
                <small>Variables disponibles : {{client_nom}}, {{client_email}}, {{opportunite_titre}}, {{opportunite_montant}}</small>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary">
                  <FiSave /> {editingTemplate ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showSendModal && selectedTemplate && (
        <div className="modal-overlay" onClick={() => setShowSendModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Envoyer l'email</h3>
              <button className="modal-close" onClick={() => setShowSendModal(false)}>
                <FiX />
              </button>
            </div>
            <div>
              <div className="form-group">
                <label>Client</label>
                <select
                  value={sendData.clientId}
                  onChange={(e) => {
                    const client = clients.find(c => c.id === e.target.value);
                    setSendData({
                      ...sendData,
                      clientId: e.target.value,
                      destinataire: client?.email || ''
                    });
                  }}
                >
                  <option value="">Sélectionner un client</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.nom} {client.email ? `(${client.email})` : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Opportunité (optionnel)</label>
                <select
                  value={sendData.opportuniteId}
                  onChange={(e) => setSendData({ ...sendData, opportuniteId: e.target.value })}
                >
                  <option value="">Aucune</option>
                  {opportunites
                    .filter(o => !sendData.clientId || o.clientId === sendData.clientId)
                    .map((opportunite) => (
                      <option key={opportunite.id} value={opportunite.id}>
                        {opportunite.titre}
                      </option>
                    ))}
                </select>
              </div>
              <div className="form-group">
                <label>Destinataire *</label>
                <input
                  type="email"
                  required
                  value={sendData.destinataire}
                  onChange={(e) => setSendData({ ...sendData, destinataire: e.target.value })}
                  placeholder="email@exemple.com"
                />
              </div>
              {sendData.clientId && (
                <div className="form-group">
                  <label>Aperçu</label>
                  <div className="email-preview" dangerouslySetInnerHTML={{ __html: previewTemplate(selectedTemplate) }} />
                </div>
              )}
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowSendModal(false)}>
                  Annuler
                </button>
                <button type="button" className="btn btn-primary" onClick={handleSendEmail}>
                  <FiSend /> Envoyer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmailTemplates;

