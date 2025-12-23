const mongoose = require('mongoose');

const rappelSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ['relance', 'rdv', 'appel', 'email', 'autre'],
    default: 'relance'
  },
  priorite: {
    type: String,
    enum: ['basse', 'normale', 'haute', 'urgente'],
    default: 'normale'
  },
  dateRappel: {
    type: Date,
    required: true
  },
  resolu: {
    type: Boolean,
    default: false
  },
  dateResolution: {
    type: Date,
    default: null
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
  opportuniteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Opportunite',
    default: null
  },
  commercialId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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

rappelSchema.pre(['updateOne', 'findOneAndUpdate'], function(next) {
  this.set({ dateModification: new Date() });
  next();
});

module.exports = mongoose.model('Rappel', rappelSchema);

