const dbConfig = require('../configbdd/db');
const sequelize = require('sequelize');

const User = require('../models/users.model');
const Roles = require('../models/roles.model');
const Posts = require('../models/posts.model');
const Comments = require('../models/comments.model');

// Liaison Role à User (MANY-TO-MANY)

Roles.belongsToMany(User, {
    through: "user_roles",
    foreignKey: "role_id",
    otherKey: "user_id"
    });
User.belongsToMany(Roles, {
    through: "user_roles",
    foreignKey: "user_id",
    otherKey: "role_id",
    as: "roles"
    });

 // Liaison User à Posts (ONE-TO-MANY)
 Posts.belongsTo(User, { foreignKey: 'user_id' });

 // Liaison User à Comments (ONE-TO-MANY)
 Comments.belongsTo(User, { foreignKey: 'user_id' });

 // Liaison Posts à Comments (ONE-TO-MANY)
 Comments.belongsTo(Posts, { foreignKey: 'post_id' });

 ROLES = ["user","admin"];

 

 module.exports = { User, Posts, Comments, Roles, ROLES};