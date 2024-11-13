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


    // Relation avec Posts : Un utilisateur peut avoir plusieurs publications
User.hasMany(Posts, { foreignKey: 'user_id' });

// Relation avec Comments : Un utilisateur peut avoir plusieurs commentaires
User.hasMany(Comments, { foreignKey: 'user_id' });

// Relation avec User : Une publication appartient à un utilisateur
Posts.belongsTo(User, { foreignKey: 'user_id' });

// Relation avec Comments : Une publication peut avoir plusieurs commentaires
Posts.hasMany(Comments, { foreignKey: 'post_id' });

// Relation avec User : Un commentaire appartient à un utilisateur
Comments.belongsTo(User, { foreignKey: 'user_id' });

// Relation avec Post : Un commentaire appartient à une publication
Comments.belongsTo(Posts, { foreignKey: 'post_id' });


//  // Liaison User à Posts (ONE-TO-MANY)
//  Posts.belongsTo(User, { foreignKey: 'user_id' });

//  // Liaison User à Comments (ONE-TO-MANY)
//  Comments.belongsTo(User, { foreignKey: 'user_id' });

//  // Liaison Posts à Comments (ONE-TO-MANY)
//  Comments.belongsTo(Posts, { foreignKey: 'post_id' });

 ROLES = ["user","admin"];

 

 module.exports = { User, Posts, Comments, Roles, ROLES};