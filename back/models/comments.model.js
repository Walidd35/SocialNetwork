const { DataTypes } = require('sequelize');
const sequelize = require('../configbdd/db'); // Ajustez le chemin selon votre structure

const Comments = sequelize.define('Comments', {
  comment_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  post_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
    timestamps: true,
    createdAt: 'created_at',  // Personnalise le nom de la colonne
    updatedAt: 'updated_at',  // Personnalise le nom de la colonne
    tableName: 'Comments'
});

module.exports = Comments;