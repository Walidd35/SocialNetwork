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
            return res.status(204).json({message: "Utilisateur supprimer avec succès"}); 
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
        const hashedPassword = await bcrypt.hash(req.body.password, 8);
        const user = await User.create({
            email: req.body.email,
            password: hashedPassword,
        });

        console.log("Utilisateur créé:", user); // Log pour voir l'utilisateur créé

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
            const defaultRole = await Role.findOne({ where: { role_name: 'user' } }); 
            if (!defaultRole) {
                return res.status(400).send({ message: "Le rôle par défaut n'existe pas." });
            }
            await user.setRoles([defaultRole.role_id]);
            res.send({ message: "Utilisateur enregistré avec succès !" });
        }
    } catch (err) {
        console.error("Erreur lors de l'inscription:", err); // Log pour afficher l'erreur
        res.status(500).send({ message: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Recherche de l'utilisateur par email
        const user = await User.findOne({ where: { email } });

        console.log("Utilisateur trouvé:", user);

        if (!user) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect !' });
        }

        // Vérification du mot de passe
        const passwordCorrect = await bcrypt.compare(password, user.password);

        console.log("Mot de passe haché de l'utilisateur:", user.password);

        if (!passwordCorrect) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect !' });
        }

        // Génération du token JWT
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'safetyKeyJwt', { expiresIn: '168h' });

        return res.status(200).json({ token });
    } 
    catch (error) {
        console.error("Erreur lors de la connexion:", error);
        return res.status(500).json({ error: error.message });
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

        res.status(200).json(showUser); // Renvoie la liste des utilisateurs
        console.log('Réponse envoyée'); // Log après avoir envoyé la réponse
    } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs:", error); // Log l'erreur
        res.status(500).json({ error: error.message }); // Renvoie une réponse d'erreur
    }
};
