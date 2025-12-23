const mongoose = require('mongoose');

const emailTemplateSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    trim: true
  },
  sujet: {
    type: String,
    required: true,
    trim: true
  },
  corps: {
    type: String,
    required: true
  },
  variables: [{
    type: String,
    trim: true
  }],
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

emailTemplateSchema.pre(['updateOne', 'findOneAndUpdate'], function(next) {
  this.set({ dateModification: new Date() });
  next();
});

module.exports = mongoose.model('EmailTemplate', emailTemplateSchema);

