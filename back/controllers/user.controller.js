const config = require('../configbdd/db');
const { User, Roles: Role } = require('../models/index'); 
const { sequelize } = require('../models/index');
const Op = sequelize.Sequelize.Op;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const safetyKeyJwt = process.env.JWT_SECRET;


exports.deleteUser = async (req, res) => {
    const userId = req.params.id;
    try {
        const deleteResult = await User.destroy({ where: { user_id: userId } });
        if (deleteResult === 0) {
            return res.status(404).send({ message: 'Utilisateur non trouvé' });
        }
        res.status(200).send({ message: 'Utilisateur supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.signup = async (req, res) => {
    try {
        // Vérifie si l'email existe déjà
        const existingUser = await User.findOne({ where: { email: req.body.email } });
        if (existingUser) {
            return res.status(400).send({ message: "Cet email est déjà utilisé." });
        }

        // Vérifie si le username existe déjà
        let username = req.body.username;
        const existingUsername = await User.findOne({ where: { username } });
        if (existingUsername) {
            // Génère un nouveau username en ajoutant un suffixe unique
            const randomSuffix = Math.floor(Math.random() * 10000); // Suffixe aléatoire
            username = `${username}_${randomSuffix}`;
        }

        // Hashage du mot de passe
        const hashedPassword = await bcrypt.hash(req.body.password, 8);

        // Création de l'utilisateur
        const user = await User.create({
            username: username,
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
            res.send({ message: `Utilisateur ${username} enregistré avec succès avec le rôle spécifié.`,roles });
        } else {
            // Assigner un rôle par défaut
            const defaultRole = await Role.findOne({ where: { role_name: 'user' } });
            if (!defaultRole) {
                return res.status(403).send({ message: "Le rôle par défaut n'existe pas." });
            }
            await user.setRoles([defaultRole.role_id]);
            res.send({ message: `Utilisateur ${username} enregistré avec succès avec le rôle par défaut.` });
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
        where: { email: req.body.email },
        include: [{ model: Role, as: 'roles' }]
      });
  
      if (!user) {
        return res.status(400).send({ message: 'Identifiants incorrects' });
      }
  
      const validPassword = await bcrypt.compare(req.body.password, user.password);
      if (!validPassword) {
        return res.status(400).send({ message: 'Identifiants incorrects' });
      }
  
      const token = jwt.sign(
        { userId: user.user_id, roles: user.roles.map(role => role.role_name) },
        safetyKeyJwt,
        { expiresIn: '1h' }
      );
  
      res.json({ message: 'Connexion réussie', token: token });
    } catch (error) {
      console.error('Erreur login:', error);
      res.status(500).json({ error: error.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateUser = async (req, res) => {
    const userId = req.params.id;

    try {
        // Vérifie si l'utilisateur existe
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).send({ message: 'Utilisateur non trouvé' });
        }

        // Données à mettre à jour
        const { username, email, password, roles } = req.body;

        // Mise à jour des informations de l'utilisateur
        if (username) user.username = username;
        if (email) user.email = email;
        if (password) {
            user.password = await bcrypt.hash(password, 8);
        }

        // Enregistrer les modifications de l'utilisateur
        await user.save();

        // Gestion des rôles si fourni
        if (roles && Array.isArray(roles)) {
            const roleInstances = await Role.findAll({
                where: {
                    role_name: {
                        [Op.or]: roles,
                    },
                },
            });

            // Vérifie si tous les rôles demandés existent
            if (roleInstances.length !== roles.length) {
                return res.status(400).send({ message: 'Certains rôles sont invalides.' });
            }

            // Met à jour les rôles de l'utilisateur
            await user.setRoles(roleInstances);
        }

        res.status(200).send({ message: 'Utilisateur mis à jour avec succès', user });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.getUserById = async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).send({ message: 'Utilisateur non trouvé' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

