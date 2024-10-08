const { DataTypes } = require('sequelize'); // J'importe les DataTypes depuis Sequelize .
const sequelize = require('../configbdd/db');

// La fonction define appartient au package Sequelize. Elle permet de définir un modèle représentant une table SQL.
const Comments = sequelize.define('Comments', {
    comment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true 
    },
    content: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
},
 {
    timestamps: true,
    underscrored: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
 }
);

module.exports = Comments;
