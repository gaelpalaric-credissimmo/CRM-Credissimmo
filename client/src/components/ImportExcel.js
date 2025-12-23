import React, { useState } from 'react';
import { FiUpload, FiDownload, FiCheckCircle, FiXCircle, FiFile } from 'react-icons/fi';
import { importExcel, downloadTemplate } from '../api/api';
import './ImportExcel.css';

function ImportExcel() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Vérifier le type de fichier
      const allowedTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'application/vnd.ms-excel.sheet.macroEnabled.12'
      ];

      if (!allowedTypes.includes(selectedFile.type)) {
        setError('Format de fichier non supporté. Utilisez .xlsx, .xls ou .xlsm');
        setFile(null);
        return;
      }

      // Vérifier la taille (max 10 MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('Le fichier est trop volumineux. Taille maximale : 10 MB');
        setFile(null);
        return;
      }

      setFile(selectedFile);
      setError(null);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Veuillez sélectionner un fichier');
      return;
    }

    setUploading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await importExcel(formData);
      setResult(response.data);
      setFile(null);
      
      // Réinitialiser l'input file
      const fileInput = document.getElementById('file-input');
      if (fileInput) fileInput.value = '';

      // Recharger la page après 3 secondes pour voir les nouvelles données
      setTimeout(() => {
        window.location.reload();
      }, 3000);

    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Erreur lors de l\'import');
      console.error('Erreur import:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const response = await downloadTemplate();
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'template-import-crm.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Erreur lors du téléchargement du template: ' + (err.message || 'Erreur inconnue'));
      console.error('Erreur template:', err);
    }
  };

  return (
    <div className="import-excel-container">
      <div className="card">
        <h2 className="card-title">Import Excel</h2>
        <p className="card-subtitle">
          Importez vos clients, apporteurs et courtiers depuis un fichier Excel
        </p>

        {/* Instructions */}
        <div className="import-instructions">
          <h3>Format du fichier Excel</h3>
          <p>Votre fichier Excel doit contenir les colonnes suivantes :</p>
          <ul>
            <li><strong>Client</strong> : Nom complet du client (obligatoire)</li>
            <li><strong>Ville</strong> ou <strong>Localisation</strong> : Ville du client</li>
            <li><strong>Apporteur</strong> : Nom de l'apporteur d'affaires</li>
            <li><strong>Courtier</strong> : Nom du courtier en charge</li>
            <li><strong>Email</strong> : Email du client (optionnel)</li>
            <li><strong>Téléphone</strong> : Téléphone du client (optionnel)</li>
            <li><strong>Étape</strong> : Étape du dossier (optionnel)</li>
            <li><strong>Décision</strong> : Décision (optionnel)</li>
            <li><strong>Notes</strong> : Commentaires (optionnel)</li>
          </ul>
          <p className="note">
            💡 <strong>Astuce</strong> : Les colonnes peuvent être dans n'importe quel ordre.
            Les noms de colonnes sont insensibles à la casse (Client = client = CLIENT).
          </p>
        </div>

        {/* Télécharger le template */}
        <div className="template-section">
          <button
            onClick={handleDownloadTemplate}
            className="btn btn-secondary"
            type="button"
          >
            <FiDownload /> Télécharger le template Excel
          </button>
        </div>

        {/* Upload */}
        <div className="upload-section">
          <div className="file-input-wrapper">
            <input
              id="file-input"
              type="file"
              accept=".xlsx,.xls,.xlsm"
              onChange={handleFileChange}
              className="file-input"
            />
            <label htmlFor="file-input" className="file-label">
              <FiUpload /> Choisir un fichier Excel
            </label>
          </div>

          {file && (
            <div className="file-info">
              <FiFile /> {file.name} ({(file.size / 1024).toFixed(2)} KB)
            </div>
          )}

          {error && (
            <div className="error-message">
              <FiXCircle /> {error}
            </div>
          )}

          {result && (
            <div className="success-message">
              <FiCheckCircle /> {result.message}
              {result.results && (
                <div className="results-details">
                  <p>✅ {result.results.clients.created} clients créés</p>
                  <p>🔄 {result.results.clients.updated} clients mis à jour</p>
                  <p>👥 {result.results.apporteurs.created} apporteurs créés</p>
                  {result.results.clients.errors.length > 0 && (
                    <div className="errors-list">
                      <p><strong>Erreurs :</strong></p>
                      <ul>
                        {result.results.clients.errors.map((err, idx) => (
                          <li key={idx}>{err}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="btn btn-primary btn-upload"
          >
            {uploading ? (
              <>⏳ Import en cours...</>
            ) : (
              <>
                <FiUpload /> Importer le fichier
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ImportExcel;

