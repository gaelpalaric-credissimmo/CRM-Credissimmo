const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    trim: true
  },
  prenom: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  telephone: {
    type: String,
    trim: true
  },
  entreprise: {
    type: String,
    trim: true
  },
  adresse: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  apporteurId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Apporteur',
    default: null
  },
  apporteurNom: {
    type: String,
    trim: true
  },
  etape: {
    type: String,
    trim: true
  },
  courtier: {
    type: String,
    trim: true
  },
  decision: {
    type: String,
    trim: true
  },
  commercialId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  dateCreation: {
    type: Date,
    default: Date.now
  },
  dateModification: {
    type: Date,
    default: Date.now
  }
});

clientSchema.pre(['updateOne', 'findOneAndUpdate'], function(next) {
  this.set({ dateModification: new Date() });
  next();
});

module.exports = mongoose.model('Client', clientSchema);

