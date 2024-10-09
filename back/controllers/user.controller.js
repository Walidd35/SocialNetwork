const config = require('../configbdd/db');
const User = require('../models/users.model');
const Role = require('../models/roles.model');

const Op = config.Sequelize.Op;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.allAccess = async (req, res) => {
    res.status(200).send('public content');
};

exports.userBoard = async (req, res) => {
    res.status(200).send('User content');
};

exports.adminBoard = (req, res) => {
    res.status(200).send('Admin content');
};

exports.deleteUser = async (req, res) => {
    const user_id = req.params.id;

    try {
        const user = await User.findByPk(user_id);
        if (!user) {
            return res.status(404).send({
                message: `Utilisateur avec l'id=${user_id} n'existe pas.`,
            });
        }

        const num = await User.destroy({
            where: { user_id: user_id },
        });

        if (num === 1) {
            res.send({
                message: "Utilisateur supprimé avec succès !",
            });
        } else {
            res.send({
                message: `Ne peut être supprimé avec cet id=${user_id}.`,
            });
        }
    } catch (err) {
        res.status(500).send({
            message: "Erreur lors de la suppression de l'utilisateur avec l'id=" + user_id,
        });
    }
};

exports.signup = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 8);
        const user = await User.create({
            email: req.body.email,
            password: hashedPassword,
        });

        // Vérifie si des rôles sont spécifiés
        if (req.body.roles) {
            const roles = await Role.findAll({
                where: {
                    role_name: {
                        [Op.or]: req.body.roles,
                    },
                },
            });
            await user.setRoles(roles);
            res.send({ message: `Utilisateur ${req.body.email} enregistré avec succès` });
        } else {
            // Assigne le rôle par défaut
            const defaultRole = await Role.findOne({ where: { role_name: 'user' } }); // Change 'user' par le rôle par défaut
            if (!defaultRole) {
                return res.status(400).send({ message: "Le rôle par défaut n'existe pas." });
            }
            await user.setRoles([defaultRole.role_id]);
            res.send({ message: "Utilisateur enregistré avec succès !" });
        }
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};
