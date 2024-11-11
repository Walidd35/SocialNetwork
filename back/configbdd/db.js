// Je charge les variables d'environnement depuis le fichier .env
require('dotenv').config({ path: '../.env' });

const { Sequelize } = require('sequelize');

// Je crée une instance de Sequelize avec les paramètres de connexion
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql', 
  port: process.env.DB_PORT || 3306
});

module.exports = sequelize;
