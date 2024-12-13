const { DataTypes } = require("sequelize"); 
const sequelize = require("../configbdd/db"); 

// La fonction define permet de définir un modèle représentant une table 
const Posts = sequelize.define(
  "Posts",
  {
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING(255), 
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT, // J'utilise TEXT pour des desriptions longues 
      allowNull: false,
    },
    user_id: {
  
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users", 
        key: "user_id", 
      },
    },
    createdAt: { field: "created_at", type: DataTypes.DATE }, 
    updatedAt: { field: "updated_at", type: DataTypes.DATE },
  },
  {
    timestamps: true,
  }
);

module.exports = Posts;
