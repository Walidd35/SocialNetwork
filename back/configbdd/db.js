const { Sequelize } = require('sequelize');
require('dotenv').config({ path: '../.env' });

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: 'localhost', //mettre "mysql" pour tourner docker
  dialect: 'mysql',
  port: 3306,
});



module.exports = sequelize;