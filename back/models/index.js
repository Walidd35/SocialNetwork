const { Sequelize } = require("sequelize");
require("dotenv").config({ path: "../.env" });

// Create Sequelize instance
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    port: process.env.DB_PORT || 3306,
  }
);

// Import models
const User = require("./users.model");
const Roles = require("./roles.model");
const Posts = require("./posts.model");
const Comments = require("./comments.model");

// Define associations
Roles.belongsToMany(User, {
  through: "user_roles",
  foreignKey: "role_id",
  otherKey: "user_id",
});

User.belongsToMany(Roles, {
  through: "user_roles",
  foreignKey: "user_id",
  otherKey: "role_id",
  as: "roles",
});

User.hasMany(Posts, { foreignKey: "user_id" });
User.hasMany(Comments, { foreignKey: "user_id" });

Posts.belongsTo(User, { foreignKey: "user_id" });
Posts.hasMany(Comments, { foreignKey: "post_id" });

Comments.belongsTo(User, { foreignKey: "user_id" });
Comments.belongsTo(Posts, { foreignKey: "post_id" });

const ROLES = ["user", "admin"];

module.exports = {
  sequelize,
  User,
  Posts,
  Comments,
  Roles,
  ROLES,
};
