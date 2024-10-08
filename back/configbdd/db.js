// Je charge les variables d'environnement depuis le fichier .env
require('dotenv').config({ path: '../.env' });

const { Sequelize } = require('sequelize');

// Je crée une instance de Sequelize avec les paramètres de connexion
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql', 
  port: process.env.DB_PORT || 3306
});

// Test la connexion grâce a la fonction authenticate
sequelize.authenticate()
  .then(() => {
    console.log('Connexion à la base de données réussie.');
  })
  .catch(err => {
    console.error('Impossible de se connecter à la base de données :', err);
  });

module.exports = sequelize;
