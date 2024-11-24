const config = require('../configbdd/db');
// const User = require('../models/users.model');
const { User, Roles: Role } = require('../models/index'); // ou le chemin vers votre fichier d'associations

const Op = config.Sequelize.Op;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const safetyKeyJwt = process.env.JWT_SECRET;


exports.deleteUserById = async (req, res) => {
    const userIdToDelete = req.params.id;  // Récupère l'ID dans l'URL
    console.log(`User ID reçu pour suppression: ${userIdToDelete}`);  // Affiche l'ID dans les logs

    try {
        // Vérifie si l'utilisateur existe avant de le supprimer
        const user = await User.findOne({ where: { user_id: userIdToDelete } });
        if (!user) {
            console.log("Utilisateur non trouvé");
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        // Supprime l'utilisateur
        const deleteUser = await User.destroy({ where: { user_id: userIdToDelete } });
        console.log(`Suppression effectuée: ${deleteUser}`);

        if (deleteUser) {
            return res.status(200).json({message: "Utilisateur supprimer avec succès"}); 
        } else {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
    } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        return res.status(500).json({ error: error.message });
    }
};

exports.signup = async (req, res) => {
    try {
        // Vérifie si l'email existe déjà
        const existingUser = await User.findOne({ where: { email: req.body.email } });
        if (existingUser) {
            return res.status(400).send({ message: "Cet email est déjà utilisé." });
        }

        // Hashage du mot de passe
        const hashedPassword = await bcrypt.hash(req.body.password, 8);

        // Création de l'utilisateur
        const user = await User.create({
            username:req.body.username,
            email: req.body.email,
            password: hashedPassword,
        });

        console.log("Utilisateur créé:", user);

        // Gestion des rôles
        if (req.body.roles) {
            const roles = await Role.findAll({
                where: {
                    role_name: {
                        [Op.or]: req.body.roles,
                    },
                },
            });
            await user.setRoles(roles);
            res.send({ message: `Utilisateur ${req.body.email} enregistré avec succès avec les rôles spécifiés.` });
        } else {
            // Assigner un rôle par défaut
            const defaultRole = await Role.findOne({ where: { role_name: 'user' } });
            if (!defaultRole) {
                return res.status(400).send({ message: "Le rôle par défaut n'existe pas." });
            }
            await user.setRoles([defaultRole.role_id]);
            res.send({ message: `Utilisateur ${req.body.email} enregistré avec succès avec le rôle par défaut.` });
        }
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            res.status(400).send({ message: "Cet email est déjà utilisé." });
        } else {
            console.error("Erreur lors de l'inscription:", err);
            res.status(500).send({ message: "Une erreur est survenue lors de l'inscription." });
        }
    }
};

exports.login = async (req, res) => {
    try {
        const user = await User.findOne({
            where: { email: req.body.email },  // Par exemple, si tu utilises l'email pour rechercher l'utilisateur
            include: [{
                model: Role,
                as: 'roles'  // Assure-toi que cet alias est utilisé pour l'association
            }]
        });
        
console.log(user)
        if (!user) {
            return res.status(401).json({ message: 'Utilisateur non trouvé !' });
        }

        // Vérification du mot de passe
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Mot de passe incorrect' });
        }

        // Extraction des rôles
        const userRoles = user.roles.map(role => role.role_name);

        // Création du token avec l'userId et les rôles
        const token = jwt.sign(
            { userId: user.user_id, roles: userRoles },
            safetyKeyJwt,
            { expiresIn: '1h' }
        );

        // Retour du token dans la réponse
        res.status(200).json({
            userId: user.user_id,
            roles: userRoles,
            token: token
        });
    } catch (error) {
        console.error('Erreur login:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.getAll = async (req, res) => {
    console.log('Requête reçue pour obtenir tous les utilisateurs'); // Log initial
    try {
        const showUser = await User.findAll(); // Récupération des utilisateurs
        console.log(`Nombre d'utilisateurs récupérés: ${showUser.length}`); // Log le nombre d'utilisateurs

        // Si showUser est vide, log supplémentaire
        if (showUser.length === 0) {
            console.log('Aucun utilisateur trouvé dans la base de données.');
        } else {
            console.log('Utilisateurs:', JSON.stringify(showUser, null, 2)); 
        }

        res.status(200).json(showUser); 
        console.log('Réponse envoyée'); 
    } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs:", error); // Log l'erreur
        res.status(500).json({ error: error.message }); // Renvoie une réponse d'erreur
    }
};

exports.getById = async (req, res) => {
    console.log('Requête reçue pour obtenir un utilisateur via son ID:', req.params.id); // Log l'ID reçu
    try {
        // Vérifie que l'ID est bien passé dans la requête
        if (!req.params.id) {
            console.error('ID manquant dans la requête');
            return res.status(400).json({ error: 'ID manquant' });
        }

        console.log('Recherche de l\'utilisateur avec ID:', req.params.id);
        const showOneUser = await User.findByPk(req.params.id);
        console.log(showOneUser); 
        // Vérifie si un utilisateur a été trouvé
        if (showOneUser) {
            console.log(`Utilisateur trouvé:`, showOneUser);
            return res.status(200).json(showOneUser);
        } else {
            console.warn('Utilisateur non trouvé avec cet ID:', req.params.id);
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
        return res.status(500).json({ error: error.message });
    }
};

