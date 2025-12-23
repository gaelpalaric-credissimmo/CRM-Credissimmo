const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
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
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['admin', 'commercial', 'manager'],
    default: 'commercial'
  },
  telephone: {
    type: String,
    trim: true
  },
  equipe: {
    type: String,
    trim: true
  },
  actif: {
    type: Boolean,
    default: true
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

// Hash du mot de passe avant sauvegarde
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Méthode pour comparer les mots de passe
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Mettre à jour dateModification avant chaque update
userSchema.pre(['updateOne', 'findOneAndUpdate'], function(next) {
  this.set({ dateModification: new Date() });
  next();
});

module.exports = mongoose.model('User', userSchema);

