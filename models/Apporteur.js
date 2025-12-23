const mongoose = require('mongoose');

const apporteurSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    trim: true
  },
  prenom: {
    type: String,
    required: true,
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
  commission: {
    type: Number,
    default: 0
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

apporteurSchema.pre(['updateOne', 'findOneAndUpdate'], function(next) {
  this.set({ dateModification: new Date() });
  next();
});

module.exports = mongoose.model('Apporteur', apporteurSchema);

