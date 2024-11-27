const { DataTypes } = require('sequelize') // J'importe DataTypes depuis Sequelize .
const sequelize  = require('../configbdd/db');// J'importe une instance de ma config bdd .
 

// La fonction define permet de définir un modèle représentant une table SQL .
const Posts = sequelize.define('Posts', { 
      post_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      title: {
        type: DataTypes.STRING(255), // Je limite à 255 caractères pour le titre .
        allowNull: false,
       },
       description: {
        type: DataTypes.TEXT, // J'utilise DataTypes.TEXT pour des desriptions longues .
        allowNull: false
       },
       user_id: { // Ajout du champ user_id dans le modèle
        type: DataTypes.INTEGER,
        allowNull: true, // Correspond à "YES" dans votre schéma
        references: {
            model: 'Users', // Nom de la table des utilisateurs
            key: 'user_id', // Nom de la clé primaire dans Users
        },
}}
,{
    timestamps: true, 
    createdAt: 'created_at',
    updatedAt: 'uptdated_at'
});

module.exports = Posts;