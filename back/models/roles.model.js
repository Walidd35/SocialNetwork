const { DataTypes } = require('sequelize') // J'importe DataTypes depuis Sequelize .
const sequelize = require('../configbdd/db') // J'importe l'instance Sequelize de ma config BDD .

const Roles = sequelize.define('Roles',{
    role_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement:true,
    },
    role_name: { 
        type:DataTypes.STRING,
        allowNull: false, 
    },
},{
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "uptdated_at"
});

module.exports = Roles;