//la constante DataTypes est utilisée pour définir les types de données dans les modèles de la base de données .

const { DataTypes } = require('sequelize') // J'importe les datatypes depuis Sequelize .
const sequelize = require('../configbdd/db') // J'importe l'instance Sequelize . 

// La fonction define appartient au package Sequelize. Elle permet de définir un modèle représentant une table SQL .
const User = sequelize.define('User',{
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    tableName: 'User',
    timestamps: false
});

module.exports = User;