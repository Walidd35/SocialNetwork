const sequelize = require("../configbdd/db");
const { Model, DataTypes } = require("sequelize");

class Roles extends Model {}

Roles.init(
  {
    role_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    role_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Roles",
  }
);

module.exports = Roles;
