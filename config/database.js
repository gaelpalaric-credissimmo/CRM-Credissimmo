const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/crm',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    console.log(`✅ MongoDB connecté : ${conn.connection.host}`);
    
    // Créer un utilisateur admin par défaut si aucun n'existe
    const User = require('../models/User');
    const adminExists = await User.findOne({ email: 'admin@crm.com' });
    
    if (!adminExists) {
      const admin = new User({
        nom: 'Admin',
        prenom: 'Système',
        email: 'admin@crm.com',
        password: 'admin123', // À changer immédiatement en production
        role: 'admin'
      });
      await admin.save();
      console.log('👤 Utilisateur admin créé : admin@crm.com / admin123');
    }
    
    return conn;
  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;

