const mongoose = require('mongoose');

const opportuniteSchema = new mongoose.Schema({
  numero: {
    type: String,
    unique: true,
    trim: true
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    default: null
  },
  prospectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prospect',
    default: null
  },
  commercialId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  apporteurId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Apporteur',
    default: null
  },
  montant: {
    type: Number,
    default: 0
  },
  statut: {
    type: String,
    enum: [
      'prise_contact',
      'qualification',
      'recherche_financement',
      'instruction_bancaire',
      'accord_principe',
      'signature',
      'facturation',
      'annulee'
    ],
    default: 'prise_contact'
  },
  priorite: {
    type: String,
    enum: ['basse', 'normale', 'haute', 'urgente'],
    default: 'normale'
  },
  dateCreation: {
    type: Date,
    default: Date.now
  },
  dateEcheance: {
    type: Date,
    default: null
  },
  dateDerniereRelance: {
    type: Date,
    default: null
  },
  notes: {
    type: String,
    trim: true
  },
  dateModification: {
    type: Date,
    default: Date.now
  }
});

opportuniteSchema.pre('save', function(next) {
  if (!this.numero) {
    this.numero = `OPP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  next();
});

opportuniteSchema.pre(['updateOne', 'findOneAndUpdate'], function(next) {
  this.set({ dateModification: new Date() });
  next();
});

module.exports = mongoose.model('Opportunite', opportuniteSchema);

